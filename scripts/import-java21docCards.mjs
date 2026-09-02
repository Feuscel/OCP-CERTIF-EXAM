// @ts-check
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CACHE_DIR = join(__dirname, '..', '.cache', 'java21docCards');
const CACHE_FILE = join(CACHE_DIR, 'questions.yml');
const EXAMS_DIR = join(__dirname, '..', 'src', 'content', 'exams');
const RAW_URL = 'https://raw.githubusercontent.com/Anasss/java21docCards/main/_data/quiz/questions.yml';

const CATEGORY_TAGS = {
  'OOP': ['oop', 'inheritance', 'polymorphism'],
  'Java 21 Features': ['java21', 'records', 'sealed-classes', 'pattern-matching'],
  'Streams': ['streams', 'pipelines', 'functional'],
  'Collections': ['collections', 'maps', 'sets', 'lists'],
  'Exceptions': ['exceptions', 'try-with-resources', 'error-handling'],
  'Concurrency': ['concurrency', 'threads', 'executors', 'locks'],
  'Date/Time': ['datetime', 'localdate', 'zoneddatetime'],
  'Generics': ['generics', 'wildcards', 'type-erasure'],
  'Enums': ['enums', 'constants'],
  'I/O & NIO': ['io', 'nio', 'files', 'paths'],
  'Modules': ['modules', 'jpms', 'module-system'],
  'Lambda Expressions': ['lambdas', 'functional', 'closures'],
  'Functional Interfaces': ['functional-interfaces', 'predicate', 'function', 'consumer'],
  'Operators': ['operators', 'boolean', 'arithmetic'],
  'Arrays': ['arrays', 'data-structures'],
  'Control Flow': ['control-flow', 'loops', 'conditionals'],
  'Wrapper Classes': ['wrapper-classes', 'boxing', 'integer'],
  'Localization': ['localization', 'resourcebundle', 'locale'],
  'Operators and Control Flow': ['operators', 'control-flow', 'loops'],
  'Optional': ['optional', 'null-safety'],
};

const args = process.argv.slice(2);
const FORCE_DOWNLOAD = args.includes('--force');
const DRY_RUN = args.includes('--dry-run');
const CATEGORY_FILTER = args.includes('--category') ? args[args.indexOf('--category') + 1] : null;

if (args.includes('--help')) {
  console.log(`
Usage: node scripts/import-java21docCards.mjs [options]

Options:
  --force          Re-download questions.yml even if cached
  --dry-run        Preview without writing files
  --category NAME  Import only specific category (e.g., "OOP")
  --help           Show this help message
  `);
  process.exit(0);
}

async function downloadQuestions() {
  mkdirSync(CACHE_DIR, { recursive: true });

  if (existsSync(CACHE_FILE) && !FORCE_DOWNLOAD) {
    console.log('Using cached questions.yml');
    return readFileSync(CACHE_FILE, 'utf-8');
  }

  console.log('Downloading questions.yml from GitHub...');
  const res = await fetch(RAW_URL);
  if (!res.ok) {
    throw new Error(`Failed to download: ${res.status} ${res.statusText}`);
  }

  const content = await res.text();
  writeFileSync(CACHE_FILE, content);
  console.log('Downloaded and cached questions.yml');
  return content;
}

function parseYAML(content) {
  const questions = [];
  const lines = content.split('\n');
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.trim().startsWith('- question:')) {
      const question = {
        question: extractQuotedValue(line),
        code: '',
        options: [],
        correct: 0,
        explanation: '',
        category: '',
      };

      i++;

      while (i < lines.length && !lines[i].trim().startsWith('- question:')) {
        const currentLine = lines[i];
        const trimmed = currentLine.trim();

        if (trimmed.startsWith('code:')) {
          if (trimmed.includes('|')) {
            i++;
            const codeLines = [];
            while (i < lines.length && (lines[i].startsWith('    ') || lines[i].trim() === '')) {
              if (lines[i].trim() === '' && i + 1 < lines.length && !lines[i + 1].startsWith('    ')) {
                break;
              }
              codeLines.push(lines[i].substring(4));
              i++;
            }
            question.code = codeLines.join('\n');
            continue;
          }
        } else if (trimmed.startsWith('options:')) {
          i++;
          while (i < lines.length) {
            const optLine = lines[i];
            const optTrimmed = optLine.trim();
            if (optTrimmed.startsWith('- "') || optTrimmed.startsWith("- '")) {
              question.options.push(extractQuotedValue(optLine));
              i++;
            } else if (optTrimmed === '' || optTrimmed.startsWith('-')) {
              i++;
            } else {
              break;
            }
          }
          continue;
        } else if (trimmed.startsWith('correct:')) {
          question.correct = parseInt(trimmed.split(':')[1].trim());
        } else if (trimmed.startsWith('explanation:')) {
          if (trimmed.includes('|')) {
            i++;
            const explanationLines = [];
            while (i < lines.length && (lines[i].startsWith('    ') || lines[i].trim() === '')) {
              if (lines[i].trim() === '' && i + 1 < lines.length && !lines[i + 1].startsWith('    ')) {
                break;
              }
              explanationLines.push(lines[i].substring(4));
              i++;
            }
            question.explanation = explanationLines.join(' ').trim();
            continue;
          } else {
            question.explanation = extractQuotedValue(trimmed);
          }
        } else if (trimmed.startsWith('category:')) {
          question.category = extractQuotedValue(trimmed);
        }

        i++;
      }

      questions.push(question);
    } else {
      i++;
    }
  }

  return questions;
}

function extractQuotedValue(line) {
  const match = line.match(/:\s*"(.*)"/);
  if (match) {
    return match[1];
  }
  const singleMatch = line.match(/:\s*'(.*)'/);
  if (singleMatch) {
    return singleMatch[1];
  }
  const dashMatch = line.match(/-\s*"(.*)"/);
  if (dashMatch) {
    return dashMatch[1];
  }
  const dashSingleMatch = line.match(/-\s*'(.*)'/);
  if (dashSingleMatch) {
    return dashSingleMatch[1];
  }
  const parts = line.split(':');
  if (parts.length > 1) {
    return parts.slice(1).join(':').trim();
  }
  return '';
}

function normalizeCategory(category) {
  return category
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function getTagsForCategory(category) {
  return CATEGORY_TAGS[category] || [normalizeCategory(category)];
}

function indexToLabel(index) {
  return String.fromCharCode(65 + index);
}

function buildTitle(question, code) {
  let title = question;
  if (code && code.trim()) {
    title += '\n```java\n' + code.trim() + '\n```';
  }
  return title;
}

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

function processQuestions(questions) {
  const grouped = new Map();

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];

    if (!q.question || !q.options || q.correct === undefined) {
      console.warn(`Skipping question ${i + 1}: missing required fields`);
      continue;
    }

    const category = q.category || 'Uncategorized';
    if (!grouped.has(category)) {
      grouped.set(category, []);
    }

    const normalizedCategory = normalizeCategory(category);
    const questionIndex = grouped.get(category).length + 1;
    const id = `jc-${normalizedCategory}-${String(questionIndex).padStart(3, '0')}`;

    const titleEn = buildTitle(q.question, q.code);
    const titleFr = buildTitle(q.question, q.code);

    const correctLabel = indexToLabel(q.correct);
    const type = 'single-choice';

    const options = q.options.map((opt, idx) => ({
      label: indexToLabel(idx),
      text_en: opt,
      text_fr: opt,
    }));

    grouped.get(category).push({
      id,
      title_en: titleEn,
      title_fr: titleFr,
      type,
      options,
      correct_answers: [correctLabel],
      explanation_en: q.explanation || '',
      explanation_fr: q.explanation || '',
    });
  }

  return grouped;
}

function generateMDX(category, questions) {
  const normalizedCategory = normalizeCategory(category);
  const tags = getTagsForCategory(category);
  const durationMinutes = Math.max(15, questions.length * 2);

  const yamlLines = [
    '---',
    `id: "jc-${normalizedCategory}"`,
    `title: "Java21DocCards - ${category}"`,
    'lang: "en"',
    `duration_minutes: ${durationMinutes}`,
    'shuffle_questions: true',
    'shuffle_options: true',
    'difficulty: "medium"',
    `tags: [${tags.map(t => `"${t}"`).join(', ')}]`,
    'questions:',
  ];

  for (const q of questions) {
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
  yamlLines.push(`Java21DocCards - ${category} questions.`);

  return yamlLines.join('\n');
}

async function main() {
  try {
    const yamlContent = await downloadQuestions();
    const questions = parseYAML(yamlContent);

    console.log(`Parsed ${questions.length} questions`);

    const grouped = processQuestions(questions);

    if (CATEGORY_FILTER) {
      const normalizedFilter = normalizeCategory(CATEGORY_FILTER);
      const found = Array.from(grouped.keys()).find(
        cat => normalizeCategory(cat) === normalizedFilter
      );

      if (!found) {
        console.error(`Category "${CATEGORY_FILTER}" not found`);
        console.log('Available categories:');
        for (const cat of grouped.keys()) {
          console.log(`  - ${cat}`);
        }
        process.exit(1);
      }

      const questions = grouped.get(found);
      const mdx = generateMDX(found, questions);
      const filename = `jc-${normalizeCategory(found)}.md`;
      const filepath = join(EXAMS_DIR, filename);

      if (DRY_RUN) {
        console.log(`\n[DRY RUN] Would write ${filepath}`);
        console.log(`  Category: ${found}`);
        console.log(`  Questions: ${questions.length}`);
      } else {
        writeFileSync(filepath, mdx);
        console.log(`\n✅ Written ${filepath} (${questions.length} questions)`);
      }
    } else {
      console.log(`\nFound ${grouped.size} categories:`);
      for (const [category, questions] of grouped.entries()) {
        const normalizedCategory = normalizeCategory(category);
        const mdx = generateMDX(category, questions);
        const filename = `jc-${normalizedCategory}.md`;
        const filepath = join(EXAMS_DIR, filename);

        if (DRY_RUN) {
          console.log(`  [DRY RUN] ${filename}: ${questions.length} questions`);
        } else {
          writeFileSync(filepath, mdx);
          console.log(`  ✅ ${filename}: ${questions.length} questions`);
        }
      }
    }

    console.log('\n✅ Import complete!');
    console.log('Run `pnpm build` to validate the generated files.');

  } catch (error) {
    console.error('Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

main();