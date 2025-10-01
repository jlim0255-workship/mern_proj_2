import express from "express"
import { signup, login, logout, onboard } from "../controllers/auth.controller.js"
import {protectRoute} from "../middleware/auth.middleware.js"

const router = express.Router()

router.post("/signup", signup)

router.post("/login", login)

router.post("/logout", logout)

// when endpoint is /api/auth/onboarding
// first run protectRoute middleware to verify the token
// then run the onboard controller
router.post("/onboarding", protectRoute, onboard)

// check if the user is logged in
router.get("/me", protectRoute, (req, res) => {
    res.status(200).json({success: true, user: req.user})
})

export default router