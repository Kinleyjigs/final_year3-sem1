// Original file: src/proto/auth.proto

import type { Role as _auth_Role, Role__Output as _auth_Role__Output } from '../auth/Role';

export interface VerifyTokenResponse {
  'valid'?: (boolean);
  'userId'?: (string);
  'email'?: (string);
  'role'?: (_auth_Role);
  'college'?: (string);
}

export interface VerifyTokenResponse__Output {
  'valid': (boolean);
  'userId': (string);
  'email': (string);
  'role': (_auth_Role__Output);
  'college': (string);
}
