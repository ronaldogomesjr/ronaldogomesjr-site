(function () {
  function escapeHTML(value) {
    return String(value || '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  function normalizeKeyPart(value) {
    return String(value || '').trim().toLowerCase();
  }

  function nonTranslatablePreference(item) {
    if (!item || !item.idioma) return 0;
    if (item.idioma === 'pt') return 1;
    if (item.idioma === 'en') return 2;
    return 3;
  }

  function canonicalFooterLinks(items) {
    const byKey = new Map();

    (items || [])
      .filter((item) => item.visivel !== false)
      .forEach((item) => {
        const key = [
          normalizeKeyPart(item.nome),
          normalizeKeyPart(item.link),
          String(Number(item.ordem || 9999))
        ].join('|');
        const previous = byKey.get(key);

        // Rodapé não precisa de tradução. Se existirem duplicatas antigas por
        // idioma, exibe apenas uma versão, preferindo itens novos sem idioma,
        // depois PT e, por fim, EN.
        if (!previous || nonTranslatablePreference(item) < nonTranslatablePreference(previous)) {
          byKey.set(key, item);
        }
      });

    return Array.from(byKey.values()).sort((a,b) => Number(a.ordem || 9999) - Number(b.ordem || 9999));
  }

  async function loadLinks() {
    const response = await fetch('/content/links.json', { cache: 'no-store' });
    if (!response.ok) throw new Error('links');
    return response.json();
  }

  document.addEventListener('DOMContentLoaded', async function () {
    const footers = document.querySelectorAll('[data-site-footer]');
    if (!footers.length) return;
    try {
      const data = await loadLinks();
      footers.forEach((footer) => {
        const items = canonicalFooterLinks(data.items);
        if (!items.length) return;
        footer.innerHTML = items.map((item) => `<a href="${escapeHTML(item.link || '#')}" ${item.link && item.link !== '#' ? 'target="_blank" rel="noopener noreferrer"' : ''}>${escapeHTML(item.nome)}</a>`).join('\n');
      });
    } catch (error) {
      console.error('Erro ao carregar footer:', error);
    }
  });
})();
