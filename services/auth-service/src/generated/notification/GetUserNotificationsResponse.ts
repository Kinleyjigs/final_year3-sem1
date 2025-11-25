// Original file: src/proto/notification.proto

import type { Notification as _notification_Notification, Notification__Output as _notification_Notification__Output } from '../notification/Notification';

export interface GetUserNotificationsResponse {
  'notifications'?: (_notification_Notification)[];
  'total'?: (number);
}

export interface GetUserNotificationsResponse__Output {
  'notifications': (_notification_Notification__Output)[];
  'total': (number);
}
