# V54 — links, contato e rodapé bilíngues

Este pacote é um PATCH e não contém a pasta `content`.

## Nova estrutura no painel

Na categoria:

- `links, contato e rodapé — bilíngue`

cada link possui:

- Texto do hiperlink em português
- Texto do hiperlink em inglês
- Descrição em português
- Descrição em inglês
- Uma única URL compartilhada
- Visibilidade no contato e no rodapé
- Ordem

## Migração dos links já existentes

Ao carregar a categoria, o painel combina automaticamente as antigas entradas PT e EN que tenham a mesma URL.

A migração só é gravada quando você clicar em `publicar alteração`.

## Página Contato / Contact

A página de contato usa exatamente os mesmos links do rodapé.

- O título de cada contato é um hiperlink.
- O botão `Abrir →` / `Open →` também usa a mesma URL.
- Os textos e descrições mudam conforme o idioma.

## Arquivos a substituir

- `admin/index.html`
- `assets/admin.js`
- `assets/cms-render.js`
- `assets/footer-links.js`
- `assets/style.css`
- `pt/contato/index.html`
- `en/contact/index.html`

## Importante

Não substitua nem apague a pasta `content`.
