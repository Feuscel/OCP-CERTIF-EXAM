// @ts-check
import { readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';

const RAW_BASE = 'https://raw.githubusercontent.com/eh3rrera/ocpj21-book/main';

const CHAPTERS = [
  { num: 1, title: 'Utilizing Java Object-Oriented Approach - Part 1', tags: ['oop', 'classes', 'objects', 'nested-classes'] },
  { num: 2, title: 'Utilizing Java Object-Oriented Approach - Part 2', tags: ['oop', 'inheritance', 'polymorphism', 'interfaces'] },
];

/**
 * @param {string} url
 */
async function fetchText(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  return res.text();
}

/**
 * @param {string} markdown
 */
function extractQuestions(markdown) {
  const lines = markdown.split('\n');
  const questions = [];
  let current = null;
  let inPracticeQuestions = false;
  let pendingOption = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!inPracticeQuestions) {
      if (trimmed.startsWith('## Practice Questions')) {
        inPracticeQuestions = true;
      }
      continue;
    }

    // Check for new question
    const qMatch = trimmed.match(/^\*\*(\d+)\.\s+(.*?)\*\*\s*$/);
    if (qMatch) {
      if (pendingOption && current) {
        current.options.push(pendingOption);
        pendingOption = null;
      }
      if (current) questions.push(current);
      current = {
        num: parseInt(qMatch[1]),
        stem: qMatch[2].trim(),
        options: [],
      };
      continue;
    }

    if (!current) continue;

    // Check for option label
    const optMatch = trimmed.match(/^\*\*([A-Z])\)\*\*(.*)/);
    if (optMatch) {
      if (pendingOption) current.options.push(pendingOption);
      pendingOption = {
        label: optMatch[1],
        text: optMatch[2].trim(),
      };
      continue;
    }

    // If we have a pending option, append text to it
    if (pendingOption) {
      if (trimmed) pendingOption.text += '\n' + trimmed;
      continue;
    }

    // If no options yet, append to stem
    if (current.options.length === 0 && !pendingOption) {
      if (trimmed && !line.startsWith('#') && !line.startsWith('-')) {
        current.stem += '\n' + trimmed;
      }
    }
  }

  if (pendingOption && current) current.options.push(pendingOption);
  if (current && current.options.length > 0) questions.push(current);
  return questions;
}

/**
 * @param {string} markdown
 */
function extractAnswers(markdown) {
  const lines = markdown.split('\n');
  const answers = {};
  let current = null;
  let currentOption = null;
  let inExplanation = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) continue;

    const ansMatch = trimmed.match(/^\*\*(\d+)\.\s+The correct answer[s]?\s+(?:is|are)\s+(.+?)\.?\*{0,2}\s*$/);
    if (ansMatch) {
      const num = parseInt(ansMatch[1]);
      const raw = ansMatch[2].trim();
      let labels = [];

      const groupMatch = raw.match(/\(([A-Z])(?:\s+and\s+([A-Z]))?\)(?:\s+and\s+\(([A-Z])(?:\s+and\s+([A-Z]))?\))?/);
      if (groupMatch) {
        for (let g = 1; g < groupMatch.length; g++) {
          if (groupMatch[g]) labels.push(groupMatch[g]);
        }
      } else {
        labels = raw.split(/,|\s+and\s+/).map(s => s.replace(/^\(|\)$/g, '').replace(/[:.]+$/, '').trim()).filter(Boolean);
      }

      current = {
        num,
        correct: labels,
        options: {},
      };
      answers[num] = current;
      inExplanation = false;
      currentOption = null;
      continue;
    }

    if (!current) continue;

    if (trimmed === '**Explanation:**') {
      inExplanation = true;
      continue;
    }

    if (inExplanation) {
      const optMatch = trimmed.match(/^- \*\*([A-Z])\)\*\*\s+(.*)/);
      if (optMatch) {
        currentOption = optMatch[1];
        let fullText = optMatch[2].trim();
        let isCorrect = null;
        let explanation = '';

        // Try to detect inline verdict: "text is correct/incorrect" or "text. Correct/Incorrect"
        const inlineVerdict = fullText.match(/^(.*?)\b(is|are)\s+(correct|incorrect)[,.]?\s+(.*)/i);
        const inlineVerdict2 = fullText.match(/^(.*?)[.|]\s*(Correct|Incorrect)\s+(.*)/);

        if (inlineVerdict) {
          isCorrect = inlineVerdict[3].toLowerCase() === 'correct';
          explanation = inlineVerdict[4];
        } else if (inlineVerdict2) {
          isCorrect = inlineVerdict2[2].toLowerCase() === 'correct';
          explanation = inlineVerdict2[3];
        }

        current.options[currentOption] = {
          text: fullText,
          isCorrect,
          explanation,
        };
        continue;
      }

      if (currentOption) {
        const verdictMatch = trimmed.match(/^-\s+(?:This option is|This is the) (correct|incorrect)(?:\s+answer)?[,.]?\s*(.*)/);
        if (verdictMatch) {
          current.options[currentOption].isCorrect = verdictMatch[1] === 'correct';
          current.options[currentOption].explanation += ' ' + verdictMatch[2].trim();
        } else if (trimmed && !trimmed.startsWith('*') && !trimmed.startsWith('#')) {
          current.options[currentOption].explanation += ' ' + trimmed;
        }
      }
    }
  }

  return answers;
}

/**
 * @param {Record<string, {text: string, isCorrect: boolean | null, explanation: string}>} optAnswers
 * @param {string[]} correctLabels
 */
function buildExplanation(optAnswers, correctLabels) {
  const parts = [];
  for (const [label, info] of Object.entries(optAnswers)) {
    const isCorrect = info.isCorrect !== null ? info.isCorrect : correctLabels.includes(label);
    const verdict = isCorrect ? 'Correct' : 'Incorrect';
    let expl = info.explanation.trim();

    // If explanation is empty but we have option text from the answer, use it
    if (!expl && info.text) {
      const answerText = info.text;
      const verdictMatch = answerText.match(/\b(is|are)\s+(correct|incorrect)\b/i);
      if (verdictMatch) {
        expl = answerText.replace(/.*?\b(is|are)\s+(correct|incorrect)[,.]?\s*/i, '').trim();
      }
    }

    if (expl) {
      // Clean up common prefixes
      expl = expl.replace(/^-\s+/, '').replace(/^This (?:option )?is (?:the )?(?:correct|incorrect) (?:answer[.,]?\s*)?/i, '');
      parts.push(`${label}) ${verdict}: ${expl}`);
    }
  }
  return parts.join(' ');
}

/**
 * @param {string} qStem
 * @param {{ label: string; text: string }[]} options
 * @param {string[]} correctLabels
 */
function determineType(qStem, options, correctLabels) {
  if (qStem.includes('(Choose all that apply.)')) return 'multiple-choice';
  if (correctLabels.length > 1) return 'multiple-choice';
  return 'single-choice';
}

/**
 * @param {string} stem
 * @param {string} code
 * @param {{ label: string; text: string }[]} options
 * @param {{ text: string; isCorrect: boolean | null; explanation: string }} [optAnswer]
 */
function buildQuestionTitle(stem, code, options, optAnswer) {
  let title = stem;
  if (code) title += '\n' + code;
  return title.trim();
}

/**
 * @param {string} text
 */
function escapeYaml(text) {
  if (!text) return '';
  if (text.includes("'") || text.includes('\n') || text.includes(':') || text.includes('#') || text.includes('"')) {
    return text.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  }
  return text;
}

/**
 * @param {string} text
 */
function toYamlValue(text) {
  if (!text) return "''";
  const needsQuotes = /['"\n:#{}\[\],&*?|<>=!%@`]/.test(text);
  if (needsQuotes) {
    const escaped = text
      .replace(/\\/g, '\\\\')
      .replace(/"/g, '\\"')
      .replace(/\n/g, '\\n');
    return `"${escaped}"`;
  }
  if (/^[0-9]/.test(text) || text === 'true' || text === 'false' || text === 'null') {
    return `"${text}"`;
  }
  return `"${text}"`;
}

async function main() {
  const outDir = new URL('../src/content/exams/', import.meta.url).pathname;

  for (const ch of CHAPTERS) {
    const pad = String(ch.num).padStart(2, '0');

    console.log(`\n--- Processing Chapter ${pad}: ${ch.title} ---`);

    let chContent, ansContent;
    try {
      chContent = await fetchText(`${RAW_BASE}/ch${pad}.md`);
      ansContent = await fetchText(`${RAW_BASE}/ch${pad}a.md`);
    } catch (e) {
      console.error(`Failed to fetch chapter ${pad}: ${e.message}`);
      continue;
    }

    const qs = extractQuestions(chContent);
    const ans = extractAnswers(ansContent);

    console.log(`  Found ${qs.length} questions, ${Object.keys(ans).length} answers`);

    const matched = [];
    for (const q of qs) {
      const a = ans[q.num];
      if (!a) {
        console.warn(`  ⚠️  No answer found for question ${q.num}`);
        continue;
      }

      const type = determineType(q.stem, q.options, a.correct);
      const title = buildQuestionTitle(q.stem, q.code, q.options, a);
      const explanation = buildExplanation(a.options, a.correct);

      matched.push({
        id: `ch${pad}-${String(q.num).padStart(3, '0')}`,
        title_en: title,
        title_fr: title,
        type,
        options: q.options.map(o => ({
          label: o.label,
          text_en: o.text,
          text_fr: o.text,
        })),
        correct_answers: a.correct,
        explanation_en: explanation,
        explanation_fr: explanation,
      });
    }

    const examId = `ch${pad}`;
    const yamlLines = [
      '---',
      `id: "${examId}"`,
      `title: "Chapter ${ch.num} - ${ch.title}"`,
      'lang: "en"',
      `duration_minutes: ${Math.max(15, matched.length * 2)}`,
      'shuffle_questions: true',
      'shuffle_options: true',
      `difficulty: "medium"`,
      `tags: [${ch.tags.map(t => `"${t}"`).join(', ')}]`,
      'questions:',
    ];

    for (const q of matched) {
      yamlLines.push(`  - id: "${q.id}"`);
      yamlLines.push(`    title_fr: ${toYamlValue(q.title_fr)}`);
      yamlLines.push(`    title_en: ${toYamlValue(q.title_en)}`);
      yamlLines.push(`    type: "${q.type}"`);
      yamlLines.push('    options:');
      for (const o of q.options) {
        yamlLines.push(`      - label: "${o.label}"`);
        yamlLines.push(`        text_fr: ${toYamlValue(o.text_fr)}`);
        yamlLines.push(`        text_en: ${toYamlValue(o.text_en)}`);
      }
      yamlLines.push(`    correct_answers: [${q.correct_answers.map(a => `"${a}"`).join(', ')}]`);
      yamlLines.push(`    explanation_fr: ${toYamlValue(q.explanation_fr)}`);
      yamlLines.push(`    explanation_en: ${toYamlValue(q.explanation_en)}`);
    }

    yamlLines.push('---');
    yamlLines.push('');
    yamlLines.push(`Chapter ${ch.num} - ${ch.title} exam.`);

    const outPath = `${outDir}/${examId}.mdx`;
    writeFileSync(outPath, yamlLines.join('\n'));
    console.log(`  ✅ Written ${outPath} (${matched.length} questions)`);
  }
}

main().catch(console.error);
