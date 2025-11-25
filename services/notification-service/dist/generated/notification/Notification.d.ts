import type { NotificationType as _notification_NotificationType, NotificationType__Output as _notification_NotificationType__Output } from '../notification/NotificationType';
import type { DeliveryStatus as _notification_DeliveryStatus, DeliveryStatus__Output as _notification_DeliveryStatus__Output } from '../notification/DeliveryStatus';
export interface Notification {
    'id'?: (string);
    'userId'?: (string);
    'bookingId'?: (string);
    'type'?: (_notification_NotificationType);
    'subject'?: (string);
    'message'?: (string);
    'deliveryStatus'?: (_notification_DeliveryStatus);
    'sentAt'?: (string);
    'createdAt'?: (string);
}
export interface Notification__Output {
    'id': (string);
    'userId': (string);
    'bookingId': (string);
    'type': (_notification_NotificationType__Output);
    'subject': (string);
    'message': (string);
    'deliveryStatus': (_notification_DeliveryStatus__Output);
    'sentAt': (string);
    'createdAt': (string);
}
//# sourceMappingURL=Notification.d.ts.map