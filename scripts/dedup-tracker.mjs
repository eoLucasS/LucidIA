#!/usr/bin/env node

// Remove duplicate entries from the application tracker
// Keeps the entry with the highest score, marks others as DUP

import { readFileSync, existsSync, writeFileSync } from 'fs';
import { resolve, join } from 'path';

const ROOT = resolve(import.meta.dirname, '..');
const TRACKER_PATH = join(ROOT, 'data', 'applications.md');

if (!existsSync(TRACKER_PATH)) {
  console.log('data/applications.md não encontrado.');
  process.exit(0);
}

const content = readFileSync(TRACKER_PATH, 'utf-8');
const lines = content.split('\n');

const headerLines = [];
const dataLines = [];
const otherLines = [];

for (const line of lines) {
  if (line.startsWith('|') && line.includes('---')) {
    headerLines.push(line);
  } else if (line.startsWith('|') && headerLines.length > 0 && dataLines.length === 0 && !line.includes('#')) {
    // This is the header row
    headerLines.unshift(line);
  } else if (line.startsWith('|') && (headerLines.length > 0 || dataLines.length > 0)) {
    dataLines.push(line);
  } else {
    otherLines.push(line);
  }
}

// Parse and group by company+role
const entries = dataLines.map(line => {
  const cols = line.split('|').map(c => c.trim()).filter(c => c);
  const score = parseFloat(cols[4] || '0');
  return { cols, score, raw: line, key: `${(cols[2] || '').toLowerCase()}|${(cols[3] || '').toLowerCase()}` };
});

const groups = new Map();
for (const entry of entries) {
  if (!groups.has(entry.key)) {
    groups.set(entry.key, []);
  }
  groups.get(entry.key).push(entry);
}

let removed = 0;
const result = [];

for (const [key, group] of groups) {
  if (group.length === 1) {
    result.push(group[0].raw);
    continue;
  }

  // Sort by score descending, keep the best
  group.sort((a, b) => b.score - a.score);
  result.push(group[0].raw); // Keep highest score

  for (let i = 1; i < group.length; i++) {
    // Mark as DUP
    const cols = group[i].raw.split('|').map(c => c.trim());
    cols[5] = ' DUP '; // Score column
    cols[6] = ' Descartada '; // Status column
    result.push('| ' + cols.slice(1, -1).join(' | ') + ' |');
    removed++;
    console.log(`  Duplicata: #${group[i].cols[0]} ${group[i].cols[2]} - ${group[i].cols[3]} (score: ${group[i].score})`);
  }
}

if (removed === 0) {
  console.log('Nenhuma duplicata encontrada.');
  process.exit(0);
}

if (process.argv.includes('--dry-run')) {
  console.log(`\n[DRY RUN] ${removed} duplicata(s) seriam marcadas.`);
  process.exit(0);
}

// Rebuild file
const output = [...otherLines.filter(l => l.trim()), '', ...headerLines, ...result, ''].join('\n');
writeFileSync(TRACKER_PATH, output, 'utf-8');
console.log(`\n${removed} duplicata(s) marcada(s) como DUP.`);
