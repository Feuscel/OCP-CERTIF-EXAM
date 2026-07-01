import { defineCollection, z } from 'astro:content';

const optionSchema = z.record(z.string(), z.string());

const questionSchema = z
  .object({
    id: z.string(),
    title: z.string(),
    type: z.enum(['single-choice', 'multiple-choice']),
    options: z.array(optionSchema).min(1),
    correct_answers: z.array(z.string()),
    explanation_fr: z.string().default(''),
    explanation_en: z.string().default(''),
  })
  .superRefine((q, ctx) => {
    const labels = q.options.flatMap((o) => Object.keys(o));
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

const exams = defineCollection({
  type: 'content',
  schema: z
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
    }),
});

export const collections = { exams };