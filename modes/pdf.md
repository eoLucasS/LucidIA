# LucidIA - Modo PDF

Gera currículo personalizado, otimizado para ATS, em formato PDF. Usa `cv.md` como fonte da verdade e personaliza por vaga com injeção de keywords e reordenação de conteúdo.

---

## Entrada

O usuário fornece contexto de uma vaga:
- URL ou texto de JD (para extrair keywords)
- Ou referência a um relatório existente: `reports/{numero}-{slug}-{data}.md`
- Ou nenhum argumento (gera versão genérica sem personalização)

## Pipeline de Geração

### 1. Extrair Keywords da Vaga

Se houver contexto de vaga:
- Extraia 15-20 keywords/frases da descrição
- Classifique em: obrigatórios, desejáveis, diferenciais
- Identifique a linguagem (PT-BR ou EN) para manter consistência

Se houver relatório existente, use os keywords do Bloco E.

### 2. Detectar Formato

- **Idioma do currículo:** Mesmo idioma da vaga (PT-BR padrão, EN se vaga internacional)
- **Formato do papel:** A4 (padrão BR), Letter (se empresa americana)
- **Regime:** Se a vaga é CLT, incluir disponibilidade. Se PJ, incluir CNPJ ativo.

### 3. Reescrever Resumo Profissional

A partir do `cv.md`, reescreva o resumo profissional:

- Incorpore os top 5 keywords da vaga naturalmente
- Adicione ponte narrativa: "{experiência anterior} -> {valor para esta vaga}"
- Use dados de `modes/_profile.md` (headline, superpoderes)
- 3-4 linhas, escaneável em 6 segundos (tempo médio que recrutador gasta)
- Tom: confiante, específico, sem jargões vazios

### 4. Selecionar Projetos Relevantes

Do `cv.md`, selecione os 3-4 projetos mais alinhados com a vaga:

- Priorize por keywords em comum
- Inclua métricas quantificáveis
- Se `article-digest.md` existir, use métricas de lá (mais detalhadas)

### 5. Reordenar Bullets de Experiência

Para cada posição no `cv.md`:
- Reordene os bullets por relevância para a vaga (mais relevante primeiro)
- NÃO reordene as posições em si (manter ordem cronológica reversa)
- Reformule bullets usando vocabulário exato da vaga quando possível
- Nunca invente experiência ou métricas

### 6. Construir Grade de Competências

Crie uma grade com 6-8 competências extraídas da vaga:

```
[Python] [AWS] [Microsserviços] [CI/CD] [REST APIs] [Testes Automatizados]
```

Apenas inclua competências que o candidato realmente possui (verificar no cv.md).

### 7. Gerar HTML

Use `templates/cv-template.html` como base:

- Substitua os placeholders com conteúdo personalizado
- Mantenha o design: coluna única, fontes self-hosted, cores sutis
- Seções padrão: Dados Pessoais, Resumo Profissional, Competências, Experiência Profissional, Projetos, Educação, Certificações, Idiomas
- Para o mercado BR, inclua seção de Idiomas (obrigatória)

### 8. Renderizar PDF

```bash
node scripts/generate-pdf.mjs {input.html} {output.pdf} --format={a4|letter}
```

O script usa Playwright headless Chromium para renderização print-perfect.

### 9. Validar

- Verificar ortografia
- Contar páginas (ideal: 1-2 páginas)
- Calcular cobertura de keywords: `(keywords presentes / keywords totais) * 100`
- Reportar resultado

---

## Saída

```markdown
## Currículo Gerado

**Arquivo:** output/cv-{candidato}-{empresa-slug}-{YYYY-MM-DD}.pdf
**Páginas:** {N}
**Cobertura de keywords:** {X}%
**Formato:** {A4/Letter}
**Idioma:** {PT-BR/EN}

**Keywords injetados:** {lista}
**Keywords não cobertos:** {lista, se houver}
```

---

## Regras de ATS

- Layout em coluna única (sem barras laterais)
- Cabeçalhos de seção padrão e reconhecíveis
- Texto selecionável (não imagem)
- Sem tabelas complexas (ATS pode não parsear)
- Sem informações em headers/footers do PDF
- Sem emojis
- Em-dashes convertidos para hífens
- Aspas inteligentes convertidas para retas
- Caracteres zero-width removidos
