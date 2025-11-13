import { Hono } from "hono";
import {
  exchangeCodeForSessionToken,
  getOAuthRedirectUrl,
  authMiddleware,
  deleteSession,
  MOCHA_SESSION_TOKEN_COOKIE_NAME,
} from "@getmocha/users-service/backend";
import { getCookie, setCookie } from "hono/cookie";
import { formatErrorResponse, UnauthorizedError, ValidationError } from "@/shared/errors";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

export const auth = new Hono<{ Bindings: Env }>();

// Get OAuth redirect URL
auth.get('/google/redirect_url', async (c) => {
  try {
    if (!c.env.MOCHA_USERS_SERVICE_API_URL || !c.env.MOCHA_USERS_SERVICE_API_KEY) {
      return c.json({ 
        success: false,
        error: 'OAuth service not configured' 
      }, 500);
    }

    const redirectUrl = await getOAuthRedirectUrl('google', {
      apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
      apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
    });

    return c.json({ 
      success: true,
      data: { redirectUrl } 
    }, 200);
  } catch (error) {
    const errorResponse = formatErrorResponse(error);
    return c.json(errorResponse, 500);
  }
});

// Exchange code for session token
const sessionSchema = z.object({
  code: z.string().min(1, "Authorization code is required"),
});

auth.post("/sessions", zValidator('json', sessionSchema), async (c) => {
  try {
    const { code } = c.req.valid('json');

    if (!c.env.MOCHA_USERS_SERVICE_API_URL || !c.env.MOCHA_USERS_SERVICE_API_KEY) {
      return c.json({ 
        success: false,
        error: 'OAuth service not configured' 
      }, 500);
    }

    const sessionToken = await exchangeCodeForSessionToken(code, {
      apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
      apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
    });

    setCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME, sessionToken, {
      httpOnly: true,
      path: "/",
      sameSite: "none",
      secure: true,
      maxAge: 60 * 24 * 60 * 60, // 60 days
    });

    return c.json({ success: true }, 200);
  } catch (error) {
    const errorResponse = formatErrorResponse(error);
    const statusCode = error instanceof Error && 'statusCode' in error 
      ? (error as { statusCode: number }).statusCode 
      : 500;
    return c.json(errorResponse, statusCode);
  }
});

// Get current user
auth.get("/me", authMiddleware, async (c) => {
  try {
    const user = c.get("user");
    
    if (!user) {
      throw new UnauthorizedError();
    }

    // Sync user to local database
    try {
      const db = c.env.DB;
      
      // Check if user exists
      const existingUser = await db.prepare(
        'SELECT * FROM users WHERE google_sub = ?'
      ).bind(user.google_sub).first();

      if (!existingUser) {
        // Create new user
        await db.prepare(`
          INSERT INTO users (email, name, google_sub, google_user_data, last_signed_in_at, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `).bind(
          user.email,
          user.google_user_data?.name || null,
          user.google_sub,
          JSON.stringify(user.google_user_data || {}),
          new Date().toISOString(),
          new Date().toISOString(),
          new Date().toISOString()
        ).run();
      } else {
        // Update existing user
        await db.prepare(`
          UPDATE users 
          SET email = ?, name = ?, google_user_data = ?, last_signed_in_at = ?, updated_at = ?
          WHERE google_sub = ?
        `).bind(
          user.email,
          user.google_user_data?.name || null,
          JSON.stringify(user.google_user_data || {}),
          new Date().toISOString(),
          new Date().toISOString(),
          user.google_sub
        ).run();
      }
    } catch (error) {
      // Log database sync errors but don't fail the request
      // User data is still available from the session
      if (error instanceof Error) {
        console.error('Error syncing user to database:', error.message);
      }
    }

    return c.json({ 
      success: true,
      data: user 
    });
  } catch (error) {
    const errorResponse = formatErrorResponse(error);
    const statusCode = error instanceof Error && 'statusCode' in error 
      ? (error as { statusCode: number }).statusCode 
      : 401;
    return c.json(errorResponse, statusCode);
  }
});

// Logout
auth.get('/logout', async (c) => {
  try {
    const sessionToken = getCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME);

    if (typeof sessionToken === 'string' && 
        c.env.MOCHA_USERS_SERVICE_API_URL && 
        c.env.MOCHA_USERS_SERVICE_API_KEY) {
      try {
        await deleteSession(sessionToken, {
          apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
          apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
        });
      } catch (error) {
        // Log but continue with cookie deletion
        if (error instanceof Error) {
          console.error('Error deleting session on server:', error.message);
        }
      }
    }

    // Always clear the cookie, even if server deletion fails
    setCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME, '', {
      httpOnly: true,
      path: '/',
      sameSite: 'none',
      secure: true,
      maxAge: 0,
    });

    return c.json({ success: true }, 200);
  } catch (error) {
    const errorResponse = formatErrorResponse(error);
    return c.json(errorResponse, 500);
  }
});
