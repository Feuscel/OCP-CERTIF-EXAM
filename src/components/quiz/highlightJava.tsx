import React from 'react';

const TOKEN_RE = new RegExp(
  [
    String.raw`(?<lineComment>//[^\n]*)`,
    String.raw`(?<blockComment>/\*[\s\S]*?\*/)`,
    String.raw`(?<string>"(?:\\.|[^"\\])*")`,
    String.raw`(?<char>'(?:\\.|[^'\\])*')`,
    String.raw`(?<annotation>@[A-Za-z_]\w*)`,
    String.raw`(?<keyword>\b(?:abstract|assert|break|case|catch|class|const|continue|default|do|else|enum|extends|final|finally|for|goto|if|implements|import|instanceof|interface|native|new|package|private|protected|public|return|static|strictfp|super|switch|synchronized|this|throw|throws|transient|try|var|volatile|while|yield|record|sealed|permits|non-sealed)\b)`,
    String.raw`(?<primitive>\b(?:boolean|byte|char|double|float|int|long|short|void)\b)`,
    String.raw`(?<type>\b[A-Z][A-Za-z0-9_]*\b)`,
    String.raw`(?<number>\b\d[\d_]*\.?\d*(?:[eE][+-]?\d+)?[fFdDlL]?\b)`,
  ].join('|'),
  'g'
);

const COLORS: Record<string, string> = {
  lineComment: 'text-slate-600 italic dark:text-slate-500',
  blockComment: 'text-slate-600 italic dark:text-slate-500',
  string: 'text-amber-700 dark:text-amber-300',
  char: 'text-amber-700 dark:text-amber-300',
  annotation: 'text-pink-600 dark:text-pink-400',
  keyword: 'text-fuchsia-700 font-semibold dark:text-fuchsia-400',
  primitive: 'text-sky-700 dark:text-sky-400',
  type: 'text-emerald-700 dark:text-emerald-400',
  number: 'text-orange-700 dark:text-orange-300',
};

export function formatJava(code: string): string {
  const lines = code.split('\n');
  const result: string[] = [];
  let indent = 0;
  const INDENT = '    ';

  for (let line of lines) {
    line = line.trim();
    if (!line) continue;

    // Count braces on this line
    const opens = (line.match(/\{/g) || []).length;
    const closes = (line.match(/\}/g) || []).length;

    // If line starts with closing brace, decrease indent before printing
    if (line.startsWith('}')) {
      indent = Math.max(0, indent - closes);
    }

    result.push(INDENT.repeat(Math.max(0, indent)) + line);

    // Adjust indent for next line (only if we didn't already adjust for closing brace)
    if (!line.startsWith('}')) {
      indent += opens - closes;
    } else {
      // For lines starting with }, we already decreased, now add any opens
      indent += opens;
    }
    indent = Math.max(0, indent);
  }

  return result.join('\n');
}

export function highlightJava(code: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  const re = new RegExp(TOKEN_RE.source, 'g');
  let last = 0;
  let i = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(code)) !== null) {
    if (m.index > last) {
      nodes.push(code.slice(last, m.index));
    }
    const groups = m.groups ?? {};
    const entry = Object.entries(groups).find(([, v]) => v !== undefined);
    if (entry) {
      const kind = entry[0];
      const value = entry[1];
      nodes.push(
        <span key={`tk${i}`} className={COLORS[kind] ?? ''}>
          {value}
        </span>
      );
    }
    last = m.index + m[0].length;
    i++;
  }
  if (last < code.length) {
    nodes.push(code.slice(last));
  }
  return nodes;
}