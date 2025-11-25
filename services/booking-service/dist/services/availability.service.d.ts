export interface TimeSlot {
    startTime: string;
    endTime: string;
    status: 'AVAILABLE' | 'BOOKED' | 'MAINTENANCE';
    bookingId?: string;
}
export interface DayAvailability {
    date: string;
    slots: TimeSlot[];
}
export interface AvailabilityParams {
    groundId: string;
    startDate: string;
    endDate: string;
    maintenanceWindows?: MaintenanceWindow[];
}
export interface MaintenanceWindow {
    id: string;
    startDateTime: string;
    endDateTime: string;
}
/**
 * Service for calculating ground availability combining bookings and maintenance
 */
export declare class AvailabilityService {
    /**
     * Get availability for a ground across a date range
     * This method combines booking data and maintenance windows to determine
     * which time slots are available, booked, or under maintenance
     *
     * @param params - Parameters including ground ID, date range, and maintenance windows
     * @returns Array of daily availability with time slots
     */
    getAvailability(params: AvailabilityParams): Promise<DayAvailability[]>;
    /**
     * Generate availability for a single day
     */
    private generateDayAvailability;
    /**
     * Determine the status of a time slot
     */
    private determineSlotStatus;
    /**
     * Check if a time slot overlaps with a maintenance window
     */
    private overlapsWithMaintenance;
    /**
     * Convert time string (HH:MM or Time object) to minutes since midnight
     */
    private timeStringToMinutes;
    /**
     * Format date as YYYY-MM-DD
     */
    private formatDate;
    /**
     * Format time as HH:MM
     */
    private formatTime;
}
export declare const availabilityService: AvailabilityService;
//# sourceMappingURL=availability.service.d.ts.map