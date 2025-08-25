import { MaterialParams, GeneratedMaterial } from '../types';
export const generateMaterial = async (params: MaterialParams): Promise<GeneratedMaterial> => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  const prompt = `Сгенерируй подробный учебный материал по предмету "${params.subject}" на тему "${params.topic}"${params.subtopic ? ` (подтема: "${params.subtopic}")` : ''}. Материал должен полностью раскрывать тему, быть структурированным и понятным. Дополнительные требования: ${params.custom || "нет"}. Ответь строго в формате JSON: {\"material\": \"текст материала\"}`;
  const materialObj = await ollamaChat(prompt, true);
  return {
    material: materialObj.material || '',
    timestamp: new Date(),
    params,
  };
};
import { TaskParams, GeneratedTask } from '../types';
import { ollamaChat } from './ollamaService';


export const generateTask = async (params: TaskParams): Promise<GeneratedTask> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  const prompt = `Сгенерируй задание по предмету \"${params.subject}\" на тему \"${params.topic}\" (подтема: \"${params.subtopic}\") с уровнем сложности \"${params.difficulty}\". Дополнительные требования: ${params.custom || "нет"}. Ответь строго в формате JSON: {\"task\": \"текст задания\"}`;
  const taskObj = await ollamaChat(prompt, true);
  return {
    task: taskObj.task || '',
    requirements: params.custom || '',
    timestamp: new Date(),
    params,
  };
};

// ...удалено: requirements logic, теперь всё через Ollama...