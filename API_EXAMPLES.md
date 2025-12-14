# API Usage Examples

This document provides examples of how to use the LMS Backend API.

## Base URL
```
http://localhost:3000/api/v1
```

## Permissions API

### Create Permission
```bash
curl -X POST http://localhost:3000/api/v1/permissions \
  -H "Content-Type: application/json" \
  -d '{
    "name": "create_course",
    "resource": "course",
    "action": "create",
    "description": "Permission to create new courses"
  }'
```

### Get All Permissions
```bash
curl http://localhost:3000/api/v1/permissions
```

### Get Permission by ID
```bash
curl http://localhost:3000/api/v1/permissions/{id}
```

### Update Permission
```bash
curl -X PUT http://localhost:3000/api/v1/permissions/{id} \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Updated description"
  }'
```

### Delete Permission
```bash
curl -X DELETE http://localhost:3000/api/v1/permissions/{id}
```

## Roles API

### Create Role
```bash
curl -X POST http://localhost:3000/api/v1/roles \
  -H "Content-Type: application/json" \
  -d '{
    "name": "instructor",
    "description": "Instructor role with course management permissions",
    "permissions": ["<permission_id_1>", "<permission_id_2>"]
  }'
```

### Get All Roles
```bash
curl http://localhost:3000/api/v1/roles
```

### Get Role by ID
```bash
curl http://localhost:3000/api/v1/roles/{id}
```

### Update Role
```bash
curl -X PUT http://localhost:3000/api/v1/roles/{id} \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Updated role description",
    "permissions": ["<permission_id_1>", "<permission_id_2>", "<permission_id_3>"]
  }'
```

### Delete Role
```bash
curl -X DELETE http://localhost:3000/api/v1/roles/{id}
```

## Admins API

### Create Admin
```bash
curl -X POST http://localhost:3000/api/v1/admins \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john.doe@example.com",
    "password": "securePassword123",
    "role": "<role_id>",
    "isActive": true
  }'
```

### Get All Admins
```bash
curl http://localhost:3000/api/v1/admins
```

### Get Admin by ID
```bash
curl http://localhost:3000/api/v1/admins/{id}
```

### Update Admin
```bash
curl -X PUT http://localhost:3000/api/v1/admins/{id} \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Updated",
    "isActive": false
  }'
```

### Delete Admin
```bash
curl -X DELETE http://localhost:3000/api/v1/admins/{id}
```

## Students API

### Create Student
```bash
curl -X POST http://localhost:3000/api/v1/students \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane.smith@example.com",
    "password": "studentPassword123",
    "phone": "1234567890",
    "dateOfBirth": "2000-01-01",
    "address": "123 Main St, City, Country",
    "enrollmentYear": 2024,
    "isActive": true
  }'
```

### Get All Students
```bash
curl http://localhost:3000/api/v1/students
```

### Get Student by ID
```bash
curl http://localhost:3000/api/v1/students/{id}
```

### Get Students by Enrollment Year
```bash
curl http://localhost:3000/api/v1/students/year/2024
```

### Update Student
```bash
curl -X PUT http://localhost:3000/api/v1/students/{id} \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "9876543210",
    "address": "456 New St, City, Country"
  }'
```

### Delete Student
```bash
curl -X DELETE http://localhost:3000/api/v1/students/{id}
```

## Response Format

All API responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* response data */ }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message description"
}
```

### Validation Error Response
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

## Validation Rules

### Permission
- `name`: 3-50 characters, required
- `resource`: 3-50 characters, required
- `action`: 3-50 characters, required
- `description`: 0-200 characters, optional

### Role
- `name`: 3-50 characters, required
- `description`: 0-200 characters, optional
- `permissions`: Array of permission IDs, optional

### Admin
- `name`: 2-100 characters, required
- `email`: Valid email format, required, unique
- `password`: 6-100 characters, required
- `role`: Valid role ID, optional
- `isActive`: Boolean, optional (default: true)

### Student
- `firstName`: 2-50 characters, required
- `lastName`: 2-50 characters, required
- `email`: Valid email format, required, unique
- `password`: 6-100 characters, required
- `phone`: 10-15 characters, optional
- `dateOfBirth`: Valid date, optional
- `address`: 0-200 characters, optional
- `enrollmentYear`: Number between 1900-2100, optional
- `isActive`: Boolean, optional (default: true)
