import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import type { Task } from '../types';
import { toast } from 'sonner';
import TaskModal from '../components/TaskModal';
import SortableTaskList from '../components/SortableTaskList';
import ExportModal from '../components/ExportModal';
import MobileMenu from '../components/MobileMenu';
import {
  LogOut,
  Plus,
  CheckCircle,
  LayoutDashboard,
  Moon,
  Sun,
  Loader2,
  Filter,
  Search,
  X,
  TrendingUp,
  Calendar,
  BarChart3,
  Download,
  Target,
  ListTodo
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchTasks();
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const fetchTasks = async () => {
    try {
      const { data } = await api.get('/tasks');
      setTasks(data);
    } catch (error) {
      toast.error('Ошибка загрузки задач');
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      const { data } = await api.post('/tasks', { title: newTaskTitle });
      setTasks([data, ...tasks]);
      setNewTaskTitle('');
      toast.success('Задача создана');
    } catch (error) {
      toast.error('Ошибка создания задачи');
    }
  };

  const updateTask = async (id: string, updates: any) => {
    try {
      const { data } = await api.put(`/tasks/${id}`, updates);
      setTasks(tasks.map(t => t._id === id ? data : t));
      toast.success('Задача обновлена');
      return data;
    } catch (error) {
      toast.error('Ошибка обновления');
      throw error;
    }
  };

  const toggleTask = async (task: Task) => {
    const newStatus = task.status === 'pending' ? 'completed' : 'pending';
    await updateTask(task._id, { status: newStatus });
  };

  const deleteTask = async (id: string) => {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(tasks.filter(t => t._id !== id));
      toast.success('Задача удалена');
    } catch (error) {
      toast.error('Ошибка удаления');
    }
  };

  const handleReorder = async (reorderedTasks: Task[]) => {
    setTasks(reorderedTasks);
    const updates = reorderedTasks.map((task, index) => ({
      id: task._id,
      order: index
    }));
    try {
      await api.put('/tasks/reorder', { tasks: updates });
    } catch (error) {
      toast.error('Ошибка сохранения порядка');
      fetchTasks();
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleSaveTask = async (id: string, data: any) => {
    await updateTask(id, data);
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter !== 'all' && task.status !== filter) return false;
    if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const pendingTasks = filteredTasks.filter(t => t.status === 'pending');
  const completedTasks = filteredTasks.filter(t => t.status === 'completed');
  const completionRate = tasks.length > 0 ? Math.round((tasks.filter(t => t.status === 'completed').length / tasks.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 pb-20 lg:pb-0">
      <header className="sticky top-0 z-10 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold gradient-text">TaskFlow</h1>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setIsExportModalOpen(true)}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
              title="Экспорт задач"
            >
              <Download className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <Link
              to="/statistics"
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all hidden sm:inline-flex"
              title="Статистика"
            >
              <BarChart3 className="w-5 h-5" />
            </Link>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
            >
              {isDarkMode ? <Sun className="w-4 h-4 sm:w-5 sm:h-5" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>

            <div className="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-3 border-l border-gray-200 dark:border-gray-700">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{user?.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
              </div>
              <button
                onClick={logout}
                className="btn-secondary flex items-center gap-1 sm:gap-2 px-3 sm:px-5 py-2 text-sm"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Выйти</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="card p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Всего задач</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mt-1">{tasks.length}</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <ListTodo className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="card p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Выполнено</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mt-1">
                  {tasks.filter(t => t.status === 'completed').length}
                </p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="mt-3">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                <div
                  className="bg-gradient-to-r from-green-500 to-green-600 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">Прогресс: {completionRate}%</p>
            </div>
          </div>

          <div className="card p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Активных задач</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mt-1">
                  {tasks.filter(t => t.status === 'pending').length}
                </p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
                <Target className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Create Task Form */}
        <div className="card p-5 mb-6 sm:mb-8">
          <form onSubmit={createTask} className="flex gap-2 sm:gap-3">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Новая задача"
              className="input-field flex-1 text-sm sm:text-base"
            />
            <button type="submit" className="btn-primary flex items-center gap-1 sm:gap-2 px-4 sm:px-6">
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden xs:inline">Добавить</span>
            </button>
          </form>
        </div>

        {/* Filters */}
        <div className="mb-4 sm:mb-6">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors"
            >
              <Filter className="w-4 h-4" />
              <span>Фильтры</span>
            </button>
            {(filter !== 'all' || searchQuery) && (
              <button
                onClick={() => {
                  setFilter('all');
                  setSearchQuery('');
                }}
                className="text-sm text-red-500 hover:text-red-600 transition-colors"
              >
                Сбросить фильтры
              </button>
            )}
          </div>

          {showFilters && (
            <div className="card p-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Поиск задач"
                    className="input-field pl-9 text-sm"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setFilter('all')}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-all ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                  >
                    Все
                  </button>
                  <button
                    onClick={() => setFilter('pending')}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-all ${filter === 'pending' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                  >
                    Активные
                  </button>
                  <button
                    onClick={() => setFilter('completed')}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-all ${filter === 'completed' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                  >
                    Выполненные
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Tasks Lists */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Активные задачи ({pendingTasks.length})
              </h2>
              <SortableTaskList
                tasks={pendingTasks}
                onReorder={handleReorder}
                onToggle={toggleTask}
                onEdit={handleEditTask}
                onDelete={deleteTask}
              />
            </div>

            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Выполненные ({completedTasks.length})
              </h2>
              <SortableTaskList
                tasks={completedTasks}
                onReorder={handleReorder}
                onToggle={toggleTask}
                onEdit={handleEditTask}
                onDelete={deleteTask}
              />
            </div>
          </div>
        )}
      </main>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
        }}
        task={editingTask}
        onSave={handleSaveTask}
      />

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        tasks={tasks}
      />

      <MobileMenu isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
    </div>
  );
};

export default Dashboard;