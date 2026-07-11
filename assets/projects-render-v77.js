(function () {
  function escapeHTML(value) {
    return String(value || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function isBilingual(item) {
    return [
      "titulo_pt", "titulo_en", "descricao_pt", "descricao_en",
      "parceiros_pt", "parceiros_en", "link_pt", "link_en"
    ].some((key) => Object.prototype.hasOwnProperty.call(item || {}, key));
  }

  function localized(item, lang, field) {
    if (!isBilingual(item)) return item[field] || "";

    const primary = item[`${field}_${lang}`];
    const fallbackLang = lang === "en" ? "pt" : "en";
    const fallback = item[`${field}_${fallbackLang}`];
    return primary || fallback || item[field] || "";
  }

  function firstValidLink(...values) {
    const link = values.find((value) => {
      const normalized = String(value || "").trim();
      return normalized && normalized !== "#";
    });
    return link ? String(link).trim() : "";
  }

  function projectLink(item, lang) {
    if (!isBilingual(item)) return firstValidLink(item.link);
    return lang === "en"
      ? firstValidLink(item.link_en, item.link_pt, item.link)
      : firstValidLink(item.link_pt, item.link_en, item.link);
  }

  function projectPeriod(item) {
    const start = String(item.ano_inicio || "").trim();
    const end = String(item.ano_fim || "").trim();

    if (start && end) return `${start}–${end}`;
    if (start) return `${start}–`;
    if (end) return end;
    return String(item.periodo || "").trim();
  }

  function visibleProjects(items, lang) {
    return (items || [])
      .filter((item) => item && item.visivel !== false)
      .filter((item) => isBilingual(item) || item.idioma === lang)
      .filter((item) => String(localized(item, lang, "titulo")).trim())
      .sort((a, b) => {
        const orderA = Number(a.ordem ?? 9999);
        const orderB = Number(b.ordem ?? 9999);
        if (orderA !== orderB) return orderA - orderB;
        return localized(a, lang, "titulo").localeCompare(localized(b, lang, "titulo"));
      });
  }

  function projectHTML(item, lang) {
    const title = localized(item, lang, "titulo");
    const description = localized(item, lang, "descricao");
    const partners = localized(item, lang, "parceiros");
    const period = projectPeriod(item);
    const meta = [period, partners].filter(Boolean).join(" · ");
    const url = projectLink(item, lang);
    const linkLabel = lang === "en" ? "Access →" : "Acessar →";

    return `
      <article class="section-row project-row">
        <h2>${escapeHTML(title)}</h2>
        <div>
          ${description ? `<p>${escapeHTML(description)}</p>` : ""}
          ${meta ? `<p class="item-meta">${escapeHTML(meta)}</p>` : ""}
          ${url ? `<a href="${escapeHTML(url)}" target="_blank" rel="noopener noreferrer">${linkLabel}</a>` : ""}
        </div>
      </article>
    `;
  }

  async function render(element) {
    const lang = element.dataset.lang === "en" ? "en" : "pt";

    try {
      const response = await fetch(`/content/projetos.json?v=${Date.now()}`, {
        cache: "no-store"
      });

      if (!response.ok) throw new Error("projects-json");
      const data = await response.json();
      const items = visibleProjects(data.items, lang);

      element.innerHTML = items.length
        ? items.map((item) => projectHTML(item, lang)).join("")
        : `<p class="cms-message">${lang === "en" ? "No projects available." : "Nenhum projeto disponível."}</p>`;
    } catch (error) {
      console.error(error);
      element.innerHTML = `<p class="cms-message">${lang === "en" ? "The projects could not be loaded." : "Não foi possível carregar os projetos."}</p>`;
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll('[data-cms="projetos"]').forEach(render);
  });
})();
