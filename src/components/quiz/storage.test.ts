import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  loadAttempts,
  saveAttempt,
  clearAttempts,
  loadSettings,
  saveSettings,
  summarizeAttempts,
  ATTEMPTS_KEY,
  SETTINGS_KEY,
} from './storage';
import type { Attempt, ExamSettings } from './storage';

function makeAttempt(overrides: Partial<Attempt> = {}): Attempt {
  return {
    id: 'a1',
    timestamp: Date.now(),
    examId: 'ch01',
    examTitle: 'Chapter 1',
    durationSeconds: 120,
    scorePercent: 75,
    passed: true,
    questionCount: 10,
    answeredCount: 10,
    ...overrides,
  };
}

const store = new Map<string, string>();

beforeEach(() => {
  store.clear();
  vi.stubGlobal('localStorage', {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => { store.set(key, value); },
    removeItem: (key: string) => { store.delete(key); },
    clear: () => store.clear(),
    get length() { return store.size; },
    key: (i: number) => [...store.keys()][i] ?? null,
  });
});

describe('loadAttempts', () => {
  it('returns empty array when localStorage is empty', () => {
    expect(loadAttempts()).toEqual([]);
  });

  it('returns parsed attempts from localStorage', () => {
    const attempts = [makeAttempt(), makeAttempt({ id: 'a2' })];
    store.set(ATTEMPTS_KEY, JSON.stringify(attempts));
    expect(loadAttempts()).toHaveLength(2);
  });

  it('returns empty array on corrupted data', () => {
    store.set(ATTEMPTS_KEY, 'not-json');
    expect(loadAttempts()).toEqual([]);
  });

  it('returns empty array on invalid structure', () => {
    store.set(ATTEMPTS_KEY, JSON.stringify([{ bad: true }]));
    expect(loadAttempts()).toEqual([]);
  });
});

describe('saveAttempt', () => {
  it('prepends attempt to list', () => {
    const a1 = makeAttempt({ id: 'a1' });
    const a2 = makeAttempt({ id: 'a2' });
    saveAttempt(a1);
    const result = saveAttempt(a2);
    expect(result[0].id).toBe('a2');
    expect(result[1].id).toBe('a1');
  });

  it('persists to localStorage', () => {
    const a = makeAttempt();
    saveAttempt(a);
    const stored = JSON.parse(store.get(ATTEMPTS_KEY)!);
    expect(stored).toHaveLength(1);
  });
});

describe('clearAttempts', () => {
  it('removes attempts key from localStorage', () => {
    store.set(ATTEMPTS_KEY, JSON.stringify([makeAttempt()]));
    clearAttempts();
    expect(store.has(ATTEMPTS_KEY)).toBe(false);
  });
});

describe('loadSettings', () => {
  it('returns default fr when empty', () => {
    expect(loadSettings()).toEqual({ preferredLang: 'fr' });
  });

  it('returns parsed settings', () => {
    store.set(SETTINGS_KEY, JSON.stringify({ preferredLang: 'en' }));
    expect(loadSettings()).toEqual({ preferredLang: 'en' });
  });

  it('returns default on corrupted data', () => {
    store.set(SETTINGS_KEY, 'bad');
    expect(loadSettings()).toEqual({ preferredLang: 'fr' });
  });

  it('returns default on invalid lang value', () => {
    store.set(SETTINGS_KEY, JSON.stringify({ preferredLang: 'de' }));
    expect(loadSettings()).toEqual({ preferredLang: 'fr' });
  });
});

describe('saveSettings', () => {
  it('persists settings to localStorage', () => {
    saveSettings({ preferredLang: 'en' });
    expect(JSON.parse(store.get(SETTINGS_KEY)!)).toEqual({ preferredLang: 'en' });
  });
});

describe('summarizeAttempts', () => {
  it('returns zeros for empty array', () => {
    const s = summarizeAttempts([]);
    expect(s.total).toBe(0);
    expect(s.avgScore).toBe(0);
    expect(s.passCount).toBe(0);
    expect(s.bestScore).toBe(0);
    expect(s.recent).toEqual([]);
  });

  it('computes correct summary', () => {
    const attempts = [
      makeAttempt({ scorePercent: 80, passed: true }),
      makeAttempt({ scorePercent: 50, passed: false }),
      makeAttempt({ scorePercent: 90, passed: true }),
    ];
    const s = summarizeAttempts(attempts);
    expect(s.total).toBe(3);
    expect(s.avgScore).toBeCloseTo(73.33);
    expect(s.passCount).toBe(2);
    expect(s.bestScore).toBe(90);
  });

  it('limits recent to 5', () => {
    const attempts = Array.from({ length: 10 }, (_, i) => makeAttempt({ id: `a${i}` }));
    const s = summarizeAttempts(attempts);
    expect(s.recent).toHaveLength(5);
    expect(s.recent[0].id).toBe('a0');
  });
});
