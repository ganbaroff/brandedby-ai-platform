/**
 * Simple Admin Login Component
 * Quick access for development
 */

import { Shield } from 'lucide-react';
import React from 'react';

interface SimpleAdminLoginProps {
  onLogin: (success: boolean) => void;
}

const SecureAdminLogin: React.FC<SimpleAdminLoginProps> = ({ onLogin }) => {
  const handleQuickLogin = () => {
    // Простой вход без проверки пароля для разработки
    onLogin(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Access</h1>
          <p className="text-gray-600">BrandedBy Admin Panel</p>
        </div>

        {/* Quick Login Card */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center space-y-4">
            <p className="text-gray-600">Development Mode</p>
            
            <button
              onClick={handleQuickLogin}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all"
            >
              <Shield className="h-4 w-4 mr-2" />
              🚀 Sign In as Admin
            </button>

            <p className="text-xs text-gray-500 mt-4">
              Quick login without password (development mode)
            </p>
          </div>
        </div>

        {/* Security Notice */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-500">
            Development mode - No authentication required
          </p>
        </div>
      </div>
    </div>
  );
};

export default SecureAdminLogin;