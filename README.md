# Ronaldo Gomes Jr. — site acadêmico bilíngue

Site acadêmico e portfólio bilíngue de Ronaldo Gomes Jr., professor e pesquisador na área de linguagem e tecnologia.

- **Produção:** `https://www.ronaldogomesjr.com`
- **Português:** `/pt/`
- **English:** `/en/`
- **Hospedagem e build:** Vercel
- **Conteúdo:** JSON editado pelo painel em `/admin/`

## Arquitetura atual

O projeto é um site estático em HTML, CSS e JavaScript, sem framework no navegador. O conteúdo é mantido em arquivos JSON e o GitHub funciona como repositório e fonte de publicação.

Durante o deploy, `npm run build` executa `build.js`, que:

1. recria a pasta `public/`;
2. copia os arquivos necessários do projeto;
3. lê `content/pages.json` e `content/publication-pages.json`;
4. grava o conteúdo atual nos HTMLs publicados;
5. marca as páginas sincronizadas para impedir uma segunda substituição visual no navegador.

Esse processo evita o flash de conteúdo antigo: a página já chega ao visitante com o texto atual.

## Estrutura

```text
.
├── admin/              # interface do painel de conteúdo
├── api/                # autenticação e callback do painel
├── assets/             # estilos, scripts ativos e uploads usados
├── content/            # conteúdo editável em JSON
├── en/                 # páginas-fonte em inglês
├── pt/                 # páginas-fonte em português
├── build.js            # geração e sincronização de public/
├── index.html          # entrada do domínio
├── package.json        # comando de build
└── vercel.json         # deploy, redirects e cache
```

A pasta `public/` é gerada automaticamente e não deve ser versionada.

## Conteúdo editável

| Arquivo | Finalidade |
|---|---|
| `content/site.json` | nome, identidade e menus |
| `content/home.json` | página inicial |
| `content/pages.json` | títulos, introduções, seções e foto da página Sobre |
| `content/publication-pages.json` | introduções das páginas de publicações |
| `content/projetos.json` | projetos |
| `content/orientacoes.json` | orientações de mestrado e doutorado |
| `content/publicacoes.json` | artigos, capítulos e livros acadêmicos |
| `content/livros-didaticos.json` | coleções didáticas |
| `content/research-groups.json` | grupos e redes de pesquisa |
| `content/links.json` | contato, perfis e rodapé |
| `content/design.json` | arte e conteúdo específico de Design |
| `content/tecnologia-digital.json` | arte e conteúdo específico de Tecnologia Digital |
| `content/educacao-linguistica.json` | arte e conteúdo específico de Educação Linguística |

## Scripts ativos principais

- `assets/page-content.js` — carregador unificado das páginas internas;
- `assets/site-content.js` — identidade e menu;
- `assets/home-content.js` — página inicial;
- `assets/footer-links.js` — rodapé e links;
- `assets/admin-v86.js` — painel principal;
- `assets/admin-concept-pages-v5.js` — páginas conceituais no painel;
- `assets/projects-render-v78.js` — projetos;
- `assets/textbooks-render-v83.js` — livros didáticos;
- `assets/academic-books-render-v79.js` — livros acadêmicos;
- `assets/research-groups-v72.js` — redes e grupos de pesquisa;
- `assets/supervisions-render.js` — orientações;
- `assets/design-system.js`, `technology-system.js` e `language-education.js` — artes dinâmicas.

Arquivos antigos sem referência foram removidos na limpeza v94. Não crie novas cópias numeradas quando uma query string de versão, como `?v=94`, for suficiente.

## Painel de conteúdo

Acesse:

```text
https://www.ronaldogomesjr.com/admin/
```

Fluxo recomendado:

1. informe um token do GitHub com acesso de escrita;
2. escolha a página ou coleção;
3. carregue o conteúdo;
4. edite português e inglês;
5. publique a alteração;
6. aguarde o deployment da Vercel.

O token funciona como senha. Não o inclua no repositório, em capturas de tela ou em mensagens.

## Desenvolvimento local

Requisitos: Node.js 18 ou superior e npm.

```bash
npm install
npm run build
npx serve public
```

## Manutenção segura

- Edite textos e coleções pelo painel sempre que possível.
- Preserve os atributos `data-*` usados pelos scripts.
- Não versione `public/`, `node_modules/`, `.vercel/`, arquivos ZIP ou segredos.
- Antes de apagar um asset, pesquise referências em HTML, CSS, JavaScript e JSON.
- Preserve uploads que estejam referenciados nos arquivos de conteúdo.
- Faça alterações estruturais em pequenos commits e teste desktop e mobile após o deploy.

## Licença

O conteúdo e a identidade visual pertencem a Ronaldo Gomes Jr. O código não possui licença aberta declarada.

---

### English summary

This repository contains Ronaldo Gomes Jr.'s bilingual academic website. It is a static HTML/CSS/JavaScript project with JSON-managed content, a GitHub-backed editing panel, and an automated Vercel build that writes current content into the published HTML to prevent stale-content flashes.
