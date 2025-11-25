# WorkOS AuthKit Integration Guide

## Overview

The authentication system has been migrated to use **WorkOS AuthKit** for a simpler, more secure, and production-ready authentication flow. WorkOS handles user management, sessions, and provides a hosted authentication UI.

## Setup Instructions

### 1. Create a WorkOS Account

1. Go to [https://dashboard.workos.com/](https://dashboard.workos.com/)
2. Sign up for a free account
3. Create a new project

### 2. Configure WorkOS

1. In your WorkOS dashboard, navigate to **Authentication** → **Configuration**
2. Enable **Email + Password** authentication
3. Configure your redirect URIs:
   - Development: `http://localhost:3001/api/auth/callback`
   - Production: `https://yourdomain.com/api/auth/callback`

### 3. Get Your Credentials

From the WorkOS dashboard, copy these values:

- **API Key**: Found in **API Keys** section
- **Client ID**: Found in **Configuration** → **Environments**

### 4. Update Environment Variables

Update `/frontend/.env.local` with your actual WorkOS credentials:

```bash
# WorkOS Configuration
WORKOS_API_KEY=sk_test_your_actual_api_key_here
WORKOS_CLIENT_ID=client_your_actual_client_id_here
WORKOS_REDIRECT_URI=http://localhost:3001/api/auth/callback
WORKOS_COOKIE_PASSWORD=your-secure-32-character-random-string
```

**Generate a secure WORKOS_COOKIE_PASSWORD**:
```bash
openssl rand -base64 32
```

### 5. Start the Application

```bash
cd frontend
npm run dev
```

## How It Works

### Authentication Flow

1. **Sign In/Sign Up**:
   - Users click "Sign In" or "Sign Up" buttons
   - They are redirected to WorkOS hosted authentication UI
   - WorkOS handles password validation, security, and user creation

2. **Callback**:
   - After successful authentication, WorkOS redirects to `/api/auth/callback`
   - A secure session cookie is created
   - User is redirected to the dashboard

3. **Session Management**:
   - WorkOS maintains encrypted session cookies
   - Sessions are automatically validated on protected routes
   - No need for manual JWT token management

4. **Protected Routes**:
   - Middleware automatically protects routes
   - Dashboard and booking pages require authentication
   - Unauthenticated users are redirected to sign in

### Key Components

#### 1. **Middleware** (`middleware.ts`)
```typescript
import { authkitMiddleware } from '@workos-inc/authkit-nextjs';

export default authkitMiddleware({
  publicPaths: ['/', '/login', '/register', '/grounds'],
});
```

#### 2. **Auth Context** (`lib/auth-context.tsx`)
```typescript
const { user, isAuthenticated, loading, signIn, signUp, logout } = useAuth();
```

#### 3. **Protected Routes** (`components/ProtectedRoute.tsx`)
```typescript
<ProtectedRoute>
  <YourProtectedContent />
</ProtectedRoute>
```

## Migration from Custom Auth

### What Changed

| Old System | WorkOS AuthKit |
|------------|----------------|
| Custom JWT tokens | Encrypted session cookies |
| Manual user management | WorkOS-managed users |
| Custom forms | Hosted auth UI |
| localStorage tokens | Secure HTTP-only cookies |
| Manual session validation | Automatic middleware |

### Removed Components

- ❌ Custom login/register forms
- ❌ Manual token storage
- ❌ Password hashing logic
- ❌ Token refresh mechanisms
- ❌ Email verification flows

### New Benefits

- ✅ **Security**: Industry-standard authentication
- ✅ **Simplicity**: ~200 lines of code vs ~1000+
- ✅ **Features**: Social login, MFA, SSO ready
- ✅ **Compliance**: GDPR, SOC 2 compliant
- ✅ **UX**: Professional hosted UI
- ✅ **No maintenance**: WorkOS handles updates

## User Object

WorkOS provides the following user data:

```typescript
interface User {
  id: string;                    // Unique user ID
  email: string;                 // User email
  firstName?: string;            // Optional first name
  lastName?: string;             // Optional last name
  profilePictureUrl?: string;    // Optional profile picture
}
```

## API Usage

### Get Current User

```typescript
import { getUser } from '@workos-inc/authkit-nextjs';

const { user } = await getUser();
```

### Sign In

```typescript
import { getSignInUrl } from '@workos-inc/authkit-nextjs';

const signInUrl = await getSignInUrl();
router.push(signInUrl);
```

### Sign Up

```typescript
import { getSignUpUrl } from '@workos-inc/authkit-nextjs';

const signUpUrl = await getSignUpUrl();
router.push(signUpUrl);
```

### Sign Out

```typescript
import { signOut } from '@workos-inc/authkit-nextjs';

await signOut();
```

## Backend Integration

### Validating Requests

When making API calls to your backend, you can verify the user session:

```typescript
import { getUser } from '@workos-inc/authkit-nextjs';

// In API routes
export async function GET(request: Request) {
  const { user } = await getUser();
  
  if (!user) {
    return new Response('Unauthorized', { status: 401 });
  }
  
  // Use user.id, user.email, etc.
}
```

### Backend Auth Service Updates

Update your API Gateway to validate WorkOS sessions instead of custom JWT:

1. Install WorkOS SDK in your backend:
```bash
npm install @workos-inc/node
```

2. Validate session tokens from requests

## Customization

### Branding

Customize the hosted UI in WorkOS dashboard:
- Logo
- Colors
- Button styles
- Email templates

### Additional Fields

Add custom fields using WorkOS User Management API:
- College affiliation
- User roles
- Additional profile data

## Troubleshooting

### "Unauthorized" Errors

1. Check environment variables are set correctly
2. Ensure `WORKOS_COOKIE_PASSWORD` is at least 32 characters
3. Verify redirect URI matches exactly

### Session Not Persisting

1. Check cookies are enabled
2. Ensure you're not blocking third-party cookies
3. Verify HTTPS in production

### Redirect Loop

1. Check middleware configuration
2. Ensure callback route is public
3. Verify redirect URI in WorkOS dashboard

## Resources

- [WorkOS AuthKit Docs](https://workos.com/docs/user-management/authkit)
- [Next.js Integration Guide](https://workos.com/docs/user-management/next-js)
- [WorkOS Dashboard](https://dashboard.workos.com/)

## Support

For issues:
- WorkOS Support: [support@workos.com](mailto:support@workos.com)
- Documentation: [https://workos.com/docs](https://workos.com/docs)
- Community: [WorkOS Discord](https://discord.gg/workos)
