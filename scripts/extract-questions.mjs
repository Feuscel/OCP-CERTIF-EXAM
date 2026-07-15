// @ts-check
import { readFileSync, writeFileSync } from 'fs';

const RAW_BASE = 'https://raw.githubusercontent.com/eh3rrera/ocpj21-book/main';

const ALL_CHAPTERS = [
  { num: 1, title: 'Utilizing Java Object-Oriented Approach - Part 1', tags: ['oop', 'classes', 'objects', 'nested-classes'] },
  { num: 2, title: 'Utilizing Java Object-Oriented Approach - Part 2', tags: ['oop', 'inheritance', 'polymorphism', 'interfaces'] },
  { num: 3, title: 'Creating and Using Arrays', tags: ['arrays', 'collections', 'generics'] },
  { num: 4, title: 'String Processing', tags: ['string', 'stringbuilder', 'regex'] },
  { num: 5, title: 'Lambdas and Functional Interfaces', tags: ['lambdas', 'functional-interfaces', 'streams'] },
  { num: 6, title: 'Java Class Design', tags: ['class-design', 'access-modifiers', 'enums'] },
  { num: 7, title: 'Advanced Java Class Design', tags: ['abstract-classes', 'interfaces', 'annotations'] },
  { num: 8, title: 'Generics and Collections', tags: ['generics', 'collections', 'maps'] },
  { num: 9, title: 'Streams and Pipelines', tags: ['streams', 'pipelines', 'java.util.stream'] },
  { num: 10, title: 'Exceptions and Assertions', tags: ['exceptions', 'try-with-resources', 'assertions'] },
  { num: 11, title: 'Modular Programming', tags: ['modules', 'module-path', 'services'] },
  { num: 12, title: 'Concurrency', tags: ['concurrency', 'threads', 'executors'] },
  { num: 13, title: 'Atomic Operations and Concurrent Collections', tags: ['atomic', 'concurrent-collections', 'locks'] },
  { num: 14, title: 'Parallel Streams', tags: ['parallel-streams', 'reduction', 'collectors'] },
  { num: 15, title: 'I/O API (NIO.2)', tags: ['io', 'nio', 'paths', 'files'] },
  { num: 16, title: 'JDBC', tags: ['jdbc', 'database', 'sql'] },
  { num: 17, title: 'Localization', tags: ['localization', 'resourcebundle', 'formatting'] },
  { num: 18, title: 'Security', tags: ['security', 'encryption', 'authentication'] },
  { num: 19, title: 'Java Platform Module System', tags: ['jpms', 'module-info', 'exports'] },
  { num: 20, title: 'Annotations', tags: ['annotations', 'meta-annotations', 'custom-annotations'] },
  { num: 21, title: 'Design Patterns', tags: ['design-patterns', 'singleton', 'factory'] },
];

const args = process.argv.slice(2);
let chapters = [];

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--chapter' && args[i + 1]) {
    chapters.push(parseInt(args[i + 1]));
    i++;
  }
}

if (chapters.length === 0) {
  chapters = [1, 2];
}

console.log(`Extracting chapters: ${chapters.join(', ')}`);

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
  let inCode = false;
  let isJavaBlock = false;
  let currentCode = '';

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
        code: '',
      };
      inCode = false;
      isJavaBlock = false;
      currentCode = '';
      continue;
    }

    if (!current) continue;

    // Check for code block start
    if (trimmed.startsWith('```') && !inCode) {
      isJavaBlock = trimmed.toLowerCase().startsWith('```java');
      if (isJavaBlock) {
        inCode = true;
        continue;
      }
    }

    // Check for code block end
    if (trimmed === '```' && inCode) {
      inCode = false;
      isJavaBlock = false;
      continue;
    }

    if (inCode) {
      currentCode += line + '\n';
      continue;
    }

    // When we hit a new option, store accumulated code
    const optMatch = trimmed.match(/^\*\*([A-Z])\)\*\*(.*)/);
    if (optMatch) {
      if (pendingOption) current.options.push(pendingOption);
      if (currentCode.trim()) {
        current.code = currentCode.trim();
        currentCode = '';
      }
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
function buildQuestionTitle(stem, code) {
  let title = stem;
  if (code) title += '\n```java\n' + code + '\n```';
  return title.trim();
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
  const chaptersToShow = ALL_CHAPTERS.filter(ch => chapters.includes(ch.num));

  for (const ch of chaptersToShow) {
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
      const titleEn = buildQuestionTitle(q.stem, q.code);
      const titleFr = q.stem;
      const explanation = buildExplanation(a.options, a.correct);

      matched.push({
        id: `ch${pad}-${String(q.num).padStart(3, '0')}`,
        title_en: titleEn,
        title_fr: titleFr,
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
