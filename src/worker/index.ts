import { Celebrity, CelebritySchema } from "@/shared/types";
import { formatErrorResponse, DatabaseError } from "@/shared/errors";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { auth } from "./api/auth";
import { files } from "./api/files";
import { payments } from "./api/payments";
import { projects } from "./api/projects";
import { stripe } from "./api/stripe";

const app = new Hono<{ Bindings: Env }>();

// API routes
app.route('/api/oauth', auth);
app.route('/api/users', auth);
app.route('/api/payments', payments);
app.route('/api/projects', projects);
app.route('/api/files', files);
app.route('/api/stripe', stripe);

// Enable CORS
app.use("*", cors());

// API Routes

// Get all celebrities
app.get("/api/celebrities", async (c) => {
  try {
    const db = c.env.DB;
    const result = await db.prepare(`
      SELECT * FROM celebrities 
      ORDER BY popularity DESC, rating DESC
    `).all();

    const celebrities = result.results.map((row: unknown) => {
      try {
        return CelebritySchema.parse(row);
      } catch (error) {
        // Log validation errors but don't fail the entire request
        if (error instanceof Error) {
          console.error("Failed to parse celebrity:", error.message, row);
        }
        return null;
      }
    }).filter((celebrity: Celebrity | null): celebrity is Celebrity => celebrity !== null);

    return c.json({
      success: true,
      data: celebrities
    });
  } catch (error) {
    console.error("Error fetching celebrities:", error);
    return c.json({
      success: false,
      error: "Failed to fetch celebrities"
    }, 500);
  }
});

// Get single celebrity by ID
app.get("/api/celebrities/:id", async (c) => {
  try {
    const idParam = c.req.param("id");
    const id = Number.parseInt(idParam, 10);
    
    if (Number.isNaN(id) || id <= 0) {
      return c.json({
        success: false,
        error: "Invalid celebrity ID"
      }, 400);
    }
    
    const db = c.env.DB;
    const result = await db.prepare(`
      SELECT * FROM celebrities WHERE id = ?
    `).bind(id).first();

    if (!result) {
      return c.json({
        success: false,
        error: "Celebrity not found"
      }, 404);
    }

    try {
      const celebrity = CelebritySchema.parse(result);
      return c.json({
        success: true,
        data: celebrity
      });
    } catch (parseError) {
      throw new DatabaseError("Failed to parse celebrity data", parseError);
    }
  } catch (error) {
    const errorResponse = formatErrorResponse(error);
    const statusCode = error instanceof Error && 'statusCode' in error 
      ? (error as { statusCode: number }).statusCode 
      : 500;
    return c.json(errorResponse, statusCode);
  }
});

// Get all templates
app.get("/api/templates", async (c) => {
  try {
    const db = c.env.DB;
    const result = await db.prepare(`
      SELECT * FROM templates 
      ORDER BY category, name
    `).all();

    return c.json({
      success: true,
      data: result.results
    });
  } catch (error) {
    const errorResponse = formatErrorResponse(error);
    return c.json(errorResponse, 500);
  }
});

// Health check endpoint
app.get("/api/health", (c) => {
  return c.json({
    success: true,
    message: "BrandedBY API is running",
    timestamp: new Date().toISOString()
  });
});

// Fallback for SPA routing - serve the index.html for non-API routes
app.get("*", async () => {
  // In production, this would serve the built React app
  // For development, Vite handles this
  return new Response("SPA Route - handled by Vite in development", {
    status: 200,
    headers: { "Content-Type": "text/html" }
  });
});

export default app;
