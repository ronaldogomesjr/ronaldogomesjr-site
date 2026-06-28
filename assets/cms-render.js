(function () {
  const cache = {};

  function escapeHTML(value) {
    return String(value || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  async function loadJSON(path) {
    if (!cache[path]) {
      cache[path] = fetch(path, { cache: "no-store" }).then((response) => {
        if (!response.ok) throw new Error("Não foi possível carregar " + path);
        return response.json();
      });
    }
    return cache[path];
  }

  function sortedVisible(items, lang) {
    return (items || [])
      .filter((item) => item.visivel !== false)
      .filter((item) => !lang || item.idioma === lang)
      .sort((a, b) => {
        const orderA = Number(a.ordem || 9999);
        const orderB = Number(b.ordem || 9999);
        if (orderA !== orderB) return orderA - orderB;
        return Number(b.ano || 0) - Number(a.ano || 0);
      });
  }

  function externalLink(url, label) {
    if (!url || url === "#") return "";
    return `<a href="${escapeHTML(url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(label)}</a>`;
  }

  function publicationHTML(item, lang) {
    const label = lang === "en" ? "Access →" : "Acessar →";
    const meta = [item.autores, item.veiculo, item.ano].filter(Boolean).join(". ");
    return `
      <article class="section-row">
        <h2>${escapeHTML(item.ano || "")}</h2>
        <div>
          <p><strong>${escapeHTML(item.titulo)}</strong>${meta ? "<br>" + escapeHTML(meta) : ""}</p>
          ${externalLink(item.link, label)}
        </div>
      </article>
    `;
  }

  function projectHTML(item, lang) {
    const label = lang === "en" ? "Access →" : "Acessar →";
    const meta = [item.periodo, item.parceiros].filter(Boolean).join(" · ");
    return `
      <article class="section-row">
        <h2>${escapeHTML(item.titulo)}</h2>
        <div>
          <p>${escapeHTML(item.descricao)}</p>
          ${meta ? `<p class="item-meta">${escapeHTML(meta)}</p>` : ""}
          ${externalLink(item.link, label)}
        </div>
      </article>
    `;
  }

  function textbookHTML(item, lang) {
    const label = lang === "en" ? "Access →" : "Acessar →";
    const meta = [item.editora, item.ano, item.nivel].filter(Boolean).join(" · ");
    const image = item.imagem ? `<img class="content-thumb" src="${escapeHTML(item.imagem)}" alt="">` : "";
    return `
      <article class="section-row">
        <h2>${escapeHTML(item.titulo)}</h2>
        <div>
          ${image}
          <p>${escapeHTML(item.descricao)}</p>
          ${meta ? `<p class="item-meta">${escapeHTML(meta)}</p>` : ""}
          ${externalLink(item.link, label)}
        </div>
      </article>
    `;
  }

  function linkHTML(item) {
    return `
      <article class="section-row">
        <h2>${escapeHTML(item.nome)}</h2>
        <div>
          <p>${escapeHTML(item.tipo)}</p>
          ${externalLink(item.link, item.link && item.link !== "#" ? "Abrir →" : "")}
        </div>
      </article>
    `;
  }

  function emptyMessage(lang) {
    return lang === "en"
      ? `<p class="cms-message">No items have been added yet.</p>`
      : `<p class="cms-message">Nenhum item foi adicionado ainda.</p>`;
  }

  async function renderList(element) {
    const kind = element.dataset.cms;
    const lang = element.dataset.lang || "pt";
    const type = element.dataset.type;
    element.innerHTML = lang === "en"
      ? `<p class="cms-message">Loading content...</p>`
      : `<p class="cms-message">Carregando conteúdo...</p>`;

    try {
      if (kind === "publicacoes") {
        const data = await loadJSON("/content/publicacoes.json");
        const items = sortedVisible(data.items, lang).filter((item) => !type || item.tipo === type);
        element.innerHTML = items.length ? items.map((item) => publicationHTML(item, lang)).join("") : emptyMessage(lang);
      }

      if (kind === "projetos") {
        const data = await loadJSON("/content/projetos.json");
        const items = sortedVisible(data.items, lang);
        element.innerHTML = items.length ? items.map((item) => projectHTML(item, lang)).join("") : emptyMessage(lang);
      }

      if (kind === "livros-didaticos") {
        const data = await loadJSON("/content/livros-didaticos.json");
        const items = sortedVisible(data.items, lang);
        element.innerHTML = items.length ? items.map((item) => textbookHTML(item, lang)).join("") : emptyMessage(lang);
      }

      if (kind === "links") {
        const data = await loadJSON("/content/links.json");
        const items = sortedVisible(data.items, lang);
        element.innerHTML = items.length ? items.map((item) => linkHTML(item, lang)).join("") : emptyMessage(lang);
      }
    } catch (error) {
      console.error(error);
      element.innerHTML = lang === "en"
        ? `<p class="cms-message">The content could not be loaded.</p>`
        : `<p class="cms-message">Não foi possível carregar o conteúdo.</p>`;
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("[data-cms]").forEach(renderList);
  });
})();