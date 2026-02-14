
# Adicionar planos anuais no formulario de cadastro

## Problema
O seletor de planos na pagina de cadastro (`/auth?tab=signup`) mostra apenas 3 opcoes com precos mensais. Faltam as opcoes de cobranca anual, totalizando 6 opcoes (3 mensais + 3 anuais).

## Solucao

Modificar o arquivo `src/pages/Auth.tsx`:

1. **Expandir o array PLANS** para incluir 6 opcoes (mensal e anual para cada plano):

```
const PLANS = [
  { value: "inicial", billing: "monthly", label: "Inicial", price: "R$ 99/mês" },
  { value: "inicial", billing: "annual", label: "Inicial Anual", price: "R$ 79/mês", note: "cobrado anualmente" },
  { value: "profissional", billing: "monthly", label: "Profissional", price: "R$ 199/mês" },
  { value: "profissional", billing: "annual", label: "Profissional Anual", price: "R$ 159/mês", note: "cobrado anualmente" },
  { value: "franquias", billing: "monthly", label: "Franquias", price: "R$ 499/mês" },
  { value: "franquias", billing: "annual", label: "Franquias Anual", price: "R$ 399/mês", note: "cobrado anualmente" },
];
```

2. **Ajustar o estado do Select** para usar um valor composto (ex: `"profissional-annual"`) que encode tanto o plano quanto o billing, e ao selecionar, atualizar `selectedPlan` e `selectedBilling` simultaneamente.

3. **Atualizar o SelectItem** para mostrar o nome do plano, preco, e a nota "cobrado anualmente" quando aplicavel.

4. **Ajustar a inicializacao** para considerar os parametros `plan` e `billing` da URL e selecionar o item correto no dropdown.

## Detalhes tecnicos

- O `Select` usara valores compostos como `"inicial-monthly"`, `"profissional-annual"`, etc.
- O `onValueChange` fara split do valor para extrair `selectedPlan` e `selectedBilling`.
- A chamada ao `create-checkout-session` ja recebe `plan` e `billing` separados, entao nao precisa mudar.
- O valor default sera construido a partir dos parametros da URL: `${planFromUrl || "profissional"}-${billingFromUrl || "monthly"}`.
