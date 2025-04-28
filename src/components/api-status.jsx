'use client';

import { useState, useEffect } from 'react';
import { mockApi } from '@/lib/mock-data';
import { RefreshCw } from 'lucide-react';

export function ApiStatus() {
  const [status, setStatus] = useState({ status: 'ok' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const checkApiStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await mockApi.checkHealth();
      setStatus(data);
    } catch (err) {
      console.error('Failed to check API status:', err);
      setError(err.message || 'Failed to connect to API');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkApiStatus();
  }, []);

  return (
    <div className="bg-[#111111] border border-gray-800 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-base font-medium text-white">API Status:</span>
          {loading ? (
            <span className="inline-flex items-center rounded-full bg-gray-800 text-gray-400 px-2.5 py-0.5 text-xs font-medium">
              Checking...
            </span>
          ) : error ? (
            <span className="inline-flex items-center rounded-full bg-red-600/20 text-red-400 px-2.5 py-0.5 text-xs font-medium">
              Error
            </span>
          ) : status?.status === 'ok' ? (
            <span className="inline-flex items-center rounded-full bg-green-500 text-black px-2.5 py-0.5 text-xs font-medium">
              Connected
            </span>
          ) : (
            <span className="inline-flex items-center rounded-full bg-yellow-600/20 text-yellow-400 px-2.5 py-0.5 text-xs font-medium">
              Offline
            </span>
          )}
        </div>
        <button 
          onClick={checkApiStatus} 
          disabled={loading}
          className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-800 inline-flex items-center justify-center rounded-md"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>
    </div>
  );
}
