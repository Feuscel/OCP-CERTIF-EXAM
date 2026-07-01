import type { Answers, ExamView, QuestionView } from './types';

export interface QuestionScore {
  questionId: string;
  selected: string[];
  correct: string[];
  precision: number;
  recall: number;
  score: number;
  fullyCorrect: boolean;
  unanswered: boolean;
}

export interface ExamResult {
  totalQuestions: number;
  answeredQuestions: number;
  questionScores: QuestionScore[];
  totalScore: number;
  percent: number;
  passed: boolean;
  threshold: number;
}

export const PASS_THRESHOLD = 0.6;

function scoreQuestion(question: QuestionView, selected: string[]): QuestionScore {
  const correct = question.correctAnswers;
  const selectedSet = new Set(selected);
  const correctSet = new Set(correct);

  const intersection = [...selectedSet].filter((s) => correctSet.has(s)).length;

  const precision = selected.length > 0 ? intersection / selected.length : 0;
  const recall = correct.length > 0 ? intersection / correct.length : 0;

  let score = (precision + recall) / 2;
  if (score < 0) score = 0;
  if (score > 1) score = 1;

  return {
    questionId: question.id,
    selected: [...selected].sort(),
    correct: [...correct].sort(),
    precision,
    recall,
    score,
    fullyCorrect: score >= 1,
    unanswered: selected.length === 0,
  };
}

export function evaluateExam(exam: ExamView, answers: Answers): ExamResult {
  const questionScores = exam.questions.map((q) =>
    scoreQuestion(q, answers[q.id] ?? [])
  );

  const totalScore = questionScores.reduce((sum, qs) => sum + qs.score, 0);
  const totalQuestions = exam.questions.length;
  const percent = totalQuestions > 0 ? totalScore / totalQuestions : 0;
  const answeredQuestions = exam.questions.filter(
    (q) => (answers[q.id]?.length ?? 0) > 0
  ).length;

  return {
    totalQuestions,
    answeredQuestions,
    questionScores,
    totalScore,
    percent,
    passed: percent >= PASS_THRESHOLD,
    threshold: PASS_THRESHOLD,
  };
}

export function formatPercent(p: number): string {
  return `${Math.round(p * 100)}%`;
}

export function formatScore(p: number): string {
  return p.toFixed(2);
}