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
    const response = await fetch('/content/educacao-linguistica.json', { cache: 'no-store' });
    if (!response.ok) throw new Error('Conteúdo da página Educação linguística indisponível.');
    return response.json();
  }

  async function render() {
    const root = document.querySelector('[data-language-page]');
    if (!root) return;

    const lang = root.dataset.lang === 'en' ? 'en' : 'pt';
    const data = await loadData();

    setAll(root, '[data-language-title]', localized(data, 'title', lang));
    setAll(root, '[data-language-intro]', localized(data, 'intro', lang));
    setAll(root, '[data-language-perspective-title]', localized(data, 'perspective_title', lang));
    setAll(root, '[data-language-perspective-text]', localized(data, 'perspective_text', lang));

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
