

# Remover Empresa Duplicada e Prevenir Duplicatas Futuras

## Problema
O usuario `dtsilva84@hotmail.com` possui 2 registros na tabela `companies` com o mesmo `owner_user_id`. A empresa mais antiga (09/02) e a correta, e a mais nova (16/02) e a duplicada.

## Dados encontrados

```text
ID: 507b3741... | Criada: 09/02/2026 | Status: trial (0 dias) -- MANTER
ID: f50d4ea9... | Criada: 16/02/2026 | Status: trial (5 dias) -- EXCLUIR
```

## Alteracoes

### 1. Excluir a empresa duplicada
- Usar a edge function `delete-company` existente para excluir a empresa `f50d4ea9-474a-48cd-9d6d-f1c374abd44a` (a duplicada de 16/02)
- Isso vai limpar todos os dados associados (unidades, barbeiros, servicos, etc.)

### 2. Adicionar constraint unica no banco de dados
- Criar uma migration que adiciona um indice unico na coluna `owner_user_id` da tabela `companies`
- Isso impede que o mesmo usuario crie mais de uma empresa
- Usa `CREATE UNIQUE INDEX` para garantir a restricao no nivel do banco

```text
ALTER TABLE companies ADD CONSTRAINT unique_owner_user_id UNIQUE (owner_user_id);
```

### 3. Verificar o fluxo de cadastro (opcional)
- Revisar o codigo de criacao de empresa para garantir que faz um check antes de criar, como fallback adicional

## Impacto
- A empresa duplicada sera removida permanentemente
- Novas tentativas de criar uma segunda empresa pelo mesmo usuario serao bloqueadas pelo banco de dados
