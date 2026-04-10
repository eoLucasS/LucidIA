# LucidIA - Modo Contato

Gera mensagens de abordagem personalizadas para LinkedIn. Encontra contatos relevantes e cria mensagens adaptadas ao estilo brasileiro de networking profissional.

---

## Entrada

O usuário fornece:
- Nome da empresa + cargo
- Ou referência a relatório existente

## Passo 1 - Encontrar Contatos

Use WebSearch para encontrar 3 tipos de contato:

1. **Recrutador**: `"{empresa}" recrutador OR recruiter OR talent acquisition linkedin`
2. **Gestor da vaga**: `"{empresa}" engineering manager OR tech lead "{área}" linkedin`
3. **Par (colega)**: `"{empresa}" {cargo similar} OR engineer linkedin`

Para cada contato encontrado, registre: nome, cargo, URL do LinkedIn.

Se não encontrar via WebSearch, sugira ao usuário buscar manualmente.

## Passo 2 - Gerar Mensagens

### Framework: 3 Frases, ~300 Caracteres

Cada mensagem segue a estrutura:
1. **Frase 1 (Gancho)**: Referência específica ao trabalho/empresa da pessoa
2. **Frase 2 (Conexão)**: Como sua experiência se conecta com o que eles fazem
3. **Frase 3 (CTA suave)**: Pedido leve, não desesperado

### Para Recrutador
```
Oi {nome}! Vi a vaga de {cargo} na {empresa} e me identifiquei com {aspecto específico da vaga}.
Tenho {X anos} de experiência com {skill relevante} e recentemente {conquista resumida}.
Adoraria trocar uma ideia sobre a posição, se fizer sentido.
```

### Para Gestor da Vaga
```
Oi {nome}! Acompanho o trabalho da {empresa} em {área específica} e vi que estão buscando {cargo}.
Na {empresa anterior}, lidei com {desafio similar} e {resultado quantificado}.
Seria ótimo conversar sobre como posso contribuir com o time.
```

### Para Par (Colega)
```
Oi {nome}! Vi seu perfil e achei interessante seu trabalho com {algo específico do perfil}.
Estou explorando oportunidades em {área} e a {empresa} me chamou atenção.
Você teria uns minutos para trocar uma ideia sobre como é trabalhar aí?
```

**IMPORTANTE:** Mensagem para par é sobre CONEXÃO, não pedido de emprego. Nunca peça indicação diretamente.

## Passo 3 - Tom Brasileiro

O networking brasileiro é mais pessoal que o americano:
- Use "Oi" (não "Prezado" nem "Dear")
- Use primeiro nome
- Seja direto mas caloroso
- Demonstre interesse genuíno
- Evite jargões corporativos ("sinergia", "agregar valor", "fit cultural")
- NUNCA compartilhe número de telefone na primeira mensagem

---

## Saída

```markdown
### Contatos - {Empresa}

**Contato 1: {Nome} ({Cargo})**
Perfil: {URL do LinkedIn}
Tipo: Recrutador

> {mensagem em PT-BR}

---

**Contato 2: {Nome} ({Cargo})**
Perfil: {URL do LinkedIn}
Tipo: Gestor

> {mensagem em PT-BR}

---

**Contato 3: {Nome} ({Cargo})**
Perfil: {URL do LinkedIn}
Tipo: Par

> {mensagem em PT-BR}

---

Copie a mensagem e envie pelo LinkedIn. Personalize se necessário.
Após enviar, registre em /lucidia followup para acompanhamento.
```
