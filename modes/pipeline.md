# LucidIA - Modo Pipeline

Processa todas as URLs pendentes em `data/pipeline.md`. Para cada URL, executa o auto-pipeline completo (extração -> avaliação -> relatório -> PDF -> tracker).

---

## Entrada

Nenhum argumento necessário. Lê automaticamente de `data/pipeline.md`.

## Passo 0 - Carregar Pipeline

1. Leia `data/pipeline.md`
2. Extraia todas as URLs na seção "Pendentes" (linhas com `- [ ]`)
3. Se não houver URLs pendentes, avise o usuário e sugira `/lucidia scan`

Formato esperado de cada linha:
```
- [ ] {url} | {empresa} | {cargo} | {fonte}
```

Ou formato mínimo:
```
- [ ] {url}
```

---

## Passo 1 - Processar Cada URL

Para cada URL pendente, execute o `modes/auto-pipeline.md` completo:

1. Extrair JD
2. Avaliação 7 blocos
3. Salvar relatório
4. Gerar PDF (se score >= 3.0)
5. Registrar no tracker

### Tratamento de Erros por URL

Se a extração ou avaliação falhar para uma URL:
- Marque a URL como falha (não a mova para "Processadas")
- Registre o erro
- Continue com a próxima URL (não pare o pipeline inteiro)

### LinkedIn e Páginas com Login

Se a URL for do LinkedIn ou de uma página que exige autenticação:
- Tente WebSearch como fallback
- Se falhar, mova para "Pendentes (manual)" com nota: "Necessário colar texto da vaga manualmente"

---

## Passo 2 - Atualizar Pipeline

Após processar cada URL com sucesso, mova da seção "Pendentes" para "Processadas":

```markdown
## Pendentes
- [ ] https://outra-url.com | Empresa B | Cargo B | api

## Processadas
- [x] #{numero} | https://url-processada.com | Empresa A | Cargo A | {score}/5 | PDF {✅/❌}
```

---

## Passo 3 - Paralelização (3+ URLs)

Se houver 3 ou mais URLs pendentes, considere paralelizar:

```
Para cada URL:
  Agent(
    description="LucidIA evaluate {empresa}",
    prompt="[_shared.md + avaliar.md + cv.md + profile.yml + URL]"
  )
```

Cada subagente é independente e produz seu próprio relatório e entrada no tracker.

Após todos completarem, mostre o resumo consolidado.

---

## Passo 4 - Resumo

Após processar todas as URLs, mostre:

```markdown
## Resumo do Pipeline

| # | Empresa | Cargo | Score | PDF | Status |
|---|---------|-------|-------|-----|--------|
| {n} | {empresa} | {cargo} | {X.X/5} | {✅/❌} | {Avaliada/Erro} |
| ... | ... | ... | ... | ... | ... |

**Processadas:** {N} de {total}
**Score médio:** {média}
**Recomendadas (>= 4.0):** {quantidade}

### Próximos Passos
- Revise os relatórios das vagas com score >= 4.0
- Use `/lucidia aplicar` para preparar formulários das melhores
- Use `/lucidia contato` para abordar recrutadores
```

---

## Template Inicial do Pipeline

Se `data/pipeline.md` não existir, crie com este template:

```markdown
# Pipeline de Vagas - LucidIA

## Pendentes

(Adicione URLs de vagas aqui, uma por linha)
(Formato: - [ ] {url} | {empresa} | {cargo} | {fonte})
(Use `/lucidia scan` para popular automaticamente)

## Processadas

(Vagas avaliadas aparecem aqui automaticamente)
```
