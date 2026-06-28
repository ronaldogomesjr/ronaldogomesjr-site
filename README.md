# Ronaldo Gomes Jr. Site — V34 Simple Admin

Esta versão substitui o painel com OAuth por um painel próprio, mais simples.

## Como funciona

O painel `/admin` usa a API do GitHub diretamente no navegador.  
Você entra com um token GitHub fino/restrito ao repositório, edita os campos e publica.

## Vantagens

- não precisa Decap;
- não precisa Sveltia;
- não precisa OAuth App;
- não precisa variáveis na Vercel;
- funciona de qualquer computador com navegador;
- interface única para atualizar:
  - publicações;
  - projetos;
  - livros didáticos;
  - links.

## Importante

O token GitHub é como uma senha de edição.  
Crie um token fino/restrito apenas para o repositório `ronaldogomesjr-site`, com permissão de leitura e escrita em Contents.

## Publicação

Suba todos os arquivos desta versão no GitHub e aguarde o deploy da Vercel.

Depois acesse:

`/admin`
