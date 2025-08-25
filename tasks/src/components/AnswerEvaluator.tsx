import React, { useState } from 'react';
import { CheckCircle, FileText, Download } from 'lucide-react';
import { EvaluationParams, EvaluationResult } from '../types';
import { evaluateAnswer } from '../services/evaluationService';

export const AnswerEvaluator: React.FC = () => {
  const [params, setParams] = useState<EvaluationParams>({
    task: '',
    answer: ''
  });
  
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);

  const handleEvaluate = async () => {
    if (!params.task.trim() || !params.answer.trim()) {
      alert('Пожалуйста, заполните все поля');
      return;
    }

    setIsEvaluating(true);
    try {
      const result = await evaluateAnswer(params);
      setEvaluation(result);
    } catch (error) {
      console.error('Error evaluating answer:', error);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleDownload = () => {
    if (!evaluation) return;
    
    const content = `ОЦЕНКА ОТВЕТА\n\nЗадание:\n${params.task}\n\nОтвет ученика:\n${params.answer}\n\nОЦЕНКА: ${evaluation.score}/5\n\nКОММЕНТАРИИ:\n${evaluation.comments}\n\nЧТО ЗАКРЕПИТЬ:\n${evaluation.reviewTopics.map((topic, index) => `${index + 1}. ${topic}`).join('\n')}\n\n---\nДата оценки: ${evaluation.timestamp.toLocaleString('ru-RU')}`;
    
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `оценка_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getScoreColor = (score: number) => {
    if (score >= 4) return 'text-green-600';
    if (score >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score === 5) return 'Отлично';
    if (score === 4) return 'Хорошо';
    if (score === 3) return 'Удовлетворительно';
    if (score === 2) return 'Неудовлетворительно';
    return 'Плохо';
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-green-100 rounded-lg">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">Оценка ответов</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Задание *
            </label>
            <textarea
              value={params.task}
              onChange={(e) => setParams({ ...params, task: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              rows={4}
              placeholder="Введите текст задания, которое выполнял ученик"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ответ ученика *
            </label>
            <textarea
              value={params.answer}
              onChange={(e) => setParams({ ...params, answer: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              rows={6}
              placeholder="Вставьте ответ ученика для оценки"
              required
            />
          </div>
        </div>

        <button
          onClick={handleEvaluate}
          disabled={isEvaluating}
          className="mt-6 w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isEvaluating ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            <FileText className="h-5 w-5" />
          )}
          {isEvaluating ? 'Оцениваем...' : 'Оценить ответ'}
        </button>
      </div>

      {evaluation && (
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Результат оценки</h3>
            <button
              onClick={handleDownload}
              className="text-gray-600 hover:text-gray-800 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Download className="h-5 w-5" />
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="text-center">
                <div className={`text-3xl font-bold ${getScoreColor(evaluation.score)}`}>
                  {evaluation.score}/5
                </div>
                <div className={`text-sm font-medium ${getScoreColor(evaluation.score)}`}>
                  {getScoreLabel(evaluation.score)}
                </div>
              </div>
              <div className="flex-1 grid grid-cols-5 gap-1">
                {[1, 2, 3, 4, 5].map(i => (
                  <div
                    key={i}
                    className={`h-3 rounded ${
                      i <= evaluation.score ? 'bg-blue-500' : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Комментарии:</h4>
              <p className="text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-lg">
                {evaluation.comments}
              </p>
            </div>
            
            {evaluation.reviewTopics.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Что закрепить:</h4>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <ul className="space-y-1">
                    {evaluation.reviewTopics.map((topic, index) => (
                      <li key={index} className="text-gray-700 flex items-start gap-2">
                        <span className="font-medium text-yellow-600">{index + 1}.</span>
                        {topic}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};