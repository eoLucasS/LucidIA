#!/usr/bin/env node

// Pipeline health check for LucidIA
// Validates tracker integrity: statuses, report links, scores, duplicates

import { readFileSync, existsSync } from 'fs';
import { resolve, join } from 'path';
import YAML from 'js-yaml';

const ROOT = resolve(import.meta.dirname, '..');

const green = (t) => `\x1b[32m✓\x1b[0m ${t}`;
const red = (t) => `\x1b[31m✗\x1b[0m ${t}`;
const yellow = (t) => `\x1b[33m!\x1b[0m ${t}`;

let errors = 0;
let warnings = 0;
let ok = 0;

// Load canonical states
function loadStates() {
  const statesPath = join(ROOT, 'templates', 'states.yml');
  if (!existsSync(statesPath)) return new Set();
  const data = YAML.load(readFileSync(statesPath, 'utf-8'));
  const allNames = new Set();
  for (const state of (data.estados || [])) {
    allNames.add(state.canonical.toLowerCase());
    for (const alias of (state.aliases || [])) {
      allNames.add(alias.toLowerCase());
    }
  }
  return allNames;
}

// Parse tracker table
function parseTracker() {
  const trackerPath = join(ROOT, 'data', 'applications.md');
  if (!existsSync(trackerPath)) {
    console.log(yellow('data/applications.md não encontrado'));
    return [];
  }

  const content = readFileSync(trackerPath, 'utf-8');
  const lines = content.split('\n').filter(l => l.startsWith('|') && !l.includes('---'));

  // Skip header row
  const dataLines = lines.slice(1);
  const rows = [];

  for (const line of dataLines) {
    const cols = line.split('|').map(c => c.trim()).filter(c => c);
    if (cols.length < 6) continue;

    rows.push({
      num: cols[0],
      date: cols[1],
      company: cols[2],
      role: cols[3],
      score: cols[4],
      status: cols[5],
      pdf: cols[6] || '',
      report: cols[7] || '',
      notes: cols[8] || '',
      raw: line,
    });
  }

  return rows;
}

console.log('LucidIA - Verificação do Pipeline\n');

const validStates = loadStates();
const rows = parseTracker();

if (rows.length === 0) {
  console.log(yellow('Tracker vazio ou não encontrado. Nada para verificar.'));
  process.exit(0);
}

console.log(`Verificando ${rows.length} entrada(s)...\n`);

// Check each row
const seen = new Map(); // company+role -> row

for (const row of rows) {
  // Check status is canonical
  if (validStates.size > 0 && !validStates.has(row.status.toLowerCase())) {
    console.log(red(`#${row.num}: Status "${row.status}" não é canônico`));
    errors++;
  } else {
    ok++;
  }

  // Check score format
  const scoreMatch = row.score.match(/^(\d+\.?\d*)\/5$|^N\/A$|^DUP$/);
  if (!scoreMatch) {
    console.log(red(`#${row.num}: Score "${row.score}" formato inválido (esperado: X.X/5, N/A, ou DUP)`));
    errors++;
  } else {
    const scoreVal = parseFloat(row.score);
    if (!isNaN(scoreVal) && (scoreVal < 1 || scoreVal > 5)) {
      console.log(red(`#${row.num}: Score ${scoreVal} fora do range 1-5`));
      errors++;
    } else {
      ok++;
    }
  }

  // Check report link exists
  const reportMatch = row.report.match(/\[.*?\]\((reports\/[^)]+)\)/);
  if (reportMatch) {
    const reportPath = join(ROOT, reportMatch[1]);
    if (!existsSync(reportPath)) {
      console.log(yellow(`#${row.num}: Relatório referenciado não encontrado: ${reportMatch[1]}`));
      warnings++;
    } else {
      ok++;
    }
  }

  // Check duplicates
  const key = `${row.company.toLowerCase()}|${row.role.toLowerCase()}`;
  if (seen.has(key) && row.score !== 'DUP') {
    console.log(yellow(`#${row.num}: Possível duplicata de #${seen.get(key)} (${row.company} - ${row.role})`));
    warnings++;
  } else {
    seen.set(key, row.num);
  }

  // Check date format
  if (!row.date.match(/^\d{4}-\d{2}-\d{2}$/)) {
    console.log(yellow(`#${row.num}: Data "${row.date}" formato inesperado (esperado: YYYY-MM-DD)`));
    warnings++;
  }
}

// Check for pending batch results
const batchDir = join(ROOT, 'batch', 'tracker-additions');
if (existsSync(batchDir)) {
  const { readdirSync } = await import('fs');
  const pending = readdirSync(batchDir).filter(f => f.endsWith('.tsv'));
  if (pending.length > 0) {
    console.log(yellow(`${pending.length} arquivo(s) pendente(s) em batch/tracker-additions/. Execute: npm run merge`));
    warnings++;
  }
}

// Summary
console.log(`\nResultado:`);
console.log(`  ${green(`${ok} verificações OK`)}`);
if (warnings > 0) console.log(`  ${yellow(`${warnings} aviso(s)`)}`);
if (errors > 0) console.log(`  ${red(`${errors} erro(s)`)}`);

if (errors > 0) process.exit(1);
