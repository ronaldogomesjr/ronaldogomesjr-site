(function () {
  function escapeHTML(value) {
    return String(value || '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  function linkedTitle(title, url) {
    if (!title) return '';
    if (!url) return `<strong>${escapeHTML(title)}</strong>`;
    return `<a class="supervision-title-link" href="${escapeHTML(url)}" target="_blank" rel="noopener noreferrer"><strong>${escapeHTML(title)}</strong></a>`;
  }

  async function render(element) {
    const lang = element.dataset.lang || 'pt';
    try {
      const response = await fetch('/content/orientacoes.json', { cache: 'no-store' });
      if (!response.ok) throw new Error('orientacoes');
      const data = await response.json();

      const items = (data.items || [])
        .filter(item => item.visivel !== false)
        .sort((a, b) => {
          // Trabalhos em andamento (sem ano de conclusão) aparecem primeiro.
          const endA = a.ano_fim ? Number(a.ano_fim) : 9999;
          const endB = b.ano_fim ? Number(b.ano_fim) : 9999;
          if (endA !== endB) return endB - endA;

          const startA = Number(a.ano_inicio || 0);
          const startB = Number(b.ano_inicio || 0);
          if (startA !== startB) return startB - startA;

          return Number(a.ordem || 9999) - Number(b.ordem || 9999);
        });

      const levels = [
        { key: 'mestrado', pt: 'mestrado', en: 'master’s' },
        { key: 'doutorado', pt: 'doutorado', en: 'PhD' }
      ];

      element.innerHTML = levels.map(level => {
        const filtered = items.filter(item => item.nivel === level.key);
        if (!filtered.length) return '';

        const rows = filtered.map(item => {
          const title = lang === 'en' ? (item.titulo_en || item.titulo_pt) : (item.titulo_pt || item.titulo_en);
          const url = lang === 'en' ? (item.link_en || item.link_pt) : (item.link_pt || item.link_en);
          const years = [item.ano_inicio, item.ano_fim].filter(Boolean).join('–');

          return `
            <article class="section-row supervision-row">
              <h2>${escapeHTML(item.orientando || '')}</h2>
              <div>
                <p>${linkedTitle(title, url)}</p>
                ${years ? `<p class="item-meta">${escapeHTML(years)}</p>` : ''}
              </div>
            </article>
          `;
        }).join('');

        return `
          <section class="supervision-group">
            <h2 class="supervision-group-title">${lang === 'en' ? level.en : level.pt}</h2>
            ${rows}
          </section>
        `;
      }).join('');
    } catch (error) {
      console.error(error);
      element.innerHTML = lang === 'en'
        ? '<p class="cms-message">The content could not be loaded.</p>'
        : '<p class="cms-message">Não foi possível carregar o conteúdo.</p>';
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-supervisions]').forEach(render);
  });
})();