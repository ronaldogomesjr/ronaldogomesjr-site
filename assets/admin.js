(function () {
  const OWNER = "ronaldogomesjr";
  const REPO = "ronaldogomesjr-site";
  const BRANCH = "main";
  const TOKEN_KEY = "rgjr_site_github_token";

  const menuFields = [
    ["label", "text", "Texto do menu"],
    ["url", "text", "Hiperlink / URL"],
    ["visivel", "checkbox", "Visível no menu"],
    ["ordem", "number", "Ordem"]
  ];

  const publicationFields = [
    ["idioma", "select", "Idioma", ["pt", "en"]],
    ["ano", "text", "Ano"],
    ["titulo", "text", "Título"],
    ["autores", "text", "Autores"],
    ["veiculo", "text", "Veículo / periódico / livro / editora"],
    ["link", "text", "Hiperlink externo"],
    ["visivel", "checkbox", "Visível no site"],
    ["destaque", "checkbox", "Destaque"],
    ["ordem", "number", "Ordem"]
  ];

  const pageFields = [
    ["slug", "text", "Slug da página"],
    ["idioma", "select", "Idioma", ["pt", "en"]],
    ["title", "text", "Título exibido"],
    ["intro", "textarea", "Texto de abertura"],
    ["meta_title", "text", "Título SEO / navegador"],
    ["meta_description", "textarea", "Descrição SEO"],
    ["section1_title", "text", "Seção 1 — título"],
    ["section1_text", "textarea", "Seção 1 — texto"],
    ["section1_link_label", "text", "Seção 1 — texto do hiperlink"],
    ["section1_link_url", "text", "Seção 1 — URL do hiperlink"],
    ["section2_title", "text", "Seção 2 — título"],
    ["section2_text", "textarea", "Seção 2 — texto"],
    ["section2_link_label", "text", "Seção 2 — texto do hiperlink"],
    ["section2_link_url", "text", "Seção 2 — URL do hiperlink"],
    ["section3_title", "text", "Seção 3 — título"],
    ["section3_text", "textarea", "Seção 3 — texto"],
    ["section3_link_label", "text", "Seção 3 — texto do hiperlink"],
    ["section3_link_url", "text", "Seção 3 — URL do hiperlink"],
    ["section4_title", "text", "Seção 4 — título"],
    ["section4_text", "textarea", "Seção 4 — texto"],
    ["section4_link_label", "text", "Seção 4 — texto do hiperlink"],
    ["section4_link_url", "text", "Seção 4 — URL do hiperlink"],
    ["ordem", "number", "Ordem"]
  ];

  const collections = {
    "identidade": {
      mode: "object-singleton",
      path: "content/site.json",
      key: "brand",
      label: "identidade e cabeçalho",
      fields: [
        ["nome", "text", "Nome/marca no cabeçalho"],
        ["nome_curto", "text", "Nome curto"],
        ["aria_label", "text", "Descrição acessível da marca"],
        ["url_pt", "text", "Link da marca na versão PT"],
        ["url_en", "text", "Link da marca na versão EN"],
        ["dot1_label", "text", "Descrição do ponto 1"],
        ["dot2_label", "text", "Descrição do ponto 2"],
        ["dot3_label", "text", "Descrição do ponto 3"]
      ],
      blank: { nome: "RONALDO GOMES JR.", nome_curto: "ronaldo gomes jr.", aria_label: "Ronaldo Gomes Jr.", url_pt: "/pt/", url_en: "/en/", dot1_label: "design", dot2_label: "tecnologia digital", dot3_label: "educação linguística" }
    },
    "menu-pt": {
      mode: "menu",
      path: "content/site.json",
      key: "pt",
      root: "menu",
      labelField: "label",
      meta: item => item.url || "",
      fields: menuFields,
      blank: { label: "NOVO LINK", url: "#", visivel: true, ordem: 999 }
    },
    "menu-en": {
      mode: "menu",
      path: "content/site.json",
      key: "en",
      root: "menu",
      labelField: "label",
      meta: item => item.url || "",
      fields: menuFields,
      blank: { label: "NEW LINK", url: "#", visivel: true, ordem: 999 }
    },
    "home-pt": {
      mode: "singleton",
      path: "content/home.json",
      key: "pt",
      label: "página inicial (pt)",
      fields: [
        ["keyword1", "text", "Palavra-chave 1"],
        ["keyword1_url", "text", "Hiperlink da palavra-chave 1"],
        ["keyword2", "text", "Palavra-chave 2"],
        ["keyword2_url", "text", "Hiperlink da palavra-chave 2"],
        ["keyword3", "text", "Palavra-chave 3"],
        ["keyword3_url", "text", "Hiperlink da palavra-chave 3"],
        ["intro1", "textarea", "Parágrafo 1"],
        ["intro2", "textarea", "Parágrafo 2"],
        ["intro3", "textarea", "Parágrafo 3"]
      ],
      blank: { keyword1: "design.", keyword1_url: "design", keyword2: "tecnologia digital.", keyword2_url: "tecnologia-digital", keyword3: "educação linguística.", keyword3_url: "educacao-linguistica", intro1: "", intro2: "", intro3: "" }
    },
    "home-en": {
      mode: "singleton",
      path: "content/home.json",
      key: "en",
      label: "home page (en)",
      fields: [
        ["keyword1", "text", "Keyword 1"],
        ["keyword1_url", "text", "Keyword 1 link"],
        ["keyword2", "text", "Keyword 2"],
        ["keyword2_url", "text", "Keyword 2 link"],
        ["keyword3", "text", "Keyword 3"],
        ["keyword3_url", "text", "Keyword 3 link"],
        ["intro1", "textarea", "Paragraph 1"],
        ["intro2", "textarea", "Paragraph 2"],
        ["intro3", "textarea", "Paragraph 3"]
      ],
      blank: { keyword1: "design.", keyword1_url: "design", keyword2: "digital technology.", keyword2_url: "digital-technology", keyword3: "language education.", keyword3_url: "language-education", intro1: "", intro2: "", intro3: "" }
    },
    "paginas-pt": {
      mode: "filtered-list",
      path: "content/pages.json",
      root: "items",
      filterField: "idioma",
      filterValue: "pt",
      labelField: "title",
      meta: item => item.slug || "",
      fields: pageFields,
      blank: { slug: "nova-pagina", idioma: "pt", title: "nova página", intro: "", meta_title: "", meta_description: "", section1_title: "", section1_text: "", section1_link_label: "", section1_link_url: "", section2_title: "", section2_text: "", section2_link_label: "", section2_link_url: "", section3_title: "", section3_text: "", section3_link_label: "", section3_link_url: "", section4_title: "", section4_text: "", section4_link_label: "", section4_link_url: "", ordem: 999 }
    },
    "paginas-en": {
      mode: "filtered-list",
      path: "content/pages.json",
      root: "items",
      filterField: "idioma",
      filterValue: "en",
      labelField: "title",
      meta: item => item.slug || "",
      fields: pageFields,
      blank: { slug: "new-page", idioma: "en", title: "new page", intro: "", meta_title: "", meta_description: "", section1_title: "", section1_text: "", section1_link_label: "", section1_link_url: "", section2_title: "", section2_text: "", section2_link_label: "", section2_link_url: "", section3_title: "", section3_text: "", section3_link_label: "", section3_link_url: "", section4_title: "", section4_text: "", section4_link_label: "", section4_link_url: "", ordem: 999 }
    },
    "artigos": {
      mode: "filtered-list",
      path: "content/publicacoes.json",
      root: "items",
      fixed: { tipo: "artigo" },
      labelField: "titulo",
      meta: item => ["artigo", item.ano, item.idioma].filter(Boolean).join(" · "),
      fields: publicationFields,
      blank: { tipo: "artigo", idioma: "pt", ano: "", titulo: "", autores: "", veiculo: "", link: "#", visivel: true, destaque: false, ordem: 999 }
    },
    "capitulos": {
      mode: "filtered-list",
      path: "content/publicacoes.json",
      root: "items",
      fixed: { tipo: "capitulo" },
      labelField: "titulo",
      meta: item => ["capítulo", item.ano, item.idioma].filter(Boolean).join(" · "),
      fields: publicationFields,
      blank: { tipo: "capitulo", idioma: "pt", ano: "", titulo: "", autores: "", veiculo: "", link: "#", visivel: true, destaque: false, ordem: 999 }
    },
    "livros-academicos": {
      mode: "filtered-list",
      path: "content/publicacoes.json",
      root: "items",
      fixed: { tipo: "livro_academico" },
      labelField: "titulo",
      meta: item => ["livro acadêmico", item.ano, item.idioma].filter(Boolean).join(" · "),
      fields: publicationFields,
      blank: { tipo: "livro_academico", idioma: "pt", ano: "", titulo: "", autores: "", veiculo: "", link: "#", visivel: true, destaque: false, ordem: 999 }
    },
    "projetos": {
      mode: "list",
      path: "content/projetos.json",
      root: "items",
      labelField: "titulo",
      meta: item => [item.periodo, item.idioma].filter(Boolean).join(" · "),
      fields: [
        ["idioma", "select", "Idioma", ["pt", "en"]],
        ["titulo", "text", "Título"],
        ["descricao", "textarea", "Descrição"],
        ["periodo", "text", "Período"],
        ["parceiros", "text", "Parceiros"],
        ["link", "text", "Hiperlink externo"],
        ["visivel", "checkbox", "Visível no site"],
        ["destaque", "checkbox", "Destaque"],
        ["ordem", "number", "Ordem"]
      ],
      blank: { idioma: "pt", titulo: "", descricao: "", periodo: "", parceiros: "", link: "#", visivel: true, destaque: false, ordem: 999 }
    },
    "livros-didaticos": {
      mode: "list",
      path: "content/livros-didaticos.json",
      root: "items",
      labelField: "titulo",
      meta: item => [item.editora, item.ano, item.idioma].filter(Boolean).join(" · "),
      fields: [
        ["idioma", "select", "Idioma", ["pt", "en"]],
        ["titulo", "text", "Título"],
        ["editora", "text", "Editora"],
        ["ano", "text", "Ano"],
        ["nivel", "text", "Nível"],
        ["descricao", "textarea", "Descrição"],
        ["link", "text", "Hiperlink externo"],
        ["imagem", "text", "URL da imagem"],
        ["visivel", "checkbox", "Visível no site"],
        ["destaque", "checkbox", "Destaque"],
        ["ordem", "number", "Ordem"]
      ],
      blank: { idioma: "pt", titulo: "", editora: "", ano: "", nivel: "", descricao: "", link: "#", imagem: "", visivel: true, destaque: false, ordem: 999 }
    },
    "links": {
      mode: "list",
      path: "content/links.json",
      root: "items",
      labelField: "nome",
      meta: item => [item.tipo, item.idioma].filter(Boolean).join(" · "),
      fields: [
        ["idioma", "select", "Idioma", ["pt", "en"]],
        ["nome", "text", "Texto do hiperlink"],
        ["tipo", "text", "Tipo / descrição"],
        ["link", "text", "URL do hiperlink"],
        ["visivel", "checkbox", "Visível no site"],
        ["ordem", "number", "Ordem"]
      ],
      blank: { idioma: "pt", nome: "", tipo: "", link: "#", visivel: true, ordem: 999 }
    }
  };

  let currentCollection = "identidade";
  let currentData = null;
  let currentSha = null;
  let currentActualIndex = null;
  let visibleRows = [];

  const $ = id => document.getElementById(id);

  function setStatus(message, isError = false) {
    const el = $("status");
    el.textContent = message;
    el.style.color = isError ? "#7f2f2f" : "";
  }

  function setBusy(isBusy) {
    ["loadBtn", "addBtn", "saveBtn", "deleteBtn"].forEach(id => {
      const button = $(id);
      if (button) button.disabled = isBusy;
    });
  }

  function getToken() {
    return localStorage.getItem(TOKEN_KEY) || $("tokenInput").value.trim();
  }

  function apiURL(path) {
    return `https://api.github.com/repos/${OWNER}/${REPO}/contents/${path}?ref=${BRANCH}&_=${Date.now()}`;
  }

  async function githubRequest(url, options = {}) {
    const token = getToken();
    if (!token) throw new Error("Insira e salve um token GitHub antes de continuar.");

    const response = await fetch(url, {
      cache: "no-store",
      ...options,
      headers: {
        "Accept": "application/vnd.github+json",
        "Authorization": `Bearer ${token}`,
        "X-GitHub-Api-Version": "2022-11-28",
        ...(options.headers || {})
      }
    });

    const text = await response.text();
    let data = null;
    try { data = text ? JSON.parse(text) : null; } catch { data = text; }

    if (!response.ok) {
      const message = data && data.message ? data.message : `Erro HTTP ${response.status}`;
      throw new Error(message);
    }

    return data;
  }

  function decodeBase64Unicode(base64) {
    const binary = atob(base64.replace(/\n/g, ""));
    const bytes = Uint8Array.from(binary, c => c.charCodeAt(0));
    return new TextDecoder("utf-8").decode(bytes);
  }

  function encodeBase64Unicode(text) {
    const bytes = new TextEncoder().encode(text);
    let binary = "";
    bytes.forEach(byte => binary += String.fromCharCode(byte));
    return btoa(binary);
  }

  function escapeHTML(value) {
    return String(value || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function getAllItems(config) {
    if (config.mode === "menu") {
      if (!currentData[config.key]) currentData[config.key] = { menu: [] };
      if (!Array.isArray(currentData[config.key][config.root])) currentData[config.key][config.root] = [];
      return currentData[config.key][config.root];
    }
    return currentData && Array.isArray(currentData[config.root]) ? currentData[config.root] : [];
  }

  function matchesConfig(item, config) {
    if (config.filterField && item[config.filterField] !== config.filterValue) return false;
    if (config.fixed) {
      for (const [key, value] of Object.entries(config.fixed)) {
        if (item[key] !== value) return false;
      }
    }
    return true;
  }

  async function loadCollection(preferLabel = "") {
    currentCollection = $("collectionSelect").value;
    const config = collections[currentCollection];
    setStatus("Carregando conteúdo do GitHub...");

    const file = await githubRequest(apiURL(config.path));
    currentSha = file.sha;
    currentData = JSON.parse(decodeBase64Unicode(file.content));

    if (config.mode === "singleton" || config.mode === "object-singleton") {
      if (!currentData[config.key]) currentData[config.key] = { ...config.blank };
      currentActualIndex = 0;
      renderList();
      renderEditor();
      setStatus("Conteúdo carregado com a versão mais recente do GitHub.");
      return;
    }

    if (config.mode !== "menu" && !Array.isArray(currentData[config.root])) currentData[config.root] = [];

    rebuildVisibleRows();

    if (preferLabel) {
      const found = visibleRows.find(row => (row.item[config.labelField] || "") === preferLabel);
      currentActualIndex = found ? found.actualIndex : (visibleRows[0] ? visibleRows[0].actualIndex : null);
    } else {
      currentActualIndex = visibleRows[0] ? visibleRows[0].actualIndex : null;
    }

    renderList();
    renderEditor();
    setStatus("Conteúdo carregado com a versão mais recente do GitHub.");
  }

  function rebuildVisibleRows() {
    const config = collections[currentCollection];
    visibleRows = getAllItems(config)
      .map((item, actualIndex) => ({ item, actualIndex }))
      .filter(row => matchesConfig(row.item, config))
      .sort((a, b) => {
        const orderA = Number(a.item.ordem || 9999);
        const orderB = Number(b.item.ordem || 9999);
        if (orderA !== orderB) return orderA - orderB;
        return String(a.item[config.labelField] || "").localeCompare(String(b.item[config.labelField] || ""));
      });
  }

  function renderList() {
    const list = $("itemList");
    const config = collections[currentCollection];
    list.innerHTML = "";

    if (config.mode === "singleton" || config.mode === "object-singleton") {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "item-button active";
      btn.innerHTML = `<span class="item-title">${escapeHTML(config.label)}</span><span class="item-meta">conteúdo único</span>`;
      list.appendChild(btn);
      return;
    }

    rebuildVisibleRows();
    if (!visibleRows.length) {
      list.innerHTML = "<p class='hint'>Nenhum item cadastrado nesta categoria.</p>";
      return;
    }

    if (currentActualIndex === null || !visibleRows.some(row => row.actualIndex === currentActualIndex)) {
      currentActualIndex = visibleRows[0].actualIndex;
    }

    visibleRows.forEach(({ item, actualIndex }) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "item-button" + (actualIndex === currentActualIndex ? " active" : "");
      btn.innerHTML = `<span class="item-title">${escapeHTML(item[config.labelField] || "(sem título)")}</span><span class="item-meta">${escapeHTML(config.meta ? config.meta(item) : "")}</span>`;
      btn.addEventListener("click", () => {
        currentActualIndex = actualIndex;
        renderList();
        renderEditor();
      });
      list.appendChild(btn);
    });
  }

  function getCurrentItem() {
    const config = collections[currentCollection];
    if (!currentData) return null;

    if (config.mode === "object-singleton") {
      return currentData[config.key] || config.blank;
    }

    if (config.mode === "singleton") {
      const source = currentData[config.key] || config.blank;
      const keywords = source.keywords || [];
      return {
        keyword1: keywords[0]?.label || config.blank.keyword1,
        keyword1_url: keywords[0]?.slug || config.blank.keyword1_url,
        keyword2: keywords[1]?.label || config.blank.keyword2,
        keyword2_url: keywords[1]?.slug || config.blank.keyword2_url,
        keyword3: keywords[2]?.label || config.blank.keyword3,
        keyword3_url: keywords[2]?.slug || config.blank.keyword3_url,
        intro1: source.intro?.[0] || "",
        intro2: source.intro?.[1] || "",
        intro3: source.intro?.[2] || ""
      };
    }

    const items = getAllItems(config);
    return currentActualIndex !== null ? items[currentActualIndex] : null;
  }

  function renderEditor() {
    const form = $("editorForm");
    const config = collections[currentCollection];
    const item = getCurrentItem();
    form.innerHTML = "";

    if (!item) {
      form.innerHTML = "<p class='hint'>Selecione ou crie um item.</p>";
      return;
    }

    if (config.fixed) {
      const fixedLabel = Object.values(config.fixed)[0].replace("_", " ");
      const p = document.createElement("p");
      p.className = "hint";
      p.textContent = `Categoria: ${fixedLabel}`;
      form.appendChild(p);
    }

    if (config.mode === "object-singleton") {
      const p = document.createElement("p");
      p.className = "hint";
      p.textContent = "Aqui você edita o nome/marca e os links do cabeçalho.";
      form.appendChild(p);
    }

    if (config.mode === "menu") {
      const p = document.createElement("p");
      p.className = "hint";
      p.textContent = "Aqui você edita os textos e hiperlinks do menu superior.";
      form.appendChild(p);
    }

    config.fields.forEach(([name, type, label, options]) => {
      if (type === "checkbox") {
        const wrapper = document.createElement("label");
        wrapper.className = "checkbox-row";
        wrapper.innerHTML = `<input type="checkbox" name="${name}" ${item[name] ? "checked" : ""}> ${escapeHTML(label)}`;
        form.appendChild(wrapper);
        return;
      }

      const labelEl = document.createElement("label");
      labelEl.textContent = label;
      let input;

      if (type === "textarea") {
        input = document.createElement("textarea");
        input.name = name;
        input.value = item[name] || "";
      } else if (type === "select") {
        input = document.createElement("select");
        input.name = name;
        options.forEach(opt => {
          const option = document.createElement("option");
          option.value = opt;
          option.textContent = opt;
          if (item[name] === opt) option.selected = true;
          input.appendChild(option);
        });
      } else {
        input = document.createElement("input");
        input.type = type;
        input.name = name;
        input.value = item[name] ?? "";
      }

      labelEl.appendChild(input);
      form.appendChild(labelEl);
    });
  }

  function collectEditorValues() {
    const config = collections[currentCollection];
    const form = $("editorForm");

    if (config.mode === "object-singleton") {
      const values = {};
      config.fields.forEach(([name, type]) => {
        const input = form.elements[name];
        if (!input) return;
        if (type === "checkbox") values[name] = Boolean(input.checked);
        else if (type === "number") values[name] = input.value === "" ? "" : Number(input.value);
        else values[name] = input.value;
      });
      return values;
    }

    if (config.mode === "singleton") {
      return {
        keywords: [
          { slug: form.elements["keyword1_url"].value, label: form.elements["keyword1"].value },
          { slug: form.elements["keyword2_url"].value, label: form.elements["keyword2"].value },
          { slug: form.elements["keyword3_url"].value, label: form.elements["keyword3"].value }
        ],
        intro: [form.elements["intro1"].value, form.elements["intro2"].value, form.elements["intro3"].value].filter(Boolean)
      };
    }

    const values = config.fixed ? { ...config.fixed } : {};
    config.fields.forEach(([name, type]) => {
      const input = form.elements[name];
      if (!input) return;
      if (type === "checkbox") values[name] = Boolean(input.checked);
      else if (type === "number") values[name] = input.value === "" ? "" : Number(input.value);
      else values[name] = input.value;
    });
    return values;
  }

  async function saveCurrent() {
    const config = collections[currentCollection];
    if (!currentData) await loadCollection();

    if (config.mode === "singleton" || config.mode === "object-singleton") {
      currentData[config.key] = collectEditorValues();
      await saveFile(`Atualiza ${currentCollection}`, config.label);
      return;
    }

    const items = getAllItems(config);
    if (currentActualIndex === null || !items[currentActualIndex]) throw new Error("Nenhum item selecionado.");

    const oldLabel = items[currentActualIndex][config.labelField] || "";
    const values = collectEditorValues();
    items[currentActualIndex] = values;
    await saveFile(`Atualiza ${currentCollection}`, values[config.labelField] || oldLabel);
  }

  async function saveFile(message, preferLabel = "") {
    const config = collections[currentCollection];
    setStatus("Conferindo versão mais recente no GitHub...");

    // Antes de publicar, busca sempre o SHA mais recente do arquivo.
    // Isso evita o erro: "content/...json does not match <sha>".
    try {
      const latestFile = await githubRequest(apiURL(config.path));
      if (latestFile && latestFile.sha) {
        currentSha = latestFile.sha;
      }
    } catch (error) {
      throw new Error("Não foi possível conferir a versão mais recente do arquivo: " + error.message);
    }

    setStatus("Publicando alteração no GitHub...");
    const content = JSON.stringify(currentData, null, 2) + "\n";

    try {
      const result = await githubRequest(`https://api.github.com/repos/${OWNER}/${REPO}/contents/${config.path}`, {
        method: "PUT",
        body: JSON.stringify({
          message,
          content: encodeBase64Unicode(content),
          sha: currentSha,
          branch: BRANCH
        })
      });

      if (result && result.content && result.content.sha) currentSha = result.content.sha;
      await loadCollection(preferLabel);
      setStatus("Alteração publicada. A Vercel deve atualizar o site em instantes.");
    } catch (error) {
      const msg = String(error.message || "");
      if (msg.includes("does not match") || msg.toLowerCase().includes("sha")) {
        setStatus("O arquivo mudou enquanto você editava. Recarreguei a categoria; tente publicar novamente.", true);
        await loadCollection(preferLabel);
        return;
      }
      throw error;
    }
  }

  async function addItem() {
    const config = collections[currentCollection];
    if (!currentData) await loadCollection();
    if (config.mode === "singleton" || config.mode === "object-singleton") {
      setStatus("Este é um conteúdo único. Edite os campos e clique em publicar alteração.");
      return;
    }
    const items = getAllItems(config);
    const newItem = JSON.parse(JSON.stringify(config.blank));
    items.push(newItem);
    currentActualIndex = items.length - 1;
    renderList();
    renderEditor();
    setStatus("Novo item criado. Preencha os campos e clique em publicar alteração.");
  }

  async function deleteItem() {
    const config = collections[currentCollection];
    if (config.mode === "singleton" || config.mode === "object-singleton") {
      setStatus("Este conteúdo não pode ser excluído.", true);
      return;
    }
    const items = getAllItems(config);
    if (currentActualIndex === null || !items[currentActualIndex]) return;
    if (!confirm("Tem certeza que deseja excluir este item?")) return;
    items.splice(currentActualIndex, 1);
    currentActualIndex = null;
    await saveFile(`Remove item de ${currentCollection}`);
  }

  $("saveTokenBtn").addEventListener("click", () => {
    const token = $("tokenInput").value.trim();
    if (!token) {
      setStatus("Cole o token antes de salvar.", true);
      return;
    }
    localStorage.setItem(TOKEN_KEY, token);
    setStatus("Token salvo neste navegador.");
  });

  $("forgetTokenBtn").addEventListener("click", () => {
    localStorage.removeItem(TOKEN_KEY);
    $("tokenInput").value = "";
    setStatus("Token apagado deste navegador.");
  });

  $("loadBtn").addEventListener("click", async () => {
    try { setBusy(true); await loadCollection(); } catch (err) { setStatus(err.message, true); } finally { setBusy(false); }
  });

  $("collectionSelect").addEventListener("change", async () => {
    try { setBusy(true); await loadCollection(); } catch (err) { setStatus(err.message, true); } finally { setBusy(false); }
  });

  $("addBtn").addEventListener("click", async () => {
    try { setBusy(true); await addItem(); } catch (err) { setStatus(err.message, true); } finally { setBusy(false); }
  });

  $("saveBtn").addEventListener("click", async event => {
    event.preventDefault();
    try { setBusy(true); await saveCurrent(); } catch (err) { setStatus(err.message, true); } finally { setBusy(false); }
  });

  $("deleteBtn").addEventListener("click", async event => {
    event.preventDefault();
    try { setBusy(true); await deleteItem(); } catch (err) { setStatus(err.message, true); } finally { setBusy(false); }
  });

  const savedToken = localStorage.getItem(TOKEN_KEY);
  if (savedToken) {
    $("tokenInput").value = savedToken;
    setStatus("Token já salvo neste navegador. Escolha um conteúdo e clique em carregar.");
  }
})();