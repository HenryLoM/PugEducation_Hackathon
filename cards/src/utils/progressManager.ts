import { UserProgress, SubjectProgress, LessonResult } from '../types';

const STORAGE_KEY = 'cs-learning-progress';

export class ProgressManager {
  static getProgress(): UserProgress {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const progress = JSON.parse(stored);
        // Convert date strings back to Date objects
        Object.values(progress.subjects).forEach((subject: any) => {
          if (subject.lastAccessed) {
            subject.lastAccessed = new Date(subject.lastAccessed);
          }
        });
        return progress;
      } catch (error) {
        console.error('Error parsing stored progress:', error);
      }
    }
    
    return {
      subjects: {},
      totalXP: 0,
      completedLessons: [],
    };
  }

  static saveProgress(progress: UserProgress): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }

  static completeLesson(lessonId: string, score: number): void {
    const progress = this.getProgress();
    
    if (!progress.completedLessons.includes(lessonId)) {
      progress.completedLessons.push(lessonId);
      progress.totalXP += Math.floor(score / 10) * 10; // XP based on score
    }

    this.saveProgress(progress);
  }

  static updateSubjectProgress(subjectId: string, lessonId: string): void {
    const progress = this.getProgress();
    
    if (!progress.subjects[subjectId]) {
      progress.subjects[subjectId] = {
        completedLessons: [],
        currentLesson: 0,
        totalScore: 0,
        lastAccessed: new Date(),
      };
    }

    const subjectProgress = progress.subjects[subjectId];
    if (!subjectProgress.completedLessons.includes(lessonId)) {
      subjectProgress.completedLessons.push(lessonId);
    }
    subjectProgress.lastAccessed = new Date();

    this.saveProgress(progress);
  }

  static getLessonResults(lessonId: string): LessonResult | null {
    const results = localStorage.getItem(`lesson-results-${lessonId}`);
    if (results) {
      try {
        const parsed = JSON.parse(results);
        parsed.completedAt = new Date(parsed.completedAt);
        return parsed;
      } catch (error) {
        console.error('Error parsing lesson results:', error);
      }
    }
    return null;
  }

  static saveLessonResults(result: LessonResult): void {
    localStorage.setItem(`lesson-results-${result.lessonId}`, JSON.stringify(result));
  }

  static resetProgress(): void {
    localStorage.removeItem(STORAGE_KEY);
    // Also clear individual lesson results
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('lesson-results-')) {
        localStorage.removeItem(key);
      }
    });
  }

  static getSubjectProgress(subjectId: string): SubjectProgress | undefined {
    const progress = this.getProgress();
    return progress.subjects[subjectId];
  }

  static calculateOverallProgress(): number {
    const progress = this.getProgress();
    const totalLessons = Object.keys(progress.subjects).reduce((total, subjectId) => {
      return total + (progress.subjects[subjectId]?.completedLessons.length || 0);
    }, 0);
    
    return totalLessons > 0 ? Math.round((progress.completedLessons.length / totalLessons) * 100) : 0;
  }
}