import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// POST /api/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    // Sign JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Return token and user info (excluding password)
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
});

// Register new user
router.post("/register", async (req, res) => {
  const { firstName, lastName, email, password, dateOfBirth } = req.body;

  try {
    // Validate email presence
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Check for existing user with the same email
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        message:
          "Email already registered. Please use a different email address.",
      });
    }

    // Age validation (10–20 years)
    const dob = new Date(dateOfBirth);
    const age = new Date().getFullYear() - dob.getFullYear();
    if (age < 10 || age > 20) {
      return res
        .status(400)
        .json({ message: "User must be between 10 and 20 years old" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate unique registration number (REG-XXXX-2025)
    const uniqueCode = Math.floor(1000 + Math.random() * 9000); // 4 digits
    const registrationNumber = `REG-${uniqueCode}-2025`;

    // Create user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      registrationNumber,
      dateOfBirth,
      role: "student",
    });

    // Return success
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user.id,
        email: user.email,
        registrationNumber: user.registrationNumber,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("❌ Error registering user:", err);
    res.status(500).json({ message: "Server error during registration" });
  }
});

export default router;
