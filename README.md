# Ronaldo Gomes Jr. Site — V25 CMS OAuth + Keywords Fix

Esta versão corrige dois pontos:

1. Palavras-chave da Home agora começam com maiúscula:
   - Design.
   - Tecnologia digital.
   - Educação linguística.
   - Digital technology.
   - Language education.

2. O callback do GitHub OAuth foi ajustado para usar o handshake padrão do Decap CMS e também um fallback para navegadores que não respondem ao handshake.

## Depois de subir esta versão

1. Suba todos os arquivos no GitHub.
2. Aguarde o deploy da Vercel.
3. Faça Redeploy se necessário.
4. Acesse `/admin`.
5. Clique em Login with GitHub.

Não precisa recriar o OAuth App.
Não precisa trocar `GITHUB_CLIENT_ID` nem `GITHUB_CLIENT_SECRET`.
