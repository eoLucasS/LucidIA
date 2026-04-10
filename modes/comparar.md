# LucidIA - Modo Comparar

Comparação lado a lado de múltiplas ofertas com normalização de compensação CLT vs PJ.

---

## Entrada

O usuário fornece 2 ou mais ofertas para comparar:
- Números de relatórios: `#042 #045 #047`
- Ou nomes de empresas: `Nubank vs Stone vs iFood`

## Passo 1 - Carregar Relatórios

Para cada oferta, carregue o relatório de `reports/` e extraia:
- Bloco A (resumo da vaga)
- Bloco D (compensação)
- Score global e por dimensão

## Passo 2 - Matriz de Comparação

Gere a matriz com as 10 dimensões ponderadas:

```markdown
## Comparação de Ofertas

| Dimensão (Peso) | {Empresa 1} | {Empresa 2} | {Empresa 3} |
|-----------------|-------------|-------------|-------------|
| North Star (25%) | {X.X} | {X.X} | {X.X} |
| Match CV (15%) | {X.X} | {X.X} | {X.X} |
| Senioridade (15%) | {X.X} | {X.X} | {X.X} |
| Compensação (10%) | {X.X} | {X.X} | {X.X} |
| Crescimento (10%) | {X.X} | {X.X} | {X.X} |
| Remoto (5%) | {X.X} | {X.X} | {X.X} |
| Reputação (5%) | {X.X} | {X.X} | {X.X} |
| Stack (5%) | {X.X} | {X.X} | {X.X} |
| Processo (5%) | {X.X} | {X.X} | {X.X} |
| Cultura (5%) | {X.X} | {X.X} | {X.X} |
| **Score Global** | **{X.X/5}** | **{X.X/5}** | **{X.X/5}** |
```

## Passo 3 - Compensação Normalizada

```markdown
## Compensação Total Anual (Normalizada)

| Componente | {Empresa 1} (CLT) | {Empresa 2} (PJ) | {Empresa 3} (CLT) |
|-----------|-------------------|------------------|-------------------|
| Salário bruto/faturamento | R$ {X}/mês | R$ {Y}/mês | R$ {Z}/mês |
| Benefícios anuais | R$ {X} | R$ 0 | R$ {Z} |
| 13º + Férias | R$ {X} | R$ 0 | R$ {Z} |
| FGTS | R$ {X} | R$ 0 | R$ {Z} |
| PLR estimada | R$ {X} | R$ 0 | R$ {Z} |
| (-) Impostos PJ | N/A | -R$ {Y} | N/A |
| (-) Custos PJ | N/A | -R$ {Y} | N/A |
| **Total anual** | **R$ {total}** | **R$ {total}** | **R$ {total}** |
| **Equivalente mensal** | **R$ {eq}** | **R$ {eq}** | **R$ {eq}** |
```

## Passo 4 - Recomendação

```markdown
## Recomendação

**Ranking:**
1. {Empresa X} - Score {X.X/5} - {justificativa em 1 frase}
2. {Empresa Y} - Score {Y.Y/5} - {justificativa}
3. {Empresa Z} - Score {Z.Z/5} - {justificativa}

**Considerações:**
- {Fator de tempo: alguma oferta pode fechar antes?}
- {Fator de negociação: alguma tem margem para melhorar?}
- {Fator de crescimento: qual oferece mais a longo prazo?}
- {Fator de risco: PJ vs CLT, startup vs corporação}
```
