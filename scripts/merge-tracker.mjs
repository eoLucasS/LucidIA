#!/usr/bin/env node

// Merge batch evaluation results into the main tracker
// Reads TSV files from batch/tracker-additions/ and appends to data/applications.md

import { readFileSync, existsSync, writeFileSync, readdirSync, mkdirSync, renameSync } from 'fs';
import { resolve, join } from 'path';

const ROOT = resolve(import.meta.dirname, '..');
const ADDITIONS_DIR = join(ROOT, 'batch', 'tracker-additions');
const MERGED_DIR = join(ADDITIONS_DIR, 'merged');
const TRACKER_PATH = join(ROOT, 'data', 'applications.md');

const dryRun = process.argv.includes('--dry-run');

function loadTracker() {
  if (!existsSync(TRACKER_PATH)) return { header: '', rows: [] };
  const content = readFileSync(TRACKER_PATH, 'utf-8');
  const lines = content.split('\n');
  const headerLines = lines.filter(l => l.startsWith('|')).slice(0, 2);
  const dataLines = lines.filter(l => l.startsWith('|')).slice(2);

  const rows = dataLines.map(line => {
    const cols = line.split('|').map(c => c.trim()).filter(c => c);
    return {
      company: (cols[2] || '').toLowerCase(),
      role: (cols[3] || '').toLowerCase(),
      score: cols[4] || '',
      raw: line,
    };
  });

  return { header: headerLines.join('\n'), rows };
}

function parseTSVLine(line) {
  const cols = line.split('\t');
  if (cols.length < 8) return null;
  return {
    num: cols[0],
    date: cols[1],
    company: cols[2],
    role: cols[3],
    score: cols[4],
    status: cols[5],
    pdf: cols[6],
    report: cols[7],
    notes: cols[8] || '',
  };
}

function tsvToMarkdownRow(entry) {
  return `| ${entry.num} | ${entry.date} | ${entry.company} | ${entry.role} | ${entry.score} | ${entry.status} | ${entry.pdf} | ${entry.report} | ${entry.notes} |`;
}

// Main
if (!existsSync(ADDITIONS_DIR)) {
  console.log('Nenhum resultado de batch para processar.');
  process.exit(0);
}

const files = readdirSync(ADDITIONS_DIR).filter(f => f.endsWith('.tsv'));
if (files.length === 0) {
  console.log('Nenhum arquivo TSV pendente em batch/tracker-additions/.');
  process.exit(0);
}

console.log(`LucidIA - Merge de Resultados\n`);
console.log(`Arquivos encontrados: ${files.length}`);

const tracker = loadTracker();
let added = 0;
let updated = 0;
let skipped = 0;

const newRows = [];

for (const file of files) {
  const content = readFileSync(join(ADDITIONS_DIR, file), 'utf-8').trim();
  if (!content) continue;

  for (const line of content.split('\n')) {
    const entry = parseTSVLine(line);
    if (!entry) continue;

    // Check for duplicates
    const existing = tracker.rows.find(
      r => r.company === entry.company.toLowerCase() && r.role === entry.role.toLowerCase()
    );

    if (existing) {
      const existingScore = parseFloat(existing.score);
      const newScore = parseFloat(entry.score);
      if (!isNaN(newScore) && !isNaN(existingScore) && newScore > existingScore) {
        console.log(`  Atualizado: ${entry.company} - ${entry.role} (${existing.score} -> ${entry.score})`);
        updated++;
        newRows.push(tsvToMarkdownRow(entry));
      } else {
        console.log(`  Duplicata ignorada: ${entry.company} - ${entry.role}`);
        skipped++;
      }
    } else {
      console.log(`  Adicionado: ${entry.company} - ${entry.role} (${entry.score})`);
      newRows.push(tsvToMarkdownRow(entry));
      added++;
    }
  }
}

if (dryRun) {
  console.log(`\n[DRY RUN] ${added} a adicionar, ${updated} a atualizar, ${skipped} duplicatas`);
  console.log('Nenhum arquivo foi modificado.');
  process.exit(0);
}

// Append to tracker
if (newRows.length > 0) {
  let trackerContent = existsSync(TRACKER_PATH)
    ? readFileSync(TRACKER_PATH, 'utf-8')
    : `| # | Data | Empresa | Cargo | Score | Status | PDF | Relatório | Notas |\n|---|------|---------|-------|-------|--------|-----|-----------|-------|\n`;

  trackerContent = trackerContent.trimEnd() + '\n' + newRows.join('\n') + '\n';
  writeFileSync(TRACKER_PATH, trackerContent, 'utf-8');
}

// Move processed files
if (!existsSync(MERGED_DIR)) mkdirSync(MERGED_DIR, { recursive: true });
for (const file of files) {
  renameSync(join(ADDITIONS_DIR, file), join(MERGED_DIR, file));
}

console.log(`\nResultado: ${added} adicionados, ${updated} atualizados, ${skipped} duplicatas`);
console.log('Arquivos movidos para batch/tracker-additions/merged/');
