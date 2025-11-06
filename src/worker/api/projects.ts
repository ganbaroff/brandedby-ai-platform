import { Hono } from 'hono';
import { authMiddleware } from '@getmocha/users-service/backend';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';

const projectSchema = z.object({
  celebrity_id: z.number().optional(),
  template_id: z.number().optional(),
  package_type: z.enum(['Standard', 'Pro', 'Premium']),
  video_format: z.string(),
  niche: z.string(),
  description: z.string(),
  custom_location_url: z.string().optional(),
  additional_character_url: z.string().optional(),
  selfie_url: z.string().optional(),
});

const projects = new Hono<{ Bindings: Env }>();

// Get user's projects
projects.get('/', authMiddleware, async (c) => {
  try {
    const user = c.get('user');
    if (!user) {
      return c.json({ error: 'Not authenticated' }, 401);
    }

    const db = c.env.DB;
    
    // Get user's local ID
    const localUser = await db.prepare(
      'SELECT id FROM users WHERE google_sub = ?'
    ).bind(user.google_sub).first();

    if (!localUser) {
      return c.json({ success: true, data: [] });
    }

    // Get projects with celebrity and template names
    const result = await db.prepare(`
      SELECT 
        p.*,
        c.name as celebrity_name,
        t.name as template_name
      FROM projects p
      LEFT JOIN celebrities c ON p.celebrity_id = c.id
      LEFT JOIN templates t ON p.template_id = t.id
      WHERE p.user_id = ?
      ORDER BY p.created_at DESC
    `).bind(localUser.id).all();

    return c.json({
      success: true,
      data: result.results
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return c.json({
      success: false,
      error: 'Failed to fetch projects'
    }, 500);
  }
});

// Create a new project
projects.post('/', authMiddleware, zValidator('json', projectSchema), async (c) => {
  try {
    const user = c.get('user');
    if (!user) {
      return c.json({ error: 'Not authenticated' }, 401);
    }

    const projectData = c.req.valid('json');
    const db = c.env.DB;
    
    // Get user's local ID
    const localUser = await db.prepare(
      'SELECT id FROM users WHERE google_sub = ?'
    ).bind(user.google_sub).first();

    if (!localUser) {
      return c.json({ error: 'User not found' }, 404);
    }
    
    // Insert project into database
    const result = await db.prepare(`
      INSERT INTO projects (
        user_id, celebrity_id, template_id, package_type, video_format, 
        niche, description, custom_location_url, additional_character_url, 
        selfie_url, status, created_at, updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', datetime('now'), datetime('now'))
    `).bind(
      localUser.id,
      projectData.celebrity_id || null,
      projectData.template_id || null,
      projectData.package_type,
      projectData.video_format,
      projectData.niche,
      projectData.description,
      projectData.custom_location_url || null,
      projectData.additional_character_url || null,
      projectData.selfie_url || null
    ).run();

    // Get the created project with celebrity info
    const project = await db.prepare(`
      SELECT p.*, c.name as celebrity_name, c.image_url as celebrity_image
      FROM projects p
      LEFT JOIN celebrities c ON p.celebrity_id = c.id
      WHERE p.id = ?
    `).bind(result.meta.last_row_id).first();

    return c.json({
      success: true,
      project
    });
  } catch (error) {
    console.error('Project creation error:', error);
    return c.json({
      success: false,
      error: 'Failed to create project'
    }, 500);
  }
});

// Get project by ID
projects.get('/:id', authMiddleware, async (c) => {
  try {
    const user = c.get('user');
    if (!user) {
      return c.json({ error: 'Not authenticated' }, 401);
    }

    const id = c.req.param('id');
    const db = c.env.DB;
    
    const project = await db.prepare(`
      SELECT p.*, c.name as celebrity_name, c.image_url as celebrity_image,
             t.name as template_name
      FROM projects p
      LEFT JOIN celebrities c ON p.celebrity_id = c.id
      LEFT JOIN templates t ON p.template_id = t.id
      WHERE p.id = ?
    `).bind(id).first();

    if (!project) {
      return c.json({
        success: false,
        error: 'Project not found'
      }, 404);
    }

    return c.json({
      success: true,
      project
    });
  } catch (error) {
    console.error('Project retrieval error:', error);
    return c.json({
      success: false,
      error: 'Failed to retrieve project'
    }, 500);
  }
});

// Update project status
projects.patch('/:id/status', authMiddleware, zValidator('json', z.object({
  status: z.enum(['pending', 'processing', 'completed', 'failed']),
})), async (c) => {
  try {
    const user = c.get('user');
    if (!user) {
      return c.json({ error: 'Not authenticated' }, 401);
    }

    const id = c.req.param('id');
    const { status } = c.req.valid('json');
    const db = c.env.DB;
    
    const result = await db.prepare(`
      UPDATE projects 
      SET status = ?, updated_at = datetime('now')
      WHERE id = ?
    `).bind(status, id).run();

    if (result.meta.changes === 0) {
      return c.json({
        success: false,
        error: 'Project not found'
      }, 404);
    }

    const project = await db.prepare(`
      SELECT * FROM projects WHERE id = ?
    `).bind(id).first();

    return c.json({
      success: true,
      project
    });
  } catch (error) {
    console.error('Project update error:', error);
    return c.json({
      success: false,
      error: 'Failed to update project'
    }, 500);
  }
});

export { projects };
