import React, { useState } from 'react';
import { BookOpen, Calculator, Globe, Code, ChevronRight, Star, Clock } from 'lucide-react';
import { usePet } from '../contexts/PetContext';

interface Subject {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  color: string;
  description: string;
  topics: number;
  difficulty: 'Легко' | 'Средне' | 'Сложно';
  estimatedTime: string;
}

const subjects: Subject[] = [
  {
    id: 'literature',
    name: 'Литература',
    icon: BookOpen,
    color: 'bg-purple-500',
    description: 'Изучай классические произведения и развивай навыки анализа текста',
    topics: 10,
    difficulty: 'Средне',
    estimatedTime: '15-20 мин',
  },
  {
    id: 'russian',
    name: 'Русский язык',
    icon: Globe,
    color: 'bg-green-500',
    description: 'Совершенствуй грамматику, орфографию и пунктуацию',
    topics: 15,
    difficulty: 'Легко',
    estimatedTime: '10-15 мин',
  },
  {
    id: 'mathematics',
    name: 'Математика',
    icon: Calculator,
    color: 'bg-blue-500',
    description: 'Решай задачи по алгебре, геометрии и арифметике',
    topics: 12,
    difficulty: 'Сложно',
    estimatedTime: '20-25 мин',
  },
  {
    id: 'informatics',
    name: 'Информатика',
    icon: Code,
    color: 'bg-orange-500',
    description: 'Изучай алгоритмы, программирование и основы IT',
    topics: 8,
    difficulty: 'Сложно',
    estimatedTime: '25-30 мин',
  },
];

export default function LearningPage() {
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const { addXP, updateMood } = usePet();

  const handleStartLearning = (subject: Subject) => {
    if (subject.id === 'informatics') {
      window.location.href = 'http://localhost:5174/';
      return;
    }
    setSelectedSubject(subject);
    // In a real app, this would navigate to the learning session
    // For now, we'll just simulate completing a lesson
    setTimeout(() => {
      addXP(10);
      updateMood(5);
      setSelectedSubject(null);
      alert(`Отлично! Ты получил 10 XP за изучение предмета "${subject.name}"!`);
    }, 2000);
  };

  if (selectedSubject) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className={`w-24 h-24 mx-auto ${selectedSubject.color} rounded-full flex items-center justify-center mb-6`}>
            <selectedSubject.icon className="w-12 h-12 text-white" />
          </div>
          
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Изучаем {selectedSubject.name}
          </h2>
          
          <p className="text-lg text-gray-600 mb-8">
            Подготавливаем материалы для изучения...
          </p>
          
          <div className="flex justify-center">
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Центр обучения 📚
        </h1>
        <p className="text-xl text-gray-600">
          Выбери предмет и начни изучение! Твой мопс будет рад новым знаниям.
        </p>
      </div>

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {subjects.map((subject) => (
          <div
            key={subject.id}
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer"
            onClick={() => handleStartLearning(subject)}
          >
            <div className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div className={`w-16 h-16 ${subject.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <subject.icon className="w-8 h-8 text-white" />
                </div>
                <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-gray-600 transition-colors" />
              </div>

              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                {subject.name}
              </h3>
              
              <p className="text-gray-600 mb-6">
                {subject.description}
              </p>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">{subject.topics} тем</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">{subject.estimatedTime}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">Сложность: {subject.difficulty}</span>
                  </div>
                  <div className="text-green-600 font-semibold">
                    +10 XP за урок
                  </div>
                </div>
              </div>
            </div>

            <div className={`h-2 ${subject.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}></div>
          </div>
        ))}
      </div>

      {/* Learning Tips */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg p-8 text-white">
        <h2 className="text-2xl font-bold mb-4">💡 Советы для эффективного обучения</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-4xl mb-2">🎯</div>
            <h3 className="font-semibold mb-2">Ставь цели</h3>
            <p className="text-sm opacity-90">
              Определи, сколько уроков хочешь пройти сегодня
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-2">⏰</div>
            <h3 className="font-semibold mb-2">Делай перерывы</h3>
            <p className="text-sm opacity-90">
              Отдыхай каждые 25-30 минут для лучшего усвоения
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-2">🔄</div>
            <h3 className="font-semibold mb-2">Повторяй</h3>
            <p className="text-sm opacity-90">
              Регулярное повторение поможет закрепить знания
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}