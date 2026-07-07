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

  function sortedVisible(items, lang, mode) {
    return (items || [])
      .filter((item) => item.visivel !== false)
      .filter((item) => !lang || item.idioma === lang)
      .sort((a, b) => {
        if (mode === "publicacoes") {
          const yearA = Number(a.ano || 0);
          const yearB = Number(b.ano || 0);
          if (yearA !== yearB) return yearB - yearA;

          const orderA = Number(a.ordem || 0);
          const orderB = Number(b.ordem || 0);
          if (orderA !== orderB) return orderB - orderA;

          return String(a.titulo || "").localeCompare(String(b.titulo || ""));
        }

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
          <p>${escapeHTML(lang === "en" ? (item.descricao_en || item.descricao_pt || item.descricao || "") : (item.descricao_pt || item.descricao || ""))}</p>
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
    const buttons = [1, 2, 3, 4, 5, 6]
      .map((n) => ({ label: item[`botao${n}_label`], url: item[`botao${n}_url`] }))
      .filter((button) => button.label && button.url);

    const downloadButtons = buttons.length
      ? `<div class="download-buttons">${buttons.map((button) => `
          <a class="download-button" href="${escapeHTML(button.url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(button.label)}</a>
        `).join("")}</div>`
      : "";

    return `
      <article class="section-row">
        <h2>${escapeHTML(item.titulo)}</h2>
        <div>
          ${image}
          <p>${escapeHTML(lang === "en" ? (item.descricao_en || item.descricao_pt || item.descricao || "") : (item.descricao_pt || item.descricao || ""))}</p>
          ${meta ? `<p class="item-meta">${escapeHTML(meta)}</p>` : ""}
          ${externalLink(item.link, label)}
          ${downloadButtons}
        </div>
      </article>
    `;
  }

  function linkHTML(item, lang) {
    const name = lang === "en"
      ? (item.nome_en || item.nome_pt || item.nome || "")
      : (item.nome_pt || item.nome_en || item.nome || "");
    const description = lang === "en"
      ? (item.tipo_en || item.tipo_pt || item.tipo || "")
      : (item.tipo_pt || item.tipo_en || item.tipo || "");
    const openLabel = lang === "en" ? "Open →" : "Abrir →";

    return `
      <article class="section-row contact-link-row">
        <h2>
          <a class="contact-title-link" href="${escapeHTML(item.link || "#")}" ${item.link && item.link !== "#" ? 'target="_blank" rel="noopener noreferrer"' : ''}>
            ${escapeHTML(name)}
          </a>
        </h2>
        <div>
          ${description ? `<p>${escapeHTML(description)}</p>` : ""}
          ${externalLink(item.link, item.link && item.link !== "#" ? openLabel : "")}
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

        // Publicações acadêmicas não são traduzidas.
        // Um único cadastro aparece nas versões PT e EN.
        const seen = new Set();
        const items = sortedVisible(data.items, null, "publicacoes")
          .filter((item) => !type || item.tipo === type)
          .filter((item) => {
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

        element.innerHTML = items.length ? items.map((item) => publicationHTML(item, lang)).join("") : emptyMessage(lang);
      }

      if (kind === "projetos") {
        const data = await loadJSON("/content/projetos.json");
        const items = sortedVisible(data.items, lang);
        element.innerHTML = items.length ? items.map((item) => projectHTML(item, lang)).join("") : emptyMessage(lang);
      }

      if (kind === "livros-didaticos") {
        const data = await loadJSON("/content/livros-didaticos.json");

        // Livros didáticos/coleções são cadastrados uma única vez
        // e aparecem nas versões PT e EN.
        const seen = new Set();
        const items = sortedVisible(data.items, null)
          .filter((item) => {
            const key = [
              String(item.titulo || "").trim().toLowerCase(),
              String(item.editora || "").trim().toLowerCase(),
              String(item.ano || "").trim()
            ].join("|");

            if (seen.has(key)) return false;
            seen.add(key);
            return true;
          });

        element.innerHTML = items.length ? items.map((item) => textbookHTML(item, lang)).join("") : emptyMessage(lang);
      }

      if (kind === "links") {
        const data = await loadJSON("/content/links.json");
        const merged = new Map();

        (data.items || []).forEach((item, index) => {
          const key = String(item.link || `__${index}`).trim().toLowerCase();
          const current = merged.get(key) || {
            nome_pt: "",
            nome_en: "",
            tipo_pt: "",
            tipo_en: "",
            link: item.link || "#",
            visivel: item.visivel !== false,
            ordem: Number(item.ordem || 999)
          };

          if ("nome_pt" in item || "nome_en" in item || "tipo_pt" in item || "tipo_en" in item) {
            current.nome_pt = item.nome_pt || current.nome_pt;
            current.nome_en = item.nome_en || current.nome_en;
            current.tipo_pt = item.tipo_pt || current.tipo_pt;
            current.tipo_en = item.tipo_en || current.tipo_en;
          } else {
            const itemLang = item.idioma === "en" ? "en" : "pt";
            current[`nome_${itemLang}`] = item.nome || current[`nome_${itemLang}`];
            current[`tipo_${itemLang}`] = item.tipo || current[`tipo_${itemLang}`];
          }

          current.link = item.link || current.link;
          current.visivel = current.visivel && item.visivel !== false;
          current.ordem = Math.min(Number(current.ordem || 999), Number(item.ordem || 999));
          merged.set(key, current);
        });

        const items = Array.from(merged.values())
          .filter(item => item.visivel !== false)
          .sort((a, b) => Number(a.ordem || 9999) - Number(b.ordem || 9999));

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