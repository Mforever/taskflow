import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';
import { validationResult } from 'express-validator';
import { AuthRequest } from '../middleware/auth.js';
import { sendVerificationEmail, sendPasswordResetEmail } from '../services/emailService.js';

const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, process.env.JWT_SECRET!, {
    expiresIn: '7d'
  });
};

// Регистрация с отправкой письма подтверждения
export const register = async (req: Request, res: Response): Promise<Response> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Пользователь с таким email уже существует' });
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');

    const user = await User.create({
      name,
      email,
      password,
      emailVerificationToken: verificationToken,
      isEmailVerified: false
    });

    // Отправляем письмо подтверждения
    await sendVerificationEmail(email, verificationToken);

    return res.status(201).json({
      message: 'Регистрация успешна. Пожалуйста, подтвердите email адрес.',
      userId: user._id
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// Подтверждение email
export const verifyEmail = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { token } = req.query;

    const user = await User.findOne({ emailVerificationToken: token });
    if (!user) {
      return res.status(400).json({ message: 'Неверный или истёкший токен подтверждения' });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = null;
    await user.save();

    return res.json({ message: 'Email успешно подтверждён. Теперь вы можете войти.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Ошибка подтверждения email' });
  }
};

// Вход (только для подтверждённых пользователей)
export const login = async (req: Request, res: Response): Promise<Response> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Неверный email или пароль' });
    }

    if (!user.isEmailVerified) {
      return res.status(401).json({ message: 'Подтвердите email адрес перед входом' });
    }

    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Неверный email или пароль' });
    }

    const token = generateToken(user._id.toString());

    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/'
    });

    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      preferences: user.preferences
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// Запрос на восстановление пароля
export const forgotPassword = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      // Не раскрываем существование пользователя
      return res.json({ message: 'Если аккаунт существует, инструкции отправлены на email' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 час
    await user.save();

    await sendPasswordResetEmail(email, resetToken);

    return res.json({ message: 'Инструкции по восстановлению отправлены на email' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// Сброс пароля
export const resetPassword = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { token, newPassword } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Неверный или истёкший токен сброса пароля' });
    }

    user.password = newPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    return res.json({ message: 'Пароль успешно изменён. Теперь вы можете войти.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Ошибка сброса пароля' });
  }
};

// Остальные методы (logout, getMe) остаются без изменений
export const logout = async (req: Request, res: Response): Promise<Response> => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
    path: '/'
  });
  return res.json({ message: 'Выход выполнен' });
};

export const getMe = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }
    return res.json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Ошибка сервера' });
  }
};