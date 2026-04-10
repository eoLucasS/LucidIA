# Contrato de Dados - LucidIA

Este documento define quais arquivos pertencem ao sistema (atualizáveis) e quais pertencem ao usuário (protegidos).

## Camada do Sistema

Esses arquivos podem ser atualizados automaticamente sem risco para os dados do usuário:

| Caminho | Função |
|---------|--------|
| `CLAUDE.md` | Instruções do agente |
| `AGENTS.md` | Compatibilidade Codex/OpenClaude |
| `DATA_CONTRACT.md` | Este documento |
| `modes/_shared.md` | Contexto do sistema (pontuação, regras) |
| `modes/*.md` (exceto `_profile.md`) | Modos de execução |
| `scripts/*.mjs` | Scripts utilitários |
| `templates/*` | Templates de configuração |
| `batch/batch-prompt.md` | Prompt do worker de lote |
| `batch/batch-runner.sh` | Orquestrador de lote |
| `.claude/skills/lucidia/SKILL.md` | Registro do skill |
| `package.json` | Dependências e scripts |

## Camada do Usuário

Esses arquivos **NUNCA** devem ser sobrescritos automaticamente:

| Caminho | Função |
|---------|--------|
| `cv.md` | Currículo do candidato |
| `article-digest.md` | Pontos de prova adicionais |
| `config/profile.yml` | Identidade, metas e preferências |
| `modes/_profile.md` | Customizações pessoais de avaliação |
| `portals.yml` | Portais e empresas monitorados |
| `data/applications.md` | Tracker de candidaturas |
| `data/pipeline.md` | Inbox de URLs pendentes |
| `data/scan-history.tsv` | Histórico de scans |
| `data/follow-ups.md` | Log de acompanhamento |
| `reports/*` | Relatórios de avaliação |
| `output/*` | PDFs gerados |
| `interview-prep/*` | Intel de entrevistas |
| `jds/*` | Descrições de vagas salvas |

## Regra de Ouro

Customizações do usuário vão para `modes/_profile.md` ou `config/profile.yml`.

Contexto do sistema fica em `modes/_shared.md`.

Nunca misture conteúdo específico do usuário com conteúdo do sistema.
