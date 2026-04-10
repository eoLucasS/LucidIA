# LucidIA - Modo Aplicar

Assistente de preenchimento de formulários de candidatura. Gera respostas personalizadas usando o relatório de avaliação como contexto.

---

## Entrada

O usuário fornece:
- Nome da empresa + cargo (para buscar relatório existente)
- Ou screenshot/texto do formulário
- Ou lista de perguntas do formulário

## Passo 1 - Localizar Contexto

1. Busque relatório em `reports/` que corresponda à empresa + cargo
2. Se encontrado, carregue: Blocos B (match), D (compensação), E (keywords), F (histórias STAR)
3. Se não encontrado, peça ao usuário para rodar `/lucidia avaliar` primeiro, ou continue sem relatório

## Passo 2 - Identificar Campos do Formulário

Para cada campo identificado, classifique:

| Tipo | Exemplos |
|------|----------|
| **Texto curto** | Nome, email, telefone, LinkedIn, cidade |
| **Texto longo** | "Por que quer trabalhar aqui?", "Descreva sua experiência" |
| **Número** | Pretensão salarial, anos de experiência |
| **Seleção** | Senioridade, disponibilidade, modelo de trabalho |
| **Sim/Não** | "Necessita de visto?", "Aceita viagem?" |
| **Upload** | Currículo PDF |

## Passo 3 - Gerar Respostas

### Campos Automáticos (do profile.yml)
- Nome: `candidato.nome`
- Email: `candidato.email`
- Telefone: `candidato.telefone`
- LinkedIn: `candidato.linkedin`
- GitHub: `candidato.github`
- Cidade: `candidato.cidade`

### Pretensão Salarial
Use dados do Bloco D do relatório. Se não houver relatório:
1. Consulte `config/profile.yml` (metas salariais)
2. Ajuste pelo regime da vaga (CLT vs PJ)
3. Se a vaga não informar regime, dê valor CLT e note: "Para PJ, R$ {valor * 1.6}"
4. Execute `node scripts/salary-calc.mjs --equivalent {valor}` para referência

### "Por que quer trabalhar na {empresa}?"
- Referência algo específico da empresa (produto, cultura, tecnologia)
- Conecte com experiência do candidato (Bloco B match)
- Tom: "estou escolhendo vocês" (não desesperado)
- 3-4 frases, máximo 500 caracteres

### "Descreva uma experiência relevante"
- Use a história STAR mais forte do Bloco F
- Adapte para o contexto da pergunta
- Inclua métrica quantificável
- 4-5 frases, máximo 800 caracteres

### Disponibilidade
- CLT com emprego atual: "30 dias (aviso prévio padrão CLT)"
- CLT desempregado: "Disponibilidade imediata"
- PJ: "Disponibilidade imediata"
- Considere `modes/_profile.md` para políticas específicas

### Nível de Inglês
- Use o valor de `config/profile.yml` -> `idiomas.ingles`
- Mapeie para o formato pedido: Básico/Intermediário/Avançado/Fluente

---

## Saída

```markdown
### Respostas para Formulário - {Empresa} - {Cargo}

**Pretensão salarial:** R$ {valor} ({regime})
Justificativa: {baseado em pesquisa de mercado, Bloco D}

**Por que quer trabalhar na {empresa}?**
{resposta personalizada}

**Descreva uma experiência relevante:**
{história STAR adaptada}

**Disponibilidade:** {prazo}

**Nível de inglês:** {nível}

---
Copie e cole as respostas no formulário. Revise antes de enviar.
Após enviar, atualize o status com: /lucidia tracker (mude para "Aplicada")
```

## Regras

- Respostas são RASCUNHOS para o usuário revisar e adaptar
- Nunca invente experiência ou habilidades
- Tom profissional mas humano, adequado ao mercado brasileiro
- Se o formulário pede algo que não temos dados, sinalize: "[PREENCHER: {o que falta}]"
