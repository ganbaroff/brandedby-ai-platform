import { Hono } from "hono";

const app = new Hono<{ Bindings: Env }>();

// Get all celebrities
app.get("/", async (c) => {
  try {
    const db = c.env.DB;
    const result = await db.prepare(`
      SELECT * FROM celebrities 
      ORDER BY popularity DESC, rating DESC
    `).all();

    return c.json({
      success: true,
      data: result.results
    });
  } catch (error) {
    console.error("Error fetching celebrities:", error);
    return c.json({ success: false, error: "Failed to fetch celebrities" }, 500);
  }
});

// Get single celebrity
app.get("/:id", async (c) => {
  const id = c.req.param("id");
  const db = c.env.DB;
  const result = await db.prepare("SELECT * FROM celebrities WHERE id = ?").bind(id).first();

  if (!result) {
    return c.json({ success: false, error: "Celebrity not found" }, 404);
  }

  return c.json({ success: true, data: result });
});

// Create celebrity
app.post("/", async (c) => {
  try {
    const body = await c.req.json();
    // Remove id if present, let DB handle it
    const { id, ...data } = body;
    
    // Validate data (partial validation since we might not have all fields in the form)
    // Ideally we should use a CreateCelebritySchema
    
    const db = c.env.DB;
    const result = await db.prepare(`
      INSERT INTO celebrities (name, role, description, image_url, niches, rating, popularity, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
      RETURNING *
    `).bind(
      data.name,
      data.role,
      data.description || null,
      data.image_url || null,
      typeof data.niches === 'string' ? data.niches : JSON.stringify(data.niches || []),
      data.rating || 0,
      data.popularity || 0
    ).first();

    return c.json({ success: true, data: result }, 201);
  } catch (error) {
    console.error("Error creating celebrity:", error);
    return c.json({ success: false, error: "Failed to create celebrity" }, 500);
  }
});

// Update celebrity
app.put("/:id", async (c) => {
  const id = c.req.param("id");
  try {
    const body = await c.req.json();
    const db = c.env.DB;
    
    // Check if exists
    const exists = await db.prepare("SELECT id FROM celebrities WHERE id = ?").bind(id).first();
    if (!exists) {
      return c.json({ success: false, error: "Celebrity not found" }, 404);
    }

    const result = await db.prepare(`
      UPDATE celebrities 
      SET name = ?, role = ?, description = ?, image_url = ?, niches = ?, rating = ?, popularity = ?, updated_at = datetime('now')
      WHERE id = ?
      RETURNING *
    `).bind(
      body.name,
      body.role,
      body.description,
      body.image_url,
      typeof body.niches === 'string' ? body.niches : JSON.stringify(body.niches),
      body.rating,
      body.popularity,
      id
    ).first();

    return c.json({ success: true, data: result });
  } catch (error) {
    console.error("Error updating celebrity:", error);
    return c.json({ success: false, error: "Failed to update celebrity" }, 500);
  }
});

// Delete celebrity
app.delete("/:id", async (c) => {
  const id = c.req.param("id");
  try {
    const db = c.env.DB;
    const result = await db.prepare("DELETE FROM celebrities WHERE id = ?").bind(id).run();
    
    if (result.meta.changes === 0) {
      return c.json({ success: false, error: "Celebrity not found" }, 404);
    }

    return c.json({ success: true, message: "Celebrity deleted" });
  } catch (error) {
    console.error("Error deleting celebrity:", error);
    return c.json({ success: false, error: "Failed to delete celebrity" }, 500);
  }
});

export { app as celebrities };
