import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle, Bot, User, AlertCircle } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface OllamaChatProps {
  context?: string;
  lessonTitle: string;
}

export function OllamaChat({ context, lessonTitle }: OllamaChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [ollamaConnected, setOllamaConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    checkOllamaConnection();
    if (context) {
      addMessage('assistant', `Привет! Я готов помочь тебе с темой "${lessonTitle}". ${context ? `Контекст: ${context}` : ''}`);
    }
  }, [context, lessonTitle]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const checkOllamaConnection = async () => {
    try {
      const response = await fetch('http://localhost:11434/api/tags');
      setOllamaConnected(response.ok);
    } catch (error) {
      setOllamaConnected(false);
    }
  };

  const addMessage = (type: 'user' | 'assistant', content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    addMessage('user', userMessage);
    setIsLoading(true);

    try {
      if (!ollamaConnected) {
        throw new Error('Ollama не подключен');
      }

      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama3', // или другая доступная модель
          prompt: `Ты - AI помощник для изучения программирования. Отвечай на русском языке. Контекст урока: "${lessonTitle}". ${context ? `Дополнительный контекст: ${context}` : ''}\n\nВопрос студента: ${userMessage}`,
          stream: false,
        }),
      });

      if (!response.ok) {
        throw new Error('Ошибка запроса к Ollama');
      }

      const data = await response.json();
      addMessage('assistant', data.response || 'Извините, не удалось получить ответ.');
    } catch (error) {
      console.error('Error calling Ollama:', error);
      addMessage('assistant', 'Извините, произошла ошибка при обращении к AI. Убедитесь, что Ollama запущен на localhost:11434 и доступна модель llama3.');
    } finally {
      setIsLoading(false);
    }
  };

  const quickQuestions = [
    'Объясни основные концепции этого урока',
    'Дай мне 3 дополнительные задачи для практики',
    'Какие ошибки часто делают новички в этой теме?',
    'Покажи реальные примеры применения',
  ];

  return (
    <div className="flex flex-col h-[600px] p-6">
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <Bot className="w-6 h-6 text-purple-600 mr-2" />
            AI Помощник Ollama
          </h2>
          <div className={`flex items-center space-x-2 text-sm ${
            ollamaConnected ? 'text-green-600' : 'text-red-600'
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              ollamaConnected ? 'bg-green-500' : 'bg-red-500'
            }`}></div>
            <span>{ollamaConnected ? 'Подключен' : 'Не подключен'}</span>
          </div>
        </div>
        <p className="text-gray-600 text-sm mt-1">
          Урок: {lessonTitle}
        </p>
      </div>

      {!ollamaConnected && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-yellow-800">Ollama не подключен</h3>
              <p className="text-sm text-yellow-700 mt-1">
                Для использования AI помощника установите Ollama и запустите его на localhost:11434
              </p>
              <p className="text-xs text-yellow-600 mt-2">
                Инструкции: <code>ollama serve</code> и <code>ollama pull llama3</code>
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 bg-gray-50 rounded-lg p-4 overflow-y-auto mb-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Начните диалог с AI помощником!</p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start space-x-3 mb-4 ${
              message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
            }`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              message.type === 'user' ? 'bg-blue-500' : 'bg-purple-500'
            }`}>
              {message.type === 'user' ? (
                <User className="w-4 h-4 text-white" />
              ) : (
                <Bot className="w-4 h-4 text-white" />
              )}
            </div>
            <div className={`flex-1 ${message.type === 'user' ? 'text-right' : ''}`}>
              <div className={`inline-block max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.type === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-800 border border-gray-200'
              }`}>
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-start space-x-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-white border border-gray-200 rounded-lg px-4 py-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {messages.length === 0 && (
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">Быстрые вопросы:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {quickQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => setInput(question)}
                className="text-left p-2 text-sm text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex space-x-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Задайте вопрос AI помощнику..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          disabled={isLoading || !ollamaConnected}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim() || !ollamaConnected}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}