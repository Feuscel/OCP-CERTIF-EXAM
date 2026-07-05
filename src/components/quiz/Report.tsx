import { useMemo, useState } from 'react';
import type { Answers, ExamView, Lang, QuestionView } from './types';
import { evaluateExam, formatPercent, formatScore } from './scoring';
import { saveSettings } from './storage';
import { RichText } from './RichText';
import { LanguageToggle } from './LanguageToggle';

interface Props {
  exam: ExamView;
  answers: Answers;
  timedOut: boolean;
  elapsedSeconds: number;
  totalSeconds: number;
  questionOrder: QuestionView[];
  initialLang: Lang;
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

export default function Report({
  exam,
  answers,
  timedOut,
  elapsedSeconds,
  totalSeconds,
  questionOrder,
  initialLang,
}: Props) {
  const result = useMemo(() => evaluateExam(exam, answers), [exam, answers]);
  const [lang, setLang] = useState<Lang>(initialLang);

  const changeLang = (next: Lang) => {
    setLang(next);
    saveSettings({ preferredLang: next });
  };

  return (
    <div className="space-y-6">
      <ReportHeader
        exam={exam}
        result={result}
        timedOut={timedOut}
        elapsedSeconds={elapsedSeconds}
        totalSeconds={totalSeconds}
      />

      <div className="flex items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-base font-semibold">Correction détaillée</h2>
        <LanguageToggle lang={lang} onChange={changeLang} />
      </div>

      <ol className="space-y-4">
        {questionOrder.map((q, i) => {
          const qs = result.questionScores.find((s) => s.questionId === q.id)!;
          return (
            <QuestionCorrection
              key={q.id}
              index={i}
              question={q}
              score={qs}
              lang={lang}
            />
          );
        })}
      </ol>

      <div className="pt-4">
        <a
          href={`${import.meta.env.BASE_URL}`}
          className="inline-block rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
        >
          Retour à l'accueil
        </a>
      </div>
    </div>
  );
}

interface ReportHeaderProps {
  exam: ExamView;
  result: ReturnType<typeof evaluateExam>;
  timedOut: boolean;
  elapsedSeconds: number;
  totalSeconds: number;
}

function ReportHeader({ exam, result, timedOut, elapsedSeconds, totalSeconds }: ReportHeaderProps) {
  const pctText = formatPercent(result.percent);
  const passed = result.passed;
  return (
    <div
      className={`rounded-xl border p-6 text-center shadow-sm ${
        passed
          ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950'
          : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950'
      }`}
    >
      <div className="text-4xl">{timedOut ? '⏰' : passed ? '🎉' : '❌'}</div>
      <h1 className="mt-2 text-2xl font-bold dark:text-slate-100">
        {timedOut ? 'Temps écoulé' : 'Examen terminé'} — {passed ? 'Réussi' : 'Échec'}
      </h1>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{exam.title}</p>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-6">
        <div>
          <div className={`text-4xl font-bold ${passed ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
            {pctText}
          </div>
          <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Score final</div>
        </div>
        <div className="h-12 w-px bg-slate-200 dark:bg-slate-700" />
        <div>
          <div className="text-lg font-semibold text-slate-700 dark:text-slate-200">{formatPercent(result.threshold)}</div>
          <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Seuil de réussite</div>
        </div>
        <div className="h-12 w-px bg-slate-200 dark:bg-slate-700" />
        <div>
          <div className="text-lg font-semibold text-slate-700 dark:text-slate-200">
            {result.answeredQuestions}/{result.totalQuestions}
          </div>
          <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Répondues</div>
        </div>
        <div className="h-12 w-px bg-slate-200 dark:bg-slate-700" />
        <div>
          <div className="text-lg font-semibold text-slate-700 dark:text-slate-200">
            {formatTime(elapsedSeconds)}/{formatTime(totalSeconds)}
          </div>
          <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Durée</div>
        </div>
      </div>
    </div>
  );
}

interface QuestionCorrectionProps {
  index: number;
  question: QuestionView;
  score: import('./scoring').QuestionScore;
  lang: 'fr' | 'en';
}

function QuestionCorrection({ index, question, score, lang }: QuestionCorrectionProps) {
  const optionMap = useMemo(
    () => new Map(question.options.map((o) => [o.label, lang === 'fr' ? o.textFr : o.textEn])),
    [question, lang]
  );
  const isMultiple = question.type === 'multiple-choice';
  const title = lang === 'fr' ? question.titleFr : question.titleEn;
  const explanation = lang === 'fr' ? question.explanationFr : question.explanationEn;

  const statusTone = score.fullyCorrect
    ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950'
    : score.unanswered
    ? 'border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900'
    : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950';
  const badgeTone = score.fullyCorrect
    ? 'bg-emerald-600'
    : score.unanswered
    ? 'bg-slate-400'
    : 'bg-red-600';
  const statusLabel = score.fullyCorrect
    ? 'Correct'
    : score.unanswered
    ? 'Sans réponse'
    : `Partiel ${formatScore(score.score)}`;

  return (
    <li className={`rounded-xl border p-5 shadow-sm ${statusTone}`}>
      <div className="mb-3 flex items-start justify-between gap-3">
        <h3 className="flex-1 text-sm font-semibold leading-snug">
          <span className="mr-2 inline-flex h-6 min-w-6 items-center justify-center rounded bg-slate-800 px-1.5 text-xs text-white">
            {index + 1}
          </span>
          <RichText>{title}</RichText>
        </h3>
        <span
          className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold text-white ${badgeTone}`}
        >
          {statusLabel}
        </span>
      </div>

      <ul className="space-y-1.5">
        {question.options.map((opt) => {
          const isCorrect = score.correct.includes(opt.label);
          const isSelected = score.selected.includes(opt.label);
          let mark = '';
          let tone = 'border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300';
          if (isCorrect && isSelected) {
            mark = '✓';
            tone = 'border-emerald-400 bg-emerald-100 text-emerald-900 dark:border-emerald-600 dark:bg-emerald-900 dark:text-emerald-200';
          } else if (isCorrect && !isSelected) {
            mark = '✓';
            tone = 'border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-700 dark:bg-emerald-950 dark:text-emerald-300';
          } else if (!isCorrect && isSelected) {
            mark = '✗';
            tone = 'border-red-400 bg-red-100 text-red-900 dark:border-red-600 dark:bg-red-900 dark:text-red-200';
          } else {
            mark = '';
          }
          return (
            <li
              key={opt.label}
              className={`flex items-start gap-2 rounded-lg border px-3 py-2 text-sm ${tone}`}
            >
              <span className="font-bold">{opt.label}.</span>
              <span className="flex-1">
                <RichText>{optionMap.get(opt.label) ?? (lang === 'fr' ? opt.textFr : opt.textEn)}</RichText>
              </span>
              {mark && <span className="font-bold">{mark}</span>}
            </li>
          );
        })}
      </ul>

      <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-slate-600 sm:grid-cols-4 dark:text-slate-400">
        <dt>Sélectionné</dt>
        <dd className="font-medium text-slate-800 dark:text-slate-200">
          {score.selected.length ? score.selected.join(', ') : '—'}
        </dd>
        <dt>Correct</dt>
        <dd className="font-medium text-emerald-700 dark:text-emerald-400">
          {score.correct.join(', ')}
        </dd>
        <dt>Précision</dt>
        <dd className="font-medium text-slate-800 dark:text-slate-200">{formatScore(score.precision)}</dd>
        <dt>Rappel</dt>
        <dd className="font-medium text-slate-800 dark:text-slate-200">{formatScore(score.recall)}</dd>
        <dt>Score question</dt>
        <dd className="font-semibold text-slate-900 dark:text-white">{formatScore(score.score)}</dd>
        <dt>Type</dt>
        <dd className="text-slate-700 dark:text-slate-300">{isMultiple ? 'Choix multiples' : 'Choix unique'}</dd>
      </dl>

      {explanation && (
        <div className="mt-3 rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
          <span className="mr-1 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
            Explication ({lang.toUpperCase()}):
          </span>
          {explanation}
        </div>
      )}
    </li>
  );
}