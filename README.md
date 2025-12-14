# LMS Backend

A Learning Management System (LMS) backend built with Node.js, TypeScript, Express, MongoDB (Typegoose), and Zod for validation.

## Architecture

This project follows a layered architecture pattern:

1. **Router Layer** - Route definitions and endpoint mappings
2. **Controller Layer** - HTTP request/response handling
3. **Service Layer** - Business logic
4. **Repository Layer** - Data access and database operations

## Key Features

- **Type Safety**: Single source of truth for types using Typegoose
- **Validation**: Zod schemas derived from Typegoose models
- **CRUD Operations**: Complete CRUD for Admin, Role, Permission, and Student entities
- **Role-Based Access**: Admin users with roles and permissions
- **Clean Architecture**: Separation of concerns across layers

## Technology Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: MongoDB
- **ODM**: Typegoose (TypeScript wrapper for Mongoose)
- **Validation**: Zod
- **Dev Tools**: Nodemon, ts-node

## Project Structure

```
src/
├── config/          # Configuration files (database)
├── models/          # Typegoose models and Zod schemas
├── repositories/    # Data access layer
├── services/        # Business logic layer
├── controllers/     # Request handlers
├── routes/          # Route definitions
├── middleware/      # Custom middleware (validation)
├── utils/           # Utility functions (schema helpers)
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

3. Update `.env` with your MongoDB connection string:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/lms
```

4. Start development server:
```bash
npm run dev
```

5. Build for production:
```bash
npm run build
```

6. Run production build:
```bash
npm start
```

## API Endpoints

### Health Check
- `GET /health` - Check if server is running

### Permissions
- `POST /api/v1/permissions` - Create a new permission
- `GET /api/v1/permissions` - Get all permissions
- `GET /api/v1/permissions/:id` - Get permission by ID
- `PUT /api/v1/permissions/:id` - Update permission
- `DELETE /api/v1/permissions/:id` - Delete permission

### Roles
- `POST /api/v1/roles` - Create a new role
- `GET /api/v1/roles` - Get all roles
- `GET /api/v1/roles/:id` - Get role by ID
- `PUT /api/v1/roles/:id` - Update role
- `DELETE /api/v1/roles/:id` - Delete role

### Admins
- `POST /api/v1/admins` - Create a new admin
- `GET /api/v1/admins` - Get all admins
- `GET /api/v1/admins/:id` - Get admin by ID
- `PUT /api/v1/admins/:id` - Update admin
- `DELETE /api/v1/admins/:id` - Delete admin

### Students
- `POST /api/v1/students` - Create a new student
- `GET /api/v1/students` - Get all students
- `GET /api/v1/students/:id` - Get student by ID
- `GET /api/v1/students/year/:year` - Get students by enrollment year
- `PUT /api/v1/students/:id` - Update student
- `DELETE /api/v1/students/:id` - Delete student

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
- **Nodemon** for automatic server restart
- **ts-node** for running TypeScript directly

## Future Enhancements

- Add authentication (JWT)
- Add password hashing (bcrypt)
- Add logging (Winston/Morgan)
- Add API documentation (Swagger)
- Add testing (Jest)
- Add rate limiting
- Add CORS configuration
- Add environment-specific configurations