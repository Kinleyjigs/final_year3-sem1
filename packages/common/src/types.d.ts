export declare enum Role {
    VISITOR = "VISITOR",
    USER = "USER",
    ADMIN = "ADMIN"
}
export declare enum BookingStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
    CANCELED = "CANCELED"
}
export declare enum NotificationType {
    CONFIRMATION = "CONFIRMATION",
    APPROVAL = "APPROVAL",
    REJECTION = "REJECTION",
    CANCELLATION = "CANCELLATION",
    REMINDER = "REMINDER",
    MAINTENANCE_CANCELLATION = "MAINTENANCE_CANCELLATION"
}
export declare enum DeliveryStatus {
    PENDING = "PENDING",
    SENT = "SENT",
    FAILED = "FAILED"
}
export interface User {
    id: string;
    email: string;
    fullName: string;
    college: string;
    role: Role;
    createdAt: Date;
    updatedAt: Date;
}
export interface Ground {
    id: string;
    name: string;
    college: string;
    location: string;
    description?: string;
    capacity: number;
    amenities: string[];
    peakHours?: Record<string, string[]>;
    photos: string[];
    isActive: boolean;
    timezone: string;
    adminUserId: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface Booking {
    id: string;
    userId: string;
    groundId: string;
    bookingDate: Date;
    startTime: string;
    endTime: string;
    status: BookingStatus;
    confirmationCode: string;
    cancellationReason?: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface MaintenanceSchedule {
    id: string;
    groundId: string;
    startDateTime: Date;
    endDateTime: Date;
    description: string;
    createdByUserId: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface Notification {
    id: string;
    userId: string;
    bookingId?: string;
    type: NotificationType;
    subject: string;
    message: string;
    deliveryStatus: DeliveryStatus;
    sentAt?: Date;
    createdAt: Date;
}
//# sourceMappingURL=types.d.ts.map