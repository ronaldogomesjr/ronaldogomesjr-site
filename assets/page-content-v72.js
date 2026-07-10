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

  function field(page, name, lang) {
    return page[`${name}_${lang}`] || page[name] || '';
  }

  function linkHTML(label, url) {
    if (!label || !url) return '';
    return `<a href="${escapeHTML(url)}" ${String(url).startsWith('http') ? 'target="_blank" rel="noopener noreferrer"' : ''}>${escapeHTML(label)}</a>`;
  }

  function ensureResearchGroupsStyles() {
    if (document.querySelector('link[data-research-groups-styles]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/assets/research-groups-v71.css?v=71';
    link.setAttribute('data-research-groups-styles', '');
    document.head.appendChild(link);
  }

  async function loadResearchGroups() {
    const response = await fetch('/content/research-groups.json', { cache: 'no-store' });
    if (!response.ok) return [];
    const data = await response.json();
    return Array.isArray(data.items) ? data.items : [];
  }

  function researchGroupField(group, name, lang) {
    return group[`${name}_${lang}`] || group[`${name}_${lang === 'en' ? 'pt' : 'en'}`] || group[name] || '';
  }

  async function renderResearchGroups(shell, lang, page) {
    const isResearchPage = page && (
      page.id === 'pesquisa' ||
      page.slug_pt === 'pesquisa' ||
      page.slug_en === 'research'
    );
    if (!isResearchPage) return;

    const sectionsEl = shell.querySelector('[data-page-sections]');
    if (!sectionsEl) return;

    const groups = (await loadResearchGroups())
      .filter((group) => group && group.visivel !== false)
      .filter((group) => researchGroupField(group, 'nome', lang) || researchGroupField(group, 'descricao', lang))
      .sort((a, b) => {
        const orderA = Number(a.ordem ?? 9999);
        const orderB = Number(b.ordem ?? 9999);
        if (orderA !== orderB) return orderA - orderB;
        return researchGroupField(a, 'nome', lang).localeCompare(researchGroupField(b, 'nome', lang));
      });

    if (!groups.length) return;
    ensureResearchGroupsStyles();

    const sectionTitle = lang === 'en' ? 'Research Groups' : 'Grupos de Pesquisa';
    const linkLabel = lang === 'en' ? 'Visit website →' : 'Acessar site →';
    const itemsHTML = groups.map((group) => {
      const name = researchGroupField(group, 'nome', lang);
      const description = researchGroupField(group, 'descricao', lang);
      const url = String(group.link || '').trim();
      return `
        <article class="research-group-item">
          ${name ? `<h3>${escapeHTML(name)}</h3>` : ''}
          ${description ? `<p>${escapeHTML(description)}</p>` : ''}
          ${url ? linkHTML(linkLabel, url) : ''}
        </article>`;
    }).join('');

    sectionsEl.insertAdjacentHTML('beforeend', `
      <article class="section-row research-groups-section">
        <h2>${escapeHTML(sectionTitle)}</h2>
        <div class="research-groups-list">${itemsHTML}</div>
      </article>`);
  }

  document.addEventListener('DOMContentLoaded', async function () {
    const shell = document.querySelector('[data-page-shell]');
    if (!shell) return;

    const slug = shell.getAttribute('data-page-slug');
    const lang = shell.getAttribute('data-lang') || 'pt';

    try {
      const items = await loadPages();
      const page = items.find((item) => {
        if (lang === 'en') return item.slug_en === slug || item.slug === slug;
        return item.slug_pt === slug || item.slug === slug;
      });
      if (!page) return;

      const title = field(page, 'title', lang);
      const intro = field(page, 'intro', lang);
      const metaTitle = field(page, 'meta_title', lang);
      const metaDescription = field(page, 'meta_description', lang);

      const titleEl = shell.querySelector('[data-page-title]');
      const introEl = shell.querySelector('[data-page-intro]');
      if (titleEl && title) titleEl.textContent = title;
      if (introEl && intro) introEl.textContent = intro;

      const aboutPhoto = shell.querySelector('[data-about-photo]');
      if (aboutPhoto) {
        const photoURL = page.foto || page.photo || "";
        if (photoURL) {
          aboutPhoto.innerHTML = `<img src="${escapeHTML(photoURL)}" alt="${lang === "en" ? "Photo of Ronaldo Gomes Jr." : "Foto de Ronaldo Gomes Jr."}">`;
          aboutPhoto.classList.add("has-photo");
        } else {
          aboutPhoto.innerHTML = `<span class="about-photo-placeholder" aria-hidden="true"></span>`;
          aboutPhoto.classList.remove("has-photo");
        }
      }

      document.title = `${metaTitle || title || document.title} — Ronaldo Gomes Jr.`;

      const metaDescriptionEl = document.querySelector('meta[name="description"]');
      if (metaDescriptionEl && metaDescription) {
        metaDescriptionEl.setAttribute('content', metaDescription);
      }

      const sectionsEl = shell.querySelector('[data-page-sections]');
      if (sectionsEl) {
        const sections = [1,2,3,4].map((n) => ({
          title: field(page, `section${n}_title`, lang),
          text: field(page, `section${n}_text`, lang),
          linkLabel: field(page, `section${n}_link_label`, lang),
          linkUrl: field(page, `section${n}_link_url`, lang)
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

      // Research groups are rendered by research-groups-v72.js on the research pages.
    } catch (error) {
      console.error('Erro ao carregar páginas:', error);
    }
  });
})();