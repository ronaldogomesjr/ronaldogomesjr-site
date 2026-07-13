(function () {
  'use strict';

  const OWNER = 'ronaldogomesjr';
  const REPO = 'ronaldogomesjr-site';
  const BRANCH = 'main';
  const PAGE_ID = 'design';
  const ROOT_SELECTOR = '[data-design-page]';
  const LEGACY_URL = '/content/design.json';
  const PAGES_LOCAL_URL = '/content/pages.json';
  const PAGES_RAW_URL = `https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}/content/pages.json`;
  const PAGES_API_URL = `https://api.github.com/repos/${OWNER}/${REPO}/contents/content/pages.json`;
  const SELECTORS = {"title":["[data-design-title]","[data-design-center-title]"],"intro":["[data-design-intro]"],"section1_title":["[data-perspective-title]"],"section1_text":["[data-perspective-text]"]};

  function decodeBase64(value) {
    const binary = atob(String(value || '').replace(/\n/g, ''));
    const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
    return new TextDecoder('utf-8').decode(bytes);
  }

  async function fetchJson(url, headers = { Accept: 'application/json' }) {
    const separator = url.includes('?') ? '&' : '?';
    const response = await fetch(`${url}${separator}_=${Date.now()}`, {
      cache: 'no-store',
      headers
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  }

  async function loadPagesFromApi() {
    const payload = await fetchJson(
      `${PAGES_API_URL}?ref=${encodeURIComponent(BRANCH)}`,
      { Accept: 'application/vnd.github+json' }
    );
    if (!payload || !payload.content) throw new Error('Resposta inválida da API do GitHub.');
    return JSON.parse(decodeBase64(payload.content));
  }

  async function loadPagesDocument() {
    const attempts = [
      () => loadPagesFromApi(),
      () => fetchJson(PAGES_RAW_URL),
      () => fetchJson(PAGES_LOCAL_URL)
    ];

    let lastError = null;
    for (const attempt of attempts) {
      try {
        const data = await attempt();
        if (data && Array.isArray(data.items)) return data;
      } catch (error) {
        lastError = error;
      }
    }
    throw lastError || new Error('Conteúdo indisponível.');
  }

  function findPage(documentData) {
    return documentData.items.find((item) => item && item.id === PAGE_ID) || null;
  }

  async function loadLegacyPage() {
    const data = await fetchJson(LEGACY_URL);
    return {
      title_pt: data.title_pt,
      title_en: data.title_en,
      intro_pt: data.intro_pt,
      intro_en: data.intro_en,
      section1_title_pt: data.perspective_title_pt,
      section1_title_en: data.perspective_title_en,
      section1_text_pt: data.perspective_text_pt,
      section1_text_en: data.perspective_text_en,
      meta_title_pt: data.meta_title_pt,
      meta_title_en: data.meta_title_en,
      meta_description_pt: data.meta_description_pt,
      meta_description_en: data.meta_description_en
    };
  }

  function localized(item, field, lang) {
    return item?.[`${field}_${lang}`];
  }

  function setText(root, selector, value) {
    if (value === undefined || value === null) return;
    root.querySelectorAll(selector).forEach((element) => {
      element.textContent = String(value);
    });
  }

  function applyMeta(item, lang) {
    const metaTitle = localized(item, 'meta_title', lang);
    const metaDescription = localized(item, 'meta_description', lang);
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

  function renderItem(root, item, lang) {
    Object.entries(SELECTORS).forEach(([field, selectors]) => {
      const value = localized(item, field, lang);
      selectors.forEach((selector) => setText(root, selector, value));
    });
    applyMeta(item, lang);
  }

  async function render() {
    const root = document.querySelector(ROOT_SELECTOR);
    if (!root) return;
    if (root.dataset.contentReady === '93') return;
    const lang = root.dataset.lang === 'en' ? 'en' : 'pt';

    let item = null;
    let source = 'pages.json';
    try {
      item = findPage(await loadPagesDocument());
    } catch (error) {
      console.warn('Falha ao carregar content/pages.json.', error);
    }

    if (!item) {
      source = 'arquivo de compatibilidade';
      item = await loadLegacyPage();
    }

    renderItem(root, item, lang);
    root.dataset.contentSource = source;
    root.dataset.contentLoaded = 'true';
    document.dispatchEvent(new CustomEvent('concept-content:loaded', { detail: { pageId: PAGE_ID, source } }));
  }

  document.addEventListener('DOMContentLoaded', () => {
    render().catch((error) => console.error('Não foi possível atualizar o conteúdo da página Design.', error));
  });
})();
