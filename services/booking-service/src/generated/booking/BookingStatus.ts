// Original file: src/proto/booking.proto

export const BookingStatus = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  CANCELED: 'CANCELED',
} as const;

export type BookingStatus =
  | 'PENDING'
  | 0
  | 'APPROVED'
  | 1
  | 'REJECTED'
  | 2
  | 'CANCELED'
  | 3

export type BookingStatus__Output = typeof BookingStatus[keyof typeof BookingStatus]
