import { Hono } from "hono";

const app = new Hono<{ Bindings: Env }>();

// Get all blog posts
app.get("/", async (c) => {
  try {
    const db = c.env.DB;
    const result = await db.prepare(`
      SELECT * FROM blog_posts 
      ORDER BY publishedAt DESC
    `).all();

    return c.json({
      success: true,
      data: result.results
    });
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return c.json({ success: false, error: "Failed to fetch blog posts" }, 500);
  }
});

// Get single blog post
app.get("/:id", async (c) => {
  const id = c.req.param("id");
  const db = c.env.DB;
  const result = await db.prepare("SELECT * FROM blog_posts WHERE id = ?").bind(id).first();

  if (!result) {
    return c.json({ success: false, error: "Blog post not found" }, 404);
  }

  return c.json({ success: true, data: result });
});

// Create blog post
app.post("/", async (c) => {
  try {
    const body = await c.req.json();
    const { id, ...data } = body;
    
    const db = c.env.DB;
    const result = await db.prepare(`
      INSERT INTO blog_posts (title, content, excerpt, image_url, author, publishedAt, category, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
      RETURNING *
    `).bind(
      data.title,
      data.content,
      data.excerpt,
      data.image_url,
      data.author,
      data.publishedAt,
      data.category
    ).first();

    return c.json({ success: true, data: result }, 201);
  } catch (error) {
    console.error("Error creating blog post:", error);
    return c.json({ success: false, error: "Failed to create blog post" }, 500);
  }
});

// Update blog post
app.put("/:id", async (c) => {
  const id = c.req.param("id");
  try {
    const body = await c.req.json();
    const db = c.env.DB;
    
    const exists = await db.prepare("SELECT id FROM blog_posts WHERE id = ?").bind(id).first();
    if (!exists) {
      return c.json({ success: false, error: "Blog post not found" }, 404);
    }

    const result = await db.prepare(`
      UPDATE blog_posts 
      SET title = ?, content = ?, excerpt = ?, image_url = ?, author = ?, publishedAt = ?, category = ?, updated_at = datetime('now')
      WHERE id = ?
      RETURNING *
    `).bind(
      body.title,
      body.content,
      body.excerpt,
      body.image_url,
      body.author,
      body.publishedAt,
      body.category,
      id
    ).first();

    return c.json({ success: true, data: result });
  } catch (error) {
    console.error("Error updating blog post:", error);
    return c.json({ success: false, error: "Failed to update blog post" }, 500);
  }
});

// Delete blog post
app.delete("/:id", async (c) => {
  const id = c.req.param("id");
  try {
    const db = c.env.DB;
    const result = await db.prepare("DELETE FROM blog_posts WHERE id = ?").bind(id).run();
    
    if (result.meta.changes === 0) {
      return c.json({ success: false, error: "Blog post not found" }, 404);
    }

    return c.json({ success: true, message: "Blog post deleted" });
  } catch (error) {
    console.error("Error deleting blog post:", error);
    return c.json({ success: false, error: "Failed to delete blog post" }, 500);
  }
});

export { app as blogPosts };
