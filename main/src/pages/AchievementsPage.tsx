import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { updateUserAchievements, getUserAchievements } from '../api/achievements';
import { Trophy, Star, Target, Calendar, BookOpen, Zap, Award, Crown } from 'lucide-react';
import { usePet } from '../contexts/PetContext';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  category: 'learning' | 'pet' | 'streak' | 'special';
  // reward: string; // Удалено поле reward
}

export default function AchievementsPage() {
  const { pet } = usePet();
  const { user } = useAuth();
  const [unlockedIds, setUnlockedIds] = useState<string[]>([]);

  // Загружаем ачивки из базы при входе пользователя
  useEffect(() => {
    if (!user) return;
    getUserAchievements(Number(user.id)).then(data => {
      try {
        setUnlockedIds(JSON.parse(data.achievements));
      } catch {
        setUnlockedIds([]);
      }
    });
  }, [user]);

  // Сохраняем ачивки в базу при изменении состояния питомца
  useEffect(() => {
    if (!user) return;
    const newUnlocked = achievements.filter(a => a.unlocked).map(a => a.id);
    setUnlockedIds(newUnlocked);
    updateUserAchievements(Number(user.id), JSON.stringify(newUnlocked)).catch(() => {});
  }, [pet]);

  const achievements: Achievement[] = [
  {
      id: 'first_lesson',
      title: 'Первые шаги',
      description: 'Пройди свой первый урок',
      icon: BookOpen,
      color: 'bg-green-500',
      progress: pet.xp > 0 ? 1 : 0,
      maxProgress: 1,
      unlocked: unlockedIds.includes('first_lesson') || pet.xp > 0,
  category: 'learning',
  // reward: '',
    },
    {
      id: 'level_5',
      title: 'Растущий ученик',
      description: 'Достигни 5 уровня',
      icon: Star,
      color: 'bg-blue-500',
      progress: Math.min(pet.level, 5),
      maxProgress: 5,
      unlocked: unlockedIds.includes('level_5') || pet.level >= 5,
  category: 'pet',
  // reward: '',
    },
    {
      id: 'week_streak',
      title: 'Неделя знаний',
      description: 'Учись 7 дней подряд',
      icon: Calendar,
      color: 'bg-purple-500',
      progress: Math.min(pet.streak, 7),
      maxProgress: 7,
      unlocked: unlockedIds.includes('week_streak') || pet.streak >= 7,
  category: 'streak',
  // reward: '',
    },
    {
      id: 'happy_pet',
      title: 'Счастливый питомец',
      description: 'Поддерживай настроение питомца выше 80%',
      icon: Zap,
      color: 'bg-yellow-500',
      progress: pet.mood >= 80 ? 1 : 0,
      maxProgress: 1,
      unlocked: unlockedIds.includes('happy_pet') || pet.mood >= 80,
  category: 'pet',
  // reward: '',
    },
    {
      id: 'scholar',
      title: 'Ученый',
      description: 'Набери 500 опыта',
      icon: Trophy,
      color: 'bg-indigo-500',
      progress: Math.min(pet.xp, 500),
      maxProgress: 500,
      unlocked: unlockedIds.includes('scholar') || pet.xp >= 500,
  category: 'learning',
  // reward: '',
    },
    {
      id: 'master',
      title: 'Мастер обучения',
      description: 'Достигни 10 уровня',
      icon: Crown,
      color: 'bg-red-500',
      progress: Math.min(pet.level, 10),
      maxProgress: 10,
      unlocked: unlockedIds.includes('master') || pet.level >= 10,
  category: 'special',
  // reward: '',
    },
    {
      id: 'month_streak',
      title: 'Месяц постоянства',
      description: 'Учись 30 дней подряд',
      icon: Target,
      color: 'bg-pink-500',
      progress: Math.min(pet.streak, 30),
      maxProgress: 30,
      unlocked: unlockedIds.includes('month_streak') || pet.streak >= 30,
  category: 'streak',
  // reward: '',
    },
    {
      id: 'perfectionist',
      title: 'Перфекционист',
      description: 'Поддерживай все показатели питомца выше 90%',
      icon: Award,
      color: 'bg-teal-500',
      progress: (pet.hunger >= 90 && pet.mood >= 90) ? 1 : 0,
      maxProgress: 1,
  unlocked: unlockedIds.includes('perfectionist') || (pet.hunger >= 90 && pet.mood >= 90),
      category: 'special',
  // reward: 'Особая медаль',
    },
  ];

  const categories = [
    { id: 'all', name: 'Все', icon: Trophy },
    { id: 'learning', name: 'Обучение', icon: BookOpen },
    { id: 'pet', name: 'Питомец', icon: Star },
    { id: 'streak', name: 'Серии', icon: Calendar },
    { id: 'special', name: 'Особые', icon: Crown },
  ];

  const [selectedCategory, setSelectedCategory] = React.useState('all');

  const filteredAchievements = achievements.filter(
    achievement => selectedCategory === 'all' || achievement.category === selectedCategory
  );

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Достижения 🏆
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          Отслеживай свой прогресс и получай награды за успехи!
        </p>
        
        <div className="bg-white rounded-2xl shadow-lg p-6 max-w-md mx-auto">
          <div className="text-3xl font-bold text-gray-800 mb-2">
            {unlockedCount} / {totalCount}
          </div>
          <div className="text-gray-600 mb-4">Достижений разблокировано</div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${(unlockedCount / totalCount) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
              selectedCategory === category.id
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <category.icon className="w-5 h-5" />
            <span>{category.name}</span>
          </button>
        ))}
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAchievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`bg-white rounded-2xl shadow-lg p-6 transition-all duration-300 ${
              achievement.unlocked
                ? 'ring-2 ring-green-200 hover:shadow-xl'
                : 'opacity-75 hover:opacity-100'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 ${achievement.color} rounded-xl flex items-center justify-center`}>
                <achievement.icon className="w-6 h-6 text-white" />
              </div>
              {achievement.unlocked && (
                <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">
                  Разблокировано
                </div>
              )}
            </div>

            <h3 className="text-xl font-bold text-gray-800 mb-2">
              {achievement.title}
            </h3>
            
            <p className="text-gray-600 mb-4">
              {achievement.description}
            </p>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Прогресс</span>
                <span className="text-sm text-gray-500">
                  {achievement.progress} / {achievement.maxProgress}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${
                    achievement.unlocked ? 'bg-green-500' : 'bg-gray-400'
                  }`}
                  style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Reward */}
            {/* Удалено: отображение награды */}
          </div>
        ))}
      </div>

      {/* Motivational Section */}
      <div className="mt-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl shadow-lg p-8 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">Продолжай в том же духе! 🌟</h2>
        <p className="text-lg opacity-90 mb-6">
          Каждое достижение приближает тебя к новым высотам в обучении.
          Твой мопс гордится твоими успехами!
        </p>
        <div className="flex justify-center space-x-8 text-center">
          <div>
            <div className="text-2xl font-bold">{pet.level}</div>
            <div className="text-sm opacity-75">Уровень</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{pet.xp}</div>
            <div className="text-sm opacity-75">Опыт</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{pet.streak}</div>
            <div className="text-sm opacity-75">Дней подряд</div>
          </div>
        </div>
      </div>
    </div>
  );
}