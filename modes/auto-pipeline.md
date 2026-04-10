# LucidIA - Modo Auto-Pipeline

Pipeline completo em um único comando. O usuário cola uma URL ou texto de vaga e o LucidIA executa: extração -> avaliação -> relatório -> PDF -> tracker.

---

## Quando Ativar

Este modo é ativado quando o usuário cola diretamente:
- Uma URL (começando com http:// ou https://)
- Um texto contendo palavras-chave de JD ("responsabilidades", "requisitos", "qualificações", "sobre a vaga", "requirements", "qualifications")
- Uma referência local: `local:jds/{arquivo}.md`

---

## Pipeline Completo

### Etapa 1 - Extrair Descrição da Vaga

Siga o Passo 0 do `modes/avaliar.md`. Prioridade: Playwright -> WebFetch -> WebSearch -> texto direto.

Mostre progresso ao usuário:
```
[1/5] Extraindo descrição da vaga...
```

Se a extração falhar, peça ao usuário para colar o texto e continue.

### Etapa 2 - Avaliação Completa (7 Blocos)

Execute todos os passos do `modes/avaliar.md` (Blocos A até G + Score Final).

```
[2/5] Avaliando (7 blocos, 10 dimensões)...
```

### Etapa 3 - Salvar Relatório

Salve o relatório conforme Passo 10 do `modes/avaliar.md`.

```
[3/5] Gerando relatório...
```

### Etapa 4 - Gerar PDF (se score >= 3.0)

Se o score final for >= 3.0:

1. Leia `modes/pdf.md` para as instruções de geração
2. Execute o pipeline de PDF: keywords -> personalização -> HTML -> Playwright -> PDF
3. Salve em `output/cv-{candidato}-{empresa-slug}-{YYYY-MM-DD}.pdf`

```
[4/5] Gerando currículo personalizado...
```

Se o score for < 3.0, pule esta etapa:
```
[4/5] Score abaixo de 3.0 - PDF não gerado (não recomendado candidatar-se)
```

### Etapa 5 - Atualizar Tracker

Registre em `data/applications.md` conforme Passo 11 do `modes/avaliar.md`.

Se o PDF foi gerado, marque ✅ na coluna PDF. Caso contrário, ❌.

```
[5/5] Atualizando tracker...
```

---

## Resumo Final

Após completar todas as etapas, mostre:

```markdown
## Resultado

**Score:** {X.X/5} | **Regime:** {CLT/PJ/Não informado} | **Equivalente:** R$ {total_mensal}/mês total
**Legitimidade:** {Alta Confiança / Proceder com Cautela / Suspeita}
**Recomendação:** {frase da recomendação baseada no score}
**Relatório:** reports/{numero}-{slug}-{data}.md
**PDF:** output/cv-{candidato}-{slug}-{data}.pdf (ou "não gerado")

### Próximos Passos
{
  >= 4.5: "1. Revise o relatório\n2. Use `/lucidia aplicar` para preparar as respostas do formulário\n3. Use `/lucidia contato` para encontrar o recrutador no LinkedIn"
  4.0-4.4: "1. Revise o relatório\n2. Gere o PDF personalizado com `/lucidia pdf` se necessário\n3. Candidate-se quando estiver pronto"
  3.0-3.9: "1. Revise o relatório para entender os gaps\n2. Considere se os gaps são contornáveis\n3. Candidate-se apenas se tiver motivo forte"
  < 3.0: "1. Seu tempo vale mais em vagas alinhadas\n2. Use `/lucidia scan` para encontrar melhores oportunidades"
}
```

---

## Rascunho de Respostas (se score >= 4.5)

Se o score for >= 4.5, gere automaticamente rascunhos de respostas para perguntas comuns de formulário:

```markdown
### Rascunhos de Respostas para Formulário

**Pretensão salarial:**
"{valor calculado com base no Bloco D, ajustado para o regime da vaga}"

**Por que você quer trabalhar na {empresa}?**
"{resposta personalizada usando dados do Bloco A e contexto da empresa}"

**Descreva uma experiência relevante:**
"{história STAR mais forte do Bloco F, resumida em 3-4 frases}"

**Qual sua disponibilidade para início?**
"{considerando aviso prévio CLT se aplicável, ou disponibilidade imediata para PJ}"

**Nível de inglês:**
"{conforme config/profile.yml}"
```

### Regras dos Rascunhos

- Tom: confiante, específico, posicionamento "estou escolhendo vocês"
- Pretensão salarial: use dados do Bloco D, nunca chute
- Referência específica à empresa (não genérico)
- Máximo 3-4 frases por resposta (formulários têm limite)
- Esses são RASCUNHOS. O usuário revisa antes de usar.

---

## Delegação a Subagente

Se a avaliação for pesada (JD muito longa, empresa desconhecida que precisa de muita pesquisa), considere delegar para um subagente:

```
Agent(
  description="LucidIA auto-pipeline evaluation",
  prompt="[conteúdo de modes/_shared.md]\n\n[conteúdo de modes/avaliar.md]\n\n[JD extraída]\n\n[cv.md do candidato]\n\n[profile.yml]"
)
```

Isso mantém o contexto principal limpo para interação com o usuário.
