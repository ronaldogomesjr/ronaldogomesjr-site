# Ronaldo Gomes Jr. — site acadêmico bilíngue

Site acadêmico e portfólio bilíngue de Ronaldo Gomes Jr., professor e pesquisador na área de linguagem e tecnologia.

**Site:** https://www.ronaldogomesjr.com  
**Idiomas:** português e inglês  
**Hospedagem:** Vercel  
**Conteúdo:** arquivos JSON editados por um painel próprio conectado ao GitHub

## Visão geral

O site apresenta pesquisa, projetos, orientações, publicações, livros didáticos, perfil acadêmico e formas de contato. A versão em português está em `/pt/` e a versão em inglês em `/en/`.

Principais áreas:

- **Pesquisa / Research** — linhas de pesquisa e redes;
- **Projetos / Projects** — projetos bilíngues, com período, descrição, parceiros e links;
- **Orientações / Supervisions** — mestrado e doutorado;
- **Publicações / Publications** — artigos, capítulos e livros acadêmicos;
- **Livros didáticos / Textbooks** — coleções, links e thumbnails;
- **Sobre / About** — trajetória, interesses e foto;
- **Contato / Contact** — e-mail e perfis acadêmicos;
- páginas conceituais sobre **design**, **tecnologia digital** e **educação linguística**.

## Tecnologias

O projeto usa uma arquitetura estática e leve:

- HTML;
- CSS;
- JavaScript sem framework;
- JSON para armazenamento do conteúdo;
- Node.js apenas no processo de build;
- Vercel para build, hospedagem e domínio;
- GitHub como repositório e fonte de conteúdo.

## Estrutura do repositório

```text
.
├── admin/            # painel de edição de conteúdo
├── api/              # endpoints auxiliares/legados do painel
├── assets/           # CSS, JavaScript, uploads e imagens
├── content/          # conteúdo editável em JSON
├── en/               # páginas em inglês
├── pt/               # páginas em português
├── build.js          # gera a pasta public/ para a Vercel
├── index.html        # entrada do site
├── package.json      # comando de build
└── vercel.json       # configuração de deploy, redirects e headers
```

A pasta `public/` é gerada automaticamente durante o build e não deve ser versionada.

## Arquivos de conteúdo

| Arquivo | Conteúdo |
|---|---|
| `content/site.json` | identidade, menus e configurações gerais |
| `content/home.json` | página inicial |
| `content/pages.json` | títulos, introduções e seções das páginas internas |
| `content/projetos.json` | projetos bilíngues |
| `content/orientacoes.json` | orientações de mestrado e doutorado |
| `content/publicacoes.json` | artigos, capítulos e livros acadêmicos |
| `content/publication-pages.json` | textos introdutórios das páginas de publicações |
| `content/livros-didaticos.json` | livros didáticos, links e thumbnails |
| `content/research-groups.json` | redes exibidas em Pesquisa / Research |
| `content/links.json` | contato, perfis acadêmicos e rodapé |

## Painel de conteúdo

O painel está disponível em:

```text
https://www.ronaldogomesjr.com/admin/
```

Ele usa um Personal Access Token do GitHub com permissão de escrita no repositório. O token fica armazenado apenas no navegador em que foi inserido.

### Fluxo de edição

1. Abra `/admin/`.
2. Salve e teste o token do GitHub.
3. Escolha a página ou coleção.
4. Clique em **carregar**.
5. Edite o conteúdo em português e inglês.
6. Clique em **publicar alteração**.
7. Aguarde o novo deployment da Vercel.

Nunca publique o token no repositório, em mensagens, capturas de tela ou arquivos de configuração.

## Desenvolvimento local

Requisitos:

- Node.js 18 ou superior;
- npm.

```bash
npm install
npm run build
```

O comando gera a pasta `public/`. Para visualizar localmente, use um servidor estático, por exemplo:

```bash
npx serve public
```

## Deploy

A Vercel executa:

```bash
npm run build
```

O arquivo `build.js` recria `public/` a partir das pastas-fonte. A configuração de domínio, redirects, trailing slashes e cache de favicon fica em `vercel.json`.

O domínio principal é:

```text
www.ronaldogomesjr.com
```

O domínio sem `www` redireciona para o endereço principal, e a raiz do projeto direciona o visitante para `/pt/`.

## Manutenção

- Edite conteúdo pelo painel sempre que possível.
- Evite criar novos arquivos com números de versão no nome; prefira arquivos estáveis e cache busting na query string.
- Não versione `public/`, arquivos ZIP, logs, `.DS_Store`, `node_modules/` ou a pasta local `.vercel/`.
- Antes de apagar scripts antigos em `assets/`, confirme que nenhum HTML ainda os referencia.
- Preserve `assets/uploads/`, pois contém imagens enviadas pelo painel.

## Licença e uso

Conteúdo e identidade visual pertencem a Ronaldo Gomes Jr. O código do site não possui, neste momento, uma licença aberta declarada.

---

## English summary

This repository contains Ronaldo Gomes Jr.'s bilingual academic website. It is a static HTML/CSS/JavaScript project with JSON-based content, a GitHub-backed editing panel, and automated deployment on Vercel. Portuguese pages live under `/pt/`, English pages under `/en/`, and the production domain is `www.ronaldogomesjr.com`.
