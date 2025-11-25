'use client';

import React, { useState } from 'react';
import { useCreateBooking, type CreateBookingData } from '../lib/hooks/useCreateBooking';

/**
 * T129: Booking Form Modal
 * Modal for creating new bookings
 */

export interface BookingFormProps {
  groundId: string;
  groundName: string;
  selectedDate?: string;
  selectedStartTime?: string;
  selectedEndTime?: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function BookingForm({
  groundId,
  groundName,
  selectedDate,
  selectedStartTime,
  selectedEndTime,
  onClose,
  onSuccess,
}: BookingFormProps) {
  const { createBooking, isLoading, error } = useCreateBooking();
  
  const [formData, setFormData] = useState<CreateBookingData>({
    groundId,
    bookingDate: selectedDate || '',
    startTime: selectedStartTime || '',
    endTime: selectedEndTime || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await createBooking(formData);
    
    if (result) {
      onSuccess();
      onClose();
    }
  };

  const calculateDuration = () => {
    if (!formData.startTime || !formData.endTime) return '';
    
    const [startHour, startMin] = formData.startTime.split(':').map(Number);
    const [endHour, endMin] = formData.endTime.split(':').map(Number);
    const durationMinutes = (endHour * 60 + endMin) - (startHour * 60 + startMin);
    const hours = durationMinutes / 60;
    
    return `${hours} hour${hours !== 1 ? 's' : ''}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Book Ground</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="mb-4 p-4 bg-blue-50 rounded-lg">
          <p className="font-semibold text-blue-900">{groundName}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="bookingDate" className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                id="bookingDate"
                value={formData.bookingDate}
                onChange={(e) => setFormData({ ...formData, bookingDate: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
                Start Time
              </label>
              <input
                type="time"
                id="startTime"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">
                End Time
              </label>
              <input
                type="time"
                id="endTime"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {calculateDuration() && (
                <p className="text-sm text-gray-600 mt-1">Duration: {calculateDuration()}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">Bookings must be 1 or 2 hours</p>
            </div>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? 'Booking...' : 'Confirm Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
