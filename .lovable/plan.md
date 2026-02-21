
# Guia Pos-Cadastro e Orientacao ao Usuario

## Problema
Apos o cadastro, o usuario nao recebe nenhuma orientacao sobre:
1. Que precisa confirmar o email (fica perdido se nao for direto ao checkout)
2. Como contratar/trocar de plano
3. Como cancelar a assinatura

## Solucao

### 1. Tela de "Verifique seu Email" apos o cadastro
Criar uma nova pagina `/email-confirmacao` que sera exibida apos o signup, informando o usuario que ele precisa verificar o email antes de continuar. Essa tela aparece entre o cadastro e o checkout (ou quando o checkout falha).

**Conteudo da tela:**
- Icone de email animado
- Mensagem: "Verifique sua caixa de entrada"
- Instrucao: "Enviamos um email para **seu@email.com**. Clique no link para confirmar sua conta."
- Dica: "Nao encontrou? Verifique a pasta de spam"
- Botao "Reenviar email"
- Botao "Ja confirmei, ir para o painel"

### 2. Banner de Onboarding no Dashboard
Adicionar um card de boas-vindas no topo do Dashboard (primeira vez) com 3 passos visuais:

```text
+---------------------------------------------------+
|  Bem-vindo ao BarberSoft! Complete sua conta:      |
|                                                    |
|  [1] Confirmar email  (check ou pendente)          |
|  [2] Escolher plano   -> link /assinatura          |
|  [3] Configurar       -> link /configuracoes      |
+---------------------------------------------------+
```

O card sera exibido enquanto o usuario estiver em trial e pode ser dispensado.

### 3. Melhorias na pagina de Assinatura
Adicionar secao "Como funciona?" na pagina `/assinatura` com um guia visual explicando:
- Como contratar: escolher plano, preencher dados de pagamento
- Como trocar de plano: acessar "Gerenciar" no portal Stripe
- Como cancelar: clicar em "Cancelar Assinatura", confirmar no portal
- Garantia de 30 dias

---

## Detalhes Tecnicos

### Arquivos a criar
- `src/pages/EmailConfirmacao.tsx` - Pagina pos-cadastro com instrucoes de confirmacao de email e botao de reenvio

### Arquivos a modificar
- `src/pages/Auth.tsx` - Apos signup, redirecionar para `/email-confirmacao` em vez de ir direto ao checkout (o checkout sera iniciado apos confirmacao ou via pagina de assinatura)
- `src/App.tsx` - Adicionar rota `/email-confirmacao`
- `src/pages/Dashboard.tsx` - Adicionar card de onboarding para usuarios em trial com os 3 passos
- `src/pages/Assinatura.tsx` - Adicionar secao "Como funciona?" com guia visual de contratacao/troca/cancelamento

### Fluxo atualizado

```text
Signup -> Cria conta + company (trial)
       -> Redireciona ao Checkout Stripe
       -> Mostra pagina "Verifique seu Email" (novo)
       
Dashboard (trial) -> Mostra card de onboarding com passos
                   -> Link direto para Assinatura

Assinatura -> Secao "Como funciona" com passo a passo
           -> Botoes de acao claros (contratar, gerenciar, cancelar)
```

### Notas
- O fluxo de checkout continua funcionando como antes (signup -> checkout Stripe)
- A pagina de email-confirmacao serve como fallback quando o checkout falha e como orientacao geral
- O card de onboarding no dashboard sera dismissivel (salvo em localStorage)
- A secao "Como funciona" na assinatura e sempre visivel para todos os usuarios
