import User from "../models/User.js";
import prisma from "../prisma/client.js";

// Get a single user by ID
export const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Find the user by ID using the User model with Prisma
    const user = await User.findById(userId);
    
    // Check if user exists
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    
    // Return the user data
    return res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error("❌ Error fetching user by ID:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    // The user is already attached to the request by the authenticateUser middleware
    const userId = req.user.id;

    // Get the full user profile from the database using Prisma
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User profile not found.",
      });
    }

    // Construct the response without the password
    const userWithoutPassword = {
      ...user,
      password: undefined // Remove password from the response
    };

    // Return the user profile
    return res.status(200).json({
      success: true,
      data: userWithoutPassword
    });
  } catch (error) {
    console.error("❌ Error fetching user profile:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
