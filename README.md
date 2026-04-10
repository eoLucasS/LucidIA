<p align="center">
  <h1 align="center">LucidIA</h1>
  <p align="center">
    <em>Central de comando inteligente para busca de emprego no mercado brasileiro.</em>
  </p>
  <p align="center">
    <a href="#funcionalidades">Funcionalidades</a> &bull;
    <a href="#inicio-rapido">Inicio Rapido</a> &bull;
    <a href="#como-funciona">Como Funciona</a> &bull;
    <a href="#modos">Modos</a>
  </p>
  <p align="center">
    <img src="https://img.shields.io/badge/licen%C3%A7a-MIT-blue.svg" alt="Licenca">
    <img src="https://img.shields.io/badge/node-%3E%3D18-green.svg" alt="Node">
    <img src="https://img.shields.io/badge/motor-Claude%20Code-blueviolet.svg" alt="Motor">
    <img src="https://img.shields.io/badge/foco-Brasil%20%F0%9F%87%A7%F0%9F%87%B7-yellow.svg" alt="Brasil">
  </p>
</p>

---

> **"Empresas usam IA para filtrar candidatos. Candidatos merecem IA para escolher empresas."**

LucidIA traz lucidez ao mercado de trabalho brasileiro. Avalia vagas com um sistema de pontuacao de 10 dimensoes, calcula a compensacao real entre CLT e PJ, gera curriculos personalizados e ajuda voce a se candidatar com precisao cirurgica.

**5 candidaturas bem direcionadas batem 50 genericas.** Essa e a filosofia.

---

## O Problema

O mercado de trabalho brasileiro tem um problema de transparencia:

- **70-80% das vagas escondem o salario** atras de "a combinar"
- Empresas usam "pretensao salarial" como filtro para pagar menos aos candidatos
- Os regimes CLT e PJ tornam a comparacao de remuneracao quase impossivel sem calculos aprofundados
- Vagas fantasma, repostagens e descricoes vagas desperdicam o tempo de quem procura emprego
- Sistemas de ATS com IA filtram curriculos antes que um humano sequer os leia

LucidIA revida. Da ao candidato o mesmo poder analitico que as empresas usam para filtra-lo.

## Funcionalidades

### Motor de Avaliacao
- **Analise em 7 blocos** de cada vaga (resumo, match com CV, senioridade, remuneracao, plano de CV, prep de entrevista, legitimidade)
- **Pontuacao em 10 dimensoes** (escala 1-5) adaptada para o mercado brasileiro
- **Detector de legitimidade** sinaliza vagas fantasma e postagens suspeitas
- **Limiar de qualidade** recomenda quais vagas merecem sua candidatura

### Inteligencia Brasileira
- **Calculadora CLT vs PJ** com detalhamento completo de impostos e beneficios (INSS, IRRF, FGTS, 13o, ferias, VR, VA, plano de saude, PLR)
- **Deteccao de regime** classifica vagas como CLT, PJ, MEI ou Cooperativa
- **Estimativa salarial** por stack, senioridade, cidade e origem da empresa
- **Analise de beneficios** extrai e valoriza beneficios brasileiros das descricoes de vagas

### Descoberta de Vagas
- **Scanner multi-plataforma** encontra vagas no LinkedIn, Gupy, Greenhouse, Lever e mais
- **Filtragem por titulo** com palavras-chave positivas/negativas e boost de senioridade
- **Deduplicacao** cruzando historico de scan, pipeline e candidaturas
- **30+ empresas** de tecnologia brasileiras pre-configuradas

### Geracao de Conteudo
- **Curriculo otimizado para ATS** gerado como PDF via template HTML e Playwright
- **Injecao de palavras-chave** da descricao da vaga, incorporadas naturalmente na sua experiencia
- **Grade de competencias** construida a partir dos requisitos da vaga
- **Resumo profissional** reescrito por vaga com ponte narrativa

### Suporte a Candidatura
- **Assistente de formulario** gera respostas personalizadas para campos de candidatura
- **Mensagens para LinkedIn** cria abordagens personalizadas para recrutadores e gestores
- **Comparacao de ofertas** com remuneracao normalizada entre CLT e PJ
- **Pesquisa aprofundada** de empresas estruturada em 6 eixos de analise

### Inteligencia de Carreira
- **Preparacao para entrevistas** com intel especifica da empresa via Glassdoor, Blind e blogs de engenharia
- **Banco de historias STAR** cresce a cada avaliacao, reutilizavel entre entrevistas
- **Cadencia de follow-up** rastreia comunicacoes pendentes e gera rascunhos
- **Analise de padroes** identifica o que funciona e o que esta desperdicando seu tempo

## Inicio Rapido

### Pre-requisitos

- [Node.js](https://nodejs.org/) 18 ou superior
- [Claude Code](https://claude.ai/code) instalado e autenticado
- Git

### Instalacao

```bash
# Clone o repositorio
git clone https://github.com/eoLucasS/LucidIA.git
cd LucidIA

# Instale as dependencias
npm install
npx playwright install chromium

# Valide o setup
npm run doctor
```

### Primeiro Uso

```bash
# Abra o Claude Code no diretorio do projeto
claude
```

Na primeira execucao, LucidIA guia voce pelo setup:

1. **Curriculo**: Cole seu curriculo, URL do LinkedIn ou descreva sua experiencia
2. **Perfil**: Nome, email, cargos-alvo, faixa salarial, localizacao
3. **Portais**: Quais empresas e plataformas monitorar

Apos o setup, voce esta pronto:

```
/lucidia                    # Mostra modos disponiveis
/lucidia scan               # Busca vagas nas plataformas
/lucidia pipeline           # Avalia todas as vagas pendentes
/lucidia tracker            # Visualiza status das candidaturas
```

## Como Funciona

LucidIA opera como um [skill do Claude Code](https://docs.anthropic.com/en/docs/claude-code). Voce abre o Claude Code dentro do diretorio do projeto e ele se torna sua central de comando para busca de emprego.

```
Voce (no Claude Code)
  |
  |--- /lucidia scan ---------> Descobre vagas nas plataformas
  |--- /lucidia pipeline -----> Avalia cada vaga (7 blocos, 10 dimensoes)
  |--- /lucidia pdf ----------> Gera curriculo personalizado em PDF
  |--- /lucidia aplicar ------> Prepara respostas para formularios
  |--- /lucidia entrevista ----> Prepara voce para entrevistas
  |--- /lucidia tracker ------> Acompanha todas as candidaturas
  |
  v
Seus dados ficam locais. A IA recomenda. Voce decide.
```

**Sem API keys extras.** LucidIA usa o Claude Code como motor, que gerencia a autenticacao pela sua assinatura existente do Claude.

**Sem envio automatico.** LucidIA nunca clica em "Candidatar-se" por voce. Prepara tudo e voce da a palavra final.

## Modos

| Modo | Comando | Objetivo |
|------|---------|----------|
| **Scan** | `/lucidia scan` | Descobrir vagas nas plataformas brasileiras |
| **Pipeline** | `/lucidia pipeline` | Avaliar todas as URLs de vagas pendentes |
| **Avaliar** | `/lucidia avaliar` | Analise profunda de 7 blocos de uma vaga |
| **PDF** | `/lucidia pdf` | Gerar curriculo personalizado otimizado para ATS |
| **Aplicar** | `/lucidia aplicar` | Preparar respostas para formularios de candidatura |
| **Contato** | `/lucidia contato` | Gerar mensagens de abordagem no LinkedIn |
| **Comparar** | `/lucidia comparar` | Comparacao lado a lado de ofertas |
| **Entrevista** | `/lucidia entrevista` | Preparacao especifica por empresa |
| **Pesquisa** | `/lucidia pesquisa` | Pesquisa aprofundada sobre a empresa |
| **Tracker** | `/lucidia tracker` | Dashboard de status das candidaturas |
| **Follow-up** | `/lucidia followup` | Cadencia de acompanhamento e rascunhos |
| **Padroes** | `/lucidia padroes` | Analisar padroes de rejeicao e otimizar estrategia |
| **Lote** | `/lucidia lote` | Avaliacao paralela de multiplas vagas |

### Auto-Pipeline

Cole qualquer URL de vaga diretamente e LucidIA executa o pipeline completo:

```
> https://boards.greenhouse.io/empresa/jobs/12345

Executando auto-pipeline...
[1/5] Extraindo descricao da vaga...
[2/5] Avaliando (7 blocos, 10 dimensoes)...
[3/5] Gerando relatorio...
[4/5] Gerando curriculo personalizado...
[5/5] Atualizando tracker...

Score: 4.3/5 | Regime: CLT | Equivalente: R$ 18.200/mes total
Recomendacao: Match forte. Candidate-se com curriculo personalizado.
Relatorio: reports/042-empresa-2026-04-10.md
PDF: output/cv-lucas-empresa-2026-04-10.pdf
```

## Inteligencia CLT vs PJ

Uma das funcionalidades unicas do LucidIA. Quando uma vaga diz "R$ 15.000 PJ", a maioria dos candidatos nao percebe que isso pode equivaler a apenas R$ 9.000 CLT apos considerar impostos, beneficios ausentes e provisoes.

LucidIA calcula:

| Componente | CLT R$ 10.000 | PJ Equivalente |
|-----------|---------------|----------------|
| Bruto mensal | R$ 10.000 | R$ 10.000 |
| INSS (empregado) | -R$ 909 | N/A |
| IRRF | -R$ 1.604 | N/A |
| Liquido mensal | **R$ 7.487** | ~R$ 8.175 |
| 13o salario | +R$ 10.000/ano | Nenhum |
| Ferias + 1/3 | +R$ 13.333/ano | Nenhum |
| FGTS (8%) | +R$ 10.664/ano | Nenhum |
| VR/VA | +R$ 18.000/ano | Nenhum |
| Plano de saude | +R$ 12.000/ano | -R$ 12.000/ano |
| PLR (estimativa) | +R$ 15.000/ano | Nenhum |
| Impostos PJ (Simples) | N/A | -R$ 2.325/mes |
| Contador | N/A | -R$ 350/mes |
| **Total real anual** | **~R$ 166.000** | **~R$ 98.100** |

> PJ R$ 10.000 NAO e igual a CLT R$ 10.000. LucidIA mostra os numeros reais.

## Estrutura do Projeto

```
LucidIA/
├── .claude/skills/lucidia/   # Registro do skill
├── modes/                     # Modos do agente (PT-BR)
│   ├── _shared.md            # Pontuacao, arquetipos, regras brasileiras
│   ├── _profile.template.md  # Template de customizacao do usuario
│   ├── avaliar.md            # Avaliacao em 7 blocos
│   ├── scan.md               # Scanner de portais
│   ├── pdf.md                # Geracao de curriculo
│   ├── pipeline.md           # Processador de inbox de URLs
│   ├── aplicar.md            # Assistente de formulario
│   ├── contato.md            # Abordagem no LinkedIn
│   ├── comparar.md           # Comparacao de ofertas
│   ├── entrevista.md         # Preparacao para entrevista
│   ├── pesquisa.md           # Pesquisa aprofundada
│   ├── followup.md           # Cadencia de acompanhamento
│   ├── padroes.md            # Analise de padroes
│   ├── tracker.md            # Dashboard de status
│   └── lote.md               # Processamento em lote
├── scripts/                   # Utilitarios Node.js
├── templates/                 # Templates HTML, YAML
├── config/                    # Exemplos de configuracao
├── data/                      # Dados de execucao (gitignored)
├── reports/                   # Relatorios de avaliacao (gitignored)
├── output/                    # PDFs gerados (gitignored)
├── fonts/                     # Fontes para geracao de PDF
└── batch/                     # Workspace de processamento em lote
```

### Por que esta estrutura?

Em um projeto baseado em skill do Claude Code, os **modes sao o codigo-fonte**. Cada arquivo `.md` em `modes/` funciona como um modulo/funcao em uma aplicacao tradicional. A IA le as instrucoes do mode e executa. Por isso:

| Diretorio | Equivalente tradicional | Funcao |
|-----------|------------------------|--------|
| `modes/` | `src/` | Logica principal (prompts de cada funcionalidade) |
| `scripts/` | `utils/` | Scripts utilitarios (PDF, scanner, validacao) |
| `templates/` | `public/` | Assets estaticos (HTML do curriculo, configs base) |
| `config/` | `config/` | Configuracoes do usuario (exemplos) |
| `.claude/skills/` | `index.js` | Ponto de entrada e roteamento |

## Privacidade dos Dados

- **Todos os dados ficam na sua maquina.** Curriculos, relatorios e historico de candidaturas sao arquivos locais.
- **Sem telemetria.** LucidIA nao envia dados para lugar nenhum.
- **Sem credenciais armazenadas.** A ferramenta nao lida com senhas de plataformas.
- **`.gitignore` pre-configurado** para excluir todos os dados pessoais do controle de versao.

## Compatibilidade

| Motor | Suporte |
|-------|---------|
| Claude Code | Completo (principal) |
| OpenClaude | Completo (via `.opencode/commands/`) |
| Codex (OpenAI) | Completo (via `AGENTS.md`) |

## Contribuindo

Contribuicoes sao bem-vindas. Veja [CONTRIBUTING.md](CONTRIBUTING.md) para o guia completo.

Areas de alto impacto:
- Novos scrapers para plataformas brasileiras
- Fontes de dados salariais e melhorias na estimativa
- Designs de template de curriculo
- Atualizacoes de legislacao trabalhista brasileira

## Licenca

[MIT](LICENSE) - Lucas Lopes

---

<p align="center">
  <strong>LucidIA</strong> - Lucidez para sua carreira.<br>
  <em>Porque voce merece ver o mercado de trabalho com clareza.</em>
</p>
