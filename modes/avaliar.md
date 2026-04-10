# LucidIA - Modo Avaliar

Avaliação completa de uma vaga em 7 blocos. Este é o modo principal de análise do LucidIA.

---

## Entrada

O usuário fornece:
- URL da vaga, OU
- Texto da descrição da vaga (JD), OU
- Referência local: `local:jds/{arquivo}.md`

## Passo 0 - Extrair a Descrição da Vaga

Prioridade de extração:

1. **Playwright** (preferencial): Navegue até a URL e extraia o conteúdo completo da página de vaga
2. **WebFetch** (fallback): Se Playwright não estiver disponível, tente WebFetch para páginas estáticas
3. **WebSearch** (último recurso): Busque `site:{domínio} {título da vaga}` e extraia do resultado
4. **Texto direto**: Se o usuário colou o texto da vaga, use diretamente
5. **Arquivo local**: Se prefixo `local:`, leia o arquivo de `jds/`

Se a extração falhar em todos os métodos, peça ao usuário para colar o texto da vaga manualmente.

### Nota sobre LinkedIn

URLs do LinkedIn frequentemente exigem login. Se a extração falhar:
- Peça ao usuário para colar o texto da vaga
- Ou tente WebSearch: `site:linkedin.com/jobs "{título}" "{empresa}"`

---

## Passo 1 - Carregar Contexto do Candidato

Leia os seguintes arquivos:
- `cv.md` (obrigatório)
- `config/profile.yml` (obrigatório)
- `modes/_profile.md` (se existir)
- `article-digest.md` (se existir)

Se `cv.md` ou `config/profile.yml` não existirem, entre em modo de onboarding (ver CLAUDE.md).

---

## Passo 2 - Bloco A: Resumo da Vaga

Gere uma tabela com:

```markdown
### Bloco A - Resumo da Vaga

| Campo | Valor |
|-------|-------|
| Empresa | {nome da empresa} |
| Cargo | {título do cargo} |
| Arquétipo | {backend/frontend/fullstack/devops/data/techlead} |
| Domínio | {fintech/healthtech/edtech/e-commerce/SaaS/etc} |
| Senioridade | {Júnior/Pleno/Sênior/Staff/Lead/Principal} |
| Regime | {CLT/PJ/MEI/Não informado} |
| Modalidade | {Remoto/Híbrido/Presencial} |
| Localização | {cidade, estado} |
| Benefícios detectados | {VR, VA, PS, PLR, etc} |
| Tamanho do time | {se mencionado} |
| Stack principal | {tecnologias listadas} |
```

### Regras do Bloco A

- Se o regime não for mencionado, marque "Não informado" e adicione nota: "Ausência de regime pode indicar PJ disfarçado ou vaga incompleta"
- Se benefícios não forem listados, marque "Não informados"
- Mapeie a senioridade para o padrão brasileiro mesmo que a vaga use termos em inglês (Senior -> Sênior, Mid-level -> Pleno, etc)

---

## Passo 3 - Bloco B: Match com CV

Para cada requisito da vaga, faça match com o currículo do candidato:

```markdown
### Bloco B - Match com Currículo

**Requisitos atendidos:**
- {requisito 1}: ✅ Atendido - "{citação exata do cv.md, linha X}"
- {requisito 2}: ✅ Atendido - "{citação exata}"
- ...

**Gaps identificados:**
- {requisito não atendido 1}: ❌ Gap - Mitigação: "{estratégia para preencher ou contornar}"
- {requisito não atendido 2}: ⚠️ Parcial - "{o que o candidato tem vs o que a vaga pede}"
- ...

**Taxa de match:** {X}% dos requisitos atendidos ({Y} de {Z})

**Avaliação:** {O candidato atende os requisitos críticos? Os gaps são bloqueantes ou contornáveis?}
```

### Regras do Bloco B

- Cite SEMPRE a linha exata do cv.md. Não invente matches.
- Diferencie entre requisitos obrigatórios e desejáveis ("nice to have")
- Para gaps, proponha estratégias realistas de mitigação:
  - Experiência adjacente que transfere
  - Projetos pessoais que demonstram a skill
  - Aprendizado rápido com timeline estimada
  - Reformulação de experiência existente com vocabulário da vaga

---

## Passo 4 - Bloco C: Detecção de Senioridade

```markdown
### Bloco C - Análise de Senioridade

**Senioridade da vaga:** {nível detectado}
**Senioridade do candidato:** {nível do cv.md}
**Compatibilidade:** {Alinhado / Acima / Abaixo}

{Se houver gap de senioridade:}

**Estratégia de posicionamento:**
- {Como apresentar experiência para parecer compatível sem mentir}
- {Pontos específicos do CV que sustentam a posição}
- {Frases sugeridas para resumo profissional}

{Se a vaga pedir nível acima:}
**Plano "vender sênior sem mentir":**
- Conquista 1 que demonstra capacidade do nível pedido
- Conquista 2 que demonstra liderança/autonomia
- Como enquadrar experiência de forma aspiracional mas honesta
```

---

## Passo 5 - Bloco D: Pesquisa de Compensação

Use WebSearch para pesquisar dados salariais:

**Queries sugeridas:**
1. `"{empresa}" "{cargo}" salário glassdoor brasil`
2. `{cargo} {senioridade} salário {cidade} {ano atual}`
3. `pesquisa salarial {stack principal} {senioridade} brasil {ano atual}`

```markdown
### Bloco D - Compensação

**Regime detectado:** {CLT/PJ/Não informado}

**Faixa de mercado estimada:**
| Regime | Mínimo | Mediana | Máximo |
|--------|--------|---------|--------|
| CLT bruto | R$ {X} | R$ {Y} | R$ {Z} |
| PJ equivalente | R$ {X*1.5} | R$ {Y*1.6} | R$ {Z*1.8} |

**Compensação total estimada (CLT):**
- Salário bruto: R$ {valor}/mês
- 13º salário: R$ {valor}/ano
- Férias + 1/3: R$ {valor}/ano
- FGTS: R$ {valor}/ano
- Benefícios detectados: {VR R$ X + VA R$ Y + PS R$ Z}/mês
- PLR estimada: R$ {valor}/ano (se detectado)
- **Total anual estimado: R$ {total}**

**Comparação com meta do candidato:**
- Meta do candidato (profile.yml): R$ {meta_clt} CLT ou R$ {meta_pj} PJ
- Esta vaga: {Dentro da faixa / Abaixo / Acima}

**Fontes consultadas:** {listar fontes usadas}
```

### Regras do Bloco D

- Se a vaga não informar salário, estime baseado em dados de mercado
- Sempre normalize para base equivalente CLT vs PJ usando a fórmula de `_shared.md`
- Se encontrar dados no Glassdoor ou pesquisas, cite a fonte
- Se não encontrar dados específicos, use a tabela de referência de `_shared.md`
- Marque claramente o que é dado real vs estimativa

---

## Passo 6 - Bloco E: Plano de Personalização do CV

```markdown
### Bloco E - Plano de Personalização do Currículo

**Keywords prioritários para injeção (extraídos da vaga):**
1. {keyword 1} - presente no cv.md? {sim/não} - ação: {injetar em X / já presente}
2. {keyword 2} - ...
3. ...
(15-20 keywords)

**Top 5 mudanças para este currículo:**

1. **Resumo profissional**: Reescrever com foco em {foco da vaga}. Incluir: {keywords top 3}. Ponte narrativa: "{de onde vim} -> {para onde vou nesta vaga}"

2. **Experiência - {empresa X}**: Reordenar bullets. Promover: "{bullet que mais alinha com a vaga}". Reformular: "{bullet atual}" -> "{bullet com vocabulário da vaga}"

3. **Projetos**: Destacar {projeto Y} por alinhamento com {requisito da vaga}. Adicionar métricas: {sugestão}

4. **Competências**: Construir grade com: {6-8 competências extraídas da vaga}

5. **{Outra mudança específica}**: {detalhe}

**Cobertura estimada de keywords:** {X}% após mudanças
```

### Regras do Bloco E

- Keywords devem ser extraídos da vaga, não inventados
- Reformulações usam vocabulário exato da vaga, mas aplicados a experiência real do candidato
- Nunca sugira adicionar experiência que o candidato não tem
- Priorize mudanças por impacto (o que o ATS vai escanear primeiro)

---

## Passo 7 - Bloco F: Preparação para Entrevista

```markdown
### Bloco F - Preparação para Entrevista

**Histórias STAR+R mapeadas aos requisitos da vaga:**

#### 1. {Requisito da vaga: ex "experiência com microsserviços"}
- **Situação**: {contexto do candidato baseado no cv.md}
- **Tarefa**: {o que precisava ser feito}
- **Ação**: {o que o candidato fez especificamente}
- **Resultado**: {métricas e impacto}
- **Reflexão**: {o que aprendeu, como aplicaria nesta vaga}

#### 2. {Próximo requisito}
...

(6-10 histórias mapeadas)

**Perguntas prováveis específicas para esta vaga:**
1. {Pergunta técnica baseada na stack}
2. {Pergunta comportamental baseada no cargo}
3. {Pergunta sobre gap identificado no Bloco B}

**Pontos de atenção:**
- {Red flag do candidato que pode surgir e como lidar}
- {Pergunta sobre pretensão salarial: usar dados do Bloco D}
```

### Regras do Bloco F

- Histórias STAR devem ser baseadas no cv.md, não inventadas
- Se o candidato tem story-bank.md em interview-prep/, referencie histórias existentes
- Adicione novas histórias ao story-bank.md se ainda não existirem
- Foque nos requisitos mais pesados da vaga (os 3-5 principais)

---

## Passo 8 - Bloco G: Legitimidade da Postagem

```markdown
### Bloco G - Legitimidade da Postagem

**Avaliação:** {Alta Confiança ✅ / Proceder com Cautela ⚠️ / Suspeita ❌}

**Sinais analisados:**
- Data de postagem: {recente/antiga/repostada}
- Descrição: {específica/genérica/copiar-colar}
- Informações da empresa: {detalhadas/vagas/ausentes}
- Regime informado: {sim/não - ausência é red flag leve}
- Salário informado: {sim/não/"a combinar"}
- Requisitos: {realistas/excessivos/"unicórnio"}
- Processo seletivo: {descrito/não descrito}

**Nota:** Este bloco é informativo e separado do score 1-5. Uma vaga com score 4.5 pode ter legitimidade "Proceder com Cautela" se parecer repostada.
```

### Critérios de Legitimidade

**Alta Confiança:**
- Descrição detalhada e específica
- Empresa identificável com presença online
- Regime e benefícios informados
- Postada há menos de 30 dias
- Requisitos realistas para o nível

**Proceder com Cautela:**
- Salário "a combinar"
- Descrição parcialmente genérica
- Repostada (mesma vaga apareceu antes)
- Requisitos levemente inflados

**Suspeita:**
- Descrição genérica copiada
- Empresa sem presença online verificável
- Requisitos de "unicórnio" (10+ tecnologias para Júnior)
- Postada há mais de 60 dias sem atualização
- Múltiplas vagas idênticas em empresas diferentes

---

## Passo 9 - Score Global e Recomendação

Calcule o score usando as 10 dimensões de `_shared.md`:

```markdown
## Score Final

| Dimensão | Peso | Nota | Contribuição |
|----------|------|------|-------------|
| Alinhamento com North Star | 25% | {X.X} | {nota * peso} |
| Match com CV | 15% | {X.X} | ... |
| Senioridade adequada | 15% | {X.X} | ... |
| Compensação total | 10% | {X.X} | ... |
| Trajetória de crescimento | 10% | {X.X} | ... |
| Qualidade do remoto | 5% | {X.X} | ... |
| Reputação da empresa | 5% | {X.X} | ... |
| Stack tecnológica | 5% | {X.X} | ... |
| Velocidade do processo | 5% | {X.X} | ... |
| Sinais culturais | 5% | {X.X} | ... |
| **Score Global** | **100%** | **{X.X/5}** | |

**Legitimidade:** {Alta Confiança / Proceder com Cautela / Suspeita}

**Recomendação:**
{
  >= 4.5: "Match forte. Candidate-se com currículo personalizado."
  4.0-4.4: "Bom match. Vale se candidatar."
  3.5-3.9: "Match razoável. Candidate-se apenas com motivo específico."
  3.0-3.4: "Match fraco. Considere alternativas."
  < 3.0: "Não recomendado. Seu tempo vale mais em vagas alinhadas."
}
```

---

## Passo 10 - Salvar Relatório

1. Calcule o próximo número sequencial: leia `reports/`, pegue o maior número + 1
2. Gere o slug da empresa: nome em lowercase, espaços substituídos por hífens
3. Salve em: `reports/{numero}-{empresa-slug}-{YYYY-MM-DD}.md`

O relatório deve conter todos os 7 blocos (A-G) + score final.

**Cabeçalho do relatório:**
```markdown
# Avaliação: {Empresa} - {Cargo}

- **Score:** {X.X/5}
- **URL:** {url da vaga}
- **Legitimidade:** {Alta Confiança / Proceder com Cautela / Suspeita}
- **Data:** {YYYY-MM-DD}
- **PDF:** {caminho do PDF, se gerado}
```

---

## Passo 11 - Registrar no Tracker

Adicione uma linha em `data/applications.md`:

```
| {numero} | {YYYY-MM-DD} | {Empresa} | {Cargo} | {X.X/5} | Avaliada | ❌ | [{numero}](reports/{numero}-{slug}-{data}.md) | {TL;DR de 1 linha} |
```

O status inicial é sempre "Avaliada". O usuário decide se aplica.
