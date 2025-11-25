// Original file: src/proto/notification.proto

export const NotificationType = {
  CONFIRMATION: 'CONFIRMATION',
  APPROVAL: 'APPROVAL',
  REJECTION: 'REJECTION',
  CANCELLATION: 'CANCELLATION',
  REMINDER: 'REMINDER',
  MAINTENANCE_CANCELLATION: 'MAINTENANCE_CANCELLATION',
} as const;

export type NotificationType =
  | 'CONFIRMATION'
  | 0
  | 'APPROVAL'
  | 1
  | 'REJECTION'
  | 2
  | 'CANCELLATION'
  | 3
  | 'REMINDER'
  | 4
  | 'MAINTENANCE_CANCELLATION'
  | 5

export type NotificationType__Output = typeof NotificationType[keyof typeof NotificationType]
