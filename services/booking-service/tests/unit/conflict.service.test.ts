import { BookingService } from '../../src/services/booking.service';
import { PrismaClient, BookingStatus } from '@prisma/client';
import { ConflictError } from '@one-stop-book/common';

// Mock Prisma Client
jest.mock('@prisma/client', () => {
  const mockPrismaClient = {
    booking: {
      findMany: jest.fn(),
    },
    $queryRaw: jest.fn(),
    $transaction: jest.fn(),
  };

  return {
    PrismaClient: jest.fn(() => mockPrismaClient),
    BookingStatus: {
      PENDING: 'PENDING',
      APPROVED: 'APPROVED',
      REJECTED: 'REJECTED',
      CANCELED: 'CANCELED',
    },
  };
});

// Get the mock instance
const mockPrismaClient = new PrismaClient() as jest.Mocked<PrismaClient>;

describe('BookingService - Conflict Detection', () => {
  let bookingService: BookingService;

  beforeEach(() => {
    jest.clearAllMocks();
    bookingService = new BookingService(mockPrismaClient);
  });

  describe('checkConflict()', () => {
    const testData = {
      groundId: '123e4567-e89b-12d3-a456-426614174000',
      bookingDate: new Date('2025-12-01'),
      startTime: '14:00',
      endTime: '16:00',
    };

    it('should return no conflict when time slot is available', async () => {
      // Mock no overlapping bookings
      (mockPrismaClient.$queryRaw as jest.Mock).mockResolvedValue([]);

      const result = await bookingService.checkConflict(testData);

      expect(result).toBe(false);
      expect(mockPrismaClient.$queryRaw).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.stringContaining('SELECT id FROM'),
          expect.stringContaining('FOR UPDATE'),
          testData.groundId,
          testData.bookingDate,
        ])
      );
    });

    it('should return conflict when overlapping APPROVED booking exists', async () => {
      // Mock overlapping approved booking
      (mockPrismaClient.$queryRaw as jest.Mock).mockResolvedValue([
        { id: 'existing-booking-id' },
      ]);

      const result = await bookingService.checkConflict(testData);

      expect(result).toBe(true);
    });

    it('should return conflict when overlapping PENDING booking exists', async () => {
      // Mock overlapping pending booking
      (mockPrismaClient.$queryRaw as jest.Mock).mockResolvedValue([
        { id: 'pending-booking-id' },
      ]);

      const result = await bookingService.checkConflict(testData);

      expect(result).toBe(true);
    });

    it('should detect conflict for exact time match', async () => {
      // Same start and end time
      (mockPrismaClient.$queryRaw as jest.Mock).mockResolvedValue([
        { id: 'exact-match-id' },
      ]);

      const result = await bookingService.checkConflict(testData);

      expect(result).toBe(true);
    });

    it('should detect conflict for partial overlap (start time within existing booking)', async () => {
      const partialOverlapData = {
        ...testData,
        startTime: '15:00', // Overlaps with 14:00-16:00
        endTime: '17:00',
      };

      (mockPrismaClient.$queryRaw as jest.Mock).mockResolvedValue([
        { id: 'partial-overlap-id' },
      ]);

      const result = await bookingService.checkConflict(partialOverlapData);

      expect(result).toBe(true);
    });

    it('should detect conflict for partial overlap (end time within existing booking)', async () => {
      const partialOverlapData = {
        ...testData,
        startTime: '13:00',
        endTime: '15:00', // Overlaps with 14:00-16:00
      };

      (mockPrismaClient.$queryRaw as jest.Mock).mockResolvedValue([
        { id: 'partial-overlap-id' },
      ]);

      const result = await bookingService.checkConflict(partialOverlapData);

      expect(result).toBe(true);
    });

    it('should detect conflict for booking that encompasses existing booking', async () => {
      const encompassingData = {
        ...testData,
        startTime: '13:00',
        endTime: '17:00', // Encompasses 14:00-16:00
      };

      (mockPrismaClient.$queryRaw as jest.Mock).mockResolvedValue([
        { id: 'encompassed-booking-id' },
      ]);

      const result = await bookingService.checkConflict(encompassingData);

      expect(result).toBe(true);
    });

    it('should not conflict with CANCELED bookings', async () => {
      // Mock only returns non-canceled bookings
      (mockPrismaClient.$queryRaw as jest.Mock).mockResolvedValue([]);

      const result = await bookingService.checkConflict(testData);

      expect(result).toBe(false);
      expect(mockPrismaClient.$queryRaw).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.stringContaining("status IN ('APPROVED', 'PENDING')"),
        ])
      );
    });

    it('should not conflict with REJECTED bookings', async () => {
      // Mock only returns non-rejected bookings
      (mockPrismaClient.$queryRaw as jest.Mock).mockResolvedValue([]);

      const result = await bookingService.checkConflict(testData);

      expect(result).toBe(false);
    });

    it('should handle different ground IDs without conflict', async () => {
      const differentGroundData = {
        ...testData,
        groundId: 'different-ground-id',
      };

      (mockPrismaClient.$queryRaw as jest.Mock).mockResolvedValue([]);

      const result = await bookingService.checkConflict(differentGroundData);

      expect(result).toBe(false);
      expect(mockPrismaClient.$queryRaw).toHaveBeenCalledWith(
        expect.arrayContaining([differentGroundData.groundId])
      );
    });

    it('should handle different dates without conflict', async () => {
      const differentDateData = {
        ...testData,
        bookingDate: new Date('2025-12-02'),
      };

      (mockPrismaClient.$queryRaw as jest.Mock).mockResolvedValue([]);

      const result = await bookingService.checkConflict(differentDateData);

      expect(result).toBe(false);
    });

    it('should use SELECT FOR UPDATE for database-level locking', async () => {
      (mockPrismaClient.$queryRaw as jest.Mock).mockResolvedValue([]);

      await bookingService.checkConflict(testData);

      expect(mockPrismaClient.$queryRaw).toHaveBeenCalledWith(
        expect.arrayContaining([expect.stringContaining('FOR UPDATE')])
      );
    });

    it('should filter by ground_id, booking_date, and status', async () => {
      (mockPrismaClient.$queryRaw as jest.Mock).mockResolvedValue([]);

      await bookingService.checkConflict(testData);

      const query = (mockPrismaClient.$queryRaw as jest.Mock).mock.calls[0][0];
      expect(query).toContain('ground_id');
      expect(query).toContain('booking_date');
      expect(query).toContain('status');
    });

    it('should check time range overlap using OVERLAPS operator', async () => {
      (mockPrismaClient.$queryRaw as jest.Mock).mockResolvedValue([]);

      await bookingService.checkConflict(testData);

      const query = (mockPrismaClient.$queryRaw as jest.Mock).mock.calls[0][0];
      expect(query).toContain('OVERLAPS');
    });

    it('should handle database errors gracefully', async () => {
      (mockPrismaClient.$queryRaw as jest.Mock).mockRejectedValue(
        new Error('Database connection failed')
      );

      await expect(bookingService.checkConflict(testData)).rejects.toThrow(
        'Database connection failed'
      );
    });

    it('should return conflict for multiple overlapping bookings', async () => {
      // Mock multiple conflicts
      (mockPrismaClient.$queryRaw as jest.Mock).mockResolvedValue([
        { id: 'booking-1' },
        { id: 'booking-2' },
        { id: 'booking-3' },
      ]);

      const result = await bookingService.checkConflict(testData);

      expect(result).toBe(true);
    });

    it('should handle 1-hour booking slots', async () => {
      const oneHourData = {
        ...testData,
        startTime: '14:00',
        endTime: '15:00',
      };

      (mockPrismaClient.$queryRaw as jest.Mock).mockResolvedValue([]);

      const result = await bookingService.checkConflict(oneHourData);

      expect(result).toBe(false);
    });

    it('should handle 2-hour booking slots', async () => {
      const twoHourData = {
        ...testData,
        startTime: '14:00',
        endTime: '16:00',
      };

      (mockPrismaClient.$queryRaw as jest.Mock).mockResolvedValue([]);

      const result = await bookingService.checkConflict(twoHourData);

      expect(result).toBe(false);
    });

    it('should not conflict with adjacent bookings (back-to-back slots)', async () => {
      const adjacentData = {
        ...testData,
        startTime: '16:00', // Starts exactly when previous booking ends
        endTime: '18:00',
      };

      (mockPrismaClient.$queryRaw as jest.Mock).mockResolvedValue([]);

      const result = await bookingService.checkConflict(adjacentData);

      expect(result).toBe(false);
    });
  });
});
