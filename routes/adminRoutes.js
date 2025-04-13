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


// GET a single user by ID
router.get('/users/:id', verifyAdmin, async (req, res) => {
    try {
      const user = await User.findByPk(req.params.id, {
        attributes: { exclude: ['password'] }
      });
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching user' });
    }
  });



  // DELETE a user by ID
router.delete('/users/:id', verifyAdmin, async (req, res) => {
    try {
      const user = await User.findByPk(req.params.id);
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      await user.destroy();
      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting user' });
    }
  });
  


  // UPDATE a user by ID
router.put('/users/:id', verifyAdmin, async (req, res) => {
  const { first_name, last_name, date_of_birth, role } = req.body;

  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.first_name = first_name || user.first_name;
    user.last_name = last_name || user.last_name;
    user.date_of_birth = date_of_birth || user.date_of_birth;
    user.role = role || user.role;

    await user.save();

    res.json({
      message: 'User updated successfully',
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user' });
  }
});
  

export default router;