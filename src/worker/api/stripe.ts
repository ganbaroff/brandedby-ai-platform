import { Hono } from 'hono';
import { authMiddleware } from '@getmocha/users-service/backend';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import Stripe from 'stripe';

const createPaymentIntentSchema = z.object({
  amount: z.number().positive(),
  currency: z.string().default('USD'),
  projectData: z.object({
    celebrity_id: z.number().optional(),
    template_id: z.number().optional(),
    package_type: z.enum(['Standard', 'Pro', 'Premium']),
    video_format: z.string(),
    niche: z.string(),
    description: z.string(),
    custom_location_url: z.string().optional(),
    additional_character_url: z.string().optional(),
    selfie_url: z.string().optional(),
  }),
});

const stripe = new Hono<{ Bindings: Env }>();

// Create payment intent
stripe.post('/create-payment-intent', authMiddleware, zValidator('json', createPaymentIntentSchema), async (c) => {
  try {
    const user = c.get('user');
    if (!user) {
      return c.json({ error: 'Not authenticated' }, 401);
    }

    const { amount, currency, projectData } = c.req.valid('json');
    
    // Initialize Stripe with secret key
    const stripeClient = new Stripe(c.env.STRIPE_SECRET_KEY);

    // Create payment intent
    const paymentIntent = await stripeClient.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency.toLowerCase(),
      metadata: {
        user_email: user.email,
        user_id: user.google_sub,
        celebrity_id: projectData.celebrity_id?.toString() || '',
        package_type: projectData.package_type,
      },
    });

    // Store pending project data in session
    const db = c.env.DB;
    
    // Get user's local ID
    const localUser = await db.prepare(
      'SELECT id FROM users WHERE google_sub = ?'
    ).bind(user.google_sub).first();

    if (!localUser) {
      return c.json({ error: 'User not found' }, 404);
    }

    // Create project with pending status
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

    const projectId = result.meta.last_row_id;

    // Create payment record
    await db.prepare(`
      INSERT INTO payments (
        project_id, amount, currency, status, stripe_payment_id, 
        created_at, updated_at
      )
      VALUES (?, ?, ?, 'pending', ?, datetime('now'), datetime('now'))
    `).bind(projectId, amount, currency, paymentIntent.id).run();

    return c.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      projectId,
    });
  } catch (error) {
    console.error('Payment intent creation error:', error);
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create payment intent'
    }, 500);
  }
});

// Confirm payment
stripe.post('/confirm-payment', authMiddleware, zValidator('json', z.object({
  paymentIntentId: z.string(),
  projectId: z.number(),
})), async (c) => {
  try {
    const user = c.get('user');
    if (!user) {
      return c.json({ error: 'Not authenticated' }, 401);
    }

    const { paymentIntentId, projectId } = c.req.valid('json');
    const db = c.env.DB;

    // Update payment status
    await db.prepare(`
      UPDATE payments 
      SET status = 'completed', updated_at = datetime('now')
      WHERE stripe_payment_id = ?
    `).bind(paymentIntentId).run();

    // Update project status to processing
    await db.prepare(`
      UPDATE projects 
      SET status = 'processing', updated_at = datetime('now')
      WHERE id = ?
    `).bind(projectId).run();

    return c.json({
      success: true,
      message: 'Payment confirmed successfully'
    });
  } catch (error) {
    console.error('Payment confirmation error:', error);
    return c.json({
      success: false,
      error: 'Failed to confirm payment'
    }, 500);
  }
});

export { stripe };
