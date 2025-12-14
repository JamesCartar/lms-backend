# Filter Implementation Guide

## Overview
This document describes the comprehensive filtering system implemented for all GET all APIs in the LMS backend. The system provides flexible, validated filtering capabilities while maintaining backward compatibility.

## Features

### Common Filters (Available on All GET All APIs)
- **search**: Search across multiple relevant text fields (case-insensitive)
- **createdBefore**: Filter records created before a date (includes all of that day)
- **createdAfter**: Filter records created after a date

### Service-Specific Filters

#### Student API (`/api/students`)
- `firstName`: Filter by first name (partial match, case-insensitive)
- `lastName`: Filter by last name (partial match, case-insensitive)
- `email`: Filter by email (partial match, case-insensitive)
- `enrollmentYear`: Filter by enrollment year (exact match)
- `isActive`: Filter by active status (true/false)

#### Admin API (`/api/admins`)
- `name`: Filter by name (partial match, case-insensitive)
- `email`: Filter by email (partial match, case-insensitive)
- `role`: Filter by role ID (exact match)
- `isActive`: Filter by active status (true/false)

#### Role API (`/api/roles`)
- `name`: Filter by name (partial match, case-insensitive)
- `description`: Filter by description (partial match, case-insensitive)

#### Permission API (`/api/permissions`)
- `name`: Filter by name (partial match, case-insensitive)
- `resource`: Filter by resource (partial match, case-insensitive)
- `action`: Filter by action (partial match, case-insensitive)
- `description`: Filter by description (partial match, case-insensitive)

#### AuditLog API (`/api/auditlogs`)
- `userId`: Filter by user ID (exact match)
- `userType`: Filter by user type (admin/student)
- `email`: Filter by email (partial match, case-insensitive)
- `action`: Filter by action (CREATE/UPDATE/DELETE)
- `resource`: Filter by resource name (partial match, case-insensitive)
- `resourceId`: Filter by resource ID (exact match)

#### UserLog API (`/api/userlogs`)
- `userId`: Filter by user ID (exact match)
- `userType`: Filter by user type (admin/student)
- `email`: Filter by email (partial match, case-insensitive)
- `ip`: Filter by IP address (partial match, case-insensitive)

## Usage Examples

### Basic Search
```bash
# Search students by name or email
GET /api/students?search=john

# Search permissions by any text field
GET /api/permissions?search=create
```

### Date Range Filtering
```bash
# Get students created before a specific date (includes all of that day)
GET /api/students?createdBefore=2024-01-15T00:00:00.000Z

# Get audit logs after a specific date
GET /api/auditlogs?createdAfter=2024-01-01T00:00:00.000Z

# Combine date range
GET /api/auditlogs?createdAfter=2024-01-01T00:00:00.000Z&createdBefore=2024-12-31T23:59:59.999Z
```

### Field-Specific Filtering
```bash
# Filter by enrollment year
GET /api/students?enrollmentYear=2023

# Filter by active status
GET /api/students?isActive=true

# Filter by role
GET /api/admins?role=507f1f77bcf86cd799439011

# Filter audit logs by action
GET /api/auditlogs?action=CREATE
```

### Combined Filters
```bash
# Combine multiple filters
GET /api/students?enrollmentYear=2023&isActive=true&search=john

# Filter with pagination
GET /api/students?page=1&limit=10&enrollmentYear=2023&sortBy=createdAt&sortOrder=desc
```

## Implementation Architecture

### 1. Filter Utilities (`src/utils/filter.util.ts`)
Provides common filter building functions:
- `buildSearchFilter()`: Creates MongoDB regex search across multiple fields
- `buildDateRangeFilter()`: Handles date range filters with proper day inclusion
- `mergeFilters()`: Combines multiple filter objects into valid MongoDB query

### 2. Filter Builders (`src/filters/*.filter.ts`)
Each service has its own filter builder with:
- **Schema**: Zod validation schema for query parameters
- **Builder Function**: Converts validated params to MongoDB filter object

### 3. Validation Middleware (`src/middleware/validation.middleware.ts`)
- `validateQuery()`: Validates query parameters using Zod schemas
- Stores validated query in `req.validatedQuery` for controller access
- Provides user-friendly error messages

### 4. Repository Layer
Updated `findAll()` and `count()` methods to accept filter parameter:
```typescript
async findAll(
  skip: number,
  limit: number,
  sortBy?: string,
  sortOrder?: 'asc' | 'desc',
  filter: Record<string, any> = {}
): Promise<DocumentType<T>[]>
```

### 5. Service Layer
Updated `getAllX()` methods to pass filters to repository:
```typescript
async getAllStudents(
  page: number = 1,
  limit: number = 10,
  sortBy?: string,
  sortOrder?: 'asc' | 'desc',
  filter: Record<string, any> = {}
)
```

### 6. Controller Layer
Controllers now:
1. Get validated query from middleware
2. Build filter object using filter builder
3. Pass filter to service

### 7. Route Layer
Routes now include filter validation:
```typescript
router.get('/', 
  checkPermission('student.read'), 
  validateQuery(StudentFilterQuerySchema), 
  controller.getAll
);
```

## Error Handling

### Validation Errors
When invalid query parameters are provided, the API returns user-friendly error messages:

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

### Common Error Messages
- Invalid email: "Please enter a valid email address"
- Invalid date: "must be a valid date and time (ISO 8601 format)"
- Invalid enum: "must be one of: [options]"
- Invalid ID: "must be a valid ID"
- Invalid type: "must be a text value/number/true or false"

## Backward Compatibility

All filters are optional. Existing API calls without filters continue to work:
```bash
# Still works - returns all students with pagination
GET /api/students?page=1&limit=10
```

## Performance Considerations

1. **Indexes**: Ensure MongoDB indexes are created for frequently filtered fields
2. **Search Performance**: The search filter uses regex, which may be slower on large datasets
3. **Date Filters**: Date range filters use indexed date fields for optimal performance

## Testing

### Manual Testing
```bash
# Test search
curl -X GET "http://localhost:3000/api/students?search=john" -H "Authorization: Bearer <token>"

# Test date range
curl -X GET "http://localhost:3000/api/students?createdBefore=2024-12-31T23:59:59.999Z" -H "Authorization: Bearer <token>"

# Test field filters
curl -X GET "http://localhost:3000/api/students?enrollmentYear=2023&isActive=true" -H "Authorization: Bearer <token>"

# Test validation errors
curl -X GET "http://localhost:3000/api/students?enrollmentYear=invalid" -H "Authorization: Bearer <token>"
```

## Best Practices

1. **Use Specific Filters When Possible**: Field-specific filters are more efficient than search
2. **Combine with Pagination**: Always use pagination when filtering large datasets
3. **ISO 8601 Format for Dates**: Use proper date format: `2024-12-14T14:30:00.000Z`
4. **URL Encoding**: Encode special characters in query parameters

## Future Enhancements

Possible future improvements:
1. Advanced search operators (gt, lt, gte, lte, in, nin)
2. Full-text search using MongoDB Atlas Search
3. Filter presets/saved filters
4. Filter query caching
5. GraphQL-style field selection
