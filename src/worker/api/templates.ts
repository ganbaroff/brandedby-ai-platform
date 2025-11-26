import { Hono } from "hono";

const app = new Hono<{ Bindings: Env }>();

// Get all templates
app.get("/", async (c) => {
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
    console.error("Error fetching templates:", error);
    return c.json({ success: false, error: "Failed to fetch templates" }, 500);
  }
});

// Get single template
app.get("/:id", async (c) => {
  const id = c.req.param("id");
  const db = c.env.DB;
  const result = await db.prepare("SELECT * FROM templates WHERE id = ?").bind(id).first();

  if (!result) {
    return c.json({ success: false, error: "Template not found" }, 404);
  }

  return c.json({ success: true, data: result });
});

// Create template
app.post("/", async (c) => {
  try {
    const body = await c.req.json();
    const { id, ...data } = body;
    
    const db = c.env.DB;
    const result = await db.prepare(`
      INSERT INTO templates (name, category, description, is_azeri, preview_url, emoji, status, usage_count, tags, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
      RETURNING *
    `).bind(
      data.name,
      data.category,
      data.description || null,
      data.is_azeri ? 1 : 0,
      data.preview_url || null,
      data.emoji || '📄',
      data.status || 'active',
      data.usage_count || 0,
      typeof data.tags === 'string' ? data.tags : JSON.stringify(data.tags || [])
    ).first();

    return c.json({ success: true, data: result }, 201);
  } catch (error) {
    console.error("Error creating template:", error);
    return c.json({ success: false, error: "Failed to create template" }, 500);
  }
});

// Update template
app.put("/:id", async (c) => {
  const id = c.req.param("id");
  try {
    const body = await c.req.json();
    const db = c.env.DB;
    
    const exists = await db.prepare("SELECT id FROM templates WHERE id = ?").bind(id).first();
    if (!exists) {
      return c.json({ success: false, error: "Template not found" }, 404);
    }

    const result = await db.prepare(`
      UPDATE templates 
      SET name = ?, category = ?, description = ?, is_azeri = ?, preview_url = ?, emoji = ?, status = ?, usage_count = ?, tags = ?, updated_at = datetime('now')
      WHERE id = ?
      RETURNING *
    `).bind(
      body.name,
      body.category,
      body.description,
      body.is_azeri ? 1 : 0,
      body.preview_url,
      body.emoji,
      body.status,
      body.usage_count,
      typeof body.tags === 'string' ? body.tags : JSON.stringify(body.tags),
      id
    ).first();

    return c.json({ success: true, data: result });
  } catch (error) {
    console.error("Error updating template:", error);
    return c.json({ success: false, error: "Failed to update template" }, 500);
  }
});

// Delete template
app.delete("/:id", async (c) => {
  const id = c.req.param("id");
  try {
    const db = c.env.DB;
    const result = await db.prepare("DELETE FROM templates WHERE id = ?").bind(id).run();
    
    if (result.meta.changes === 0) {
      return c.json({ success: false, error: "Template not found" }, 404);
    }

    return c.json({ success: true, message: "Template deleted" });
  } catch (error) {
    console.error("Error deleting template:", error);
    return c.json({ success: false, error: "Failed to delete template" }, 500);
  }
});

export { app as templates };
