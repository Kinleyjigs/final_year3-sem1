"use strict";
// Shared TypeScript types and interfaces
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeliveryStatus = exports.NotificationType = exports.BookingStatus = exports.Role = void 0;
var Role;
(function (Role) {
    Role["VISITOR"] = "VISITOR";
    Role["USER"] = "USER";
    Role["ADMIN"] = "ADMIN";
})(Role || (exports.Role = Role = {}));
var BookingStatus;
(function (BookingStatus) {
    BookingStatus["PENDING"] = "PENDING";
    BookingStatus["APPROVED"] = "APPROVED";
    BookingStatus["REJECTED"] = "REJECTED";
    BookingStatus["CANCELED"] = "CANCELED";
})(BookingStatus || (exports.BookingStatus = BookingStatus = {}));
var NotificationType;
(function (NotificationType) {
    NotificationType["CONFIRMATION"] = "CONFIRMATION";
    NotificationType["APPROVAL"] = "APPROVAL";
    NotificationType["REJECTION"] = "REJECTION";
    NotificationType["CANCELLATION"] = "CANCELLATION";
    NotificationType["REMINDER"] = "REMINDER";
    NotificationType["MAINTENANCE_CANCELLATION"] = "MAINTENANCE_CANCELLATION";
})(NotificationType || (exports.NotificationType = NotificationType = {}));
var DeliveryStatus;
(function (DeliveryStatus) {
    DeliveryStatus["PENDING"] = "PENDING";
    DeliveryStatus["SENT"] = "SENT";
    DeliveryStatus["FAILED"] = "FAILED";
})(DeliveryStatus || (exports.DeliveryStatus = DeliveryStatus = {}));
//# sourceMappingURL=types.js.map