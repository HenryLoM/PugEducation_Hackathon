import React, { useState } from 'react';
import { FileText, Wand2, Download } from 'lucide-react';
import { MaterialParams, GeneratedMaterial } from '../types';
import { generateMaterial } from '../services/taskService';

const subjects = [
  'Математика', 'Русский язык', 'Литература', 'История', 'География',
  'Биология', 'Химия', 'Физика', 'Английский язык', 'Обществознание'
];

export const MaterialGenerator: React.FC = () => {
  const [matParams, setMatParams] = useState<MaterialParams>({
    subject: '',
    topic: '',
    subtopic: '',
    custom: ''
  });
  const [isMatGenerating, setIsMatGenerating] = useState(false);
  const [generatedMaterial, setGeneratedMaterial] = useState<GeneratedMaterial | null>(null);
  const [matErrorMsg, setMatErrorMsg] = useState<string | null>(null);

  const handleMaterialGenerate = async () => {
    if (!matParams.subject || !matParams.topic) {
      alert('Пожалуйста, заполните обязательные поля: предмет и тему');
      return;
    }
    setIsMatGenerating(true);
    setMatErrorMsg(null);
    try {
      const material = await generateMaterial(matParams);
      if (!material.material || !material.material.trim()) {
        setMatErrorMsg('Ollama не вернул материал. Попробуйте изменить параметры или проверьте работу Ollama.');
        setGeneratedMaterial(null);
      } else {
        setGeneratedMaterial(material);
      }
    } catch (error: any) {
      setMatErrorMsg('Ошибка генерации материала: ' + (error?.message || 'Неизвестная ошибка'));
      setGeneratedMaterial(null);
      console.error('Error generating material:', error);
    } finally {
      setIsMatGenerating(false);
    }
  };

  const handleMaterialDownload = () => {
    if (!generatedMaterial) return;
    const content = `МАТЕРИАЛ\n\n${generatedMaterial.material}\n\n---\nСгенерировано: ${generatedMaterial.timestamp.toLocaleString('ru-RU')}\nПредмет: ${generatedMaterial.params.subject}\nТема: ${generatedMaterial.params.topic}`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `материал_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-10">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-green-100 rounded-lg">
          <FileText className="h-6 w-6 text-green-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-800">Генерация учебного материала</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Предмет *</label>
          <select
            value={matParams.subject}
            onChange={e => setMatParams({ ...matParams, subject: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            required
          >
            <option value="">Выберите предмет</option>
            {subjects.map(subject => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>
        </div>
        <div></div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Тема *</label>
          <input
            type="text"
            value={matParams.topic}
            onChange={e => setMatParams({ ...matParams, topic: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Введите тему урока"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Подтема</label>
          <input
            type="text"
            value={matParams.subtopic}
            onChange={e => setMatParams({ ...matParams, subtopic: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Уточните подтему (опционально)"
          />
        </div>
      </div>
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Дополнительные требования</label>
        <textarea
          value={matParams.custom}
          onChange={e => setMatParams({ ...matParams, custom: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          rows={3}
          placeholder="Укажите особые требования к материалу (опционально)"
        />
      </div>
      <button
        onClick={handleMaterialGenerate}
        disabled={isMatGenerating}
        className="mt-6 w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isMatGenerating ? (
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
        ) : (
          <Wand2 className="h-5 w-5" />
        )}
        {isMatGenerating ? 'Генерируем...' : 'Сгенерировать материал'}
      </button>
      {matErrorMsg && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4 mt-2">
          {matErrorMsg}
        </div>
      )}
      {generatedMaterial && (
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500 mt-4">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Сгенерированный материал</h3>
            <button
              onClick={handleMaterialDownload}
              className="text-gray-600 hover:text-gray-800 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Download className="h-5 w-5" />
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Материал:</h4>
          <p className="text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-lg" 
            dangerouslySetInnerHTML={{ __html: generatedMaterial.material.replace(/\n/g, '<br/>') }}>
          </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
