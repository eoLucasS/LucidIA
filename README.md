<p align="center">
  <h1 align="center">LucidIA</h1>
  <p align="center">
    <em>Central de comando inteligente para busca de emprego no mercado brasileiro.</em>
  </p>
  <p align="center">
    <a href="#funcionalidades">Funcionalidades</a> &bull;
    <a href="#início-rápido">Início Rápido</a> &bull;
    <a href="#como-funciona">Como Funciona</a> &bull;
    <a href="#modos">Modos</a>
  </p>
  <p align="center">
    <img src="https://img.shields.io/badge/licença-MIT-blue.svg" alt="Licença">
    <img src="https://img.shields.io/badge/node-%3E%3D18-green.svg" alt="Node">
    <img src="https://img.shields.io/badge/motor-Claude%20Code-blueviolet.svg" alt="Motor">
    <img src="https://img.shields.io/badge/foco-Brasil%20%F0%9F%87%A7%F0%9F%87%B7-yellow.svg" alt="Brasil">
  </p>
</p>

---

> **"Empresas usam IA para filtrar candidatos. Candidatos merecem IA para escolher empresas."**

LucidIA traz lucidez ao mercado de trabalho brasileiro. Avalia vagas com um sistema de pontuação de 10 dimensões, calcula a compensação real entre CLT e PJ, gera currículos personalizados e ajuda você a se candidatar com precisão cirúrgica.

**5 candidaturas bem direcionadas batem 50 genéricas.** Essa é a filosofia.

---

## O Problema

O mercado de trabalho brasileiro tem um problema de transparência:

- **70-80% das vagas escondem o salário** atrás de "a combinar"
- Empresas usam "pretensão salarial" como filtro para pagar menos aos candidatos
- Os regimes CLT e PJ tornam a comparação de remuneração quase impossível sem cálculos aprofundados
- Vagas fantasma, repostagens e descrições vagas desperdiçam o tempo de quem procura emprego
- Sistemas de ATS com IA filtram currículos antes que um humano sequer os leia

LucidIA revida. Dá ao candidato o mesmo poder analítico que as empresas usam para filtrá-lo.

## Funcionalidades

### Motor de Avaliação
- **Análise em 7 blocos** de cada vaga (resumo, match com CV, senioridade, remuneração, plano de CV, prep de entrevista, legitimidade)
- **Pontuação em 10 dimensões** (escala 1-5) adaptada para o mercado brasileiro
- **Detector de legitimidade** sinaliza vagas fantasma e postagens suspeitas
- **Limiar de qualidade** recomenda quais vagas merecem sua candidatura

### Inteligência Brasileira
- **Calculadora CLT vs PJ** com detalhamento completo de impostos e benefícios (INSS, IRRF, FGTS, 13º, férias, VR, VA, plano de saúde, PLR)
- **Detecção de regime** classifica vagas como CLT, PJ, MEI ou Cooperativa
- **Estimativa salarial** por stack, senioridade, cidade e origem da empresa
- **Análise de benefícios** extrai e valoriza benefícios brasileiros das descrições de vagas

### Descoberta de Vagas
- **Scanner multi-plataforma** encontra vagas no LinkedIn, Gupy, Greenhouse, Lever e mais
- **Filtragem por título** com palavras-chave positivas/negativas e boost de senioridade
- **Deduplicação** cruzando histórico de scan, pipeline e candidaturas
- **30+ empresas** de tecnologia brasileiras pré-configuradas

### Geração de Conteúdo
- **Currículo otimizado para ATS** gerado como PDF via template HTML e Playwright
- **Injeção de palavras-chave** da descrição da vaga, incorporadas naturalmente na sua experiência
- **Grade de competências** construída a partir dos requisitos da vaga
- **Resumo profissional** reescrito por vaga com ponte narrativa

### Suporte à Candidatura
- **Assistente de formulário** gera respostas personalizadas para campos de candidatura
- **Mensagens para LinkedIn** cria abordagens personalizadas para recrutadores e gestores
- **Comparação de ofertas** com remuneração normalizada entre CLT e PJ
- **Pesquisa aprofundada** de empresas estruturada em 6 eixos de análise

### Inteligência de Carreira
- **Preparação para entrevistas** com intel específica da empresa via Glassdoor, Blind e blogs de engenharia
- **Banco de histórias STAR** cresce a cada avaliação, reutilizável entre entrevistas
- **Cadência de follow-up** rastreia comunicações pendentes e gera rascunhos
- **Análise de padrões** identifica o que funciona e o que está desperdiçando seu tempo

## Início Rápido

### Pré-requisitos

- [Node.js](https://nodejs.org/) 18 ou superior
- [Claude Code](https://claude.ai/code) instalado e autenticado
- Git

### Instalação

```bash
# Clone o repositório
git clone https://github.com/eoLucasS/LucidIA.git
cd LucidIA

# Instale as dependências
npm install
npx playwright install chromium

# Valide o setup
npm run doctor
```

### Primeiro Uso

```bash
# Abra o Claude Code no diretório do projeto
claude
```

Na primeira execução, LucidIA guia você pelo setup:

1. **Currículo**: Cole seu currículo, URL do LinkedIn ou descreva sua experiência
2. **Perfil**: Nome, email, cargos-alvo, faixa salarial, localização
3. **Portais**: Quais empresas e plataformas monitorar

Após o setup, você está pronto:

```
/lucidia                    # Mostra modos disponíveis
/lucidia scan               # Busca vagas nas plataformas
/lucidia pipeline           # Avalia todas as vagas pendentes
/lucidia tracker            # Visualiza status das candidaturas
```

## Como Funciona

LucidIA opera como um [skill do Claude Code](https://docs.anthropic.com/en/docs/claude-code). Você abre o Claude Code dentro do diretório do projeto e ele se torna sua central de comando para busca de emprego.

```
Você (no Claude Code)
  |
  |--- /lucidia scan ---------> Descobre vagas nas plataformas
  |--- /lucidia pipeline -----> Avalia cada vaga (7 blocos, 10 dimensões)
  |--- /lucidia pdf ----------> Gera currículo personalizado em PDF
  |--- /lucidia aplicar ------> Prepara respostas para formulários
  |--- /lucidia entrevista ----> Prepara você para entrevistas
  |--- /lucidia tracker ------> Acompanha todas as candidaturas
  |
  v
Seus dados ficam locais. A IA recomenda. Você decide.
```

**Sem API keys extras.** LucidIA usa o Claude Code como motor, que gerencia a autenticação pela sua assinatura existente do Claude.

**Sem envio automático.** LucidIA nunca clica em "Candidatar-se" por você. Prepara tudo e você dá a palavra final.

## Modos

| Modo | Comando | Objetivo |
|------|---------|----------|
| **Scan** | `/lucidia scan` | Descobrir vagas nas plataformas brasileiras |
| **Pipeline** | `/lucidia pipeline` | Avaliar todas as URLs de vagas pendentes |
| **Avaliar** | `/lucidia avaliar` | Análise profunda de 7 blocos de uma vaga |
| **PDF** | `/lucidia pdf` | Gerar currículo personalizado otimizado para ATS |
| **Aplicar** | `/lucidia aplicar` | Preparar respostas para formulários de candidatura |
| **Contato** | `/lucidia contato` | Gerar mensagens de abordagem no LinkedIn |
| **Comparar** | `/lucidia comparar` | Comparação lado a lado de ofertas |
| **Entrevista** | `/lucidia entrevista` | Preparação específica por empresa |
| **Pesquisa** | `/lucidia pesquisa` | Pesquisa aprofundada sobre a empresa |
| **Tracker** | `/lucidia tracker` | Dashboard de status das candidaturas |
| **Follow-up** | `/lucidia followup` | Cadência de acompanhamento e rascunhos |
| **Padrões** | `/lucidia padroes` | Analisar padrões de rejeição e otimizar estratégia |
| **Lote** | `/lucidia lote` | Avaliação paralela de múltiplas vagas |

### Auto-Pipeline

Cole qualquer URL de vaga diretamente e LucidIA executa o pipeline completo:

```
> https://boards.greenhouse.io/empresa/jobs/12345

Executando auto-pipeline...
[1/5] Extraindo descrição da vaga...
[2/5] Avaliando (7 blocos, 10 dimensões)...
[3/5] Gerando relatório...
[4/5] Gerando currículo personalizado...
[5/5] Atualizando tracker...

Score: 4.3/5 | Regime: CLT | Equivalente: R$ 18.200/mês total
Recomendação: Match forte. Candidate-se com currículo personalizado.
Relatório: reports/042-empresa-2026-04-10.md
PDF: output/cv-lucas-empresa-2026-04-10.pdf
```

## Inteligência CLT vs PJ

Uma das funcionalidades únicas do LucidIA. Quando uma vaga diz "R$ 15.000 PJ", a maioria dos candidatos não percebe que isso pode equivaler a apenas R$ 9.000 CLT após considerar impostos, benefícios ausentes e provisões.

LucidIA calcula:

| Componente | CLT R$ 10.000 | PJ Equivalente |
|-----------|---------------|----------------|
| Bruto mensal | R$ 10.000 | R$ 10.000 |
| INSS (empregado) | -R$ 909 | N/A |
| IRRF | -R$ 1.604 | N/A |
| Líquido mensal | **R$ 7.487** | ~R$ 8.175 |
| 13º salário | +R$ 10.000/ano | Nenhum |
| Férias + 1/3 | +R$ 13.333/ano | Nenhum |
| FGTS (8%) | +R$ 10.664/ano | Nenhum |
| VR/VA | +R$ 18.000/ano | Nenhum |
| Plano de saúde | +R$ 12.000/ano | -R$ 12.000/ano |
| PLR (estimativa) | +R$ 15.000/ano | Nenhum |
| Impostos PJ (Simples) | N/A | -R$ 2.325/mês |
| Contador | N/A | -R$ 350/mês |
| **Total real anual** | **~R$ 166.000** | **~R$ 98.100** |

> PJ R$ 10.000 NÃO é igual a CLT R$ 10.000. LucidIA mostra os números reais.

## Estrutura do Projeto

```
LucidIA/
├── .claude/skills/lucidia/   # Registro do skill
├── modes/                     # Modos do agente (PT-BR)
│   ├── _shared.md            # Pontuação, arquétipos, regras brasileiras
│   ├── _profile.template.md  # Template de customização do usuário
│   ├── avaliar.md            # Avaliação em 7 blocos
│   ├── scan.md               # Scanner de portais
│   ├── pdf.md                # Geração de currículo
│   ├── pipeline.md           # Processador de inbox de URLs
│   ├── aplicar.md            # Assistente de formulário
│   ├── contato.md            # Abordagem no LinkedIn
│   ├── comparar.md           # Comparação de ofertas
│   ├── entrevista.md         # Preparação para entrevista
│   ├── pesquisa.md           # Pesquisa aprofundada
│   ├── followup.md           # Cadência de acompanhamento
│   ├── padroes.md            # Análise de padrões
│   ├── tracker.md            # Dashboard de status
│   └── lote.md               # Processamento em lote
├── scripts/                   # Utilitários Node.js
├── templates/                 # Templates HTML, YAML
├── config/                    # Exemplos de configuração
├── data/                      # Dados de execução (gitignored)
├── reports/                   # Relatórios de avaliação (gitignored)
├── output/                    # PDFs gerados (gitignored)
├── fonts/                     # Fontes para geração de PDF
└── batch/                     # Workspace de processamento em lote
```

### Por que essa estrutura?

Em um projeto baseado em skill do Claude Code, os **modes são o código-fonte**. Cada arquivo `.md` em `modes/` funciona como um módulo/função em uma aplicação tradicional. A IA lê as instruções do mode e executa. Por isso:

| Diretório | Equivalente tradicional | Função |
|-----------|------------------------|--------|
| `modes/` | `src/` | Lógica principal (prompts de cada funcionalidade) |
| `scripts/` | `utils/` | Scripts utilitários (PDF, scanner, validação) |
| `templates/` | `public/` | Assets estáticos (HTML do currículo, configs base) |
| `config/` | `config/` | Configurações do usuário (exemplos) |
| `.claude/skills/` | `index.js` | Ponto de entrada e roteamento |

## Privacidade dos Dados

- **Todos os dados ficam na sua máquina.** Currículos, relatórios e histórico de candidaturas são arquivos locais.
- **Sem telemetria.** LucidIA não envia dados para lugar nenhum.
- **Sem credenciais armazenadas.** A ferramenta não lida com senhas de plataformas.
- **`.gitignore` pré-configurado** para excluir todos os dados pessoais do controle de versão.

## Compatibilidade

| Motor | Suporte |
|-------|---------|
| Claude Code | Completo (principal) |
| OpenClaude | Completo (via `.opencode/commands/`) |
| Codex (OpenAI) | Completo (via `AGENTS.md`) |

## Contribuindo

Contribuições são bem-vindas. Veja [CONTRIBUTING.md](CONTRIBUTING.md) para o guia completo.

Áreas de alto impacto:
- Novos scrapers para plataformas brasileiras
- Fontes de dados salariais e melhorias na estimativa
- Designs de template de currículo
- Atualizações de legislação trabalhista brasileira

## Licença

[MIT](LICENSE) - Lucas Lopes

---

<p align="center">
  <strong>LucidIA</strong> - Lucidez para sua carreira.<br>
  <em>Porque você merece ver o mercado de trabalho com clareza.</em>
</p>
