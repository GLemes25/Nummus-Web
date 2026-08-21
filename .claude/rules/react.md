# Regras de React, Next.js e UI

## Componentização

- **Sintaxe:** **SEMPRE** utilize _arrow functions_ para a criação de componentes React.
- **Isolamento:** **NUNCA** crie mais de um componente no mesmo arquivo. Cada componente deve ter seu próprio arquivo exclusivo.

## Sistema de UI (shadcn/ui)

- **Prioridade Máxima:** Use os componentes da biblioteca shadcn/ui o máximo possível para construir a interface. Consulte https://ui.shadcn.com/.
- **Verificação Prévia:** Antes de criar um novo componente do zero, **SEMPRE** use o _Context7_ (sua ferramenta de contexto) para verificar se já existe um componente correspondente no shadcn/ui. Se existir, instale-o e use-o.
- **Botões:** **SEMPRE** use o componente `Button` do shadcn/ui (`@/components/ui/button`). **NUNCA** utilize a tag `<button>` nativa do HTML diretamente.
- **Páginas e Layouts:** **SEMPRE** verifique os componentes base disponíveis em `@components/ui/page.tsx` para garantir a reutilização da estrutura de página.

## Estilização (Tailwind CSS)

- **Cores do Tema:** **NUNCA** use cores hard-coded do Tailwind (como `text-white`, `bg-black`, `border-[#f1f1f1]`, `bg-[#2b54ff]`, etc.).
- **SEMPRE** utilize as variáveis de cor do tema definidas no seu `@app/globals.css` (exemplos: `text-background`, `bg-foreground`, `bg-primary`, `text-primary-foreground`, `border-border`).
- **Novas Variáveis:** Caso a cor necessária não exista, crie uma nova variável CSS em `@app/globals.css` seguindo o padrão já existente. Porém, antes de criar, **SEMPRE** leia a documentação do shadcn/ui sobre _theming_ para confirmar se é realmente necessário.

## Rule: Select Component Display

Quando implementar componentes `Select` (shadcn/ui + react-hook-form), sempre garanta que a interface exiba o **Label** (texto legível) e **nunca** o **Value** (UUID/ID).

- Use `<SelectValue placeholder="..."/>` deixando o Radix/Base UI inferir o texto a partir do `<SelectItem>` correspondente.
- **Atenção (Base UI):** este projeto usa `@base-ui/react/select`, não Radix. No Base UI, `Select.Value` só resolve o label automaticamente se os `SelectItem` já estiverem montados no DOM — como `SelectContent` é renderizado dentro de um `Portal`, isso nem sempre acontece no carregamento inicial (ex: preencher um formulário de edição com um valor já selecionado), causando a exibição do ID bruto.
- Se houver bugs de renderização de ID na tela, **sempre** faça o fallback usando a render-prop de `SelectValue` (`children` como função), buscando o nome na lista de opções correspondente ao valor selecionado:

```tsx
<SelectValue placeholder="Selecione">
  {(value: string) =>
    options.find((option) => option.id === value)?.name ?? "Selecione"
  }
</SelectValue>
```

## Formulários e Validação

- **Stack Obrigatória:** **SEMPRE** construa formulários utilizando `React Hook Form` em conjunto com `Zod` para validação de esquemas.
- **Componente Base:** **SEMPRE** utilize o componente wrapper `@components/ui/form.tsx` do shadcn para montar e estruturar os campos dos formulários.

## Efeitos e Estado (`react-hooks/set-state-in-effect`)

O ESLint (via `eslint-plugin-react-hooks`, regras do React Compiler) proíbe chamar `setState` de forma **síncrona** dentro de um `useEffect` — inclusive indiretamente, quando o efeito chama uma função (ex: `fetchData()`) que por sua vez chama `setState` de forma síncrona (antes de qualquer `await`/`.then()`).

- **Estado derivável — NUNCA use `useState` + `useEffect`:** Se um valor pode ser calculado a partir de outros props/states já existentes (ex: combinar `isLoading` de uma sessão com um timer de splash screen), **NUNCA** sincronize-o via `useEffect(() => setX(...), [deps])`. **SEMPRE** compute o valor diretamente durante a renderização (`const x = condição ? a : b`). Veja https://react.dev/learn/you-might-not-need-an-effect.
- **Busca de dados (fetch) em efeitos:** Ao criar hooks de fetch (`useTransactions`, `useWallets`, etc.) chamados via `useEffect(() => { fetchX() }, [fetchX])`, **NUNCA** chame `setState` (ex: `setIsLoading(true)`) como a primeira instrução síncrona da função `fetchX`, mesmo dentro de um `async function`. **SEMPRE** encadeie a lógica com `.then()/.catch()/.finally()`, colocando as chamadas de `setState` dentro dos callbacks encadeados (nunca no nível síncrono/top-level da função invocada pelo efeito):

```ts
const fetchX = useCallback(() => {
  return Promise.resolve()
    .then(() => {
      setIsLoading(true)
      return apiClient.get("/x")
    })
    .then((res) => {
      // setState aqui dentro é seguro
    })
    .finally(() => {
      setIsLoading(false)
    })
}, [])
```

- **Motivo:** `setState` síncrono dentro de um efeito causa renders em cascata na mesma fase de commit. O linter rastreia chamadas diretas (`CallExpression`) a funções registradas como "setters" — passar essas funções como argumento de `.then()/.catch()` (uma `MethodCall`) não propaga o aviso, pois cria um escopo de função separado.
