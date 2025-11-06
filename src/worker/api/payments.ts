import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';

const paymentSchema = z.object({
  amount: z.number().positive(),
  currency: z.string().default('USD'),
  paymentMethod: z.enum(['card', 'paypal', 'crypto']),
  status: z.enum(['pending', 'processing', 'completed', 'failed']),
  paymentId: z.string().optional(),
  projectId: z.number().optional(),
});

const payments = new Hono<{ Bindings: Env }>();

// Create a new payment
payments.post('/', zValidator('json', paymentSchema), async (c) => {
  const { amount, currency, paymentMethod, status, paymentId, projectId } = c.req.valid('json');
  
  try {
    // Insert payment into database
    const result = await c.env.DB.prepare(`
      INSERT INTO payments (amount, currency, payment_method, status, stripe_payment_id, project_id, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `).bind(amount, currency, paymentMethod, status, paymentId || null, projectId || null).run();

    // Get the created payment
    const payment = await c.env.DB.prepare(`
      SELECT * FROM payments WHERE id = ?
    `).bind(result.meta.last_row_id).first();

    return c.json({
      success: true,
      payment
    });
  } catch (error) {
    console.error('Payment creation error:', error);
    return c.json({
      success: false,
      error: 'Failed to create payment'
    }, 500);
  }
});

// Get payment by ID
payments.get('/:id', async (c) => {
  const id = c.req.param('id');
  
  try {
    const payment = await c.env.DB.prepare(`
      SELECT * FROM payments WHERE id = ?
    `).bind(id).first();

    if (!payment) {
      return c.json({
        success: false,
        error: 'Payment not found'
      }, 404);
    }

    return c.json({
      success: true,
      payment
    });
  } catch (error) {
    console.error('Payment retrieval error:', error);
    return c.json({
      success: false,
      error: 'Failed to retrieve payment'
    }, 500);
  }
});

// Update payment status
payments.patch('/:id', zValidator('json', z.object({
  status: z.enum(['pending', 'processing', 'completed', 'failed']),
  paymentId: z.string().optional(),
})), async (c) => {
  const id = c.req.param('id');
  const { status, paymentId } = c.req.valid('json');
  
  try {
    const result = await c.env.DB.prepare(`
      UPDATE payments 
      SET status = ?, stripe_payment_id = ?, updated_at = datetime('now')
      WHERE id = ?
    `).bind(status, paymentId || null, id).run();

    if (result.meta.changes === 0) {
      return c.json({
        success: false,
        error: 'Payment not found'
      }, 404);
    }

    const payment = await c.env.DB.prepare(`
      SELECT * FROM payments WHERE id = ?
    `).bind(id).first();

    return c.json({
      success: true,
      payment
    });
  } catch (error) {
    console.error('Payment update error:', error);
    return c.json({
      success: false,
      error: 'Failed to update payment'
    }, 500);
  }
});

export { payments };
