# Frontend Setup Guide

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Update the API Gateway URL if needed (default: `http://localhost:3000`)

### 3. Start Development Server
```bash
npm run dev
```

The frontend will be available at http://localhost:3001

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:3000` | API Gateway base URL |
| `NEXT_PUBLIC_APP_NAME` | `One Stop Book` | Application name |

## Project Structure

See `STRUCTURE.md` for detailed folder organization.

## API Endpoints Used

The frontend communicates with these API Gateway endpoints:

### Public Endpoints
- `GET /api/grounds` - List all grounds
- `GET /api/grounds/:id` - Get ground details
- `GET /api/grounds/:id/availability` - Get availability calendar
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Protected Endpoints (require authentication)
- `GET /api/auth/me` - Get current user
- `PATCH /api/auth/me` - Update profile
- `GET /api/bookings` - Get user bookings
- `POST /api/bookings` - Create booking
- `DELETE /api/bookings/:id` - Cancel booking

## Authentication

The app uses JWT tokens stored in `localStorage`. Tokens are automatically included in requests via the `Authorization: Bearer <token>` header.

## Common Issues

### API 404 Errors
**Problem**: Getting 404 errors for `/api/*` endpoints

**Solution**: 
1. Ensure API Gateway is running on port 3000
2. Check `.env.local` has correct `NEXT_PUBLIC_API_URL`
3. Restart the frontend dev server after changing env variables

### CORS Errors
**Problem**: CORS policy blocking requests

**Solution**: API Gateway must be configured to allow the frontend origin (http://localhost:3001)

### Authentication Errors
**Problem**: "Unauthorized" errors

**Solution**:
1. Clear localStorage: `localStorage.clear()`
2. Login again
3. Check JWT token hasn't expired (24h default)

## Development

### Hot Reload
Next.js automatically reloads on file changes. For environment variable changes, restart the dev server.

### Build for Production
```bash
npm run build
npm start
```

### Type Checking
```bash
npm run type-check
```

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context + Custom Hooks
- **HTTP Client**: Native Fetch API

---

For more information, see the main project `README.md` in the repository root.
