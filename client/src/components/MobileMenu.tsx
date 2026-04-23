import React, { useState } from 'react';
import { Menu, X, LayoutDashboard, BarChart3, LogOut, Sun, Moon, Sparkles } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface MobileMenuProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isDarkMode, toggleTheme }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useAuth();
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Задачи' },
    { path: '/statistics', icon: BarChart3, label: 'Статистика' },
  ];

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  return (
    <>
      {/* Кнопка меню */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg flex items-center justify-center lg:hidden active:scale-95 transition-transform"
        aria-label="Меню"
      >
        <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
      </button>

      {/* Оверлей */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          {/* Меню */}
          <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-dark-100 rounded-t-3xl shadow-2xl animate-slide-up">
            <div className="p-5 sm:p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <h2 className="text-xl font-bold gradient-text">TaskFlow</h2>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 -m-2 active:scale-95 transition-transform"
                >
                  <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              <div className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 p-3 rounded-xl transition-all active:scale-98 ${isActive
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  );
                })}

                <button
                  onClick={toggleTheme}
                  className="flex items-center gap-3 p-3 rounded-xl w-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all active:scale-98"
                >
                  {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  <span className="font-medium">{isDarkMode ? 'Светлая тема' : 'Темная тема'}</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 p-3 rounded-xl w-full text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all active:scale-98"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Выйти</span>
                </button>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-800">
                <p className="text-center text-xs text-gray-500 dark:text-gray-400">
                  TaskFlow v1.0.0
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileMenu;