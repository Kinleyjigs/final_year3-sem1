// Original file: src/proto/maintenance.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { CancelMaintenanceRequest as _maintenance_CancelMaintenanceRequest, CancelMaintenanceRequest__Output as _maintenance_CancelMaintenanceRequest__Output } from '../maintenance/CancelMaintenanceRequest';
import type { CancelMaintenanceResponse as _maintenance_CancelMaintenanceResponse, CancelMaintenanceResponse__Output as _maintenance_CancelMaintenanceResponse__Output } from '../maintenance/CancelMaintenanceResponse';
import type { CheckConflictRequest as _maintenance_CheckConflictRequest, CheckConflictRequest__Output as _maintenance_CheckConflictRequest__Output } from '../maintenance/CheckConflictRequest';
import type { CheckConflictResponse as _maintenance_CheckConflictResponse, CheckConflictResponse__Output as _maintenance_CheckConflictResponse__Output } from '../maintenance/CheckConflictResponse';
import type { CreateMaintenanceRequest as _maintenance_CreateMaintenanceRequest, CreateMaintenanceRequest__Output as _maintenance_CreateMaintenanceRequest__Output } from '../maintenance/CreateMaintenanceRequest';
import type { CreateMaintenanceResponse as _maintenance_CreateMaintenanceResponse, CreateMaintenanceResponse__Output as _maintenance_CreateMaintenanceResponse__Output } from '../maintenance/CreateMaintenanceResponse';
import type { GetCollegeMaintenanceRequest as _maintenance_GetCollegeMaintenanceRequest, GetCollegeMaintenanceRequest__Output as _maintenance_GetCollegeMaintenanceRequest__Output } from '../maintenance/GetCollegeMaintenanceRequest';
import type { GetCollegeMaintenanceResponse as _maintenance_GetCollegeMaintenanceResponse, GetCollegeMaintenanceResponse__Output as _maintenance_GetCollegeMaintenanceResponse__Output } from '../maintenance/GetCollegeMaintenanceResponse';
import type { GetGroundMaintenanceRequest as _maintenance_GetGroundMaintenanceRequest, GetGroundMaintenanceRequest__Output as _maintenance_GetGroundMaintenanceRequest__Output } from '../maintenance/GetGroundMaintenanceRequest';
import type { GetGroundMaintenanceResponse as _maintenance_GetGroundMaintenanceResponse, GetGroundMaintenanceResponse__Output as _maintenance_GetGroundMaintenanceResponse__Output } from '../maintenance/GetGroundMaintenanceResponse';
import type { GetMaintenanceRequest as _maintenance_GetMaintenanceRequest, GetMaintenanceRequest__Output as _maintenance_GetMaintenanceRequest__Output } from '../maintenance/GetMaintenanceRequest';
import type { Maintenance as _maintenance_Maintenance, Maintenance__Output as _maintenance_Maintenance__Output } from '../maintenance/Maintenance';

export interface MaintenanceServiceClient extends grpc.Client {
  CancelMaintenance(argument: _maintenance_CancelMaintenanceRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_maintenance_CancelMaintenanceResponse__Output>): grpc.ClientUnaryCall;
  CancelMaintenance(argument: _maintenance_CancelMaintenanceRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_maintenance_CancelMaintenanceResponse__Output>): grpc.ClientUnaryCall;
  CancelMaintenance(argument: _maintenance_CancelMaintenanceRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_maintenance_CancelMaintenanceResponse__Output>): grpc.ClientUnaryCall;
  CancelMaintenance(argument: _maintenance_CancelMaintenanceRequest, callback: grpc.requestCallback<_maintenance_CancelMaintenanceResponse__Output>): grpc.ClientUnaryCall;
  cancelMaintenance(argument: _maintenance_CancelMaintenanceRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_maintenance_CancelMaintenanceResponse__Output>): grpc.ClientUnaryCall;
  cancelMaintenance(argument: _maintenance_CancelMaintenanceRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_maintenance_CancelMaintenanceResponse__Output>): grpc.ClientUnaryCall;
  cancelMaintenance(argument: _maintenance_CancelMaintenanceRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_maintenance_CancelMaintenanceResponse__Output>): grpc.ClientUnaryCall;
  cancelMaintenance(argument: _maintenance_CancelMaintenanceRequest, callback: grpc.requestCallback<_maintenance_CancelMaintenanceResponse__Output>): grpc.ClientUnaryCall;
  
  CheckConflict(argument: _maintenance_CheckConflictRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_maintenance_CheckConflictResponse__Output>): grpc.ClientUnaryCall;
  CheckConflict(argument: _maintenance_CheckConflictRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_maintenance_CheckConflictResponse__Output>): grpc.ClientUnaryCall;
  CheckConflict(argument: _maintenance_CheckConflictRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_maintenance_CheckConflictResponse__Output>): grpc.ClientUnaryCall;
  CheckConflict(argument: _maintenance_CheckConflictRequest, callback: grpc.requestCallback<_maintenance_CheckConflictResponse__Output>): grpc.ClientUnaryCall;
  checkConflict(argument: _maintenance_CheckConflictRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_maintenance_CheckConflictResponse__Output>): grpc.ClientUnaryCall;
  checkConflict(argument: _maintenance_CheckConflictRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_maintenance_CheckConflictResponse__Output>): grpc.ClientUnaryCall;
  checkConflict(argument: _maintenance_CheckConflictRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_maintenance_CheckConflictResponse__Output>): grpc.ClientUnaryCall;
  checkConflict(argument: _maintenance_CheckConflictRequest, callback: grpc.requestCallback<_maintenance_CheckConflictResponse__Output>): grpc.ClientUnaryCall;
  
  CreateMaintenance(argument: _maintenance_CreateMaintenanceRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_maintenance_CreateMaintenanceResponse__Output>): grpc.ClientUnaryCall;
  CreateMaintenance(argument: _maintenance_CreateMaintenanceRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_maintenance_CreateMaintenanceResponse__Output>): grpc.ClientUnaryCall;
  CreateMaintenance(argument: _maintenance_CreateMaintenanceRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_maintenance_CreateMaintenanceResponse__Output>): grpc.ClientUnaryCall;
  CreateMaintenance(argument: _maintenance_CreateMaintenanceRequest, callback: grpc.requestCallback<_maintenance_CreateMaintenanceResponse__Output>): grpc.ClientUnaryCall;
  createMaintenance(argument: _maintenance_CreateMaintenanceRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_maintenance_CreateMaintenanceResponse__Output>): grpc.ClientUnaryCall;
  createMaintenance(argument: _maintenance_CreateMaintenanceRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_maintenance_CreateMaintenanceResponse__Output>): grpc.ClientUnaryCall;
  createMaintenance(argument: _maintenance_CreateMaintenanceRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_maintenance_CreateMaintenanceResponse__Output>): grpc.ClientUnaryCall;
  createMaintenance(argument: _maintenance_CreateMaintenanceRequest, callback: grpc.requestCallback<_maintenance_CreateMaintenanceResponse__Output>): grpc.ClientUnaryCall;
  
  GetCollegeMaintenance(argument: _maintenance_GetCollegeMaintenanceRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_maintenance_GetCollegeMaintenanceResponse__Output>): grpc.ClientUnaryCall;
  GetCollegeMaintenance(argument: _maintenance_GetCollegeMaintenanceRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_maintenance_GetCollegeMaintenanceResponse__Output>): grpc.ClientUnaryCall;
  GetCollegeMaintenance(argument: _maintenance_GetCollegeMaintenanceRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_maintenance_GetCollegeMaintenanceResponse__Output>): grpc.ClientUnaryCall;
  GetCollegeMaintenance(argument: _maintenance_GetCollegeMaintenanceRequest, callback: grpc.requestCallback<_maintenance_GetCollegeMaintenanceResponse__Output>): grpc.ClientUnaryCall;
  getCollegeMaintenance(argument: _maintenance_GetCollegeMaintenanceRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_maintenance_GetCollegeMaintenanceResponse__Output>): grpc.ClientUnaryCall;
  getCollegeMaintenance(argument: _maintenance_GetCollegeMaintenanceRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_maintenance_GetCollegeMaintenanceResponse__Output>): grpc.ClientUnaryCall;
  getCollegeMaintenance(argument: _maintenance_GetCollegeMaintenanceRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_maintenance_GetCollegeMaintenanceResponse__Output>): grpc.ClientUnaryCall;
  getCollegeMaintenance(argument: _maintenance_GetCollegeMaintenanceRequest, callback: grpc.requestCallback<_maintenance_GetCollegeMaintenanceResponse__Output>): grpc.ClientUnaryCall;
  
  GetGroundMaintenance(argument: _maintenance_GetGroundMaintenanceRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_maintenance_GetGroundMaintenanceResponse__Output>): grpc.ClientUnaryCall;
  GetGroundMaintenance(argument: _maintenance_GetGroundMaintenanceRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_maintenance_GetGroundMaintenanceResponse__Output>): grpc.ClientUnaryCall;
  GetGroundMaintenance(argument: _maintenance_GetGroundMaintenanceRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_maintenance_GetGroundMaintenanceResponse__Output>): grpc.ClientUnaryCall;
  GetGroundMaintenance(argument: _maintenance_GetGroundMaintenanceRequest, callback: grpc.requestCallback<_maintenance_GetGroundMaintenanceResponse__Output>): grpc.ClientUnaryCall;
  getGroundMaintenance(argument: _maintenance_GetGroundMaintenanceRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_maintenance_GetGroundMaintenanceResponse__Output>): grpc.ClientUnaryCall;
  getGroundMaintenance(argument: _maintenance_GetGroundMaintenanceRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_maintenance_GetGroundMaintenanceResponse__Output>): grpc.ClientUnaryCall;
  getGroundMaintenance(argument: _maintenance_GetGroundMaintenanceRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_maintenance_GetGroundMaintenanceResponse__Output>): grpc.ClientUnaryCall;
  getGroundMaintenance(argument: _maintenance_GetGroundMaintenanceRequest, callback: grpc.requestCallback<_maintenance_GetGroundMaintenanceResponse__Output>): grpc.ClientUnaryCall;
  
  GetMaintenance(argument: _maintenance_GetMaintenanceRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_maintenance_Maintenance__Output>): grpc.ClientUnaryCall;
  GetMaintenance(argument: _maintenance_GetMaintenanceRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_maintenance_Maintenance__Output>): grpc.ClientUnaryCall;
  GetMaintenance(argument: _maintenance_GetMaintenanceRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_maintenance_Maintenance__Output>): grpc.ClientUnaryCall;
  GetMaintenance(argument: _maintenance_GetMaintenanceRequest, callback: grpc.requestCallback<_maintenance_Maintenance__Output>): grpc.ClientUnaryCall;
  getMaintenance(argument: _maintenance_GetMaintenanceRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_maintenance_Maintenance__Output>): grpc.ClientUnaryCall;
  getMaintenance(argument: _maintenance_GetMaintenanceRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_maintenance_Maintenance__Output>): grpc.ClientUnaryCall;
  getMaintenance(argument: _maintenance_GetMaintenanceRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_maintenance_Maintenance__Output>): grpc.ClientUnaryCall;
  getMaintenance(argument: _maintenance_GetMaintenanceRequest, callback: grpc.requestCallback<_maintenance_Maintenance__Output>): grpc.ClientUnaryCall;
  
}

export interface MaintenanceServiceHandlers extends grpc.UntypedServiceImplementation {
  CancelMaintenance: grpc.handleUnaryCall<_maintenance_CancelMaintenanceRequest__Output, _maintenance_CancelMaintenanceResponse>;
  
  CheckConflict: grpc.handleUnaryCall<_maintenance_CheckConflictRequest__Output, _maintenance_CheckConflictResponse>;
  
  CreateMaintenance: grpc.handleUnaryCall<_maintenance_CreateMaintenanceRequest__Output, _maintenance_CreateMaintenanceResponse>;
  
  GetCollegeMaintenance: grpc.handleUnaryCall<_maintenance_GetCollegeMaintenanceRequest__Output, _maintenance_GetCollegeMaintenanceResponse>;
  
  GetGroundMaintenance: grpc.handleUnaryCall<_maintenance_GetGroundMaintenanceRequest__Output, _maintenance_GetGroundMaintenanceResponse>;
  
  GetMaintenance: grpc.handleUnaryCall<_maintenance_GetMaintenanceRequest__Output, _maintenance_Maintenance>;
  
}

export interface MaintenanceServiceDefinition extends grpc.ServiceDefinition {
  CancelMaintenance: MethodDefinition<_maintenance_CancelMaintenanceRequest, _maintenance_CancelMaintenanceResponse, _maintenance_CancelMaintenanceRequest__Output, _maintenance_CancelMaintenanceResponse__Output>
  CheckConflict: MethodDefinition<_maintenance_CheckConflictRequest, _maintenance_CheckConflictResponse, _maintenance_CheckConflictRequest__Output, _maintenance_CheckConflictResponse__Output>
  CreateMaintenance: MethodDefinition<_maintenance_CreateMaintenanceRequest, _maintenance_CreateMaintenanceResponse, _maintenance_CreateMaintenanceRequest__Output, _maintenance_CreateMaintenanceResponse__Output>
  GetCollegeMaintenance: MethodDefinition<_maintenance_GetCollegeMaintenanceRequest, _maintenance_GetCollegeMaintenanceResponse, _maintenance_GetCollegeMaintenanceRequest__Output, _maintenance_GetCollegeMaintenanceResponse__Output>
  GetGroundMaintenance: MethodDefinition<_maintenance_GetGroundMaintenanceRequest, _maintenance_GetGroundMaintenanceResponse, _maintenance_GetGroundMaintenanceRequest__Output, _maintenance_GetGroundMaintenanceResponse__Output>
  GetMaintenance: MethodDefinition<_maintenance_GetMaintenanceRequest, _maintenance_Maintenance, _maintenance_GetMaintenanceRequest__Output, _maintenance_Maintenance__Output>
}
