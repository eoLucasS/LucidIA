#!/usr/bin/env node

// Rejection pattern analysis for LucidIA
// Analyzes application outcomes to identify what works and what doesn't

import { readFileSync, existsSync, readdirSync } from 'fs';
import { resolve, join } from 'path';

const ROOT = resolve(import.meta.dirname, '..');
const TRACKER_PATH = join(ROOT, 'data', 'applications.md');
const REPORTS_DIR = join(ROOT, 'reports');

function parseTracker() {
  if (!existsSync(TRACKER_PATH)) return [];
  const lines = readFileSync(TRACKER_PATH, 'utf-8').split('\n')
    .filter(l => l.startsWith('|') && !l.includes('---') && !l.includes('# '));

  return lines.slice(1).map(line => {
    const cols = line.split('|').map(c => c.trim()).filter(c => c);
    const score = parseFloat(cols[4]) || 0;
    return {
      num: cols[0], date: cols[1], company: cols[2],
      role: cols[3], score, status: cols[5],
      pdf: cols[6], report: cols[7], notes: cols[8] || '',
    };
  }).filter(r => r.status);
}

function classifyOutcome(status) {
  const s = status.toLowerCase();
  if (['entrevista', 'oferta', 'respondida'].includes(s)) return 'positive';
  if (['rejeitada', 'descartada'].includes(s)) return 'negative';
  if (['skip'].includes(s)) return 'self_filtered';
  if (['aplicada'].includes(s)) return 'pending';
  return 'pending';
}

// Main
const apps = parseTracker();
const withOutcome = apps.filter(a => !['avaliada', 'skip'].includes(a.status.toLowerCase()));

if (withOutcome.length < 5) {
  console.log(`Dados insuficientes: ${withOutcome.length} candidatura(s) com resultado.`);
  console.log('São necessárias pelo menos 5 para análise de padrões.');
  process.exit(0);
}

// Analysis
const analysis = {
  metadata: {
    total: apps.length,
    withOutcome: withOutcome.length,
    dateRange: { from: apps[apps.length - 1]?.date, to: apps[0]?.date },
  },
  funnel: {},
  scoreVsOutcome: { positive: [], negative: [], pending: [] },
  recommendations: [],
};

// Funnel
for (const app of apps) {
  const status = app.status.toLowerCase();
  analysis.funnel[status] = (analysis.funnel[status] || 0) + 1;
}

// Score vs outcome
for (const app of withOutcome) {
  const outcome = classifyOutcome(app.status);
  if (analysis.scoreVsOutcome[outcome]) {
    analysis.scoreVsOutcome[outcome].push(app.score);
  }
}

// Calculate averages
const avgScore = (arr) => arr.length > 0 ? (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1) : 'N/A';

const positiveAvg = avgScore(analysis.scoreVsOutcome.positive);
const negativeAvg = avgScore(analysis.scoreVsOutcome.negative);

// Score threshold recommendation
const allPositiveScores = analysis.scoreVsOutcome.positive;
const minPositiveScore = allPositiveScores.length > 0 ? Math.min(...allPositiveScores) : 0;
analysis.recommendedThreshold = Math.max(3.5, minPositiveScore - 0.5);

// Recommendations
if (parseFloat(positiveAvg) > 0 && parseFloat(negativeAvg) > 0) {
  if (parseFloat(negativeAvg) < 3.5) {
    analysis.recommendations.push({
      action: 'Aumentar limiar de score para candidatura',
      reason: `Score médio de rejeições (${negativeAvg}) está abaixo de 3.5. Candidaturas com score baixo desperdiçam tempo.`,
      impact: 'alto',
    });
  }
}

const applicationRate = (analysis.funnel['aplicada'] || 0) / apps.length;
if (applicationRate > 0.8) {
  analysis.recommendations.push({
    action: 'Ser mais seletivo nas candidaturas',
    reason: `${(applicationRate * 100).toFixed(0)}% das vagas avaliadas foram aplicadas. Filosofia de qualidade recomenda mais filtragem.`,
    impact: 'medio',
  });
}

// Output
if (process.argv.includes('--json')) {
  console.log(JSON.stringify(analysis, null, 2));
} else if (process.argv.includes('--summary')) {
  console.log('LucidIA - Análise de Padrões\n');
  console.log(`Total de candidaturas: ${analysis.metadata.total}`);
  console.log(`Com resultado: ${analysis.metadata.withOutcome}`);
  console.log(`Score médio positivo: ${positiveAvg}`);
  console.log(`Score médio negativo: ${negativeAvg}`);
  console.log(`Limiar recomendado: ${analysis.recommendedThreshold}`);

  if (analysis.recommendations.length > 0) {
    console.log('\nRecomendações:');
    for (const rec of analysis.recommendations) {
      console.log(`  [${rec.impact}] ${rec.action}`);
      console.log(`    ${rec.reason}`);
    }
  }
} else {
  console.log(JSON.stringify(analysis, null, 2));
}
