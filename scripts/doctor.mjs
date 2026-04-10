#!/usr/bin/env node

// Setup validator for LucidIA
// Checks all prerequisites and configuration files

import { existsSync } from 'fs';
import { execSync } from 'child_process';
import { resolve, join } from 'path';

const ROOT = resolve(import.meta.dirname, '..');

const green = (text) => `\x1b[32m✓\x1b[0m ${text}`;
const red = (text) => `\x1b[31m✗\x1b[0m ${text}`;
const yellow = (text) => `\x1b[33m!\x1b[0m ${text}`;
const bold = (text) => `\x1b[1m${text}\x1b[0m`;

let passed = 0;
let failed = 0;
let warnings = 0;

function check(label, condition, hint = '') {
  if (condition) {
    console.log(green(label));
    passed++;
  } else {
    console.log(red(`${label}${hint ? ` - ${hint}` : ''}`));
    failed++;
  }
}

function warn(label, condition, hint = '') {
  if (condition) {
    console.log(green(label));
    passed++;
  } else {
    console.log(yellow(`${label}${hint ? ` - ${hint}` : ''}`));
    warnings++;
  }
}

function checkCommand(cmd) {
  try {
    execSync(cmd, { stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}

function getNodeVersion() {
  try {
    const version = execSync('node --version', { encoding: 'utf-8' }).trim();
    const major = parseInt(version.replace('v', '').split('.')[0], 10);
    return major;
  } catch {
    return 0;
  }
}

console.log('');
console.log(bold('LucidIA - Validação de Setup'));
console.log(bold('============================'));
console.log('');

// Runtime checks
console.log(bold('Runtime'));
const nodeVersion = getNodeVersion();
check('Node.js >= 18', nodeVersion >= 18, 'Instale Node.js 18+ em https://nodejs.org');
check('npm disponível', checkCommand('npm --version'), 'npm deveria vir com Node.js');

// Dependencies
console.log('');
console.log(bold('Dependências'));
check('node_modules existe', existsSync(join(ROOT, 'node_modules')), 'Execute: npm install');
check('js-yaml instalado', existsSync(join(ROOT, 'node_modules', 'js-yaml')), 'Execute: npm install');
check('playwright instalado', existsSync(join(ROOT, 'node_modules', 'playwright')), 'Execute: npm install');

// Playwright browser
const playwrightChromium = existsSync(join(ROOT, 'node_modules', 'playwright-core', '.local-browsers'))
  || checkCommand('npx playwright install --dry-run chromium 2>&1');
warn('Playwright Chromium', playwrightChromium, 'Execute: npx playwright install chromium');

// User configuration
console.log('');
console.log(bold('Configuração do Usuário'));
check('cv.md existe', existsSync(join(ROOT, 'cv.md')), 'Crie seu currículo em cv.md ou use /lucidia para onboarding');
check('config/profile.yml existe', existsSync(join(ROOT, 'config', 'profile.yml')), 'Copie config/profile.example.yml para config/profile.yml');
warn('portals.yml existe', existsSync(join(ROOT, 'portals.yml')), 'Copie templates/portals.example.yml para portals.yml');
warn('modes/_profile.md existe', existsSync(join(ROOT, 'modes', '_profile.md')), 'Será criado automaticamente no primeiro uso');

// Optional files
console.log('');
console.log(bold('Arquivos Opcionais'));
warn('article-digest.md existe', existsSync(join(ROOT, 'article-digest.md')), 'Opcional: pontos de prova adicionais');

// Data directories
console.log('');
console.log(bold('Diretórios de Dados'));
const dirs = ['data', 'reports', 'output', 'interview-prep'];
for (const dir of dirs) {
  const dirPath = join(ROOT, dir);
  if (!existsSync(dirPath)) {
    const { mkdirSync } = await import('fs');
    mkdirSync(dirPath, { recursive: true });
    console.log(green(`${dir}/ criado`));
    passed++;
  } else {
    console.log(green(`${dir}/ existe`));
    passed++;
  }
}

// Skill registration
console.log('');
console.log(bold('Registro do Skill'));
check('CLAUDE.md existe', existsSync(join(ROOT, 'CLAUDE.md')), 'Arquivo de instruções do agente está faltando');
check('SKILL.md existe', existsSync(join(ROOT, '.claude', 'skills', 'lucidia', 'SKILL.md')), 'Registro do skill está faltando');
check('modes/_shared.md existe', existsSync(join(ROOT, 'modes', '_shared.md')), 'Contexto do sistema está faltando');

// Summary
console.log('');
console.log(bold('Resultado'));
console.log(`${green(`${passed} verificações passaram`)}`);
if (warnings > 0) console.log(`${yellow(`${warnings} avisos`)}`);
if (failed > 0) console.log(`${red(`${failed} falhas`)}`);
console.log('');

if (failed > 0) {
  console.log('Corrija as falhas acima antes de usar o LucidIA.');
  process.exit(1);
} else if (warnings > 0) {
  console.log('Setup funcional. Corrija os avisos para experiência completa.');
} else {
  console.log('Setup completo. Execute: claude');
}
