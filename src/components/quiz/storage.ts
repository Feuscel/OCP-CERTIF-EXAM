export const ATTEMPTS_KEY = 'ocp.exam.attempts.v1';
export const SETTINGS_KEY = 'ocp.exam.settings.v1';

export interface Attempt {
  id: string;
  timestamp: number;
  examId: string;
  examTitle: string;
  durationSeconds: number;
  scorePercent: number;
  passed: boolean;
  questionCount: number;
  answeredCount: number;
}

export interface ExamSettings {
  preferredLang: 'fr' | 'en';
}

type Result<T> = { ok: true; value: T } | { ok: false };

function safeParse<T>(raw: string | null, guard: (v: unknown) => v is T): Result<T> {
  if (!raw) return { ok: false };
  try {
    const parsed = JSON.parse(raw);
    if (guard(parsed)) return { ok: true, value: parsed };
    return { ok: false };
  } catch {
    return { ok: false };
  }
}

const isAttempt = (v: unknown): v is Attempt =>
  typeof v === 'object' &&
  v !== null &&
  typeof (v as Attempt).id === 'string' &&
  typeof (v as Attempt).timestamp === 'number' &&
  typeof (v as Attempt).examId === 'string' &&
  typeof (v as Attempt).durationSeconds === 'number' &&
  typeof (v as Attempt).scorePercent === 'number' &&
  typeof (v as Attempt).passed === 'boolean';

const isAttemptList = (v: unknown): v is Attempt[] =>
  Array.isArray(v) && v.every(isAttempt);

const isExamSettings = (v: unknown): v is ExamSettings =>
  typeof v === 'object' &&
  v !== null &&
  ((v as ExamSettings).preferredLang === 'fr' ||
    (v as ExamSettings).preferredLang === 'en');

export function loadAttempts(): Attempt[] {
  if (typeof localStorage === 'undefined') return [];
  const res = safeParse(localStorage.getItem(ATTEMPTS_KEY), isAttemptList);
  return res.ok ? res.value : [];
}

export function saveAttempt(attempt: Attempt): Attempt[] {
  const existing = loadAttempts();
  const next = [attempt, ...existing];
  try {
    localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(next));
  } catch {
    /* quota / disabled */
  }
  return next;
}

export function clearAttempts(): void {
  try {
    localStorage.removeItem(ATTEMPTS_KEY);
  } catch {
    /* ignore */
  }
}

export function loadSettings(): ExamSettings {
  if (typeof localStorage === 'undefined') return { preferredLang: 'fr' };
  const res = safeParse(localStorage.getItem(SETTINGS_KEY), isExamSettings);
  return res.ok ? res.value : { preferredLang: 'fr' };
}

export function saveSettings(settings: ExamSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    /* ignore */
  }
}

export interface AttemptSummary {
  total: number;
  avgScore: number;
  passCount: number;
  bestScore: number;
  recent: Attempt[];
}

export function summarizeAttempts(attempts: Attempt[]): AttemptSummary {
  const total = attempts.length;
  if (total === 0) {
    return { total: 0, avgScore: 0, passCount: 0, bestScore: 0, recent: [] };
  }
  const avg = attempts.reduce((s, a) => s + a.scorePercent, 0) / total;
  const pass = attempts.filter((a) => a.passed).length;
  const best = attempts.reduce((m, a) => Math.max(m, a.scorePercent), 0);
  return {
    total,
    avgScore: avg,
    passCount: pass,
    bestScore: best,
    recent: attempts.slice(0, 5),
  };
}