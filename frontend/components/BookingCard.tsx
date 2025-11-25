'use client';

import React from 'react';
import { useCancelBooking } from '../lib/hooks/useCancelBooking';

/**
 * T133: Booking Card Component
 * Displays booking details with status badges and cancel functionality
 */

export interface BookingCardProps {
  booking: {
    id: string;
    ground_id: string;
    booking_date: string;
    start_time: string;
    end_time: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELED';
    confirmation_code: string;
    ground_name?: string;
    ground_location?: string;
  };
  onCanceled?: () => void;
}

const statusColors = {
  PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  APPROVED: 'bg-green-100 text-green-800 border-green-300',
  REJECTED: 'bg-red-100 text-red-800 border-red-300',
  CANCELED: 'bg-gray-100 text-gray-800 border-gray-300',
};

const statusIcons = {
  PENDING: '⏳',
  APPROVED: '✅',
  REJECTED: '❌',
  CANCELED: '🚫',
};

export function BookingCard({ booking, onCanceled }: BookingCardProps) {
  const { cancelBooking, isLoading } = useCancelBooking();
  const [showConfirmDialog, setShowConfirmDialog] = React.useState(false);

  const canCancel = booking.status === 'PENDING' || booking.status === 'APPROVED';
  const isPast = new Date(booking.booking_date) < new Date();

  const handleCancel = async () => {
    const success = await cancelBooking(booking.id);
    if (success) {
      setShowConfirmDialog(false);
      onCanceled?.();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">
            {booking.ground_name || 'Ground ' + booking.ground_id.slice(0, 8)}
          </h3>
          {booking.ground_location && (
            <p className="text-sm text-gray-600">{booking.ground_location}</p>
          )}
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold border ${
            statusColors[booking.status]
          }`}
        >
          {statusIcons[booking.status]} {booking.status}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Date:</span>
          <span className="font-medium">{formatDate(booking.booking_date)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Time:</span>
          <span className="font-medium">
            {booking.start_time} - {booking.end_time}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Confirmation Code:</span>
          <span className="font-mono font-medium text-blue-600">
            {booking.confirmation_code}
          </span>
        </div>
      </div>

      {canCancel && !isPast && (
        <div className="pt-4 border-t border-gray-200">
          <button
            onClick={() => setShowConfirmDialog(true)}
            className="w-full px-4 py-2 text-red-600 border border-red-600 rounded-md hover:bg-red-50 transition-colors"
            disabled={isLoading}
          >
            Cancel Booking
          </button>
        </div>
      )}

      {isPast && (
        <div className="pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500 text-center">This booking has passed</p>
        </div>
      )}

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
            <h3 className="text-lg font-semibold mb-2">Cancel Booking?</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to cancel this booking? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                disabled={isLoading}
              >
                Keep Booking
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? 'Canceling...' : 'Yes, Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
