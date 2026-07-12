(function () {
  function value(page, key, lang) {
    return String(page[`${key}_${lang}`] || page[key] || '').trim();
  }

  function setText(root, selector, text) {
    const element = root.querySelector(selector);
    if (element && text) element.textContent = text;
  }

  async function render() {
    const root = document.querySelector('[data-design-page]');
    if (!root) return;

    const lang = root.getAttribute('data-lang') || 'pt';
    const response = await fetch('/content/pages.json', { cache: 'no-store' });
    if (!response.ok) return;

    const data = await response.json();
    const page = (data.items || []).find((item) => item.id === 'design' || item.slug_pt === 'design' || item.slug_en === 'design');
    if (!page) return;

    const defaults = lang === 'en'
      ? [
          ['People', 'Active participants in the process.'],
          ['Language', 'Meaning-making across practices and media.'],
          ['Technologies', 'Tools and environments that expand possibilities.'],
          ['Contexts', 'Social and cultural settings that shape experience.']
        ]
      : [
          ['Pessoas', 'Sujeitos ativos no processo.'],
          ['Linguagem', 'Produção de sentidos em práticas e mídias.'],
          ['Tecnologias', 'Ferramentas e ambientes que ampliam possibilidades.'],
          ['Contextos', 'Ambientes sociais e culturais que dão significado.']
        ];

    setText(root, '[data-design-title]', value(page, 'title', lang));
    setText(root, '[data-design-intro]', value(page, 'intro', lang));
    setText(root, '[data-design-center-title]', value(page, 'title', lang));

    const intro = value(page, 'intro', lang);
    const centerText = intro.split(/\n|\./).map((part) => part.trim()).find(Boolean) || '';
    setText(root, '[data-design-center-text]', centerText);

    const perspectiveTitle = value(page, 'section1_title', lang) || (lang === 'en' ? 'Perspective' : 'Perspectiva');
    const perspectiveText = value(page, 'section1_text', lang);
    setText(root, '[data-perspective-title]', perspectiveTitle);
    setText(root, '[data-perspective-text]', perspectiveText);

    for (let index = 0; index < 4; index += 1) {
      const section = index + 1;
      const title = value(page, `section${section}_title`, lang) || defaults[index][0];
      const text = value(page, `section${section}_text`, lang) || defaults[index][1];
      setText(root, `[data-node-title="${section}"]`, title);
      setText(root, `[data-node-text="${section}"]`, text);
      setText(root, `[data-step-title="${section}"]`, title);
      setText(root, `[data-step-text="${section}"]`, text);
    }

    const metaTitle = value(page, 'meta_title', lang);
    const metaDescription = value(page, 'meta_description', lang);
    if (metaTitle) document.title = metaTitle;
    if (metaDescription) {
      const meta = document.querySelector('meta[name="description"]');
      if (meta) meta.setAttribute('content', metaDescription);
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    render().catch(function () {});
  });
})();
