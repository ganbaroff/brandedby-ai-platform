// Admin authentication utilities

export interface AdminSession {
  loggedIn: boolean;
  timestamp: string;
  user: string;
  expiresAt?: string;
}

export class AdminAuth {
  private static SESSION_KEY = 'brandedby_admin_session';
  private static SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    try {
      console.log('🔍 AdminAuth.isAuthenticated() called');
      
      // Check if localStorage is available
      if (typeof localStorage === 'undefined') {
        console.log('❌ localStorage not available');
        return false;
      }
      
      const session = localStorage.getItem(this.SESSION_KEY);
      console.log('📄 Retrieved session data:', session);
      
      if (!session) {
        console.log('❌ No session found');
        return false;
      }

      const sessionData: AdminSession = JSON.parse(session);
      console.log('📋 Parsed session:', sessionData);
      
      // Check if session is valid
      if (!sessionData.loggedIn) {
        console.log('❌ Session not logged in');
        return false;
      }

      // Check if session is expired (optional)
      if (sessionData.expiresAt) {
        const now = new Date().getTime();
        const expires = new Date(sessionData.expiresAt).getTime();
        console.log('⏰ Session expiry check:', { now, expires, expired: now > expires });
        if (now > expires) {
          console.log('⏰ Session expired, logging out');
          this.logout();
          return false;
        }
      }

      console.log('✅ Session valid');
      return true;
    } catch (error) {
      console.error('❌ Error checking admin authentication:', error);
      return false;
    }
  }

  // Get current session data
  static getSession(): AdminSession | null {
    try {
      if (typeof localStorage === 'undefined') {
        console.log('❌ localStorage not available for session retrieval');
        return null;
      }
      
      const session = localStorage.getItem(this.SESSION_KEY);
      return session ? JSON.parse(session) : null;
    } catch (error) {
      console.error('Error getting admin session:', error);
      return null;
    }
  }

  // Create a new session
  static createSession(username: string): void {
    if (typeof localStorage === 'undefined') {
      console.error('❌ localStorage not available for session creation');
      throw new Error('Session storage not available');
    }
    
    const session: AdminSession = {
      loggedIn: true,
      timestamp: new Date().toISOString(),
      user: username,
      expiresAt: new Date(Date.now() + this.SESSION_DURATION).toISOString()
    };

    localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
    console.log('✅ Admin session created for:', username);
  }

  // Logout and clear session
  static logout(): void {
    localStorage.removeItem(this.SESSION_KEY);
    console.log('🚪 Admin logged out');
  }

  // Extend current session
  static extendSession(): void {
    const session = this.getSession();
    if (session && session.loggedIn) {
      session.expiresAt = new Date(Date.now() + this.SESSION_DURATION).toISOString();
      localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
    }
  }

  // Get session info for display
  static getSessionInfo(): { 
    isLoggedIn: boolean; 
    user?: string; 
    loginTime?: string; 
    expiresAt?: string;
  } {
    const session = this.getSession();
    if (!session || !session.loggedIn) {
      return { isLoggedIn: false };
    }

    return {
      isLoggedIn: true,
      user: session.user,
      loginTime: session.timestamp,
      expiresAt: session.expiresAt
    };
  }
}

// Demo credentials (in production, this would be server-side)
export const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin'
};

// Validate login credentials
export const validateCredentials = (username: string, password: string): boolean => {
  return username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password;
};

// Make utilities available globally for console access
declare global {
  interface Window {
    AdminAuth: typeof AdminAuth;
  }
}

if (typeof window !== 'undefined') {
  window.AdminAuth = AdminAuth;
}