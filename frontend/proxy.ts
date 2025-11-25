import { authkitMiddleware } from '@workos-inc/authkit-nextjs';

export default authkitMiddleware({
  redirectUri: process.env.WORKOS_REDIRECT_URI || 'http://localhost:3001/api/auth/callback',
  // Paths that don't require authentication
  publicPaths: [
    '/',
    '/login',
    '/register',
    '/api/auth/callback',
    '/grounds',
    '/grounds/:id',
  ],
});

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
