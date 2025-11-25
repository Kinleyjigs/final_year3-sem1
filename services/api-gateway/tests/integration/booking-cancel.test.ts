import request from 'supertest';
import { app } from '../../src/server';
import { BookingClient, AuthClient } from '@one-stop-book/grpc-clients';

// Mock gRPC clients
jest.mock('@one-stop-book/grpc-clients', () => ({
  BookingClient: {
    getBooking: jest.fn(),
    cancelBooking: jest.fn(),
  },
  AuthClient: {
    verifyToken: jest.fn(),
  },
}));

describe('DELETE /api/bookings/:id - Booking Cancellation', () => {
  const validToken = 'valid-jwt-token';
  const userId = '123e4567-e89b-12d3-a456-426614174000';
  const bookingId = 'booking-123';
  const groundId = '987e6543-e21b-12d3-a456-426614174000';

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock auth verification
    (AuthClient.verifyToken as jest.Mock).mockResolvedValue({
      userId,
      email: '[email protected]',
      role: 'USER',
    });
  });

  describe('Successful Cancellation', () => {
    it('should successfully cancel a PENDING booking', async () => {
      const futureDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days future

      (BookingClient.getBooking as jest.Mock).mockResolvedValue({
        id: bookingId,
        userId,
        groundId,
        bookingDate: futureDate.toISOString().split('T')[0],
        startTime: '14:00',
        endTime: '16:00',
        status: 'PENDING',
        confirmationCode: 'BK1A2B3C4D5E6F7G',
      });

      (BookingClient.cancelBooking as jest.Mock).mockResolvedValue({
        id: bookingId,
        status: 'CANCELED',
        cancellationReason: 'User requested cancellation',
      });

      const response = await request(app)
        .delete(`/api/bookings/${bookingId}`)
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        id: bookingId,
        status: 'CANCELED',
      });
      expect(BookingClient.cancelBooking).toHaveBeenCalledWith({
        bookingId,
        userId,
        reason: 'User requested cancellation',
      });
    });

    it('should successfully cancel an APPROVED booking', async () => {
      const futureDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

      (BookingClient.getBooking as jest.Mock).mockResolvedValue({
        id: bookingId,
        userId,
        groundId,
        bookingDate: futureDate.toISOString().split('T')[0],
        startTime: '14:00',
        endTime: '16:00',
        status: 'APPROVED',
        confirmationCode: 'BK1A2B3C4D5E6F7G',
      });

      (BookingClient.cancelBooking as jest.Mock).mockResolvedValue({
        id: bookingId,
        status: 'CANCELED',
      });

      const response = await request(app)
        .delete(`/api/bookings/${bookingId}`)
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('CANCELED');
    });

    it('should allow cancellation with custom reason', async () => {
      const futureDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

      (BookingClient.getBooking as jest.Mock).mockResolvedValue({
        id: bookingId,
        userId,
        groundId,
        bookingDate: futureDate.toISOString().split('T')[0],
        startTime: '14:00',
        endTime: '16:00',
        status: 'APPROVED',
      });

      (BookingClient.cancelBooking as jest.Mock).mockResolvedValue({
        id: bookingId,
        status: 'CANCELED',
        cancellationReason: 'Weather conditions',
      });

      const response = await request(app)
        .delete(`/api/bookings/${bookingId}`)
        .set('Authorization', `Bearer ${validToken}`)
        .send({ reason: 'Weather conditions' });

      expect(response.status).toBe(200);
      expect(BookingClient.cancelBooking).toHaveBeenCalledWith({
        bookingId,
        userId,
        reason: 'Weather conditions',
      });
    });
  });

  describe('Authorization Checks', () => {
    it('should reject cancellation by different user', async () => {
      const differentUserId = 'different-user-id';

      (BookingClient.getBooking as jest.Mock).mockResolvedValue({
        id: bookingId,
        userId: differentUserId, // Different user owns this booking
        groundId,
        bookingDate: '2025-12-10',
        startTime: '14:00',
        endTime: '16:00',
        status: 'APPROVED',
      });

      const response = await request(app)
        .delete(`/api/bookings/${bookingId}`)
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(403);
      expect(response.body.error).toContain('not authorized');
      expect(BookingClient.cancelBooking).not.toHaveBeenCalled();
    });

    it('should reject cancellation without authentication', async () => {
      const response = await request(app).delete(`/api/bookings/${bookingId}`);

      expect(response.status).toBe(401);
      expect(response.body.error).toContain('authentication required');
      expect(BookingClient.getBooking).not.toHaveBeenCalled();
    });

    it('should reject cancellation with invalid token', async () => {
      (AuthClient.verifyToken as jest.Mock).mockRejectedValue(
        new Error('Invalid token')
      );

      const response = await request(app)
        .delete(`/api/bookings/${bookingId}`)
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(401);
      expect(BookingClient.getBooking).not.toHaveBeenCalled();
    });
  });

  describe('Validation - Cannot Cancel Already Canceled Booking', () => {
    it('should reject cancellation of CANCELED booking', async () => {
      (BookingClient.getBooking as jest.Mock).mockResolvedValue({
        id: bookingId,
        userId,
        groundId,
        bookingDate: '2025-12-10',
        startTime: '14:00',
        endTime: '16:00',
        status: 'CANCELED',
        cancellationReason: 'Previously canceled',
      });

      const response = await request(app)
        .delete(`/api/bookings/${bookingId}`)
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('already canceled');
      expect(BookingClient.cancelBooking).not.toHaveBeenCalled();
    });

    it('should reject cancellation of REJECTED booking', async () => {
      (BookingClient.getBooking as jest.Mock).mockResolvedValue({
        id: bookingId,
        userId,
        groundId,
        bookingDate: '2025-12-10',
        startTime: '14:00',
        endTime: '16:00',
        status: 'REJECTED',
      });

      const response = await request(app)
        .delete(`/api/bookings/${bookingId}`)
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('cannot cancel rejected booking');
      expect(BookingClient.cancelBooking).not.toHaveBeenCalled();
    });
  });

  describe('Validation - Cannot Cancel Past Bookings', () => {
    it('should reject cancellation of past booking (date passed)', async () => {
      const pastDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // 7 days ago

      (BookingClient.getBooking as jest.Mock).mockResolvedValue({
        id: bookingId,
        userId,
        groundId,
        bookingDate: pastDate.toISOString().split('T')[0],
        startTime: '14:00',
        endTime: '16:00',
        status: 'APPROVED',
      });

      const response = await request(app)
        .delete(`/api/bookings/${bookingId}`)
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('cannot cancel past booking');
      expect(BookingClient.cancelBooking).not.toHaveBeenCalled();
    });

    it('should reject cancellation of booking that started (same day, past time)', async () => {
      const today = new Date().toISOString().split('T')[0];
      const currentHour = new Date().getHours();
      const pastTime = `${String(currentHour - 2).padStart(2, '0')}:00`;

      (BookingClient.getBooking as jest.Mock).mockResolvedValue({
        id: bookingId,
        userId,
        groundId,
        bookingDate: today,
        startTime: pastTime,
        endTime: `${String(currentHour).padStart(2, '0')}:00`,
        status: 'APPROVED',
      });

      const response = await request(app)
        .delete(`/api/bookings/${bookingId}`)
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('cannot cancel past booking');
    });

    it('should allow cancellation of future booking on same day', async () => {
      const today = new Date().toISOString().split('T')[0];
      const currentHour = new Date().getHours();
      const futureTime = `${String(currentHour + 2).padStart(2, '0')}:00`;

      (BookingClient.getBooking as jest.Mock).mockResolvedValue({
        id: bookingId,
        userId,
        groundId,
        bookingDate: today,
        startTime: futureTime,
        endTime: `${String(currentHour + 4).padStart(2, '0')}:00`,
        status: 'APPROVED',
      });

      (BookingClient.cancelBooking as jest.Mock).mockResolvedValue({
        id: bookingId,
        status: 'CANCELED',
      });

      const response = await request(app)
        .delete(`/api/bookings/${bookingId}`)
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('CANCELED');
    });
  });

  describe('Error Handling', () => {
    it('should return 404 when booking not found', async () => {
      (BookingClient.getBooking as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .delete(`/api/bookings/${bookingId}`)
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(404);
      expect(response.body.error).toContain('booking not found');
    });

    it('should handle database errors gracefully', async () => {
      (BookingClient.getBooking as jest.Mock).mockRejectedValue(
        new Error('Database connection failed')
      );

      const response = await request(app)
        .delete(`/api/bookings/${bookingId}`)
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(500);
      expect(response.body.error).toContain('failed to cancel booking');
    });

    it('should handle gRPC service unavailable', async () => {
      (BookingClient.getBooking as jest.Mock).mockRejectedValue(
        new Error('UNAVAILABLE: service not responding')
      );

      const response = await request(app)
        .delete(`/api/bookings/${bookingId}`)
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(503);
      expect(response.body.error).toContain('service temporarily unavailable');
    });
  });

  describe('Response Format', () => {
    it('should return canceled booking details in response', async () => {
      const futureDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

      (BookingClient.getBooking as jest.Mock).mockResolvedValue({
        id: bookingId,
        userId,
        groundId,
        bookingDate: futureDate.toISOString().split('T')[0],
        startTime: '14:00',
        endTime: '16:00',
        status: 'APPROVED',
        confirmationCode: 'BK1A2B3C4D5E6F7G',
      });

      (BookingClient.cancelBooking as jest.Mock).mockResolvedValue({
        id: bookingId,
        userId,
        groundId,
        bookingDate: futureDate.toISOString().split('T')[0],
        startTime: '14:00',
        endTime: '16:00',
        status: 'CANCELED',
        confirmationCode: 'BK1A2B3C4D5E6F7G',
        cancellationReason: 'User requested cancellation',
        updatedAt: new Date().toISOString(),
      });

      const response = await request(app)
        .delete(`/api/bookings/${bookingId}`)
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        id: bookingId,
        status: 'CANCELED',
        confirmationCode: 'BK1A2B3C4D5E6F7G',
        cancellationReason: 'User requested cancellation',
      });
    });
  });
});
