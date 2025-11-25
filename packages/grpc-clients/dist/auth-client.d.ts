export interface User {
    id: string;
    email: string;
    full_name: string;
    college: string;
    role: Role;
    created_at: string;
    updated_at: string;
}
export declare enum Role {
    VISITOR = 0,
    USER = 1,
    ADMIN = 2
}
export interface RegisterRequest {
    email: string;
    password: string;
    full_name: string;
    college: string;
}
export interface RegisterResponse {
    user: User;
    token: string;
}
export interface LoginRequest {
    email: string;
    password: string;
}
export interface LoginResponse {
    user: User;
    token: string;
}
export interface VerifyTokenRequest {
    token: string;
}
export interface VerifyTokenResponse {
    valid: boolean;
    user_id: string;
    email: string;
    role: Role;
    college: string;
}
export interface GetUserRequest {
    user_id: string;
}
export interface UpdateUserRequest {
    user_id: string;
    full_name?: string;
    college?: string;
}
export interface ValidateRoleRequest {
    user_id: string;
    required_role: Role;
}
export interface ValidateRoleResponse {
    authorized: boolean;
    message: string;
}
/**
 * Create Auth gRPC client
 */
export declare function createAuthClient(serviceUrl?: string): unknown;
export declare function getAuthClient(): any;
export declare const authClient: any;
//# sourceMappingURL=auth-client.d.ts.map