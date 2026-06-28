# Ronaldo Gomes Jr. Site — V24 CMS OAuth Fix

Esta versão corrige o callback do login GitHub no `/admin`.

## Correção principal

Na V23, a janela ficava parada em:

`Autorizando GitHub...`

Na V24, o arquivo `api/callback.js` envia a autorização imediatamente para o painel Decap CMS e fecha a janela.

## Depois de subir esta versão

1. Suba todos os arquivos no GitHub.
2. Aguarde o deploy da Vercel.
3. Na Vercel, faça Redeploy se necessário.
4. Acesse `/admin`.
5. Clique em Login with GitHub.

As variáveis da Vercel continuam as mesmas:

- `GITHUB_CLIENT_ID`
- `GITHUB_CLIENT_SECRET`
