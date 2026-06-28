# Setup V28 — Admin online funcionando na Vercel

## 1. Subir a V28 no GitHub

A raiz do repositório deve conter:

- `admin`
- `api`
- `assets`
- `content`
- `en`
- `pt`
- `build.js`
- `package.json`
- `index.html`
- `README.md`
- `SETUP-ADMIN.md`
- `vercel.json`

## 2. Ajustar Build and Deployment na Vercel

Entre no projeto da Vercel:

Settings → Build and Deployment

Configure:

Framework Preset:
Other

Install Command:
npm install --no-audit --no-fund

Build Command:
npm run build

Output Directory:
public

Salve.

## 3. Variáveis de ambiente

Mantenha as variáveis já criadas:

- `GITHUB_CLIENT_ID`
- `GITHUB_CLIENT_SECRET`

Não precisa recriar o OAuth App.

## 4. Redeploy

Vá em:

Deployments → três pontinhos no último deploy → Redeploy

## 5. Teste das funções

Abra:

https://SEU-SITE.vercel.app/api/ping

Deve aparecer algo como:

{
  "ok": true,
  "message": "API functions are working.",
  "hasClientId": true,
  "hasClientSecret": true
}

Se `hasClientId` ou `hasClientSecret` aparecerem como `false`, revise as variáveis na Vercel.

## 6. Teste do admin

Abra:

https://SEU-SITE.vercel.app/admin

Clique em Login with GitHub.
