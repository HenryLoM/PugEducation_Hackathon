import React, { useState, useEffect } from 'react';
import { Book, Globe, Database, Network, Code, User, Trophy, Clock, Star, MessageCircle, ChevronRight } from 'lucide-react';
import { Subject } from './types';
import { SubjectCard } from './components/SubjectCard';
import { LessonView } from './components/LessonView';
import { Header } from './components/Header';
import { ProgressManager } from './utils/progressManager';
import { subjects } from './data/subjects';

function App() {
  const [currentSubject, setCurrentSubject] = useState<Subject | null>(null);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [userProgress, setUserProgress] = useState(ProgressManager.getProgress());
  const [userName] = useState('Студент');

  useEffect(() => {
    const progress = ProgressManager.getProgress();
    setUserProgress(progress);
  }, []);

  const handleSubjectSelect = (subject: Subject) => {
    setCurrentSubject(subject);
    setCurrentLessonIndex(0);
  };

  const handleBackToHome = () => {
    setCurrentSubject(null);
    setCurrentLessonIndex(0);
  };

  const handleLessonComplete = (lessonId: string, score: number) => {
    ProgressManager.completeLesson(lessonId, score);
    setUserProgress(ProgressManager.getProgress());
  };

  const handleNextLesson = () => {
    if (currentSubject && currentLessonIndex < currentSubject.lessons.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1);
    }
  };

  const handlePreviousLesson = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1);
    }
  };

  if (currentSubject) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        <Header userName={userName} onBackToHome={handleBackToHome} />
        <LessonView
          subject={currentSubject}
          lessonIndex={currentLessonIndex}
          userProgress={userProgress}
          onLessonComplete={handleLessonComplete}
          onNextLesson={handleNextLesson}
          onPreviousLesson={handlePreviousLesson}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <Header userName={userName} />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Code className="w-12 h-12 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-800">Центр обучения</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Выбери предмет и начни изучение! Твой мопс будет рад новым знаниям.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject) => (
            <SubjectCard
              key={subject.id}
              subject={subject}
              progress={userProgress.subjects[subject.id]}
              onSelect={handleSubjectSelect}
            />
          ))}
        </div>

        <div className="mt-16 bg-white rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <MessageCircle className="w-6 h-6 text-purple-600 mr-3" />
            Интеграция с Ollama AI
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-700 mb-3">Возможности AI-помощника:</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Объяснение сложных концепций</li>
                <li>• Отладка и анализ кода</li>
                <li>• Генерация дополнительных задач</li>
                <li>• Персонализированные рекомендации</li>
              </ul>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <h4 className="font-semibold text-purple-800 mb-2">Примеры запросов:</h4>
              <div className="text-sm text-purple-700 space-y-1">
                <p>"Объясни разницу между списком и кортежем"</p>
                <p>"Сгенерируй 5 задач по циклам"</p>
                <p>"Проверь правильность моего кода"</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;