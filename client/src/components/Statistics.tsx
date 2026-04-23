import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import type { Task } from '../types';
import { Calendar, TrendingUp, Award, Target } from 'lucide-react';

interface StatisticsProps {
  tasks: Task[];
}

const Statistics: React.FC<StatisticsProps> = ({ tasks }) => {
  // Статистика по дням
  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push(date.toISOString().split('T')[0]);
    }
    return days;
  };

  const dailyStats = getLast7Days().map(day => {
    const completedOnDay = tasks.filter(task => {
      if (task.status !== 'completed') return false;
      const taskDate = new Date(task.updatedAt).toISOString().split('T')[0];
      return taskDate === day;
    }).length;

    const createdOnDay = tasks.filter(task => {
      const taskDate = new Date(task.createdAt).toISOString().split('T')[0];
      return taskDate === day;
    }).length;

    return {
      day: day.slice(5),
      создано: createdOnDay,
      выполнено: completedOnDay,
    };
  });

  // Статистика по приоритетам
  const priorityStats = [
    { name: 'Высокий', value: tasks.filter(t => t.priority === 'high').length, color: '#ef4444' },
    { name: 'Средний', value: tasks.filter(t => t.priority === 'medium').length, color: '#eab308' },
    { name: 'Низкий', value: tasks.filter(t => t.priority === 'low').length, color: '#22c55e' },
  ];

  // Статистика по статусам
  const completionRate = tasks.length > 0
    ? Math.round((tasks.filter(t => t.status === 'completed').length / tasks.length) * 100)
    : 0;

  const productivityScore = Math.min(100, Math.round(completionRate * 1.2));

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Продуктивность</p>
              <p className="text-3xl font-bold text-gray-800 dark:text-white mt-2">{productivityScore}%</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
              <Award className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${productivityScore}%` }}
              />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Выполнено задач</p>
              <p className="text-3xl font-bold text-gray-800 dark:text-white mt-2">
                {tasks.filter(t => t.status === 'completed').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Текущая неделя</p>
              <p className="text-3xl font-bold text-gray-800 dark:text-white mt-2">
                {dailyStats.reduce((sum, day) => sum + day.выполнено, 0)}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Активность за неделю
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dailyStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="day" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Bar dataKey="создано" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="выполнено" fill="#22c55e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Распределение по приоритетам
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={priorityStats}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {priorityStats.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Productivity Tips */}
      {completionRate < 50 && tasks.length > 5 && (
        <div className="card p-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-8 h-8" />
            <div>
              <h3 className="text-lg font-semibold">Совет по продуктивности</h3>
              <p className="text-blue-100 mt-1">
                У вас много активных задач. Попробуйте сфокусироваться на 2-3 самых важных задачах в день!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Statistics;