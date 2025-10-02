import express from "express";
import { protectRoute } from "../middleware/auth.middleware";
import { getRecommendedUsers, getMyFriends } from "../controllers/user.controller.js";

const router = express.Router();

// show recommended users from the database
router.get("/", protectRoute,getRecommendedUsers);

// show friend users
router.get("/friends", protectRoute, getMyFriends);

export default router;