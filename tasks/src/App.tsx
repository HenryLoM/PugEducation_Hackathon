import React, { useState } from 'react';
import { Header } from './components/Header';
import { TaskGenerator } from './components/TaskGenerator';
import { AnswerEvaluator } from './components/AnswerEvaluator';
import { MaterialGenerator } from './components/MaterialGenerator';
import { GeneratedTask } from './types';


type MainMode = 'generation' | 'material' | 'evaluation';

function App() {
  const [mainMode, setMainMode] = useState<MainMode>('generation');
  const [recentTasks, setRecentTasks] = useState<GeneratedTask[]>([]);

  const handleTaskGenerated = (task: GeneratedTask) => {
    setRecentTasks(prev => [task, ...prev.slice(0, 4)]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <div className="mb-6">
              <div className="flex gap-2">
                <button
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${mainMode === 'generation' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-blue-100'}`}
                  onClick={() => setMainMode('generation')}
                >
                  Генерация заданий
                </button>
                <button
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${mainMode === 'evaluation' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-purple-100'}`}
                  onClick={() => setMainMode('evaluation')}
                >
                  Оценка ответов
                </button>
                <button
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${mainMode === 'material' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-green-100'}`}
                  onClick={() => setMainMode('material')}
                >
                  Генерация материалов
                </button>
              </div>
            </div>

            {mainMode === 'generation' && (
              <TaskGenerator onTaskGenerated={handleTaskGenerated} />
            )}
            {mainMode === 'evaluation' && (
              <AnswerEvaluator />
            )}
            {mainMode === 'material' && (
              <MaterialGenerator />
            )}
          </div>

          {recentTasks.length > 0 && mainMode === 'generation' && (
            <div className="w-full lg:w-80">
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
                <h3 className="font-semibold text-gray-800 mb-4">Недавние задания</h3>
                <div className="space-y-3">
                  {recentTasks.map((task, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-xs text-gray-500 mb-1">
                        {task.params.subject} • {task.params.difficulty}
                      </div>
                      <div className="text-sm font-medium text-gray-700 mb-1">
                        {task.params.topic}
                      </div>
                      <div className="text-xs text-gray-600 line-clamp-2">
                        {task.task.substring(0, 100)}...
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="mt-16 bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-gray-600">
          <p className="text-sm">
            PugLab Generator - создано для современного образования
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;