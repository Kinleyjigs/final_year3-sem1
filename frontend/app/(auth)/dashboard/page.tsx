'use client';

import React, { useEffect, useState } from 'react';
import { BookingCard } from '@/components/BookingCard';
import { apiClient } from '@/lib/api-client';
import type { Booking } from '@/lib/hooks/useCreateBooking';

/**
 * T130: My Bookings Page
 * Displays user's booking history with filtering
 */

export default function DashboardPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('upcoming');

  const fetchBookings = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.get<{ bookings: Booking[] }>('/api/bookings', true);
      setBookings(response.bookings);
    } catch (err: any) {
      setError(err.message || 'Failed to load bookings');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const filterBookings = (bookings: Booking[]) => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    return bookings.filter((booking) => {
      const bookingDate = new Date(booking.booking_date);
      bookingDate.setHours(0, 0, 0, 0);

      if (filter === 'upcoming') {
        return bookingDate >= now && (booking.status === 'PENDING' || booking.status === 'APPROVED');
      } else if (filter === 'past') {
        return bookingDate < now || booking.status === 'CANCELED' || booking.status === 'REJECTED';
      }
      return true;
    });
  };

  const filteredBookings = filterBookings(bookings);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
          <p className="mt-2 text-gray-600">
            Manage your ground bookings and view booking history
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="flex gap-8">
            <button
              onClick={() => setFilter('upcoming')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                filter === 'upcoming'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setFilter('past')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                filter === 'past'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              Past & Canceled
            </button>
            <button
              onClick={() => setFilter('all')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                filter === 'all'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              All Bookings
            </button>
          </nav>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{error}</p>
            <button
              onClick={fetchBookings}
              className="mt-2 text-red-700 underline hover:text-red-800"
            >
              Try again
            </button>
          </div>
        )}

        {/* Bookings Grid */}
        {!isLoading && !error && (
          <>
            {filteredBookings.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📅</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No bookings found
                </h3>
                <p className="text-gray-600 mb-6">
                  {filter === 'upcoming'
                    ? "You don't have any upcoming bookings."
                    : filter === 'past'
                    ? "You don't have any past bookings."
                    : "You haven't made any bookings yet."}
                </p>
                <a
                  href="/"
                  className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Browse Grounds
                </a>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBookings.map((booking) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    onCanceled={fetchBookings}
                  />
                ))}
              </div>
            )}

            {/* Stats */}
            {filteredBookings.length > 0 && (
              <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-900">
                  Showing {filteredBookings.length} {filter} booking
                  {filteredBookings.length !== 1 ? 's' : ''}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
