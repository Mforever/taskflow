import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { api } from '../services/api';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

const forgotSchema = z.object({
  email: z.string().email('Введите корректный email'),
});

type ForgotForm = z.infer<typeof forgotSchema>;

const ForgotPassword: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<ForgotForm>({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = async (data: ForgotForm) => {
    setIsLoading(true);
    try {
      await api.post('/auth/forgot-password', data);
      setIsSent(true);
      toast.success('Инструкции отправлены на email');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Ошибка');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <div className="card p-8 max-w-md w-full text-center">
          <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Письмо отправлено</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            На ваш email отправлены инструкции по восстановлению пароля.
          </p>
          <Link to="/login" className="btn-primary inline-block">
            Вернуться к входу
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7.5a3 3 0 11-6 0 3 3 0 016 0zM12 4.5v6m0 0l3-3m-3 3l-3-3" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold gradient-text">Восстановление пароля</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Введите email, и мы отправим инструкции по сбросу пароля
          </p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full"
            >
              {isLoading ? 'Отправка...' : 'Отправить инструкции'}
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

export default ForgotPassword;