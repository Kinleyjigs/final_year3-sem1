import { PeakHoursService } from '../../src/services/peak-hours.service';
import { PrismaClient } from '@prisma/client';

// Mock Prisma Client
jest.mock('@prisma/client', () => {
  const mockPrismaClient = {
    ground: {
      findUnique: jest.fn(),
    },
  };

  return {
    PrismaClient: jest.fn(() => mockPrismaClient),
  };
});

// Get the mock instance
const mockPrismaClient = new PrismaClient() as jest.Mocked<PrismaClient>;

describe('PeakHoursService - Peak Hours Detection', () => {
  let peakHoursService: PeakHoursService;

  beforeEach(() => {
    jest.clearAllMocks();
    peakHoursService = new PeakHoursService(mockPrismaClient);
  });

  describe('isPeakTime()', () => {
    const groundId = '123e4567-e89b-12d3-a456-426614174000';

    it('should return false when ground has no peak hours configured', async () => {
      (mockPrismaClient.ground.findUnique as jest.Mock).mockResolvedValue({
        id: groundId,
        peakHours: null,
      });

      const result = await peakHoursService.isPeakTime(
        groundId,
        new Date('2025-12-01T14:00:00Z') // Monday 2PM
      );

      expect(result).toBe(false);
    });

    it('should return false when peak hours is empty object', async () => {
      (mockPrismaClient.ground.findUnique as jest.Mock).mockResolvedValue({
        id: groundId,
        peakHours: {},
      });

      const result = await peakHoursService.isPeakTime(
        groundId,
        new Date('2025-12-01T14:00:00Z')
      );

      expect(result).toBe(false);
    });

    it('should return true for Monday evening peak hours (18:00-20:00)', async () => {
      (mockPrismaClient.ground.findUnique as jest.Mock).mockResolvedValue({
        id: groundId,
        peakHours: {
          monday: ['18:00-20:00'],
        },
      });

      const result = await peakHoursService.isPeakTime(
        groundId,
        new Date('2025-12-01T19:00:00Z') // Monday 7PM
      );

      expect(result).toBe(true);
    });

    it('should return false for Monday non-peak hours', async () => {
      (mockPrismaClient.ground.findUnique as jest.Mock).mockResolvedValue({
        id: groundId,
        peakHours: {
          monday: ['18:00-20:00'],
        },
      });

      const result = await peakHoursService.isPeakTime(
        groundId,
        new Date('2025-12-01T14:00:00Z') // Monday 2PM
      );

      expect(result).toBe(false);
    });

    it('should return true for Saturday morning peak hours (09:00-12:00)', async () => {
      (mockPrismaClient.ground.findUnique as jest.Mock).mockResolvedValue({
        id: groundId,
        peakHours: {
          saturday: ['09:00-12:00'],
        },
      });

      const result = await peakHoursService.isPeakTime(
        groundId,
        new Date('2025-12-06T10:00:00Z') // Saturday 10AM
      );

      expect(result).toBe(true);
    });

    it('should handle multiple peak hour ranges for same day', async () => {
      (mockPrismaClient.ground.findUnique as jest.Mock).mockResolvedValue({
        id: groundId,
        peakHours: {
          monday: ['07:00-09:00', '18:00-20:00'],
        },
      });

      const morningResult = await peakHoursService.isPeakTime(
        groundId,
        new Date('2025-12-01T08:00:00Z') // Monday 8AM
      );

      const eveningResult = await peakHoursService.isPeakTime(
        groundId,
        new Date('2025-12-01T19:00:00Z') // Monday 7PM
      );

      const midDayResult = await peakHoursService.isPeakTime(
        groundId,
        new Date('2025-12-01T14:00:00Z') // Monday 2PM
      );

      expect(morningResult).toBe(true);
      expect(eveningResult).toBe(true);
      expect(midDayResult).toBe(false);
    });

    it('should handle peak hours across all weekdays', async () => {
      (mockPrismaClient.ground.findUnique as jest.Mock).mockResolvedValue({
        id: groundId,
        peakHours: {
          monday: ['18:00-20:00'],
          tuesday: ['18:00-20:00'],
          wednesday: ['18:00-20:00'],
          thursday: ['18:00-20:00'],
          friday: ['18:00-20:00'],
          saturday: ['09:00-12:00'],
          sunday: ['09:00-12:00'],
        },
      });

      const mondayResult = await peakHoursService.isPeakTime(
        groundId,
        new Date('2025-12-01T19:00:00Z') // Monday 7PM
      );

      const saturdayResult = await peakHoursService.isPeakTime(
        groundId,
        new Date('2025-12-06T10:00:00Z') // Saturday 10AM
      );

      expect(mondayResult).toBe(true);
      expect(saturdayResult).toBe(true);
    });

    it('should correctly parse day of week from date (case-insensitive)', async () => {
      (mockPrismaClient.ground.findUnique as jest.Mock).mockResolvedValue({
        id: groundId,
        peakHours: {
          monday: ['18:00-20:00'],
        },
      });

      const result = await peakHoursService.isPeakTime(
        groundId,
        new Date('2025-12-01T19:00:00Z') // Monday
      );

      expect(result).toBe(true);
    });

    it('should return false when day has no peak hours defined', async () => {
      (mockPrismaClient.ground.findUnique as jest.Mock).mockResolvedValue({
        id: groundId,
        peakHours: {
          monday: ['18:00-20:00'],
        },
      });

      const result = await peakHoursService.isPeakTime(
        groundId,
        new Date('2025-12-02T19:00:00Z') // Tuesday 7PM
      );

      expect(result).toBe(false);
    });

    it('should handle time at exact start of peak hour range', async () => {
      (mockPrismaClient.ground.findUnique as jest.Mock).mockResolvedValue({
        id: groundId,
        peakHours: {
          monday: ['18:00-20:00'],
        },
      });

      const result = await peakHoursService.isPeakTime(
        groundId,
        new Date('2025-12-01T18:00:00Z') // Monday 6PM exact
      );

      expect(result).toBe(true);
    });

    it('should handle time at exact end of peak hour range', async () => {
      (mockPrismaClient.ground.findUnique as jest.Mock).mockResolvedValue({
        id: groundId,
        peakHours: {
          monday: ['18:00-20:00'],
        },
      });

      const result = await peakHoursService.isPeakTime(
        groundId,
        new Date('2025-12-01T20:00:00Z') // Monday 8PM exact
      );

      expect(result).toBe(false); // End time is exclusive
    });

    it('should handle time just before peak hour range', async () => {
      (mockPrismaClient.ground.findUnique as jest.Mock).mockResolvedValue({
        id: groundId,
        peakHours: {
          monday: ['18:00-20:00'],
        },
      });

      const result = await peakHoursService.isPeakTime(
        groundId,
        new Date('2025-12-01T17:59:00Z') // Monday 5:59PM
      );

      expect(result).toBe(false);
    });

    it('should handle time just after peak hour range', async () => {
      (mockPrismaClient.ground.findUnique as jest.Mock).mockResolvedValue({
        id: groundId,
        peakHours: {
          monday: ['18:00-20:00'],
        },
      });

      const result = await peakHoursService.isPeakTime(
        groundId,
        new Date('2025-12-01T20:01:00Z') // Monday 8:01PM
      );

      expect(result).toBe(false);
    });

    it('should handle invalid time range format gracefully', async () => {
      (mockPrismaClient.ground.findUnique as jest.Mock).mockResolvedValue({
        id: groundId,
        peakHours: {
          monday: ['invalid-range'],
        },
      });

      const result = await peakHoursService.isPeakTime(
        groundId,
        new Date('2025-12-01T19:00:00Z')
      );

      expect(result).toBe(false);
    });

    it('should handle malformed JSONB data gracefully', async () => {
      (mockPrismaClient.ground.findUnique as jest.Mock).mockResolvedValue({
        id: groundId,
        peakHours: 'invalid-json',
      });

      await expect(
        peakHoursService.isPeakTime(groundId, new Date('2025-12-01T19:00:00Z'))
      ).rejects.toThrow();
    });

    it('should return false when ground not found', async () => {
      (mockPrismaClient.ground.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(
        peakHoursService.isPeakTime(groundId, new Date('2025-12-01T19:00:00Z'))
      ).rejects.toThrow('Ground not found');
    });

    it('should handle timezone-aware peak hour checks', async () => {
      (mockPrismaClient.ground.findUnique as jest.Mock).mockResolvedValue({
        id: groundId,
        timezone: 'Asia/Kolkata',
        peakHours: {
          monday: ['18:00-20:00'],
        },
      });

      // UTC time that converts to peak hour in IST
      const result = await peakHoursService.isPeakTime(
        groundId,
        new Date('2025-12-01T13:30:00Z') // 7PM IST
      );

      expect(result).toBe(true);
    });

    it('should handle overnight peak hours (crossing midnight)', async () => {
      (mockPrismaClient.ground.findUnique as jest.Mock).mockResolvedValue({
        id: groundId,
        peakHours: {
          friday: ['22:00-02:00'], // 10PM Friday to 2AM Saturday
        },
      });

      const beforeMidnight = await peakHoursService.isPeakTime(
        groundId,
        new Date('2025-12-05T23:00:00Z') // Friday 11PM
      );

      const afterMidnight = await peakHoursService.isPeakTime(
        groundId,
        new Date('2025-12-06T01:00:00Z') // Saturday 1AM
      );

      expect(beforeMidnight).toBe(true);
      expect(afterMidnight).toBe(true);
    });

    it('should handle 24-hour format correctly', async () => {
      (mockPrismaClient.ground.findUnique as jest.Mock).mockResolvedValue({
        id: groundId,
        peakHours: {
          monday: ['14:30-16:45'],
        },
      });

      const result = await peakHoursService.isPeakTime(
        groundId,
        new Date('2025-12-01T15:00:00Z')
      );

      expect(result).toBe(true);
    });

    it('should call prisma.ground.findUnique with correct parameters', async () => {
      (mockPrismaClient.ground.findUnique as jest.Mock).mockResolvedValue({
        id: groundId,
        peakHours: null,
      });

      await peakHoursService.isPeakTime(
        groundId,
        new Date('2025-12-01T14:00:00Z')
      );

      expect(mockPrismaClient.ground.findUnique).toHaveBeenCalledWith({
        where: { id: groundId },
        select: { peakHours: true, timezone: true },
      });
    });

    it('should handle database errors gracefully', async () => {
      (mockPrismaClient.ground.findUnique as jest.Mock).mockRejectedValue(
        new Error('Database connection failed')
      );

      await expect(
        peakHoursService.isPeakTime(groundId, new Date('2025-12-01T19:00:00Z'))
      ).rejects.toThrow('Database connection failed');
    });
  });
});
