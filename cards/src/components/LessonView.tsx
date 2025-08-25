import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Book, Brain, MessageCircle } from 'lucide-react';
import { Subject, UserProgress } from '../types';
import { TheorySection } from './TheorySection';
import { PracticeSection } from './PracticeSection';
import { OllamaChat } from './OllamaChat';

interface LessonViewProps {
  subject: Subject;
  lessonIndex: number;
  userProgress: UserProgress;
  onLessonComplete: (lessonId: string, score: number) => void;
  onNextLesson: () => void;
  onPreviousLesson: () => void;
}

export function LessonView({
  subject,
  lessonIndex,
  userProgress,
  onLessonComplete,
  onNextLesson,
  onPreviousLesson
}: LessonViewProps) {
  const [activeTab, setActiveTab] = useState<'theory' | 'practice' | 'chat'>('theory');
  const [showOllamaChat, setShowOllamaChat] = useState(false);
  const [chatContext, setChatContext] = useState<string>('');

  const currentLesson = subject.lessons[lessonIndex];
  const isCompleted = userProgress.completedLessons.includes(currentLesson.id);

  const handleOllamaRequest = (context: string) => {
    setChatContext(context);
    setShowOllamaChat(true);
    setActiveTab('chat');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold">{subject.title}</h1>
              <p className="text-blue-100">{currentLesson.title}</p>
            </div>
            <div className="text-right">
              <div className="text-sm opacity-90">
                Урок {lessonIndex + 1} из {subject.lessons.length}
              </div>
              {isCompleted && (
                <div className="text-green-200 text-sm mt-1">✓ Завершен</div>
              )}
            </div>
          </div>
          
          <div className="w-full bg-blue-400 rounded-full h-2">
            <div 
              className="bg-white h-2 rounded-full transition-all duration-300" 
              style={{ width: `${((lessonIndex + 1) / subject.lessons.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('theory')}
            className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
              activeTab === 'theory'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            <Book className="w-5 h-5 mx-auto mb-1" />
            Теория
          </button>
          <button
            onClick={() => setActiveTab('practice')}
            className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
              activeTab === 'practice'
                ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            <Brain className="w-5 h-5 mx-auto mb-1" />
            Практика
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
              activeTab === 'chat'
                ? 'text-green-600 border-b-2 border-green-600 bg-green-50'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            <MessageCircle className="w-5 h-5 mx-auto mb-1" />
            AI Помощник
          </button>
        </div>

        <div className="min-h-[600px]">
          {activeTab === 'theory' && (
            <TheorySection 
              lesson={currentLesson} 
              onOllamaRequest={handleOllamaRequest}
            />
          )}
          {activeTab === 'practice' && (
            <PracticeSection 
              lesson={currentLesson}
              onComplete={(score) => onLessonComplete(currentLesson.id, score)}
              onOllamaRequest={handleOllamaRequest}
            />
          )}
          {activeTab === 'chat' && (
            <OllamaChat 
              context={chatContext}
              lessonTitle={currentLesson.title}
            />
          )}
        </div>

        <div className="flex justify-between items-center p-6 border-t bg-gray-50">
          <button
            onClick={onPreviousLesson}
            disabled={lessonIndex === 0}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Предыдущий урок</span>
          </button>

          <div className="text-sm text-gray-600">
            {lessonIndex + 1} / {subject.lessons.length}
          </div>

          <button
            onClick={onNextLesson}
            disabled={lessonIndex === subject.lessons.length - 1}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>Следующий урок</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}