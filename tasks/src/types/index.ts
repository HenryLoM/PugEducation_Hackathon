export interface MaterialParams {
  subject: string;
  topic: string;
  subtopic: string;
  custom: string;
}

export interface GeneratedMaterial {
  material: string;
  timestamp: Date;
  params: MaterialParams;
}
export interface TaskParams {
  subject: string;
  topic: string;
  subtopic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  custom: string;
}

export interface GeneratedTask {
  task: string;
  requirements: string;
  timestamp: Date;
  params: TaskParams;
}

export interface EvaluationParams {
  task: string;
  answer: string;
  question: string;
}

export interface EvaluationResult {
  score: number;
  comments: string;
  reviewTopics: string[];
  timestamp: Date;
}

export type AppMode = 'generation' | 'evaluation';