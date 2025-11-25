import { PrismaClient } from '@prisma/client';
interface PeakHoursConfig {
    [day: string]: string[];
}
export declare class PeakHoursService {
    private readonly prisma;
    constructor(prisma: PrismaClient);
    /**
     * T114: Check if a given datetime falls within peak hours for a ground
     * Parses JSONB peakHours field, matches day of week, checks time range
     */
    isPeakTime(groundId: string, dateTime: Date): Promise<boolean>;
    /**
     * Format date to HH:MM string
     */
    private formatTime;
    /**
     * Check if a time falls within a time range
     * @param time - Time string in HH:MM format (e.g., "19:00")
     * @param range - Range string in HH:MM-HH:MM format (e.g., "18:00-20:00")
     */
    private isTimeInRange;
    /**
     * Convert time string (HH:MM) to minutes since midnight
     */
    private timeToMinutes;
    /**
     * Get peak hours configuration for a ground
     */
    getPeakHours(groundId: string): Promise<PeakHoursConfig | null>;
    /**
     * Update peak hours configuration for a ground
     * (Admin functionality)
     */
    updatePeakHours(groundId: string, peakHours: PeakHoursConfig): Promise<void>;
    /**
     * Validate peak hours configuration format
     */
    private validatePeakHoursConfig;
    /**
     * Validate time range format (HH:MM-HH:MM)
     */
    private isValidTimeRange;
}
export {};
//# sourceMappingURL=peak-hours.service.d.ts.map