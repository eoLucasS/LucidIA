# LucidIA - Modo Lote (Batch)

Processamento paralelo de múltiplas vagas. Ideal para quando o scan retorna 10+ URLs e você quer avaliar todas de uma vez.

---

## Dois Modos de Operação

### Modo 1 - Conductor (dentro do Claude Code)

O agente principal orquestra N subagentes paralelos:

```
Para cada URL no batch:
  Agent(
    description="LucidIA batch #{id}",
    prompt="[batch-prompt.md com URL substituída]",
    run_in_background=true
  )
```

Cada subagente recebe um prompt auto-contido (`batch/batch-prompt.md`) com todas as instruções necessárias, sem dependências externas.

**Vantagens:** Integrado, sem setup adicional
**Limitação:** Depende do suporte a subagentes do motor

### Modo 2 - Script (via terminal)

```bash
bash batch/batch-runner.sh
```

O script orquestra N processos `claude -p` paralelos, cada um avaliando uma URL.

**Vantagens:** Funciona independente do motor, resume-safe
**Limitação:** Requer `claude` CLI disponível no PATH

---

## Preparação do Batch

### Input

O batch lê de `batch/batch-input.tsv`:

```
id\turl\tsource
1\thttps://boards.greenhouse.io/nubank/jobs/123\tgreenhouse
2\thttps://gupy.io/vagas/456\tgupy
3\thttps://linkedin.com/jobs/view/789\tlinkedin
```

Para popular automaticamente a partir do pipeline:

1. Leia `data/pipeline.md`
2. Extraia URLs pendentes
3. Gere `batch/batch-input.tsv` com IDs sequenciais

### State Tracking

O progresso é rastreado em `batch/batch-state.tsv`:

```
id\turl\tstatus\treport_num\tscore\tretries
1\thttps://...\tcompleted\t042\t4.3\t0
2\thttps://...\tin_progress\t\t\t0
3\thttps://...\tfailed\t\t\t1
```

Status possíveis: `pending`, `in_progress`, `completed`, `failed`

---

## Worker Auto-Contido

Cada worker recebe `batch/batch-prompt.md` com variáveis substituídas:

- `{{URL}}`: URL da vaga
- `{{REPORT_NUM}}`: Número sequencial do relatório
- `{{DATE}}`: Data atual (YYYY-MM-DD)

O worker:
1. Extrai a JD da URL
2. Executa avaliação completa (7 blocos)
3. Gera relatório em `reports/`
4. Gera PDF em `output/` (se score >= 3.0)
5. Escreve uma linha TSV em `batch/tracker-additions/{id}.tsv`

### Formato da Linha TSV de Saída

```
{numero}\t{YYYY-MM-DD}\t{empresa}\t{cargo}\t{score}/5\tAvaliada\t{✅/❌}\t{caminho_relatorio}\t{notas}
```

---

## Resume-Safe

O batch é projetado para ser interrompido e retomado:

1. Antes de iniciar um worker, verifique `batch-state.tsv`
2. Se o ID já tem status `completed`, pule
3. Se tem status `failed` e retries < max_retries, tente novamente
4. Se tem status `in_progress` (crash anterior), trate como `pending`

---

## Merge dos Resultados

Após o batch completar, execute:

```bash
node scripts/merge-tracker.mjs
```

Ou peça ao agente para executar. O script:

1. Lê todos os arquivos `.tsv` em `batch/tracker-additions/`
2. Para cada linha, verifica se já existe em `data/applications.md` (por empresa + cargo)
3. Se nova, adiciona ao tracker
4. Se duplicada mas com score maior, atualiza
5. Se duplicada com score menor, marca como "DUP"
6. Move arquivos processados para `batch/tracker-additions/merged/`

---

## Resumo Final

Após o batch e merge, mostre:

```markdown
## Resultado do Lote

**Total processado:** {N} vagas
**Completadas:** {sucesso}
**Falhas:** {falhas}
**Score médio:** {média}

| # | Empresa | Cargo | Score | PDF | Tempo |
|---|---------|-------|-------|-----|-------|
| ... | ... | ... | ... | ... | ... |

**Top 5 (maior score):**
1. {empresa} - {cargo}: {score}/5
2. ...

Resultados integrados ao tracker. Use `/lucidia tracker` para visualizar.
```

---

## Limites e Boas Práticas

- **Máximo recomendado:** 20 vagas por batch (para manter qualidade)
- **Parallelismo:** 3-5 workers simultâneos (para não sobrecarregar APIs)
- **Retry:** Máximo 2 tentativas por vaga antes de marcar como falha definitiva
- **Timeout:** 5 minutos por vaga (se demorar mais, provavelmente travou)
