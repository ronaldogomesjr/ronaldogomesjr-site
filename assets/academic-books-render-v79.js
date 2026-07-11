(function () {
  function escapeHTML(value) {
    return String(value || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function normalizeImageURL(value) {
    const url = String(value || "").trim();
    if (!url) return "";
    if (/^(https?:)?\/\//i.test(url) || /^(data|blob):/i.test(url) || url.startsWith("/")) {
      return url;
    }
    return `/${url.replace(/^\.\//, "")}`;
  }

  function externalLink(url, label) {
    if (!url || url === "#") return "";
    return `<a class="academic-book-access" href="${escapeHTML(url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(label)}</a>`;
  }

  function sortedVisible(items) {
    return (items || [])
      .filter((item) => item && item.tipo === "livro_academico" && item.visivel !== false)
      .sort((a, b) => {
        const yearDifference = Number(b.ano || 0) - Number(a.ano || 0);
        if (yearDifference) return yearDifference;
        const orderDifference = Number(b.ordem || 0) - Number(a.ordem || 0);
        if (orderDifference) return orderDifference;
        return String(a.titulo || "").localeCompare(String(b.titulo || ""));
      });
  }

  function deduplicate(items) {
    const seen = new Set();
    return items.filter((item) => {
      const key = [
        item.tipo || "",
        item.ano || "",
        String(item.titulo || "").trim().toLowerCase(),
        String(item.link || "").trim().toLowerCase()
      ].join("|");
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  function bookHTML(item, lang) {
    const title = String(item.titulo || "").trim();
    const imageURL = normalizeImageURL(item.imagem || item.capa || item.image || item.cover);
    const imageAlt = lang === "en" ? `Cover of ${title}` : `Capa de ${title}`;
    const linkLabel = lang === "en" ? "Access →" : "Acessar →";
    const meta = [item.autores, item.veiculo, item.ano].filter(Boolean).join(". ");

    return `
      <article class="section-row academic-book-row">
        <h2>${escapeHTML(item.ano || "")}</h2>
        <div class="publication-details academic-book-details">
          ${imageURL ? `<img class="academic-book-cover" src="${escapeHTML(imageURL)}" alt="${escapeHTML(imageAlt)}" loading="lazy" decoding="async">` : ""}
          <p class="publication-title academic-book-title"><strong>${escapeHTML(title)}</strong></p>
          ${meta ? `<p class="academic-book-meta">${escapeHTML(meta)}</p>` : ""}
          ${externalLink(item.link, linkLabel)}
        </div>
      </article>
    `;
  }

  async function render(element) {
    const lang = element.dataset.lang || "pt";
    element.innerHTML = lang === "en"
      ? '<p class="cms-message">Loading academic books...</p>'
      : '<p class="cms-message">Carregando livros acadêmicos...</p>';

    try {
      const response = await fetch(`/content/publicacoes.json?v=79&t=${Date.now()}`, { cache: "no-store" });
      if (!response.ok) throw new Error("Não foi possível carregar publicacoes.json");
      const data = await response.json();
      const items = deduplicate(sortedVisible(data.items));

      element.innerHTML = items.length
        ? items.map((item) => bookHTML(item, lang)).join("")
        : (lang === "en"
          ? '<p class="cms-message">No academic books have been added yet.</p>'
          : '<p class="cms-message">Nenhum livro acadêmico foi adicionado ainda.</p>');

      element.querySelectorAll(".academic-book-cover").forEach((image) => {
        image.addEventListener("error", function () {
          console.warn("A capa não pôde ser carregada:", image.getAttribute("src"));
          image.hidden = true;
        }, { once: true });
      });
    } catch (error) {
      console.error(error);
      element.innerHTML = lang === "en"
        ? '<p class="cms-message">The content could not be loaded.</p>'
        : '<p class="cms-message">Não foi possível carregar o conteúdo.</p>';
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll('[data-cms="publicacoes"][data-type="livro_academico"]').forEach(render);
  });
})();
