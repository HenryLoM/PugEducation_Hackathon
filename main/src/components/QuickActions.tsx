import React from 'react';
import { BookOpen, Trophy, User, TrendingUp, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function QuickActions() {
  const actions = [
    {
      icon: BookOpen,
      label: 'Учиться',
      description: 'Изучай новые предметы',
      to: '/learning',
      color: 'bg-blue-500 hover:bg-blue-600',
    },
    {
      icon: Trophy,
      label: 'Достижения',
      description: 'Посмотри свои награды',
      to: '/achievements',
      color: 'bg-yellow-500 hover:bg-yellow-600',
    },
    {
      icon: User,
      label: 'Профиль',
      description: 'Управляй аккаунтом',
      to: '/profile',
      color: 'bg-green-500 hover:bg-green-600',
    },
    {
      icon: MessageCircle,
      label: 'Чат',
      description: 'Поговори с питомцем',
      to: '/chat',
      color: 'bg-purple-500 hover:bg-purple-600',
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Быстрые действия</h3>
      
      <div className="space-y-3">
        {actions.map((action) => (
          <Link
            key={action.to}
            to={action.to}
            className={`block w-full ${action.color} text-white p-4 rounded-lg transition-colors group`}
          >
            <div className="flex items-center space-x-3">
              <action.icon className="w-6 h-6" />
              <div>
                <div className="font-semibold">{action.label}</div>
                <div className="text-sm opacity-90">{action.description}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
