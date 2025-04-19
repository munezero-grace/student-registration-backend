import express from 'express';
/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication endpoints
 */
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Login for students/admin
 *     description: Authenticates a user and returns a JWT token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserLogin'
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT authentication token
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *                     firstName:
 *                       type: string
 *                     lastName:
 *                       type: string
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// POST /api/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    // Sign JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Return token and user info (excluding password)
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName
      }
    });

  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
});




/**
 * @swagger
 * /api/register:
 *   post:
 *     summary: Register a new student
 *     description: Creates a new student account with a unique registration number
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserRegistration'
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User registered successfully
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                     email:
 *                       type: string
 *                     registrationNumber:
 *                       type: string
 *                     role:
 *                       type: string
 *                       example: student
 *       400:
 *         description: Bad request - validation errors
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Register new user
router.post('/register', async (req, res) => {
    const { firstName, lastName, email, password, dateOfBirth } = req.body;
  
    try {
      // Validate email presence
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      // Check for existing user with the same email
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: "Email already registered. Please use a different email address." });
      }
  
      // Age validation (10–20 years)
      const dob = new Date(dateOfBirth);
      const age = new Date().getFullYear() - dob.getFullYear();
      if (age < 10 || age > 20) {
        return res.status(400).json({ message: "User must be between 10 and 20 years old" });
      }
  
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Generate unique registration number (REG-XXXX-2025)
      const randomCode = Math.floor(1000 + Math.random() * 9000);
      const registrationNumber = `REG-${randomCode}-2025`;
  
      // Create user
      const user = await User.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        registrationNumber,
        dateOfBirth,
        role: 'student'
      });
  
      // Return success
      res.status(201).json({
        message: "User registered successfully",
        user: {
          id: user.id,
          email: user.email,
          registrationNumber: user.registrationNumber,
          role: user.role
        }
      });
  
    } catch (err) {
      console.error("❌ Error registering user:", err);
      res.status(500).json({ message: "Server error during registration" });
    }
  });

export default router;