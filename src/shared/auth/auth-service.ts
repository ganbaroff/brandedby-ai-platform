import type { User, AuthSession } from './types';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

class AuthServiceClass {
  private tokenKey = 'auth_token';
  private userKey = 'user';

  // Get stored token
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Get stored user
  getStoredUser(): User | null {
    const userJson = localStorage.getItem(this.userKey);
    if (!userJson) return null;
    try {
      return JSON.parse(userJson);
    } catch {
      return null;
    }
  }

  // Clear all stored auth data
  clearTokens(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }

  // Get Google OAuth redirect URL
  async getGoogleRedirectUrl(): Promise<string> {
    try {
      const response = await fetch(`${API_BASE}/auth/google/url`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to get Google redirect URL');
      }

      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error('Error getting Google redirect URL:', error);
      throw error;
    }
  }

  // Handle Google OAuth callback
  async handleGoogleCallback(code: string): Promise<AuthSession> {
    try {
      const response = await fetch(`${API_BASE}/auth/google/callback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        throw new Error('Failed to authenticate with Google');
      }

      const data = await response.json();
      const session: AuthSession = {
        user: data.user,
        token: data.access_token,
        expires_at: data.expires_at,
        refresh_token: data.refresh_token,
      };

      // Store auth data
      localStorage.setItem(this.tokenKey, session.token);
      localStorage.setItem(this.userKey, JSON.stringify(session.user));

      return session;
    } catch (error) {
      console.error('Error handling Google callback:', error);
      throw error;
    }
  }

  // Login with email and password
  async login(email: string, password: string): Promise<AuthSession> {
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to login');
      }

      const data = await response.json();
      const session: AuthSession = {
        user: data.user,
        token: data.access_token,
        expires_at: data.expires_at,
        refresh_token: data.refresh_token,
      };

      // Store auth data
      localStorage.setItem(this.tokenKey, session.token);
      localStorage.setItem(this.userKey, JSON.stringify(session.user));

      return session;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Register new user
  async register(email: string, password: string, name: string): Promise<AuthSession> {
    try {
      const response = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to register');
      }

      const data = await response.json();
      const session: AuthSession = {
        user: data.user,
        token: data.access_token,
        expires_at: data.expires_at,
        refresh_token: data.refresh_token,
      };

      // Store auth data
      localStorage.setItem(this.tokenKey, session.token);
      localStorage.setItem(this.userKey, JSON.stringify(session.user));

      return session;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  // Logout
  async logout(): Promise<void> {
    try {
      const token = this.getToken();
      if (token) {
        await fetch(`${API_BASE}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearTokens();
    }
  }

  // Refresh session
  async refreshSession(refreshToken: string): Promise<AuthSession> {
    try {
      const response = await fetch(`${API_BASE}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (!response.ok) {
        throw new Error('Failed to refresh session');
      }

      const data = await response.json();
      const session: AuthSession = {
        user: data.user,
        token: data.access_token,
        expires_at: data.expires_at,
        refresh_token: data.refresh_token,
      };

      // Update stored auth data
      localStorage.setItem(this.tokenKey, session.token);
      localStorage.setItem(this.userKey, JSON.stringify(session.user));

      return session;
    } catch (error) {
      console.error('Refresh session error:', error);
      this.clearTokens();
      throw error;
    }
  }

  // Fetch current user from API
  async fetchCurrentUser(): Promise<User> {
    try {
      const token = this.getToken();
      if (!token) {
        throw new Error('No authentication token');
      }

      const response = await fetch(`${API_BASE}/auth/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user');
      }

      const user = await response.json();
      localStorage.setItem(this.userKey, JSON.stringify(user));
      return user;
    } catch (error) {
      console.error('Fetch current user error:', error);
      throw error;
    }
  }

  // Reset password
  async resetPassword(email: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to reset password');
      }
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  }

  // Update profile
  async updateProfile(updates: Partial<User>): Promise<User> {
    try {
      const token = this.getToken();
      if (!token) {
        throw new Error('No authentication token');
      }

      const response = await fetch(`${API_BASE}/auth/profile`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update profile');
      }

      const user = await response.json();
      localStorage.setItem(this.userKey, JSON.stringify(user));
      return user;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }
}

const AuthService = new AuthServiceClass();
export default AuthService;
