import express from 'express';
import User from '../models/User.js';
import { verifyAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/admin/users - Get all users (protected through middleware)
router.get('/users',verifyAdmin, async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] }, // Exclude password from the response
    });
    res.json(users);
  } catch (error) {
    console.error("❌ Error fetching users:", error);
    res.status(500).json({ message: 'Server error while fetching users.' });
  }
});

export default router;