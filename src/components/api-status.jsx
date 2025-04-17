'use client';

import { useState, useEffect } from 'react';
import { mockApi } from '@/lib/mock-data';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

export function ApiStatus() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
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
    <Card className="bg-[#111] border-gray-800 text-white">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-light">API Status:</span>
            {loading ? (
              <Badge variant="outline" className="bg-gray-800 text-gray-400 border-gray-700">
                Checking...
              </Badge>
            ) : error ? (
              <Badge variant="outline" className="bg-red-900/30 text-red-400 border-red-900">
                Error
              </Badge>
            ) : status?.status === 'ok' ? (
              <Badge variant="outline" className="bg-green-900/30 text-green-400 border-green-900">
                Connected
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-yellow-900/30 text-yellow-400 border-yellow-900">
                Offline
              </Badge>
            )}
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={checkApiStatus} 
            disabled={loading}
            className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-800"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
