import type { OptionView, QuestionView } from './types';

export function shuffle<T>(input: readonly T[] | T[]): T[] {
  const arr = [...input];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const ALPHA = 'ABCDEFGHIJKLMNOP';

export interface DisplayOption {
  displayLabel: string;
  originalLabel: string;
  text: string;
}

export function makeQuestionOrder(
  questions: readonly QuestionView[],
  enabled: boolean
): QuestionView[] {
  return enabled ? shuffle(questions) : [...questions];
}

export function makeDisplayOptions(question: QuestionView, enabled: boolean): DisplayOption[] {
  const originals = enabled ? shuffle(question.options) : [...question.options];
  return originals.map((o: OptionView, i: number) => ({
    displayLabel: ALPHA[i] ?? `#${i + 1}`,
    originalLabel: o.label,
    text: o.text,
  }));
}