/**
 * Secure Admin Login Component
 * Enhanced security with rate limiting, password strength validation, and session management
 */

import { SecureAuth, type SecurityConfig } from '@/shared/secure-auth';
import { AlertTriangle, CheckCircle, Clock, Eye, EyeOff, Lock, Shield, User, XCircle } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';

interface SecureAdminLoginProps {
  onLogin: (success: boolean) => void;
}

const SecureAdminLogin: React.FC<SecureAdminLoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTime, setLockoutTime] = useState(0);
  const [passwordStrength, setPasswordStrength] = useState<{
    isValid: boolean;
    errors: string[];
    score: number;
  }>({ isValid: false, errors: [], score: 0 });
  const [securityConfig, setSecurityConfig] = useState<SecurityConfig | null>(null);
  
  // Initialize security system
  useEffect(() => {
    SecureAuth.initialize();
    setSecurityConfig(SecureAuth.getSecurityConfig());
  }, []);

  // Check lockout status
  useEffect(() => {
    if (username) {
      const locked = SecureAuth.isUserLockedOut(username);
      setIsLocked(locked);
      if (locked) {
        setLockoutTime(SecureAuth.getLockoutTimeRemaining(username));
      }
    }
  }, [username]);

  // Countdown timer for lockout
  useEffect(() => {
    if (lockoutTime > 0) {
      const timer = setTimeout(() => {
        setLockoutTime(prev => {
          const newTime = prev - 1000;
          if (newTime <= 0) {
            setIsLocked(false);
            return 0;
          }
          return newTime;
        });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [lockoutTime]);

  // Validate password strength as user types
  const handlePasswordChange = useCallback((value: string) => {
    setPassword(value);
    if (value && securityConfig?.requireStrongPassword) {
      setPasswordStrength(SecureAuth.validatePasswordStrength(value));
    } else {
      setPasswordStrength({ isValid: true, errors: [], score: 0 });
    }
  }, [securityConfig]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLocked) {
      setError('Account is temporarily locked. Please wait.');
      return;
    }

    if (!username.trim()) {
      setError('Username is required');
      return;
    }

    if (!password.trim()) {
      setError('Password is required');
      return;
    }

    if (securityConfig?.requireStrongPassword && !passwordStrength.isValid) {
      setError('Password does not meet security requirements');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await SecureAuth.login(username, password);
      
      if (result.success) {
        setSuccess('Login successful! Redirecting...');
        setTimeout(() => onLogin(true), 1000);
      } else if (result.requiresTwoFactor) {
        setError('Two-factor authentication is not yet implemented');
      } else {
        setError(result.message);
        // Check if account is now locked
        if (SecureAuth.isUserLockedOut(username)) {
          setIsLocked(true);
          setLockoutTime(SecureAuth.getLockoutTimeRemaining(username));
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (milliseconds: number) => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getPasswordStrengthColor = (score: number) => {
    if (score <= 1) return 'bg-red-500';
    if (score <= 2) return 'bg-orange-500';
    if (score <= 3) return 'bg-yellow-500';
    if (score <= 4) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = (score: number) => {
    if (score <= 1) return 'Very Weak';
    if (score <= 2) return 'Weak';
    if (score <= 3) return 'Fair';
    if (score <= 4) return 'Strong';
    return 'Very Strong';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Secure Admin Access</h1>
          <p className="text-gray-600">Enhanced security for BrandedBy platform</p>
        </div>

        {/* Security Features Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-medium text-blue-800 mb-2 flex items-center">
            <Lock className="h-4 w-4 mr-2" />
            Security Features Active
          </h3>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• Rate limiting and account lockout protection</li>
            <li>• Session fingerprinting and timeout management</li>
            <li>• Password strength validation</li>
            <li>• Login attempt monitoring</li>
          </ul>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter your username"
                  disabled={isLoading || isLocked}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter your password"
                  disabled={isLoading || isLocked}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  disabled={isLoading || isLocked}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {password && securityConfig?.requireStrongPassword && (
                <div className="mt-2">
                  <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                    <span>Password Strength</span>
                    <span className={passwordStrength.isValid ? 'text-green-600' : 'text-red-600'}>
                      {getPasswordStrengthText(passwordStrength.score)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${getPasswordStrengthColor(passwordStrength.score)}`}
                      style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                    />
                  </div>
                  {passwordStrength.errors.length > 0 && (
                    <ul className="mt-2 text-xs text-red-600 space-y-1">
                      {passwordStrength.errors.map((error, index) => (
                        <li key={index} className="flex items-center">
                          <XCircle className="h-3 w-3 mr-1 flex-shrink-0" />
                          {error}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>

            {/* Account Lockout Warning */}
            {isLocked && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-red-500 mr-3" />
                  <div>
                    <h4 className="text-sm font-medium text-red-800">Account Temporarily Locked</h4>
                    <p className="text-sm text-red-700 mt-1">
                      Too many failed attempts. Try again in {formatTime(lockoutTime)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <XCircle className="h-5 w-5 text-red-500 mr-3" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <p className="text-sm text-green-700">{success}</p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || isLocked || (securityConfig?.requireStrongPassword && !passwordStrength.isValid)}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                  Authenticating...
                </>
              ) : isLocked ? (
                <>
                  <Clock className="h-4 w-4 mr-2" />
                  Locked ({formatTime(lockoutTime)})
                </>
              ) : (
                <>
                  <Shield className="h-4 w-4 mr-2" />
                  Secure Login
                </>
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Demo Credentials</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>Username:</strong> admin</p>
              <p><strong>Password:</strong> admin123</p>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Note: In production, use secure authentication backend
            </p>
          </div>
        </div>

        {/* Security Notice */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-500">
            Protected by enhanced security measures including rate limiting,
            session management, and device fingerprinting.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SecureAdminLogin;