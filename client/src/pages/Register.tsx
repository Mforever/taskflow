import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { api } from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const registerSchema = z.object({
  name: z.string().min(2, 'Имя должно быть минимум 2 символа'),
  email: z.string().email('Введите корректный email'),
  password: z.string().min(6, 'Пароль должен быть минимум 6 символов'),
  confirmPassword: z.string().min(6, 'Подтвердите пароль'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Пароли не совпадают',
  path: ['confirmPassword'],
});

type RegisterForm = z.infer<typeof registerSchema>;

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    try {
      await api.post('/auth/register', {
        name: data.name,
        email: data.email,
        password: data.password,
      });
      setRegisteredEmail(data.email);
      toast.success('Регистрация успешна! Проверьте email для подтверждения');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Ошибка регистрации');
    } finally {
      setIsLoading(false);
    }
  };

  if (registeredEmail) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <div className="card p-8 max-w-md w-full text-center">
          <svg className="w-16 h-16 text-blue-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Проверьте почту</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            На адрес <strong>{registeredEmail}</strong> отправлено письмо с подтверждением.
          </p>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
            Перейдите по ссылке в письме, чтобы завершить регистрацию.
          </p>
          <Link to="/login" className="btn-primary inline-block">
            Перейти к входу
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold gradient-text">TaskFlow</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Создайте новый аккаунт</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Имя
              </label>
              <input
                type="text"
                {...register('name')}
                className="input-field"
                placeholder="Иван Иванов"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Email
              </label>
              <input
                type="email"
                {...register('email')}
                className="input-field"
                placeholder="ivan@example.com"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Пароль
              </label>
              <input
                type="password"
                {...register('password')}
                className="input-field"
                placeholder="••••••"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Подтвердите пароль
              </label>
              <input
                type="password"
                {...register('confirmPassword')}
                className="input-field"
                placeholder="••••••"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full"
            >
              {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Уже есть аккаунт?{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium">
                Войти
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;