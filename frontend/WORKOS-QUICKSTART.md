# WorkOS AuthKit - Quick Start

## 🚀 Get Started in 3 Steps

### Step 1: Sign Up for WorkOS
```
https://dashboard.workos.com/
```
1. Create an account
2. Create a new project
3. Click "Set up AuthKit"
4. Go to **API Keys** section to get your credentials

### Step 2: Configure Environment Variables

**Quick Setup** (Recommended):
```bash
cd frontend
./setup-workos.sh
```

**Manual Setup**:
```bash
# Generate cookie password
openssl rand -base64 24

# Edit frontend/.env.local with your values from WorkOS dashboard
WORKOS_API_KEY=sk_test_your_key_here
WORKOS_CLIENT_ID=client_your_id_here
WORKOS_REDIRECT_URI=http://localhost:3001/api/auth/callback
WORKOS_COOKIE_PASSWORD=<paste-generated-password>
```

**Important**: Configure these URLs in WorkOS Dashboard → Redirects:
- Redirect URI: `http://localhost:3001/api/auth/callback`
- Sign-out Redirect: `http://localhost:3001/`
- Login Endpoint: `http://localhost:3001/login`

### Step 3: Start the App
```bash
cd frontend
npm run dev
```

## 📚 Usage Examples

### Check if User is Logged In
```typescript
import { useAuth } from '@/lib/auth-context';

function MyComponent() {
  const { user, isAuthenticated, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Please sign in</div>;
  
  return <div>Hello, {user?.email}!</div>;
}
```

### Sign In Button
```typescript
function SignInButton() {
  const { signIn } = useAuth();
  
  return <button onClick={signIn}>Sign In</button>;
}
```

### Sign Up Button
```typescript
function SignUpButton() {
  const { signUp } = useAuth();
  
  return <button onClick={signUp}>Sign Up</button>;
}
```

### Sign Out Button
```typescript
function SignOutButton() {
  const { logout } = useAuth();
  
  return <button onClick={logout}>Sign Out</button>;
}
```

### Protect a Route
```typescript
import { ProtectedRoute } from '@/components/ProtectedRoute';

function Dashboard() {
  return (
    <ProtectedRoute>
      <h1>Protected Dashboard</h1>
    </ProtectedRoute>
  );
}
```

### Server-Side User Check
```typescript
import { getUser } from '@workos-inc/authkit-nextjs';

export async function GET(request: Request) {
  const { user } = await getUser();
  
  if (!user) {
    return new Response('Unauthorized', { status: 401 });
  }
  
  return Response.json({ user });
}
```

## 🔑 User Object
```typescript
{
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profilePictureUrl?: string;
}
```

## 🛠️ Troubleshooting

### Sessions not working?
- Ensure `WORKOS_COOKIE_PASSWORD` is at least 32 characters
- Check cookies are enabled in browser
- Verify redirect URI matches exactly

### Redirect loop?
- Check middleware `publicPaths` includes `/login`, `/register`, `/api/auth/callback`
- Verify WorkOS credentials are correct

### Can't sign in?
- Check WorkOS dashboard for error logs
- Ensure email+password auth is enabled
- Verify API key and Client ID are correct

## 📖 Full Documentation
See `WORKOS-AUTH-GUIDE.md` for complete setup instructions

## 🎨 Customize
Customize logo, colors, and branding in the WorkOS dashboard:
```
https://dashboard.workos.com/ → Authentication → Branding
```

## ✅ What's Different

| Before | After |
|--------|-------|
| Custom forms | Hosted UI |
| JWT tokens | Session cookies |
| Manual validation | Auto middleware |
| 540+ lines | 170 lines (-68%) |

That's it! You're ready to use WorkOS AuthKit. 🎉
