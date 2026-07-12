(function () {
  'use strict';

  const RAW_URL = 'https://raw.githubusercontent.com/ronaldogomesjr/ronaldogomesjr-site/main/content/design.json';
  const LOCAL_URL = '/content/design.json';

  function hasOwn(object, key) {
    return Object.prototype.hasOwnProperty.call(object || {}, key);
  }

  function localized(data, key, lang) {
    const localizedKey = `${key}_${lang}`;
    if (hasOwn(data, localizedKey)) return data[localizedKey];
    if (hasOwn(data, key)) return data[key];
    return undefined;
  }

  function setText(root, selector, value) {
    if (value === undefined || value === null) return;
    root.querySelectorAll(selector).forEach((element) => {
      element.textContent = String(value);
    });
  }

  async function fetchJson(url) {
    const separator = url.includes('?') ? '&' : '?';
    const response = await fetch(`${url}${separator}_=${Date.now()}`, {
      cache: 'no-store',
      headers: { Accept: 'application/json' }
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  }

  async function loadData() {
    try {
      return await fetchJson(RAW_URL);
    } catch (rawError) {
      console.warn('Falha ao carregar o conteúdo atualizado do GitHub; usando a cópia local.', rawError);
      return fetchJson(LOCAL_URL);
    }
  }

  async function render() {
    const root = document.querySelector('[data-design-page]');
    if (!root) return;

    const lang = root.dataset.lang === 'en' ? 'en' : 'pt';
    const data = await loadData();

    setText(root, '[data-design-title]', localized(data, 'title', lang));
    setText(root, '[data-design-intro]', localized(data, 'intro', lang));
    setText(root, '[data-design-center-title]', localized(data, 'title', lang));
    setText(root, '[data-design-center-text]', localized(data, 'center', lang));
    setText(root, '[data-perspective-title]', localized(data, 'perspective_title', lang));
    setText(root, '[data-perspective-text]', localized(data, 'perspective_text', lang));

    const nodes = Array.isArray(data.nodes) ? data.nodes : [];
    nodes.slice(0, 5).forEach((node, index) => {
      const position = index + 1;
      setText(root, `[data-node-title="${position}"]`, localized(node, 'title', lang));
      setText(root, `[data-node-text="${position}"]`, localized(node, 'text', lang));
    });

    const metaTitle = localized(data, 'meta_title', lang);
    const metaDescription = localized(data, 'meta_description', lang);
    if (metaTitle !== undefined && metaTitle !== null) document.title = String(metaTitle);
    if (metaDescription !== undefined && metaDescription !== null) {
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
    render().catch((error) => console.error('Não foi possível atualizar o conteúdo da página Design.', error));
  });
})();
