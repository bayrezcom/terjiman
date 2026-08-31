/**
 * Sends the same sentences through several models and prints the results side
 * by side, so the choice of model rests on evidence rather than reputation.
 *
 * Every candidate runs through the app's real TranslationService — the same
 * prompt, the same output cleanup, the same validation the product uses — so
 * what you read here is what users would get.
 *
 *   npx tsx scripts/compare-models.ts models.json
 *
 * models.json (keep it out of git — it names your key variables):
 * [
 *   { "label": "gpt-4o",      "model": "gpt-4o",       "apiKeyEnv": "OPENAI_API_KEY" },
 *   { "label": "gemini",      "model": "gemini-2.0-flash",
 *     "baseUrl": "https://generativelanguage.googleapis.com/v1beta/openai",
 *     "apiKeyEnv": "GEMINI_API_KEY" },
 *   { "label": "qwen-plus",   "model": "qwen-plus",
 *     "baseUrl": "https://dashscope-intl.aliyuncs.com/compatible-mode/v1",
 *     "apiKeyEnv": "DASHSCOPE_API_KEY" },
 *   { "label": "claude",      "provider": "anthropic", "model": "claude-sonnet-4-5",
 *     "apiKeyEnv": "ANTHROPIC_API_KEY" }
 * ]
 */
import { readFileSync } from 'node:fs';
import { loadConfig, type AiProviderName, type AppConfig } from '../src/config/env.js';
import { TranslationService } from '../src/services/TranslationService.js';
import { looksLikeUyghur } from '../src/services/scriptHeuristics.js';
import { createProvider } from '../src/services/ai/createProvider.js';

interface Candidate {
  label: string;
  provider?: AiProviderName;
  model: string;
  baseUrl?: string;
  apiKeyEnv: string;
}

interface Case {
  name: string;
  from: string;
  to: string;
  text: string;
  /** Substrings that must survive translation untouched. */
  keep?: string[];
}

/**
 * Cases are chosen to expose the specific ways models fail at Uyghur: writing
 * Arabic instead, drifting into Turkish or Uzbek, mangling names and numbers,
 * and flattening register.
 */
const CASES: Case[] = [
  { name: 'en→ug simple', from: 'en', to: 'ug', text: 'Welcome to Dubai.' },
  {
    name: 'en→ug names+numbers',
    from: 'en',
    to: 'ug',
    text: 'Dr. Ahmet will call you on 15 March at 09:30. See bayrez.com for details.',
    keep: ['15', '09:30', 'bayrez.com'],
  },
  { name: 'ug→en greeting', from: 'ug', to: 'en', text: 'ياخشىمۇسىز؟ بۈگۈن قانداقراق؟' },
  { name: 'ug→tr sentence', from: 'ug', to: 'tr', text: 'مەن دۇبەيدە ئائىلەم بىلەن ياشايمەن.' },
  { name: 'ar→ug (confusion trap)', from: 'ar', to: 'ug', text: 'مرحبا بكم في دبي.' },
  { name: 'zh→ug', from: 'zh-Hans', to: 'ug', text: '欢迎来到迪拜。我在这里工作了三年。' },
  {
    name: 'en→ug colloquial',
    from: 'en',
    to: 'ug',
    text: "Don't worry about it, we'll sort it out tomorrow.",
  },
  { name: 'auto→ug from English', from: 'auto', to: 'ug', text: 'The weather is lovely today.' },
];

function buildConfig(base: AppConfig, candidate: Candidate): AppConfig {
  const apiKey = process.env[candidate.apiKeyEnv];
  if (!apiKey) throw new Error(`${candidate.apiKeyEnv} is not set`);
  return {
    ...base,
    aiProvider: candidate.provider ?? 'openai',
    aiModel: candidate.model,
    aiApiKey: apiKey,
    aiBaseUrl: candidate.baseUrl,
    logLevel: 'silent',
  };
}

/** Objective checks a reader can trust before judging fluency by eye. */
function inspect(testCase: Case, output: string): string[] {
  const notes: string[] = [];
  if (testCase.to === 'ug' && !looksLikeUyghur(output)) {
    notes.push('NOT UYGHUR SCRIPT');
  }
  for (const fragment of testCase.keep ?? []) {
    if (!output.includes(fragment)) notes.push(`dropped "${fragment}"`);
  }
  if (output.trim() === testCase.text.trim()) notes.push('echoed the input');
  return notes;
}

async function main(): Promise<void> {
  const path = process.argv[2];
  if (!path) {
    console.error('usage: npx tsx scripts/compare-models.ts <models.json>');
    process.exit(1);
  }

  const candidates = JSON.parse(readFileSync(path, 'utf8')) as Candidate[];
  const base = loadConfig();
  const scores = new Map<string, { ok: number; flagged: number; failed: number; ms: number }>();

  for (const testCase of CASES) {
    console.log(`\n\x1b[1m${testCase.name}\x1b[0m  ${testCase.from} → ${testCase.to}`);
    console.log(`  input   ${testCase.text}`);

    for (const candidate of candidates) {
      const score = scores.get(candidate.label) ?? { ok: 0, flagged: 0, failed: 0, ms: 0 };
      const started = Date.now();
      try {
        const service = new TranslationService(
          createProvider(buildConfig(base, candidate)),
          base,
        );
        const result = await service.translate({
          sourceLanguage: testCase.from,
          targetLanguage: testCase.to,
          text: testCase.text,
        });
        const elapsed = Date.now() - started;
        score.ms += elapsed;

        const notes = inspect(testCase, result.translation);
        if (notes.length > 0) score.flagged += 1;
        else score.ok += 1;

        const flag = notes.length > 0 ? `  \x1b[31m← ${notes.join(', ')}\x1b[0m` : '';
        console.log(`  ${candidate.label.padEnd(12)} ${result.translation}${flag}   ${elapsed}ms`);
      } catch (error) {
        score.failed += 1;
        const message = error instanceof Error ? error.message : String(error);
        console.log(`  ${candidate.label.padEnd(12)} \x1b[31mFAILED\x1b[0m ${message}`);
      }
      scores.set(candidate.label, score);
    }
  }

  console.log('\n\x1b[1mSummary\x1b[0m  (clean = passed the objective checks)');
  console.log('  model         clean  flagged  failed   avg');
  for (const [label, score] of scores) {
    const attempts = score.ok + score.flagged || 1;
    console.log(
      `  ${label.padEnd(12)} ${String(score.ok).padStart(5)}` +
        `${String(score.flagged).padStart(9)}${String(score.failed).padStart(8)}` +
        `${String(Math.round(score.ms / attempts)).padStart(7)}ms`,
    );
  }
  console.log(
    '\nThe checks catch wrong script, dropped names and numbers, and untranslated\n' +
      'echoes. They cannot judge whether the Uyghur reads naturally — put the\n' +
      'output in front of a native speaker before you decide.\n',
  );
}

void main();
