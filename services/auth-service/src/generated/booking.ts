import type * as grpc from '@grpc/grpc-js';
import type { EnumTypeDefinition, MessageTypeDefinition } from '@grpc/proto-loader';

import type { BookingServiceClient as _booking_BookingServiceClient, BookingServiceDefinition as _booking_BookingServiceDefinition } from './booking/BookingService';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  booking: {
    ApproveBookingRequest: MessageTypeDefinition
    Booking: MessageTypeDefinition
    BookingService: SubtypeConstructor<typeof grpc.Client, _booking_BookingServiceClient> & { service: _booking_BookingServiceDefinition }
    BookingStatus: EnumTypeDefinition
    BookingWithUser: MessageTypeDefinition
    CancelBookingRequest: MessageTypeDefinition
    CheckConflictRequest: MessageTypeDefinition
    CheckConflictResponse: MessageTypeDefinition
    ConflictInfo: MessageTypeDefinition
    ConflictType: EnumTypeDefinition
    CreateBookingRequest: MessageTypeDefinition
    CreateBookingResponse: MessageTypeDefinition
    DayAvailability: MessageTypeDefinition
    GetAvailabilityRequest: MessageTypeDefinition
    GetAvailabilityResponse: MessageTypeDefinition
    GetBookingRequest: MessageTypeDefinition
    GetCollegeBookingsRequest: MessageTypeDefinition
    GetCollegeBookingsResponse: MessageTypeDefinition
    GetGroundBookingsRequest: MessageTypeDefinition
    GetGroundBookingsResponse: MessageTypeDefinition
    GetUserBookingsRequest: MessageTypeDefinition
    GetUserBookingsResponse: MessageTypeDefinition
    RejectBookingRequest: MessageTypeDefinition
    SlotStatus: EnumTypeDefinition
    TimeSlot: MessageTypeDefinition
    UserInfo: MessageTypeDefinition
  }
}

