import { useEffect, useState } from 'react';
import {
  loadAttempts,
  summarizeAttempts,
  clearAttempts,
  type Attempt,
  type AttemptSummary,
} from './quiz/storage';

function formatPercent(p: number): string {
  return `${Math.round(p)}%`;
}

function formatDate(ts: number): string {
  const d = new Date(ts);
  return d.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function Progression() {
  const [summary, setSummary] = useState<AttemptSummary | null>(null);

  useEffect(() => {
    const attempts = loadAttempts();
    setSummary(summarizeAttempts(attempts));
  }, []);

  if (!summary || summary.total === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-bold tracking-tight dark:text-slate-100">Progression</h2>
        <p className="rounded-xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
          Aucun essai enregistré. Terminez un examen pour voir votre progression ici.
        </p>
      </div>
    );
  }

  const handleReset = () => {
    if (window.confirm('Supprimer tout l\'historique des essais ? Cette action est définitive.')) {
      clearAttempts();
      setSummary(summarizeAttempts([]));
    }
  };

  return (
    <div className="space-y-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight dark:text-slate-100">Progression</h2>
        <button
          type="button"
          onClick={handleReset}
          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-red-50 hover:text-red-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-red-950 dark:hover:text-red-400"
        >
          Réinitialiser
        </button>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Essais" value={String(summary.total)} />
        <Stat
          label="Score moyen"
          value={formatPercent(summary.avgScore)}
          tone={summary.avgScore >= 60 ? 'good' : 'bad'}
        />
        <Stat
          label="Réussis"
          value={`${summary.passCount}/${summary.total}`}
          tone="neutral"
        />
        <Stat
          label="Meilleur"
          value={formatPercent(summary.bestScore)}
          tone={summary.bestScore >= 60 ? 'good' : 'bad'}
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            <tr>
              <th className="px-3 py-2 font-medium">Examen</th>
              <th className="px-3 py-2 font-medium">Date</th>
              <th className="px-3 py-2 font-medium">Durée</th>
              <th className="px-3 py-2 font-medium">Score</th>
              <th className="px-3 py-2 font-medium">Résultat</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {summary.recent.map((a: Attempt) => (
              <tr key={a.id} className="text-slate-700 dark:text-slate-300">
                <td className="px-3 py-2 font-medium text-slate-800 dark:text-slate-200">
                  {a.examTitle}
                </td>
                <td className="px-3 py-2 text-slate-500 dark:text-slate-400">
                  {formatDate(a.timestamp)}
                </td>
                <td className="px-3 py-2 text-slate-500 dark:text-slate-400">
                  {formatMinSec(a.durationSeconds)}
                </td>
                <td className="px-3 py-2 font-semibold">{formatPercent(a.scorePercent)}</td>
                <td className="px-3 py-2">
                  <span
                    className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold text-white ${
                      a.passed ? 'bg-emerald-600' : 'bg-red-600'
                    }`}
                  >
                    {a.passed ? 'Réussi' : 'Échec'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function formatMinSec(total: number): string {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}m${s.toString().padStart(2, '0')}`;
}

interface StatProps {
  label: string;
  value: string;
  tone?: 'neutral' | 'good' | 'bad';
}

function Stat({ label, value, tone = 'neutral' }: StatProps) {
  const color =
    tone === 'good'
      ? 'text-emerald-600 dark:text-emerald-400'
      : tone === 'bad'
      ? 'text-red-600 dark:text-red-400'
      : 'text-slate-800 dark:text-slate-200';
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
      <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {label}
      </div>
    </div>
  );
}