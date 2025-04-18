import express from 'express';
/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin-only endpoints for user management
 */
import User from '../models/User.js';
import { verifyAdmin } from '../middleware/authMiddleware.js';
import { Op } from 'sequelize';

const router = express.Router();

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Get all users (admin only)
 *     description: Retrieves a paginated list of all users with optional filtering and sorting
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for filtering users
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [admin, student]
 *         description: Filter by user role
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [createdAt, firstName, lastName, email, registrationNumber, name]
 *           default: createdAt
 *         description: Field to sort by
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order (ascending or descending)
 *     responses:
 *       200:
 *         description: Successfully retrieved users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - Not an admin
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
// GET /api/admin/users - Get all users with pagination, sorting, and filtering
router.get('/users', verifyAdmin, async (req, res) => {
  try {
    // Extract query parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const role = req.query.role || '';
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 'ASC' : 'DESC';

    // Calculate offset for pagination
    const offset = (page - 1) * limit;

    // Build filter conditions
    const whereConditions = {};
    
    // Add search filter
    if (search) {
      whereConditions[Op.or] = [
        { firstName: { [Op.iLike]: `%${search}%` } },
        { lastName: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
        { registrationNumber: { [Op.iLike]: `%${search}%` } }
      ];
    }
    
    // Add role filter
    if (role) {
      whereConditions.role = role;
    }

    // Build sort conditions - handle special case for name (which doesn't exist as a column)
    const order = [];
    if (sortBy === 'name') {
      order.push(['firstName', sortOrder], ['lastName', sortOrder]);
    } else {
      order.push([sortBy, sortOrder]);
    }

    // Execute the query with pagination and filters
    const { count, rows } = await User.findAndCountAll({
      where: whereConditions,
      order: order,
      limit: limit,
      offset: offset,
      attributes: { exclude: ['password'] } // Exclude password from the response
    });

    // Return paginated results with metadata
    res.json({
      data: rows,
      pagination: {
        total: count,
        page: page,
        limit: limit,
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error("❌ Error fetching users:", error);
    res.status(500).json({ message: 'Server error while fetching users.' });
  }
});

/**
 * @swagger
 * /api/admin/users/{id}:
 *   get:
 *     summary: Get a user by ID (admin only)
 *     description: Retrieves a specific user by their ID
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: User ID
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - Not an admin
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
// GET a single user by ID
router.get('/users/:id', verifyAdmin, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] }
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error("❌ Error fetching user:", error);
    res.status(500).json({ message: 'Error fetching user' });
  }
});

/**
 * @swagger
 * /api/admin/users/{id}:
 *   delete:
 *     summary: Delete a user by ID (admin only)
 *     description: Deletes a specific user by their ID
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User deleted successfully
 *       400:
 *         description: Bad request - missing parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - Cannot delete the last admin
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
// DELETE a user by ID
router.delete('/users/:id', verifyAdmin, async (req, res) => {
  try {
    // Validate user ID parameter
    const userId = req.params.id;
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // Check if user exists before deletion - use findByPk which is more efficient
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found. Deletion failed.' });
    }

    // Prevent deleting the last admin user
    if (user.role === 'admin') {
      const adminCount = await User.count({ where: { role: 'admin' } });
      if (adminCount <= 1) {
        return res.status(403).json({ 
          message: 'Cannot delete the last admin user. Create another admin first.' 
        });
      }
    }
    
    // Proceed with deletion
    await user.destroy();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting user:', error);
    res.status(500).json({ message: 'Server error while deleting user' });
  }
});

/**
 * @swagger
 * /api/admin/users/{id}:
 *   put:
 *     summary: Update a user by ID (admin only)
 *     description: Updates a specific user's information
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserUpdate'
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User updated successfully
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request - validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - Cannot downgrade the last admin
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
// UPDATE a user by ID
router.put('/users/:id', verifyAdmin, async (req, res) => {
  try {
    const { firstName, lastName, email, dateOfBirth, role } = req.body;
    
    // Find the user - use findByPk for better performance
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent changing the role of the last admin
    if (user.role === 'admin' && role === 'student') {
      const adminCount = await User.count({ where: { role: 'admin' } });
      if (adminCount <= 1) {
        return res.status(403).json({ 
          message: 'Cannot downgrade the last admin. Create another admin first.' 
        });
      }
    }

    // Update fields
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email) {
      // Check if email is already in use by another user
      const existingUser = await User.findOne({ 
        where: { 
          email, 
          id: { [Op.ne]: req.params.id } 
        } 
      });
      
      if (existingUser) {
        return res.status(400).json({ message: 'Email is already in use' });
      }
      
      user.email = email;
    }
    if (dateOfBirth) user.dateOfBirth = dateOfBirth;
    if (role) user.role = role;

    // Save changes
    await user.save();

    // Return updated user (without password)
    const updatedUser = user.toJSON();
    delete updatedUser.password;

    res.json({
      message: 'User updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('❌ Error updating user:', error);
    res.status(500).json({ message: 'Error updating user' });
  }
});

export default router;