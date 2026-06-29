(function () {
  function escapeHTML(value) {
    return String(value || '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  async function loadJSON(path) {
    const response = await fetch(path, { cache: 'no-store' });
    if (!response.ok) throw new Error(path);
    return response.json();
  }

  function currentLang() {
    return document.documentElement.lang && document.documentElement.lang.toLowerCase().startsWith('en') ? 'en' : 'pt';
  }

  function isLangSwitch(item) {
    return ['EN', 'PT'].includes(String(item.label || '').trim().toUpperCase());
  }

  function isResearchMenuItem(item) {
    const label = String(item.label || '').trim().toLowerCase();
    const url = String(item.url || '').trim().toLowerCase();
    return label === 'pesquisa' || label === 'research' || url === '/pt/pesquisa/' || url === '/en/research/';
  }

  function isSupervisionsMenuItem(item) {
    const label = String(item.label || '').trim().toLowerCase();
    const url = String(item.url || '').trim().toLowerCase();
    return label === 'orientações' || label === 'orientacoes' || label === 'supervisions' || url === '/pt/orientacoes/' || url === '/en/supervisions/';
  }

  function defaultSupervisionsItem(lang) {
    return lang === 'en'
      ? { label: 'SUPERVISIONS', url: '/en/supervisions/', visivel: true, ordem: 4.5 }
      : { label: 'ORIENTAÇÕES', url: '/pt/orientacoes/', visivel: true, ordem: 4.5 };
  }

  function normalizeMenu(menu, lang) {
    const links = (menu || [])
      .filter((item) => item && item.visivel !== false)
      .filter((item) => !isResearchMenuItem(item))
      .sort((a, b) => Number(a.ordem || 9999) - Number(b.ordem || 9999));

    if (!links.some(isSupervisionsMenuItem)) {
      const item = defaultSupervisionsItem(lang);
      const aboutIndex = links.findIndex((link) => {
        const label = String(link.label || '').trim().toLowerCase();
        const url = String(link.url || '').trim().toLowerCase();
        return label === 'sobre' || label === 'about' || url === '/pt/sobre/' || url === '/en/about/';
      });
      const langIndex = links.findIndex(isLangSwitch);
      const insertIndex = aboutIndex >= 0 ? aboutIndex : (langIndex >= 0 ? langIndex : links.length);
      links.splice(insertIndex, 0, item);
    }

    return links;
  }

  document.addEventListener('DOMContentLoaded', async function () {
    try {
      const lang = currentLang();
      const site = await loadJSON('/content/site.json');

      const brandName = document.querySelector('.brand-name');
      if (brandName && site.brand && site.brand.nome) {
        brandName.textContent = site.brand.nome;
      }

      const brand = document.querySelector('.brand');
      if (brand && site.brand) {
        brand.setAttribute('href', lang === 'en' ? (site.brand.url_en || '/en/') : (site.brand.url_pt || '/pt/'));
        brand.setAttribute('aria-label', site.brand.aria_label || site.brand.nome || 'Ronaldo Gomes Jr.');
      }

      const nav = document.querySelector('.main-nav');
      if (nav && site[lang] && Array.isArray(site[lang].menu)) {
        const links = normalizeMenu(site[lang].menu, lang);
        nav.innerHTML = links.map((item) => {
          const isLang = isLangSwitch(item);
          return `<a ${isLang ? 'class="lang-link"' : ''} href="${escapeHTML(item.url || '#')}">${escapeHTML(item.label)}</a>`;
        }).join('\n');
      }
    } catch (error) {
      console.error('Erro ao carregar configurações do site:', error);
    }
  });
})();
