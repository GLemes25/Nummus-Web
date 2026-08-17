# Regras e Automação de Commits do Git

Você é responsável por analisar as alterações em _stage_ (ou adicioná-las) e criar automaticamente os commits do Git para este repositório. Você deve seguir estritamente o padrão "Conventional Commits" `conventionalcommits.org` e as regras de formatação específicas descritas abaixo.

## 1. Tipos de Commit Permitidos

Use APENAS os seguintes prefixos, baseando-se na natureza das alterações:

- **feat**: Uma nova funcionalidade ou melhoria significativa em uma funcionalidade existente (ex: adicionar horário de funcionamento dinâmico).
- **fix**: Uma correção de bug.
- **style**: Mudanças que não afetam a lógica do código (formatação, ajustes de CSS, remoção de gradientes/fundos, ajustes de UI).
- **refactor**: Uma alteração de código que não corrige um bug nem adiciona uma funcionalidade (ex: simplificar a lógica de um componente, atualizar regras).
- **chore**: Atualização de dependências, tarefas de build ou configurações de ferramentas.
- **docs**: Mudanças apenas na documentação.
- **merge**: Utilizado exclusivamente para mesclagem de branches. **NUNCA** use mensagens genéricas — veja a regra de Padrão de Merge abaixo.

## 2. Regras de Formatação

- **Idioma**: TODAS as mensagens de commit DEVEM ser escritas em Inglês.
- **Modo Imperativo**: Comece a descrição com um verbo no imperativo, no tempo presente (ex: use `add`, `update`, `remove`, `simplify`, `enhance`. NUNCA use `added`, `adds` ou `updating`).
- **Letra Minúscula**: A descrição deve começar com letra minúscula logo após o prefixo e o espaço (ex: `feat: implement...`).
- **Sem Pontuação**: Não coloque ponto final (`.`) no final da mensagem de commit.
- **Concisão**: Mantenha a mensagem clara e diretamente relacionada aos componentes alterados.
- **Padrão de Merge**: **NUNCA** use mensagens genéricas como `merge: merge branch 'dev' into main`. Você **DEVE** resumir as principais funcionalidades ou correções que estão sendo mescladas. O formato obrigatório é:
  `merge: <resumo claro do que foi feito> (<branch-origem> -> <branch-destino>)`

## 3. Exemplos de Referência

Use estes commits passados do repositório como seu padrão de tom e estrutura:

- `feat: enhance CategoryPage to support dynamic links`
- `style: update WhatsAppButton to remove primary color background`
- `refactor: simplify Indications component logic`
- `feat: add business hours and open status logic`
- `refactor: update rules to claude code`
- `style: remove gradient color to match minimalist design`
- `merge: implement visual dashboard charts and category CRUD (dev -> main)`
- `merge: fix CORS issues and add soft delete logic (feat/crud -> dev)`

## 4. Regras de Branch (CRÍTICO)

- **NUNCA faça commit diretamente na branch `main`.** Todo trabalho deve ser feito na `dev` (ou em uma feature branch), e integrado à `main` apenas via merge explícito.
- **SEMPRE retorne à branch `dev`** após realizar um merge na `main`. Após o merge e o push, execute `git checkout dev` imediatamente.
- Se perceber que está na `main` prestes a commitar código que não seja um merge, mude para `dev` antes de prosseguir.

## 5. Fluxo de Execução

1. Analise brevemente os arquivos modificados (adicione-os ao _stage_ com `git add` se o usuário solicitar).
2. Confirme que está na branch correta (`dev` ou feature branch) antes de commitar. **Nunca commite na `main`.**
3. Gere a mensagem de commit apropriada silenciosamente em inglês.
4. Se a ação for uma mesclagem, analise os commits da branch de origem para extrair um resumo descritivo e aplique o formato obrigatório de merge.
5. Execute automaticamente o comando do git: `git commit -m "<mensagem_gerada>"`
6. Após um merge na `main`, execute `git checkout dev` imediatamente e confirme o retorno.
7. Exiba uma breve confirmação de sucesso mostrando a mensagem que foi commitada e a branch atual.
