import React from 'react';
import { BookOpen, CheckCircle } from 'lucide-react';
import { AppMode } from '../types';

interface ModeSelectorProps {
  currentMode: AppMode;
  onModeChange: (mode: AppMode) => void;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({ currentMode, onModeChange }) => {
  return (
    <div className="flex bg-gray-100 p-1 rounded-xl">
      <button
        onClick={() => onModeChange('generation')}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
          currentMode === 'generation'
            ? 'bg-white text-blue-600 shadow-md'
            : 'text-gray-600 hover:text-gray-800'
        }`}
      >
        <BookOpen className="h-4 w-4" />
        Генерация заданий
      </button>
      
      <button
        onClick={() => onModeChange('evaluation')}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
          currentMode === 'evaluation'
            ? 'bg-white text-green-600 shadow-md'
            : 'text-gray-600 hover:text-gray-800'
        }`}
      >
        <CheckCircle className="h-4 w-4" />
        Оценка ответов
      </button>
    </div>
  );
};