# Ronaldo Gomes Jr. Site — V21 Static

Versão estática, sem Next.js, sem npm install e sem build.

Correções desta versão:
- corrige corte lateral do texto no celular com ajustes mais fortes de largura e overflow;
- desativa autosizing de texto do iOS/Safari com `text-size-adjust: 100%`;
- reduz e estabiliza a escala do texto no mobile;
- centraliza e limita o diagrama no mobile;
- reduz títulos das subpáginas para a mesma escala das palavras-chave da Home;
- mantém a estrutura estática com 31 arquivos.

Como publicar:
1. Suba todos os arquivos desta pasta no GitHub.
2. Na Vercel, importe o repositório como projeto estático.
3. Framework Preset: Other.
4. Install Command: echo skip install.
5. Build Command: echo no build.
6. Output Directory: .
