import React, { useState } from 'react';
import { Heart, Zap, Gift } from 'lucide-react';
import { usePet } from '../contexts/PetContext';
import { Link } from 'react-router-dom';
// Emotion images: ./emotions/1.png ... ./emotions/6.png

export default function PetDisplay() {
  const { pet, feedPet, changePetName } = usePet();
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(pet.name);
  const [isFeeding, setIsFeeding] = useState(false);

  // Map mood to emotion image (1 happiest, 6 saddest)
  const getEmotionIndex = () => {
    if (pet.mood >= 86 && pet.mood <= 100) return 1;
    if (pet.mood >= 71 && pet.mood <= 85) return 2;
    if (pet.mood >= 51 && pet.mood <= 70) return 3;
    if (pet.mood >= 31 && pet.mood <= 50) return 4;
    if (pet.mood >= 16 && pet.mood <= 30) return 5;
    if (pet.mood >= 0 && pet.mood <= 15) return 6;
    return 6;
  };

  const getPetMessage = () => {
    if (pet.hunger < 30) return `${pet.name} очень голоден! Покорми меня!`;
    if (pet.mood < 30) return `${pet.name} грустит... Поговори со мной в чате!`;
    if (pet.mood > 80) return `${pet.name} очень счастлив! Спасибо за общение!`;
    return `${pet.name} чувствует себя нормально.`;
  };

  const handleFeed = async () => {
    setIsFeeding(true);
    feedPet();
    setTimeout(() => {
      setIsFeeding(false);
    }, 1000);
  };

  const handleNameSave = async () => {
    await changePetName(newName);
    setIsEditingName(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
      <div className="relative">
        {/* Pet Avatar */}
        <div className="relative inline-block">
          <div className="w-48 h-48 mx-auto bg-gradient-to-br from-amber-200 to-orange-300 rounded-full flex items-center justify-center shadow-lg mb-6 transition-transform duration-300 hover:scale-105">
            {isFeeding ? (
              <div className="text-8xl animate-bounce">🍖</div>
            ) : (
              <img
                src={`./emotions/${getEmotionIndex()}.png`}
                alt={`Эмоция ${getEmotionIndex()}`}
                className="w-40 h-40 object-contain"
              />
            )}
          </div>
          
          {/* Status indicators */}
          <div className="absolute -top-2 -right-2 flex space-x-1">
            {pet.hunger < 50 && (
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                <Heart className="w-4 h-4 text-white" />
              </div>
            )}
            {pet.mood > 80 && (
              <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center animate-pulse">
                <Zap className="w-4 h-4 text-white" />
              </div>
            )}
            {pet.state === 'evolved' && (
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center animate-bounce">
                <Gift className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
        </div>

        {/* Pet Info */}
        <div className="mb-6">
          {isEditingName ? (
            <div className="flex flex-col items-center mb-2">
              <input
                type="text"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                className="text-2xl font-bold text-gray-800 mb-2 px-2 py-1 rounded border border-gray-300"
                maxLength={16}
              />
              <div className="flex space-x-2">
                <button onClick={handleNameSave} className="bg-green-500 text-white px-3 py-1 rounded">Сохранить</button>
                <button onClick={() => { setIsEditingName(false); setNewName(pet.name); }} className="bg-gray-300 px-3 py-1 rounded">Отмена</button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center mb-2">
              <h2 className="text-3xl font-bold text-gray-800 mr-2">{pet.name}</h2>
              <button onClick={() => setIsEditingName(true)} className="text-blue-500 underline text-sm">Изменить</button>
            </div>
          )}
          <p className="text-lg text-gray-600 mb-4">{getPetMessage()}</p>
          
          <div className="flex justify-center items-center space-x-4 text-sm text-gray-500">
            <span>Уровень {pet.level}</span>
            <span>•</span>
            <span>{pet.xp} XP</span>
            <span>•</span>
            <span>Серия: {pet.streak} дней</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={handleFeed}
            disabled={isFeeding}
            className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <Heart className="w-5 h-5" />
            <span>{isFeeding ? 'Кормлю...' : 'Покормить'}</span>
          </button>
          
          <Link
            to="/learning"
            className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors flex items-center space-x-2"
          >
            <Zap className="w-5 h-5" />
            <span>Учиться</span>
          </Link>
        </div>

        {/* Mood and Hunger bars */}
        <div className="mt-6 space-y-3">
          <div className="bg-gray-100 rounded-lg p-3">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Голод</span>
              <span className="text-sm text-gray-500">{pet.hunger}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${
                  pet.hunger > 70 ? 'bg-green-500' : pet.hunger > 30 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${pet.hunger}%` }}
              ></div>
            </div>
          </div>
          
          <div className="bg-gray-100 rounded-lg p-3">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Настроение</span>
              <span className="text-sm text-gray-500">{pet.mood}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${
                  pet.mood > 70 ? 'bg-green-500' : pet.mood > 30 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${pet.mood}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}