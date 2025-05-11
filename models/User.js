import prisma from "../prisma/client.js";

// User model functions using Prisma
const User = {
  // Find a user by ID
  findById: async (id) => {
    return await prisma.user.findUnique({
      where: { id },
    });
  },

  // Find a user by email
  findByEmail: async (email) => {
    return await prisma.user.findUnique({
      where: { email },
    });
  },

  // Find a user by registration number
  findByRegistrationNumber: async (registrationNumber) => {
    return await prisma.user.findUnique({
      where: { registrationNumber },
    });
  },

  // Create a new user
  create: async (userData) => {
    return await prisma.user.create({
      data: userData,
    });
  },

  // Create a new user for Google sign-in
  createGoogleUser: async (userData) => {
    const { email, firstName, lastName, picture } = userData;

    // Check if the user already exists
    const existingUser = await prisma.googleUser.findUnique({
      where: { email },
    });

    if (existingUser) {
      return existingUser; // Return the existing user if found
    }

    // Create a new Google user if not found
    return await prisma.googleUser.create({
      data: {
        email,
        firstName,
        lastName,
        profilePicture: picture,
      },
    });
  },

  // Update a user
  update: async (id, userData) => {
    return await prisma.user.update({
      where: { id },
      data: userData,
    });
  },

  // Delete a user
  delete: async (id) => {
    return await prisma.user.delete({
      where: { id },
    });
  },

  // Find all users with pagination, sorting, and filtering
  findAll: async ({
    page = 1,
    limit = 10,
    search = "",
    role = "",
    sortBy = "createdAt",
    sortOrder = "desc",
  }) => {
    const skip = (page - 1) * limit;
    const take = parseInt(limit);

    // Build the where condition for filtering
    const where = {};

    // Add search filter
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { registrationNumber: { contains: search, mode: "insensitive" } },
      ];
    }

    // Add role filter
    if (role) {
      where.role = role;
    }

    // Build the orderBy object for sorting
    let orderBy = {};
    if (sortBy === "name") {
      orderBy = [{ firstName: sortOrder }, { lastName: sortOrder }];
    } else {
      orderBy = { [sortBy]: sortOrder };
    }

    // Execute the query
    const [users, count] = await Promise.all([
      prisma.user.findMany({
        where,
        orderBy,
        skip,
        take,
      }),
      prisma.user.count({ where }),
    ]);

    return {
      data: users,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: take,
        totalPages: Math.ceil(count / take),
      },
    };
  },

  // Count users by role
  countByRole: async (role) => {
    return await prisma.user.count({
      where: { role },
    });
  },
};

export default User;
