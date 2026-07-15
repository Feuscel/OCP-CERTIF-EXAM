import { describe, it, expect, vi } from 'vitest';
import { shuffle, makeQuestionOrder, makeDisplayOptions } from './shuffle';
import type { QuestionView } from './types';

function makeQ(id: string): QuestionView {
  return {
    id,
    titleFr: `Q ${id}`,
    titleEn: `Q ${id}`,
    type: 'single-choice',
    options: [
      { label: 'A', textFr: 'a', textEn: 'a' },
      { label: 'B', textFr: 'b', textEn: 'b' },
      { label: 'C', textFr: 'c', textEn: 'c' },
    ],
    correctAnswers: ['A'],
    explanationFr: '',
    explanationEn: '',
  };
}

describe('shuffle', () => {
  it('returns same-length array', () => {
    const input = [1, 2, 3, 4, 5];
    const result = shuffle(input);
    expect(result).toHaveLength(input.length);
  });

  it('contains all original elements', () => {
    const input = [1, 2, 3, 4, 5];
    const result = shuffle(input);
    expect(result.sort()).toEqual(input.sort());
  });

  it('does not mutate original array', () => {
    const input = [1, 2, 3];
    const copy = [...input];
    shuffle(input);
    expect(input).toEqual(copy);
  });

  it('handles empty array', () => {
    expect(shuffle([])).toEqual([]);
  });

  it('handles single element', () => {
    expect(shuffle([42])).toEqual([42]);
  });

  it('produces a shuffled result (statistical)', () => {
    const input = Array.from({ length: 100 }, (_, i) => i);
    const result = shuffle(input);
    let sameCount = 0;
    for (let i = 0; i < input.length; i++) {
      if (input[i] === result[i]) sameCount++;
    }
    expect(sameCount).toBeLessThan(100);
  });
});

describe('makeQuestionOrder', () => {
  const qs = [makeQ('q1'), makeQ('q2'), makeQ('q3')];

  it('returns same order when disabled', () => {
    const result = makeQuestionOrder(qs, false);
    expect(result.map(q => q.id)).toEqual(['q1', 'q2', 'q3']);
  });

  it('returns new array reference when disabled', () => {
    const result = makeQuestionOrder(qs, false);
    expect(result).not.toBe(qs);
  });

  it('shuffles when enabled', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    const result = makeQuestionOrder(qs, true);
    expect(result).toHaveLength(qs.length);
    vi.restoreAllMocks();
  });
});

describe('makeDisplayOptions', () => {
  const q = makeQ('q1');

  it('returns A, B, C labels when disabled', () => {
    const result = makeDisplayOptions(q, false);
    expect(result.map(o => o.displayLabel)).toEqual(['A', 'B', 'C']);
  });

  it('preserves originalLabel mapping', () => {
    const result = makeDisplayOptions(q, false);
    expect(result.map(o => o.originalLabel)).toEqual(['A', 'B', 'C']);
  });

  it('carries textFr and textEn', () => {
    const result = makeDisplayOptions(q, false);
    expect(result[0].textFr).toBe('a');
    expect(result[0].textEn).toBe('a');
  });

  it('uses ALPHA prefix then #N for > 16 options', () => {
    const bigQ = makeQ('big');
    bigQ.options = Array.from({ length: 20 }, (_, i) => ({
      label: String.fromCharCode(65 + i),
      textFr: `opt${i}`,
      textEn: `opt${i}`,
    }));
    const result = makeDisplayOptions(bigQ, false);
    expect(result[16].displayLabel).toBe('#17');
    expect(result[19].displayLabel).toBe('#20');
  });
});
