import express from 'express';
import authController from '../controllers/authController';

const authRoutes = express.Router();

// authRoutes.post('/register', authController.register);
// authRoutes.route("/register").post(authController.register);
authRoutes.post('/login', authController.login);

export default authRoutes;