// Original file: src/proto/notification.proto


export interface RetryFailedNotificationsResponse {
  'retriedCount'?: (number);
  'successCount'?: (number);
  'failedCount'?: (number);
}

export interface RetryFailedNotificationsResponse__Output {
  'retriedCount': (number);
  'successCount': (number);
  'failedCount': (number);
}
