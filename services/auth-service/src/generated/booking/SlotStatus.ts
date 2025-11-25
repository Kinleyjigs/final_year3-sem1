// Original file: src/proto/booking.proto

export const SlotStatus = {
  AVAILABLE: 'AVAILABLE',
  BOOKED: 'BOOKED',
  MAINTENANCE: 'MAINTENANCE',
} as const;

export type SlotStatus =
  | 'AVAILABLE'
  | 0
  | 'BOOKED'
  | 1
  | 'MAINTENANCE'
  | 2

export type SlotStatus__Output = typeof SlotStatus[keyof typeof SlotStatus]
