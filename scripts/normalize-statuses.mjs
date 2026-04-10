#!/usr/bin/env node

// Normalize application statuses to canonical values
// Maps aliases (PT-BR, EN, informal) to the 8 canonical states

import { readFileSync, existsSync, writeFileSync } from 'fs';
import { resolve, join } from 'path';
import YAML from 'js-yaml';

const ROOT = resolve(import.meta.dirname, '..');
const TRACKER_PATH = join(ROOT, 'data', 'applications.md');
const STATES_PATH = join(ROOT, 'templates', 'states.yml');

// Build alias map
function buildAliasMap() {
  if (!existsSync(STATES_PATH)) {
    console.error('templates/states.yml não encontrado.');
    process.exit(1);
  }

  const data = YAML.load(readFileSync(STATES_PATH, 'utf-8'));
  const map = new Map();

  for (const state of (data.estados || [])) {
    map.set(state.canonical.toLowerCase(), state.canonical);
    for (const alias of (state.aliases || [])) {
      map.set(alias.toLowerCase(), state.canonical);
    }
  }

  return map;
}

// Main
if (!existsSync(TRACKER_PATH)) {
  console.log('data/applications.md não encontrado.');
  process.exit(0);
}

const aliasMap = buildAliasMap();
const content = readFileSync(TRACKER_PATH, 'utf-8');
const lines = content.split('\n');
let changed = 0;

const normalized = lines.map(line => {
  if (!line.startsWith('|') || line.includes('---')) return line;

  const cols = line.split('|').map(c => c.trim());
  // cols[0] is empty (before first |), data starts at cols[1]
  const statusIdx = 6; // | # | Data | Empresa | Cargo | Score | Status | ...
  const status = cols[statusIdx];

  if (!status) return line;

  const canonical = aliasMap.get(status.toLowerCase());
  if (canonical && canonical !== status) {
    cols[statusIdx] = canonical;
    changed++;
    console.log(`  "${status}" -> "${canonical}"`);
    return '| ' + cols.slice(1, -1).join(' | ') + ' |';
  }

  return line;
});

if (changed > 0) {
  if (process.argv.includes('--dry-run')) {
    console.log(`\n[DRY RUN] ${changed} status(es) seriam normalizados.`);
  } else {
    writeFileSync(TRACKER_PATH, normalized.join('\n'), 'utf-8');
    console.log(`\n${changed} status(es) normalizado(s).`);
  }
} else {
  console.log('Todos os status já estão no formato canônico.');
}
