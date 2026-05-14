# Guia de Contribuição — Nummus Web

Obrigado por contribuir com o Nummus! Este documento descreve o fluxo de trabalho esperado para todos os colaboradores.

---

## Pré-requisitos

- Node.js >= 20
- pnpm >= 10 (`npm install -g pnpm`)
- Git configurado com seu nome e e-mail

---

## Configurando o Ambiente Local

```bash
# Clone o repositório
git clone <url-do-repositorio>
cd nummus-web

# Instale as dependências
pnpm install

# Copie as variáveis de ambiente de exemplo
cp .env.example .env.local

# Inicie o servidor de desenvolvimento
pnpm dev
```

Acesse `http://localhost:3000` no navegador.

---

## Fluxo de Trabalho com Git

### 1. Crie uma branch a partir de `main`

Nomeie a branch de forma descritiva seguindo o padrão:

```
<tipo>/<descricao-curta>
```

Exemplos:
- `feat/pagina-dashboard`
- `fix/modal-transparencia`
- `chore/atualizar-dependencias`

### 2. Faça seus commits

Siga o padrão **Conventional Commits** em **inglês**:

```
feat: add transaction summary card
fix: restore modal opacity to 90%
chore: upgrade radix-ui to latest
docs: update contributing guide
```

O corpo do commit deve ser usado quando o título não é suficiente para explicar o "porquê" da mudança.

### 3. Abra um Pull Request

- Descreva **o que** foi feito e **por quê**.
- Adicione capturas de tela para mudanças visuais.
- Certifique-se de que `pnpm lint` passa sem erros.
- Solicite revisão de pelo menos um colaborador.

---

## Padrões de Qualidade

Antes de submeter um PR, verifique:

- [ ] Nenhum `console.log` esquecido no código
- [ ] Nenhuma cor hardcoded (`#fff`, `rgb(...)`) fora dos tokens do tema
- [ ] Componentes flutuantes usam `.ui-surface-dark` ou `.ui-surface-light` (ver `REGRAS_DE_DESENVOLVIMENTO.md`)
- [ ] TypeScript sem erros (`pnpm tsc --noEmit`)
- [ ] ESLint sem erros (`pnpm lint`)
- [ ] Componentes novos têm tipagem explícita de props

---

## Adicionando Componentes shadcn/ui

Use sempre o CLI do shadcn para adicionar novos componentes:

```bash
npx shadcn@latest add <nome-do-componente>
```

Após adicionar, aplique as classes de transparência nos componentes que renderizam superfícies flutuantes.

---

## Dúvidas e Suporte

Abra uma _issue_ com a label `dúvida` descrevendo seu problema ou questionamento.
