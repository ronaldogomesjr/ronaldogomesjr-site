# V53 — correção do upload da foto no painel

Este patch não contém a pasta `content`.

## O que muda

No painel `/admin`:

1. selecione `página: sobre / about — texto e foto`;
2. clique em `carregar`;
3. localize o campo `Foto da página sobre / about — enviar ou substituir`;
4. selecione uma imagem;
5. confira a pré-visualização;
6. clique em `publicar alteração`.

O mesmo campo permite:

- enviar a primeira foto;
- substituir a foto atual;
- remover a foto.

## Arquivos a substituir

- `admin/index.html`
- `assets/admin.js`
- `assets/style.css`

## Importante

Não substitua nem apague a pasta `content`.
