# Configuração do /admin online

Esta versão inclui:

- `/admin` — painel Decap CMS;
- `/api/auth` — inicia login com GitHub;
- `/api/callback` — recebe retorno do GitHub e entrega o token ao painel.

## 1. Subir a V23 no GitHub

Suba todos os arquivos desta pasta para o repositório `ronaldogomesjr-site`.

A raiz do repositório deve conter:

- `admin`
- `api`
- `assets`
- `content`
- `en`
- `pt`
- `index.html`
- `README.md`
- `vercel.json`

## 2. Conferir deploy na Vercel

Na Vercel, mantenha:

- Framework Preset: Other
- Install Command: `echo skip install`
- Build Command: `echo no build`
- Output Directory: `.`

## 3. Criar GitHub OAuth App

No GitHub:

Settings → Developer settings → OAuth Apps → New OAuth App

Preencha:

Application name:
Ronaldo Gomes Jr. Site CMS

Homepage URL:
https://SEU-SITE.vercel.app

Authorization callback URL:
https://SEU-SITE.vercel.app/api/callback

Depois clique em Register application.

## 4. Criar Client Secret

Na página do OAuth App, clique em:

Generate a new client secret

Copie:

- Client ID
- Client Secret

## 5. Colocar variáveis na Vercel

Na Vercel:

Project → Settings → Environment Variables

Crie:

GITHUB_CLIENT_ID = cole o Client ID
GITHUB_CLIENT_SECRET = cole o Client Secret

Opcional:
GITHUB_SCOPE = repo

Depois faça Redeploy.

## 6. Testar

Acesse:

https://SEU-SITE.vercel.app/admin

Clique em Login with GitHub.

Se você mudar depois para `ronaldogomesjr.com`, será necessário voltar ao GitHub OAuth App e trocar:

Homepage URL:
https://ronaldogomesjr.com

Authorization callback URL:
https://ronaldogomesjr.com/api/callback
