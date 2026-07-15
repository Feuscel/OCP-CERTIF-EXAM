import { describe, it, expect } from 'vitest';
import {
  evaluateExam,
  formatPercent,
  formatScore,
  PASS_THRESHOLD,
} from './scoring';
import type { ExamView, QuestionView } from './types';

function makeQuestion(overrides: Partial<QuestionView> & { id: string; correctAnswers: string[] }): QuestionView {
  return {
    titleFr: '',
    titleEn: '',
    type: 'single-choice',
    options: [],
    explanationFr: '',
    explanationEn: '',
    ...overrides,
  };
}

function makeExam(questions: QuestionView[], overrides: Partial<ExamView> = {}): ExamView {
  return {
    id: 'exam-test',
    title: 'Test Exam',
    lang: 'en',
    durationMinutes: 10,
    shuffleQuestions: false,
    shuffleOptions: false,
    difficulty: 'easy',
    tags: [],
    questions,
    ...overrides,
  };
}

describe('PASS_THRESHOLD', () => {
  it('equals 0.6', () => {
    expect(PASS_THRESHOLD).toBe(0.6);
  });
});

describe('evaluateExam', () => {
  describe('single-choice questions', () => {
    it('scores 1.0 when correct answer is selected', () => {
      const q = makeQuestion({
        id: 'q1',
        type: 'single-choice',
        correctAnswers: ['A'],
      });
      const exam = makeExam([q]);
      const result = evaluateExam(exam, { q1: ['A'] });

      expect(result.questionScores[0].score).toBe(1);
      expect(result.questionScores[0].fullyCorrect).toBe(true);
      expect(result.questionScores[0].unanswered).toBe(false);
    });

    it('scores 0.0 when wrong answer is selected', () => {
      const q = makeQuestion({
        id: 'q1',
        type: 'single-choice',
        correctAnswers: ['A'],
      });
      const exam = makeExam([q]);
      const result = evaluateExam(exam, { q1: ['B'] });

      expect(result.questionScores[0].score).toBe(0);
      expect(result.questionScores[0].precision).toBe(0);
      expect(result.questionScores[0].recall).toBe(0);
    });

    it('scores 0.0 when unanswered', () => {
      const q = makeQuestion({
        id: 'q1',
        type: 'single-choice',
        correctAnswers: ['A'],
      });
      const exam = makeExam([q]);
      const result = evaluateExam(exam, {});

      expect(result.questionScores[0].score).toBe(0);
      expect(result.questionScores[0].unanswered).toBe(true);
    });
  });

  describe('multiple-choice questions', () => {
    it('scores 1.0 when all correct answers are selected and nothing else', () => {
      const q = makeQuestion({
        id: 'q1',
        type: 'multiple-choice',
        correctAnswers: ['A', 'C'],
      });
      const exam = makeExam([q]);
      const result = evaluateExam(exam, { q1: ['A', 'C'] });

      expect(result.questionScores[0].score).toBe(1);
      expect(result.questionScores[0].fullyCorrect).toBe(true);
    });

    it('gives partial credit when some correct answers are selected', () => {
      const q = makeQuestion({
        id: 'q1',
        type: 'multiple-choice',
        correctAnswers: ['A', 'B', 'C'],
      });
      const exam = makeExam([q]);
      const result = evaluateExam(exam, { q1: ['A'] });

      const precision = 1 / 1; // 1 correct selected out of 1 selected
      const recall = 1 / 3; // 1 correct selected out of 3 correct
      const expected = (precision + recall) / 2;

      expect(result.questionScores[0].score).toBeCloseTo(expected, 10);
      expect(result.questionScores[0].fullyCorrect).toBe(false);
    });

    it('penalizes selecting wrong answers', () => {
      const q = makeQuestion({
        id: 'q1',
        type: 'multiple-choice',
        correctAnswers: ['A', 'B'],
      });
      const exam = makeExam([q]);
      const result = evaluateExam(exam, { q1: ['A', 'C'] });

      const precision = 1 / 2; // 1 correct out of 2 selected
      const recall = 1 / 2; // 1 correct out of 2 correct
      const expected = (precision + recall) / 2;

      expect(result.questionScores[0].score).toBeCloseTo(expected, 10);
    });

    it('scores 0.0 when only wrong answers are selected', () => {
      const q = makeQuestion({
        id: 'q1',
        type: 'multiple-choice',
        correctAnswers: ['A', 'B'],
      });
      const exam = makeExam([q]);
      const result = evaluateExam(exam, { q1: ['C', 'D'] });

      expect(result.questionScores[0].score).toBe(0);
      expect(result.questionScores[0].precision).toBe(0);
      expect(result.questionScores[0].recall).toBe(0);
    });
  });

  describe('precision and recall', () => {
    it('calculates precision = |U∩C| / |U|', () => {
      const q = makeQuestion({
        id: 'q1',
        type: 'multiple-choice',
        correctAnswers: ['A', 'B', 'C'],
      });
      const exam = makeExam([q]);
      const result = evaluateExam(exam, { q1: ['A', 'D'] });

      expect(result.questionScores[0].precision).toBeCloseTo(0.5, 10);
    });

    it('calculates recall = |U∩C| / |C|', () => {
      const q = makeQuestion({
        id: 'q1',
        type: 'multiple-choice',
        correctAnswers: ['A', 'B', 'C'],
      });
      const exam = makeExam([q]);
      const result = evaluateExam(exam, { q1: ['A'] });

      expect(result.questionScores[0].recall).toBeCloseTo(1 / 3, 10);
    });
  });

  describe('exam-level evaluation', () => {
    it('computes percent as totalScore / totalQuestions', () => {
      const q1 = makeQuestion({ id: 'q1', correctAnswers: ['A'] });
      const q2 = makeQuestion({ id: 'q2', correctAnswers: ['B'] });
      const exam = makeExam([q1, q2]);
      const result = evaluateExam(exam, { q1: ['A'], q2: [] });

      expect(result.percent).toBeCloseTo(0.5, 10);
      expect(result.totalQuestions).toBe(2);
      expect(result.answeredQuestions).toBe(1);
    });

    it('passes when percent >= PASS_THRESHOLD', () => {
      const q1 = makeQuestion({ id: 'q1', correctAnswers: ['A'] });
      const q2 = makeQuestion({ id: 'q2', correctAnswers: ['B'] });
      const q3 = makeQuestion({ id: 'q3', correctAnswers: ['C'] });
      const exam = makeExam([q1, q2, q3]);
      const result = evaluateExam(exam, { q1: ['A'], q2: ['B'], q3: [] });

      expect(result.percent).toBeCloseTo(2 / 3, 10);
      expect(result.passed).toBe(true);
    });

    it('fails when percent < PASS_THRESHOLD', () => {
      const q1 = makeQuestion({ id: 'q1', correctAnswers: ['A'] });
      const q2 = makeQuestion({ id: 'q2', correctAnswers: ['B'] });
      const q3 = makeQuestion({ id: 'q3', correctAnswers: ['C'] });
      const exam = makeExam([q1, q2, q3]);
      const result = evaluateExam(exam, { q1: ['A'], q2: [], q3: [] });

      expect(result.percent).toBeCloseTo(1 / 3, 10);
      expect(result.passed).toBe(false);
    });

    it('handles empty answers record gracefully', () => {
      const q1 = makeQuestion({ id: 'q1', correctAnswers: ['A'] });
      const exam = makeExam([q1]);
      const result = evaluateExam(exam, {});

      expect(result.percent).toBe(0);
      expect(result.passed).toBe(false);
      expect(result.answeredQuestions).toBe(0);
    });

    it('returns threshold = PASS_THRESHOLD', () => {
      const exam = makeExam([]);
      const result = evaluateExam(exam, {});

      expect(result.threshold).toBe(PASS_THRESHOLD);
    });
  });

  describe('selected answers ordering', () => {
    it('returns sorted selected and correct arrays', () => {
      const q = makeQuestion({
        id: 'q1',
        type: 'multiple-choice',
        correctAnswers: ['C', 'A'],
      });
      const exam = makeExam([q]);
      const result = evaluateExam(exam, { q1: ['C', 'A'] });

      expect(result.questionScores[0].selected).toEqual(['A', 'C']);
      expect(result.questionScores[0].correct).toEqual(['A', 'C']);
    });
  });
});

describe('formatPercent', () => {
  it('formats 0 as "0%"', () => {
    expect(formatPercent(0)).toBe('0%');
  });

  it('formats 0.5 as "50%"', () => {
    expect(formatPercent(0.5)).toBe('50%');
  });

  it('formats 1 as "100%"', () => {
    expect(formatPercent(1)).toBe('100%');
  });

  it('rounds 0.657 to "66%"', () => {
    expect(formatPercent(0.657)).toBe('66%');
  });

  it('rounds 0.333 to "33%"', () => {
    expect(formatPercent(0.333)).toBe('33%');
  });
});

describe('formatScore', () => {
  it('formats 0 as "0.00"', () => {
    expect(formatScore(0)).toBe('0.00');
  });

  it('formats 1 as "1.00"', () => {
    expect(formatScore(1)).toBe('1.00');
  });

  it('formats 0.333 as "0.33"', () => {
    expect(formatScore(0.333)).toBe('0.33');
  });

  it('formats 0.666 as "0.67"', () => {
    expect(formatScore(0.666)).toBe('0.67');
  });
});
