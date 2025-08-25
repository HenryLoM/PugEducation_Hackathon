import { useEffect } from 'react';
import { Heart, Zap, Star, Calendar, TrendingUp, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePet } from '../contexts/PetContext';
import PetDisplay from '../components/PetDisplay';
import StatCard from '../components/StatCard';
import QuickActions from '../components/QuickActions';

export default function HomePage() {
  const { pet, checkDailyLogin } = usePet();

  useEffect(() => {
    checkDailyLogin();
  }, [checkDailyLogin]);

  const getXPToNextLevel = () => {
    return 100 - (pet.xp % 100);
  };

  const getProgressPercentage = () => {
    return (pet.xp % 100);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Добро пожаловать домой! 🏠
        </h1>
        <p className="text-xl text-gray-600">
          Твой мопс {pet.name} ждет тебя!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Pet Display */}
        <div className="lg:col-span-2">
          <PetDisplay />
        </div>

        {/* Stats Panel */}
        <div className="space-y-6">
          {/* Pet Stats */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Статистика питомца</h2>
            
            <div className="space-y-4">
              <StatCard
                icon={Heart}
                label="Голод"
                value={pet.hunger}
                maxValue={100}
                color="red"
                suffix="%"
              />
              
              <StatCard
                icon={Zap}
                label="Настроение"
                value={pet.mood}
                maxValue={100}
                color="yellow"
                suffix="%"
              />
              
              <StatCard
                icon={Star}
                label="Уровень"
                value={pet.level}
                color="purple"
              />
              
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Опыт</span>
                  <span className="text-sm text-gray-500">
                    {pet.xp} XP (до {pet.level + 1} уровня: {getXPToNextLevel()} XP)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${getProgressPercentage()}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Achievement Stats */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Достижения</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Серия дней</span>
                </div>
                <span className="font-bold text-green-600">{pet.streak}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-blue-500" />
                  <span className="text-gray-700">Всего XP</span>
                </div>
                <span className="font-bold text-blue-600">{pet.xp}</span>
              </div>
            </div>
          </div>

          {/* Chat Button */}
          <Link
            to="/chat"
            className="flex items-center justify-center px-4 py-3 bg-purple-600 text-white rounded-lg shadow-lg hover:bg-purple-700 transition"
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            Перейти в чат
          </Link>

          {/* Quick Actions */}
          <QuickActions />
        </div>
      </div>

      {/* Daily Tips */}
      <div className="mt-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl shadow-lg p-8 text-white">
        <h2 className="text-2xl font-bold mb-4">💡 Совет дня</h2>
        <p className="text-lg opacity-90">
          Регулярные занятия помогают твоему мопсу оставаться счастливым! 
          Попробуй изучить что-то новое сегодня и получи бонусный опыт.
        </p>
      </div>
    </div>
  );
}
