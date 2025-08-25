import { useState } from 'react';
import { User, Mail, Calendar, Edit3, Save, X, Trophy, TrendingUp, Target } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { usePet } from '../contexts/PetContext';

export default function ProfilePage() {
  const { user, editProfile, changePassword, updateNotifications, deleteAccount } = useAuth();
  const { pet } = usePet();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    nickname: user?.nickname || '',
    bio: user?.bio || '',
    google_registered: user?.google_registered ?? 0,
    achievements: user?.achievements || '[]',
    level: user?.level || 1,
    learning_progress: user?.learning_progress || '{}',
  });

  const handleSave = () => {
    editProfile({
      name: editData.nickname,
      bio: editData.bio,
      google_registered: editData.google_registered,
      achievements: editData.achievements,
      level: editData.level,
      learning_progress: editData.learning_progress,
    });
    setIsEditing(false);
    alert('Профиль обновлен!');
  };

  const handleCancel = () => {
    setEditData({
      nickname: user?.nickname || '',
      bio: user?.bio || '',
      google_registered: user?.google_registered ?? 0,
      achievements: user?.achievements || '[]',
      level: user?.level || 1,
      learning_progress: user?.learning_progress || '{}',
    });
    setIsEditing(false);
  };

  const getJoinDate = () => {
    if (!user?.createdAt) return 'Недавно';
    const date = new Date(user.createdAt);
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getLevelProgress = () => {
    return (pet.xp % 100);
  };

  const stats = [
    {
      icon: Trophy,
      label: 'Уровень питомца',
      value: pet.level,
      color: 'text-yellow-600 bg-yellow-100',
    },
    {
      icon: TrendingUp,
      label: 'Всего опыта',
      value: pet.xp,
      color: 'text-blue-600 bg-blue-100',
    },
    {
      icon: Target,
      label: 'Серия дней',
      value: pet.streak,
      color: 'text-green-600 bg-green-100',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Профиль 👤
        </h1>
        <p className="text-xl text-gray-600">
          Управляй своим аккаунтом и следи за прогрессом
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-start justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Информация о профиле</h2>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <Edit3 className="w-5 h-5" />
                  <span>Редактировать</span>
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={handleSave}
                    className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    <span>Сохранить</span>
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center space-x-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    <span>Отмена</span>
                  </button>
                </div>
              )}
            </div>

            {/* Profile Header Section (no avatar) */}
            <div className="flex items-center space-x-6 mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                {editData.nickname.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-800 mb-1">
                  {user?.nickname}
                </h3>
                <p className="text-gray-600">
                  Пользователь с {getJoinDate()}
                </p>
              </div>
            </div>

            {/* Profile Fields */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Никнейм
                </label>
                {isEditing ? (
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={editData.nickname}
                      onChange={(e) => setEditData({ ...editData, nickname: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                ) : (
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <User className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-800">{user?.nickname}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Электронная почта
                </label>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-800">{user?.email}</span>
                </div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  О себе
                </label>
                {isEditing ? (
                  <textarea
                    value={editData.bio}
                    onChange={e => setEditData({ ...editData, bio: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <div className="p-3 bg-gray-50 rounded-lg text-gray-800">
                    {user?.bio || '—'}
                  </div>
                )}
                {/* Achievements editing */}
                {/* Удалено: кастомная настройка ачивок, уровня и прогресса обучения */}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Дата регистрации
                </label>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-800">{getJoinDate()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Sidebar */}
        <div className="space-y-6">
          {/* Pet Progress */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Прогресс питомца</h3>
            <div className="mb-4">
              <span className="font-medium text-gray-800">Уровень пользователя: {user?.level}</span>
            </div>
            <div className="mb-4">
              <span className="font-medium text-gray-800">Ачивки:</span>
              <ul className="list-disc ml-6">
                {user?.achievements && JSON.parse(user.achievements).map((ach: string, idx: number) => (
                  <li key={idx} className="text-gray-700">{ach}</li>
                ))}
              </ul>
            </div>
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">🐶</div>
              <h4 className="text-lg font-semibold text-gray-800">{pet.name}</h4>
              <p className="text-gray-600">Уровень {pet.level}</p>
            </div>
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Прогресс до следующего уровня</span>
                <span className="text-sm text-gray-500">{getLevelProgress()}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${getLevelProgress()}%` }}
                ></div>
              </div>
            </div>
            <div className="space-y-3">
              {stats.map((stat, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`p-2 rounded-lg ${stat.color}`}>
                      <stat.icon className="w-4 h-4" />
                    </div>
                    <span className="text-sm text-gray-700">{stat.label}</span>
                  </div>
                  <span className="font-bold text-gray-800">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Account Settings */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Настройки аккаунта</h3>
            <div className="space-y-3">
              <button
                className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={() => {
                  const newPassword = prompt('Введите новый пароль:');
                  if (newPassword) changePassword(newPassword);
                }}
              >
                <div className="font-medium text-gray-800">Изменить пароль</div>
                <div className="text-sm text-gray-600">Обновить пароль для входа</div>
              </button>

              {/* Notification Switcher */}
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-800">Уведомления</span>
                <label className="switch">
                  <input type="checkbox" checked={user?.notifications_enabled === 1} onChange={e => updateNotifications(e.target.checked)} />
                  <span className="slider"></span>
                </label>
              </div>

              <button
                className="w-full text-left p-3 rounded-lg hover:bg-red-50 transition-colors text-red-600"
                onClick={() => {
                  if (window.confirm('Вы уверены, что хотите удалить аккаунт? Это действие необратимо!')) {
                    deleteAccount();
                  }
                }}
              >
                <div className="font-medium">Удалить аккаунт</div>
                <div className="text-sm opacity-75">Безвозвратно удалить данные</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}