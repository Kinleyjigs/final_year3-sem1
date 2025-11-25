'use client';

import React, { useState, useEffect } from 'react';
import { apiClient, SearchGroundsParams, Ground } from '@/lib/api-client';
import { GroundCard } from '@/components/GroundCard';

const COLLEGES = [
  'Royal Thimphu College',
  'College of Science and Technology',
  'Jigme Namgyel Engineering College',
  'Royal University of Bhutan',
  'Sherubtse College',
];

export default function HomePage() {
  const [grounds, setGrounds] = useState<Ground[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCollege, setSelectedCollege] = useState<string>('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const loadGrounds = async () => {
    setLoading(true);
    setError(null);

    try {
      const params: SearchGroundsParams = {
        page,
        limit: 9,
        is_active: true,
      };

      if (selectedCollege) {
        params.college = selectedCollege;
      }

      const response = await apiClient.searchGrounds(params);
      setGrounds(response.grounds);
      setTotalPages(response.total_pages);
      setTotal(response.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load grounds');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGrounds();
  }, [selectedCollege, page]);

  const handleCollegeChange = (college: string) => {
    setSelectedCollege(college);
    setPage(1); // Reset to first page when filter changes
  };

  const handleClearFilter = () => {
    setSelectedCollege('');
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            One Stop Book
          </h1>
          <p className="mt-2 text-gray-600">
            Discover and book football grounds across colleges
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1">
              <label
                htmlFor="college-filter"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Filter by College
              </label>
              <select
                id="college-filter"
                value={selectedCollege}
                onChange={(e) => handleCollegeChange(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2 border"
              >
                <option value="">All Colleges</option>
                {COLLEGES.map((college) => (
                  <option key={college} value={college}>
                    {college}
                  </option>
                ))}
              </select>
            </div>

            {selectedCollege && (
              <div className="sm:mt-6">
                <button
                  onClick={handleClearFilter}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Clear Filter
                </button>
              </div>
            )}
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600">
            {loading ? (
              <span>Loading...</span>
            ) : (
              <span>
                Showing {grounds.length} of {total} grounds
                {selectedCollege && ` at ${selectedCollege}`}
              </span>
            )}
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-red-400 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-red-800">{error}</p>
            </div>
            <button
              onClick={loadGrounds}
              className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* No Results */}
        {!loading && !error && grounds.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              No grounds found
            </h3>
            <p className="mt-2 text-gray-600">
              {selectedCollege
                ? `No grounds available at ${selectedCollege}. Try selecting a different college.`
                : 'No football grounds are currently available. Please check back later.'}
            </p>
            {selectedCollege && (
              <button
                onClick={handleClearFilter}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                View All Grounds
              </button>
            )}
          </div>
        )}

        {/* Grounds Grid */}
        {!loading && !error && grounds.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {grounds.map((ground) => (
                <GroundCard key={ground.id} ground={ground} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                <span className="px-4 py-2 text-sm text-gray-700">
                  Page {page} of {totalPages}
                </span>

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-600 text-sm">
            © 2025 One Stop Book. Campus Ground Booking Platform.
          </p>
        </div>
      </footer>
    </div>
  );
}
