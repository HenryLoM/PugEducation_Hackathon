import React from 'react';
import { GraduationCap } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b relative">
      <a
        href="http://localhost:5173/"
  className="absolute top-[20px] left-4 p-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition flex items-center justify-center"
        style={{ width: 40, height: 40 }}
        title="Назад"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </a>
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl text-white">
            <GraduationCap className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              PugLab Generator
            </h1>
            <p className="text-gray-600 text-sm">
              Интеллектуальный генератор образовательных заданий
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};