import logger from '@/shared/logger';
import { useEffect, useState } from 'react';

const ConfigStatus = () => {
  const [status, setStatus] = useState(logger.getConfigStatus());

  useEffect(() => {
    const interval = setInterval(() => {
      setStatus(logger.getConfigStatus());
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const retryFailedLogs = async () => {
    await logger.retrySendingFailedLogs();
    setStatus(logger.getConfigStatus());
  };

  return (
    <div className="fixed top-4 right-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 z-50 max-w-sm">
      <h4 className="font-bold text-gray-900 mb-2">📊 Logger Status</h4>
      
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span>EmailJS:</span>
          <span className={status.emailJSLoaded ? 'text-green-600' : 'text-red-600'}>
            {status.emailJSLoaded ? '✅ Loaded' : '❌ Not loaded'}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>Config:</span>
          <span className={status.isValid ? 'text-green-600' : 'text-yellow-600'}>
            {status.isValid ? '✅ Valid' : '⚠️ Default'}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>Email:</span>
          <span className="text-xs text-gray-600 truncate max-w-32">
            {status.config.targetEmail}
          </span>
        </div>
        
        {status.failedLogsCount > 0 && (
          <div className="border-t pt-2">
            <div className="flex justify-between items-center">
              <span className="text-orange-600">Failed logs: {status.failedLogsCount}</span>
              <button
                onClick={retryFailedLogs}
                className="text-xs bg-orange-600 text-white px-2 py-1 rounded hover:bg-orange-700"
              >
                Retry
              </button>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-3 text-xs text-gray-500">
        <div>Current logs: {logger.getAllLogs().length}</div>
        <div>Session: {logger.getAllLogs()[0]?.sessionId?.slice(-6)}</div>
      </div>
    </div>
  );
};

export default ConfigStatus;