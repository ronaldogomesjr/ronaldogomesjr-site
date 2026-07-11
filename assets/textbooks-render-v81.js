(function () {
  function escapeHTML(value) {
    return String(value || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function visibleItems(items) {
    return (Array.isArray(items) ? items : [])
      .filter(item => item && item.visivel !== false)
      .sort((a, b) => Number(a.ordem || 9999) - Number(b.ordem || 9999));
  }

  function linkCardsHTML(item, lang) {
    const cards = [];

    if (item.link && item.link !== "#") {
      cards.push({
        label: lang === "en" ? "Access" : "Acessar",
        url: item.link,
        image: item.imagem || ""
      });
    }

    for (let n = 1; n <= 6; n += 1) {
      const label = item[`botao${n}_label`];
      const url = item[`botao${n}_url`];
      const image = item[`botao${n}_imagem`] || item.imagem || "";
      if (label && url) cards.push({ label, url, image });
    }

    if (!cards.length) return "";

    return `<div class="textbook-links-grid">${cards.map(card => {
      const thumb = card.image
        ? `<img class="textbook-link-thumb" src="${escapeHTML(card.image)}" alt="${escapeHTML(card.label)}" loading="lazy">`
        : "";
      return `
        <div class="textbook-link-card${thumb ? '' : ' no-thumb'}">
          ${thumb}
          <a class="textbook-link-label" href="${escapeHTML(card.url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(card.label)} →</a>
        </div>
      `;
    }).join("")}</div>`;
  }

  function itemHTML(item, lang) {
    const title = item.titulo || "";
    const description = lang === "en"
      ? (item.descricao_en || item.descricao_pt || item.descricao || "")
      : (item.descricao_pt || item.descricao || item.descricao_en || "");
    const meta = [item.editora, item.ano, item.nivel].filter(Boolean).join(" · ");

    return `
      <article class="section-row textbook-row">
        <div class="textbook-heading">
          <h2>${escapeHTML(title)}</h2>
        </div>
        <div class="textbook-content">
          ${description ? `<p>${escapeHTML(description)}</p>` : ""}
          ${meta ? `<p class="item-meta">${escapeHTML(meta)}</p>` : ""}
          ${linkCardsHTML(item, lang)}
        </div>
      </article>
    `;
  }

  async function render(element) {
    const lang = element.dataset.lang || "pt";
    try {
      const response = await fetch(`/content/livros-didaticos.json?v=${Date.now()}`, { cache: "no-store" });
      if (!response.ok) throw new Error("livros-didaticos");
      const data = await response.json();
      const items = visibleItems(data.items);
      element.innerHTML = items.length
        ? items.map(item => itemHTML(item, lang)).join("")
        : `<p class="cms-message">${lang === "en" ? "No textbooks have been added yet." : "Nenhum livro didático foi adicionado ainda."}</p>`;
    } catch (error) {
      console.error(error);
      element.innerHTML = `<p class="cms-message">${lang === "en" ? "The content could not be loaded." : "Não foi possível carregar o conteúdo."}</p>`;
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll('[data-cms="livros-didaticos"]').forEach(render);
  });
})();
