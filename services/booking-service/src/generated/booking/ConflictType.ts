// Original file: src/proto/booking.proto

export const ConflictType = {
  NONE: 'NONE',
  BOOKING_CONFLICT: 'BOOKING_CONFLICT',
  MAINTENANCE_CONFLICT: 'MAINTENANCE_CONFLICT',
  INVALID_TIME_RANGE: 'INVALID_TIME_RANGE',
  PAST_DATE: 'PAST_DATE',
} as const;

export type ConflictType =
  | 'NONE'
  | 0
  | 'BOOKING_CONFLICT'
  | 1
  | 'MAINTENANCE_CONFLICT'
  | 2
  | 'INVALID_TIME_RANGE'
  | 3
  | 'PAST_DATE'
  | 4

export type ConflictType__Output = typeof ConflictType[keyof typeof ConflictType]
