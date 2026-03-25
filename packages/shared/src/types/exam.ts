export interface ExamSession {
  id: string;
  userId: string;
  startedAt: string;
  finishedAt?: string;
  timeLimitSec: number;
  score?: number;
  totalQuestions: number;
  passed?: boolean;
}

export interface ExamAnswer {
  id: number;
  sessionId: string;
  questionId: number;
  selectedChoice?: 'a' | 'b' | 'c' | 'd';
  isCorrect?: boolean;
  timeSpentMs?: number;
}
