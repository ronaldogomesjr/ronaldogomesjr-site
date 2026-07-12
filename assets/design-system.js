(function () {
  const text = (value) => String(value || '').trim();
  const localized = (data, key, lang) => text(data[`${key}_${lang}`] || data[key]);
  const set = (root, selector, value) => {
    const element = root.querySelector(selector);
    if (element && text(value)) element.textContent = text(value);
  };

  async function loadData(lang) {
    try {
      const response = await fetch('/content/design.json', { cache: 'no-store' });
      if (response.ok) return response.json();
    } catch (_) {}

    const response = await fetch('/content/pages.json', { cache: 'no-store' });
    if (!response.ok) throw new Error('Conteúdo indisponível');
    const payload = await response.json();
    const page = (payload.items || []).find((item) => item.id === 'design');
    if (!page) throw new Error('Página Design não encontrada');
    return {
      title_pt: page.title_pt,
      title_en: page.title_en,
      intro_pt: page.intro_pt,
      intro_en: page.intro_en,
      perspective_title_pt: page.section1_title_pt,
      perspective_title_en: page.section1_title_en,
      perspective_text_pt: page.section1_text_pt,
      perspective_text_en: page.section1_text_en
    };
  }

  async function render() {
    const root = document.querySelector('[data-design-page]');
    if (!root) return;
    const lang = root.dataset.lang || 'pt';
    const data = await loadData(lang);

    set(root, '[data-design-title]', localized(data, 'title', lang));
    set(root, '[data-design-intro]', localized(data, 'intro', lang));
    set(root, '[data-design-center-title]', localized(data, 'title', lang));
    set(root, '[data-design-center-text]', localized(data, 'center', lang));
    set(root, '[data-design-button]', localized(data, 'button', lang));
    set(root, '[data-perspective-title]', localized(data, 'perspective_title', lang));
    set(root, '[data-perspective-text]', localized(data, 'perspective_text', lang));
    set(root, '[data-design-quote]', localized(data, 'quote', lang));

    (data.nodes || []).slice(0, 5).forEach((node, index) => {
      set(root, `[data-node-title="${index + 1}"]`, localized(node, 'title', lang));
      set(root, `[data-node-text="${index + 1}"]`, localized(node, 'text', lang));
    });

    (data.steps || []).slice(0, 4).forEach((step, index) => {
      set(root, `[data-step-number="${index + 1}"]`, step.number || String(index + 1).padStart(2, '0'));
      set(root, `[data-step-text="${index + 1}"]`, localized(step, 'text', lang));
    });

    const metaTitle = localized(data, 'meta_title', lang);
    const metaDescription = localized(data, 'meta_description', lang);
    if (metaTitle) document.title = metaTitle;
    if (metaDescription) {
      let meta = document.querySelector('meta[name="description"]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = 'description';
        document.head.appendChild(meta);
      }
      meta.content = metaDescription;
    }
  }

  document.addEventListener('DOMContentLoaded', () => render().catch(() => {}));
})();
