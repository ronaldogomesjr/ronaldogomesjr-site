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

  function normalizeKeyPart(value) {
    return String(value || "").trim().toLowerCase();
  }

  const projectCategoryLabels = {
    ensino: { pt: "Ensino", en: "Teaching" },
    pesquisa: { pt: "Pesquisa", en: "Research" },
    extensao: { pt: "Extensão", en: "Extension" },
    internacionalizacao: { pt: "Internacionalização", en: "Internationalization" }
  };

  function plainTextKey(value) {
    return String(value || "")
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  function normalizeProjectCategory(value) {
    const key = plainTextKey(value).replace(/[\s_-]+/g, "");
    if (["ensino", "teaching", "education"].includes(key)) return "ensino";
    if (["pesquisa", "research"].includes(key)) return "pesquisa";
    if (["extensao", "extension", "outreach"].includes(key)) return "extensao";
    if (["internacionalizacao", "internationalization", "internationalisation", "international"].includes(key)) return "internacionalizacao";
    return "";
  }

  function projectCategoryLabel(item, lang) {
    const value = item.categoria || item.category || item.categoria_pt || item.categoria_en || "";
    const normalized = normalizeProjectCategory(value);
    if (normalized) return projectCategoryLabels[normalized][lang] || projectCategoryLabels[normalized].pt;
    return item[`categoria_${lang}`] || item.categoria || "";
  }

  function localizedProjectField(item, field, lang) {
    const localized = item[`${field}_${lang}`];
    if (localized) return localized;

    if (item.idioma === lang && item[field]) return item[field];

    const fallbackLang = lang === "en" ? "pt" : "en";
    return item[`${field}_${fallbackLang}`] || item[field] || "";
  }

  function projectPeriodLabel(item, lang) {
    const start = String(item.ano_inicio || item.inicio || "").trim();
    const end = String(item.ano_fim || item.fim || "").trim();

    if (start && end) return `${start}–${end}`;
    if (start) return lang === "en" ? `Since ${start}` : `Desde ${start}`;
    if (end) return lang === "en" ? `Until ${end}` : `Até ${end}`;

    return item.periodo || "";
  }


  function supervisionPeriodLabel(item, lang) {
    const start = String(item.ano_inicio || item.inicio || "").trim();
    const end = String(item.ano_fim || item.fim || "").trim();

    if (start && end) return `${start}–${end}`;
    if (start) return lang === "en" ? `Since ${start}` : `Desde ${start}`;
    if (end) return lang === "en" ? `Until ${end}` : `Até ${end}`;
    return "";
  }

  function localizedSupervisionField(item, field, lang) {
    return item[`${field}_${lang}`] || item[field] || item[`${field}_${lang === "en" ? "pt" : "en"}`] || "";
  }

  function hasBilingualProjectFields(item) {
    return Boolean(item.titulo_pt || item.titulo_en || item.descricao_pt || item.descricao_en || item.categoria);
  }

  function projectVisibleInLanguage(item, lang) {
    return hasBilingualProjectFields(item) || !item.idioma || item.idioma === lang;
  }

  function nonTranslatablePreference(item) {
    if (!item || !item.idioma) return 0;
    if (item.idioma === "pt") return 1;
    if (item.idioma === "en") return 2;
    return 3;
  }

  function mergeLinkDescriptions(target, item) {
    if (!target || !item) return target;

    ["descricao_pt", "descricao_en", "tipo_pt", "tipo_en"].forEach((field) => {
      if (item[field] && !target[field]) target[field] = item[field];
    });

    const legacyDescription = item.descricao || item.tipo || "";

    if (item.idioma === "pt" && legacyDescription && !target.descricao_pt) {
      target.descricao_pt = legacyDescription;
    }

    if (item.idioma === "en" && legacyDescription && !target.descricao_en) {
      target.descricao_en = legacyDescription;
    }

    if (!item.idioma && legacyDescription && !target.descricao_pt) {
      target.descricao_pt = legacyDescription;
    }

    if ((!target.link || target.link === "#") && item.link && item.link !== "#") {
      target.link = item.link;
    }

    return target;
  }

  const defaultContactDescriptions = {
    email: { pt: "Contato", en: "Contact" },
    "e-mail": { pt: "Contato", en: "Contact" },
    orcid: { pt: "Perfil acadêmico", en: "Academic profile" },
    "google scholar": { pt: "Perfil acadêmico", en: "Academic profile" },
    scholar: { pt: "Perfil acadêmico", en: "Academic profile" },
    lattes: { pt: "Currículo", en: "CV" }
  };

  function linkNameKey(value) {
    return String(value || "")
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  function defaultContactDescription(item, lang) {
    const byName = defaultContactDescriptions[linkNameKey(item && item.nome)];
    return byName ? (byName[lang] || byName.pt || "") : "";
  }

  function translateLegacyLinkDescription(value, lang) {
    if (lang !== "en") return value || "";

    const normalized = linkNameKey(value);

    const translations = {
      "contato": "Contact",
      "perfil academico": "Academic profile",
      "curriculo": "CV",
      "curriculum": "CV"
    };

    return translations[normalized] || value || "";
  }

  function firstFilled(values) {
    return (values || []).find((value) => String(value || "").trim()) || "";
  }

  function localizedLinkDescription(item, lang) {
    if (lang === "en") {
      const english = firstFilled([
        item.descricao_en,
        item.description_en,
        item.tipo_en,
        item.idioma === "en" ? item.descricao : "",
        item.idioma === "en" ? item.tipo : ""
      ]);
      if (english) return english;

      const legacyPt = firstFilled([
        item.descricao_pt,
        item.description_pt,
        item.tipo_pt,
        item.descricao,
        item.tipo,
        defaultContactDescription(item, "pt")
      ]);
      return translateLegacyLinkDescription(legacyPt, lang) || defaultContactDescription(item, lang);
    }

    return firstFilled([
      item.descricao_pt,
      item.description_pt,
      item.tipo_pt,
      item.idioma === "pt" ? item.descricao : "",
      item.idioma === "pt" ? item.tipo : "",
      item.descricao,
      item.tipo,
      defaultContactDescription(item, lang),
      item.descricao_en,
      item.description_en,
      item.tipo_en
    ]);
  }

  function canonicalNonTranslatedItems(items) {
    const visible = sortedVisible(items, null);
    const byKey = new Map();

    visible.forEach((item) => {
      const key = normalizeKeyPart(item.nome) || normalizeKeyPart(item.link);
      const previous = byKey.get(key);

      if (!previous) {
        const copy = mergeLinkDescriptions({ ...item }, item);
        byKey.set(key, copy);
        return;
      }

      // Se houver duplicatas antigas por idioma, mantém uma única entrada,
      // mas aproveita descrições PT/EN já existentes nos itens duplicados.
      const shouldReplace = nonTranslatablePreference(item) < nonTranslatablePreference(previous);
      const merged = shouldReplace ? { ...item } : { ...previous };
      mergeLinkDescriptions(merged, previous);
      mergeLinkDescriptions(merged, item);
      byKey.set(key, merged);
    });

    return Array.from(byKey.values()).sort((a, b) => {
      const orderA = Number(a.ordem || 9999);
      const orderB = Number(b.ordem || 9999);
      if (orderA !== orderB) return orderA - orderB;
      return String(a.nome || "").localeCompare(String(b.nome || ""));
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
    const title = localizedProjectField(item, "titulo", lang);
    const description = localizedProjectField(item, "descricao", lang);
    const category = projectCategoryLabel(item, lang);
    const period = projectPeriodLabel(item, lang);
    const meta = [category, period, item.parceiros].filter(Boolean).join(" · ");

    return `
      <article class="section-row">
        <h2>${escapeHTML(title)}</h2>
        <div>
          ${description ? `<p>${escapeHTML(description)}</p>` : ""}
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

  function supervisionHTML(item, lang) {
    const name = item.orientando || item.nome || "";
    const work = localizedSupervisionField(item, "trabalho", lang) || localizedSupervisionField(item, "titulo", lang);
    const period = supervisionPeriodLabel(item, lang);
    const meta = period ? `<p class="item-meta">${escapeHTML(period)}</p>` : "";

    return `
      <article class="section-row supervision-row">
        <h2>${escapeHTML(name)}</h2>
        <div>
          ${work ? `<p>${escapeHTML(work)}</p>` : ""}
          ${meta}
        </div>
      </article>
    `;
  }

  function linkHTML(item, lang) {
    const label = lang === "en" ? "Open →" : "Abrir →";
    const description = localizedLinkDescription(item, lang);

    return `
      <article class="section-row">
        <h2>${escapeHTML(item.nome)}</h2>
        <div>
          ${description ? `<p>${escapeHTML(description)}</p>` : ""}
          ${externalLink(item.link, item.link && item.link !== "#" ? label : "")}
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

        // Projetos passam a ser cadastrados uma única vez, com campos PT/EN
        // para nome, descrição e categoria. Itens antigos com idioma continuam
        // funcionando até serem atualizados pelo painel.
        const items = sortedVisible(data.items, null)
          .filter((item) => projectVisibleInLanguage(item, lang));

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

      if (kind === "orientacoes") {
        const data = await loadJSON("/content/orientacoes.json");
        const degree = element.dataset.degree;
        const items = sortedVisible(data.items, null)
          .filter((item) => !degree || item.grau === degree || item.degree === degree);

        element.innerHTML = items.length ? items.map((item) => supervisionHTML(item, lang)).join("") : emptyMessage(lang);
      }

      if (kind === "links") {
        const data = await loadJSON("/content/links.json");

        // Links/contato/rodapé não são traduzidos.
        // Um único cadastro aparece nas versões PT e EN.
        const items = canonicalNonTranslatedItems(data.items);
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