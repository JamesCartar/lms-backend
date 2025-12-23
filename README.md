# LMS Backend

A Learning Management System (LMS) backend built with Node.js, TypeScript, Express, MongoDB (Typegoose), and Zod for validation.

## Architecture

This project follows a layered architecture pattern:

1. **Router Layer** - Route definitions and endpoint mappings with authentication
2. **Controller Layer** - HTTP request/response handling
3. **Service Layer** - Business logic with error handling
4. **Repository Layer** - Data access and database operations

## Key Features

- **Type Safety**: Single source of truth for types using Typegoose
- **Validation**: Zod schemas derived from Typegoose models
- **CRUD Operations**: Complete CRUD for Admin, Role, Permission, and Student entities
- **Authentication**: JWT-based authentication for admin and student users
- **Authorization**: Role-based access control with fine-grained permissions
- **Error Handling**: Global error handler with consistent response format
- **Security**: Password hashing with bcrypt, JWT token validation
- **Database Seeding**: Automated seeding for initial data setup
- **Clean Architecture**: Separation of concerns across layers

## Technology Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: MongoDB
- **ODM**: Typegoose (TypeScript wrapper for Mongoose)
- **Validation**: Zod
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcrypt
- **Dev Tools**: Nodemon, ts-node

## Project Structure

```
src/
├── config/          # Configuration files (database)
├── models/          # Typegoose models and Zod schemas
├── repositories/    # Data access layer
├── services/        # Business logic layer with custom error handling
├── controllers/     # Request handlers with async error handling
├── routes/          # Route definitions with auth and permission middleware
├── middleware/      # Custom middleware (auth, permissions, validation, error handling)
├── utils/           # Utility functions (errors, response formatting, schema helpers)
├── types/           # TypeScript type definitions (JWT payload)
├── seeds/           # Database seeding scripts
└── index.ts         # Application entry point
```

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file:
```bash
cp .env.example .env
```

3. Update `.env` with your configuration:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/lms
JWT_SECRET=your-secret-key-change-this-in-production
```

**Important:** Use a strong, unique `JWT_SECRET` in production!

4. Seed the database with initial data:
```bash
npm run seed
```

This creates:
- 16 permissions (CRUD for admin, role, student, permission)
- 4 roles (Super Admin, Admin, Manager, Viewer)
- Default admin user: `admin@example.com` / `admin123`
- 5 sample students

5. Start development server:
```bash
npm run dev
```

6. Build for production:
```bash
npm run build
```

7. Run production build:
```bash
npm start
```

## API Endpoints

### Health Check
- `GET /health` - Check if server is running (no auth required)

### Authentication
- `POST /api/v1/auth/login/admin` - Admin login (returns JWT token)
- `POST /api/v1/auth/login/student` - Student login (returns JWT token)
- `GET /api/v1/auth/me` - Get current user info (requires auth)

### Permissions (requires authentication + admin type + permission.* permissions)
- `POST /api/v1/permissions` - Create a new permission (requires permission.create)
- `GET /api/v1/permissions` - Get all permissions (requires permission.read)
- `GET /api/v1/permissions/:id` - Get permission by ID (requires permission.read)
- `PUT /api/v1/permissions/:id` - Update permission (requires permission.update)
- `DELETE /api/v1/permissions/:id` - Delete permission (requires permission.delete)

### Roles (requires authentication + admin type + role.* permissions)
- `POST /api/v1/roles` - Create a new role (requires role.create)
- `GET /api/v1/roles` - Get all roles (requires role.read)
- `GET /api/v1/roles/:id` - Get role by ID (requires role.read)
- `PUT /api/v1/roles/:id` - Update role (requires role.update)
- `DELETE /api/v1/roles/:id` - Delete role (requires role.delete)

### Admins (requires authentication + admin type + admin.* permissions)
- `POST /api/v1/admins` - Create a new admin (requires admin.create)
- `GET /api/v1/admins` - Get all admins (requires admin.read)
- `GET /api/v1/admins/:id` - Get admin by ID (requires admin.read)
- `PUT /api/v1/admins/:id` - Update admin (requires admin.update)
- `DELETE /api/v1/admins/:id` - Delete admin (requires admin.delete)
- `PUT /api/v1/admins/change-password` - Change current admin's password (requires authentication)

### Students (requires authentication + admin type + student.* permissions)
- `POST /api/v1/students` - Create a new student (requires student.create)
- `GET /api/v1/students` - Get all students (requires student.read)
- `GET /api/v1/students/:id` - Get student by ID (requires student.read)
- `GET /api/v1/students/year/:year` - Get students by enrollment year (requires student.read)
- `PUT /api/v1/students/:id` - Update student (requires student.update)
- `DELETE /api/v1/students/:id` - Delete student (requires student.delete)

## Authentication & Authorization

All protected endpoints require:
1. Valid JWT token in Authorization header: `Bearer <token>`
2. User must be admin type (for admin, role, permission, student endpoints)
3. User must have appropriate permissions

**Example Usage:**
```bash
# 1. Login
curl -X POST http://localhost:3000/api/v1/auth/login/admin \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'

# 2. Use the returned token
curl -X GET http://localhost:3000/api/v1/students \
  -H "Authorization: Bearer <your-token-here>"
```

See [AUTHENTICATION_GUIDE.md](./AUTHENTICATION_GUIDE.md) for detailed documentation.

## Type Definition Strategy

This project demonstrates a unique approach to type management:

1. **Define types once** with Typegoose decorators in model files
2. **Derive Zod schemas** using utility functions that mirror the Typegoose schema
3. **Infer TypeScript types** from Zod schemas for input validation
4. **Reuse types** across all layers without duplication

### Example

```typescript
// In model file (models/student.model.ts)
export class Student {
  @prop({ required: true, trim: true })
  public firstName!: string;

  @prop({ required: true, unique: true, lowercase: true })
  public email!: string;
}

// Zod schema derived from the model
export const StudentCreateSchema = z.object({
  firstName: createStringSchema(true, 2, 50),
  email: createEmailSchema(true),
});

// Type inferred from Zod schema
export type StudentCreateInput = z.infer<typeof StudentCreateSchema>;
```

This approach ensures:
- Single source of truth for data structure
- Type safety at compile time
- Runtime validation with Zod
- No type duplication

## Development

The project uses:
- **TypeScript** for type safety
- **Nodemon** for automatic server restart during development
- **ts-node** for running TypeScript directly without compilation
- **Zod** for runtime validation
- **JWT** for stateless authentication

## Documentation

- [AUTHENTICATION_GUIDE.md](./AUTHENTICATION_GUIDE.md) - Complete guide to authentication, permissions, and error handling
- [SECURITY.md](./SECURITY.md) - Security analysis and recommendations
- [API_EXAMPLES.md](./API_EXAMPLES.md) - API usage examples

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Run production build
- `npm run seed` - Seed database with initial data

## Implemented Features

✅ Custom error classes for consistent error handling  
✅ Global error handler middleware  
✅ Consistent API response format  
✅ JWT-based authentication  
✅ Permission-based authorization  
✅ Password hashing with bcrypt  
✅ Database seeding scripts  
✅ Request validation with Zod  
✅ Type-safe models with Typegoose  
✅ Async error handling  
✅ Environment variable configuration  

## Future Enhancements

Consider implementing:

- ⚠️ **Rate limiting** (high priority for production)
- Refresh token mechanism
- Email verification
- Two-factor authentication (2FA)
- Logging system (Winston/Morgan)
- API documentation (Swagger/OpenAPI)
- Testing framework (Jest)
- CORS configuration
- Helmet.js for security headers
- Account lockout after failed attempts
- Audit logging
- Environment-specific configurations