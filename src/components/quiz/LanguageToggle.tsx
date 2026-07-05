import type { Lang } from './types';

interface Props {
  lang: Lang;
  onChange: (lang: Lang) => void;
}

export function LanguageToggle({ lang, onChange }: Props) {
  return (
    <div className="inline-flex overflow-hidden rounded-lg border border-slate-200 text-xs dark:border-slate-700">
      <button
        type="button"
        onClick={() => onChange('fr')}
        aria-pressed={lang === 'fr'}
        className={`px-3 py-1.5 font-medium transition ${
          lang === 'fr'
            ? 'bg-indigo-600 text-white'
            : 'bg-white text-slate-600 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
        }`}
      >
        FR
      </button>
      <button
        type="button"
        onClick={() => onChange('en')}
        aria-pressed={lang === 'en'}
        className={`px-3 py-1.5 font-medium transition ${
          lang === 'en'
            ? 'bg-indigo-600 text-white'
            : 'bg-white text-slate-600 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
        }`}
      >
        EN
      </button>
    </div>
  );
}