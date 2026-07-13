(function () {
  const CONTENT_VERSION = '93';

  function escapeHTML(value) {
    return String(value || '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  async function loadJSON(path) {
    const separator = path.includes('?') ? '&' : '?';
    const response = await fetch(`${path}${separator}v=${CONTENT_VERSION}`, {
      cache: 'no-store'
    });
    if (!response.ok) throw new Error(path);
    return response.json();
  }

  async function loadPages() {
    const data = await loadJSON('/content/pages.json');
    return Array.isArray(data.items) ? data.items : [];
  }

  async function loadPublicationPages() {
    try {
      const data = await loadJSON('/content/publication-pages.json');
      return data && typeof data === 'object' ? data : {};
    } catch (_) {
      return {};
    }
  }

  function hasField(page, name, lang) {
    return Boolean(page) && (
      Object.prototype.hasOwnProperty.call(page, `${name}_${lang}`) ||
      Object.prototype.hasOwnProperty.call(page, name)
    );
  }

  function field(page, name, lang) {
    if (!page) return '';
    const localizedKey = `${name}_${lang}`;
    if (Object.prototype.hasOwnProperty.call(page, localizedKey)) {
      return String(page[localizedKey] ?? '');
    }
    if (Object.prototype.hasOwnProperty.call(page, name)) {
      return String(page[name] ?? '');
    }
    return '';
  }

  function linkHTML(label, url) {
    if (!label || !url) return '';
    const external = String(url).startsWith('http')
      ? 'target="_blank" rel="noopener noreferrer"'
      : '';
    return `<a href="${escapeHTML(url)}" ${external}>${escapeHTML(label)}</a>`;
  }

  function renderSections(page, lang) {
    return [1, 2, 3, 4]
      .map((number) => ({
        title: field(page, `section${number}_title`, lang),
        text: field(page, `section${number}_text`, lang),
        linkLabel: field(page, `section${number}_link_label`, lang),
        linkUrl: field(page, `section${number}_link_url`, lang)
      }))
      .filter((section) =>
        section.title || section.text || section.linkLabel || section.linkUrl
      )
      .map((section) => `
        <article class="section-row">
          <h2>${escapeHTML(section.title)}</h2>
          <div>
            ${section.text ? `<p>${escapeHTML(section.text)}</p>` : ''}
            ${linkHTML(section.linkLabel, section.linkUrl)}
          </div>
        </article>
      `)
      .join('');
  }

  document.addEventListener('DOMContentLoaded', async function () {
    const shell = document.querySelector('[data-page-shell]');
    if (!shell) return;

    if (shell.getAttribute('data-content-ready') === CONTENT_VERSION) return;

    const pageId = shell.getAttribute('data-page-id') || '';
    const slug = shell.getAttribute('data-page-slug') || '';
    const explicitLang = shell.getAttribute('data-lang');
    const lang = explicitLang || (
      (document.documentElement.lang || 'pt').toLowerCase().startsWith('en')
        ? 'en'
        : 'pt'
    );

    try {
      const [items, publicationPages] = await Promise.all([
        loadPages(),
        loadPublicationPages()
      ]);

      const generalPage = items.find((item) => {
        if (pageId && item.id === pageId) return true;
        if (lang === 'en') {
          return item.slug_en === slug || item.slug === slug;
        }
        return item.slug_pt === slug || item.slug === slug;
      }) || null;

      const dedicatedPage = pageId ? publicationPages[pageId] || null : null;
      const page = dedicatedPage
        ? { ...(generalPage || {}), ...dedicatedPage }
        : generalPage;

      if (!page) return;

      const title = field(page, 'title', lang);
      const intro = field(page, 'intro', lang);
      const metaTitle = field(page, 'meta_title', lang);
      const metaDescription = field(page, 'meta_description', lang);

      const titleEl = shell.querySelector('[data-page-title]');
      const introEl = shell.querySelector('[data-page-intro]');

      if (titleEl && hasField(page, 'title', lang) && titleEl.textContent !== title) {
        titleEl.textContent = title;
      }

      if (introEl && hasField(page, 'intro', lang)) {
        if (introEl.textContent !== intro) introEl.textContent = intro;
        introEl.hidden = intro.trim() === '';
      }

      const aboutPhoto = shell.querySelector('[data-about-photo]');
      if (aboutPhoto) {
        const photoURL = page.foto || page.photo || '';
        const currentPhoto = aboutPhoto.querySelector('img');

        if (photoURL) {
          if (!currentPhoto || currentPhoto.getAttribute('src') !== photoURL) {
            aboutPhoto.innerHTML = `<img src="${escapeHTML(photoURL)}" alt="${lang === 'en' ? 'Photo of Ronaldo Gomes Jr.' : 'Foto de Ronaldo Gomes Jr.'}">`;
          }
          aboutPhoto.classList.add('has-photo');
        } else if (currentPhoto) {
          aboutPhoto.innerHTML = '<span class="about-photo-placeholder" aria-hidden="true"></span>';
          aboutPhoto.classList.remove('has-photo');
        }
      }

      if (metaTitle.trim()) {
        document.title = `${metaTitle} — Ronaldo Gomes Jr.`;
      } else if (title.trim()) {
        document.title = `${title} — Ronaldo Gomes Jr.`;
      }

      const metaDescriptionEl = document.querySelector('meta[name="description"]');
      if (metaDescriptionEl && hasField(page, 'meta_description', lang)) {
        metaDescriptionEl.setAttribute('content', metaDescription);
      }

      const sectionsEl = shell.querySelector('[data-page-sections]');
      if (sectionsEl) {
        const sections = renderSections(page, lang);
        if (sectionsEl.innerHTML.trim() !== sections.trim()) {
          sectionsEl.innerHTML = sections;
        }
      }
    } catch (error) {
      console.error('Erro ao carregar páginas:', error);
    }
  });
})();
