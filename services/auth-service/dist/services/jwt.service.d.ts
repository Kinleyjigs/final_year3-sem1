interface JwtPayload {
    userId: string;
    email: string;
    role: string;
    college: string;
}
interface JwtOptions {
    expiresIn?: string;
}
export declare class JwtService {
    private readonly secret;
    private readonly defaultExpiry;
    constructor();
    /**
     * Generate JWT token with user claims
     * @param payload User claims (userId, email, role, college)
     * @param options JWT options (expiresIn)
     * @returns Signed JWT token
     */
    generateToken(payload: JwtPayload, options?: JwtOptions): string;
    /**
     * Verify and decode JWT token
     * @param token JWT token string
     * @returns Decoded payload or null if invalid
     */
    verifyToken(token: string): JwtPayload | null;
    /**
     * Decode JWT token without verification (for debugging)
     * @param token JWT token string
     * @returns Decoded payload or null
     */
    decodeToken(token: string): JwtPayload | null;
}
export declare const jwtService: JwtService;
export {};
//# sourceMappingURL=jwt.service.d.ts.map