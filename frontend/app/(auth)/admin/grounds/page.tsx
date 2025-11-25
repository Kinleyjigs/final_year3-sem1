'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/ProtectedRoute';

interface Ground {
  id: string;
  name: string;
  college: string;
  location: string;
  capacity: number;
  is_active: boolean;
  photos: string[];
}

export default function AdminGroundsPage() {
  const [grounds, setGrounds] = useState<Ground[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCollege, setSelectedCollege] = useState('');

  const colleges = [
    'Royal University of Bhutan',
    'College of Science and Technology',
    'Jigme Namgyel Engineering College',
    'College of Natural Resources',
    'Sherubtse College',
  ];

  useEffect(() => {
    fetchGrounds();
  }, [selectedCollege]);

  async function fetchGrounds() {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedCollege) {
        params.append('college', selectedCollege);
      }
      
      const response = await fetch(`/api/grounds?${params}`);
      if (!response.ok) throw new Error('Failed to fetch grounds');
      
      const data = await response.json();
      setGrounds(data.grounds || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeactivate(groundId: string) {
    if (!confirm('Are you sure you want to deactivate this ground?')) return;

    try {
      const response = await fetch(`/api/admin/grounds/${groundId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to deactivate ground');
      
      fetchGrounds();
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Manage Grounds</h1>
              <p className="mt-2 text-gray-600">Add and manage sports grounds for your college</p>
            </div>
            <Link
              href="/admin/grounds/new"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
            >
              + Add New Ground
            </Link>
          </div>

          {/* Filter */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by College
            </label>
            <select
              value={selectedCollege}
              onChange={(e) => setSelectedCollege(e.target.value)}
              className="w-full md:w-96 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Colleges</option>
              {colleges.map((college) => (
                <option key={college} value={college}>
                  {college}
                </option>
              ))}
            </select>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Loading */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading grounds...</p>
            </div>
          ) : grounds.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <p className="text-gray-500 text-lg">No grounds found</p>
              <Link
                href="/admin/grounds/new"
                className="inline-block mt-4 text-blue-600 hover:text-blue-700"
              >
                Create your first ground →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {grounds.map((ground) => (
                <div key={ground.id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition">
                  {/* Ground Image */}
                  <div className="h-48 bg-gray-200 relative">
                    {ground.photos && ground.photos.length > 0 ? (
                      <img
                        src={ground.photos[0]}
                        alt={ground.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        No Image
                      </div>
                    )}
                    {!ground.is_active && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Inactive
                      </div>
                    )}
                  </div>

                  {/* Ground Info */}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{ground.name}</h3>
                    <p className="text-sm text-gray-600 mb-1">{ground.college}</p>
                    <p className="text-sm text-gray-500 mb-1">📍 {ground.location}</p>
                    <p className="text-sm text-gray-500">👥 Capacity: {ground.capacity}</p>

                    {/* Actions */}
                    <div className="mt-4 flex gap-2">
                      <Link
                        href={`/admin/grounds/${ground.id}/edit`}
                        className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 text-center font-medium"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDeactivate(ground.id)}
                        className="flex-1 bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 font-medium"
                      >
                        Deactivate
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
