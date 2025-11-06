import { Hono } from "hono";
import { authMiddleware } from "@getmocha/users-service/backend";

export const files = new Hono<{ Bindings: Env }>();

// Upload file to R2
files.post("/upload", authMiddleware, async (c) => {
  try {
    const user = c.get("user");
    if (!user) {
      return c.json({ error: 'Not authenticated' }, 401);
    }

    const formData = await c.req.formData();
    const file = formData.get('file') as File;
    const fileType = formData.get('type') as string; // 'selfie' or 'location'

    if (!file) {
      return c.json({ error: 'No file provided' }, 400);
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return c.json({ error: 'Only image files are allowed' }, 400);
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return c.json({ error: 'File size must be less than 10MB' }, 400);
    }

    // Generate unique key
    const timestamp = Date.now();
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const key = `${fileType}s/${user.id}/${timestamp}-${sanitizedFileName}`;

    // Upload to R2
    const arrayBuffer = await file.arrayBuffer();
    await c.env.R2_BUCKET.put(key, arrayBuffer, {
      httpMetadata: {
        contentType: file.type,
      },
      customMetadata: {
        userId: user.id,
        originalName: file.name,
        uploadedAt: new Date().toISOString(),
      }
    });

    // Return the file URL (using the download endpoint)
    const fileUrl = `/api/files/download/${encodeURIComponent(key)}`;

    return c.json({
      success: true,
      url: fileUrl,
      key: key,
      size: file.size,
      type: file.type,
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return c.json({ error: 'Failed to upload file' }, 500);
  }
});

// Download file from R2
files.get("/download/:key{.+}", async (c) => {
  try {
    const key = c.req.param("key");
    
    const object = await c.env.R2_BUCKET.get(key);
    
    if (!object) {
      return c.json({ error: 'File not found' }, 404);
    }

    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set("etag", object.httpEtag);
    
    return c.body(object.body, { headers });
  } catch (error) {
    console.error('Error downloading file:', error);
    return c.json({ error: 'Failed to download file' }, 500);
  }
});

// Delete file from R2
files.delete("/:key{.+}", authMiddleware, async (c) => {
  try {
    const user = c.get("user");
    if (!user) {
      return c.json({ error: 'Not authenticated' }, 401);
    }

    const key = c.req.param("key");
    
    // Verify the file belongs to the user
    const object = await c.env.R2_BUCKET.head(key);
    
    if (!object) {
      return c.json({ error: 'File not found' }, 404);
    }

    if (object.customMetadata?.userId !== user.id) {
      return c.json({ error: 'Unauthorized' }, 403);
    }

    await c.env.R2_BUCKET.delete(key);

    return c.json({ success: true });
  } catch (error) {
    console.error('Error deleting file:', error);
    return c.json({ error: 'Failed to delete file' }, 500);
  }
});
