import { Router } from "express";
import { login, register, logout, profile, verifyToken } from "../controllers/auth.controller.js";
import { authRequired } from "../middlewares/validateToken.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { registerSchema, loginSchema } from "../schemas/auth.schema.js";

const router = Router();

// Register
router.post('/register', validateSchema(registerSchema), register);

// Login    
router.post('/login', validateSchema(loginSchema), login);

//Logout
router.post('/logout', logout);

// Verify token
router.get('/verify-token', verifyToken);

//Profile
router.get('/profile', authRequired, profile);

export default router;