(function () {
  'use strict';

  const PAGE_ID = 'tecnologia-digital';
  const RAW_URL = 'https://raw.githubusercontent.com/ronaldogomesjr/ronaldogomesjr-site/main/content/pages.json';
  const LOCAL_URL = '/content/pages.json';

  async function fetchJson(url) {
    const separator = url.includes('?') ? '&' : '?';
    const response = await fetch(`${url}${separator}_=${Date.now()}`, {
      cache: 'no-store',
      headers: { Accept: 'application/json' }
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  }

  async function loadDocument() {
    try {
      return await fetchJson(RAW_URL);
    } catch (rawError) {
      console.warn('Falha ao carregar o conteúdo atualizado do GitHub; usando a cópia local.', rawError);
      return fetchJson(LOCAL_URL);
    }
  }

  function findPage(documentData) {
    return Array.isArray(documentData?.items)
      ? documentData.items.find((item) => item && item.id === PAGE_ID)
      : null;
  }

  function value(item, field, lang) {
    return item?.[`${field}_${lang}`];
  }

  function setText(root, selector, text) {
    if (text === undefined || text === null) return;
    root.querySelectorAll(selector).forEach((element) => { element.textContent = String(text); });
  }

  async function render() {
    const root = document.querySelector('[data-tech-page]');
    if (!root) return;
    const lang = root.dataset.lang === 'en' ? 'en' : 'pt';
    const page = findPage(await loadDocument());
    if (!page) throw new Error('Página Tecnologia digital não encontrada em content/pages.json.');

    setText(root, '[data-tech-title]', value(page, 'title', lang));
    setText(root, '[data-tech-intro]', value(page, 'intro', lang));
    setText(root, '[data-tech-perspective-title]', value(page, 'section1_title', lang));
    setText(root, '[data-tech-perspective-text]', value(page, 'section1_text', lang));

    const metaTitle = value(page, 'meta_title', lang);
    const metaDescription = value(page, 'meta_description', lang);
    if (metaTitle) document.title = String(metaTitle);
    if (metaDescription) {
      let meta = document.querySelector('meta[name="description"]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = 'description';
        document.head.appendChild(meta);
      }
      meta.content = String(metaDescription);
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    render().catch((error) => console.error('Não foi possível atualizar o conteúdo da página Tecnologia digital.', error));
  });
})();
