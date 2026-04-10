# Contribuindo com o LucidIA

Obrigado pelo interesse em contribuir com o LucidIA. Este projeto ajuda profissionais brasileiros a navegar o mercado de trabalho com IA, e cada contribuição faz diferença.

## Primeiros Passos

1. Faça um fork do repositório
2. Clone seu fork localmente
3. Crie uma nova branch a partir da `main`
4. Faça suas alterações
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
├── scripts/                   # Scripts utilitários Node.js
├── templates/                 # Templates HTML, YAML
├── config/                    # Exemplos de configuração
├── data/                      # Templates de dados de execução
├── fonts/                     # Fontes para geração de PDF
└── batch/                     # Workspace de processamento em lote
```

## Convenção de Commits

Seguimos [Conventional Commits](https://www.conventionalcommits.org/):

| Prefixo | Uso |
|---------|-----|
| `feat:` | Nova funcionalidade |
| `fix:` | Correção de bug |
| `docs:` | Apenas documentação |
| `style:` | Formatação, sem mudança de lógica |
| `refactor:` | Reestruturação de código, sem mudança de comportamento |
| `test:` | Adição ou atualização de testes |
| `chore:` | Manutenção, dependências, ferramentas |

### Formato da mensagem de commit

```
feat: add gupy portal scanner

Implements the Gupy careers page scraper with title filtering
and deduplication against scan history.
```

- Título: minúsculo após o prefixo, modo imperativo, até 72 caracteres
- Corpo: explique o quê e por quê, não como
- Escreva naturalmente, como um desenvolvedor faria
- Commits sempre em inglês

## Padrões de Código

- **Comentários no código**: Inglês
- **Arquivos de modo (prompts)**: Português (PT-BR)
- **Variáveis e funções**: Inglês, camelCase para JS, snake_case para Python
- **Nomes de arquivo**: Minúsculo, separados por hífen (ex: `generate-pdf.mjs`)

## O Que Contribuir

### Alto Impacto

- Novos scrapers para plataformas brasileiras (Catho, Vagas.com, InHire, etc.)
- Fontes de dados salariais e melhorias na estimativa
- Designs de template de currículo (compatível com ATS)
- Atualizações de legislação trabalhista brasileira (tabelas de impostos, cálculos de benefícios)

### Médio Impacto

- Melhorias na documentação
- Correções de bugs em scripts utilitários
- Melhorias na UI do dashboard

### Sempre Bem-vindos

- Reports de bugs com passos para reproduzir
- Sugestões de funcionalidades via Issues
- Correções de typos e clareza na documentação

## Regras Importantes

1. **Nunca commite dados de usuário.** Currículos, relatórios e configs pessoais devem ficar no `.gitignore`.
2. **Nunca adicione envio automático.** LucidIA recomenda, humanos decidem.
3. **Teste suas alterações.** Rode `npm run doctor` e `npm run verify` antes de enviar.
4. **Respeite o data contract.** Arquivos da camada de sistema podem ser modificados. Arquivos da camada do usuário não podem ser sobrescritos automaticamente.

## Dúvidas?

Abra uma Issue ou inicie uma Discussion no GitHub. Teremos prazer em ajudar.
