#!/usr/bin/env node

// Follow-up cadence analyzer for LucidIA
// Parses applications and follow-ups to identify overdue communications

import { readFileSync, existsSync } from 'fs';
import { resolve, join } from 'path';

const ROOT = resolve(import.meta.dirname, '..');
const TRACKER_PATH = join(ROOT, 'data', 'applications.md');
const FOLLOWUPS_PATH = join(ROOT, 'data', 'follow-ups.md');

function parseTracker() {
  if (!existsSync(TRACKER_PATH)) return [];
  const lines = readFileSync(TRACKER_PATH, 'utf-8').split('\n')
    .filter(l => l.startsWith('|') && !l.includes('---') && !l.includes('# '));

  return lines.slice(1).map(line => {
    const cols = line.split('|').map(c => c.trim()).filter(c => c);
    return {
      num: cols[0], date: cols[1], company: cols[2],
      role: cols[3], score: cols[4], status: cols[5],
      notes: cols[8] || '',
    };
  }).filter(r => r.status);
}

function parseFollowups() {
  if (!existsSync(FOLLOWUPS_PATH)) return [];
  const lines = readFileSync(FOLLOWUPS_PATH, 'utf-8').split('\n')
    .filter(l => l.startsWith('|') && !l.includes('---') && !l.includes('# '));

  return lines.slice(1).map(line => {
    const cols = line.split('|').map(c => c.trim()).filter(c => c);
    return {
      num: cols[0], appNum: cols[1], date: cols[2],
      company: cols[3], role: cols[4], channel: cols[5],
      contact: cols[6], notes: cols[7] || '',
    };
  });
}

function daysSince(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  return Math.floor((now - date) / (1000 * 60 * 60 * 24));
}

// Main analysis
const apps = parseTracker();
const followups = parseFollowups();
const activeStatuses = ['aplicada', 'respondida', 'entrevista'];

const results = { urgent: [], overdue: [], waiting: [], cold: [] };

for (const app of apps) {
  if (!activeStatuses.includes(app.status.toLowerCase())) continue;

  const appFollowups = followups.filter(f => f.appNum === app.num);
  const lastAction = appFollowups.length > 0
    ? appFollowups[appFollowups.length - 1].date
    : app.date;

  const days = daysSince(lastAction);
  const followupCount = appFollowups.length;

  const entry = {
    num: app.num, company: app.company, role: app.role,
    status: app.status, days, followupCount,
    lastAction, contact: appFollowups[appFollowups.length - 1]?.contact || '',
  };

  // Classify
  if (app.status.toLowerCase() === 'respondida' && days >= 1) {
    results.urgent.push(entry);
  } else if (followupCount >= 2 && days >= 7) {
    results.cold.push(entry);
  } else if (
    (app.status.toLowerCase() === 'aplicada' && days >= 7 && followupCount === 0) ||
    (app.status.toLowerCase() === 'aplicada' && days >= 14 && followupCount === 1) ||
    (app.status.toLowerCase() === 'entrevista' && days >= 1 && followupCount === 0)
  ) {
    results.overdue.push(entry);
  } else {
    results.waiting.push(entry);
  }
}

// Output
if (process.argv.includes('--json')) {
  console.log(JSON.stringify(results, null, 2));
} else {
  const total = results.urgent.length + results.overdue.length + results.waiting.length + results.cold.length;
  console.log(`LucidIA - Cadência de Follow-up\n`);
  console.log(`Candidaturas ativas: ${total}`);

  if (results.urgent.length > 0) {
    console.log(`\nURGENTE (${results.urgent.length}):`);
    for (const e of results.urgent) {
      console.log(`  #${e.num} ${e.company} - ${e.role} (${e.days} dias sem resposta)`);
    }
  }

  if (results.overdue.length > 0) {
    console.log(`\nATRASADO (${results.overdue.length}):`);
    for (const e of results.overdue) {
      console.log(`  #${e.num} ${e.company} - ${e.role} (${e.days} dias, ${e.followupCount} follow-ups)`);
    }
  }

  if (results.waiting.length > 0) {
    console.log(`\nAGUARDANDO (${results.waiting.length}):`);
    for (const e of results.waiting) {
      console.log(`  #${e.num} ${e.company} - ${e.role} (${e.days} dias)`);
    }
  }

  if (results.cold.length > 0) {
    console.log(`\nFRIO (${results.cold.length}):`);
    for (const e of results.cold) {
      console.log(`  #${e.num} ${e.company} - ${e.role} (${e.followupCount} follow-ups sem resposta)`);
    }
  }
}
