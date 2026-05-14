# Nummus - Web Application

> Projeto desenvolvido com foco em demonstrar **engenharia de frontend avançada**, UX/UI de alto padrão (Luxury Premium Design) e desenvolvimento focado em performance para uma plataforma SaaS de gestão financeira e _Wealth Management_.

---

## 🚧 Demo Online

👉 **Acessar ambiente de desenvolvimento:**
🔗 [Link do Deploy (Disponível em breve)](https://www.google.com/search?q=)

---

## 📋 Sobre o Projeto

O **Nummus** é a interface web de uma plataforma SaaS avançada de controle financeiro. Diferente de gerenciadores genéricos, esta aplicação foi construída focando no conceito de _Wealth Management_ (Gestão de Patrimônio), visando usuários que buscam sofisticação e clareza no acompanhamento de seus ativos e passivos.

A plataforma aplica um **Design System Luxury Rigoroso** construído do zero. Utiliza uma paleta _Strictly Dark_ (Zinc-950) com acentos em Dourado Cashmere (#BFA071) para representar valor e Roxo Violeta (#7C3AED) para ações de marca, traduzindo a exclusividade de um serviço de assessoria VIP para o ambiente digital.

---

## ✨ Funcionalidades

- 💰 **Dashboard Net Worth:** Visão consolidada e em tempo real do patrimônio líquido total em destaque Dourado.
- 🧠 **Categorização com IA:** Botão integrado com ícone de brilho dourado que aciona IA para categorizar descrições de transações automaticamente.
- 🏦 **Gestão de Múltiplas Carteiras:** Interface em grid para visualização e gerenciamento de contas bancárias, cartões e dinheiro físico.
- 💸 **Modais Dinâmicos de Transação:** Fluxo rápido e fluido para adição de Receitas (Emerald), Despesas (Rose) e Transferências (Blue).
- 📱 **Mobile-App UX:** Interações pensadas para o toque, Bottom Tab Bar com Botão Flutuante (FAB) centralizado para acesso rápido e menus fluidos.

---

## 🛠️ Tecnologias Utilizadas

### Frontend & Core

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS

### UI, UX & Animações

- Motion.dev (Framer Motion) (Animações de entrada, gestos em modais, transações numéricas tipo odômetro e animações de layout).
- Lucide React (Iconografia minimalista _Premium_).
- shadcn/ui (Componentes base adaptados e customizados estritamente para o Luxury Design System proprietário).

### Infraestrutura & Ferramentas

- pnpm
- Eslint + Prettier (Padronização de código).

---

## 🧩 Destaques Técnicos

- 🎨 **Luxury Design System & Glassmorphism Focado:** Criação de regras estritas usando Tailwind CSS para garantir consistência visual. Implementação avançada da regra de opacidade: **todas** as janelas em foco, modais e _slide-overs_ mantêm exatamente **90% de opacidade** (`bg-zinc-950/90 backdrop-blur-md`), garantindo que o contexto do dashboard continue visível e desfocado ao fundo, elevando a percepção de sofisticação.
- 📏 **Arquitetura Baseada em Auto Layout (Flexbox):** Componentes estruturados no Figma usando Auto Layout convertidos quase 1-para-1 para classes utilitárias do Tailwind (`flex`, `flex-row`, `gap`), facilitando a manutenção e garantindo responsividade pixel-perfect.
- 🎢 **Animações Performáticas e Gestos (Motion):** Uso inteligente de animações baseadas em mola (springs) para sensibilidade física tátil e implementação de gestos (drag-to-dismiss) em modais na versão mobile, replicando o comportamento de apps nativos de alta qualidade sem comprometer a thread principal do navegador.

---

## 📁 Estrutura do Projeto

```bash
src/
 ├── app/              # Estrutura de rotas e páginas do Next.js App Router
 │   ├── (routes)/     # Agrupamento de rotas (Login, Dashboard, Wallets)
 │   └── components/   # Componentes de Layout Globais (Sidebar, Header, BottomBar)
 ├── components/       # Componentes de Negócio e UI
 │   ├── ui/           # Componentes base do shadcn/ui customizados
 │   └── business/     # Componentes complexos (ModalTransacao, CardsCarteira)
 ├── hooks/            # Hooks customizados (useAuth, useTransactions)
 ├── lib/              # Configurações de bibliotecas (utils do shadcn, Better Auth Client)
 └── styles/           # globals.css com configuração do Luxury Theme

```

## 🤝 Regras de Contribuição

Para manter a consistência e a qualidade do projeto, siga as regras estabelecidas:

1. **Idioma de Documentação:** Todos os arquivos de regras de contribuição, `README.md` e documentação técnica de desenvolvimento devem ser escritos em **Português**.
2. **Idioma de Commits:** Todas as mensagens de commit (mensagens reais executadas no repositório, ex: `feat:`, `fix:`) devem ser escritas estritamente em **Inglês**.

---

## 🚀 Como Executar o Projeto

```bash
# Clone o repositório
git clone https://github.com/GLemes25/Nummus-Web

# Acesse a pasta
cd nummus-web

# Instale as dependências
pnpm install

# Rodar projeto localmente
pnpm dev

```

> Acesse http://localhost:3000 para visualizar a aplicação.

---

### 👤 Autor

## Gabriel Lemes de Oliveira
