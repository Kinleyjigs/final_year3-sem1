import request from 'supertest';
import { app } from '../../src/server';
import { BookingClient } from '@one-stop-book/grpc-clients';

// Mock gRPC clients
jest.mock('@one-stop-book/grpc-clients', () => ({
  BookingClient: {
    createBooking: jest.fn(),
    checkConflict: jest.fn(),
  },
  GroundsClient: {
    getGround: jest.fn(),
    isPeakTime: jest.fn(),
  },
  AuthClient: {
    verifyToken: jest.fn(),
  },
}));

describe('POST /api/bookings - Concurrent Booking Requests', () => {
  const validToken = 'valid-jwt-token';
  const userId = '123e4567-e89b-12d3-a456-426614174000';
  const groundId = '987e6543-e21b-12d3-a456-426614174000';

  const bookingPayload = {
    groundId,
    bookingDate: '2025-12-10',
    startTime: '14:00',
    endTime: '16:00',
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock auth verification
    (AuthClient.verifyToken as jest.Mock).mockResolvedValue({
      userId,
      email: '[email protected]',
      role: 'USER',
    });

    // Mock ground exists
    (GroundsClient.getGround as jest.Mock).mockResolvedValue({
      id: groundId,
      name: 'Main Field',
      college: 'Royal University of Bhutan',
      isActive: true,
    });

    // Mock peak hours check
    (GroundsClient.isPeakTime as jest.Mock).mockResolvedValue({
      isPeak: false,
    });
  });

  it('should allow only one booking when two concurrent requests for same slot', async () => {
    let conflictCallCount = 0;

    // First request passes conflict check
    // Second request finds conflict
    (BookingClient.checkConflict as jest.Mock).mockImplementation(() => {
      conflictCallCount++;
      return Promise.resolve({ hasConflict: conflictCallCount > 1 });
    });

    // Mock successful booking creation for first request
    (BookingClient.createBooking as jest.Mock).mockResolvedValueOnce({
      id: 'booking-1',
      ...bookingPayload,
      userId,
      status: 'APPROVED',
      confirmationCode: 'BK1A2B3C4D5E6F7G',
      createdAt: new Date().toISOString(),
    });

    // Send two concurrent requests
    const [response1, response2] = await Promise.all([
      request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${validToken}`)
        .send(bookingPayload),
      request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${validToken}`)
        .send(bookingPayload),
    ]);

    // One should succeed, one should fail
    const responses = [response1, response2];
    const successResponses = responses.filter((r) => r.status === 201);
    const conflictResponses = responses.filter((r) => r.status === 409);

    expect(successResponses).toHaveLength(1);
    expect(conflictResponses).toHaveLength(1);

    expect(successResponses[0].body).toHaveProperty('id');
    expect(successResponses[0].body).toHaveProperty('confirmationCode');

    expect(conflictResponses[0].body).toHaveProperty('error');
    expect(conflictResponses[0].body.error).toContain('no longer available');
  });

  it('should handle three concurrent requests for same slot (only one succeeds)', async () => {
    let requestCount = 0;

    (BookingClient.checkConflict as jest.Mock).mockImplementation(() => {
      requestCount++;
      return Promise.resolve({ hasConflict: requestCount > 1 });
    });

    (BookingClient.createBooking as jest.Mock).mockResolvedValueOnce({
      id: 'booking-1',
      ...bookingPayload,
      userId,
      status: 'APPROVED',
      confirmationCode: 'BK1A2B3C4D5E6F7G',
    });

    const [response1, response2, response3] = await Promise.all([
      request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${validToken}`)
        .send(bookingPayload),
      request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${validToken}`)
        .send(bookingPayload),
      request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${validToken}`)
        .send(bookingPayload),
    ]);

    const responses = [response1, response2, response3];
    const successResponses = responses.filter((r) => r.status === 201);
    const conflictResponses = responses.filter((r) => r.status === 409);

    expect(successResponses).toHaveLength(1);
    expect(conflictResponses).toHaveLength(2);
  });

  it('should allow concurrent bookings for different time slots on same ground', async () => {
    (BookingClient.checkConflict as jest.Mock).mockResolvedValue({
      hasConflict: false,
    });

    (BookingClient.createBooking as jest.Mock)
      .mockResolvedValueOnce({
        id: 'booking-1',
        groundId,
        bookingDate: '2025-12-10',
        startTime: '14:00',
        endTime: '16:00',
        userId,
        status: 'APPROVED',
        confirmationCode: 'BK1A2B3C4D5E6F7G',
      })
      .mockResolvedValueOnce({
        id: 'booking-2',
        groundId,
        bookingDate: '2025-12-10',
        startTime: '16:00',
        endTime: '18:00',
        userId,
        status: 'APPROVED',
        confirmationCode: 'BK9H8G7F6E5D4C3B',
      });

    const [response1, response2] = await Promise.all([
      request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${validToken}`)
        .send({
          groundId,
          bookingDate: '2025-12-10',
          startTime: '14:00',
          endTime: '16:00',
        }),
      request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${validToken}`)
        .send({
          groundId,
          bookingDate: '2025-12-10',
          startTime: '16:00', // Adjacent slot
          endTime: '18:00',
        }),
    ]);

    expect(response1.status).toBe(201);
    expect(response2.status).toBe(201);
    expect(response1.body.id).not.toBe(response2.body.id);
  });

  it('should allow concurrent bookings for same time slot on different grounds', async () => {
    const ground2Id = 'another-ground-id';

    (BookingClient.checkConflict as jest.Mock).mockResolvedValue({
      hasConflict: false,
    });

    (GroundsClient.getGround as jest.Mock)
      .mockResolvedValueOnce({
        id: groundId,
        name: 'Main Field',
        isActive: true,
      })
      .mockResolvedValueOnce({
        id: ground2Id,
        name: 'Secondary Field',
        isActive: true,
      });

    (BookingClient.createBooking as jest.Mock)
      .mockResolvedValueOnce({
        id: 'booking-1',
        groundId,
        bookingDate: '2025-12-10',
        startTime: '14:00',
        endTime: '16:00',
        userId,
        status: 'APPROVED',
        confirmationCode: 'BK1A2B3C4D5E6F7G',
      })
      .mockResolvedValueOnce({
        id: 'booking-2',
        groundId: ground2Id,
        bookingDate: '2025-12-10',
        startTime: '14:00',
        endTime: '16:00',
        userId,
        status: 'APPROVED',
        confirmationCode: 'BK9H8G7F6E5D4C3B',
      });

    const [response1, response2] = await Promise.all([
      request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${validToken}`)
        .send({
          groundId,
          bookingDate: '2025-12-10',
          startTime: '14:00',
          endTime: '16:00',
        }),
      request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${validToken}`)
        .send({
          groundId: ground2Id, // Different ground
          bookingDate: '2025-12-10',
          startTime: '14:00',
          endTime: '16:00',
        }),
    ]);

    expect(response1.status).toBe(201);
    expect(response2.status).toBe(201);
  });

  it('should handle database locking timeout gracefully', async () => {
    (BookingClient.checkConflict as jest.Mock).mockRejectedValue(
      new Error('Transaction timeout: lock wait timeout exceeded')
    );

    const response = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${validToken}`)
      .send(bookingPayload);

    expect(response.status).toBe(503); // Service Unavailable
    expect(response.body.error).toContain('temporarily unavailable');
  });

  it('should return proper error when concurrent booking wins race', async () => {
    (BookingClient.checkConflict as jest.Mock).mockResolvedValue({
      hasConflict: true,
    });

    const response = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${validToken}`)
      .send(bookingPayload);

    expect(response.status).toBe(409);
    expect(response.body).toMatchObject({
      error: expect.stringContaining('no longer available'),
      code: 'BOOKING_CONFLICT',
    });
  });

  it('should verify conflict check is called before booking creation', async () => {
    (BookingClient.checkConflict as jest.Mock).mockResolvedValue({
      hasConflict: false,
    });

    (BookingClient.createBooking as jest.Mock).mockResolvedValue({
      id: 'booking-1',
      ...bookingPayload,
      userId,
      status: 'APPROVED',
      confirmationCode: 'BK1A2B3C4D5E6F7G',
    });

    await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${validToken}`)
      .send(bookingPayload);

    expect(BookingClient.checkConflict).toHaveBeenCalledBefore(
      BookingClient.createBooking as jest.Mock
    );
  });

  it('should not create booking if conflict check fails', async () => {
    (BookingClient.checkConflict as jest.Mock).mockResolvedValue({
      hasConflict: true,
    });

    await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${validToken}`)
      .send(bookingPayload);

    expect(BookingClient.createBooking).not.toHaveBeenCalled();
  });

  it('should handle rapid sequential requests (100ms apart)', async () => {
    let callCount = 0;

    (BookingClient.checkConflict as jest.Mock).mockImplementation(() => {
      callCount++;
      return Promise.resolve({ hasConflict: callCount > 1 });
    });

    (BookingClient.createBooking as jest.Mock).mockResolvedValueOnce({
      id: 'booking-1',
      ...bookingPayload,
      userId,
      status: 'APPROVED',
      confirmationCode: 'BK1A2B3C4D5E6F7G',
    });

    const response1 = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${validToken}`)
      .send(bookingPayload);

    await new Promise((resolve) => setTimeout(resolve, 100));

    const response2 = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${validToken}`)
      .send(bookingPayload);

    expect(response1.status).toBe(201);
    expect(response2.status).toBe(409);
  });
});
