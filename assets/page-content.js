(function () {
  function escapeHTML(value) {
    return String(value || '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  async function loadPages() {
    const response = await fetch('/content/pages.json', { cache: 'no-store' });
    if (!response.ok) throw new Error('pages');
    const data = await response.json();
    return data.items || [];
  }

  function linkHTML(label, url) {
    if (!label || !url) return '';
    return `<a href="${escapeHTML(url)}" ${String(url).startsWith('http') ? 'target="_blank" rel="noopener noreferrer"' : ''}>${escapeHTML(label)}</a>`;
  }

  document.addEventListener('DOMContentLoaded', async function () {
    const shell = document.querySelector('[data-page-shell]');
    if (!shell) return;

    const slug = shell.getAttribute('data-page-slug');
    const lang = shell.getAttribute('data-lang') || 'pt';

    try {
      const items = await loadPages();
      const page = items.find((item) => item.slug === slug && item.idioma === lang);
      if (!page) return;

      const titleEl = shell.querySelector('[data-page-title]');
      const introEl = shell.querySelector('[data-page-intro]');
      if (titleEl) titleEl.textContent = page.title || titleEl.textContent;
      if (introEl) introEl.textContent = page.intro || introEl.textContent;
      document.title = `${page.meta_title || page.title || document.title} — Ronaldo Gomes Jr.`;

      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription && page.meta_description) {
        metaDescription.setAttribute('content', page.meta_description);
      }

      const sectionsEl = shell.querySelector('[data-page-sections]');
      if (sectionsEl) {
        const sections = [1,2,3,4].map((n) => ({
          title: page[`section${n}_title`],
          text: page[`section${n}_text`],
          linkLabel: page[`section${n}_link_label`],
          linkUrl: page[`section${n}_link_url`]
        })).filter((section) => section.title || section.text || section.linkLabel || section.linkUrl);

        sectionsEl.innerHTML = sections.map((section) => `
          <article class="section-row">
            <h2>${escapeHTML(section.title)}</h2>
            <div>
              ${section.text ? `<p>${escapeHTML(section.text)}</p>` : ''}
              ${linkHTML(section.linkLabel, section.linkUrl)}
            </div>
          </article>
        `).join('');
      }
    } catch (error) {
      console.error('Erro ao carregar páginas:', error);
    }
  });
})();