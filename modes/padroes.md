# LucidIA - Modo Padrões

Análise de padrões de rejeição e otimização de estratégia. Requer mínimo de 5 candidaturas com resultado (não apenas "Avaliada").

---

## Entrada

Nenhum argumento necessário. Lê automaticamente de `data/applications.md` e `reports/`.

## Pré-requisito

Verifique se há pelo menos 5 candidaturas com status diferente de "Avaliada" e "SKIP". Se não:

```
Dados insuficientes para análise de padrões.
Você tem {N} candidatura(s) com resultado. São necessárias pelo menos 5.
Continue se candidatando e volte quando tiver mais dados.
```

## Passo 1 - Coletar Dados

Execute:
```bash
node scripts/analyze-patterns.mjs --json
```

Ou analise manualmente:
1. Leia `data/applications.md`
2. Para cada entrada, carregue o relatório correspondente de `reports/`
3. Extraia: arquétipo, senioridade, regime, score, status final, modalidade (remoto/híbrido/presencial), stack

## Passo 2 - Análise

```markdown
## Análise de Padrões

### Funil de Candidaturas
| Etapa | Quantidade | % do Total |
|-------|-----------|-----------|
| Avaliadas | {N} | 100% |
| Aplicadas | {N} | {%} |
| Respondidas | {N} | {%} |
| Entrevistas | {N} | {%} |
| Ofertas | {N} | {%} |
| Rejeitadas | {N} | {%} |
| Descartadas | {N} | {%} |

### Score vs Resultado
| Faixa de Score | Positivos (Entrevista+) | Negativos (Rejeitada) | Taxa de Sucesso |
|---------------|------------------------|----------------------|----------------|
| 4.5+ | {N} | {N} | {%} |
| 4.0-4.4 | {N} | {N} | {%} |
| 3.5-3.9 | {N} | {N} | {%} |
| < 3.5 | {N} | {N} | {%} |

### Desempenho por Arquétipo
| Arquétipo | Candidaturas | Entrevistas | Taxa |
|-----------|-------------|-------------|------|
| {arquétipo} | {N} | {N} | {%} |

### Bloqueios Mais Comuns
| Bloqueio | Frequência | Impacto |
|----------|-----------|---------|
| {ex: "Falta experiência com Kubernetes"} | {N} vezes | Alto |
| {ex: "Senioridade acima do perfil"} | {N} vezes | Médio |

### Gaps de Stack Tecnológica
| Tecnologia | Vezes Pedida | Presente no CV? |
|-----------|-------------|----------------|
| {tech} | {N} | {Sim/Não} |

### Score Mínimo Recomendado
Baseado nos dados, candidaturas com score abaixo de **{X.X}** têm taxa de sucesso de {Y}%.
Recomendação: priorize vagas com score >= {X.X}.
```

## Passo 3 - Recomendações

```markdown
### Top 5 Recomendações

1. **{Recomendação}** (Impacto: {Alto/Médio/Baixo})
   Por quê: {justificativa baseada nos dados}
   Ação: {o que fazer}

2. ...

### Ações Automáticas Sugeridas
- [ ] Atualizar `title_filter` em portals.yml: {mudança sugerida}
- [ ] Adicionar skill em `modes/_profile.md`: {skill que falta}
- [ ] Ajustar meta salarial em `config/profile.yml`: {se necessário}
- [ ] Focar em arquétipo {X} (melhor taxa de conversão)
```

## Saída

Salve em `reports/pattern-analysis-{YYYY-MM-DD}.md`.

Ofereça implementar as recomendações automaticamente (com aprovação do usuário):
- Atualizar portals.yml (filtros de título)
- Atualizar modes/_profile.md (skills, narrativa)
- Atualizar config/profile.yml (metas)
