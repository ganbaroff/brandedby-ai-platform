'use client';

import AuthService from '@/shared/auth/auth-service';
import { AuthSession, LoginCredentials, RegisterData, User } from '@/shared/auth/types';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface AuthProviderProps {
  children: ReactNode;
}

interface IAuthContext {
  user: User | null;
  session: AuthSession | null;
  isLoading: boolean;
  isPending: boolean;
  isAuthenticated: boolean;
  redirectToLogin: () => Promise<void>;
  exchangeCodeForSessionToken: (codeArg?: string) => Promise<AuthSession | null>;
  login: (credentials: LoginCredentials) => Promise<AuthSession | null>;
  register: (data: RegisterData) => Promise<AuthSession | null>;
  logout: () => Promise<void>;
  refreshSession: (refreshToken?: string) => Promise<AuthSession | null>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<User | null>;
  loginWithGoogle: () => Promise<void>;
  testLogin: () => Promise<void>;
  loadCurrentUser: () => Promise<void>;
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
  const [isPending, setIsPending] = useState(false);

  const isAuthenticated = !!user;

  // Check for existing session on mount (non-blocking, defer remote calls)
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedUser = AuthService.getStoredUser();
        const token = AuthService.getToken();

        if (storedUser && token) {
          setUser(storedUser);
          // We don't have a stored refresh token by default, so avoid calling refreshSession without one.
          // Instead verify the token by fetching current user (non-blocking for FCP reasons)
          try {
            const current = await AuthService.fetchCurrentUser();
            if (current) {
              setUser(current);
            }
          } catch (err) {
            AuthService.clearTokens();
            setUser(null);
            setSession(null);
          }
        } else {
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

    void initializeAuth();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<AuthSession | null> => {
    setIsLoading(true);
    try {
      const result = await AuthService.login(credentials.email, credentials.password);
      if (result) {
        setUser(result.user);
        setSession(result);
        return result;
      }
      return null;
    } catch (error) {
      console.error('Login error:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData): Promise<AuthSession | null> => {
    setIsLoading(true);
    try {
      const result = await AuthService.register(data.email, data.password, data.name || '');
      if (result) {
        setUser(result.user);
        setSession(result);
        return result;
      }
      return null;
    } catch (error) {
      console.error('Registration error:', error);
      return null;
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

  const refreshSession = async (refreshToken?: string): Promise<AuthSession | null> => {
    try {
      const tokenToUse = refreshToken ?? session?.refresh_token;
      if (!tokenToUse) {
        // nothing to refresh
        return null;
      }
      const result = await AuthService.refreshSession(tokenToUse);
      if (result) {
        setSession(result);
        setUser(result.user);
        return result;
      }
      setUser(null);
      setSession(null);
      return null;
    } catch (error) {
      console.error('Session refresh error:', error);
      setUser(null);
      setSession(null);
      return null;
    }
  };

  const resetPassword = async (email: string): Promise<void> => {
    try {
      await AuthService.resetPassword(email);
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  };

  const updateProfile = async (data: Partial<User>): Promise<User | null> => {
    setIsLoading(true);
    try {
      const result = await AuthService.updateProfile(data);
      if (result) {
        setUser(result);
        setSession((prev: AuthSession | null) => prev ? { ...prev, user: result } : null);
        return result;
      }
      return null;
    } catch (error) {
      console.error('Profile update error:', error);
      return null;
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

  const redirectToLogin = async (): Promise<void> => {
    setIsPending(true);
    try {
      const url = await AuthService.getGoogleRedirectUrl();
      window.location.href = url;
    } catch (err) {
      console.error('redirectToLogin error:', err);
    } finally {
      setIsPending(false);
    }
  };

  const exchangeCodeForSessionToken = async (codeArg?: string): Promise<AuthSession | null> => {
    setIsLoading(true);
    setIsPending(true);
    try {
      const code = codeArg ?? new URLSearchParams(window.location.search).get('code');
      if (!code) throw new Error('No code provided in URL');
      const sessionResult = await AuthService.handleGoogleCallback(code);
      if (sessionResult) {
        setUser(sessionResult.user);
        setSession(sessionResult);
        return sessionResult;
      }
      return null;
    } catch (err) {
      console.error('exchangeCodeForSessionToken error:', err);
      return null;
    } finally {
      setIsLoading(false);
      setIsPending(false);
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
      localStorage.setItem('auth_token', String(testSession.token));
      
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
    isPending,
    isAuthenticated,
    login,
    register,
    logout,
    refreshSession,
    resetPassword,
    updateProfile,
    loginWithGoogle,
    redirectToLogin,
    exchangeCodeForSessionToken,
    testLogin,
    loadCurrentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
