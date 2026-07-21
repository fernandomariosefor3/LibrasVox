#!/usr/bin/env node
/**
 * Build determinístico do runtime da função Vercel.
 *
 * Compila server/assistant.ts (mais os módulos puros de api/_lib/,
 * knowledge/ e mcp/ que ele importa) para JavaScript dentro de
 * api/_generated/, usando o TypeScript já instalado no projeto (sem
 * npx, sem instalar nada). api/_generated/ é o único diretório que este
 * script tem permissão de apagar — nenhum arquivo-fonte é tocado.
 */
import { createRequire } from 'node:module';
import { existsSync, rmSync, readdirSync, readFileSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const require = createRequire(import.meta.url);

const __filename = fileURLToPath(import.meta.url);
const SCRIPTS_DIR = dirname(__filename);
const PROJECT_ROOT = dirname(SCRIPTS_DIR);

const RUNTIME_TSCONFIG = join(PROJECT_ROOT, 'tsconfig.api.runtime.json');
const GENERATED_DIR = join(PROJECT_ROOT, 'api', '_generated');
const ASSISTANT_JS = join(GENERATED_DIR, 'server', 'assistant.js');
const ASSISTANT_DTS = join(GENERATED_DIR, 'server', 'assistant.d.ts');
const CORPUS_ENTRIES_DIR = join(GENERATED_DIR, 'knowledge', 'corpus', 'entries');
const REQUIRED_CORPUS_FILES = ['ola.js', 'obrigado.js', 'tchau.js'];

const RELATIVE_TS_IMPORT_PATTERN =
  /(?:\bfrom\s+|\bimport\s*\(|\brequire\s*\()\s*['"](\.[^'"]*\.(?:ts|tsx|mts|cts))['"]/;

function log(message) {
  console.log(`[build-vercel-api] ${message}`);
}

function fail(message) {
  console.error(`[build-vercel-api] ERRO: ${message}`);
  process.exit(1);
}

/** Apaga exclusivamente api/_generated/ — nunca toca em arquivos-fonte. */
function cleanGeneratedDir() {
  if (!GENERATED_DIR.endsWith(join('api', '_generated'))) {
    fail('caminho de limpeza inesperado — abortando por segurança.');
  }
  if (existsSync(GENERATED_DIR)) {
    rmSync(GENERATED_DIR, { recursive: true, force: true });
  }
  log(`diretório de saída limpo: ${relative(PROJECT_ROOT, GENERATED_DIR)}`);
}

/** Executa o TypeScript já instalado localmente (sem npx, sem instalar nada). */
function runTypeScriptCompiler() {
  if (!existsSync(RUNTIME_TSCONFIG)) {
    fail(`tsconfig de runtime não encontrado: ${relative(PROJECT_ROOT, RUNTIME_TSCONFIG)}`);
  }

  const tscBinPath = require.resolve('typescript/bin/tsc');

  try {
    execFileSync(process.execPath, [tscBinPath, '--project', RUNTIME_TSCONFIG], {
      cwd: PROJECT_ROOT,
      stdio: 'inherit',
    });
  } catch {
    fail('tsc retornou código de saída diferente de zero — build abortado.');
  }
  log('tsc concluído com sucesso.');
}

/** Confirma que o handler compilado e sua declaração de tipos existem. */
function assertHandlerEmitted() {
  if (!existsSync(ASSISTANT_JS)) {
    fail(`arquivo esperado não encontrado: ${relative(PROJECT_ROOT, ASSISTANT_JS)}`);
  }
  if (!existsSync(ASSISTANT_DTS)) {
    fail(`arquivo esperado não encontrado: ${relative(PROJECT_ROOT, ASSISTANT_DTS)}`);
  }
  log('server/assistant.js e server/assistant.d.ts confirmados.');
}

function listJsFilesRecursively(dir) {
  const files = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...listJsFilesRecursively(fullPath));
    } else if (entry.name.endsWith('.js')) {
      files.push(fullPath);
    }
  }
  return files;
}

/**
 * Falha se qualquer import/export/require relativo, em qualquer .js
 * emitido, terminar em extensão TypeScript (.ts/.tsx/.mts/.cts). Reporta
 * só o caminho do arquivo — nunca o conteúdo da linha.
 */
function assertNoRelativeTypeScriptExtensions() {
  const jsFiles = listJsFilesRecursively(GENERATED_DIR);
  const offenders = [];
  for (const file of jsFiles) {
    const content = readFileSync(file, 'utf8');
    if (content.split('\n').some((line) => RELATIVE_TS_IMPORT_PATTERN.test(line))) {
      offenders.push(relative(PROJECT_ROOT, file));
    }
  }
  if (offenders.length > 0) {
    fail(`import/export relativo com extensão TypeScript encontrado em: ${offenders.join(', ')}`);
  }
  log(`${jsFiles.length} arquivo(s) .js verificados — nenhum import relativo com extensão TypeScript.`);
}

/** Confirma que o corpus (ola/obrigado/tchau) foi emitido — sem inspecionar conteúdo. */
function assertCorpusEntriesEmitted() {
  const missing = REQUIRED_CORPUS_FILES.filter(
    (name) => !existsSync(join(CORPUS_ENTRIES_DIR, name)),
  );
  if (missing.length > 0) {
    fail(`entradas de corpus não emitidas: ${missing.join(', ')}`);
  }
  log('entradas de corpus emitidas: ola.js, obrigado.js, tchau.js.');
}

function main() {
  log(`raiz do projeto: ${PROJECT_ROOT}`);
  cleanGeneratedDir();
  runTypeScriptCompiler();
  assertHandlerEmitted();
  assertNoRelativeTypeScriptExtensions();
  assertCorpusEntriesEmitted();
  log('runtime da API gerado com sucesso em api/_generated/.');
}

main();
