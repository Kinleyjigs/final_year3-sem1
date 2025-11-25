'use client';

import { useState } from 'react';
import { apiClient } from '../api-client';

/**
 * T131: Hook for creating bookings
 */

export interface CreateBookingData {
  groundId: string;
  bookingDate: string; // YYYY-MM-DD
  startTime: string;   // HH:MM
  endTime: string;     // HH:MM
}

export interface Booking {
  id: string;
  user_id: string;
  ground_id: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELED';
  confirmation_code: string;
  created_at: string;
  updated_at: string;
}

export function useCreateBooking() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createBooking = async (data: CreateBookingData): Promise<Booking | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.post<{ booking: Booking; message: string }>(
        '/api/bookings',
        data
      );
      
      return response.booking;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to create booking';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createBooking,
    isLoading,
    error,
  };
}
