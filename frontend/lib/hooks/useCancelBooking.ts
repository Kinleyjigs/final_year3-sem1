'use client';

import { useState } from 'react';
import { apiClient } from '../api-client';

/**
 * T132: Hook for canceling bookings
 */

export function useCancelBooking() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cancelBooking = async (bookingId: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      await apiClient.delete(`/api/bookings/${bookingId}`);
      return true;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to cancel booking';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    cancelBooking,
    isLoading,
    error,
  };
}
