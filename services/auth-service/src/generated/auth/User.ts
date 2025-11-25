// Original file: src/proto/auth.proto

import type { Role as _auth_Role, Role__Output as _auth_Role__Output } from '../auth/Role';

export interface User {
  'id'?: (string);
  'email'?: (string);
  'fullName'?: (string);
  'college'?: (string);
  'role'?: (_auth_Role);
  'createdAt'?: (string);
  'updatedAt'?: (string);
}

export interface User__Output {
  'id': (string);
  'email': (string);
  'fullName': (string);
  'college': (string);
  'role': (_auth_Role__Output);
  'createdAt': (string);
  'updatedAt': (string);
}
