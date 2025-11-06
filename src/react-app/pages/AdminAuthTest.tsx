import React, { useState } from 'react';
import { AdminAuth, validateCredentials } from '../../shared/admin-auth';

export default function AdminAuthTest() {
  const [results, setResults] = useState<string[]>([]);

  const addResult = (message: string) => {
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
    console.log(message);
  };

  const testLogin = () => {
    addResult('🔐 Testing login with admin/admin credentials...');
    
    const isValid = validateCredentials('admin', 'admin');
    addResult(`🔍 Credentials validation: ${isValid}`);
    
    if (isValid) {
      try {
        AdminAuth.createSession('admin');
        addResult('✅ Session created successfully!');
      } catch (error) {
        addResult(`❌ Session creation failed: ${error}`);
      }
    }
  };

  const checkAuth = () => {
    addResult('🔍 Checking authentication...');
    const isAuthenticated = AdminAuth.isAuthenticated();
    addResult(`Authentication status: ${isAuthenticated}`);
  };

  const getSession = () => {
    const session = AdminAuth.getSessionInfo();
    addResult(`Session info: ${JSON.stringify(session)}`);
  };

  const testLogout = () => {
    AdminAuth.logout();
    addResult('🚪 Logged out successfully');
  };

  const clearStorage = () => {
    localStorage.clear();
    addResult('🧹 Local storage cleared');
    setResults([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin Authentication Test</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Test Credentials:</h3>
          <p>Username: <code className="bg-gray-100 px-2 py-1 rounded">admin</code></p>
          <p>Password: <code className="bg-gray-100 px-2 py-1 rounded">admin</code></p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Actions:</h3>
          <div className="space-x-4">
            <button
              onClick={testLogin}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Test Login
            </button>
            <button
              onClick={checkAuth}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Check Authentication
            </button>
            <button
              onClick={getSession}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              Get Session Info
            </button>
            <button
              onClick={testLogout}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Logout
            </button>
            <button
              onClick={clearStorage}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Clear Storage
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Results:</h3>
          <div className="bg-gray-50 p-4 rounded border max-h-64 overflow-y-auto">
            {results.length === 0 ? (
              <p className="text-gray-500">No results yet. Click a button to test authentication.</p>
            ) : (
              <pre className="text-sm">
                {results.join('\n')}
              </pre>
            )}
          </div>
        </div>

        <div className="mt-6">
          <a
            href="/admin-panel"
            className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Go to Admin Panel
          </a>
        </div>
      </div>
    </div>
  );
}