# Ronaldo Gomes Jr. Site — V23 CMS com OAuth

Versão estática com painel `/admin` e autenticação GitHub via funções Vercel.

## O que esta versão adiciona em relação à V22

- `/admin` com Decap CMS;
- `/api/auth` para iniciar login com GitHub;
- `/api/callback` para receber o retorno do GitHub;
- `admin/config.yml` atualizado com `base_url: /api`;
- `SETUP-ADMIN.md` com passo a passo.

## Fluxo depois de configurado

1. Acesse `/admin`;
2. Faça login com GitHub;
3. Edite publicações, projetos, livros didáticos ou links;
4. Clique em publicar;
5. O Decap salva no GitHub;
6. A Vercel publica automaticamente.

## Arquivos principais

- `admin/index.html`
- `admin/config.yml`
- `api/auth.js`
- `api/callback.js`
- `content/publicacoes.json`
- `content/projetos.json`
- `content/livros-didaticos.json`
- `content/links.json`

Leia `SETUP-ADMIN.md` antes de testar o login.
