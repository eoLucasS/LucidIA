#!/usr/bin/env node

// HTML to PDF converter for LucidIA
// Uses Playwright Chromium for print-perfect rendering

import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

const args = process.argv.slice(2);

if (args.includes('--help') || args.length < 2) {
  console.log(`
LucidIA - Gerador de PDF

Uso:
  node generate-pdf.mjs <input.html> <output.pdf> [--format=a4|letter]

Exemplos:
  node generate-pdf.mjs cv.html output/cv-lucas-nubank-2026-04-10.pdf
  node generate-pdf.mjs cv.html output/cv.pdf --format=letter
  `);
  process.exit(0);
}

const inputPath = resolve(args[0]);
const outputPath = resolve(args[1]);
const format = args.find(a => a.startsWith('--format='))?.split('=')[1] || 'a4';

if (!existsSync(inputPath)) {
  console.error(`Arquivo não encontrado: ${inputPath}`);
  process.exit(1);
}

// Normalize text for ATS compatibility
function normalizeForATS(html) {
  return html
    // Em-dashes to hyphens
    .replace(/\u2013/g, '-')
    .replace(/\u2014/g, '-')
    // Smart quotes to straight
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    // Zero-width characters
    .replace(/[\u200B\u200C\u200D\uFEFF]/g, '')
    // Non-breaking spaces to regular
    .replace(/\u00A0/g, ' ');
}

async function generatePDF() {
  const { chromium } = await import('playwright');

  let html = readFileSync(inputPath, 'utf-8');
  html = normalizeForATS(html);

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // Load HTML with file:// protocol for local font access
  await page.setContent(html, { waitUntil: 'networkidle' });

  // Page dimensions
  const dimensions = {
    a4: { width: '210mm', height: '297mm' },
    letter: { width: '8.5in', height: '11in' },
  };

  const dim = dimensions[format] || dimensions.a4;

  await page.pdf({
    path: outputPath,
    width: dim.width,
    height: dim.height,
    printBackground: true,
    margin: { top: '0', bottom: '0', left: '0', right: '0' },
    preferCSSPageSize: true,
  });

  await browser.close();

  console.log(`PDF gerado: ${outputPath}`);
  console.log(`Formato: ${format.toUpperCase()}`);
}

generatePDF().catch(err => {
  console.error(`Erro ao gerar PDF: ${err.message}`);
  process.exit(1);
});
