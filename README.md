# Student Registration System - Backend

This is the backend API for a student registration system that allows students to register and log in, and admins to manage student accounts. It's built with Express.js, Sequelize ORM, and PostgreSQL.

## Features

- User authentication with JWT
- Role-based access control (student and admin roles)
- Unique registration number generation
- CRUD operations for user management
- Secure password handling with bcrypt

## Technology Stack

- Node.js
- Express.js
- Sequelize ORM
- PostgreSQL (Neon)
- JWT for authentication
- bcrypt for password hashing

## Prerequisites

- Node.js (v14+)
- npm or yarn
- PostgreSQL database (or Neon account)

## Installation

1. Clone the repository
```bash
git clone <repository-url>
cd student-registration-backend
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
PORT=5000
DATABASE_URL=your_database_connection_string
JWT_SECRET=your_jwt_secret
```

4. Run the application in development mode
```bash
npm run dev
```

## Database Setup

The application uses Sequelize ORM with PostgreSQL. It will automatically create the tables when it starts up. Make sure your database connection string is correctly set in the `.env` file.

## API Endpoints

### Authentication

- **POST /api/register** - Register a new student
  - Required fields: `firstName`, `lastName`, `email`, `password`, `dateOfBirth`
  - Age must be between 10-20 years
  - Returns user data with a unique registration number

- **POST /api/login** - Authenticate a user (student or admin)
  - Required fields: `email`, `password`
  - Returns JWT token and user information

- **GET /api/profile** - Get authenticated user's profile
  - Protected route (requires JWT)
  - Returns user profile data

### Admin Routes (Protected)

- **GET /api/admin/users** - List all registered users
  - Admin access only
  - Returns list of all users (without passwords)

- **GET /api/admin/users/:id** - Get a specific user by ID
  - Admin access only
  - Returns user data (without password)

- **PUT /api/admin/users/:id** - Update a user's information
  - Admin access only
  - Can update: `firstName`, `lastName`, `dateOfBirth`, `role`

- **DELETE /api/admin/users/:id** - Delete a user
  - Admin access only
  - Removes user from the database

## Admin Account

To create an admin account, you can run a database seed script or manually insert an admin user with registration number format starting with `ADM-` and ending with `-2025`.

## Environment Variables

- `PORT` - The port the server will run on (default: 5000)
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT token generation and verification

## Security

- Passwords are hashed using bcrypt
- JWT is used for authentication
- API routes are protected with middleware based on role
- Environment variables used for sensitive information

## Development

Start the development server with hot reload:
```bash
npm run dev
```

## Testing

```bash
npm test
```

## License

This project is licensed under the ISC License.
