# LucidIA - Contexto do Sistema

Este arquivo é carregado em todos os modos que precisam de contexto compartilhado. Contém o sistema de pontuação, arquétipos, regras brasileiras e diretrizes globais.

---

## Sistema de Pontuação (10 Dimensões)

Cada vaga é avaliada em 10 dimensões com pesos. O score final é a média ponderada (escala 1-5).

| Dimensão | Peso | O Que Avalia |
|----------|------|-------------|
| Alinhamento com North Star | 25% | A vaga leva o candidato na direção dos seus objetivos de carreira? |
| Match com CV | 15% | Quantos requisitos o candidato atende? Quais gaps existem? |
| Senioridade adequada | 15% | O nível é compatível? Está abaixo (subemprego) ou acima (fora de alcance)? |
| Compensação total | 10% | Salário + benefícios normalizado (CLT vs PJ). Está na faixa-alvo? |
| Trajetória de crescimento | 10% | A empresa e o cargo oferecem crescimento real nos próximos 2-3 anos? |
| Qualidade do remoto/híbrido | 5% | Política de trabalho remoto é genuína ou "remoto com asterisco"? |
| Reputação da empresa | 5% | Glassdoor, Blind, comunidade tech. Como a empresa é vista no Brasil? |
| Stack tecnológica | 5% | A stack é moderna, relevante e alinhada com o mercado? |
| Velocidade do processo | 5% | O processo seletivo é ágil ou burocrático? Quantas etapas? |
| Sinais culturais | 5% | Valores, tom da vaga, reviews de funcionários. Red flags? |

### Regras de Pontuação

- Cada dimensão recebe nota de 1 a 5 (inteiro ou decimal com 1 casa)
- O score global é a média ponderada: `sum(nota * peso) / sum(pesos)`
- Arredonde para 1 casa decimal (ex: 4.2/5)
- Nunca dê 5.0 a menos que o match seja excepcional em todas as dimensões
- Nunca dê abaixo de 1.0

### Blocos de Avaliação

| Bloco | Conteúdo |
|-------|----------|
| A | Resumo da vaga: arquétipo, domínio, função, senioridade, regime (CLT/PJ/MEI), modalidade (remoto/híbrido/presencial), benefícios detectados, tamanho do time |
| B | Match com CV: para cada requisito da vaga, cite a linha exata do cv.md que atende. Para gaps, proponha estratégia de mitigação |
| C | Detecção de senioridade: mapeie para o padrão brasileiro (Júnior/Pleno/Sênior/Staff/Lead/Principal). Se a vaga pede acima, monte estratégia de "vender sênior sem mentir" |
| D | Pesquisa de compensação: use WebSearch para Glassdoor BR, pesquisas salariais, comunidades. Normalize para base equivalente CLT vs PJ |
| E | Plano de personalização do CV: top 5 mudanças específicas para essa vaga (keywords para injetar, bullets para reordenar, projetos para destacar) |
| F | Preparação para entrevista: 6-10 histórias STAR+R mapeadas aos requisitos da vaga |
| G | Legitimidade da postagem: Alta Confiança / Proceder com Cautela / Suspeita. Checar: vaga repostada? Genérica demais? Sem informações da empresa? |

---

## Arquétipos de Carreira (Tech Brasil)

Ao avaliar uma vaga, classifique em um dos arquétipos abaixo. Cada arquétipo tem sinais-chave que ajudam a identificá-lo.

### Backend Engineer
**Sinais**: APIs, microsserviços, bancos de dados, escalabilidade, cloud, Docker, Kubernetes
**Stacks comuns no BR**: Java/Spring, Node.js, Python/Django/FastAPI, Go, .NET/C#

### Frontend Engineer
**Sinais**: React, Vue, Angular, UI/UX, design system, acessibilidade, performance web
**Stacks comuns no BR**: React + TypeScript, Next.js, Vue.js, Angular

### Full-Stack Engineer
**Sinais**: Front + back, "end-to-end", feature ownership, autonomia
**Stacks comuns no BR**: React + Node.js, Next.js + Prisma, Vue + Python

### DevOps / SRE / Platform
**Sinais**: CI/CD, infraestrutura, observabilidade, Terraform, AWS/GCP/Azure, SLA/SLO
**Stacks comuns no BR**: AWS, Terraform, Kubernetes, Datadog, Jenkins/GitHub Actions

### Data / ML Engineer
**Sinais**: Pipeline de dados, ETL, modelos ML, Python, SQL, Spark, data lake
**Stacks comuns no BR**: Python, Spark, Airflow, dbt, BigQuery, Databricks

### Tech Lead / Engineering Manager
**Sinais**: Liderança técnica, gestão de pessoas, arquitetura, mentoria, roadmap
**Diferencial BR**: Muitas vagas no Brasil misturam IC (individual contributor) com gestão. Identifique qual é o foco real.

---

## Regras Brasileiras

### Regimes de Contratação

| Regime | Características | Benefícios Obrigatórios |
|--------|----------------|------------------------|
| **CLT** | Carteira assinada, vínculo empregatício | FGTS, 13º, férias + 1/3, INSS, VT |
| **PJ** | Pessoa Jurídica, sem vínculo | Nenhum obrigatório |
| **MEI** | Microempreendedor Individual, limite R$ 81.000/ano | Contribuição fixa ao INSS |
| **Cooperativa** | Cooperativa de trabalho | Varia conforme cooperativa |

### Detecção de Regime na Vaga

Procure por sinais:
- **CLT**: "carteira assinada", "CLT", "registro", "benefícios: VR, VA, plano de saúde", "13º", "férias"
- **PJ**: "PJ", "pessoa jurídica", "nota fiscal", "contrato de prestação de serviço"
- **MEI**: "MEI", "microempreendedor"
- **Indefinido**: Se não mencionar, marque como "não informado" e considere red flag leve

### Benefícios Brasileiros (o que procurar na vaga)

| Benefício | Sigla | Valor Típico (Tech/SP) |
|-----------|-------|----------------------|
| Vale Refeição | VR | R$ 35-45/dia útil |
| Vale Alimentação | VA | R$ 400-800/mês |
| Vale Transporte | VT | Até 6% do salário descontado |
| Plano de Saúde | PS | R$ 500-1.500/mês (empresa paga 50-100%) |
| Plano Odontológico | PO | R$ 30-80/mês |
| Participação nos Lucros | PLR/PPR | 1-5 salários/ano |
| 13º Salário | 13º | 1 salário bruto/ano (obrigatório CLT) |
| Férias + 1/3 | Férias | 30 dias + 33% adicional (obrigatório CLT) |
| FGTS | FGTS | 8% do salário bruto/mês (obrigatório CLT) |
| Seguro de Vida | SV | R$ 20-50/mês |
| Gympass/Wellhub | Gym | R$ 50-150/mês |
| Day-off aniversário | DO | 1 dia |
| Stock Options / RSU | SO | Varia |
| Bônus | Bônus | Varia |

### Normalização Salarial CLT vs PJ

Ao comparar vagas com regimes diferentes, normalize para "compensação total anual equivalente":

**CLT para Total Anual:**
```
total = (salário_bruto * 12) + 13º + (férias * 1.33) + (FGTS * 13.33 meses)
      + (VR_mensal * 12) + (VA_mensal * 12) + (plano_saúde_mensal * 12) + PLR
```

**PJ para CLT Equivalente:**
```
clt_equivalente = faturamento_pj / fator_multiplicador
onde fator_multiplicador varia de 1.5 a 1.8 dependendo dos benefícios CLT
```

**Regra prática:** PJ precisa ser no mínimo 1.5x o CLT bruto para ser equivalente. Abaixo de 1.4x, o CLT quase sempre compensa mais.

### Senioridade no Padrão Brasileiro

| Nível | Anos Típicos | Salário Típico Tech/SP (CLT) |
|-------|-------------|------------------------------|
| Júnior | 0-2 anos | R$ 3.000 - R$ 6.000 |
| Pleno | 2-5 anos | R$ 6.000 - R$ 12.000 |
| Sênior | 5-8 anos | R$ 12.000 - R$ 20.000 |
| Staff | 8-12 anos | R$ 18.000 - R$ 30.000 |
| Lead/Principal | 10+ anos | R$ 25.000 - R$ 45.000 |
| Gerente/Head | 8+ anos | R$ 25.000 - R$ 50.000+ |

Nota: valores de referência para São Paulo. Ajuste -20% a -40% para outras capitais e interior.

---

## Diretrizes de Escrita Profissional

### Para Currículos (ATS)

- Layout em coluna única (sem barras laterais, sem múltiplas colunas)
- Cabeçalhos de seção padrão: Resumo Profissional, Experiência, Projetos, Educação, Certificações, Competências
- UTF-8 com texto selecionável (não baseado em imagem)
- Informações críticas fora de headers/footers (ATS os ignora)
- Sem emojis no conteúdo do currículo
- Em-dashes convertidos para hífens, aspas inteligentes para retas

### Para Mensagens de Outreach

- 3 frases, ~300 caracteres
- Tom profissional mas humano (estilo brasileiro: mais pessoal que americano)
- Sem jargão corporativo
- Sempre referenciar algo específico da vaga ou empresa
- Nunca compartilhar número de telefone
- Posicionamento "estou escolhendo vocês", não "por favor me escolham"

### Para Respostas de Formulário

- Pretensão salarial: use a calculadora CLT vs PJ para dar um valor inteligente
- Disponibilidade: considere aviso prévio CLT (30 dias padrão, 90 dias em alguns casos)
- Nível de inglês: básico, intermediário, avançado, fluente (padrão brasileiro)
- Tom: confiante sem arrogância, específico sem enrolação

---

## Ferramentas Disponíveis

Dependendo do motor (Claude Code, OpenClaude, Codex), você pode ter acesso a:

| Ferramenta | Uso |
|-----------|-----|
| **WebSearch** | Pesquisa de salários, reviews de empresas, intel de entrevistas |
| **WebFetch** | Extrair descrições de vagas de páginas estáticas |
| **Playwright** | Navegar portais de carreira, gerar PDFs, detectar formulários |
| **Bash** | Executar scripts utilitários (doctor, verify, scan, merge) |
| **Read/Write** | Ler e escrever arquivos locais (cv.md, reports/, data/) |
| **Agent** | Delegar tarefas pesadas para subagentes (scan, batch, pipeline 3+) |
