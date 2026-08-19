# Nummus - Web Application

![Status](https://img.shields.io/badge/Status-Em_Produção-success?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)
![pnpm](https://img.shields.io/badge/pnpm-F69220?style=for-the-badge&logo=pnpm&logoColor=white)

> Projeto desenvolvido com foco em demonstrar **engenharia de frontend avançada**, UX/UI de alto padrão (Luxury Premium Design) e arquitetura baseada em **Domain-Driven Design (DDD)** para uma plataforma SaaS de gestão financeira e _Wealth Management_.

---

## 🚧 Demo Online

👉 **Acessar ambiente de desenvolvimento:**
🔗 [Link do Deploy](https://nummus-web.fremez.com/)

---

## 📋 Sobre o Projeto

O **Nummus** é a interface web de uma plataforma SaaS avançada de controle financeiro. Diferente de gerenciadores genéricos, esta aplicação foi construída focando no conceito de _Wealth Management_ (Gestão de Patrimônio), visando usuários que buscam sofisticação e clareza no acompanhamento de seus ativos e passivos.

A plataforma aplica um **Design System Luxury Rigoroso** construído do zero. Utiliza uma paleta _Strictly Dark_ (Zinc-950) com acentos em Dourado Cashmere (#BFA071) para representar valor e Roxo Violeta (#7C3AED) para ações de marca, traduzindo a exclusividade de um serviço de assessoria VIP para o ambiente digital.

---

## 🏛️ Arquitetura & Engenharia Contábil

A beleza da interface é sustentada por um rigoroso motor arquitetural, garantindo que o ciclo de vida do dinheiro siga as regras da contabilidade real:

- **Screaming Architecture & Zero-Classes:** O projeto (Full-Stack) adota uma arquitetura limpa focada em Use Cases e injeção de dependência funcional (sem classes tradicionais). No frontend, isso se traduz em contratos estritos validados via `Zod` e hooks imutáveis.
- **Double-Entry Bookkeeping (Partidas Dobradas):** Separação estrita entre Contas de Ativo (Carteiras/Wallets) e Contas de Passivo (Cartões de Crédito). O pagamento de faturas opera como uma transação atômica de `TRANSFER`, impedindo a duplicação artificial de despesas no dashboard.
- **Roteamento Inteligente de Entidades:** Implementação de cascata de decisão no formulário de transações. O usuário seleciona a origem via `PaymentMethod` (CASH, PIX, TRANSFER, DEBIT, CREDIT), e a UI roteia estritamente a validação para o repositório correto (Wallet ou CreditCard), anulando erros de inserção.

---

## ✨ Funcionalidades

- 💰 **Dashboard Net Worth:** Visão consolidada e em tempo real do patrimônio líquido total em destaque Dourado, com métricas protegidas contra duplicação de transferências.
- 🏦 **Hub de Carteiras (Tabs):** Visão unificada gerenciando simultaneamente Contas Correntes (Ativos) e Cartões de Crédito (Passivos) através de abas fluidas.
- 💳 **Ciclo de Vida de Crédito:** Gestão completa de faturas, permitindo lançar despesas no crédito, visualizar o extrato da fatura atual translúcido e liquidar a dívida com débito automático em carteira.
- 💸 **Modais Dinâmicos de Transação:** Fluxo rápido, imune a `NaN`, com tratamento defensivo e validações mútuas cruzadas (Zod SuperRefine) para adição de Receitas, Despesas e Transferências.
- 📱 **Mobile-App UX:** Interações pensadas para o toque, Bottom Tab Bar com Botão Flutuante (FAB) centralizado para acesso rápido e menus fluidos.

---

## 🧩 Destaques de UI/UX

- 🎨 **Regra de Transparência Absoluta (90%):** O design system impõe que **todas** as janelas em foco, modais (ex: detalhes de fatura) e _slide-overs_ mantenham exatamente **90% de opacidade** (`bg-zinc-950/90 backdrop-blur-md`). Isso garante que o contexto do dashboard continue visível e desfocado ao fundo.
- 🛡️ **Defensividade de Interface:** Tratamento elegante de estados nulos ou vazios (exibição de `-` em limites inexistentes em vez de quebras matemáticas), com proteção rigorosa de eventos (`stopPropagation`) em modais sobrepostos.
- 📏 **Arquitetura Baseada em Auto Layout (Flexbox):** Componentes estruturados no Figma usando Auto Layout convertidos 1-para-1 para classes utilitárias do Tailwind (`flex`, flex-row, gap`), garantindo responsividade pixel-perfect.
- 🎢 **Animações Performáticas (Motion):** Uso inteligente de animações baseadas em mola (springs) para sensibilidade física tátil e implementação de gestos em modais na versão mobile.

---

## 🛠️ Tecnologias Utilizadas

- **Core:** Next.js (App Router), React, TypeScript.
- **Estilização:** Tailwind CSS, shadcn/ui (customizado estritamente para o Luxury Design System).
- **Validação & Estado:** Zod, React Hook Form, Custom Hooks.
- **Animações:** Motion.dev (Framer Motion).
- **Infraestrutura:** pnpm, Eslint + Prettier.

---

## 📁 Estrutura do Projeto

```bash
src/
 ├── app/              # Estrutura de rotas e páginas do Next.js App Router
 │   ├── (routes)/     # Agrupamento de rotas (Login, Dashboard, Wallets)
 │   └── components/   # Componentes de Layout Globais (Sidebar, Header, BottomBar)
 ├── components/       # Componentes de Negócio e UI
 │   ├── ui/           # Componentes base do shadcn/ui customizados
 │   └── transactions/ # Lógica complexa de formulários em cascata
 ├── hooks/            # Hooks customizados e mutações atômicas
 ├── lib/              # Configurações de bibliotecas e validações Zod
 ├── types/            # Contratos estritos de API e Domínio
 └── styles/           # globals.css com configuração do Luxury Theme

```

## 🚀 Como Executar o Projeto

```bash
# Clone o repositório
git clone [https://github.com/GLemes25/Nummus-Web](https://github.com/GLemes25/Nummus-Web)

# Acesse a pasta
cd nummus-web

# Instale as dependências
pnpm install

# Rodar projeto localmente
pnpm dev

```

### 👤 Autor

## Gabriel Lemes de Oliveira

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/gabriel-lemes-G25)
[![Gmail](https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:gabriellemes924@gmail.com)
[![Whatsapp](https://img.shields.io/badge/Whatsapp-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)](https://wa.me/5567991179190)
