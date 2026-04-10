# LucidIA - Instruções para Codex e OpenClaude

Este arquivo instrui agentes baseados em Codex (OpenAI) e OpenClaude a utilizar o LucidIA.

## Configuração

A lógica compartilhada está em `CLAUDE.md`. Leia esse arquivo primeiro para entender:

- O contrato de dados (camada do sistema vs camada do usuário)
- As regras globais (NUNCA/SEMPRE)
- O fluxo de onboarding
- Os estados canônicos de candidatura

## Roteamento de Comandos

Os comandos estão mapeados em `.opencode/commands/`. Cada comando invoca o skill LucidIA com o modo correspondente.

## Regra Principal

**O agente nunca envia candidaturas automaticamente.** O agente avalia, recomenda e prepara. O usuário decide e executa.

## Contexto Brasileiro

Todas as avaliações devem considerar:

- Regime de contratação: CLT, PJ, MEI, Cooperativa
- Benefícios brasileiros: VR, VA, VT, plano de saúde, 13º, férias + 1/3, PLR, FGTS
- Senioridade no padrão BR: Júnior, Pleno, Sênior, Staff, Lead, Principal
- Normalização salarial: sempre comparar em base equivalente CLT vs PJ
