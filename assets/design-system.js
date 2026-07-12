(function () {
  const clean = (value) => String(value ?? '').trim();
  const localized = (data, key, lang) => clean(data[`${key}_${lang}`] ?? data[key]);

  function setAll(root, selector, value) {
    const content = clean(value);
    if (!content) return;
    root.querySelectorAll(selector).forEach((element) => {
      element.textContent = content;
    });
  }

  async function loadData() {
    const response = await fetch('/content/design.json', { cache: 'no-store' });
    if (!response.ok) throw new Error('Conteúdo da página Design indisponível.');
    return response.json();
  }

  async function render() {
    const root = document.querySelector('[data-design-page]');
    if (!root) return;

    const lang = root.dataset.lang === 'en' ? 'en' : 'pt';
    const data = await loadData();

    setAll(root, '[data-design-title]', localized(data, 'title', lang));
    setAll(root, '[data-design-intro]', localized(data, 'intro', lang));
    setAll(root, '[data-design-center-title]', localized(data, 'title', lang));
    setAll(root, '[data-design-center-text]', localized(data, 'center', lang));
    setAll(root, '[data-perspective-title]', localized(data, 'perspective_title', lang));
    setAll(root, '[data-perspective-text]', localized(data, 'perspective_text', lang));

    (data.nodes || []).slice(0, 5).forEach((node, index) => {
      const position = index + 1;
      setAll(root, `[data-node-title="${position}"]`, localized(node, 'title', lang));
      setAll(root, `[data-node-text="${position}"]`, localized(node, 'text', lang));
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

  document.addEventListener('DOMContentLoaded', () => {
    render().catch((error) => console.error(error));
  });
})();
