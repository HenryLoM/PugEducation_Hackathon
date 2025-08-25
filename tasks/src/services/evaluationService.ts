import { EvaluationParams, EvaluationResult } from '../types';
import { ollamaChat } from './ollamaService';

export const evaluateAnswer = async (params: EvaluationParams): Promise<EvaluationResult> => {
  // Формируем промпт для Ollama
  const prompt = `Оцени ответ ученика на вопрос. Верни JSON вида: {"score": число от 1 до 5, "comments": "строка", "reviewTopics": ["строка", ...]}.\n\nВопрос: ${params.question}\n\nОтвет ученика: ${params.answer}`;
  const result = await ollamaChat(prompt, true);
  return {
    score: result.score,
    comments: result.comments,
    reviewTopics: Array.isArray(result.reviewTopics) ? result.reviewTopics.slice(0, 3) : [],
    timestamp: new Date()
  };
};