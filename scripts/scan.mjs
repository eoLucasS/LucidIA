#!/usr/bin/env node

// Zero-token portal scanner for LucidIA
// Fetches job listings from APIs without using Claude tokens
// Supports: Greenhouse, Ashby, Lever

import { readFileSync, existsSync, appendFileSync, writeFileSync } from 'fs';
import { resolve, join } from 'path';
import YAML from 'js-yaml';

const ROOT = resolve(import.meta.dirname, '..');

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const companyFilter = args.find(a => !a.startsWith('--'));
const jsonOutput = args.includes('--json');

// Load portals config
function loadPortals() {
  const portalPath = join(ROOT, 'portals.yml');
  if (!existsSync(portalPath)) {
    console.error('portals.yml não encontrado. Copie de templates/portals.example.yml');
    process.exit(1);
  }
  return YAML.load(readFileSync(portalPath, 'utf-8'));
}

// Load scan history for dedup
function loadScanHistory() {
  const historyPath = join(ROOT, 'data', 'scan-history.tsv');
  if (!existsSync(historyPath)) return new Set();
  const lines = readFileSync(historyPath, 'utf-8').split('\n').filter(l => l.trim());
  return new Set(lines.map(l => l.split('\t')[0]));
}

// Load pipeline URLs for dedup
function loadPipelineUrls() {
  const pipelinePath = join(ROOT, 'data', 'pipeline.md');
  if (!existsSync(pipelinePath)) return new Set();
  const content = readFileSync(pipelinePath, 'utf-8');
  const urls = new Set();
  for (const match of content.matchAll(/https?:\/\/[^\s|)]+/g)) {
    urls.add(match[0]);
  }
  return urls;
}

// Title filter
function matchesFilter(title, filter) {
  const lowerTitle = title.toLowerCase();

  // Check negative keywords first
  if (filter.negative?.some(kw => lowerTitle.includes(kw.toLowerCase()))) {
    return { pass: false, reason: 'negative_keyword' };
  }

  // Check positive keywords
  if (!filter.positive?.some(kw => lowerTitle.includes(kw.toLowerCase()))) {
    return { pass: false, reason: 'no_positive_keyword' };
  }

  // Check seniority boost
  const hasSeniorityBoost = filter.seniority_boost?.some(kw =>
    lowerTitle.includes(kw.toLowerCase())
  );

  return { pass: true, priority: hasSeniorityBoost ? 'high' : 'normal' };
}

// Fetch Greenhouse jobs
async function fetchGreenhouse(boardId, companyName) {
  const url = `https://boards-api.greenhouse.io/v1/boards/${boardId}/jobs`;
  try {
    const response = await fetch(url);
    if (!response.ok) return [];
    const data = await response.json();
    return (data.jobs || []).map(job => ({
      title: job.title,
      url: job.absolute_url,
      location: job.location?.name || '',
      company: companyName,
      source: 'greenhouse',
      updatedAt: job.updated_at,
    }));
  } catch (err) {
    console.error(`  Erro ao buscar ${companyName} (Greenhouse): ${err.message}`);
    return [];
  }
}

// Fetch Lever jobs
async function fetchLever(companySlug, companyName) {
  const url = `https://api.lever.co/v0/postings/${companySlug}`;
  try {
    const response = await fetch(url);
    if (!response.ok) return [];
    const data = await response.json();
    return (data || []).map(job => ({
      title: job.text,
      url: job.hostedUrl,
      location: job.categories?.location || '',
      company: companyName,
      source: 'lever',
      updatedAt: job.createdAt,
    }));
  } catch (err) {
    console.error(`  Erro ao buscar ${companyName} (Lever): ${err.message}`);
    return [];
  }
}

// Fetch from API endpoints
async function fetchEndpoints(endpoints) {
  const results = [];
  for (const url of (endpoints.greenhouse || [])) {
    const boardId = url.match(/boards\/([^/]+)\/jobs/)?.[1];
    if (boardId) {
      const jobs = await fetchGreenhouse(boardId, boardId);
      results.push(...jobs);
    }
  }
  return results;
}

// Main scan logic
async function scan() {
  const portals = loadPortals();
  const knownUrls = loadScanHistory();
  const pipelineUrls = loadPipelineUrls();
  const filter = portals.title_filter || {};

  const today = new Date().toISOString().split('T')[0];
  const discovered = [];
  const historyEntries = [];

  let totalFound = 0;
  let filtered = 0;
  let duplicated = 0;
  let added = 0;

  console.log('LucidIA - Scanner de Portais (zero-token)\n');

  // Phase 1: Tracked companies with Greenhouse IDs
  const companies = (portals.tracked_companies || [])
    .filter(c => c.enabled !== false)
    .filter(c => !companyFilter || c.name.toLowerCase().includes(companyFilter.toLowerCase()));

  for (const company of companies) {
    if (!company.greenhouse_id) continue;
    process.stdout.write(`  ${company.name} (Greenhouse)...`);

    const jobs = await fetchGreenhouse(company.greenhouse_id, company.name);
    totalFound += jobs.length;
    let companyAdded = 0;

    for (const job of jobs) {
      const filterResult = matchesFilter(job.title, filter);

      if (!filterResult.pass) {
        filtered++;
        historyEntries.push(`${job.url}\t${today}\tgreenhouse\t${job.title}\t${company.name}\tskipped_title`);
        continue;
      }

      if (knownUrls.has(job.url) || pipelineUrls.has(job.url)) {
        duplicated++;
        historyEntries.push(`${job.url}\t${today}\tgreenhouse\t${job.title}\t${company.name}\tskipped_dup`);
        continue;
      }

      discovered.push({ ...job, priority: filterResult.priority });
      historyEntries.push(`${job.url}\t${today}\tgreenhouse\t${job.title}\t${company.name}\tadded`);
      companyAdded++;
      added++;
    }

    console.log(` ${jobs.length} vagas, ${companyAdded} novas`);
  }

  // Phase 2: Direct API endpoints
  if (portals.api_endpoints) {
    process.stdout.write('  Endpoints diretos...');
    const endpointJobs = await fetchEndpoints(portals.api_endpoints);
    totalFound += endpointJobs.length;
    let endpointAdded = 0;

    for (const job of endpointJobs) {
      const filterResult = matchesFilter(job.title, filter);
      if (!filterResult.pass) { filtered++; continue; }
      if (knownUrls.has(job.url) || pipelineUrls.has(job.url)) { duplicated++; continue; }

      // Avoid duplicates from phase 1
      if (discovered.some(d => d.url === job.url)) continue;

      discovered.push({ ...job, priority: filterResult.priority });
      historyEntries.push(`${job.url}\t${today}\tapi\t${job.title}\t${job.company}\tadded`);
      endpointAdded++;
      added++;
    }

    console.log(` ${endpointJobs.length} vagas, ${endpointAdded} novas`);
  }

  // Results
  console.log(`\nResultado:`);
  console.log(`  Total encontrado: ${totalFound}`);
  console.log(`  Filtradas por título: ${filtered}`);
  console.log(`  Duplicadas: ${duplicated}`);
  console.log(`  Novas adicionadas: ${added}`);

  if (jsonOutput) {
    console.log(JSON.stringify({ totalFound, filtered, duplicated, added, discovered }, null, 2));
    return;
  }

  if (dryRun) {
    console.log('\n[DRY RUN] Nenhum arquivo foi modificado.');
    if (discovered.length > 0) {
      console.log('\nVagas que seriam adicionadas:');
      for (const job of discovered) {
        console.log(`  [${job.priority}] ${job.company} - ${job.title}`);
        console.log(`    ${job.url}`);
      }
    }
    return;
  }

  // Write to pipeline.md
  if (discovered.length > 0) {
    const pipelinePath = join(ROOT, 'data', 'pipeline.md');
    let pipelineContent = '';

    if (existsSync(pipelinePath)) {
      pipelineContent = readFileSync(pipelinePath, 'utf-8');
    } else {
      pipelineContent = '# Pipeline de Vagas - LucidIA\n\n## Pendentes\n\n## Processadas\n';
    }

    // Insert new URLs before "## Processadas"
    const newEntries = discovered
      .sort((a, b) => (a.priority === 'high' ? -1 : 1) - (b.priority === 'high' ? -1 : 1))
      .map(j => `- [ ] ${j.url} | ${j.company} | ${j.title} | ${j.source}`)
      .join('\n');

    if (pipelineContent.includes('## Processadas')) {
      pipelineContent = pipelineContent.replace('## Processadas', `${newEntries}\n\n## Processadas`);
    } else {
      pipelineContent += `\n${newEntries}\n`;
    }

    writeFileSync(pipelinePath, pipelineContent, 'utf-8');
    console.log(`\n${added} vagas adicionadas a data/pipeline.md`);
  }

  // Append to scan-history.tsv
  if (historyEntries.length > 0) {
    const historyPath = join(ROOT, 'data', 'scan-history.tsv');
    appendFileSync(historyPath, historyEntries.join('\n') + '\n', 'utf-8');
  }

  if (added > 0) {
    console.log('Próximo passo: /lucidia pipeline');
  } else {
    console.log('Nenhuma vaga nova encontrada. Tente ampliar os filtros em portals.yml.');
  }
}

scan().catch(err => {
  console.error(`Erro fatal: ${err.message}`);
  process.exit(1);
});
