import React, { useState } from 'react';
import { BookOpen, Wand2, Download } from 'lucide-react';
import { TaskParams, GeneratedTask } from '../types';
import { generateTask } from '../services/taskService';

interface TaskGeneratorProps {
  onTaskGenerated: (task: GeneratedTask) => void;
}

export const TaskGenerator: React.FC<TaskGeneratorProps> = ({ onTaskGenerated }) => {
  // --- Задания ---
  const [params, setParams] = useState<TaskParams>({
    subject: '',
    topic: '',
    subtopic: '',
    difficulty: 'Medium',
    custom: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTask, setGeneratedTask] = useState<GeneratedTask | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const subjects = [
    'Математика', 'Русский язык', 'Литература', 'История', 'География',
    'Биология', 'Химия', 'Физика', 'Английский язык', 'Обществознание'
  ];

  const handleGenerate = async () => {
    if (!params.subject || !params.topic) {
      alert('Пожалуйста, заполните обязательные поля: предмет и тему');
      return;
    }
    setIsGenerating(true);
    setErrorMsg(null);
    try {
      const task = await generateTask(params);
      if (!task.task || !task.task.trim()) {
        setErrorMsg('Ollama не вернул текст задания. Попробуйте изменить параметры или проверьте работу Ollama.');
        setGeneratedTask(null);
      } else {
        setGeneratedTask(task);
        onTaskGenerated(task);
      }
    } catch (error: any) {
      setErrorMsg('Ошибка генерации задания: ' + (error?.message || 'Неизвестная ошибка'));
      setGeneratedTask(null);
      console.error('Error generating task:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!generatedTask) return;
    const content = `ЗАДАНИЕ\n\n${generatedTask.task}\n\nТРЕБОВАНИЯ К ОТВЕТУ\n\n${generatedTask.requirements}\n\n---\nСгенерировано: ${generatedTask.timestamp.toLocaleString('ru-RU')}\nПредмет: ${generatedTask.params.subject}\nТема: ${generatedTask.params.topic}\nСложность: ${generatedTask.params.difficulty}`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `задание_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // --- Генерация материала ---

  return (
  <div className="space-y-10">
    {/* --- Генерация заданий --- */}
    <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-100 rounded-lg">
            <BookOpen className="h-6 w-6 text-blue-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">Генерация заданий</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Предмет *
            </label>
            <select
              value={params.subject}
              onChange={(e) => setParams({ ...params, subject: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Выберите предмет</option>
              {subjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Сложность
            </label>
            <select
              value={params.difficulty}
              onChange={(e) => setParams({ ...params, difficulty: e.target.value as TaskParams['difficulty'] })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Easy">Легкий</option>
              <option value="Medium">Средний</option>
              <option value="Hard">Сложный</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Тема *
            </label>
            <input
              type="text"
              value={params.topic}
              onChange={(e) => setParams({ ...params, topic: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Введите тему урока"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Подтема
            </label>
            <input
              type="text"
              value={params.subtopic}
              onChange={(e) => setParams({ ...params, subtopic: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Уточните подтему (опционально)"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Дополнительные требования
          </label>
          <textarea
            value={params.custom}
            onChange={(e) => setParams({ ...params, custom: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
            placeholder="Укажите особые требования к заданию (опционально)"
          />
        </div>

        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="mt-6 w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isGenerating ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            <Wand2 className="h-5 w-5" />
          )}
          {isGenerating ? 'Генерируем...' : 'Сгенерировать задание'}
        </button>
      </div>

      {errorMsg && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
          {errorMsg}
        </div>
      )}
      {generatedTask && (
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Сгенерированное задание</h3>
            <button
              onClick={handleDownload}
              className="text-gray-600 hover:text-gray-800 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Download className="h-5 w-5" />
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Задание:</h4>
              <p className="text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-lg">
                {generatedTask.task}
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Требования к ответу:</h4>
              <p className="text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-lg">
                {generatedTask.requirements}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};