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
      }

      const nav = document.querySelector('.main-nav');
      if (nav && site[lang] && Array.isArray(site[lang].menu)) {
        const links = site[lang].menu
          .filter((item) => item.visivel !== false)
          .sort((a, b) => Number(a.ordem || 9999) - Number(b.ordem || 9999));
        nav.innerHTML = links.map((item) => {
          const isLang = ['EN', 'PT'].includes(String(item.label || '').toUpperCase());
          return `<a ${isLang ? 'class="lang-link"' : ''} href="${escapeHTML(item.url || '#')}">${escapeHTML(item.label)}</a>`;
        }).join('\n');
      }
    } catch (error) {
      console.error('Erro ao carregar configurações do site:', error);
    }
  });
})();