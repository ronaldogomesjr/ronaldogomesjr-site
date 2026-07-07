# V51 — patch para recuperar a foto da página Sobre

Este pacote é um PATCH e não contém a pasta `content`.

## O que ele recupera

- moldura circular para a foto na página `/pt/sobre/`;
- moldura circular para a foto na página `/en/about/`;
- foto alinhada à direita do texto em telas maiores;
- disposição responsiva no celular;
- campo de upload na entrada `página: sobre / about` do painel;
- envio da foto para `assets/uploads/sobre/`;
- pré-visualização e opção de remover a foto.

## Arquivos a substituir

- `assets/admin.js`
- `assets/cms-render.js`
- `assets/page-content.js`
- `assets/style.css`
- `pt/sobre/index.html`
- `en/about/index.html`

## Importante

Não substitua nem apague a pasta `content`.

Depois de instalar o patch:

1. abra `/admin`;
2. escolha `página: sobre / about`;
3. clique em `carregar`;
4. selecione a foto;
5. clique em `publicar alteração`.
