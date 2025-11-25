# Phase 5 - Authentication & Profile - Testing Guide

## ✅ Phase 5 Implementation Complete

All 22 implementation tasks (T081-T102) have been completed:
- Backend Auth Service with JWT + bcrypt
- API Gateway auth endpoints with validation + RBAC
- Frontend auth pages (register, login, profile)
- Auth context with localStorage JWT storage

## 🚀 Quick Start

### 1. Infrastructure (PostgreSQL + Redis)
```bash
# Already running! ✅
# If you need to restart:
./docker-up.sh
```

### 2. Database Setup
```bash
# Already created! ✅
# User table exists in auth.users schema
```

### 3. Start Services

**Terminal 1 - Auth Service** (Port 50051):
```bash
cd services/auth-service
npm run dev
```

**Terminal 2 - API Gateway** (Port 3001):
```bash
cd services/api-gateway
npm run dev
```

**Terminal 3 - Frontend** (Port 3000):
```bash
cd frontend
npm run dev
```

## 🧪 Test Authentication Flow

### 1. Register a New User
1. Open http://localhost:3000/register
2. Fill in the form:
   - Email: test@cst.edu.bt
   - Password: password123
   - Confirm Password: password123
   - Full Name: Test User
   - College: College of Science and Technology (CST)
3. Click "Register"
4. Should redirect to home page (logged in)

### 2. View Profile
1. Navigate to http://localhost:3000/profile
2. Should see your user details:
   - Full Name
   - Email
   - College
   - Role badge (blue = USER)
   - Member since date

###3. Edit Profile
1. Click "Edit Profile" button
2. Change Full Name or College
3. Click "Save Changes"
4. Should see success message

### 4. Logout
1. Click "Logout" button on profile page
2. Should redirect to home page
3. Auth token cleared from localStorage

### 5. Login
1. Navigate to http://localhost:3000/login
2. Enter credentials:
   - Email: test@cst.edu.bt
   - Password: password123
3. Click "Login"
4. Should redirect to home page (logged in)

## 🔍 Verify Implementation

### Check API Endpoints

**Register** (POST):
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "api@test.com",
    "password": "password123",
    "fullName": "API Test User",
    "college": "CST"
  }'
```

**Login** (POST):
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "api@test.com",
    "password": "password123"
  }'
```

**Get Profile** (GET - requires token):
```bash
# Replace YOUR_TOKEN with the token from login response
curl http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Check Database

```bash
# View registered users
docker exec osb-postgres psql -U osb_user -d one_stop_book -c "SELECT id, email, full_name, college, role FROM auth.users;"
```

## 📁 Files Created (16 new + 3 modified)

### Backend (Auth Service)
- `services/auth-service/src/services/jwt.service.ts` - JWT token generation/verification
- `services/auth-service/src/services/auth.service.ts` - Authentication business logic
- `services/auth-service/src/grpc/auth.server.ts` - gRPC server with 6 RPC handlers
- `services/auth-service/src/proto/auth.proto` - gRPC service definition
- `services/auth-service/.env` - Environment variables

### Backend (API Gateway)
- `services/api-gateway/src/controllers/auth.controller.ts` - REST API endpoints
- `services/api-gateway/src/middleware/validation/auth.validation.ts` - Joi validation
- `services/api-gateway/src/middleware/rbac.ts` - Role-based access control
- `services/api-gateway/src/routes/index.ts` - Updated with auth routes

### gRPC Clients
- `packages/grpc-clients/src/auth-client.ts` - Type-safe auth client
- `packages/grpc-clients/src/index.ts` - Updated exports

### Frontend
- `frontend/lib/auth-context.tsx` - React auth context provider
- `frontend/components/ProtectedRoute.tsx` - Route protection wrapper
- `frontend/app/(public)/register/page.tsx` - Registration form
- `frontend/app/(public)/login/page.tsx` - Login form
- `frontend/app/(auth)/profile/page.tsx` - Profile management page
- `frontend/app/layout.tsx` - Updated with AuthProvider

## 🎯 Next Steps

**Option 1: Proceed to Phase 6** (Booking Creation & Management)
- 26 implementation tasks (T108-T133)
- Core booking functionality
- This delivers the **CORE VALUE** of the platform

**Option 2: Write Phase 5 Tests** (T076-T080 - Optional)
- Unit tests for bcrypt and JWT
- Integration tests for auth endpoints

**Option 3: Test Phase 3-5 Integration**
- Full flow: Ground discovery → Ground details → Register → Login → Profile
- Verify JWT authentication works across all features

## ⚠️ Known Issues

- TypeScript errors in services (Prisma client types) - expected until all services run
- Prisma migrate has permission issues - used manual SQL schema creation instead
- Auth Service gRPC server needs to be started manually

## 🔧 Troubleshooting

**Can't connect to database:**
```bash
./docker-up.sh  # Restart infrastructure
```

**Prisma Client errors:**
```bash
cd services/auth-service
npx prisma generate
```

**Port already in use:**
```bash
# Kill process on port (example for 3001)
lsof -ti:3001 | xargs kill -9
```

**Clear auth state:**
- Open browser DevTools → Application → Local Storage
- Delete `auth_token` and `auth_user` keys
