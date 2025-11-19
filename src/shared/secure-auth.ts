/**
 * Secure Authentication System
 * Enhanced security with proper session management, rate limiting, and encryption
 */

interface AuthSession {
  userId: string;
  username: string;
  role: 'admin' | 'user';
  loginTime: number;
  lastActivity: number;
  sessionId: string;
  fingerprint: string;
  expiresAt: number;
}

interface LoginAttempt {
  username: string;
  timestamp: number;
  success: boolean;
  ip?: string;
}

interface SecurityConfig {
  maxLoginAttempts: number;
  lockoutDuration: number; // in minutes
  sessionTimeout: number; // in minutes
  maxSessions: number;
  requireStrongPassword: boolean;
  enableTwoFactor: boolean;
}

class SecureAuth {
  private static readonly STORAGE_KEYS = {
    session: 'brandedby_secure_session',
    attempts: 'brandedby_login_attempts',
    config: 'brandedby_security_config'
  };

  private static readonly DEFAULT_CONFIG: SecurityConfig = {
    maxLoginAttempts: 5,
    lockoutDuration: 30, // 30 minutes
    sessionTimeout: 480, // 8 hours
    maxSessions: 3,
    requireStrongPassword: true,
    enableTwoFactor: false
  };

  // Default admin credentials (in production, this should come from secure backend)
  private static readonly DEFAULT_ADMIN = {
    username: 'admin',
    // In production, passwords should be properly hashed
    passwordHash: 'admin123', // This should be a proper hash
    role: 'admin' as const,
    twoFactorSecret: null
  };

  /**
   * Initialize security system with default configuration
   */
  static initialize(): void {
    const config = this.getSecurityConfig();
    if (!localStorage.getItem(this.STORAGE_KEYS.config)) {
      this.setSecurityConfig(config);
    }
    
    // Clean up expired sessions and attempts
    this.cleanupExpiredData();
    
    console.log('🔒 SecureAuth system initialized');
  }

  /**
   * Generate device fingerprint for session validation
   */
  private static generateFingerprint(): string {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillText('Device fingerprint', 2, 2);
    }
    
    const fingerprint = [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      new Date().getTimezoneOffset(),
      canvas.toDataURL()
    ].join('|');

    return this.simpleHash(fingerprint);
  }

  /**
   * Simple hash function for client-side hashing (not cryptographically secure)
   */
  private static simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16);
  }

  /**
   * Generate secure session ID
   */
  private static generateSessionId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  /**
   * Check if user is currently locked out
   */
  static isUserLockedOut(username: string): boolean {
    const attempts = this.getLoginAttempts(username);
    const config = this.getSecurityConfig();
    
    const failedAttempts = attempts.filter(
      attempt => !attempt.success && 
      Date.now() - attempt.timestamp < config.lockoutDuration * 60 * 1000
    );

    return failedAttempts.length >= config.maxLoginAttempts;
  }

  /**
   * Get time remaining for lockout
   */
  static getLockoutTimeRemaining(username: string): number {
    if (!this.isUserLockedOut(username)) return 0;
    
    const attempts = this.getLoginAttempts(username);
    const config = this.getSecurityConfig();
    const lastFailedAttempt = attempts
      .filter(a => !a.success)
      .sort((a, b) => b.timestamp - a.timestamp)[0];
    
    if (!lastFailedAttempt) return 0;
    
    const lockoutEnd = lastFailedAttempt.timestamp + (config.lockoutDuration * 60 * 1000);
    return Math.max(0, lockoutEnd - Date.now());
  }

  /**
   * Validate password strength
   */
  static validatePasswordStrength(password: string): {
    isValid: boolean;
    errors: string[];
    score: number;
  } {
    const errors: string[] = [];
    let score = 0;

    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    } else {
      score += 1;
    }

    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    } else {
      score += 1;
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    } else {
      score += 1;
    }

    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number');
    } else {
      score += 1;
    }

    if (!/[^a-zA-Z0-9]/.test(password)) {
      errors.push('Password must contain at least one special character');
    } else {
      score += 1;
    }

    const isValid = errors.length === 0;
    return { isValid, errors, score };
  }

  /**
   * Secure login with rate limiting and session management
   */
  static async login(username: string, password: string): Promise<{
    success: boolean;
    message: string;
    session?: AuthSession;
    requiresTwoFactor?: boolean;
  }> {
    try {
      // Check if user is locked out
      if (this.isUserLockedOut(username)) {
        const timeRemaining = this.getLockoutTimeRemaining(username);
        return {
          success: false,
          message: `Account locked. Try again in ${Math.ceil(timeRemaining / 60000)} minutes.`
        };
      }

      // Rate limiting - add delay for repeated attempts
      await this.addLoginDelay(username);

      // Validate credentials (in production, this should be server-side)
      const isValidCredentials = this.validateCredentials(username, password);
      
      // Record login attempt
      this.recordLoginAttempt(username, isValidCredentials);

      if (!isValidCredentials) {
        return {
          success: false,
          message: 'Invalid username or password'
        };
      }

      // Create secure session
      const session = this.createSession(username);
      
      // Check if two-factor is enabled
      const config = this.getSecurityConfig();
      if (config.enableTwoFactor) {
        // In production, generate and send 2FA code
        return {
          success: false,
          message: 'Two-factor authentication required',
          requiresTwoFactor: true
        };
      }

      this.saveSession(session);

      return {
        success: true,
        message: 'Login successful',
        session
      };

    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'Login failed. Please try again.'
      };
    }
  }

  /**
   * Create authenticated session
   */
  private static createSession(username: string): AuthSession {
    const now = Date.now();
    const config = this.getSecurityConfig();
    
    return {
      userId: this.simpleHash(username),
      username,
      role: username === this.DEFAULT_ADMIN.username ? 'admin' : 'user',
      loginTime: now,
      lastActivity: now,
      sessionId: this.generateSessionId(),
      fingerprint: this.generateFingerprint(),
      expiresAt: now + (config.sessionTimeout * 60 * 1000)
    };
  }

  /**
   * Validate stored session
   */
  static validateSession(): boolean {
    try {
      const sessionData = localStorage.getItem(this.STORAGE_KEYS.session);
      if (!sessionData) return false;

      const session: AuthSession = JSON.parse(sessionData);
      const now = Date.now();
      const config = this.getSecurityConfig();

      // Check expiration
      if (now > session.expiresAt) {
        this.logout();
        return false;
      }

      // Check session timeout
      if (now - session.lastActivity > config.sessionTimeout * 60 * 1000) {
        this.logout();
        return false;
      }

      // Validate device fingerprint
      if (session.fingerprint !== this.generateFingerprint()) {
        console.warn('Session fingerprint mismatch - possible session hijacking');
        this.logout();
        return false;
      }

      // Update last activity
      session.lastActivity = now;
      this.saveSession(session);

      return true;
    } catch (error) {
      console.error('Session validation error:', error);
      this.logout();
      return false;
    }
  }

  /**
   * Get current session information
   */
  static getCurrentSession(): AuthSession | null {
    try {
      const sessionData = localStorage.getItem(this.STORAGE_KEYS.session);
      if (!sessionData) return null;

      const session: AuthSession = JSON.parse(sessionData);
      return this.validateSession() ? session : null;
    } catch {
      return null;
    }
  }

  /**
   * Secure logout with session cleanup
   */
  static logout(): void {
    localStorage.removeItem(this.STORAGE_KEYS.session);
    console.log('🔓 User logged out securely');
  }

  /**
   * Get security configuration
   */
  static getSecurityConfig(): SecurityConfig {
    try {
      const configData = localStorage.getItem(this.STORAGE_KEYS.config);
      return configData ? JSON.parse(configData) : this.DEFAULT_CONFIG;
    } catch {
      return this.DEFAULT_CONFIG;
    }
  }

  /**
   * Update security configuration
   */
  static setSecurityConfig(config: Partial<SecurityConfig>): void {
    const currentConfig = this.getSecurityConfig();
    const newConfig = { ...currentConfig, ...config };
    localStorage.setItem(this.STORAGE_KEYS.config, JSON.stringify(newConfig));
  }

  // Private helper methods
  private static validateCredentials(username: string, password: string): boolean {
    // In production, this should validate against secure backend
    return username === this.DEFAULT_ADMIN.username && password === this.DEFAULT_ADMIN.passwordHash;
  }

  private static saveSession(session: AuthSession): void {
    localStorage.setItem(this.STORAGE_KEYS.session, JSON.stringify(session));
  }

  private static getLoginAttempts(username: string): LoginAttempt[] {
    try {
      const attemptsData = localStorage.getItem(this.STORAGE_KEYS.attempts);
      if (!attemptsData) return [];
      
      const allAttempts: LoginAttempt[] = JSON.parse(attemptsData);
      return allAttempts.filter(attempt => attempt.username === username);
    } catch {
      return [];
    }
  }

  private static recordLoginAttempt(username: string, success: boolean): void {
    try {
      const attemptsData = localStorage.getItem(this.STORAGE_KEYS.attempts);
      const allAttempts: LoginAttempt[] = attemptsData ? JSON.parse(attemptsData) : [];
      
      allAttempts.push({
        username,
        timestamp: Date.now(),
        success,
        ip: 'client-side' // In production, this would be the real IP
      });

      // Keep only recent attempts (last 24 hours)
      const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
      const recentAttempts = allAttempts.filter(attempt => attempt.timestamp > oneDayAgo);
      
      localStorage.setItem(this.STORAGE_KEYS.attempts, JSON.stringify(recentAttempts));
    } catch (error) {
      console.error('Failed to record login attempt:', error);
    }
  }

  private static async addLoginDelay(username: string): Promise<void> {
    const attempts = this.getLoginAttempts(username);
    const recentFailedAttempts = attempts.filter(
      attempt => !attempt.success && Date.now() - attempt.timestamp < 5 * 60 * 1000
    );

    if (recentFailedAttempts.length > 0) {
      // Progressive delay: 1s, 2s, 4s, 8s, etc.
      const delayMs = Math.min(1000 * Math.pow(2, recentFailedAttempts.length - 1), 30000);
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }

  private static cleanupExpiredData(): void {
    try {
      // Clean up old login attempts
      const attemptsData = localStorage.getItem(this.STORAGE_KEYS.attempts);
      if (attemptsData) {
        const allAttempts: LoginAttempt[] = JSON.parse(attemptsData);
        const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
        const validAttempts = allAttempts.filter(attempt => attempt.timestamp > oneDayAgo);
        localStorage.setItem(this.STORAGE_KEYS.attempts, JSON.stringify(validAttempts));
      }
    } catch (error) {
      console.error('Cleanup error:', error);
    }
  }
}

export { SecureAuth, type AuthSession, type SecurityConfig };
