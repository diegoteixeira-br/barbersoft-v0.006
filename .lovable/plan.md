

# Proteger Edicao com Senha de Exclusao

## O que muda
Atualmente, a senha de protecao so e exigida ao excluir agendamentos confirmados/finalizados. Com essa alteracao, ao clicar em **"Editar"** um agendamento confirmado ou finalizado, o sistema tambem exigira a senha antes de permitir a edicao.

## Como vai funcionar
1. Ao clicar em "Editar" em um agendamento confirmado ou finalizado, se a senha de protecao estiver habilitada, um modal pedira a senha antes de abrir o formulario de edicao
2. Para agendamentos pendentes (nao confirmados/finalizados), a edicao continua livre, sem pedir senha
3. O fluxo e identico ao da exclusao: campo numerico, validacao, mensagem de erro se incorreta

## Detalhes Tecnicos

### Arquivo alterado: `src/components/agenda/AppointmentDetailsModal.tsx`

**1. Novo estado para controlar modal de senha para edicao:**
- Adicionar `isEditPasswordOpen` (boolean) para abrir/fechar o modal de verificacao
- Adicionar `editPasswordInput` (string) para o campo de senha
- Adicionar `editPasswordError` (boolean) para feedback visual

**2. Alterar o botao "Editar" (linha 318):**
- Se o agendamento for `confirmed` ou `completed` E `deletionPasswordRequired` for true, ao clicar em "Editar", abrir o modal de verificacao de senha em vez de chamar `onEdit()` diretamente
- Se nao precisar de senha, chamar `onEdit()` normalmente

**3. Novo Dialog para verificacao de senha na edicao:**
- Estrutura similar ao modal de exclusao (linhas 340-443), porem simplificado:
  - Apenas o campo de senha (sem campo de motivo)
  - Titulo: "Verificacao de Seguranca"
  - Descricao: "Digite a senha para editar este agendamento"
  - Botao: "Confirmar Edicao"
- Ao confirmar com senha correta, chamar `onEdit()` e fechar o modal
- Se senha incorreta, mostrar erro igual ao da exclusao

