#!/usr/bin/env node

// Validates consistency across cv.md, config/profile.yml, and modes/_profile.md
// Run once per session to catch configuration drift

import { existsSync, readFileSync } from 'fs';
import { resolve, join } from 'path';

const ROOT = resolve(import.meta.dirname, '..');

const green = (text) => `\x1b[32m✓\x1b[0m ${text}`;
const yellow = (text) => `\x1b[33m!\x1b[0m ${text}`;

let issues = 0;

function fileExists(path) {
  return existsSync(join(ROOT, path));
}

function readFile(path) {
  const fullPath = join(ROOT, path);
  if (!existsSync(fullPath)) return null;
  return readFileSync(fullPath, 'utf-8');
}

console.log('LucidIA - Verificação de Consistência');
console.log('');

// Check required files exist
if (!fileExists('cv.md')) {
  console.log(yellow('cv.md não encontrado. Execute /lucidia para onboarding.'));
  issues++;
}

if (!fileExists('config/profile.yml')) {
  console.log(yellow('config/profile.yml não encontrado. Copie de config/profile.example.yml.'));
  issues++;
}

// Check profile.yml has been customized
const profile = readFile('config/profile.yml');
if (profile && profile.includes('Seu Nome Completo')) {
  console.log(yellow('config/profile.yml ainda contém dados de exemplo. Preencha com seus dados reais.'));
  issues++;
}

// Check _profile.md exists, create from template if not
if (!fileExists('modes/_profile.md') && fileExists('modes/_profile.template.md')) {
  console.log(yellow('modes/_profile.md não existe. Será criado do template na próxima avaliação.'));
  issues++;
}

// Check cv.md is not empty
const cv = readFile('cv.md');
if (cv !== null && cv.trim().length < 100) {
  console.log(yellow('cv.md parece muito curto. Verifique se seu currículo está completo.'));
  issues++;
}

// Check data directory has tracker
if (!fileExists('data/applications.md')) {
  console.log(yellow('data/applications.md não encontrado. Será criado na primeira avaliação.'));
  issues++;
}

// Summary
if (issues === 0) {
  console.log(green('Todos os arquivos estão consistentes.'));
} else {
  console.log('');
  console.log(`${issues} item(ns) precisam de atenção.`);
}

// Output JSON for agent consumption
const result = {
  status: issues === 0 ? 'ok' : 'needs-attention',
  issues,
  files: {
    cv: fileExists('cv.md'),
    profile: fileExists('config/profile.yml'),
    profileCustomized: profile ? !profile.includes('Seu Nome Completo') : false,
    userProfile: fileExists('modes/_profile.md'),
    tracker: fileExists('data/applications.md'),
    portals: fileExists('portals.yml'),
  }
};

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(result, null, 2));
}
