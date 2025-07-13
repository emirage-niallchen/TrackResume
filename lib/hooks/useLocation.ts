import { useState, useCallback } from 'react';
import type { Location } from '@prisma/client';

export function useLocation() {
  const [location, setLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLocation = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/location');
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setLocation(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch location');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateLocation = useCallback(async (locationData: Partial<Location>) => {
    try {
      setLoading(true);
      const response = await fetch('/api/location', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(locationData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setLocation(data);
      setError(null);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update location');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    location,
    loading,
    error,
    fetchLocation,
    updateLocation,
  };
} 