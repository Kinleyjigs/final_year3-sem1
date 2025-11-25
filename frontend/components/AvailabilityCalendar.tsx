'use client';

import { useState, useMemo } from 'react';
import { useAvailability } from '@/lib/hooks/useAvailability';
import { TimeSlot } from '@/lib/api-client';

interface AvailabilityCalendarProps {
  groundId: string;
}

export function AvailabilityCalendar({ groundId }: AvailabilityCalendarProps) {
  // State for date range (default to current week)
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - dayOfWeek); // Start from Sunday
    startOfWeek.setHours(0, 0, 0, 0);
    return startOfWeek;
  });

  const [selectedSlots, setSelectedSlots] = useState<{ date: string; slot: TimeSlot }[]>([]);

  // Calculate week end (6 days from start)
  const currentWeekEnd = useMemo(() => {
    const end = new Date(currentWeekStart);
    end.setDate(currentWeekStart.getDate() + 6);
    end.setHours(23, 59, 59, 999);
    return end;
  }, [currentWeekStart]);

  // Fetch availability for current week
  const { availability, loading, error } = useAvailability(groundId, {
    start: currentWeekStart,
    end: currentWeekEnd,
  });

  // Navigation handlers
  const goToPreviousWeek = () => {
    const newStart = new Date(currentWeekStart);
    newStart.setDate(newStart.getDate() - 7);
    setCurrentWeekStart(newStart);
    setSelectedSlots([]); // Clear selection when changing weeks
  };

  const goToNextWeek = () => {
    const newStart = new Date(currentWeekStart);
    newStart.setDate(newStart.getDate() + 7);
    setCurrentWeekStart(newStart);
    setSelectedSlots([]); // Clear selection when changing weeks
  };

  const goToCurrentWeek = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - dayOfWeek);
    startOfWeek.setHours(0, 0, 0, 0);
    setCurrentWeekStart(startOfWeek);
    setSelectedSlots([]);
  };

  // Handle slot selection
  const handleSlotClick = (date: string, slot: TimeSlot) => {
    if (slot.status !== 'AVAILABLE') {
      return; // Only allow selection of available slots
    }

    // Check if slot is already selected
    const isSelected = selectedSlots.some(
      (s) => s.date === date && s.slot.start_time === slot.start_time
    );

    if (isSelected) {
      // Deselect
      setSelectedSlots(selectedSlots.filter(
        (s) => !(s.date === date && s.slot.start_time === slot.start_time)
      ));
    } else {
      // Select (support 1-hour or 2-hour slots)
      // For now, allow selecting multiple non-consecutive slots
      // In future, add logic to enforce consecutive slots for 2-hour bookings
      setSelectedSlots([...selectedSlots, { date, slot }]);
    }
  };

  // Get slot CSS classes based on status
  const getSlotClasses = (date: string, slot: TimeSlot): string => {
    const baseClasses = 'p-2 text-center text-sm border rounded cursor-pointer transition-all';
    
    const isSelected = selectedSlots.some(
      (s) => s.date === date && s.slot.start_time === slot.start_time
    );

    if (isSelected) {
      return `${baseClasses} bg-purple-200 border-purple-400 font-semibold`;
    }

    switch (slot.status) {
      case 'AVAILABLE':
        return `${baseClasses} bg-green-100 border-green-300 hover:bg-green-200`;
      case 'BOOKED':
        return `${baseClasses} bg-red-100 border-red-300 cursor-not-allowed`;
      case 'MAINTENANCE':
        return `${baseClasses} bg-orange-100 border-orange-300 cursor-not-allowed`;
      default:
        return baseClasses;
    }
  };

  // Format date for display
  const formatDateDisplay = (dateStr: string): string => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-2 text-gray-600">Loading availability...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Error loading availability: {error}</p>
      </div>
    );
  }

  if (!availability || availability.availability.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <p className="text-gray-600">No availability data for this period.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Week Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={goToPreviousWeek}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-700 font-medium transition-colors"
        >
          ← Previous Week
        </button>

        <button
          onClick={goToCurrentWeek}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          Current Week
        </button>

        <button
          onClick={goToNextWeek}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-700 font-medium transition-colors"
        >
          Next Week →
        </button>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
          <span>Booked</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-orange-100 border border-orange-300 rounded"></div>
          <span>Maintenance</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-purple-200 border border-purple-400 rounded"></div>
          <span>Selected</span>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          <div className="grid grid-cols-8 gap-2">
            {/* Header Row - Time Labels */}
            <div className="font-semibold text-sm text-gray-700 p-2">Time</div>
            {availability.availability.map((day) => (
              <div key={day.date} className="font-semibold text-sm text-gray-700 p-2 text-center">
                {formatDateDisplay(day.date)}
              </div>
            ))}

            {/* Time Slots Rows */}
            {availability.availability[0]?.slots.map((_, slotIndex) => (
              <>
                {/* Time Label */}
                <div key={`time-${slotIndex}`} className="text-sm text-gray-600 p-2">
                  {availability.availability[0].slots[slotIndex].start_time}
                </div>

                {/* Slots for Each Day */}
                {availability.availability.map((day) => {
                  const slot = day.slots[slotIndex];
                  return (
                    <div
                      key={`${day.date}-${slotIndex}`}
                      className={getSlotClasses(day.date, slot)}
                      onClick={() => handleSlotClick(day.date, slot)}
                      title={`${slot.start_time} - ${slot.end_time} (${slot.status})`}
                    >
                      {slot.status === 'AVAILABLE' ? '✓' : slot.status === 'BOOKED' ? '✗' : '⚠'}
                    </div>
                  );
                })}
              </>
            ))}
          </div>
        </div>
      </div>

      {/* Selected Slots Summary */}
      {selectedSlots.length > 0 && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-2">Selected Slots ({selectedSlots.length})</h3>
          <div className="space-y-1 text-sm">
            {selectedSlots.map((s, index) => (
              <div key={index} className="flex items-center justify-between">
                <span>
                  {formatDateDisplay(s.date)} - {s.slot.start_time} to {s.slot.end_time}
                </span>
                <button
                  onClick={() => handleSlotClick(s.date, s.slot)}
                  className="text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <button
              className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              onClick={() => {
                // TODO: Implement booking creation (Phase 6)
                alert('Booking creation will be implemented in Phase 6 (User Story 4)');
              }}
            >
              Book Selected Slots
            </button>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="text-sm text-gray-600 bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p><strong>Tip:</strong> Click on available (green) slots to select them for booking. You can select multiple 1-hour slots or consecutive slots for a 2-hour booking.</p>
      </div>
    </div>
  );
}
