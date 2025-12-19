import express from 'express';
import { registerUser , loginUser } from '../controllers/userControllers.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = express.Router();

//register route
router.post("/register", registerUser);

//login route
router.post("/login",loginUser);

//protected route example
router.get("/profile", protect,(req, res)=>{
    res.json({
        message:"proflie fetched successfully",
        user: req.user,
    });
});

//provider-only role
router.post(
    "/add-service",
    protect,authorizeRoles("provider"),
    (req, res)=>{
    res.json({
        message:"Service added Succesfully",
        provider:req.user.name,
        });
    }
);

export default router;