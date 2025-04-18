import express from 'express';
import { authenticateUser } from '../middleware/authMiddleware.js';
import { getProfile } from '../controllers/userController.js';

const router = express.Router();

/**
 * @route GET /api/profile
 * @desc Get authenticated user's profile
 * @access Private - Requires JWT authentication
 */
router.get('/profile', authenticateUser, getProfile);

export default router;
