// Original file: src/proto/auth.proto

export const Role = {
  VISITOR: 'VISITOR',
  USER: 'USER',
  ADMIN: 'ADMIN',
} as const;

export type Role =
  | 'VISITOR'
  | 0
  | 'USER'
  | 1
  | 'ADMIN'
  | 2

export type Role__Output = typeof Role[keyof typeof Role]
