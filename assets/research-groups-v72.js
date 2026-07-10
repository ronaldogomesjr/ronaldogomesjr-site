(function () {
  function escapeHTML(value) {
    return String(value || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function field(item, name, lang) {
    return String(
      item[`${name}_${lang}`] ||
      item[`${name}_${lang === "en" ? "pt" : "en"}`] ||
      item[name] ||
      ""
    ).trim();
  }

  async function loadGroups() {
    const response = await fetch(`/content/research-groups.json?ts=${Date.now()}`, {
      cache: "no-store"
    });
    if (!response.ok) throw new Error(`research-groups.json: ${response.status}`);
    const data = await response.json();
    return Array.isArray(data.items) ? data.items : [];
  }

  function renderItem(group, lang) {
    const name = field(group, "nome", lang);
    const description = field(group, "descricao", lang);
    const url = String(group.link || "").trim();
    const linkLabel = lang === "en" ? "Visit website →" : "Acessar site →";

    return `
      <article class="research-group-item">
        ${name ? `<h3>${escapeHTML(name)}</h3>` : ""}
        ${description ? `<p>${escapeHTML(description)}</p>` : ""}
        ${url ? `<a href="${escapeHTML(url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(linkLabel)}</a>` : ""}
      </article>`;
  }

  async function render() {
    const host = document.querySelector("[data-research-groups-host]");
    const list = document.querySelector("[data-research-groups-list]");
    if (!host || !list) return;

    const lang = host.getAttribute("data-lang") === "en" ? "en" : "pt";

    try {
      const groups = (await loadGroups())
        .filter((group) => group && group.visivel !== false)
        .filter((group) => field(group, "nome", lang) || field(group, "descricao", lang))
        .sort((a, b) => {
          const orderA = Number(a.ordem ?? 9999);
          const orderB = Number(b.ordem ?? 9999);
          if (orderA !== orderB) return orderA - orderB;
          return field(a, "nome", lang).localeCompare(field(b, "nome", lang));
        });

      list.innerHTML = groups.map((group) => renderItem(group, lang)).join("");
      host.classList.toggle("has-research-groups", groups.length > 0);
    } catch (error) {
      console.error("Erro ao carregar grupos de pesquisa:", error);
      list.innerHTML = "";
    }
  }

  document.addEventListener("DOMContentLoaded", render);
})();
