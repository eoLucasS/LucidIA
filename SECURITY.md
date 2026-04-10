# Política de Segurança

## Versões Suportadas

| Versão | Suportada          |
|--------|--------------------|
| 1.x.x  | :white_check_mark: |
| < 1.0  | :x:                |

## Reportando uma Vulnerabilidade

Se você descobrir uma vulnerabilidade de segurança no LucidIA, por favor reporte de forma responsável.

**NÃO abra uma issue pública.** Entre em contato diretamente com o mantenedor:

- **Contato**: Via [perfil do GitHub](https://github.com/eoLucasS)

### O que incluir

- Descrição da vulnerabilidade
- Passos para reproduzir
- Impacto potencial
- Sugestão de correção (se houver)

### Prazo de resposta

- **Confirmação**: Até 48 horas
- **Avaliação inicial**: Até 7 dias
- **Correção ou mitigação**: Até 30 dias para problemas críticos

## Princípios de Segurança

LucidIA foi projetado com os seguintes princípios:

1. **Todos os dados do usuário ficam locais.** Currículos, perfis, relatórios e dados de candidatura nunca saem da sua máquina.
2. **Sem API keys externas.** LucidIA roda pelo Claude Code, que gerencia sua própria autenticação.
3. **Sem envio automático.** A ferramenta nunca envia candidaturas sem ação explícita do usuário.
4. **Sem armazenamento de credenciais.** LucidIA não armazena nem manipula senhas de plataformas.
5. **Scraping somente leitura.** O scanner de portais apenas lê listagens de vagas publicamente disponíveis.

## Privacidade de Dados

- Dados pessoais (currículo, pretensão salarial, histórico de candidaturas) ficam em arquivos locais
- O `.gitignore` vem pré-configurado para excluir todos os dados pessoais do controle de versão
- Sem telemetria, analytics ou transmissão externa de dados
