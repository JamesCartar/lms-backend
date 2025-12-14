# LMS Backend - Error Handling, Authentication & Permissions Guide

## Overview

This document describes the error handling, authentication, and permission systems implemented in the LMS backend.

## Features Implemented

### 1. Custom Error Classes

Custom error classes provide consistent error handling across the application:

- `BadRequestError` (400) - Invalid request data
- `UnauthorizedError` (401) - Authentication required or invalid
- `ForbiddenError` (403) - Insufficient permissions
- `NotFoundError` (404) - Resource not found
- `ConflictError` (409) - Duplicate or conflicting resource
- `ValidationError` (422) - Data validation failed
- `DatabaseError` (500) - Database operation failed
- `InternalServerError` (500) - General server error

**Usage Example:**
```typescript
import { NotFoundError, ConflictError } from '../utils/errors.util';

// In your service
if (!user) {
  throw new NotFoundError('User not found');
}

if (existingUser) {
  throw new ConflictError('Email already exists');
}
```

### 2. Global Error Handler

The global error handler middleware catches all errors and returns consistent responses.

**Features:**
- Handles custom application errors
- Handles Zod validation errors
- Handles MongoDB/Mongoose errors
- Provides consistent error response format
- Logs errors for debugging

**Response Format:**
```json
{
  "success": false,
  "message": "Error message",
  "errors": [...],  // Optional: validation errors
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 3. Consistent Response Format

All API responses follow a consistent format for both success and error cases.

**Success Response:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Usage in Controllers:**
```typescript
import { sendSuccessResponse } from '../utils/response.util';
import { asyncHandler } from '../middleware/error.middleware';

create = asyncHandler(async (req: Request, res: Response) => {
  const result = await this.service.createItem(req.body);
  sendSuccessResponse(res, result, 'Item created successfully', 201);
});
```

### 4. Authentication Middleware

JWT-based authentication system for securing API endpoints.

**Features:**
- Validates JWT tokens from Authorization header
- Extracts and attaches user payload to request
- Supports both required and optional authentication
- Handles token expiration and invalid tokens

**Usage:**
```typescript
import { authenticate } from '../middleware/auth.middleware';

// Protect all routes in a router
router.use(authenticate);

// Or protect individual routes
router.get('/protected', authenticate, controller.handler);
```

**Request Header:**
```
Authorization: Bearer <your-jwt-token>
```

### 5. Permission Check Middleware

Fine-grained permission control for API endpoints.

**Available Middleware:**
- `checkPermission(...permissions)` - User must have at least one permission
- `checkAllPermissions(...permissions)` - User must have all permissions
- `checkRole(...roles)` - User must have one of the specified roles
- `isAdmin` - User must be admin type
- `isStudent` - User must be student type

**Usage:**
```typescript
import { authenticate } from '../middleware/auth.middleware';
import { checkPermission, isAdmin } from '../middleware/permission.middleware';

// Require authentication and specific permission
router.post('/admin', 
  authenticate, 
  isAdmin,
  checkPermission('admin.create'), 
  controller.create
);

// Check multiple permissions (user needs at least one)
router.get('/data', 
  authenticate, 
  checkPermission('admin.read', 'manager.read'), 
  controller.getData
);
```

### 6. Database Seeding

Automated database seeding for initial data setup.

**Seed Data Included:**
- **Permissions** - 16 permissions for CRUD operations on admin, role, student, and permission resources
- **Roles** - 4 roles (Super Admin, Admin, Manager, Viewer) with appropriate permissions
- **Admin User** - Default super admin account
- **Students** - 5 sample student records

**Run Seeding:**
```bash
npm run seed
```

**Default Credentials:**
- Admin: `admin@example.com` / `admin123`
- Student: `john.doe@example.com` / `password123`

## API Endpoints

### Authentication

#### Admin Login
```
POST /api/v1/auth/login/admin
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "jwt-token-here",
    "user": {
      "id": "...",
      "name": "Super Admin",
      "email": "admin@example.com",
      "role": { ... },
      "type": "admin"
    }
  },
  "timestamp": "..."
}
```

#### Student Login
```
POST /api/v1/auth/login/student
Content-Type: application/json

{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

#### Get Current User
```
GET /api/v1/auth/me
Authorization: Bearer <token>
```

### Protected Resources

All CRUD endpoints for admins, roles, permissions, and students now require:
1. Authentication (valid JWT token)
2. Admin user type
3. Appropriate permissions

**Example Protected Endpoints:**
```
# Students (requires student.* permissions)
POST   /api/v1/students      # Requires: student.create
GET    /api/v1/students      # Requires: student.read
GET    /api/v1/students/:id  # Requires: student.read
PUT    /api/v1/students/:id  # Requires: student.update
DELETE /api/v1/students/:id  # Requires: student.delete

# Roles (requires role.* permissions)
POST   /api/v1/roles         # Requires: role.create
GET    /api/v1/roles         # Requires: role.read
GET    /api/v1/roles/:id     # Requires: role.read
PUT    /api/v1/roles/:id     # Requires: role.update
DELETE /api/v1/roles/:id     # Requires: role.delete

# Similar patterns for /api/v1/admins and /api/v1/permissions
```

## Permissions System

### Available Permissions

#### Admin CRUD
- `admin.create` - Create admin users
- `admin.read` - View admin users
- `admin.update` - Update admin users
- `admin.delete` - Delete admin users

#### Role CRUD
- `role.create` - Create roles
- `role.read` - View roles
- `role.update` - Update roles
- `role.delete` - Delete roles

#### Student CRUD
- `student.create` - Create students
- `student.read` - View students
- `student.update` - Update students
- `student.delete` - Delete students

#### Permission CRUD
- `permission.create` - Create permissions
- `permission.read` - View permissions
- `permission.update` - Update permissions
- `permission.delete` - Delete permissions

### Default Roles

#### Super Admin
Full system access with all 16 permissions.

#### Admin
Administrative access with:
- admin.read, role.read, permission.read
- student.* (all student operations)

#### Manager
Can manage students and view system data:
- student.create, student.read, student.update
- role.read, permission.read

#### Viewer
Read-only access:
- admin.read, role.read, student.read, permission.read

## Environment Variables

Add to your `.env` file:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/lms
JWT_SECRET=your-secret-key-change-this-in-production
```

**Important:** Change `JWT_SECRET` to a strong, unique value in production!

## Testing the API

### 1. Start the server
```bash
npm run dev
```

### 2. Seed the database
```bash
npm run seed
```

### 3. Login as admin
```bash
curl -X POST http://localhost:3000/api/v1/auth/login/admin \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'
```

### 4. Use the token
```bash
curl -X GET http://localhost:3000/api/v1/students \
  -H "Authorization: Bearer <your-token-here>"
```

## Error Handling Examples

### Validation Error (422)
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email"
    }
  ],
  "timestamp": "..."
}
```

### Unauthorized Error (401)
```json
{
  "success": false,
  "message": "No token provided. Please authenticate.",
  "timestamp": "..."
}
```

### Forbidden Error (403)
```json
{
  "success": false,
  "message": "Access denied. Required permissions: student.create",
  "timestamp": "..."
}
```

### Not Found Error (404)
```json
{
  "success": false,
  "message": "Student not found",
  "timestamp": "..."
}
```

## Best Practices

1. **Always use custom errors** in services instead of generic `Error`
2. **Use asyncHandler** to wrap async route handlers
3. **Apply authentication first**, then permission checks
4. **Use specific permissions** rather than broad role checks when possible
5. **Never log or expose sensitive data** (passwords, tokens) in errors
6. **Keep JWT_SECRET secure** and use environment variables

## Development Workflow

1. Create new service methods that throw custom errors
2. Wrap controller methods with `asyncHandler`
3. Use `sendSuccessResponse` for all success cases
4. Apply appropriate middleware to routes
5. Test with various scenarios including error cases

## Security Considerations

- Passwords are hashed with bcrypt (10 salt rounds)
- JWT tokens expire after 24 hours
- All protected routes require valid authentication
- Permission checks prevent unauthorized access
- Error messages don't expose sensitive information
- Database errors are caught and sanitized

## Future Enhancements

Consider adding:
- Refresh token mechanism
- Rate limiting
- Account lockout after failed attempts
- Password reset functionality
- Email verification
- Audit logging
- Role hierarchy
- Dynamic permission assignment
