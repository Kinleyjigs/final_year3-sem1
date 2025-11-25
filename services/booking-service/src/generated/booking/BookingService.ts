// Original file: src/proto/booking.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { ApproveBookingRequest as _booking_ApproveBookingRequest, ApproveBookingRequest__Output as _booking_ApproveBookingRequest__Output } from '../booking/ApproveBookingRequest';
import type { Booking as _booking_Booking, Booking__Output as _booking_Booking__Output } from '../booking/Booking';
import type { CancelBookingRequest as _booking_CancelBookingRequest, CancelBookingRequest__Output as _booking_CancelBookingRequest__Output } from '../booking/CancelBookingRequest';
import type { CheckConflictRequest as _booking_CheckConflictRequest, CheckConflictRequest__Output as _booking_CheckConflictRequest__Output } from '../booking/CheckConflictRequest';
import type { CheckConflictResponse as _booking_CheckConflictResponse, CheckConflictResponse__Output as _booking_CheckConflictResponse__Output } from '../booking/CheckConflictResponse';
import type { CreateBookingRequest as _booking_CreateBookingRequest, CreateBookingRequest__Output as _booking_CreateBookingRequest__Output } from '../booking/CreateBookingRequest';
import type { CreateBookingResponse as _booking_CreateBookingResponse, CreateBookingResponse__Output as _booking_CreateBookingResponse__Output } from '../booking/CreateBookingResponse';
import type { GetAvailabilityRequest as _booking_GetAvailabilityRequest, GetAvailabilityRequest__Output as _booking_GetAvailabilityRequest__Output } from '../booking/GetAvailabilityRequest';
import type { GetAvailabilityResponse as _booking_GetAvailabilityResponse, GetAvailabilityResponse__Output as _booking_GetAvailabilityResponse__Output } from '../booking/GetAvailabilityResponse';
import type { GetBookingRequest as _booking_GetBookingRequest, GetBookingRequest__Output as _booking_GetBookingRequest__Output } from '../booking/GetBookingRequest';
import type { GetCollegeBookingsRequest as _booking_GetCollegeBookingsRequest, GetCollegeBookingsRequest__Output as _booking_GetCollegeBookingsRequest__Output } from '../booking/GetCollegeBookingsRequest';
import type { GetCollegeBookingsResponse as _booking_GetCollegeBookingsResponse, GetCollegeBookingsResponse__Output as _booking_GetCollegeBookingsResponse__Output } from '../booking/GetCollegeBookingsResponse';
import type { GetGroundBookingsRequest as _booking_GetGroundBookingsRequest, GetGroundBookingsRequest__Output as _booking_GetGroundBookingsRequest__Output } from '../booking/GetGroundBookingsRequest';
import type { GetGroundBookingsResponse as _booking_GetGroundBookingsResponse, GetGroundBookingsResponse__Output as _booking_GetGroundBookingsResponse__Output } from '../booking/GetGroundBookingsResponse';
import type { GetUserBookingsRequest as _booking_GetUserBookingsRequest, GetUserBookingsRequest__Output as _booking_GetUserBookingsRequest__Output } from '../booking/GetUserBookingsRequest';
import type { GetUserBookingsResponse as _booking_GetUserBookingsResponse, GetUserBookingsResponse__Output as _booking_GetUserBookingsResponse__Output } from '../booking/GetUserBookingsResponse';
import type { RejectBookingRequest as _booking_RejectBookingRequest, RejectBookingRequest__Output as _booking_RejectBookingRequest__Output } from '../booking/RejectBookingRequest';

export interface BookingServiceClient extends grpc.Client {
  ApproveBooking(argument: _booking_ApproveBookingRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_booking_Booking__Output>): grpc.ClientUnaryCall;
  ApproveBooking(argument: _booking_ApproveBookingRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_booking_Booking__Output>): grpc.ClientUnaryCall;
  ApproveBooking(argument: _booking_ApproveBookingRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_booking_Booking__Output>): grpc.ClientUnaryCall;
  ApproveBooking(argument: _booking_ApproveBookingRequest, callback: grpc.requestCallback<_booking_Booking__Output>): grpc.ClientUnaryCall;
  approveBooking(argument: _booking_ApproveBookingRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_booking_Booking__Output>): grpc.ClientUnaryCall;
  approveBooking(argument: _booking_ApproveBookingRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_booking_Booking__Output>): grpc.ClientUnaryCall;
  approveBooking(argument: _booking_ApproveBookingRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_booking_Booking__Output>): grpc.ClientUnaryCall;
  approveBooking(argument: _booking_ApproveBookingRequest, callback: grpc.requestCallback<_booking_Booking__Output>): grpc.ClientUnaryCall;
  
  CancelBooking(argument: _booking_CancelBookingRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_booking_Booking__Output>): grpc.ClientUnaryCall;
  CancelBooking(argument: _booking_CancelBookingRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_booking_Booking__Output>): grpc.ClientUnaryCall;
  CancelBooking(argument: _booking_CancelBookingRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_booking_Booking__Output>): grpc.ClientUnaryCall;
  CancelBooking(argument: _booking_CancelBookingRequest, callback: grpc.requestCallback<_booking_Booking__Output>): grpc.ClientUnaryCall;
  cancelBooking(argument: _booking_CancelBookingRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_booking_Booking__Output>): grpc.ClientUnaryCall;
  cancelBooking(argument: _booking_CancelBookingRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_booking_Booking__Output>): grpc.ClientUnaryCall;
  cancelBooking(argument: _booking_CancelBookingRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_booking_Booking__Output>): grpc.ClientUnaryCall;
  cancelBooking(argument: _booking_CancelBookingRequest, callback: grpc.requestCallback<_booking_Booking__Output>): grpc.ClientUnaryCall;
  
  CheckConflict(argument: _booking_CheckConflictRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_booking_CheckConflictResponse__Output>): grpc.ClientUnaryCall;
  CheckConflict(argument: _booking_CheckConflictRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_booking_CheckConflictResponse__Output>): grpc.ClientUnaryCall;
  CheckConflict(argument: _booking_CheckConflictRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_booking_CheckConflictResponse__Output>): grpc.ClientUnaryCall;
  CheckConflict(argument: _booking_CheckConflictRequest, callback: grpc.requestCallback<_booking_CheckConflictResponse__Output>): grpc.ClientUnaryCall;
  checkConflict(argument: _booking_CheckConflictRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_booking_CheckConflictResponse__Output>): grpc.ClientUnaryCall;
  checkConflict(argument: _booking_CheckConflictRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_booking_CheckConflictResponse__Output>): grpc.ClientUnaryCall;
  checkConflict(argument: _booking_CheckConflictRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_booking_CheckConflictResponse__Output>): grpc.ClientUnaryCall;
  checkConflict(argument: _booking_CheckConflictRequest, callback: grpc.requestCallback<_booking_CheckConflictResponse__Output>): grpc.ClientUnaryCall;
  
  CreateBooking(argument: _booking_CreateBookingRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_booking_CreateBookingResponse__Output>): grpc.ClientUnaryCall;
  CreateBooking(argument: _booking_CreateBookingRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_booking_CreateBookingResponse__Output>): grpc.ClientUnaryCall;
  CreateBooking(argument: _booking_CreateBookingRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_booking_CreateBookingResponse__Output>): grpc.ClientUnaryCall;
  CreateBooking(argument: _booking_CreateBookingRequest, callback: grpc.requestCallback<_booking_CreateBookingResponse__Output>): grpc.ClientUnaryCall;
  createBooking(argument: _booking_CreateBookingRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_booking_CreateBookingResponse__Output>): grpc.ClientUnaryCall;
  createBooking(argument: _booking_CreateBookingRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_booking_CreateBookingResponse__Output>): grpc.ClientUnaryCall;
  createBooking(argument: _booking_CreateBookingRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_booking_CreateBookingResponse__Output>): grpc.ClientUnaryCall;
  createBooking(argument: _booking_CreateBookingRequest, callback: grpc.requestCallback<_booking_CreateBookingResponse__Output>): grpc.ClientUnaryCall;
  
  GetAvailability(argument: _booking_GetAvailabilityRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_booking_GetAvailabilityResponse__Output>): grpc.ClientUnaryCall;
  GetAvailability(argument: _booking_GetAvailabilityRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_booking_GetAvailabilityResponse__Output>): grpc.ClientUnaryCall;
  GetAvailability(argument: _booking_GetAvailabilityRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_booking_GetAvailabilityResponse__Output>): grpc.ClientUnaryCall;
  GetAvailability(argument: _booking_GetAvailabilityRequest, callback: grpc.requestCallback<_booking_GetAvailabilityResponse__Output>): grpc.ClientUnaryCall;
  getAvailability(argument: _booking_GetAvailabilityRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_booking_GetAvailabilityResponse__Output>): grpc.ClientUnaryCall;
  getAvailability(argument: _booking_GetAvailabilityRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_booking_GetAvailabilityResponse__Output>): grpc.ClientUnaryCall;
  getAvailability(argument: _booking_GetAvailabilityRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_booking_GetAvailabilityResponse__Output>): grpc.ClientUnaryCall;
  getAvailability(argument: _booking_GetAvailabilityRequest, callback: grpc.requestCallback<_booking_GetAvailabilityResponse__Output>): grpc.ClientUnaryCall;
  
  GetBooking(argument: _booking_GetBookingRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_booking_Booking__Output>): grpc.ClientUnaryCall;
  GetBooking(argument: _booking_GetBookingRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_booking_Booking__Output>): grpc.ClientUnaryCall;
  GetBooking(argument: _booking_GetBookingRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_booking_Booking__Output>): grpc.ClientUnaryCall;
  GetBooking(argument: _booking_GetBookingRequest, callback: grpc.requestCallback<_booking_Booking__Output>): grpc.ClientUnaryCall;
  getBooking(argument: _booking_GetBookingRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_booking_Booking__Output>): grpc.ClientUnaryCall;
  getBooking(argument: _booking_GetBookingRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_booking_Booking__Output>): grpc.ClientUnaryCall;
  getBooking(argument: _booking_GetBookingRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_booking_Booking__Output>): grpc.ClientUnaryCall;
  getBooking(argument: _booking_GetBookingRequest, callback: grpc.requestCallback<_booking_Booking__Output>): grpc.ClientUnaryCall;
  
  GetCollegeBookings(argument: _booking_GetCollegeBookingsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_booking_GetCollegeBookingsResponse__Output>): grpc.ClientUnaryCall;
  GetCollegeBookings(argument: _booking_GetCollegeBookingsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_booking_GetCollegeBookingsResponse__Output>): grpc.ClientUnaryCall;
  GetCollegeBookings(argument: _booking_GetCollegeBookingsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_booking_GetCollegeBookingsResponse__Output>): grpc.ClientUnaryCall;
  GetCollegeBookings(argument: _booking_GetCollegeBookingsRequest, callback: grpc.requestCallback<_booking_GetCollegeBookingsResponse__Output>): grpc.ClientUnaryCall;
  getCollegeBookings(argument: _booking_GetCollegeBookingsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_booking_GetCollegeBookingsResponse__Output>): grpc.ClientUnaryCall;
  getCollegeBookings(argument: _booking_GetCollegeBookingsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_booking_GetCollegeBookingsResponse__Output>): grpc.ClientUnaryCall;
  getCollegeBookings(argument: _booking_GetCollegeBookingsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_booking_GetCollegeBookingsResponse__Output>): grpc.ClientUnaryCall;
  getCollegeBookings(argument: _booking_GetCollegeBookingsRequest, callback: grpc.requestCallback<_booking_GetCollegeBookingsResponse__Output>): grpc.ClientUnaryCall;
  
  GetGroundBookings(argument: _booking_GetGroundBookingsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_booking_GetGroundBookingsResponse__Output>): grpc.ClientUnaryCall;
  GetGroundBookings(argument: _booking_GetGroundBookingsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_booking_GetGroundBookingsResponse__Output>): grpc.ClientUnaryCall;
  GetGroundBookings(argument: _booking_GetGroundBookingsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_booking_GetGroundBookingsResponse__Output>): grpc.ClientUnaryCall;
  GetGroundBookings(argument: _booking_GetGroundBookingsRequest, callback: grpc.requestCallback<_booking_GetGroundBookingsResponse__Output>): grpc.ClientUnaryCall;
  getGroundBookings(argument: _booking_GetGroundBookingsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_booking_GetGroundBookingsResponse__Output>): grpc.ClientUnaryCall;
  getGroundBookings(argument: _booking_GetGroundBookingsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_booking_GetGroundBookingsResponse__Output>): grpc.ClientUnaryCall;
  getGroundBookings(argument: _booking_GetGroundBookingsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_booking_GetGroundBookingsResponse__Output>): grpc.ClientUnaryCall;
  getGroundBookings(argument: _booking_GetGroundBookingsRequest, callback: grpc.requestCallback<_booking_GetGroundBookingsResponse__Output>): grpc.ClientUnaryCall;
  
  GetUserBookings(argument: _booking_GetUserBookingsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_booking_GetUserBookingsResponse__Output>): grpc.ClientUnaryCall;
  GetUserBookings(argument: _booking_GetUserBookingsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_booking_GetUserBookingsResponse__Output>): grpc.ClientUnaryCall;
  GetUserBookings(argument: _booking_GetUserBookingsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_booking_GetUserBookingsResponse__Output>): grpc.ClientUnaryCall;
  GetUserBookings(argument: _booking_GetUserBookingsRequest, callback: grpc.requestCallback<_booking_GetUserBookingsResponse__Output>): grpc.ClientUnaryCall;
  getUserBookings(argument: _booking_GetUserBookingsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_booking_GetUserBookingsResponse__Output>): grpc.ClientUnaryCall;
  getUserBookings(argument: _booking_GetUserBookingsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_booking_GetUserBookingsResponse__Output>): grpc.ClientUnaryCall;
  getUserBookings(argument: _booking_GetUserBookingsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_booking_GetUserBookingsResponse__Output>): grpc.ClientUnaryCall;
  getUserBookings(argument: _booking_GetUserBookingsRequest, callback: grpc.requestCallback<_booking_GetUserBookingsResponse__Output>): grpc.ClientUnaryCall;
  
  RejectBooking(argument: _booking_RejectBookingRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_booking_Booking__Output>): grpc.ClientUnaryCall;
  RejectBooking(argument: _booking_RejectBookingRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_booking_Booking__Output>): grpc.ClientUnaryCall;
  RejectBooking(argument: _booking_RejectBookingRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_booking_Booking__Output>): grpc.ClientUnaryCall;
  RejectBooking(argument: _booking_RejectBookingRequest, callback: grpc.requestCallback<_booking_Booking__Output>): grpc.ClientUnaryCall;
  rejectBooking(argument: _booking_RejectBookingRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_booking_Booking__Output>): grpc.ClientUnaryCall;
  rejectBooking(argument: _booking_RejectBookingRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_booking_Booking__Output>): grpc.ClientUnaryCall;
  rejectBooking(argument: _booking_RejectBookingRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_booking_Booking__Output>): grpc.ClientUnaryCall;
  rejectBooking(argument: _booking_RejectBookingRequest, callback: grpc.requestCallback<_booking_Booking__Output>): grpc.ClientUnaryCall;
  
}

export interface BookingServiceHandlers extends grpc.UntypedServiceImplementation {
  ApproveBooking: grpc.handleUnaryCall<_booking_ApproveBookingRequest__Output, _booking_Booking>;
  
  CancelBooking: grpc.handleUnaryCall<_booking_CancelBookingRequest__Output, _booking_Booking>;
  
  CheckConflict: grpc.handleUnaryCall<_booking_CheckConflictRequest__Output, _booking_CheckConflictResponse>;
  
  CreateBooking: grpc.handleUnaryCall<_booking_CreateBookingRequest__Output, _booking_CreateBookingResponse>;
  
  GetAvailability: grpc.handleUnaryCall<_booking_GetAvailabilityRequest__Output, _booking_GetAvailabilityResponse>;
  
  GetBooking: grpc.handleUnaryCall<_booking_GetBookingRequest__Output, _booking_Booking>;
  
  GetCollegeBookings: grpc.handleUnaryCall<_booking_GetCollegeBookingsRequest__Output, _booking_GetCollegeBookingsResponse>;
  
  GetGroundBookings: grpc.handleUnaryCall<_booking_GetGroundBookingsRequest__Output, _booking_GetGroundBookingsResponse>;
  
  GetUserBookings: grpc.handleUnaryCall<_booking_GetUserBookingsRequest__Output, _booking_GetUserBookingsResponse>;
  
  RejectBooking: grpc.handleUnaryCall<_booking_RejectBookingRequest__Output, _booking_Booking>;
  
}

export interface BookingServiceDefinition extends grpc.ServiceDefinition {
  ApproveBooking: MethodDefinition<_booking_ApproveBookingRequest, _booking_Booking, _booking_ApproveBookingRequest__Output, _booking_Booking__Output>
  CancelBooking: MethodDefinition<_booking_CancelBookingRequest, _booking_Booking, _booking_CancelBookingRequest__Output, _booking_Booking__Output>
  CheckConflict: MethodDefinition<_booking_CheckConflictRequest, _booking_CheckConflictResponse, _booking_CheckConflictRequest__Output, _booking_CheckConflictResponse__Output>
  CreateBooking: MethodDefinition<_booking_CreateBookingRequest, _booking_CreateBookingResponse, _booking_CreateBookingRequest__Output, _booking_CreateBookingResponse__Output>
  GetAvailability: MethodDefinition<_booking_GetAvailabilityRequest, _booking_GetAvailabilityResponse, _booking_GetAvailabilityRequest__Output, _booking_GetAvailabilityResponse__Output>
  GetBooking: MethodDefinition<_booking_GetBookingRequest, _booking_Booking, _booking_GetBookingRequest__Output, _booking_Booking__Output>
  GetCollegeBookings: MethodDefinition<_booking_GetCollegeBookingsRequest, _booking_GetCollegeBookingsResponse, _booking_GetCollegeBookingsRequest__Output, _booking_GetCollegeBookingsResponse__Output>
  GetGroundBookings: MethodDefinition<_booking_GetGroundBookingsRequest, _booking_GetGroundBookingsResponse, _booking_GetGroundBookingsRequest__Output, _booking_GetGroundBookingsResponse__Output>
  GetUserBookings: MethodDefinition<_booking_GetUserBookingsRequest, _booking_GetUserBookingsResponse, _booking_GetUserBookingsRequest__Output, _booking_GetUserBookingsResponse__Output>
  RejectBooking: MethodDefinition<_booking_RejectBookingRequest, _booking_Booking, _booking_RejectBookingRequest__Output, _booking_Booking__Output>
}
