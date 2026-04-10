# Politica de Seguranca

## Versoes Suportadas

| Versao | Suportada          |
|--------|--------------------|
| 1.x.x  | :white_check_mark: |
| < 1.0  | :x:                |

## Reportando uma Vulnerabilidade

Se voce descobrir uma vulnerabilidade de seguranca no LucidIA, por favor reporte de forma responsavel.

**NAO abra uma issue publica.** Entre em contato diretamente com o mantenedor:

- **Contato**: Via [perfil do GitHub](https://github.com/eoLucasS)

### O que incluir

- Descricao da vulnerabilidade
- Passos para reproduzir
- Impacto potencial
- Sugestao de correcao (se houver)

### Prazo de resposta

- **Confirmacao**: Ate 48 horas
- **Avaliacao inicial**: Ate 7 dias
- **Correcao ou mitigacao**: Ate 30 dias para problemas criticos

## Principios de Seguranca

LucidIA foi projetado com os seguintes principios:

1. **Todos os dados do usuario ficam locais.** Curriculos, perfis, relatorios e dados de candidatura nunca saem da sua maquina.
2. **Sem API keys externas.** LucidIA roda pelo Claude Code, que gerencia sua propria autenticacao.
3. **Sem envio automatico.** A ferramenta nunca envia candidaturas sem acao explicita do usuario.
4. **Sem armazenamento de credenciais.** LucidIA nao armazena nem manipula senhas de plataformas.
5. **Scraping somente leitura.** O scanner de portais apenas le listagens de vagas publicamente disponiveis.

## Privacidade de Dados

- Dados pessoais (curriculo, pretensao salarial, historico de candidaturas) ficam em arquivos locais
- O `.gitignore` vem pre-configurado para excluir todos os dados pessoais do controle de versao
- Sem telemetria, analytics ou transmissao externa de dados
