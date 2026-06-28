# Ronaldo Gomes Jr. Site — V20 Static

Versão estática, sem Next.js, sem npm install e sem build.

Correções desta versão:
- corrige corte lateral no celular;
- reduz palavras-chave na versão mobile para caberem na tela;
- aplica `overflow-x: hidden` para evitar rolagem/corte horizontal;
- ajusta títulos das subpáginas para terem a mesma escala visual das palavras-chave da página inicial;
- mantém menu mobile com botão.

Como publicar:
1. Suba todos os arquivos desta pasta no GitHub.
2. Na Vercel, importe o repositório como projeto estático.
3. Framework Preset: Other.
4. Install Command: echo skip install.
5. Build Command: echo no build.
6. Output Directory: .
