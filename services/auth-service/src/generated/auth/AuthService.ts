// Original file: src/proto/auth.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { GetUserRequest as _auth_GetUserRequest, GetUserRequest__Output as _auth_GetUserRequest__Output } from '../auth/GetUserRequest';
import type { LoginRequest as _auth_LoginRequest, LoginRequest__Output as _auth_LoginRequest__Output } from '../auth/LoginRequest';
import type { LoginResponse as _auth_LoginResponse, LoginResponse__Output as _auth_LoginResponse__Output } from '../auth/LoginResponse';
import type { RegisterRequest as _auth_RegisterRequest, RegisterRequest__Output as _auth_RegisterRequest__Output } from '../auth/RegisterRequest';
import type { RegisterResponse as _auth_RegisterResponse, RegisterResponse__Output as _auth_RegisterResponse__Output } from '../auth/RegisterResponse';
import type { UpdateUserRequest as _auth_UpdateUserRequest, UpdateUserRequest__Output as _auth_UpdateUserRequest__Output } from '../auth/UpdateUserRequest';
import type { User as _auth_User, User__Output as _auth_User__Output } from '../auth/User';
import type { ValidateRoleRequest as _auth_ValidateRoleRequest, ValidateRoleRequest__Output as _auth_ValidateRoleRequest__Output } from '../auth/ValidateRoleRequest';
import type { ValidateRoleResponse as _auth_ValidateRoleResponse, ValidateRoleResponse__Output as _auth_ValidateRoleResponse__Output } from '../auth/ValidateRoleResponse';
import type { VerifyTokenRequest as _auth_VerifyTokenRequest, VerifyTokenRequest__Output as _auth_VerifyTokenRequest__Output } from '../auth/VerifyTokenRequest';
import type { VerifyTokenResponse as _auth_VerifyTokenResponse, VerifyTokenResponse__Output as _auth_VerifyTokenResponse__Output } from '../auth/VerifyTokenResponse';

export interface AuthServiceClient extends grpc.Client {
  GetUser(argument: _auth_GetUserRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_auth_User__Output>): grpc.ClientUnaryCall;
  GetUser(argument: _auth_GetUserRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_auth_User__Output>): grpc.ClientUnaryCall;
  GetUser(argument: _auth_GetUserRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_auth_User__Output>): grpc.ClientUnaryCall;
  GetUser(argument: _auth_GetUserRequest, callback: grpc.requestCallback<_auth_User__Output>): grpc.ClientUnaryCall;
  getUser(argument: _auth_GetUserRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_auth_User__Output>): grpc.ClientUnaryCall;
  getUser(argument: _auth_GetUserRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_auth_User__Output>): grpc.ClientUnaryCall;
  getUser(argument: _auth_GetUserRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_auth_User__Output>): grpc.ClientUnaryCall;
  getUser(argument: _auth_GetUserRequest, callback: grpc.requestCallback<_auth_User__Output>): grpc.ClientUnaryCall;
  
  Login(argument: _auth_LoginRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_auth_LoginResponse__Output>): grpc.ClientUnaryCall;
  Login(argument: _auth_LoginRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_auth_LoginResponse__Output>): grpc.ClientUnaryCall;
  Login(argument: _auth_LoginRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_auth_LoginResponse__Output>): grpc.ClientUnaryCall;
  Login(argument: _auth_LoginRequest, callback: grpc.requestCallback<_auth_LoginResponse__Output>): grpc.ClientUnaryCall;
  login(argument: _auth_LoginRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_auth_LoginResponse__Output>): grpc.ClientUnaryCall;
  login(argument: _auth_LoginRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_auth_LoginResponse__Output>): grpc.ClientUnaryCall;
  login(argument: _auth_LoginRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_auth_LoginResponse__Output>): grpc.ClientUnaryCall;
  login(argument: _auth_LoginRequest, callback: grpc.requestCallback<_auth_LoginResponse__Output>): grpc.ClientUnaryCall;
  
  Register(argument: _auth_RegisterRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_auth_RegisterResponse__Output>): grpc.ClientUnaryCall;
  Register(argument: _auth_RegisterRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_auth_RegisterResponse__Output>): grpc.ClientUnaryCall;
  Register(argument: _auth_RegisterRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_auth_RegisterResponse__Output>): grpc.ClientUnaryCall;
  Register(argument: _auth_RegisterRequest, callback: grpc.requestCallback<_auth_RegisterResponse__Output>): grpc.ClientUnaryCall;
  register(argument: _auth_RegisterRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_auth_RegisterResponse__Output>): grpc.ClientUnaryCall;
  register(argument: _auth_RegisterRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_auth_RegisterResponse__Output>): grpc.ClientUnaryCall;
  register(argument: _auth_RegisterRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_auth_RegisterResponse__Output>): grpc.ClientUnaryCall;
  register(argument: _auth_RegisterRequest, callback: grpc.requestCallback<_auth_RegisterResponse__Output>): grpc.ClientUnaryCall;
  
  UpdateUser(argument: _auth_UpdateUserRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_auth_User__Output>): grpc.ClientUnaryCall;
  UpdateUser(argument: _auth_UpdateUserRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_auth_User__Output>): grpc.ClientUnaryCall;
  UpdateUser(argument: _auth_UpdateUserRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_auth_User__Output>): grpc.ClientUnaryCall;
  UpdateUser(argument: _auth_UpdateUserRequest, callback: grpc.requestCallback<_auth_User__Output>): grpc.ClientUnaryCall;
  updateUser(argument: _auth_UpdateUserRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_auth_User__Output>): grpc.ClientUnaryCall;
  updateUser(argument: _auth_UpdateUserRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_auth_User__Output>): grpc.ClientUnaryCall;
  updateUser(argument: _auth_UpdateUserRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_auth_User__Output>): grpc.ClientUnaryCall;
  updateUser(argument: _auth_UpdateUserRequest, callback: grpc.requestCallback<_auth_User__Output>): grpc.ClientUnaryCall;
  
  ValidateRole(argument: _auth_ValidateRoleRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_auth_ValidateRoleResponse__Output>): grpc.ClientUnaryCall;
  ValidateRole(argument: _auth_ValidateRoleRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_auth_ValidateRoleResponse__Output>): grpc.ClientUnaryCall;
  ValidateRole(argument: _auth_ValidateRoleRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_auth_ValidateRoleResponse__Output>): grpc.ClientUnaryCall;
  ValidateRole(argument: _auth_ValidateRoleRequest, callback: grpc.requestCallback<_auth_ValidateRoleResponse__Output>): grpc.ClientUnaryCall;
  validateRole(argument: _auth_ValidateRoleRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_auth_ValidateRoleResponse__Output>): grpc.ClientUnaryCall;
  validateRole(argument: _auth_ValidateRoleRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_auth_ValidateRoleResponse__Output>): grpc.ClientUnaryCall;
  validateRole(argument: _auth_ValidateRoleRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_auth_ValidateRoleResponse__Output>): grpc.ClientUnaryCall;
  validateRole(argument: _auth_ValidateRoleRequest, callback: grpc.requestCallback<_auth_ValidateRoleResponse__Output>): grpc.ClientUnaryCall;
  
  VerifyToken(argument: _auth_VerifyTokenRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_auth_VerifyTokenResponse__Output>): grpc.ClientUnaryCall;
  VerifyToken(argument: _auth_VerifyTokenRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_auth_VerifyTokenResponse__Output>): grpc.ClientUnaryCall;
  VerifyToken(argument: _auth_VerifyTokenRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_auth_VerifyTokenResponse__Output>): grpc.ClientUnaryCall;
  VerifyToken(argument: _auth_VerifyTokenRequest, callback: grpc.requestCallback<_auth_VerifyTokenResponse__Output>): grpc.ClientUnaryCall;
  verifyToken(argument: _auth_VerifyTokenRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_auth_VerifyTokenResponse__Output>): grpc.ClientUnaryCall;
  verifyToken(argument: _auth_VerifyTokenRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_auth_VerifyTokenResponse__Output>): grpc.ClientUnaryCall;
  verifyToken(argument: _auth_VerifyTokenRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_auth_VerifyTokenResponse__Output>): grpc.ClientUnaryCall;
  verifyToken(argument: _auth_VerifyTokenRequest, callback: grpc.requestCallback<_auth_VerifyTokenResponse__Output>): grpc.ClientUnaryCall;
  
}

export interface AuthServiceHandlers extends grpc.UntypedServiceImplementation {
  GetUser: grpc.handleUnaryCall<_auth_GetUserRequest__Output, _auth_User>;
  
  Login: grpc.handleUnaryCall<_auth_LoginRequest__Output, _auth_LoginResponse>;
  
  Register: grpc.handleUnaryCall<_auth_RegisterRequest__Output, _auth_RegisterResponse>;
  
  UpdateUser: grpc.handleUnaryCall<_auth_UpdateUserRequest__Output, _auth_User>;
  
  ValidateRole: grpc.handleUnaryCall<_auth_ValidateRoleRequest__Output, _auth_ValidateRoleResponse>;
  
  VerifyToken: grpc.handleUnaryCall<_auth_VerifyTokenRequest__Output, _auth_VerifyTokenResponse>;
  
}

export interface AuthServiceDefinition extends grpc.ServiceDefinition {
  GetUser: MethodDefinition<_auth_GetUserRequest, _auth_User, _auth_GetUserRequest__Output, _auth_User__Output>
  Login: MethodDefinition<_auth_LoginRequest, _auth_LoginResponse, _auth_LoginRequest__Output, _auth_LoginResponse__Output>
  Register: MethodDefinition<_auth_RegisterRequest, _auth_RegisterResponse, _auth_RegisterRequest__Output, _auth_RegisterResponse__Output>
  UpdateUser: MethodDefinition<_auth_UpdateUserRequest, _auth_User, _auth_UpdateUserRequest__Output, _auth_User__Output>
  ValidateRole: MethodDefinition<_auth_ValidateRoleRequest, _auth_ValidateRoleResponse, _auth_ValidateRoleRequest__Output, _auth_ValidateRoleResponse__Output>
  VerifyToken: MethodDefinition<_auth_VerifyTokenRequest, _auth_VerifyTokenResponse, _auth_VerifyTokenRequest__Output, _auth_VerifyTokenResponse__Output>
}
