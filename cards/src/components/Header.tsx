import React from 'react';
import { Home, User, Trophy } from 'lucide-react';

interface HeaderProps {
  userName: string;
  onBackToHome?: () => void;
}

export function Header({ userName, onBackToHome }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🐕</span>
              <span className="text-xl font-bold text-gray-800">PugEducation</span>
            </div>
            {onBackToHome && (
              <button
                onClick={onBackToHome}
                className="flex items-center space-x-1 px-3 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Home className="w-4 h-4" />
                <span>Главная</span>
              </button>
            )}
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#" className="text-gray-600 hover:text-gray-800 flex items-center space-x-1">
              <Home className="w-4 h-4" />
              <span>Главная</span>
            </a>
            <a href="#" className="text-green-600 font-medium flex items-center space-x-1">
              <span>📚</span>
              <span>Обучение</span>
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-800 flex items-center space-x-1">
              <User className="w-4 h-4" />
              <span>Профиль</span>
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-800 flex items-center space-x-1">
              <Trophy className="w-4 h-4" />
              <span>Достижения</span>
            </a>
          </nav>
          
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
              {userName.charAt(0).toUpperCase()}
            </div>
            <span className="hidden sm:block text-gray-700 font-medium">{userName}</span>
          </div>
        </div>
      </div>
    </header>
  );
}