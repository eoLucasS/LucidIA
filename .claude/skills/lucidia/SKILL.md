---
name: lucidia
description: "Central de comando inteligente para busca de emprego no mercado brasileiro - avalia vagas, gera currículos, escaneia portais e acompanha candidaturas"
user_invocable: true
args: mode
argument-hint: "[scan | avaliar | pdf | pipeline | aplicar | contato | comparar | entrevista | pesquisa | tracker | followup | padroes | lote]"
---

# LucidIA - Roteamento do Skill

Quando invocado com `/lucidia {{mode}}`:

## Roteamento por Modo

### Modos com contexto compartilhado

Para os modos abaixo, leia `modes/_shared.md` + o arquivo do modo antes de executar:

| Modo | Arquivo | Objetivo |
|------|---------|----------|
| `scan` | `modes/scan.md` | Escanear portais e descobrir vagas |
| `avaliar` | `modes/avaliar.md` | Avaliação completa em 7 blocos |
| `pipeline` | `modes/pipeline.md` | Processar URLs pendentes do inbox |
| `pdf` | `modes/pdf.md` | Gerar currículo personalizado em PDF |
| `aplicar` | `modes/aplicar.md` | Assistente de preenchimento de formulários |
| `contato` | `modes/contato.md` | Gerar mensagens de abordagem para LinkedIn |
| `comparar` | `modes/comparar.md` | Comparar múltiplas ofertas lado a lado |
| `lote` | `modes/lote.md` | Processamento paralelo de múltiplas vagas |

### Modos standalone

Para os modos abaixo, leia apenas o arquivo do modo:

| Modo | Arquivo | Objetivo |
|------|---------|----------|
| `entrevista` | `modes/entrevista.md` | Preparação específica para entrevista |
| `pesquisa` | `modes/pesquisa.md` | Pesquisa aprofundada sobre empresa |
| `tracker` | `modes/tracker.md` | Dashboard de status das candidaturas |
| `followup` | `modes/followup.md` | Cadência de acompanhamento |
| `padroes` | `modes/padroes.md` | Análise de padrões de rejeição |

## Detecção de Auto-Pipeline

Se `{{mode}}` contém:
- URLs (começando com `http://` ou `https://`)
- Palavras-chave de JD: "responsabilidades", "requisitos", "qualificações", "requirements", "qualifications", "about the role", "sobre a vaga"
- Prefixo `local:` (referência a arquivo salvo em `jds/`)

Então execute o modo **auto-pipeline**:
1. Leia `modes/_shared.md` + `modes/auto-pipeline.md`
2. Execute a avaliação completa + geração de PDF + registro no tracker

## Menu (sem argumento)

Se `{{mode}}` estiver vazio, mostre:

```
LucidIA - Central de Comando

Descoberta:
  /lucidia scan          Escanear portais e descobrir vagas
  /lucidia pipeline      Processar vagas pendentes

Avaliação:
  /lucidia avaliar       Análise profunda de uma vaga (7 blocos)
  /lucidia comparar      Comparar múltiplas ofertas
  /lucidia lote          Avaliação paralela em lote

Conteúdo:
  /lucidia pdf           Gerar currículo personalizado
  /lucidia aplicar       Assistente de formulário de candidatura
  /lucidia contato       Mensagens de abordagem para LinkedIn

Inteligência:
  /lucidia entrevista    Preparação específica por empresa
  /lucidia pesquisa      Pesquisa aprofundada sobre empresa
  /lucidia padroes       Análise de padrões e otimização

Acompanhamento:
  /lucidia tracker       Status das candidaturas
  /lucidia followup      Cadência de follow-up

Dica: Cole uma URL de vaga diretamente para avaliação automática.
```

## Contexto Adicional

Quando o modo precisa avaliar uma vaga, leia também:
- `cv.md` (currículo do candidato)
- `config/profile.yml` (identidade e metas)
- `modes/_profile.md` (customizações pessoais, se existir)
- `article-digest.md` (pontos de prova, se existir)
