# Admin Ground Management - Quick Start Guide

## Prerequisites
- All services running (run `./docker-up.sh` from project root)
- Frontend running on http://localhost:3001
- WorkOS authentication configured and working

## Accessing Admin Interface

1. **Login to the system**
   ```
   Navigate to: http://localhost:3001/login
   Sign in with your WorkOS credentials
   ```

2. **Navigate to Admin Dashboard**
   ```
   URL: http://localhost:3001/admin/grounds
   ```

## Admin Features

### 1. View All Grounds
- The dashboard shows all grounds in a grid layout
- Each card displays:
  - Ground photo (if available)
  - Ground name
  - College affiliation
  - Location
  - Capacity
  - Active/Inactive status

### 2. Filter Grounds by College
- Use the dropdown at the top to filter grounds by college:
  - Royal University of Bhutan
  - College of Science and Technology
  - Jigme Namgyel Engineering College
  - College of Natural Resources
  - Sherubtse College

### 3. Create New Ground

**Step 1:** Click "Create New Ground" button

**Step 2:** Fill in the form:

**Required Fields:**
- **Name**: e.g., "Main Football Field"
- **College**: Select from dropdown
- **Location**: e.g., "Sports Complex, Main Campus"
- **Capacity**: Number of people (e.g., 50)

**Optional Fields:**
- **Description**: Details about the ground
- **Amenities**: Check applicable boxes:
  - ☐ Floodlights
  - ☐ Parking
  - ☐ Washrooms
  - ☐ Changing Rooms
  - ☐ Seating
  - ☐ Scoreboard
  - ☐ First Aid
  - ☐ Cafeteria

- **Photos**: Add photo URLs
  - Click "+ Add Photo" to add more photos
  - Click "Remove" to delete a photo input
  - Enter full image URLs (e.g., https://example.com/photo.jpg)

**Step 3:** Click "Create Ground"

**Example:**
```
Name: Football Field
College: Royal University of Bhutan
Location: Main Sports Complex
Capacity: 100
Description: Full-size football field with artificial turf
Amenities: ✓ Floodlights, ✓ Parking, ✓ Washrooms, ✓ Changing Rooms
Photos: https://example.com/football-field.jpg
```

### 4. Edit Existing Ground

**Step 1:** Find the ground you want to edit in the dashboard

**Step 2:** Click the "Edit" button on the ground card

**Step 3:** Update any fields:
- All fields from create form are editable
- College can be changed
- Photos can be added or removed
- Amenities can be toggled

**Step 4:** Click "Update Ground"

**Step 5:** Click "Cancel" to return without saving

### 5. Deactivate Ground

**Step 1:** Find the ground you want to deactivate

**Step 2:** Click the "Deactivate" button (red button)

**Result:**
- Ground is not deleted from database
- Ground is marked as inactive (`is_active = false`)
- Red "Inactive" badge appears on the card
- Ground no longer appears in public searches (unless specifically included)
- Can still be viewed and edited by admins

## API Endpoints Used

The frontend calls these Next.js API routes:

```
GET    /api/grounds               - List all grounds (with filters)
GET    /api/grounds/:id           - Get single ground details
POST   /api/admin/grounds         - Create new ground
PUT    /api/admin/grounds/:id     - Update ground
DELETE /api/admin/grounds/:id     - Deactivate ground
```

Which forward to these API Gateway endpoints:

```
GET    /api/grounds               - Public grounds listing
GET    /api/grounds/:id           - Public ground details
POST   /api/admin/grounds         - Admin: Create ground
PUT    /api/admin/grounds/:id     - Admin: Update ground
DELETE /api/admin/grounds/:id     - Admin: Deactivate ground
```

## Troubleshooting

### "Authentication required" error
- **Problem**: WorkOS session cookie missing or expired
- **Solution**: 
  1. Logout: http://localhost:3001/api/auth/logout
  2. Login again: http://localhost:3001/login

### Ground not appearing after creation
- **Problem**: May have created with different college filter active
- **Solution**: Change college filter to "All" or select the college you created

### Photos not showing
- **Problem**: Invalid image URL or CORS issue
- **Solution**: 
  1. Verify URL is accessible in browser
  2. Use direct image URLs (not webpage URLs)
  3. Ensure image server allows cross-origin requests

### "Failed to create ground" error
- **Problem**: Backend validation failed
- **Solutions**:
  1. Check all required fields are filled
  2. Verify capacity is a positive number
  3. Ensure amenities are from allowed list
  4. Check photo URLs are valid strings

### Changes not reflecting
- **Problem**: Cache or stale data
- **Solution**:
  1. Refresh the page
  2. Clear browser cache
  3. Check browser console for errors

## Development Notes

### Current Authentication Flow
```
Frontend (Next.js)
  ↓ Validates WorkOS session cookie
  ↓ Adds service token header
  ↓
API Gateway
  ↓ Validates service token
  ↓ Creates mock admin user
  ↓
gRPC Grounds Service
  ↓ Performs operation
  ↓
PostgreSQL Database
```

### Mock User Details
```typescript
{
  userId: 'admin-user-1',
  email: 'admin@example.com',
  role: 'admin',
  college: 'Royal University of Bhutan'
}
```

### Production Todos
- [ ] Replace mock user with actual WorkOS user info
- [ ] Implement proper role-based access control
- [ ] Add college-based permissions (admins can only manage their college)
- [ ] Replace URL photo input with file upload
- [ ] Add confirmation dialogs for destructive actions
- [ ] Implement soft delete recovery (reactivate)
- [ ] Add audit logging for all admin actions

## Example Test Scenario

### Create a Ground for Testing
1. Login to http://localhost:3001/login
2. Navigate to http://localhost:3001/admin/grounds
3. Click "Create New Ground"
4. Fill in:
   ```
   Name: Test Basketball Court
   College: Royal University of Bhutan
   Location: Indoor Sports Hall
   Capacity: 30
   Description: Indoor basketball court with wooden flooring
   Amenities: Floodlights, Washrooms, Changing Rooms, Seating
   Photos: https://images.unsplash.com/photo-1546519638-68e109498ffc
   ```
5. Click "Create Ground"
6. Verify ground appears in listing
7. Click "Edit" and change capacity to 40
8. Click "Update Ground"
9. Verify capacity changed
10. Click "Deactivate"
11. Verify "Inactive" badge appears

## Support

For issues or questions:
1. Check browser console for error messages
2. Check API Gateway logs: `docker logs one-stop-book-api-gateway-1`
3. Check Grounds Service logs: `docker logs one-stop-book-grounds-service-1`
4. Check frontend logs in terminal where `npm run dev` is running

## Screenshots

### Admin Dashboard
```
+--------------------------------------------------+
|  Admin - Manage Grounds                          |
|                                                  |
|  [College Filter: All Colleges ▼]  [+ New]      |
|                                                  |
|  +-------------+  +-------------+  +----------+  |
|  |   [Photo]   |  |   [Photo]   |  | [Photo]  |  |
|  | Field Name  |  | Court Name  |  | Ground   |  |
|  | College ABC |  | College XYZ |  | College  |  |
|  | 📍 Location |  | 📍 Location |  | 📍 Loc   |  |
|  | 👥 Cap: 50  |  | 👥 Cap: 30  |  | 👥 40    |  |
|  | [Edit] [❌] |  | [Edit] [❌] |  | [Edit]   |  |
|  +-------------+  +-------------+  +----------+  |
+--------------------------------------------------+
```

### Create Ground Form
```
+------------------------------------------+
|  Create New Ground                        |
|                                          |
|  Basic Information                       |
|  Name: [___________________________]     |
|  College: [Select ▼]                     |
|  Location: [_______________________]     |
|  Capacity: [____]                        |
|  Description: [________________...]      |
|                                          |
|  Amenities                               |
|  ☐ Floodlights  ☐ Parking               |
|  ☐ Washrooms    ☐ Changing Rooms        |
|  ☐ Seating      ☐ Scoreboard            |
|  ☐ First Aid    ☐ Cafeteria             |
|                                          |
|  Photos                                  |
|  [URL input 1] [Remove]                  |
|  [URL input 2] [Remove]                  |
|  [+ Add Photo]                           |
|                                          |
|  [Create Ground]  [Cancel]               |
+------------------------------------------+
```
