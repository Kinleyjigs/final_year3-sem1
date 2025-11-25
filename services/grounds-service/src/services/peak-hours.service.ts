import { PrismaClient } from '@prisma/client';
import { ValidationError } from '@one-stop-book/common';

interface PeakHoursConfig {
  [day: string]: string[]; // e.g., { "monday": ["18:00-20:00", "07:00-09:00"] }
}

export class PeakHoursService {
  constructor(private readonly prisma: PrismaClient) {}

  /**
   * T114: Check if a given datetime falls within peak hours for a ground
   * Parses JSONB peakHours field, matches day of week, checks time range
   */
  async isPeakTime(groundId: string, dateTime: Date): Promise<boolean> {
    // 1. Get ground with peak hours configuration
    const ground = await this.prisma.ground.findUnique({
      where: { id: groundId },
      select: { peakHours: true, timezone: true },
    });

    if (!ground) {
      throw new ValidationError('Ground not found');
    }

    // 2. If no peak hours configured, return false
    if (!ground.peakHours || typeof ground.peakHours !== 'object') {
      return false;
    }

    const peakHoursConfig = ground.peakHours as PeakHoursConfig;

    // If empty object, return false
    if (Object.keys(peakHoursConfig).length === 0) {
      return false;
    }

    // 3. Get day of week from dateTime (convert to ground's timezone if needed)
    const dayNames = [
      'sunday',
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
    ];

    // For timezone support, you would use a library like date-fns-tz
    // For now, using local time
    const dayOfWeek = dayNames[dateTime.getDay()];

    // 4. Check if this day has peak hours defined
    const dayPeakHours = peakHoursConfig[dayOfWeek];

    if (!dayPeakHours || !Array.isArray(dayPeakHours)) {
      return false;
    }

    // 5. Extract time from dateTime
    const timeString = this.formatTime(dateTime);

    // 6. Check if time falls within any peak hour range for this day
    for (const timeRange of dayPeakHours) {
      if (this.isTimeInRange(timeString, timeRange)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Format date to HH:MM string
   */
  private formatTime(date: Date): string {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  /**
   * Check if a time falls within a time range
   * @param time - Time string in HH:MM format (e.g., "19:00")
   * @param range - Range string in HH:MM-HH:MM format (e.g., "18:00-20:00")
   */
  private isTimeInRange(time: string, range: string): boolean {
    try {
      const [startTime, endTime] = range.split('-');

      if (!startTime || !endTime) {
        return false; // Invalid range format
      }

      const timeMinutes = this.timeToMinutes(time);
      const startMinutes = this.timeToMinutes(startTime);
      const endMinutes = this.timeToMinutes(endTime);

      // Handle overnight ranges (e.g., "22:00-02:00")
      if (endMinutes < startMinutes) {
        // Time wraps around midnight
        return timeMinutes >= startMinutes || timeMinutes < endMinutes;
      }

      // Normal range (start < end)
      return timeMinutes >= startMinutes && timeMinutes < endMinutes;
    } catch (_error) {
      return false; // Invalid format, treat as not in range
    }
  }

  /**
   * Convert time string (HH:MM) to minutes since midnight
   */
  private timeToMinutes(timeStr: string): number {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  }

  /**
   * Get peak hours configuration for a ground
   */
  async getPeakHours(groundId: string): Promise<PeakHoursConfig | null> {
    const ground = await this.prisma.ground.findUnique({
      where: { id: groundId },
      select: { peakHours: true },
    });

    if (!ground || !ground.peakHours) {
      return null;
    }

    return ground.peakHours as PeakHoursConfig;
  }

  /**
   * Update peak hours configuration for a ground
   * (Admin functionality)
   */
  async updatePeakHours(
    groundId: string,
    peakHours: PeakHoursConfig
  ): Promise<void> {
    // Validate format
    this.validatePeakHoursConfig(peakHours);

    await this.prisma.ground.update({
      where: { id: groundId },
      data: { peakHours },
    });
  }

  /**
   * Validate peak hours configuration format
   */
  private validatePeakHoursConfig(config: PeakHoursConfig): void {
    const validDays = [
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
      'sunday',
    ];

    for (const [day, ranges] of Object.entries(config)) {
      if (!validDays.includes(day.toLowerCase())) {
        throw new ValidationError(
          `Invalid day: ${day}. Must be one of: ${validDays.join(', ')}`
        );
      }

      if (!Array.isArray(ranges)) {
        throw new ValidationError(
          `Peak hours for ${day} must be an array of time ranges`
        );
      }

      for (const range of ranges) {
        if (!this.isValidTimeRange(range)) {
          throw new ValidationError(
            `Invalid time range format: ${range}. Expected format: HH:MM-HH:MM`
          );
        }
      }
    }
  }

  /**
   * Validate time range format (HH:MM-HH:MM)
   */
  private isValidTimeRange(range: string): boolean {
    const timeRangeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]-([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRangeRegex.test(range);
  }
}
