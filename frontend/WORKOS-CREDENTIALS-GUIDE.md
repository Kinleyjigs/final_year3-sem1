# How to Get Your WorkOS API Credentials

This guide will walk you through obtaining your WorkOS API Key and Client ID for authentication.

## Prerequisites

- A web browser
- Email address for account creation

## Step-by-Step Instructions

### 1. Create a WorkOS Account (2 minutes)

1. Visit **https://dashboard.workos.com/**
2. Click "Sign up" or "Get started"
3. Enter your email and create a password
4. Verify your email address (check your inbox)

### 2. Create a New Project (1 minute)

Once logged in:

1. You'll see the WorkOS Dashboard
2. If this is your first time, you'll be prompted to create a project
3. Enter a project name (e.g., "One Stop Book" or "Campus Booking")
4. Click "Create Project"

### 3. Set Up AuthKit (2 minutes)

1. In the **Overview** section, click the **"Set up AuthKit"** button
2. Follow the onboarding wizard:
   - Enable **Email + Password** authentication
   - Choose authentication methods you want to enable
   - Click "Continue" through the setup

### 4. Get Your API Credentials (1 minute)

#### Get API Key:

1. In the left sidebar, click **"API Keys"**
2. You'll see your **API Key** displayed (starts with `sk_test_` for development)
3. Click the **copy icon** next to the API Key
4. Save this value - you'll need it for `WORKOS_API_KEY`

#### Get Client ID:

1. On the same **"API Keys"** page
2. You'll see your **Client ID** (starts with `client_`)
3. Click the **copy icon** next to the Client ID  
4. Save this value - you'll need it for `WORKOS_CLIENT_ID`

### 5. Configure Redirect URIs (2 minutes)

1. In the left sidebar, click **"Configuration"**
2. Click on the **"Redirects"** tab
3. Add the following URLs:

   **Redirect URI** (where users return after authentication):
   ```
   http://localhost:3001/api/auth/callback
   ```

   **Sign-out Redirect URI** (where users go after logging out):
   ```
   http://localhost:3001/
   ```

   **Login Endpoint** (your app's login page):
   ```
   http://localhost:3001/login
   ```

4. Click **"Save"** for each URL

### 6. Update Your Application (1 minute)

Now update your `.env.local` file:

**Option A: Automated Setup** (Recommended)
```bash
cd frontend
./setup-workos.sh
```
Then paste your API Key and Client ID when prompted.

**Option B: Manual Setup**
```bash
# Edit frontend/.env.local
WORKOS_API_KEY=sk_test_<paste_your_key_here>
WORKOS_CLIENT_ID=client_<paste_your_id_here>
WORKOS_COOKIE_PASSWORD=<run: openssl rand -base64 24>
WORKOS_REDIRECT_URI=http://localhost:3001/api/auth/callback
```

## Visual Guide

### Finding API Keys in Dashboard

```
WorkOS Dashboard
├── Left Sidebar
│   └── API Keys ← Click here
│       ├── API Key: sk_test_xxxxx... ← Copy this
│       └── Client ID: client_xxxxx... ← Copy this
```

### Finding Redirect Configuration

```
WorkOS Dashboard
├── Left Sidebar
│   └── Configuration ← Click here
│       └── Redirects Tab ← Click here
│           ├── Redirect URI ← Add callback URL
│           ├── Sign-out Redirect URI ← Add home URL
│           └── Login Endpoint ← Add login URL
```

## Verification Checklist

Before moving on, make sure you have:

- [ ] Created a WorkOS account
- [ ] Created a project
- [ ] Enabled AuthKit with Email + Password
- [ ] Copied your API Key (starts with `sk_test_`)
- [ ] Copied your Client ID (starts with `client_`)
- [ ] Added redirect URI: `http://localhost:3001/api/auth/callback`
- [ ] Added sign-out redirect: `http://localhost:3001/`
- [ ] Added login endpoint: `http://localhost:3001/login`
- [ ] Updated your `.env.local` file with these values

## What the Credentials Look Like

### API Key Format
```
sk_test_abc123def456ghi789jkl012mno345pqr678stu901vwx234yz
```
- Starts with `sk_test_` (development) or `sk_live_` (production)
- Long alphanumeric string
- Keep this SECRET - never commit to git

### Client ID Format
```
client_abc123def456ghi789jkl012mno345
```
- Starts with `client_`
- Shorter than API key
- Can be public (used in frontend)

## Common Issues

### Can't Find API Keys Section
**Solution**: Make sure you've completed the AuthKit setup wizard first. The API Keys section appears after setup.

### "Invalid API Key" Error
**Solution**: 
- Make sure you copied the entire key including `sk_test_` prefix
- Check for extra spaces or line breaks
- Ensure you're using the test key for development

### "Redirect URI Mismatch" Error
**Solution**:
- Verify the redirect URI in `.env.local` matches exactly what's in the WorkOS dashboard
- Check for trailing slashes - they matter!
- Ensure you're using `http://` (not `https://`) for localhost

### Session Not Working
**Solution**:
- Generate cookie password using: `openssl rand -base64 24`
- Ensure it's at least 32 characters
- Check there are no quotes around the password in `.env.local`

## Production Setup

When you're ready to deploy:

1. In WorkOS Dashboard, switch to **Production** environment
2. Get your **production** API key (starts with `sk_live_`)
3. Add your production redirect URIs (with `https://`)
4. Update your production environment variables
5. Never expose production keys in your code!

## Need Help?

- 📖 [WorkOS Documentation](https://workos.com/docs/authkit)
- 💬 [WorkOS Discord](https://discord.gg/workos)
- 📧 [WorkOS Support](mailto:support@workos.com)
- 🎓 [Next.js Integration Guide](https://workos.com/docs/authkit/nextjs)

## Next Steps

Once you have your credentials configured:

1. Start your application: `npm run dev`
2. Visit http://localhost:3001
3. Click "Sign Up" to test registration
4. Try signing in with your new account
5. Test protected routes (dashboard, bookings)

---

**Congratulations!** You now have WorkOS AuthKit fully configured. 🎉

See `WORKOS-SETUP-COMPLETE.md` for the complete integration guide.
