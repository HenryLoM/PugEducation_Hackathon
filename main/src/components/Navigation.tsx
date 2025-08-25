// import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, User, Trophy, LogOut, Bot } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Navigation() {
  const location = useLocation();
  const { user, logout } = useAuth();

  const navItems = [
  { path: '/', icon: Home, label: 'Главная' },
  { path: '/learning', icon: BookOpen, label: 'Обучение' },
  { path: '/profile', icon: User, label: 'Профиль' },
  { path: '/achievements', icon: Trophy, label: 'Достижения' }
  ];

  // Внешний пункт PugLab AI
  const externalNavHref = 'http://localhost:5175/';

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <div className="text-2xl">🐶</div>
            <span className="text-xl font-bold text-gray-800">PugEducation</span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {navItems.map(({ path, icon: Icon, label }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  location.pathname === path
                    ? 'bg-green-100 text-green-700'
                    : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </Link>
            ))}
            {/* Внешний пункт PugLab AI */}
            <a
              href={externalNavHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-600 hover:text-purple-600 hover:bg-purple-50 transition-colors"
            >
              <Bot className="w-5 h-5" />
              <span>PugLab AI <span>🤖</span></span>
            </a>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.nickname}
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {user?.nickname.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="hidden sm:block text-gray-700">{user?.nickname}</span>
            </div>
            
            <button
              onClick={logout}
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Выйти"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-gray-200">
          <div className="flex justify-around py-2">
            {navItems.map(({ path, icon: Icon, label }) => (
              <Link
                key={path}
                to={path}
                className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                  location.pathname === path
                    ? 'text-green-700'
                    : 'text-gray-600 hover:text-green-600'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs mt-1">{label}</span>
              </Link>
            ))}
            {/* Внешний пункт PugLab AI */}
            <a
              href={externalNavHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center py-2 px-3 rounded-lg text-gray-600 hover:text-purple-600"
            >
              <Bot className="w-5 h-5" />
              <span className="text-xs mt-1">PugLab AI <span>🤖</span></span>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}