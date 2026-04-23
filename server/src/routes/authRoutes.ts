import express from 'express';
import {
  register,
  login,
  logout,
  getMe,
  verifyEmail,
  forgotPassword,
  resetPassword
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { body } from 'express-validator';

const router = express.Router();

const registerValidation = [
  body('name').notEmpty().withMessage('Имя обязательно'),
  body('email').isEmail().withMessage('Неверный email'),
  body('password').isLength({ min: 6 }).withMessage('Пароль минимум 6 символов')
];

const loginValidation = [
  body('email').isEmail().withMessage('Неверный email'),
  body('password').notEmpty().withMessage('Пароль обязателен')
];

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.post('/logout', logout);
router.get('/me', protect, getMe);
router.get('/verify-email', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;