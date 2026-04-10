# LucidIA - Modo Pesquisa

Pesquisa aprofundada sobre uma empresa, estruturada em 6 eixos de análise.

---

## Entrada

O usuário fornece o nome da empresa e opcionalmente o cargo.

## 6 Eixos de Pesquisa

Para cada eixo, execute WebSearch com as queries sugeridas e compile os resultados.

### Eixo 1 - Estratégia e Produto
**Queries:**
- `"{empresa}" produto estratégia tecnologia {ano atual}`
- `"{empresa}" blog engenharia tecnologia stack`
- `"{empresa}" funding investimento rodada`

**Buscar:** Principais produtos, stack tecnológica, papers/blog posts, estratégia de IA, patentes

### Eixo 2 - Movimentos Recentes
**Queries:**
- `"{empresa}" contratação layoff {ano atual}`
- `"{empresa}" aquisição lançamento parceria {ano atual}`
- `"{empresa}" notícias recentes`

**Buscar:** Contratações em massa ou layoffs, aquisições, lançamentos de produto, mudanças de liderança

### Eixo 3 - Cultura de Engenharia
**Queries:**
- `"{empresa}" engineering culture glassdoor`
- `"{empresa}" trabalhar como é site:glassdoor.com.br`
- `"{empresa}" github open source`
- `"{empresa}" remoto híbrido política`

**Buscar:** Cadência de deploy, estrutura de repos, linguagens usadas, política de remoto, reviews de funcionários

### Eixo 4 - Desafios Prováveis
**Queries:**
- `"{empresa}" desafios problemas tecnologia`
- `"{empresa}" escala migração dívida técnica`

**Buscar:** Problemas de escalabilidade, migrações em andamento, dívida técnica conhecida, pontos de dor

### Eixo 5 - Concorrentes e Diferenciação
**Queries:**
- `"{empresa}" vs {concorrente} comparação`
- `"{empresa}" mercado posição participação`

**Buscar:** Principais concorrentes, como se diferencia, tamanho do mercado, tendências

### Eixo 6 - Ângulo do Candidato
Com base no cv.md e profile.yml:
- Qual valor único você traz para esta empresa?
- Quais projetos do seu portfólio se conectam com os desafios deles?
- Que história de entrevista seria mais impactante?

---

## Saída

```markdown
## Pesquisa - {Empresa}

### 1. Estratégia e Produto
{resumo com fontes}

### 2. Movimentos Recentes
{resumo com fontes}

### 3. Cultura de Engenharia
{resumo com fontes}

### 4. Desafios Prováveis
{resumo com fontes}

### 5. Concorrentes
{resumo com fontes}

### 6. Seu Ângulo
{como se posicionar baseado no CV}

### Fontes
- {lista de URLs consultadas}
```
