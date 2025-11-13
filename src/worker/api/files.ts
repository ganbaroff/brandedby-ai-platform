import { Hono } from "hono";
import { authMiddleware } from "@getmocha/users-service/backend";
import { 
  formatErrorResponse, 
  UnauthorizedError, 
  FileUploadError,
  NotFoundError,
  ForbiddenError,
} from "@/shared/errors";
import { 
  validateFileSize, 
  validateFileType, 
  ALLOWED_IMAGE_TYPES,
  MAX_FILE_SIZE_MB,
  sanitizeString,
} from "@/shared/validation";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

const uploadSchema = z.object({
  type: z.enum(['selfie', 'location', 'additional_character']),
});

export const files = new Hono<{ Bindings: Env }>();

// Upload file to R2
files.post("/upload", authMiddleware, zValidator('form', uploadSchema), async (c) => {
  try {
    const user = c.get("user");
    if (!user) {
      throw new UnauthorizedError();
    }

    const formData = await c.req.formData();
    const file = formData.get('file');
    const { type } = c.req.valid('form');

    if (!file || !(file instanceof File)) {
      throw new FileUploadError('No file provided');
    }

    // Validate file type
    try {
      validateFileType(file.type, ALLOWED_IMAGE_TYPES);
    } catch (error) {
      throw new FileUploadError(
        `Invalid file type. Allowed types: ${ALLOWED_IMAGE_TYPES.join(', ')}`,
        { fileType: file.type }
      );
    }

    // Validate file size
    try {
      validateFileSize(file.size, MAX_FILE_SIZE_MB);
    } catch (error) {
      throw new FileUploadError(
        `File size exceeds maximum allowed size of ${MAX_FILE_SIZE_MB}MB`,
        { fileSize: file.size, maxSize: MAX_FILE_SIZE_MB * 1024 * 1024 }
      );
    }

    // Generate unique key with better sanitization
    const timestamp = Date.now();
    const sanitizedFileName = sanitizeString(file.name).replace(/[^a-zA-Z0-9.-]/g, '_');
    const key = `${type}s/${user.google_sub || user.id}/${timestamp}-${sanitizedFileName}`;

    // Upload to R2
    const arrayBuffer = await file.arrayBuffer();
    await c.env.R2_BUCKET.put(key, arrayBuffer, {
      httpMetadata: {
        contentType: file.type,
      },
      customMetadata: {
        userId: user.google_sub || user.id.toString(),
        originalName: sanitizeString(file.name),
        uploadedAt: new Date().toISOString(),
        fileType: type,
      }
    });

    // Return the file URL (using the download endpoint)
    const fileUrl = `/api/files/download/${encodeURIComponent(key)}`;

    return c.json({
      success: true,
      data: {
        url: fileUrl,
        key: key,
        size: file.size,
        type: file.type,
      }
    });
  } catch (error) {
    const errorResponse = formatErrorResponse(error);
    const statusCode = error instanceof Error && 'statusCode' in error 
      ? (error as { statusCode: number }).statusCode 
      : 500;
    return c.json(errorResponse, statusCode);
  }
});

// Download file from R2
files.get("/download/:key{.+}", async (c) => {
  try {
    const key = decodeURIComponent(c.req.param("key"));
    
    // Basic key validation to prevent path traversal
    if (key.includes('..') || key.startsWith('/')) {
      throw new FileUploadError('Invalid file key');
    }
    
    const object = await c.env.R2_BUCKET.get(key);
    
    if (!object) {
      throw new NotFoundError('File', key);
    }

    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set("etag", object.httpEtag);
    headers.set("Cache-Control", "public, max-age=31536000, immutable");
    
    return c.body(object.body, { headers });
  } catch (error) {
    const errorResponse = formatErrorResponse(error);
    const statusCode = error instanceof Error && 'statusCode' in error 
      ? (error as { statusCode: number }).statusCode 
      : 500;
    return c.json(errorResponse, statusCode);
  }
});

// Delete file from R2
files.delete("/:key{.+}", authMiddleware, async (c) => {
  try {
    const user = c.get("user");
    if (!user) {
      throw new UnauthorizedError();
    }

    const key = decodeURIComponent(c.req.param("key"));
    
    // Basic key validation to prevent path traversal
    if (key.includes('..') || key.startsWith('/')) {
      throw new FileUploadError('Invalid file key');
    }
    
    // Verify the file belongs to the user
    const object = await c.env.R2_BUCKET.head(key);
    
    if (!object) {
      throw new NotFoundError('File', key);
    }

    const userId = user.google_sub || user.id.toString();
    if (object.customMetadata?.userId !== userId) {
      throw new ForbiddenError('You do not have permission to delete this file');
    }

    await c.env.R2_BUCKET.delete(key);

    return c.json({ 
      success: true,
      message: 'File deleted successfully'
    });
  } catch (error) {
    const errorResponse = formatErrorResponse(error);
    const statusCode = error instanceof Error && 'statusCode' in error 
      ? (error as { statusCode: number }).statusCode 
      : 500;
    return c.json(errorResponse, statusCode);
  }
});
