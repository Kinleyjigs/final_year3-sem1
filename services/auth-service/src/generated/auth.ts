import type * as grpc from '@grpc/grpc-js';
import type { EnumTypeDefinition, MessageTypeDefinition } from '@grpc/proto-loader';

import type { AuthServiceClient as _auth_AuthServiceClient, AuthServiceDefinition as _auth_AuthServiceDefinition } from './auth/AuthService';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  auth: {
    AuthService: SubtypeConstructor<typeof grpc.Client, _auth_AuthServiceClient> & { service: _auth_AuthServiceDefinition }
    GetUserRequest: MessageTypeDefinition
    LoginRequest: MessageTypeDefinition
    LoginResponse: MessageTypeDefinition
    RegisterRequest: MessageTypeDefinition
    RegisterResponse: MessageTypeDefinition
    Role: EnumTypeDefinition
    UpdateUserRequest: MessageTypeDefinition
    User: MessageTypeDefinition
    ValidateRoleRequest: MessageTypeDefinition
    ValidateRoleResponse: MessageTypeDefinition
    VerifyTokenRequest: MessageTypeDefinition
    VerifyTokenResponse: MessageTypeDefinition
  }
}

