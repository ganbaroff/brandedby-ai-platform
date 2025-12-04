'use client';

import AuthService from '@/shared/auth/auth-service';
import { AuthResponse, AuthSession, AuthContext as IAuthContext, LoginCredentials, RegisterData, User } from '@/shared/auth/types';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<IAuthContext | undefined>(undefined);

export { AuthContext };

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  // Check for existing session on mount (non-blocking, defer remote calls)
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedUser = AuthService.getStoredUser();
        const token = AuthService.getToken();

        if (storedUser && token) {
          setUser(storedUser);
          // Verify token is still valid, but do not block initial render
          try {
            const refreshResult = await AuthService.refreshSession();
            if (refreshResult.success && refreshResult.data) {
              setSession(refreshResult.data);
              setUser(refreshResult.data.user);
            } else {
              AuthService.clearTokens();
              setUser(null);
              setSession(null);
            }
          } catch {
            AuthService.clearTokens();
            setUser(null);
            setSession(null);
          }
        } else {
          // Do not attempt remote fetch on initial mount to avoid delaying FCP.
          // Users can trigger `loadCurrentUser()` on demand (e.g., visiting protected routes).
          setUser(null);
          setSession(null);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        AuthService.clearTokens();
      } finally {
        setIsLoading(false);
      }
    };

    // Fire and forget; avoids repeated retries and heavy network during initial render
    void initializeAuth();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      const result = await AuthService.login(credentials);

      if (result.success && result.data) {
        setUser(result.data.user);
        setSession(result.data);
      }

      return result;
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Login failed'
      };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      const result = await AuthService.register(data);

      if (result.success && result.data) {
        setUser(result.data.user);
        setSession(result.data);
      }

      return result;
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Registration failed'
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await AuthService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setSession(null);
      setIsLoading(false);
    }
  };

  const refreshSession = async (): Promise<AuthResponse> => {
    try {
      const result = await AuthService.refreshSession();

      if (result.success && result.data) {
        setSession(result.data);
        setUser(result.data.user);
      } else {
        setUser(null);
        setSession(null);
      }

      return result;
    } catch (error) {
      console.error('Session refresh error:', error);
      setUser(null);
      setSession(null);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Session refresh failed'
      };
    }
  };

  const resetPassword = async (email: string): Promise<AuthResponse> => {
    try {
      return await AuthService.resetPassword(email);
    } catch (error) {
      console.error('Password reset error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Password reset failed'
      };
    }
  };

  const updateProfile = async (data: Partial<User>): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      const result = await AuthService.updateProfile(data);

      if (result.success && result.data) {
        setUser(result.data.user);
        setSession((prev: AuthSession | null) => prev ? { ...prev, user: result.data!.user } : null);
      }

      return result;
    } catch (error) {
      console.error('Profile update error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Profile update failed'
      };
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const redirectUrl = await AuthService.getGoogleRedirectUrl();
      window.location.href = redirectUrl;
    } catch (error) {
      console.error('Google login error:', error);
    } finally {
      // Do not reset loading here if we navigated away
      // In SPA navigation cases, this effect will be replaced by a full page load
      setIsLoading(false);
    }
  };

  // TEST MODE: Instant login without password
  const testLogin = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const testUser: User = {
        id: 'test-user-123',
        email: 'test@brandedby.ai',
        name: 'Test User',
        role: 'admin',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      const testSession: AuthSession = {
        user: testUser,
        token: 'test-token-' + Date.now(),
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
        refresh_token: 'test-refresh-' + Date.now()
      };

      // Store in localStorage
      localStorage.setItem('user', JSON.stringify(testUser));
      localStorage.setItem('auth_token', testSession.token);
      
      setUser(testUser);
      setSession(testSession);
    } catch (error) {
      console.error('Test login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadCurrentUser = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const currentUser = await AuthService.fetchCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        setSession(null);
      } else {
        setUser(null);
        setSession(null);
      }
    } catch (error) {
      console.error('Load current user error:', error);
      setUser(null);
      setSession(null);
    } finally {
      setIsLoading(false);
    }
  };

  const value: IAuthContext = {
    user,
    session,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    refreshSession,
    resetPassword,
    updateProfile,
    loginWithGoogle,
    testLogin,
    loadCurrentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
