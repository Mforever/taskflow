export interface User {
  _id: string;
  name: string;
  email: string;
  preferences: {
    theme: 'light' | 'dark';
  };
  createdAt: string;
}

export interface Task {
  _id: string;
  userId: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'completed';
  deadline?: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  deadline?: string;
}

export interface UpdateTaskData extends Partial<CreateTaskData> {
  status?: 'pending' | 'completed';
}

export interface AuthResponse {
  _id: string;
  name: string;
  email: string;
  preferences: {
    theme: 'light' | 'dark';
  };
}

export interface Statistics {
  total: number;
  completed: number;
  pending: number;
  completionRate: number;
  byPriority: {
    high: number;
    medium: number;
    low: number;
  };
  last7Days: {
    date: string;
    created: number;
    completed: number;
  }[];
}

// Типы для приоритетов и статусов
export type Priority = 'low' | 'medium' | 'high';
export type TaskStatus = 'pending' | 'completed';

// Константы для отображения
export const PRIORITY_LABELS: Record<Priority, string> = {
  low: 'Низкий',
  medium: 'Средний',
  high: 'Высокий'
};

export const PRIORITY_COLORS: Record<Priority, string> = {
  low: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  high: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
};

export const STATUS_LABELS: Record<TaskStatus, string> = {
  pending: 'Активна',
  completed: 'Выполнена'
};