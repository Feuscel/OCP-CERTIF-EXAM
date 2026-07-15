import { describe, it, expect } from 'vitest';
import { formatJava, highlightJava } from './highlightJava';
import React from 'react';

function isSpan(node: unknown): node is React.ReactElement {
  return React.isValidElement(node) && (node.type as string) === 'span';
}

function getClassName(node: React.ReactElement): string {
  return (node.props as Record<string, string>).className ?? '';
}

describe('formatJava', () => {
  it('indents opening braces', () => {
    const code = 'class Foo {\npublic void bar() {\n}\n}';
    const result = formatJava(code);
    const lines = result.split('\n');
    expect(lines[0]).toBe('class Foo {');
    expect(lines[1]).toBe('    public void bar() {');
    expect(lines[2]).toBe('    }');
    expect(lines[3]).toBe('}');
  });

  it('handles nested braces', () => {
    const code = 'class Foo {\nif (true) {\nfor (;;) {\n}\n}\n}';
    const result = formatJava(code);
    const lines = result.split('\n');
    expect(lines[0]).toBe('class Foo {');
    expect(lines[1]).toBe('    if (true) {');
    expect(lines[2]).toBe('        for (;;) {');
    expect(lines[3]).toBe('        }');
    expect(lines[4]).toBe('    }');
    expect(lines[5]).toBe('}');
  });

  it('skips empty lines', () => {
    const code = 'class Foo {\n\n\npublic void bar() {}\n}';
    const result = formatJava(code);
    expect(result.split('\n')).toHaveLength(3);
  });

  it('trims whitespace from lines', () => {
    const code = '   class Foo {   \n   public int x;   \n}';
    const result = formatJava(code);
    expect(result.split('\n')[0]).toBe('class Foo {');
  });

  it('handles single line', () => {
    expect(formatJava('int x = 5;')).toBe('int x = 5;');
  });

  it('never goes below 0 indent', () => {
    const code = '}\n}\nint x;';
    const result = formatJava(code);
    const lines = result.split('\n');
    expect(lines[0]).toBe('}');
    expect(lines[1]).toBe('}');
    expect(lines[2]).toBe('int x;');
  });
});

describe('highlightJava', () => {
  it('returns array of nodes', () => {
    const nodes = highlightJava('int x = 5;');
    expect(Array.isArray(nodes)).toBe(true);
    expect(nodes.length).toBeGreaterThan(0);
  });

  it('tokenizes keywords', () => {
    const nodes = highlightJava('public class Foo');
    const spans = nodes.filter(isSpan);
    expect(spans).toHaveLength(3); // public, class, Foo
    expect(getClassName(spans[0])).toContain('fuchsia');
    expect(String(spans[0].props.children)).toBe('public');
    expect(getClassName(spans[1])).toContain('fuchsia');
    expect(String(spans[1].props.children)).toBe('class');
    expect(getClassName(spans[2])).toContain('emerald');
    expect(String(spans[2].props.children)).toBe('Foo');
  });

  it('tokenizes strings', () => {
    const nodes = highlightJava('"hello world"');
    const spans = nodes.filter(isSpan);
    const strings = spans.filter(el => getClassName(el).includes('amber'));
    expect(strings).toHaveLength(1);
  });

  it('tokenizes annotations', () => {
    const nodes = highlightJava('@Override');
    const spans = nodes.filter(isSpan);
    const annotations = spans.filter(el => getClassName(el).includes('pink'));
    expect(annotations).toHaveLength(1);
  });

  it('tokenizes numbers', () => {
    const nodes = highlightJava('42');
    const spans = nodes.filter(isSpan);
    const numbers = spans.filter(el => getClassName(el).includes('orange'));
    expect(numbers).toHaveLength(1);
  });

  it('tokenizes types (capitalized names)', () => {
    const nodes = highlightJava('String');
    const spans = nodes.filter(isSpan);
    const types = spans.filter(el => getClassName(el).includes('emerald'));
    expect(types).toHaveLength(1);
  });

  it('tokenizes comments', () => {
    const nodes = highlightJava('// this is a comment');
    const spans = nodes.filter(isSpan);
    const comments = spans.filter(el => getClassName(el).includes('slate'));
    expect(comments).toHaveLength(1);
  });

  it('handles empty string', () => {
    expect(highlightJava('')).toEqual([]);
  });
});
