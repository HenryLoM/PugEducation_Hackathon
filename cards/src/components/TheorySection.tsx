import React, { useState } from 'react';
import { MessageCircle, Code2, FileText, Image } from 'lucide-react';
import { Lesson, TheorySection as TheorySectionType } from '../types';

interface TheorySectionProps {
  lesson: Lesson;
  onOllamaRequest: (context: string) => void;
}

export function TheorySection({ lesson, onOllamaRequest }: TheorySectionProps) {
  const [activeSection, setActiveSection] = useState(0);

  const renderContent = (section: TheorySectionType) => {
    switch (section.type) {
      case 'code':
        return (
          <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Code2 className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-400">
                  {section.codeLanguage || 'Python'}
                </span>
              </div>
              <button
                onClick={() => onOllamaRequest(`Объясни этот код: ${section.content}`)}
                className="text-xs text-blue-400 hover:text-blue-300 flex items-center space-x-1"
              >
                <MessageCircle className="w-3 h-3" />
                <span>Объяснить код</span>
              </button>
            </div>
            <pre className="text-green-400 text-sm">
              <code>{section.content}</code>
            </pre>
          </div>
        );
      
      case 'diagram':
        return (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Image className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-blue-800">Диаграмма</span>
              </div>
              <button
                onClick={() => onOllamaRequest(`Объясни эту диаграмму: ${section.content}`)}
                className="text-sm text-blue-600 hover:text-blue-700 flex items-center space-x-1"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Объяснить</span>
              </button>
            </div>
            <div className="text-blue-800 whitespace-pre-wrap">{section.content}</div>
          </div>
        );
      
      default:
        return (
          <div className="prose max-w-none">
            <div 
              className="text-gray-700 leading-relaxed whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: section.content }}
            />
          </div>
        );
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-1/4">
          <h3 className="font-semibold text-gray-800 mb-4">Разделы урока</h3>
          <div className="space-y-2">
            {lesson.theory.map((section, index) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(index)}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  activeSection === index
                    ? 'bg-blue-100 text-blue-800 border border-blue-200'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center space-x-2">
                  {section.type === 'code' ? (
                    <Code2 className="w-4 h-4" />
                  ) : section.type === 'diagram' ? (
                    <Image className="w-4 h-4" />
                  ) : (
                    <FileText className="w-4 h-4" />
                  )}
                  <span className="text-sm font-medium">{section.title}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="lg:w-3/4">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {lesson.theory[activeSection]?.title}
              </h2>
              <button
                onClick={() => onOllamaRequest(`Расскажи подробнее о теме: ${lesson.theory[activeSection]?.title}`)}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Объяснить с помощью Ollama</span>
              </button>
            </div>

            {lesson.theory[activeSection] && renderContent(lesson.theory[activeSection])}
          </div>
        </div>
      </div>
    </div>
  );
}