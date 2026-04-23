import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { api } from '../services/api';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

const resetSchema = z.object({
  password: z.string().min(6, 'Пароль должен быть минимум 6 символов'),
  confirmPassword: z.string().min(6, 'Подтвердите пароль'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Пароли не совпадают',
  path: ['confirmPassword'],
});

type ResetForm = z.infer<typeof resetSchema>;

const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<ResetForm>({
    resolver: zodResolver(resetSchema),
  });

  const onSubmit = async (data: ResetForm) => {
    if (!token) {
      toast.error('Неверная ссылка сброса пароля');
      return;
    }

    setIsLoading(true);
    try {
      await api.post('/auth/reset-password', {
        token,
        newPassword: data.password
      });
      toast.success('Пароль успешно изменён');
      navigate('/login');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Ошибка сброса пароля');
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <div className="card p-8 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Неверная ссылка</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Ссылка сброса пароля недействительна или устарела.
          </p>
          <Link to="/forgot-password" className="btn-primary inline-block">
            Запросить новую ссылку
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold gradient-text">Новый пароль</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Введите новый пароль</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Новый пароль
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
              {isLoading ? 'Сохранение...' : 'Сохранить пароль'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/login" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 text-sm">
              Вернуться к входу
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;