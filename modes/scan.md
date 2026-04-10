# LucidIA - Modo Scan

Scanner de portais para descoberta de vagas em plataformas brasileiras. Opera em 3 níveis de descoberta com deduplicação automática.

---

## Entrada

O usuário pode fornecer:
- Nenhum argumento (escaneia todos os portais habilitados em `portals.yml`)
- Nome de empresa específica: `/lucidia scan Nubank`
- Flag `--dry-run`: mostra o que faria sem executar

## Passo 0 - Carregar Configuração

1. Leia `portals.yml` (se não existir, avise o usuário para copiar de `templates/portals.example.yml`)
2. Leia `data/scan-history.tsv` (se existir, para deduplicação)
3. Leia `data/applications.md` (se existir, para evitar vagas já avaliadas)
4. Leia `data/pipeline.md` (se existir, para evitar vagas já pendentes)

Se o usuário especificou uma empresa, filtre `tracked_companies` para apenas essa empresa.

---

## Estratégia de Descoberta em 3 Níveis

### Nível 1 - Playwright (preferencial)

Para cada empresa com `careers_url` habilitada:

1. Navegue até a URL de carreiras usando Playwright
2. Aguarde o carregamento completo da página (SPAs podem demorar)
3. Extraia todas as listagens de vagas visíveis:
   - Título do cargo
   - URL da vaga
   - Localização (se visível)
   - Departamento (se visível)
4. Lide com paginação: clique em "Ver mais", "Próxima página", scroll infinito
5. Aplique filtro de título (`title_filter` do portals.yml)

**Vantagens:** Dados em tempo real, funciona com SPAs, mais confiável
**Quando usar:** Sempre que Playwright estiver disponível

### Nível 2 - API Direta (complementar)

Para empresas com `greenhouse_id` ou endpoints em `api_endpoints`:

**Greenhouse:**
```
GET https://boards-api.greenhouse.io/v1/boards/{id}/jobs
```
Resposta: JSON com array de vagas (title, location, url, updated_at)

**Ashby:**
```
POST https://jobs.ashbyhq.com/api/non-user-graphql
Body: { "operationName": "ApiJobBoardWithTeams", "variables": { "organizationHostedJobsPageName": "{slug}" } }
```

**Lever:**
```
GET https://api.lever.co/v0/postings/{company}
```

Para cada vaga retornada:
1. Aplique filtro de título
2. Verifique se a URL já existe em scan-history, applications ou pipeline
3. Se nova, adicione à lista de descobertas

**Vantagens:** Rápido, estruturado, zero tokens do Claude
**Quando usar:** Sempre que a empresa tiver endpoint configurado

### Nível 3 - WebSearch (descoberta ampla)

Execute as queries de `search_queries` do portals.yml:

Para cada query:
1. Execute WebSearch
2. Extraia URLs de vagas dos resultados
3. Para cada URL:
   - Aplique filtro de título (se o título estiver disponível)
   - Verifique deduplicação
   - Se nova, adicione à lista com flag `needs_liveness_check: true`

**Vantagens:** Descobre empresas e vagas fora dos portais rastreados
**Desvantagens:** Resultados podem estar desatualizados (cache do buscador)
**Quando usar:** Após Nível 1 e 2, para completar a descoberta

---

## Filtro de Título

Para cada vaga encontrada, aplique o filtro de `portals.yml`:

```
1. O título contém pelo menos 1 keyword de title_filter.positive?
   - NÃO -> descartar
   - SIM -> continuar

2. O título contém algum keyword de title_filter.negative?
   - SIM -> descartar
   - NÃO -> continuar

3. O título contém keywords de title_filter.seniority_boost?
   - SIM -> marcar com prioridade alta
   - NÃO -> manter prioridade normal

4. A vaga passa -> adicionar à lista de descobertas
```

O matching é case-insensitive e aceita substrings ("engineer" casa com "Software Engineer Sênior").

---

## Deduplicação

Antes de adicionar uma vaga à pipeline, verifique se a URL já existe em:

1. `data/scan-history.tsv` (já escaneada anteriormente)
2. `data/applications.md` (já avaliada/aplicada)
3. `data/pipeline.md` (já pendente de avaliação)

Se a URL for encontrada em qualquer um, marque como `skipped_dup` no scan-history e não adicione.

---

## Verificação de Liveness (para Nível 3)

Vagas descobertas via WebSearch podem estar desatualizadas. Para cada vaga com `needs_liveness_check`:

1. Tente acessar a URL via Playwright ou WebFetch
2. Se retornar 404, redirect para página genérica, ou "vaga encerrada": marque como `skipped_expired`
3. Se a página carregar com conteúdo de vaga válido: confirme como ativa

---

## Saída

### Adicionar ao Pipeline

Para cada vaga nova e válida, adicione em `data/pipeline.md` na seção "Pendentes":

```markdown
- [ ] {url} | {empresa} | {cargo} | {fonte: playwright/api/websearch}
```

### Registrar no Histórico de Scan

Para cada URL processada (nova ou duplicada), adicione em `data/scan-history.tsv`:

```
{url}\t{YYYY-MM-DD}\t{portal}\t{título}\t{empresa}\t{status}
```

Onde `status` é: `added`, `skipped_title`, `skipped_dup`, `skipped_expired`

### Resumo para o Usuário

```markdown
## Resultado do Scan

| Métrica | Valor |
|---------|-------|
| Portais escaneados | {N} |
| Vagas encontradas | {total} |
| Novas (adicionadas ao pipeline) | {novas} |
| Filtradas por título | {filtradas} |
| Duplicadas (já conhecidas) | {duplicadas} |
| Expiradas | {expiradas} |

### Vagas Adicionadas ao Pipeline
| Empresa | Cargo | Fonte | Prioridade |
|---------|-------|-------|-----------|
| {empresa} | {cargo} | {fonte} | {alta/normal} |
| ... | ... | ... | ... |

Próximo passo: `/lucidia pipeline` para avaliar as vagas pendentes.
```

---

## Delegação a Subagente

O scan é uma operação pesada. Considere delegar para um subagente:

```
Agent(
  description="LucidIA portal scan",
  prompt="[conteúdo de modes/_shared.md]\n\n[conteúdo de modes/scan.md]\n\n[portals.yml]"
)
```

Ou, para scans rápidos sem usar tokens do Claude, sugira ao usuário:

```bash
node scripts/scan.mjs
```

O script `scan.mjs` executa Nível 2 (APIs diretas) sem consumir tokens.

---

## Manutenção de URLs de Carreiras

Se uma `careers_url` retornar erro ou a empresa mudou de plataforma:
1. Avise o usuário
2. Sugira uma busca: `"{empresa}" careers page`
3. O usuário atualiza `portals.yml` manualmente (camada do usuário)
