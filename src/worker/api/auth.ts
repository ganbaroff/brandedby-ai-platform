import { Hono } from "hono";
import {
  exchangeCodeForSessionToken,
  getOAuthRedirectUrl,
  authMiddleware,
  deleteSession,
  MOCHA_SESSION_TOKEN_COOKIE_NAME,
} from "@getmocha/users-service/backend";
import { getCookie, setCookie } from "hono/cookie";

export const auth = new Hono<{ Bindings: Env }>();

// Get OAuth redirect URL
auth.get('/google/redirect_url', async (c) => {
  try {
    const redirectUrl = await getOAuthRedirectUrl('google', {
      apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
      apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
    });

    return c.json({ redirectUrl }, 200);
  } catch (error) {
    console.error('Error getting OAuth redirect URL:', error);
    return c.json({ error: 'Failed to get redirect URL' }, 500);
  }
});

// Exchange code for session token
auth.post("/sessions", async (c) => {
  try {
    const body = await c.req.json();

    if (!body.code) {
      return c.json({ error: "No authorization code provided" }, 400);
    }

    const sessionToken = await exchangeCodeForSessionToken(body.code, {
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
    console.error('Error exchanging code for session token:', error);
    return c.json({ error: 'Failed to authenticate' }, 500);
  }
});

// Get current user
auth.get("/me", authMiddleware, async (c) => {
  const user = c.get("user");
  
  if (!user) {
    return c.json({ error: 'Not authenticated' }, 401);
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
        user.google_user_data.name || null,
        user.google_sub,
        JSON.stringify(user.google_user_data),
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
        user.google_user_data.name || null,
        JSON.stringify(user.google_user_data),
        new Date().toISOString(),
        new Date().toISOString(),
        user.google_sub
      ).run();
    }
  } catch (error) {
    console.error('Error syncing user to database:', error);
  }

  return c.json(user);
});

// Logout
auth.get('/logout', async (c) => {
  try {
    const sessionToken = getCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME);

    if (typeof sessionToken === 'string') {
      await deleteSession(sessionToken, {
        apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
        apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
      });
    }

    setCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME, '', {
      httpOnly: true,
      path: '/',
      sameSite: 'none',
      secure: true,
      maxAge: 0,
    });

    return c.json({ success: true }, 200);
  } catch (error) {
    console.error('Error logging out:', error);
    return c.json({ error: 'Failed to logout' }, 500);
  }
});
