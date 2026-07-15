// @ts-check
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { execSync } from 'child_process';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const TMP_DIR = `${__dirname}/../.verification`;
const RAW_BASE = 'https://raw.githubusercontent.com/eh3rrera/ocpj21-book/main';
const EXAMS_DIR = `${__dirname}/../src/content/exams`;

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

/**
 * Extract Java code blocks from a string
 */
function extractJavaCode(text) {
  const blocks = [];
  const regex = /```java\n([\s\S]*?)```/g;
  let match;
  while ((match = regex.exec(text)) !== null) {
    blocks.push(match[1].trim());
  }
  return blocks;
}

/**
 * Wrap a code snippet into a compilable Java class if needed
 */
function wrapSnippet(snippet, className) {
  // Strip line numbers from beginning of lines (e.g., "1. public class" -> "public class")
  let cleaned = snippet.replace(/^\d+\.\s+/gm, '');
  
  // Check if snippet contains multiple files (look for "// File" comments or multiple class declarations)
  const fileMarkers = cleaned.match(/\/\/\s*File\s+\d+/gi);
  if (fileMarkers && fileMarkers.length > 1) {
    // Return null to indicate this is a multi-file snippet that needs special handling
    return null;
  }
  
  // If it already has a class declaration, rename it to match the filename
  // Also fix constructor names to match the new class name
  if (/class\s+\w+/.test(cleaned)) {
    const classMatch = cleaned.match(/class\s+(\w+)/);
    if (classMatch) {
      const oldClassName = classMatch[1];
      // Replace class name
      cleaned = cleaned.replace(/class\s+\w+/g, `class ${className}`);
      // Replace constructor name (constructor has same name as old class)
      cleaned = cleaned.replace(new RegExp(`\\b${oldClassName}\\s*\\(`, 'g'), `${className}(`);
    }
    return cleaned;
  }

  // If it looks like a method body or statements
  const lines = cleaned.split('\n');
  const hasMain = lines.some(l => l.includes('public static void main'));

  let code = `public class ${className} {\n`;
  if (!hasMain) {
    code += `  public static void main(String[] args) {\n`;
    code += lines.map(l => `    ${l}`).join('\n');
    code += `\n  }\n`;
  } else {
    code += lines.map(l => `  ${l}`).join('\n');
    code += `\n`;
  }
  code += '}\n';
  return code;
}

/**
 * Verify a Java snippet by compiling and optionally running it
 * Returns { status: 'ok' | 'compile_error' | 'run_error', output?: string, error?: string }
 */
function verifySnippet(snippet, idx) {
  const className = `Verify_${idx}`;
  const filename = `${className}.java`;
  const filepath = `${TMP_DIR}/${filename}`;

  const wrapped = wrapSnippet(snippet, className);
  
  // If wrapSnippet returns null, it's a multi-file snippet that can't be verified as-is
  if (wrapped === null) {
    return { status: 'skipped', error: 'Multi-file snippet - requires manual verification' };
  }

  writeFileSync(filepath, wrapped);

  try {
    execSync(`javac --release 21 "${filepath}" 2>&1`, { stdio: 'pipe' });
  } catch (e) {
    const stderr = e.stderr?.toString() || e.message;
    return { status: 'compile_error', error: stderr };
  }

  // Try to run if compilation succeeded
  try {
    const out = execSync(`java -cp "${TMP_DIR}" ${className} 2>&1`, {
      stdio: 'pipe',
      timeout: 5000,
    });
    return { status: 'ok', output: out.toString().trim() };
  } catch (e) {
    const stderr = e.stderr?.toString() || e.message;
    return { status: 'run_error', error: stderr };
  }
}

/**
 * Try to infer expected behavior from question title and answers
 */
function inferExpectedOutput(title, correctLabels) {
  const allText = title;

  if (/compil(es|ation|e)\s+(error|fail)/i.test(allText)) {
    return { type: 'compile_error' };
  }
  if (/runtime exception|throws|exception is thrown/i.test(allText)) {
    return { type: 'run_error' };
  }

  const outputMatch = allText.match(/Prints?[`"']([^`"']+)[`"']/i);
  if (outputMatch) {
    return { type: 'output', expected: outputMatch[1] };
  }

  return { type: 'unknown' };
}

async function main() {
  mkdirSync(TMP_DIR, { recursive: true });

  const results = [];

  for (const ch of chapters) {
    const pad = String(ch).padStart(2, '0');
    console.log(`\n--- Verifying Chapter ${pad} ---`);

    // Fetch the chapter file to get code snippets from questions
    let chContent;
    try {
      const res = await fetch(`${RAW_BASE}/ch${pad}.md`);
      chContent = await res.text();
    } catch (e) {
      console.error(`  Failed to fetch chapter ${pad}: ${e.message}`);
      continue;
    }

    // Parse questions and extract code blocks
    const lines = chContent.split('\n');
    let inPQ = false;
    let inCode = false;
    let currentCode = '';
    let questionNum = 0;
    let questionCodes = [];
    let isJavaBlock = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (!inPQ && line.trim().startsWith('## Practice Questions')) {
        inPQ = true;
        continue;
      }
      if (!inPQ) continue;

      const qMatch = line.trim().match(/^\*\*(\d+)\.\s/);
      if (qMatch) {
        if (currentCode && questionNum > 0) {
          questionCodes.push({ num: questionNum, code: currentCode.trim() });
        }
        questionNum = parseInt(qMatch[1]);
        currentCode = '';
        inCode = false;
        isJavaBlock = false;
        continue;
      }

      // Check for code block start - only capture ```java blocks
      if (line.trim().startsWith('```') && !inCode) {
        isJavaBlock = line.trim().toLowerCase().startsWith('```java');
        if (isJavaBlock) {
          inCode = true;
          continue;
        }
      }
      
      // Check for code block end
      if (line.trim() === '```' && inCode) {
        inCode = false;
        isJavaBlock = false;
        continue;
      }

      if (inCode) {
        currentCode += line + '\n';
      }
    }
    if (currentCode && questionNum > 0) {
      questionCodes.push({ num: questionNum, code: currentCode.trim() });
    }

    console.log(`  Found ${questionCodes.length} questions with Java code`);

    // Load the exam file to get the expected answers
    let examContent;
    try {
      examContent = readFileSync(
        `${EXAMS_DIR}/ch${pad}.mdx`,
        'utf-8'
      );
    } catch (e) {
      console.error(`  Cannot read exam file for chapter ${pad}: ${e.message}`);
      continue;
    }

    // Extract YAML content (simplified parsing)
    const yamlMatch = examContent.match(/^---\n([\s\S]*?)\n---/);
    if (!yamlMatch) {
      console.error(`  Cannot parse YAML from exam file`);
      continue;
    }

    // Extract questions from YAML using regex
    const yaml = yamlMatch[1];
    const questionBlocks = yaml.split(/\n  - id:/).slice(1);

    for (const qc of questionCodes) {
      const qid = `ch${pad}-${String(qc.num).padStart(3, '0')}`;
      const block = questionBlocks.find(b => b.includes(`"${qid}"`));
      if (!block) {
        console.warn(`  ⚠️  Question ${qid} not found in exam file`);
        continue;
      }

      const correctMatch = block.match(/correct_answers:\s*\[(.*?)\]/);
      const correctLabels = correctMatch
        ? correctMatch[1].split(',').map(s => s.trim().replace(/"/g, ''))
        : [];

      const titleMatch = block.match(/title_en:\s*"(.*?)"/);
      const title = titleMatch ? titleMatch[1] : '';

      const expected = inferExpectedOutput(title, correctLabels);
      const codeText = qc.code.trim();

      if (!codeText) continue;

      console.log(`  Q${qc.num} (${correctLabels.join(',')}): verifying code`);

      const idx = parseInt(`${pad}${String(qc.num).padStart(2, '0')}`);
      const result = verifySnippet(codeText, idx);

      // Handle skipped snippets (multi-file, etc.)
      if (result.status === 'skipped') {
        console.log(`  Q${qc.num} (${correctLabels.join(',')}): ⏭️  ${result.error}`);
        results.push({
          chapter: ch,
          question: qc.num,
          status: 'skipped',
          error: result.error,
          match: '',
        });
        continue;
      }

      const statusStr =
        result.status === 'ok' ? '✅ compiles' : `❌ ${result.status}`;

      let matchStr = '';
      if (result.status === 'ok' && result.output) {
        if (expected.type === 'output') {
          const matches = result.output.includes(expected.expected);
          matchStr = matches ? ' ✓ output matches' : ` ✗ expected "${expected.expected}" got "${result.output}"`;
        } else {
          matchStr = ` output: "${result.output.slice(0, 80)}"`;
        }
      } else if (result.status === 'compile_error') {
        if (expected.type === 'compile_error') {
          matchStr = ' ✓ expected compile error';
        } else {
          matchStr = ` ✗ unexpected compile error: ${result.error?.slice(0, 100)}`;
        }
      } else if (result.status === 'run_error') {
        if (expected.type === 'run_error') {
          matchStr = ' ✓ expected runtime error';
        } else {
          matchStr = ` ✗ unexpected runtime error: ${result.error?.slice(0, 100)}`;
        }
      }

      const verdict =
        !matchStr.includes('✗') ? '✅' : '❌';
      console.log(`    ${verdict} ${statusStr}${matchStr}`);

      results.push({
        chapter: ch,
        question: qc.num,
        status: result.status,
        output: result.output,
        error: result.error,
        match: matchStr,
      });
    }
  }

  // Summary
  console.log('\n--- Summary ---');
  const ok = results.filter(r => !r.error && r.match?.includes('✓'));
  const fail = results.filter(r => r.error && r.status !== 'skipped' && r.match?.includes('✗'));
  const unknown = results.filter(r => r.match?.includes('output'));
  const skipped = results.filter(r => r.status === 'skipped');
  console.log(`  ✅ Verified: ${ok.length}`);
  console.log(`  ❌ Issues: ${fail.length}`);
  console.log(`  ⏭️  Skipped: ${skipped.length}`);
  console.log(`  ℹ️  Unknown (has output): ${unknown.length}`);
  console.log(`  Total code snippets tested: ${results.length}`);
}

main().catch(console.error);
