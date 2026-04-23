import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { toast } from 'sonner';

const VerifyEmail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Неверная ссылка подтверждения');
      return;
    }

    const verifyEmail = async () => {
      try {
        await api.get(`/auth/verify-email?token=${token}`);
        setStatus('success');
        setMessage('Email успешно подтверждён! Теперь вы можете войти.');
        toast.success('Email подтверждён');
      } catch (error: any) {
        setStatus('error');
        setMessage(error.response?.data?.message || 'Ошибка подтверждения email');
        toast.error('Ошибка подтверждения');
      }
    };

    verifyEmail();
  }, [token]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Подтверждение email...</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <div className="card p-8 max-w-md w-full text-center">
          <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          <h2 className="text-2xl font-bold text-red-600 mb-2">Ошибка подтверждения</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{message}</p>
          <Link to="/login" className="btn-primary inline-block">
            Вернуться к входу
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="card p-8 max-w-md w-full text-center">
        <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h2 className="text-2xl font-bold text-green-600 mb-2">Email подтверждён</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">{message}</p>
        <Link to="/login" className="btn-primary inline-block">
          Войти
        </Link>
      </div>
    </div>
  );
};

export default VerifyEmail;