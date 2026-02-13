
# Parceria com Influenciadores no Admin

## Objetivo
Criar um sistema no painel admin para gerenciar parcerias com influenciadores, permitindo definir uma porcentagem de 1% a 3% do lucro do negocio (MRR), com controle de caixa e historico de pagamentos.

## O que sera criado

### 1. Nova tabela no banco de dados: `influencer_partnerships`
- `id`, `name` (nome do influenciador), `email`, `phone`, `instagram_handle`
- `commission_percent` (1 a 3%)
- `status` (active, paused, ended)
- `started_at`, `ends_at`
- `notes`
- `created_at`, `updated_at`
- RLS: apenas super admin pode ler/escrever

### 2. Nova tabela: `influencer_payments`
- `id`, `partnership_id` (FK para influencer_partnerships)
- `period_start`, `period_end` (periodo de referencia)
- `mrr_base` (MRR do periodo)
- `commission_percent`, `amount` (valor calculado)
- `status` (pending, paid, cancelled)
- `paid_at`, `payment_method`, `notes`
- `created_at`
- RLS: apenas super admin

### 3. Nova pagina admin: `/admin/influencers`
- Listagem de influenciadores com status, porcentagem e valor acumulado
- Modal para cadastrar/editar influenciador (nome, contato, Instagram, % de 1 a 3)
- Secao de controle de caixa:
  - Tabela de pagamentos por periodo (mes a mes)
  - Calculo automatico: MRR do periodo x porcentagem do influenciador
  - Botao para marcar como "Pago" com data e metodo de pagamento
  - Resumo com total pago, total pendente

### 4. Atualizacoes no admin
- Novo item "Influenciadores" no menu lateral (AdminSidebar)
- Nova rota `/admin/influencers` no App.tsx protegida por SuperAdminGuard
- KPI card no dashboard com total de comissoes de influenciadores

## Secao Tecnica

### Arquivos novos
- `supabase/migrations/xxx_create_influencer_tables.sql` - tabelas e RLS
- `src/pages/admin/AdminInfluencers.tsx` - pagina principal
- `src/components/admin/InfluencerFormModal.tsx` - modal de cadastro/edicao
- `src/components/admin/InfluencerPaymentsTable.tsx` - tabela de pagamentos
- `src/components/admin/InfluencerPaymentModal.tsx` - modal para registrar pagamento
- `src/hooks/useInfluencerPartnerships.ts` - hook para CRUD e queries

### Arquivos editados
- `src/components/admin/AdminSidebar.tsx` - adicionar item "Influenciadores"
- `src/App.tsx` - adicionar rota `/admin/influencers`
- `src/integrations/supabase/types.ts` - tipos atualizados

### Calculo de comissao
- Base: MRR total do sistema (soma de `monthly_price` das companies ativas)
- Comissao = MRR x (commission_percent / 100)
- Gerado mensalmente, registrado na tabela de pagamentos
