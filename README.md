# Ronaldo Gomes Jr. Site — V40 Admin SHA Fix

Esta versão corrige o erro do GitHub:

`content/links.json does not match <sha>`

## O que foi corrigido

Antes de publicar qualquer alteração, o painel agora busca o SHA mais recente do arquivo no GitHub.

Isso evita erro quando:
- você publica uma alteração;
- o GitHub atualiza o arquivo;
- o painel tenta publicar de novo usando uma versão antiga.

## O que fazer

Suba a V40 no GitHub e aguarde o deploy da Vercel.

Depois, no `/admin`:
1. escolha a categoria;
2. clique em `carregar`;
3. edite;
4. clique em `publicar alteração`.

Se o arquivo mudar no meio da edição, o painel recarrega a categoria e pede para tentar novamente.
