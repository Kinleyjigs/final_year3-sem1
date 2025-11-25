'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiClient, Ground } from '@/lib/api-client';
import { AvailabilityCalendar } from '@/components/AvailabilityCalendar';

export default function GroundDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const groundId = params.id as string;

  const [ground, setGround] = useState<Ground | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadGround();
  }, [groundId]);

  const loadGround = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiClient.getGround(groundId);
      setGround(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load ground details');
      console.error('Error loading ground:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-2 text-gray-600">Loading ground details...</p>
        </div>
      </div>
    );
  }

  if (error || !ground) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error || 'Ground not found'}</p>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Grounds List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => router.push('/')}
            className="text-blue-600 hover:text-blue-800 font-medium mb-2 inline-flex items-center"
          >
            ← Back to Grounds
          </button>
          <h1 className="text-3xl font-bold text-gray-900">{ground.name}</h1>
          <p className="text-gray-600 mt-1">{ground.college} • {ground.location}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Ground Details */}
          <div className="lg:col-span-1 space-y-6">
            {/* Main Image */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              {ground.photos && ground.photos.length > 0 ? (
                <img
                  src={ground.photos[0]}
                  alt={ground.name}
                  className="w-full h-64 object-cover"
                />
              ) : (
                <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                  <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>

            {/* Ground Information */}
            <div className="bg-white rounded-lg shadow p-6 space-y-4">
              <h2 className="text-xl font-bold text-gray-900">Ground Information</h2>
              
              {ground.description && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-1">Description</h3>
                  <p className="text-gray-600">{ground.description}</p>
                </div>
              )}

              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-1">Capacity</h3>
                <p className="text-gray-600">{ground.capacity} players</p>
              </div>

              {ground.amenities && ground.amenities.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Amenities</h3>
                  <div className="flex flex-wrap gap-2">
                    {ground.amenities.map((amenity, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {!ground.is_active && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-800 text-sm font-medium">
                    ⚠️ This ground is currently inactive and unavailable for booking.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Availability Calendar */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Availability Calendar</h2>
              <AvailabilityCalendar groundId={groundId} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
