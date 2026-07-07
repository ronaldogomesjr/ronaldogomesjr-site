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
        const lang = footer.getAttribute('data-lang') || 'pt';
        const items = (data.items || [])
          .filter((item) => item.visivel !== false)
          .filter((item) => item.idioma === lang)
          .sort((a,b) => Number(a.ordem || 9999) - Number(b.ordem || 9999));
        if (!items.length) return;
        footer.innerHTML = items.map((item) => `<a href="${escapeHTML(item.link || '#')}" ${item.link && item.link !== '#' ? 'target="_blank" rel="noopener noreferrer"' : ''}>${escapeHTML(item.nome)}</a>`).join('\n');
      });
    } catch (error) {
      console.error('Erro ao carregar footer:', error);
    }
  });
})();