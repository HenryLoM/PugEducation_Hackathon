export interface Subject {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  lessons: Lesson[];
  estimatedMinutes: number;
  difficulty: 'Легко' | 'Средне' | 'Сложно';
  xpReward: number;
}

export interface Lesson {
  id: string;
  title: string;
  theory: TheorySection[];
  practice: Question[];
}

export interface TheorySection {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'code' | 'diagram';
  codeLanguage?: string;
}

export interface Question {
  id: string;
  type: 'multiple-choice' | 'coding' | 'open-ended';
  question: string;
  options?: string[];
  correctAnswer?: string | number;
  codeTemplate?: string;
  explanation: string;
  hint?: string;
}

export interface UserProgress {
  subjects: Record<string, SubjectProgress>;
  totalXP: number;
  completedLessons: string[];
}

export interface SubjectProgress {
  completedLessons: string[];
  currentLesson: number;
  totalScore: number;
  lastAccessed: Date;
}

export interface LessonResult {
  lessonId: string;
  score: number;
  answers: Record<string, any>;
  completedAt: Date;
}