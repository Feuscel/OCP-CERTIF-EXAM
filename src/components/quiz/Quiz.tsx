import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Answers, ExamView, Lang } from './types';
import { makeQuestionOrder, makeDisplayOptions, type DisplayOption } from './shuffle';
import { evaluateExam } from './scoring';
import { loadSettings, saveSettings, saveAttempt, type Attempt } from './storage';
import Report from './Report';
import { RichText } from './RichText';
import { LanguageToggle } from './LanguageToggle';

interface Props {
  exam: ExamView;
  homeUrl: string;
}

function formatTime(total: number): string {
  const m = Math.floor(total / 60)
    .toString()
    .padStart(2, '0');
  const s = Math.floor(total % 60)
    .toString()
    .padStart(2, '0');
  return `${m}:${s}`;
}

export default function Quiz({ exam, homeUrl }: Props) {
  const totalSeconds = exam.durationMinutes * 60;

  const questionOrder = useMemo(
    () => makeQuestionOrder(exam.questions, exam.shuffleQuestions),
    [exam]
  );

  const displayOptionsMap = useMemo(() => {
    const map = new Map<string, DisplayOption[]>();
    for (const q of questionOrder) {
      map.set(q.id, makeDisplayOptions(q, exam.shuffleOptions));
    }
    return map;
  }, [questionOrder, exam.shuffleOptions]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [remaining, setRemaining] = useState(totalSeconds);
  const [submitted, setSubmitted] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const [lang, setLang] = useState<Lang>(() => {
    const stored = loadSettings().preferredLang;
    return stored ?? exam.lang;
  });

  const changeLang = useCallback((next: Lang) => {
    setLang(next);
    saveSettings({ preferredLang: next });
  }, []);

  const handleSubmit = useCallback(
    (fromTimeout: boolean) => {
      const elapsedNow = totalSeconds - remaining;
      const result = evaluateExam(exam, answers);
      const attempt: Attempt = {
        id: `${exam.id}-${Date.now()}`,
        timestamp: Date.now(),
        examId: exam.id,
        examTitle: exam.title,
        durationSeconds: elapsedNow,
        scorePercent: Math.round(result.percent * 100),
        passed: result.passed,
        questionCount: result.totalQuestions,
        answeredCount: result.answeredQuestions,
      };
      saveAttempt(attempt);
      setSubmitted(true);
      setTimedOut(fromTimeout);
    },
    [exam, answers, remaining, totalSeconds]
  );

  const elapsed = totalSeconds - remaining;
  const answeredCount = questionOrder.filter((q) => (answers[q.id]?.length ?? 0) > 0).length;

  useEffect(() => {
    if (submitted) return;
    const id = window.setInterval(() => {
      setRemaining((r) => r - 1);
    }, 1000);
    return () => window.clearInterval(id);
  }, [submitted]);

  useEffect(() => {
    if (!submitted && remaining <= 0) {
      handleSubmit(true);
    }
  }, [remaining, submitted, handleSubmit]);

  const current = questionOrder[currentIndex];

  const toggleAnswer = (originalLabel: string) => {
    setAnswers((prev) => {
      const q = current;
      const sel = prev[q.id] ?? [];
      if (q.type === 'single-choice') {
        return { ...prev, [q.id]: [originalLabel] };
      }
      const next = sel.includes(originalLabel)
        ? sel.filter((s) => s !== originalLabel)
        : [...sel, originalLabel];
      return { ...prev, [q.id]: next };
    });
  };

  const clearAnswer = () => {
    setAnswers((prev) => ({ ...prev, [current.id]: [] }));
  };

  const goPrev = () => setCurrentIndex((i) => Math.max(0, i - 1));
  const goNext = () => setCurrentIndex((i) => Math.min(questionOrder.length - 1, i + 1));
  const goTo = (i: number) => setCurrentIndex(i);

  const confirmSubmit = () => {
    if (window.confirm('Soumettre l\'examen ? Cette action est définitive.')) {
      handleSubmit(false);
    }
  };

  if (submitted) {
    return (
      <Report
        exam={exam}
        answers={answers}
        timedOut={timedOut}
        elapsedSeconds={elapsed}
        totalSeconds={totalSeconds}
        questionOrder={questionOrder}
        initialLang={lang}
      />
    );
  }

  const selected = answers[current.id] ?? [];
  const currentDisplayOptions = displayOptionsMap.get(current.id) ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <a
          href={homeUrl}
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
        >
          ← Retour
        </a>
        <button
          type="button"
          onClick={confirmSubmit}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
        >
          Soumettre l'examen
        </button>
      </div>

      <QuizHeader
        remaining={remaining}
        answeredCount={answeredCount}
        totalQuestions={questionOrder.length}
        lang={lang}
        onLangChange={changeLang}
      />

      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-6 lg:items-start">
        <div className="space-y-6">
          <QuestionCard
            question={current}
            examTitle={exam.title}
            displayOptions={currentDisplayOptions}
            selected={selected}
            onToggle={toggleAnswer}
            index={currentIndex}
            total={questionOrder.length}
            lang={lang}
          />

          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={goPrev}
              disabled={currentIndex === 0}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              ← Précédent
            </button>
            <button
              type="button"
              onClick={clearAnswer}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-500 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
            >
              Effacer
            </button>
            <button
              type="button"
              onClick={goNext}
              disabled={currentIndex === questionOrder.length - 1}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              Suivant →
            </button>
          </div>
        </div>

        <QuestionPalette
          questionOrder={questionOrder}
          answers={answers}
          currentIndex={currentIndex}
          onJump={goTo}
          lang={lang}
        />
      </div>
    </div>
  );
}

interface QuizHeaderProps {
  remaining: number;
  answeredCount: number;
  totalQuestions: number;
  lang: Lang;
  onLangChange: (lang: Lang) => void;
}

function QuizHeader({ remaining, answeredCount, totalQuestions, lang, onLangChange }: QuizHeaderProps) {
  const danger = remaining <= 60;
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <p className="text-xs text-slate-500 dark:text-slate-400">
        <span className="font-semibold text-slate-700 dark:text-slate-200">{answeredCount}/{totalQuestions}</span>{' '}
        répondues
      </p>
      <div className="flex items-center gap-3">
        <LanguageToggle lang={lang} onChange={onLangChange} />
        <div
          className={`rounded-lg px-3 py-1.5 font-mono text-lg font-bold tabular-nums ${
            danger
              ? 'bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400'
              : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200'
          }`}
          aria-live="polite"
        >
          ⏱ {formatTime(Math.max(0, remaining))}
        </div>
      </div>
    </div>
  );
}

interface QuestionPaletteProps {
  questionOrder: ExamView['questions'];
  answers: Answers;
  currentIndex: number;
  onJump: (i: number) => void;
  lang: Lang;
}

function QuestionPalette({ questionOrder, answers, currentIndex, onJump, lang }: QuestionPaletteProps) {
  return (
    <nav
      className="lg:max-h-[calc(100vh-16rem)] lg:overflow-y-auto rounded-xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900"
      aria-label="Navigation des questions"
    >
      <div className="space-y-1">
        {questionOrder.map((q, i) => {
          const answered = (answers[q.id]?.length ?? 0) > 0;
          const isCurrent = i === currentIndex;
          const title = lang === 'fr' ? q.titleFr : q.titleEn;
          return (
            <button
              key={q.id}
              type="button"
              onClick={() => onJump(i)}
              aria-label={`Question ${i + 1}`}
              className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left transition ${
                isCurrent
                  ? 'bg-indigo-50 dark:bg-indigo-950'
                  : answered
                  ? 'hover:bg-slate-50 dark:hover:bg-slate-800'
                  : 'hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-xs font-semibold ${
                  isCurrent
                    ? 'bg-indigo-600 text-white'
                    : answered
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                }`}
              >
                {i + 1}
              </span>
              <span className="flex-1 truncate text-xs text-slate-700 dark:text-slate-300">
                {title}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

interface QuestionCardProps {
  question: ExamView['questions'][number];
  examTitle: string;
  displayOptions: DisplayOption[];
  selected: string[];
  onToggle: (originalLabel: string) => void;
  index: number;
  total: number;
  lang: Lang;
}

function QuestionCard({
  question,
  examTitle,
  displayOptions,
  selected,
  onToggle,
  index,
  total,
  lang,
}: QuestionCardProps) {
  const name = `q-${question.id}`;
  const isMultiple = question.type === 'multiple-choice';
  const title = lang === 'fr' ? question.titleFr : question.titleEn;

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div className="mb-3">
        <div className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
          <span className="truncate font-semibold text-slate-600 dark:text-slate-300">{examTitle}</span>
          <span aria-hidden="true">›</span>
          <span>Question {index + 1}/{total}</span>
          <span className="mx-1 text-slate-300 dark:text-slate-700" aria-hidden="true">·</span>
          <span className="rounded bg-slate-100 px-1.5 py-0.5 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            {isMultiple ? 'Plusieurs réponses' : 'Réponse unique'}
          </span>
        </div>
        <h2 className="mt-2 text-base font-semibold leading-snug text-slate-900 dark:text-slate-100">
          <RichText>{title}</RichText>
        </h2>
      </div>
      <fieldset className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">
        <legend className="sr-only">{title}</legend>
        {displayOptions.map((opt) => {
          const checked = selected.includes(opt.originalLabel);
          const id = `${name}-${opt.displayLabel}`;
          const optText = lang === 'fr' ? opt.textFr : opt.textEn;
          return (
            <label
              key={opt.displayLabel}
              htmlFor={id}
              className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition ${
                checked
                  ? 'border-indigo-400 bg-indigo-50 dark:border-indigo-500 dark:bg-indigo-950'
                  : 'border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700'
              }`}
            >
              <input
                id={id}
                type={isMultiple ? 'checkbox' : 'radio'}
                name={name}
                value={opt.displayLabel}
                checked={checked}
                onChange={() => onToggle(opt.originalLabel)}
                className="mt-0.5 h-4 w-4 accent-indigo-600"
              />
              <span className="flex-1 text-sm text-slate-800 dark:text-slate-200">
                <span className="mr-1.5 font-bold text-indigo-600 dark:text-indigo-400">{opt.displayLabel}.</span>
                <span className="flex-1">
                  <RichText>{optText}</RichText>
                </span>
              </span>
            </label>
          );
        })}
      </fieldset>
    </article>
  );
}
