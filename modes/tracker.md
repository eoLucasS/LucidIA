# LucidIA - Modo Tracker

Dashboard de status das candidaturas. Mostra métricas, permite atualização de status e fornece visão geral do progresso.

---

## Entrada

Nenhum argumento necessário. Lê de `data/applications.md`.

## Passo 1 - Carregar e Validar

1. Leia `data/applications.md`
2. Execute validação rápida (formato, status canônicos)
3. Se houver erros, avise e sugira: `npm run verify`

## Passo 2 - Calcular Métricas

```markdown
## Status das Candidaturas

**Total:** {N} candidaturas
**Período:** {data mais antiga} a {data mais recente}

### Métricas Gerais
| Métrica | Valor |
|---------|-------|
| Score médio | {X.X/5} |
| Com PDF gerado | {X}% ({N} de {total}) |
| Com relatório | {X}% ({N} de {total}) |
| Taxa de resposta | {X}% (Respondida+ / Aplicada) |
| Taxa de entrevista | {X}% (Entrevista / Aplicada) |

### Por Status
| Status | Quantidade | % |
|--------|-----------|---|
| Avaliada | {N} | {%} |
| Aplicada | {N} | {%} |
| Respondida | {N} | {%} |
| Entrevista | {N} | {%} |
| Oferta | {N} | {%} |
| Rejeitada | {N} | {%} |
| Descartada | {N} | {%} |
| SKIP | {N} | {%} |
```

## Passo 3 - Tabela de Candidaturas

Mostre a tabela completa, ordenada por data (mais recente primeiro):

```markdown
### Candidaturas

| # | Data | Empresa | Cargo | Score | Status | PDF | Relatório |
|---|------|---------|-------|-------|--------|-----|-----------|
| {n} | {data} | {empresa} | {cargo} | {score} | {status} | {✅/❌} | [{n}](...) |
```

Se houver muitas entradas, agrupe por status:

```markdown
### Entrevistas Ativas
| ... |

### Candidaturas Pendentes
| ... |

### Resultados Finais
| ... |
```

## Passo 4 - Ações Disponíveis

```markdown
### Ações
- Atualizar status: Diga "mude #42 para Entrevista"
- Adicionar nota: Diga "adicione nota em #42: entrevista marcada para 15/04"
- Filtrar: "mostre apenas Entrevista" ou "mostre score > 4.0"
- Verificar integridade: `npm run verify`
- Normalizar status: `npm run normalize`
- Remover duplicatas: `npm run dedup`
```

## Atualização Inline de Status

Se o usuário pedir para mudar um status:

1. Valide que o novo status é canônico (use `templates/states.yml`)
2. Edite a linha correspondente em `data/applications.md`
3. Confirme: "Status de #{número} ({empresa} - {cargo}) atualizado para {novo status}"

## Template Inicial

Se `data/applications.md` não existir, crie:

```markdown
# Candidaturas - LucidIA

| # | Data | Empresa | Cargo | Score | Status | PDF | Relatório | Notas |
|---|------|---------|-------|-------|--------|-----|-----------|-------|
```
