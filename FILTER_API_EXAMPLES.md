# Filter API Examples

This document provides practical examples of using the filtering functionality in the LMS backend APIs.

## Table of Contents
- [Student API Examples](#student-api-examples)
- [Admin API Examples](#admin-api-examples)
- [Role API Examples](#role-api-examples)
- [Permission API Examples](#permission-api-examples)
- [AuditLog API Examples](#auditlog-api-examples)
- [UserLog API Examples](#userlog-api-examples)

---

## Student API Examples

### Get All Students
```bash
GET /api/students
```
**Response:**
```json
{
  "success": true,
  "message": "Students retrieved successfully",
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPrevPage": false
  },
  "timestamp": "2024-12-14T14:30:00.000Z"
}
```

### Search Students
```bash
GET /api/students?search=john
```
Searches across: firstName, lastName, email

### Filter by Enrollment Year
```bash
GET /api/students?enrollmentYear=2023
```

### Filter by Active Status
```bash
GET /api/students?isActive=true
```

### Filter by Name
```bash
GET /api/students?firstName=john&lastName=doe
```

### Filter by Date Range
```bash
GET /api/students?createdAfter=2024-01-01T00:00:00.000Z&createdBefore=2024-12-31T23:59:59.999Z
```

### Combined Filters with Pagination
```bash
GET /api/students?enrollmentYear=2023&isActive=true&search=john&page=1&limit=20&sortBy=createdAt&sortOrder=desc
```

### Error Response (Invalid Parameter)
```bash
GET /api/students?enrollmentYear=invalid
```
**Response:**
```json
{
  "success": false,
  "message": "Invalid query parameters. Please check your filters",
  "errors": [
    {
      "field": "enrollmentYear",
      "message": "enrollmentYear must be a number"
    }
  ],
  "timestamp": "2024-12-14T14:30:00.000Z"
}
```

---

## Admin API Examples

### Search Admins
```bash
GET /api/admins?search=admin
```
Searches across: name, email

### Filter by Role
```bash
GET /api/admins?role=507f1f77bcf86cd799439011
```

### Filter by Active Status
```bash
GET /api/admins?isActive=true
```

### Filter by Email
```bash
GET /api/admins?email=admin@example.com
```

### Combined Filters
```bash
GET /api/admins?isActive=true&role=507f1f77bcf86cd799439011&search=john
```

---

## Role API Examples

### Search Roles
```bash
GET /api/roles?search=admin
```
Searches across: name, description

### Filter by Name
```bash
GET /api/roles?name=super
```

### Filter by Description
```bash
GET /api/roles?description=full access
```

### Filter by Creation Date
```bash
GET /api/roles?createdAfter=2024-01-01T00:00:00.000Z
```

---

## Permission API Examples

### Search Permissions
```bash
GET /api/permissions?search=create
```
Searches across: name, resource, action, description

### Filter by Resource
```bash
GET /api/permissions?resource=student
```

### Filter by Action
```bash
GET /api/permissions?action=create
```

### Filter by Resource and Action
```bash
GET /api/permissions?resource=student&action=create
```

### Combined Filters
```bash
GET /api/permissions?resource=student&search=create&sortBy=createdAt&sortOrder=asc
```

---

## AuditLog API Examples

### Search Audit Logs
```bash
GET /api/auditlogs?search=john
```
Searches across: email, resource

### Filter by User ID
```bash
GET /api/auditlogs?userId=507f1f77bcf86cd799439011
```

### Filter by User Type
```bash
GET /api/auditlogs?userType=admin
```

### Filter by Action
```bash
GET /api/auditlogs?action=CREATE
```

### Filter by Resource
```bash
GET /api/auditlogs?resource=student
```

### Filter by Resource ID
```bash
GET /api/auditlogs?resourceId=507f1f77bcf86cd799439011
```

### Filter by Date Range
```bash
GET /api/auditlogs?createdAfter=2024-12-01T00:00:00.000Z&createdBefore=2024-12-31T23:59:59.999Z
```
Note: AuditLog uses the `timestamp` field, but the API still accepts `createdBefore`/`createdAfter` parameters for consistency.

### Combined Filters
```bash
GET /api/auditlogs?userType=admin&action=CREATE&resource=student&createdAfter=2024-12-01T00:00:00.000Z
```

---

## UserLog API Examples

### Search User Logs
```bash
GET /api/userlogs?search=john
```
Searches across: email, ip

### Filter by User ID
```bash
GET /api/userlogs?userId=507f1f77bcf86cd799439011
```

### Filter by User Type
```bash
GET /api/userlogs?userType=student
```

### Filter by Email
```bash
GET /api/userlogs?email=john.doe@example.com
```

### Filter by IP Address
```bash
GET /api/userlogs?ip=192.168.1.1
```

### Filter by Date Range
```bash
GET /api/userlogs?createdAfter=2024-12-14T00:00:00.000Z
```
Note: UserLog uses the `loginTime` field, but the API still accepts `createdBefore`/`createdAfter` parameters for consistency.

### Combined Filters
```bash
GET /api/userlogs?userType=student&email=john&createdAfter=2024-12-01T00:00:00.000Z&page=1&limit=50
```

---

## Common Patterns

### Pagination with Filters
All filter queries support pagination:
```bash
GET /api/students?enrollmentYear=2023&page=2&limit=20
```

### Sorting with Filters
Combine filters with sorting:
```bash
GET /api/students?enrollmentYear=2023&sortBy=firstName&sortOrder=asc
```

### Empty Results
When no records match the filter:
```json
{
  "success": true,
  "message": "Students retrieved successfully",
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 0,
    "totalPages": 0,
    "hasNextPage": false,
    "hasPrevPage": false
  },
  "timestamp": "2024-12-14T14:30:00.000Z"
}
```

---

## Tips

1. **URL Encoding**: Always URL encode special characters in query parameters
   ```bash
   # Instead of: ?email=john+doe@example.com
   # Use: ?email=john%2Bdoe%40example.com
   ```

2. **Date Formats**: Use ISO 8601 format for dates
   ```bash
   # Correct: 2024-12-14T14:30:00.000Z
   # Incorrect: 12/14/2024
   ```

3. **Case Sensitivity**: Most text filters are case-insensitive
   ```bash
   # These are equivalent:
   GET /api/students?firstName=john
   GET /api/students?firstName=John
   GET /api/students?firstName=JOHN
   ```

4. **Partial Matching**: Text filters support partial matching
   ```bash
   # Finds "John", "Johnny", "John Doe", etc.
   GET /api/students?firstName=john
   ```

5. **Boolean Values**: Use 'true' or 'false' strings
   ```bash
   GET /api/students?isActive=true
   # NOT: ?isActive=1 or ?isActive=yes
   ```

6. **Combining Filters**: Multiple filters are combined with AND logic
   ```bash
   # Returns students that match ALL conditions
   GET /api/students?enrollmentYear=2023&isActive=true&search=john
   ```

---

## Testing with cURL

### Basic Request
```bash
curl -X GET "http://localhost:3000/api/students?enrollmentYear=2023" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json"
```

### With Multiple Filters
```bash
curl -X GET "http://localhost:3000/api/students?enrollmentYear=2023&isActive=true&page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json"
```

### Pretty Print Response
```bash
curl -X GET "http://localhost:3000/api/students?search=john" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" | jq
```
