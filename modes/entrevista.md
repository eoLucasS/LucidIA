# LucidIA - Modo Entrevista

Preparação específica por empresa com intel de processos seletivos, perguntas prováveis e mapeamento de histórias STAR.

---

## Entrada

O usuário fornece: nome da empresa + cargo.

## Passo 1 - Pesquisar Intel de Entrevista

Execute 5 queries via WebSearch:

1. `"{empresa}" "{cargo}" interview questions site:glassdoor.com`
2. `"{empresa}" interview process site:teamblind.com`
3. `"{empresa}" "{cargo}" interview site:leetcode.com/discuss`
4. `"{empresa}" engineering blog`
5. `"{empresa}" processo seletivo entrevista {cargo}`

## Passo 2 - Compilar Intel

```markdown
## Preparação para Entrevista - {Empresa} - {Cargo}

### Visão Geral do Processo
- **Etapas:** {número} rodadas
- **Tempo estimado:** {X} semanas
- **Dificuldade:** {Fácil/Média/Difícil} (baseado em Glassdoor)
- **Taxa de experiência positiva:** {X}% (se disponível)
- **Particularidades:** {algo único do processo desta empresa}

### Detalhamento por Rodada

**Rodada 1: {Tipo - ex: Triagem com RH}**
- Duração: {X} minutos
- Quem avalia: {cargo do entrevistador}
- O que testa: {competências avaliadas}
- Dicas: {como se preparar}

**Rodada 2: {Tipo - ex: Técnica}**
...

**Rodada N: {Tipo - ex: Fit cultural / Bar raiser}**
...
```

## Passo 3 - Perguntas Prováveis

Categorize as perguntas encontradas:

```markdown
### Perguntas Prováveis

**Técnicas:**
1. {pergunta} - Ponto de prova: {referência ao cv.md}
2. ...

**Comportamentais:**
1. {pergunta} - História sugerida: {referência ao story-bank}
2. ...

**Específicas do Cargo:**
1. {pergunta baseada nos requisitos da vaga}
2. ...

**Sobre Gaps no CV (red flags):**
1. "{Por que saiu da empresa X?}" - Abordagem: {como responder honestamente}
2. "{Falta experiência em Y}" - Abordagem: {mitigação do Bloco B}
```

Perguntas inferidas da JD devem ser marcadas com [inferida da vaga].

## Passo 4 - Mapeamento de Histórias STAR

Se `interview-prep/story-bank.md` existir, mapeie histórias existentes:

```markdown
### Banco de Histórias

| Pergunta Provável | História Sugerida | Fonte |
|-------------------|-------------------|-------|
| "{pergunta 1}" | {título da história} | story-bank.md |
| "{pergunta 2}" | {nova história do cv.md} | cv.md linha X |
```

Se novas histórias forem necessárias, gere-as e sugira adicionar ao story-bank.

## Passo 5 - Prep Técnica

```markdown
### Checklist de Preparação Técnica

Priorizado por frequência nas entrevistas:
- [ ] {tópico 1} - {recurso para estudar}
- [ ] {tópico 2} - {recurso}
- [ ] {tópico 3} - {recurso}
```

## Passo 6 - Sinais da Empresa

```markdown
### Sinais da Empresa

**Valores declarados:** {do site/glassdoor}
**Vocabulário que usam:** {termos específicos da cultura}
**Red flags a evitar:** {o que não dizer/fazer}
**Perguntas inteligentes para fazer:**
1. {pergunta que demonstra pesquisa}
2. {pergunta sobre desafio técnico específico}
3. {pergunta sobre crescimento/carreira}
```

## Saída Final

Salve em `interview-prep/{empresa-slug}-{cargo-slug}.md`.
