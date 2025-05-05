# Setting Up Prisma for Student Registration System

This guide will help you set up and use Prisma ORM with your local PostgreSQL database.

## Prerequisites

- PostgreSQL installed locally
- Node.js and npm installed
- pgAdmin 4 (optional, for database management)

## Setup Steps

### 1. Install Prisma Dependencies

```bash
# Install Prisma CLI and client
npm install prisma @prisma/client
```

### 2. Create and Configure Your Local PostgreSQL Database

1. Open pgAdmin 4
2. Right-click on "Databases" in the left sidebar
3. Select "Create" > "Database..."
4. Enter "student_registration_db" for the database name
5. Click "Save"

### 3. Update Environment Variables

Make sure your `.env` file has the correct PostgreSQL connection string:

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/student_registration_db?schema=public"
```

Replace `postgres:postgres` with your PostgreSQL username and password if different.

### 4. Run Prisma Migrations

```bash
# Generate the Prisma client
npm run prisma:generate

# Run migrations to create the database tables
npm run prisma:migrate
```

### 5. Seed the Database

```bash
# Seed an admin user
npm run prisma:seed
```

### 6. Explore Your Database (Optional)

Prisma Studio provides a UI to view and edit your database:

```bash
npm run prisma:studio
```

## Using Prisma in Your Application

The User model has been updated to use Prisma. Here's how to use it:

```javascript
// Example: Finding a user by email
import User from './models/User.js';

const user = await User.findByEmail('user@example.com');
```

## Useful Commands

- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run migrations
- `npm run prisma:studio` - Open Prisma Studio
- `npm run prisma:seed` - Seed the database
- `npm run prisma:reset` - Reset the database (deletes all data)

## Login Credentials for Admin

After seeding the database, you can log in as admin with:

- Email: admin@example.com
- Password: Admin@123
