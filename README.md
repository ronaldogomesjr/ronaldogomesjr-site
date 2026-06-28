# Ronaldo Gomes Jr. Site — V35 Admin Fix

Esta versão corrige o painel simples de atualização.

## Correção

Depois de publicar um item, o painel agora recarrega automaticamente a categoria atual a partir do GitHub. Isso evita erro de referência antiga do arquivo e permite inserir vários itens seguidos na mesma categoria.

## Fluxo recomendado

1. Acesse `/admin`.
2. Escolha a categoria, por exemplo `publicações`.
3. Clique em `carregar`.
4. Clique em `novo item`.
5. Preencha os campos.
6. Clique em `publicar alteração`.
7. Aguarde a mensagem: `Você já pode inserir outro item nesta categoria.`
8. Clique em `novo item` novamente para adicionar outro.

## Publicação

Suba todos os arquivos desta versão no GitHub e aguarde o deploy da Vercel.
