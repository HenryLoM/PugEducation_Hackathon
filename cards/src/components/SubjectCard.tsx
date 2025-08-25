import React from 'react';
import { ChevronRight, Clock, Star, Book } from 'lucide-react';
import { Subject, SubjectProgress } from '../types';

interface SubjectCardProps {
  subject: Subject;
  progress?: SubjectProgress;
  onSelect: (subject: Subject) => void;
}

const iconMap: Record<string, React.ComponentType<any>> = {
  book: Book,
  code: () => <span className="text-2xl">🐍</span>,
  database: () => <span className="text-2xl">🗃️</span>,
  network: () => <span className="text-2xl">🌐</span>,
  algorithm: () => <span className="text-2xl">⚙️</span>,
};

export function SubjectCard({ subject, progress, onSelect }: SubjectCardProps) {
  const IconComponent = iconMap[subject.icon];
  const completedLessons = progress?.completedLessons.length || 0;
  const progressPercent = (completedLessons / subject.lessons.length) * 100;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Легко': return 'text-green-600';
      case 'Средне': return 'text-yellow-600';
      case 'Сложно': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div 
      className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 border border-gray-100"
      onClick={() => onSelect(subject)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-14 h-14 ${subject.color} rounded-2xl flex items-center justify-center`}>
          {IconComponent && <IconComponent className="w-8 h-8 text-white" />}
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400" />
      </div>
      
      <h3 className="text-xl font-bold text-gray-800 mb-3">{subject.title}</h3>
      <p className="text-gray-600 text-sm mb-6 line-clamp-2">{subject.description}</p>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-1 text-gray-600">
            <Book className="w-4 h-4" />
            <span>{subject.lessons.length} тем</span>
          </div>
          <div className="flex items-center space-x-1 text-gray-600">
            <Clock className="w-4 h-4" />
            <span>{subject.estimatedMinutes}-{subject.estimatedMinutes + 5} мин</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <div className={`flex items-center space-x-1 ${getDifficultyColor(subject.difficulty)}`}>
            <Star className="w-4 h-4" />
            <span>Сложность: {subject.difficulty}</span>
          </div>
          <div className="text-green-600 font-medium">
            +{subject.xpReward} XP за урок
          </div>
        </div>
        
        {progress && (
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Прогресс</span>
              <span className="font-medium">{completedLessons}/{subject.lessons.length}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}