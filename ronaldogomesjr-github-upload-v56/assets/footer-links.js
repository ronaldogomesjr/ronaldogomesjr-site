(function () {
  function escapeHTML(value) {
    return String(value || '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  async function loadLinks() {
    const response = await fetch(`/content/links.json?v=${Date.now()}`, { cache: 'no-store' });
    if (!response.ok) throw new Error('links');
    return response.json();
  }

  function normalize(items) {
    const merged = new Map();

    (items || []).forEach((item, index) => {
      const key = String(item.link || `__${index}`).trim().toLowerCase();
      const current = merged.get(key) || {
        nome_pt: '',
        nome_en: '',
        tipo_pt: '',
        tipo_en: '',
        link: item.link || '#',
        visivel: item.visivel !== false,
        ordem: Number(item.ordem || 999)
      };

      if ('nome_pt' in item || 'nome_en' in item || 'tipo_pt' in item || 'tipo_en' in item) {
        current.nome_pt = item.nome_pt || current.nome_pt;
        current.nome_en = item.nome_en || current.nome_en;
        current.tipo_pt = item.tipo_pt || current.tipo_pt;
        current.tipo_en = item.tipo_en || current.tipo_en;
      } else {
        const lang = item.idioma === 'en' ? 'en' : 'pt';
        current[`nome_${lang}`] = item.nome || current[`nome_${lang}`];
        current[`tipo_${lang}`] = item.tipo || current[`tipo_${lang}`];
      }

      current.link = item.link || current.link;
      current.visivel = current.visivel && item.visivel !== false;
      current.ordem = Math.min(Number(current.ordem || 999), Number(item.ordem || 999));
      merged.set(key, current);
    });

    return Array.from(merged.values());
  }

  document.addEventListener('DOMContentLoaded', async function () {
    const footers = document.querySelectorAll('[data-site-footer]');
    if (!footers.length) return;

    try {
      const data = await loadLinks();
      const items = normalize(data.items)
        .filter(item => item.visivel !== false)
        .sort((a, b) => Number(a.ordem || 9999) - Number(b.ordem || 9999));

      footers.forEach((footer) => {
        const lang = footer.getAttribute('data-lang') || 'pt';
        const links = items
          .map(item => ({
            label: lang === 'en'
              ? (item.nome_en || item.nome_pt)
              : (item.nome_pt || item.nome_en),
            url: item.link
          }))
          .filter(item => item.label);

        if (!links.length) return;

        footer.innerHTML = links.map(item =>
          `<a href="${escapeHTML(item.url || '#')}" ${item.url && item.url !== '#' ? 'target="_blank" rel="noopener noreferrer"' : ''}>${escapeHTML(item.label)}</a>`
        ).join('\n');
      });
    } catch (error) {
      console.error('Erro ao carregar footer:', error);
    }
  });
})();