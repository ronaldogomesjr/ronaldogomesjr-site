(function () {
  async function loadHome(lang) {
    const response = await fetch('/content/home.json', { cache: 'no-store' });
    if (!response.ok) throw new Error('home');
    const data = await response.json();
    return data[lang];
  }

  function escapeHTML(value) {
    return String(value || '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  document.addEventListener('DOMContentLoaded', async function () {
    const keywordsEl = document.querySelector('[data-home-keywords]');
    const introEl = document.querySelector('[data-home-intro]');
    if (!keywordsEl || !introEl) return;

    const lang = document.documentElement.lang && document.documentElement.lang.toLowerCase().startsWith('en') ? 'en' : 'pt';

    try {
      const home = await loadHome(lang);
      if (!home) return;

      keywordsEl.innerHTML = (home.keywords || []).map((item) => {
        const href = String(item.slug || '').startsWith('/') || String(item.slug || '').startsWith('http') ? item.slug : (lang === 'pt' ? `/pt/${item.slug}/` : `/en/${item.slug}/`);
        return `<a class="keyword" href="${escapeHTML(href)}"><i aria-hidden="true"></i><span>${escapeHTML(item.label)}</span></a>`;
      }).join('');

      introEl.innerHTML = (home.intro || []).filter(Boolean).map((paragraph) => `<p>${escapeHTML(paragraph)}</p>`).join('');
    } catch (error) {
      console.error('Erro ao carregar conteúdo da home:', error);
    }
  });
})();