# Ronaldo Gomes Jr. Site — V22 CMS

Versão estática com painel de conteúdo em `/admin`.

## O que esta versão adiciona

- Painel Decap CMS em `/admin`;
- Conteúdo editável para:
  - publicações;
  - projetos;
  - livros didáticos;
  - links;
- Dados em arquivos JSON dentro da pasta `/content`;
- Páginas que leem esses dados automaticamente, sem build.

## Importante

O painel `/admin` aparece no site, mas o login via GitHub precisa de configuração inicial de OAuth para funcionar na Vercel.

Depois de configurar o OAuth uma vez, o fluxo será:

1. acessar `/admin`;
2. fazer login com GitHub;
3. editar ou adicionar conteúdo;
4. publicar;
5. o Decap CMS salva no GitHub;
6. a Vercel atualiza o site automaticamente.

## Publicação

Suba todos os arquivos desta pasta no GitHub:

- `admin`
- `assets`
- `content`
- `en`
- `pt`
- `index.html`
- `README.md`
- `vercel.json`

Configuração da Vercel:

- Framework Preset: Other
- Install Command: `echo skip install`
- Build Command: `echo no build`
- Output Directory: `.`
