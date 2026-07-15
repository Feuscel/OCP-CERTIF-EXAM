import { describe, it, expect } from 'vitest';
import { z } from 'zod';

const optionSchema = z.object({
  label: z.string(),
  text_fr: z.string(),
  text_en: z.string(),
});

const questionSchema = z
  .object({
    id: z.string(),
    title_fr: z.string(),
    title_en: z.string(),
    type: z.enum(['single-choice', 'multiple-choice']),
    options: z.array(optionSchema).min(1),
    correct_answers: z.array(z.string()),
    explanation_fr: z.string().default(''),
    explanation_en: z.string().default(''),
  })
  .superRefine((q, ctx) => {
    const labels = q.options.map((o) => o.label);
    const dup = labels.find((l, i) => labels.indexOf(l) !== i);
    if (dup) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Duplicate option label "${dup}" in question ${q.id}`,
      });
    }
    for (const a of q.correct_answers) {
      if (!labels.includes(a)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `correct_answers references unknown option "${a}" in question ${q.id}`,
        });
      }
    }
    if (q.type === 'single-choice' && q.correct_answers.length !== 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `single-choice question ${q.id} must have exactly 1 correct answer`,
      });
    }
    if (q.type === 'multiple-choice' && q.correct_answers.length < 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `multiple-choice question ${q.id} must have at least 1 correct answer`,
      });
    }
  });

const examSchema = z
  .object({
    id: z.string(),
    title: z.string(),
    lang: z.enum(['fr', 'en']),
    duration_minutes: z.number().int().positive(),
    shuffle_questions: z.boolean(),
    shuffle_options: z.boolean(),
    difficulty: z.enum(['easy', 'medium', 'hard', 'mixed']),
    tags: z.array(z.string()).default([]),
    questions: z.array(questionSchema).min(1),
  })
  .superRefine((e, ctx) => {
    const ids = e.questions.map((q) => q.id);
    const dup = ids.find((id, i) => ids.indexOf(id) !== i);
    if (dup) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Duplicate question id "${dup}" in exam ${e.id}`,
      });
    }
  });

function validQuestion(overrides: Record<string, unknown> = {}) {
  return {
    id: 'q1',
    title_fr: 'Question?',
    title_en: 'Question?',
    type: 'single-choice' as const,
    options: [
      { label: 'A', text_fr: 'a', text_en: 'a' },
      { label: 'B', text_fr: 'b', text_en: 'b' },
    ],
    correct_answers: ['A'],
    ...overrides,
  };
}

function validExam(overrides: Record<string, unknown> = {}) {
  return {
    id: 'ch01',
    title: 'Chapter 1',
    lang: 'en' as const,
    duration_minutes: 30,
    shuffle_questions: true,
    shuffle_options: true,
    difficulty: 'medium' as const,
    tags: ['oop'],
    questions: [validQuestion()],
    ...overrides,
  };
}

describe('questionSchema', () => {
  it('accepts valid question', () => {
    expect(questionSchema.safeParse(validQuestion()).success).toBe(true);
  });

  it('rejects duplicate option labels', () => {
    const q = validQuestion({
      options: [
        { label: 'A', text_fr: 'a', text_en: 'a' },
        { label: 'A', text_fr: 'b', text_en: 'b' },
      ],
    });
    const result = questionSchema.safeParse(q);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('Duplicate option label');
    }
  });

  it('rejects correct_answers referencing unknown label', () => {
    const q = validQuestion({ correct_answers: ['Z'] });
    const result = questionSchema.safeParse(q);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('unknown option');
    }
  });

  it('rejects single-choice with 0 correct answers', () => {
    const q = validQuestion({ type: 'single-choice', correct_answers: [] });
    const result = questionSchema.safeParse(q);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('exactly 1');
    }
  });

  it('rejects single-choice with 2 correct answers', () => {
    const q = validQuestion({
      type: 'single-choice',
      correct_answers: ['A', 'B'],
    });
    const result = questionSchema.safeParse(q);
    expect(result.success).toBe(false);
  });

  it('accepts multiple-choice with 2 correct answers', () => {
    const q = validQuestion({
      type: 'multiple-choice',
      correct_answers: ['A', 'B'],
    });
    expect(questionSchema.safeParse(q).success).toBe(true);
  });

  it('rejects multiple-choice with 0 correct answers', () => {
    const q = validQuestion({
      type: 'multiple-choice',
      correct_answers: [],
    });
    const result = questionSchema.safeParse(q);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('at least 1');
    }
  });

  it('rejects empty options', () => {
    const q = validQuestion({ options: [] });
    expect(questionSchema.safeParse(q).success).toBe(false);
  });
});

describe('examSchema', () => {
  it('accepts valid exam', () => {
    expect(examSchema.safeParse(validExam()).success).toBe(true);
  });

  it('rejects duplicate question ids', () => {
    const e = validExam({
      questions: [validQuestion({ id: 'q1' }), validQuestion({ id: 'q1' })],
    });
    const result = examSchema.safeParse(e);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('Duplicate question id');
    }
  });

  it('rejects empty questions array', () => {
    const e = validExam({ questions: [] });
    expect(examSchema.safeParse(e).success).toBe(false);
  });

  it('rejects invalid difficulty', () => {
    const e = validExam({ difficulty: 'super-hard' });
    expect(examSchema.safeParse(e).success).toBe(false);
  });

  it('rejects invalid lang', () => {
    const e = validExam({ lang: 'de' });
    expect(examSchema.safeParse(e).success).toBe(false);
  });

  it('rejects non-positive duration', () => {
    const e = validExam({ duration_minutes: 0 });
    expect(examSchema.safeParse(e).success).toBe(false);
  });

  it('defaults tags to empty array', () => {
    const e = validExam();
    delete e.tags;
    const result = examSchema.safeParse(e);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.tags).toEqual([]);
    }
  });
});
