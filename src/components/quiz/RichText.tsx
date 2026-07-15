import React from 'react';
import { highlightJava, formatJava } from './highlightJava.tsx';

const FENCE_RE = /```([\s\S]*?)```/g;
const INLINE_RE = /`([^`]+)`/g;

interface Segment {
  type: 'text' | 'block';
  content: string;
}

function splitSegments(input: string): Segment[] {
  const segments: Segment[] = [];
  let last = 0;
  const re = new RegExp(FENCE_RE.source, 'g');
  let m: RegExpExecArray | null;
  while ((m = re.exec(input)) !== null) {
    if (m.index > last) {
      segments.push({ type: 'text', content: input.slice(last, m.index) });
    }
    const raw = m[1].replace(/^\n/, '').replace(/\n$/, '');
    const content = raw.replace(/^[a-zA-Z0-9_+#-]*\n/, '').replace(/^\n/, '');
    segments.push({ type: 'block', content });
    last = m.index + m[0].length;
  }
  if (last < input.length) {
    segments.push({ type: 'text', content: input.slice(last) });
  }
  return segments;
}

function renderInline(text: string, keyBase: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  let last = 0;
  const re = new RegExp(INLINE_RE.source, 'g');
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    nodes.push(
      <code
        key={`${keyBase}-i${i}`}
        className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[0.85em] text-indigo-700 dark:bg-slate-800 dark:text-indigo-300"
      >
        {m[1]}
      </code>
    );
    last = m.index + m[0].length;
    i++;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

export function RichText({ children }: { children: string }) {
  const segments = splitSegments(children);
  return (
    <>
      {segments.map((seg, i) => {
        if (seg.type === 'block') {
          return (
            <pre
              key={`b${i}`}
              className="my-2 overflow-x-auto rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            >
              <code className="font-mono whitespace-pre">{highlightJava(formatJava(seg.content))}</code>
            </pre>
          );
        }
        return (
          <React.Fragment key={`t${i}`}>{renderInline(seg.content, `t${i}`)}</React.Fragment>
        );
      })}
    </>
  );
}