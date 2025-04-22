import User from "../models/User.js";
export const getProfile = async (req, res) => {
  try {
    // The user is already attached to the request by the authenticateUser middleware
    const user = req.user;

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User profile not found.",
      });
    }

    // Return the user profile (without password)
    return res.status(200).json({
      success: true,
      data: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        registrationNumber: user.registrationNumber,
        dateOfBirth: user.dateOfBirth,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.error("❌ Error fetching user profile:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
