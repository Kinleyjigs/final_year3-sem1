// Original file: src/proto/notification.proto

export const DeliveryStatus = {
  PENDING: 'PENDING',
  SENT: 'SENT',
  FAILED: 'FAILED',
} as const;

export type DeliveryStatus =
  | 'PENDING'
  | 0
  | 'SENT'
  | 1
  | 'FAILED'
  | 2

export type DeliveryStatus__Output = typeof DeliveryStatus[keyof typeof DeliveryStatus]
