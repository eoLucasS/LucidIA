# LucidIA - Modo Follow-up

Cadência de acompanhamento para candidaturas ativas. Identifica follow-ups atrasados e gera rascunhos de mensagens.

---

## Entrada

Nenhum argumento necessário. Lê automaticamente de `data/applications.md` e `data/follow-ups.md`.

## Passo 1 - Analisar Candidaturas

Para cada entrada em `data/applications.md` com status "Aplicada", "Respondida" ou "Entrevista":

1. Calcule dias desde a última ação (data da candidatura ou último follow-up)
2. Classifique por urgência:

| Urgência | Condição | Ação |
|----------|----------|------|
| **URGENTE** | Empresa respondeu, candidato não respondeu há > 24h | Responder imediatamente |
| **ATRASADO** | Follow-up planejado está vencido | Enviar follow-up |
| **AGENDADO** | Follow-up programado, dentro do prazo | Aguardar |
| **FRIO** | 2+ follow-ups sem resposta | Considerar encerrar |

### Cadência Padrão

| Status | Primeiro Follow-up | Segundo Follow-up | Após Isso |
|--------|-------------------|-------------------|-----------|
| Aplicada | 7 dias após envio | 14 dias após envio | Marcar como frio |
| Respondida | 1 dia após contato | 3 dias se sem retorno | Escalar |
| Entrevista | 1 dia (agradecimento) | 5 dias (se sem feedback) | Perguntar status |

## Passo 2 - Dashboard de Urgência

```markdown
## Cadência de Follow-up

### URGENTE (responder em 24h)
| Empresa | Cargo | Último Contato | Dias | Ação |
|---------|-------|---------------|------|------|
| {empresa} | {cargo} | {data} | {N} | {responder mensagem de...} |

### ATRASADO (follow-up vencido)
| Empresa | Cargo | Aplicada em | Dias | Follow-ups Enviados |
|---------|-------|------------|------|-------------------|
| {empresa} | {cargo} | {data} | {N} | {X} |

### AGENDADO (no prazo)
| Empresa | Cargo | Próximo Follow-up | Em |
|---------|-------|------------------|-----|
| {empresa} | {cargo} | {data} | {N} dias |

### FRIO (considerar encerrar)
| Empresa | Cargo | Follow-ups | Último Contato |
|---------|-------|-----------|---------------|
| {empresa} | {cargo} | {N} | {data} |
```

## Passo 3 - Gerar Rascunhos

### Primeiro Follow-up
```
Oi {nome do contato}!

Espero que esteja bem. Me candidatei à vaga de {cargo} há {N} dias
e gostaria de reforçar meu interesse. Tenho experiência direta com
{skill relevante} e acredito que posso contribuir com {valor específico}.

Fico à disposição para conversar quando for conveniente.
Abraço!
```

### Segundo Follow-up
```
Oi {nome}!

Só passando para reiterar meu interesse na posição de {cargo}.
Desde minha candidatura, {novo ponto de valor ou atualização relevante}.

Se a posição ainda estiver aberta, adoraria avançar no processo.
Obrigado(a) pela atenção!
```

### Terceiro+ (sugerir encerramento)
Recomendação: "Considere marcar como frio. Após 2 follow-ups sem resposta, um terceiro raramente muda o resultado. Foque energia nas oportunidades que estão respondendo."

## Passo 4 - Registrar

Após o usuário confirmar que enviou um follow-up, registre em `data/follow-ups.md`:

```
| {#} | {app_#} | {YYYY-MM-DD} | {empresa} | {cargo} | {LinkedIn/Email} | {nome do contato} | {notas} |
```
