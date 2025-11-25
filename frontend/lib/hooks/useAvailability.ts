import { useState, useEffect } from 'react';
import { apiClient, GetAvailabilityResponse } from '@/lib/api-client';

export function useAvailability(groundId: string, dateRange: { start: Date; end: Date }) {
  const [availability, setAvailability] = useState<GetAvailabilityResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!groundId || !dateRange.start || !dateRange.end) {
      return;
    }

    fetchAvailability();
  }, [groundId, dateRange.start.toISOString(), dateRange.end.toISOString()]);

  const fetchAvailability = async () => {
    try {
      setLoading(true);
      setError(null);

      const startDate = formatDate(dateRange.start);
      const endDate = formatDate(dateRange.end);

      const data = await apiClient.getAvailability(groundId, {
        start_date: startDate,
        end_date: endDate,
      });

      setAvailability(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load availability');
      console.error('Error loading availability:', err);
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    fetchAvailability();
  };

  return { availability, loading, error, refetch };
}

/**
 * Format Date to YYYY-MM-DD
 */
function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
