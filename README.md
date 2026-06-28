# Ronaldo Gomes Jr. Site — V27 Sveltia Admin

Esta versão mantém o site e troca o painel `/admin` de Decap CMS para Sveltia CMS.

## Por quê?

O Decap CMS estava abrindo o GitHub OAuth, mas não retornava corretamente para o painel. A Sveltia CMS é uma alternativa moderna e compatível com configurações do Netlify/Decap CMS, mas com interface mais atual e suporte melhor a mobile.

## O que foi mantido

- Site estático na Vercel;
- conteúdo em `/content`;
- páginas lendo JSON;
- títulos em minúsculas;
- OAuth em `/api/auth` e `/api/callback`;
- variáveis da Vercel:
  - `GITHUB_CLIENT_ID`
  - `GITHUB_CLIENT_SECRET`

## O que fazer depois de subir

1. Suba a V27 no GitHub.
2. Aguarde o deploy da Vercel.
3. Acesse `/admin`.
4. Tente entrar com GitHub.

Não é necessário recriar o OAuth App.
Não é necessário alterar variáveis na Vercel.
