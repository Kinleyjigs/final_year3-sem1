# Frontend Folder Structure

This document outlines the organized folder structure of the One Stop Book frontend application.

## Directory Layout

```
frontend/
├── app/                          # Next.js 13+ App Router
│   ├── (auth)/                   # Protected routes (requires authentication)
│   │   ├── dashboard/
│   │   │   └── page.tsx         # My Bookings dashboard
│   │   └── profile/
│   │       └── page.tsx         # User profile management
│   │
│   ├── (public)/                # Public routes (no authentication required)
│   │   ├── grounds/
│   │   │   ├── page.tsx         # Grounds listing page (main landing)
│   │   │   └── [id]/
│   │   │       └── page.tsx     # Ground details with availability calendar
│   │   ├── login/
│   │   │   └── page.tsx         # Login page
│   │   └── register/
│   │       └── page.tsx         # Registration page
│   │
│   ├── layout.tsx               # Root layout with auth provider
│   ├── page.tsx                 # Root redirect to /grounds
│   └── globals.css              # Global styles
│
├── components/                   # Reusable React components
│   ├── AvailabilityCalendar.tsx # Interactive booking calendar
│   ├── BookingCard.tsx          # Booking display with status badges
│   ├── BookingForm.tsx          # Modal form for creating bookings
│   ├── GroundCard.tsx           # Ground preview card
│   └── ProtectedRoute.tsx       # Authentication wrapper component
│
├── lib/                          # Utilities and hooks
│   ├── api-client.ts            # API communication layer
│   ├── auth-context.tsx         # Authentication context provider
│   └── hooks/
│       ├── useAvailability.ts   # Fetch ground availability
│       ├── useCancelBooking.ts  # Cancel booking mutation
│       └── useCreateBooking.ts  # Create booking mutation
│
└── public/                       # Static assets
    └── (images, icons, etc.)
```

## Route Organization

### Route Groups
- **(auth)**: Routes that require user authentication
- **(public)**: Routes accessible to all visitors

Route groups use parentheses in Next.js 13+ to organize routes without affecting the URL structure.

### URL Mapping
- `/` → Redirects to `/grounds`
- `/grounds` → Public grounds listing page
- `/grounds/[id]` → Ground details page with availability calendar
- `/login` → User login
- `/register` → User registration
- `/dashboard` → User's booking dashboard (protected)
- `/profile` → User profile management (protected)

## Key Features

### Component Organization
- **Atomic design**: Components are small, reusable, and focused
- **Clear naming**: Component names describe their purpose
- **Separation of concerns**: UI components separate from business logic

### Library Structure
- **api-client.ts**: Centralized API communication with type safety
- **auth-context.tsx**: Global authentication state management
- **hooks/**: Custom React hooks for data fetching and mutations

### Type Safety
- All components use TypeScript for type checking
- Interfaces defined for API responses
- Props validated with TypeScript interfaces

## Best Practices Applied

1. **Next.js App Router**: Using latest Next.js 13+ features
2. **Route Groups**: Logical organization without URL pollution
3. **Client Components**: Marked with 'use client' when needed
4. **Custom Hooks**: Reusable logic extracted to hooks
5. **Error Handling**: Proper error states in all data-fetching components
6. **Loading States**: User feedback during async operations
7. **Responsive Design**: Tailwind CSS for mobile-first design
8. **Accessibility**: Semantic HTML and ARIA labels

## Adding New Features

### Adding a new public page:
```bash
frontend/app/(public)/[new-page]/page.tsx
```

### Adding a new protected page:
```bash
frontend/app/(auth)/[new-page]/page.tsx
```

### Adding a new component:
```bash
frontend/components/[ComponentName].tsx
```

### Adding a new hook:
```bash
frontend/lib/hooks/use[HookName].ts
```

---

**Last Updated**: 2025-11-24
**Framework**: Next.js 16.0.3 with App Router
**Styling**: Tailwind CSS
