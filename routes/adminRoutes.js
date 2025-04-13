import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// GET /api/admin/users - Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] } // hide passwords
    });
    res.json(users);
  } catch (error) {
    console.error("❌ Error fetching users:", error);
    res.status(500).json({ message: 'Server error while fetching users.' });
  }
});

export default router;