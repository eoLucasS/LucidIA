# Contribuindo com o LucidIA

Obrigado pelo interesse em contribuir com o LucidIA. Este projeto ajuda profissionais brasileiros a navegar o mercado de trabalho com IA, e cada contribuicao faz diferenca.

## Primeiros Passos

1. Faca um fork do repositorio
2. Clone seu fork localmente
3. Crie uma nova branch a partir da `main`
4. Faca suas alteracoes
5. Envie um Pull Request

## Setup de Desenvolvimento

```bash
git clone https://github.com/eoLucasS/LucidIA.git
cd LucidIA
npm install
npx playwright install chromium
npm run doctor
```

## Estrutura do Projeto

```
LucidIA/
├── .claude/skills/lucidia/   # Registro do skill no Claude Code
├── modes/                     # Modos do agente (PT-BR)
├── scripts/                   # Scripts utilitarios Node.js
├── templates/                 # Templates HTML, YAML
├── config/                    # Exemplos de configuracao
├── data/                      # Templates de dados de execucao
├── fonts/                     # Fontes para geracao de PDF
└── batch/                     # Workspace de processamento em lote
```

## Convencao de Commits

Seguimos [Conventional Commits](https://www.conventionalcommits.org/):

| Prefixo | Uso |
|---------|-----|
| `feat:` | Nova funcionalidade |
| `fix:` | Correcao de bug |
| `docs:` | Apenas documentacao |
| `style:` | Formatacao, sem mudanca de logica |
| `refactor:` | Reestruturacao de codigo, sem mudanca de comportamento |
| `test:` | Adicao ou atualizacao de testes |
| `chore:` | Manutencao, dependencias, ferramentas |

### Formato da mensagem de commit

```
feat: add gupy portal scanner

Implements the Gupy careers page scraper with title filtering
and deduplication against scan history.
```

- Titulo: minusculo apos o prefixo, modo imperativo, ate 72 caracteres
- Corpo: explique o que e por que, nao como
- Escreva naturalmente, como um desenvolvedor faria
- Commits sempre em ingles

## Padroes de Codigo

- **Comentarios no codigo**: Ingles
- **Arquivos de modo (prompts)**: Portugues (PT-BR)
- **Variaveis e funcoes**: Ingles, camelCase para JS, snake_case para Python
- **Nomes de arquivo**: Minusculo, separados por hifen (ex: `generate-pdf.mjs`)

## O Que Contribuir

### Alto Impacto

- Novos scrapers para plataformas brasileiras (Catho, Vagas.com, InHire, etc.)
- Fontes de dados salariais e melhorias na estimativa
- Designs de template de curriculo (compativel com ATS)
- Atualizacoes de legislacao trabalhista brasileira (tabelas de impostos, calculos de beneficios)

### Medio Impacto

- Melhorias na documentacao
- Correcoes de bugs em scripts utilitarios
- Melhorias na UI do dashboard

### Sempre Bem-vindos

- Reports de bugs com passos para reproduzir
- Sugestoes de funcionalidades via Issues
- Correcoes de typos e clareza na documentacao

## Regras Importantes

1. **Nunca commite dados de usuario.** Curriculos, relatorios e configs pessoais devem ficar no `.gitignore`.
2. **Nunca adicione envio automatico.** LucidIA recomenda, humanos decidem.
3. **Teste suas alteracoes.** Rode `npm run doctor` e `npm run verify` antes de enviar.
4. **Respeite o data contract.** Arquivos da camada de sistema podem ser modificados. Arquivos da camada do usuario nao podem ser sobrescritos automaticamente.

## Duvidas?

Abra uma Issue ou inicie uma Discussion no GitHub. Teremos prazer em ajudar.
