import React, { useState } from 'react';
import { CheckCircle, XCircle, MessageCircle, Code, FileText, HelpCircle } from 'lucide-react';
import { Lesson, Question } from '../types';

interface PracticeSectionProps {
  lesson: Lesson;
  onComplete: (score: number) => void;
  onOllamaRequest: (context: string) => void;
}

export function PracticeSection({ lesson, onComplete, onOllamaRequest }: PracticeSectionProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [showResults, setShowResults] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const question = lesson.practice[currentQuestion];
  const progress = ((currentQuestion + 1) / lesson.practice.length) * 100;

  const handleAnswer = (answer: any) => {
    setAnswers({ ...answers, [question.id]: answer });
  };

  const handleNext = () => {
    if (currentQuestion < lesson.practice.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    const score = calculateScore();
    setShowResults(true);
    setSubmitted(true);
    onComplete(score);
  };

  const calculateScore = () => {
    let correct = 0;
    lesson.practice.forEach((q) => {
      const userAnswer = answers[q.id];
      if (q.type === 'multiple-choice' && userAnswer === q.correctAnswer) {
        correct++;
      } else if (q.type === 'coding' && userAnswer && userAnswer.trim().length > 0) {
        correct++;
      } else if (q.type === 'open-ended' && userAnswer && userAnswer.trim().length > 10) {
        correct++;
      }
    });
    return Math.round((correct / lesson.practice.length) * 100);
  };

  const renderQuestion = (q: Question) => {
    const userAnswer = answers[q.id];
    
    switch (q.type) {
      case 'multiple-choice':
        return (
          <div className="space-y-3">
            {q.options?.map((option, index) => (
              <label
                key={index}
                className={`block p-4 border rounded-lg cursor-pointer transition-colors ${
                  userAnswer === index
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name={`question-${q.id}`}
                  value={index}
                  checked={userAnswer === index}
                  onChange={() => handleAnswer(index)}
                  className="sr-only"
                />
                <span className="text-gray-800">{option}</span>
              </label>
            ))}
          </div>
        );

      case 'coding':
        return (
          <div className="space-y-4">
            {q.codeTemplate && (
              <div className="bg-gray-100 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Шаблон кода:</h4>
                <pre className="text-sm text-gray-800 whitespace-pre-wrap">{q.codeTemplate}</pre>
              </div>
            )}
            <textarea
              value={userAnswer || ''}
              onChange={(e) => handleAnswer(e.target.value)}
              placeholder="Введите ваш код здесь..."
              className="w-full h-40 p-4 border border-gray-300 rounded-lg font-mono text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        );

      case 'open-ended':
        return (
          <textarea
            value={userAnswer || ''}
            onChange={(e) => handleAnswer(e.target.value)}
            placeholder="Введите ваш ответ..."
            className="w-full h-32 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        );

      default:
        return null;
    }
  };

  const getQuestionIcon = (type: string) => {
    switch (type) {
      case 'multiple-choice':
        return <HelpCircle className="w-5 h-5 text-blue-600" />;
      case 'coding':
        return <Code className="w-5 h-5 text-green-600" />;
      case 'open-ended':
        return <FileText className="w-5 h-5 text-purple-600" />;
      default:
        return <HelpCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  if (showResults) {
    const score = calculateScore();
    return (
      <div className="p-6">
        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
            score >= 80 ? 'bg-green-100' : score >= 60 ? 'bg-yellow-100' : 'bg-red-100'
          }`}>
            {score >= 80 ? (
              <CheckCircle className="w-8 h-8 text-green-600" />
            ) : (
              <XCircle className="w-8 h-8 text-red-600" />
            )}
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Тест завершен!
          </h2>
          <p className="text-lg text-gray-600">
            Ваш результат: <span className="font-bold">{score}/100</span>
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Обратная связь от AI:</h3>
          <button
            onClick={() => onOllamaRequest(`Проанализируй мои ответы на тест по теме "${lesson.title}". Мой результат: ${score}%. Дай рекомендации для улучшения.`)}
            className="flex items-center space-x-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Получить анализ результатов от Ollama</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">
            Вопрос {currentQuestion + 1} из {lesson.practice.length}
          </span>
          <span className="text-sm font-medium text-gray-800">{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <div className="flex items-start space-x-3 mb-6">
          {getQuestionIcon(question.type)}
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{question.question}</h3>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span className="capitalize">{question.type.replace('-', ' ')}</span>
              {question.hint && (
                <button
                  onClick={() => onOllamaRequest(`Подсказка для вопроса: ${question.question}. Дай подсказку: ${question.hint}`)}
                  className="text-blue-600 hover:text-blue-700"
                >
                  💡 Подсказка
                </button>
              )}
            </div>
          </div>
          <button
            onClick={() => onOllamaRequest(`Помоги ответить на этот вопрос: ${question.question}`)}
            className="flex items-center space-x-1 px-3 py-1 text-sm text-purple-600 hover:text-purple-700 border border-purple-200 rounded-lg hover:bg-purple-50"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Помощь AI</span>
          </button>
        </div>

        {renderQuestion(question)}
      </div>

      <div className="flex justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ← Назад
        </button>

        <button
          onClick={handleNext}
          disabled={!answers[question.id]}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {currentQuestion === lesson.practice.length - 1 ? 'Завершить' : 'Далее →'}
        </button>
      </div>
    </div>
  );
}