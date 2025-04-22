import express from "express";

import { authenticateUser } from "../middleware/authMiddleware.js";
import { getProfile } from "../controllers/userController.js";

const router = express.Router();
router.get("/profile", authenticateUser, getProfile);

export default router;
