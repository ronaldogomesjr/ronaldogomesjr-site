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
    ["ano", "text", "Ano"],
    ["titulo", "text", "Título"],
    ["autores", "text", "Autores"],
    ["veiculo", "text", "Veículo / periódico / livro / editora"],
    ["link", "text", "Hiperlink externo"],
    ["visivel", "checkbox", "Visível no site"],
    ["destaque", "checkbox", "Destaque"],
    ["ordem", "number", "Ordem automática/manual"]
  ];


  const academicBookFields = [
    ["ano", "text", "Ano"],
    ["titulo", "text", "Título"],
    ["autores", "text", "Autores"],
    ["veiculo", "text", "Editora / informações editoriais"],
    ["link", "text", "Hiperlink externo"],
    ["imagem", "image-upload", "Capa do livro"],
    ["visivel", "checkbox", "Visível no site"],
    ["destaque", "checkbox", "Destaque"],
    ["ordem", "number", "Ordem automática/manual"]
  ];

  const aboutPhotoFields = [
    ["foto", "image-upload", "Foto da página sobre / about — enviar ou substituir"]
  ];

  const pageFields = [
    ["id", "text", "ID interno"],
    ["slug_pt", "text", "Slug da página em português"],
    ["slug_en", "text", "Slug da página em inglês"],

    ["title_pt", "text", "Título em português"],
    ["title_en", "text", "Título em inglês"],
    ["intro_pt", "textarea", "Texto de abertura em português"],
    ["intro_en", "textarea", "Texto de abertura em inglês"],

    ["meta_title_pt", "text", "Título SEO em português"],
    ["meta_title_en", "text", "Título SEO em inglês"],
    ["meta_description_pt", "textarea", "Descrição SEO em português"],
    ["meta_description_en", "textarea", "Descrição SEO em inglês"],

    ["section1_title_pt", "text", "Seção 1 — título em português"],
    ["section1_title_en", "text", "Seção 1 — título em inglês"],
    ["section1_text_pt", "textarea", "Seção 1 — texto em português"],
    ["section1_text_en", "textarea", "Seção 1 — texto em inglês"],
    ["section1_link_label_pt", "text", "Seção 1 — texto do hiperlink em português"],
    ["section1_link_label_en", "text", "Seção 1 — texto do hiperlink em inglês"],
    ["section1_link_url_pt", "text", "Seção 1 — URL do hiperlink em português"],
    ["section1_link_url_en", "text", "Seção 1 — URL do hiperlink em inglês"],

    ["section2_title_pt", "text", "Seção 2 — título em português"],
    ["section2_title_en", "text", "Seção 2 — título em inglês"],
    ["section2_text_pt", "textarea", "Seção 2 — texto em português"],
    ["section2_text_en", "textarea", "Seção 2 — texto em inglês"],
    ["section2_link_label_pt", "text", "Seção 2 — texto do hiperlink em português"],
    ["section2_link_label_en", "text", "Seção 2 — texto do hiperlink em inglês"],
    ["section2_link_url_pt", "text", "Seção 2 — URL do hiperlink em português"],
    ["section2_link_url_en", "text", "Seção 2 — URL do hiperlink em inglês"],

    ["section3_title_pt", "text", "Seção 3 — título em português"],
    ["section3_title_en", "text", "Seção 3 — título em inglês"],
    ["section3_text_pt", "textarea", "Seção 3 — texto em português"],
    ["section3_text_en", "textarea", "Seção 3 — texto em inglês"],
    ["section3_link_label_pt", "text", "Seção 3 — texto do hiperlink em português"],
    ["section3_link_label_en", "text", "Seção 3 — texto do hiperlink em inglês"],
    ["section3_link_url_pt", "text", "Seção 3 — URL do hiperlink em português"],
    ["section3_link_url_en", "text", "Seção 3 — URL do hiperlink em inglês"],

    ["section4_title_pt", "text", "Seção 4 — título em português"],
    ["section4_title_en", "text", "Seção 4 — título em inglês"],
    ["section4_text_pt", "textarea", "Seção 4 — texto em português"],
    ["section4_text_en", "textarea", "Seção 4 — texto em inglês"],
    ["section4_link_label_pt", "text", "Seção 4 — texto do hiperlink em português"],
    ["section4_link_label_en", "text", "Seção 4 — texto do hiperlink em inglês"],
    ["section4_link_url_pt", "text", "Seção 4 — URL do hiperlink em português"],
    ["section4_link_url_en", "text", "Seção 4 — URL do hiperlink em inglês"],

    ["ordem", "number", "Ordem"]
  ];

  function pageCollection(pageId, label, extraFields = []) {
    return {
      mode: "page-singleton",
      path: "content/pages.json",
      root: "items",
      pageId,
      label,
      labelField: "title_pt",
      meta: item => `${item.slug_pt || ""} / ${item.slug_en || ""}`,
      fields: [...pageFields, ...extraFields],
      blank: {
        id: pageId,
        slug_pt: pageId,
        slug_en: pageId,
        title_pt: pageId,
        title_en: pageId,
        intro_pt: "",
        intro_en: "",
        meta_title_pt: "",
        meta_title_en: "",
        meta_description_pt: "",
        meta_description_en: "",
        foto: "",
        section1_title_pt: "",
        section1_title_en: "",
        section1_text_pt: "",
        section1_text_en: "",
        section1_link_label_pt: "",
        section1_link_label_en: "",
        section1_link_url_pt: "",
        section1_link_url_en: "",
        section2_title_pt: "",
        section2_title_en: "",
        section2_text_pt: "",
        section2_text_en: "",
        section2_link_label_pt: "",
        section2_link_label_en: "",
        section2_link_url_pt: "",
        section2_link_url_en: "",
        section3_title_pt: "",
        section3_title_en: "",
        section3_text_pt: "",
        section3_text_en: "",
        section3_link_label_pt: "",
        section3_link_label_en: "",
        section3_link_url_pt: "",
        section3_link_url_en: "",
        section4_title_pt: "",
        section4_title_en: "",
        section4_text_pt: "",
        section4_text_en: "",
        section4_link_label_pt: "",
        section4_link_label_en: "",
        section4_link_url_pt: "",
        section4_link_url_en: "",
        ordem: 999
      }
    };
  }

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
    "home": {
      mode: "home-bilingual",
      path: "content/home.json",
      label: "página inicial / home",
      fields: [
        ["keyword1_pt", "text", "Palavra-chave 1 em português"],
        ["keyword1_en", "text", "Keyword 1 in English"],
        ["keyword1_url_pt", "text", "Link da palavra-chave 1 em português"],
        ["keyword1_url_en", "text", "Keyword 1 link in English"],

        ["keyword2_pt", "text", "Palavra-chave 2 em português"],
        ["keyword2_en", "text", "Keyword 2 in English"],
        ["keyword2_url_pt", "text", "Link da palavra-chave 2 em português"],
        ["keyword2_url_en", "text", "Keyword 2 link in English"],

        ["keyword3_pt", "text", "Palavra-chave 3 em português"],
        ["keyword3_en", "text", "Keyword 3 in English"],
        ["keyword3_url_pt", "text", "Link da palavra-chave 3 em português"],
        ["keyword3_url_en", "text", "Keyword 3 link in English"],

        ["intro1_pt", "textarea", "Parágrafo 1 em português"],
        ["intro1_en", "textarea", "Paragraph 1 in English"],
        ["intro2_pt", "textarea", "Parágrafo 2 em português"],
        ["intro2_en", "textarea", "Paragraph 2 in English"],
        ["intro3_pt", "textarea", "Parágrafo 3 em português"],
        ["intro3_en", "textarea", "Paragraph 3 in English"]
      ],
      blank: {}
    },

    "page-pesquisa": pageCollection("pesquisa", "página: pesquisa / research"),
    "page-projetos": pageCollection("projetos", "página: projetos / projects"),
    "page-publicacoes": pageCollection("publicacoes", "página: publicações / publications"),
    "page-livros-didaticos": pageCollection("livros-didaticos", "página: livros didáticos / textbooks"),
    "page-sobre": pageCollection("sobre", "página: sobre / about", aboutPhotoFields),
    "page-contato": pageCollection("contato", "página: contato / contact"),
    "page-design": pageCollection("design", "página: design / design"),
    "page-tecnologia-digital": pageCollection("tecnologia-digital", "página: tecnologia digital / digital technology"),
    "page-educacao-linguistica": pageCollection("educacao-linguistica", "página: educação linguística / language education"),
    "page-orientacoes": pageCollection("orientacoes", "página: orientações / supervisions"),

    "paginas": {
      mode: "list",
      path: "content/pages.json",
      root: "items",
      labelField: "title_pt",
      meta: item => `${item.slug_pt || ""} / ${item.slug_en || ""}`,
      fields: pageFields,
      blank: pageCollection("nova-pagina", "nova página / new page").blank
    },


    "orientacoes": {
      mode: "list",
      path: "content/orientacoes.json",
      root: "items",
      labelField: "orientando",
      meta: item => [item.nivel, item.ano_inicio, item.ano_fim].filter(Boolean).join(" · "),
      fields: [
        ["nivel", "select", "Nível", ["mestrado", "doutorado"]],
        ["orientando", "text", "Nome do orientando"],
        ["titulo_pt", "text", "Título em português"],
        ["link_pt", "text", "Hiperlink do título em português"],
        ["titulo_en", "text", "Título em inglês"],
        ["link_en", "text", "Hiperlink do título em inglês"],
        ["ano_inicio", "text", "Ano de início"],
        ["ano_fim", "text", "Ano de conclusão"],
        ["visivel", "checkbox", "Visível no site"],
        ["ordem", "number", "Ordem"]
      ],
      blank: {
        nivel: "mestrado",
        orientando: "",
        titulo_pt: "",
        link_pt: "",
        titulo_en: "",
        link_en: "",
        ano_inicio: "",
        ano_fim: "",
        visivel: true,
        ordem: 999
      }
    },

    "artigos": {
      mode: "filtered-list",
      path: "content/publicacoes.json",
      root: "items",
      fixed: { tipo: "artigo" },
      labelField: "titulo",
      meta: item => ["artigo", item.ano].filter(Boolean).join(" · "),
      fields: publicationFields,
      sortRecent: true,
      blank: { tipo: "artigo", ano: "", titulo: "", autores: "", veiculo: "", link: "#", visivel: true, destaque: false, ordem: 0 }
    },
    "capitulos": {
      mode: "filtered-list",
      path: "content/publicacoes.json",
      root: "items",
      fixed: { tipo: "capitulo" },
      labelField: "titulo",
      meta: item => ["capítulo", item.ano].filter(Boolean).join(" · "),
      fields: publicationFields,
      sortRecent: true,
      blank: { tipo: "capitulo", ano: "", titulo: "", autores: "", veiculo: "", link: "#", visivel: true, destaque: false, ordem: 0 }
    },
    "livros-academicos": {
      mode: "filtered-list",
      path: "content/publicacoes.json",
      root: "items",
      fixed: { tipo: "livro_academico" },
      labelField: "titulo",
      meta: item => ["livro acadêmico", item.ano].filter(Boolean).join(" · "),
      fields: academicBookFields,
      sortRecent: true,
      blank: { tipo: "livro_academico", ano: "", titulo: "", autores: "", veiculo: "", link: "#", imagem: "", visivel: true, destaque: false, ordem: 0 }
    },
    "projetos": {
      mode: "list",
      path: "content/projetos.json",
      root: "items",
      labelField: "titulo",
      minItems: 10,
      emptyLabel: "seção disponível",
      meta: item => [projectPeriod(item), item.idioma].filter(Boolean).join(" · "),
      fields: [
        ["idioma", "select", "Idioma", ["pt", "en"]],
        ["titulo", "text", "Título"],
        ["descricao", "textarea", "Descrição"],
        ["ano_inicio", "text", "Ano de início"],
        ["ano_fim", "text", "Ano de término"],
        ["parceiros", "text", "Parceiros"],
        ["link", "text", "Hiperlink externo"],
        ["visivel", "checkbox", "Visível no site"],
        ["destaque", "checkbox", "Destaque"],
        ["ordem", "number", "Ordem"]
      ],
      blank: { idioma: "pt", titulo: "", descricao: "", ano_inicio: "", ano_fim: "", periodo: "", parceiros: "", link: "#", visivel: true, destaque: false, ordem: 999 }
    },
    "livros-didaticos": {
      mode: "list",
      path: "content/livros-didaticos.json",
      root: "items",
      labelField: "titulo",
      meta: item => [item.editora, item.ano].filter(Boolean).join(" · "),
      singleAcrossLanguages: true,
      fields: [
        ["titulo", "text", "Título"],
        ["editora", "text", "Editora"],
        ["ano", "text", "Ano"],
        ["nivel", "text", "Nível"],
        ["descricao_pt", "textarea", "Descrição em português"],
        ["descricao_en", "textarea", "Descrição em inglês"],
        ["link", "text", "Hiperlink externo"],
        ["imagem", "text", "URL da imagem"],

        ["botao1_label", "text", "Botão 1 — texto"],
        ["botao1_url", "text", "Botão 1 — link de download"],
        ["botao2_label", "text", "Botão 2 — texto"],
        ["botao2_url", "text", "Botão 2 — link de download"],
        ["botao3_label", "text", "Botão 3 — texto"],
        ["botao3_url", "text", "Botão 3 — link de download"],
        ["botao4_label", "text", "Botão 4 — texto"],
        ["botao4_url", "text", "Botão 4 — link de download"],
        ["botao5_label", "text", "Botão 5 — texto"],
        ["botao5_url", "text", "Botão 5 — link de download"],
        ["botao6_label", "text", "Botão 6 — texto"],
        ["botao6_url", "text", "Botão 6 — link de download"],

        ["visivel", "checkbox", "Visível no site"],
        ["destaque", "checkbox", "Destaque"],
        ["ordem", "number", "Ordem"]
      ],
      blank: {
        titulo: "",
        editora: "",
        ano: "",
        nivel: "",
        descricao: "",
        descricao_pt: "",
        descricao_en: "",
        link: "#",
        imagem: "",
        botao1_label: "",
        botao1_url: "",
        botao2_label: "",
        botao2_url: "",
        botao3_label: "",
        botao3_url: "",
        botao4_label: "",
        botao4_url: "",
        botao5_label: "",
        botao5_url: "",
        botao6_label: "",
        botao6_url: "",
        visivel: true,
        destaque: false,
        ordem: 999
      }
    },
    "links": {
      mode: "list",
      path: "content/links.json",
      root: "items",
      labelField: "nome_pt",
      meta: item => item.link || "",
      bilingualLinks: true,
      fields: [
        ["nome_pt", "text", "Texto do hiperlink em português"],
        ["nome_en", "text", "Texto do hiperlink em inglês"],
        ["tipo_pt", "text", "Descrição em português"],
        ["tipo_en", "text", "Descrição em inglês"],
        ["link", "text", "URL do hiperlink — compartilhada entre PT e EN"],
        ["visivel", "checkbox", "Visível no contato e no rodapé"],
        ["ordem", "number", "Ordem"]
      ],
      blank: {
        nome_pt: "",
        nome_en: "",
        tipo_pt: "",
        tipo_en: "",
        link: "#",
        visivel: true,
        ordem: 999
      }
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
    if (config.fixed) {
      for (const [key, value] of Object.entries(config.fixed)) {
        if (item[key] !== value) return false;
      }
    }
    return true;
  }

  function homeToForm(data) {
    const pt = data.pt || {};
    const en = data.en || {};
    const kpt = pt.keywords || [];
    const ken = en.keywords || [];
    return {
      keyword1_pt: kpt[0]?.label || "design.",
      keyword1_en: ken[0]?.label || "design.",
      keyword1_url_pt: kpt[0]?.slug || "design",
      keyword1_url_en: ken[0]?.slug || "design",
      keyword2_pt: kpt[1]?.label || "tecnologia digital.",
      keyword2_en: ken[1]?.label || "digital technology.",
      keyword2_url_pt: kpt[1]?.slug || "tecnologia-digital",
      keyword2_url_en: ken[1]?.slug || "digital-technology",
      keyword3_pt: kpt[2]?.label || "educação linguística.",
      keyword3_en: ken[2]?.label || "language education.",
      keyword3_url_pt: kpt[2]?.slug || "educacao-linguistica",
      keyword3_url_en: ken[2]?.slug || "language-education",
      intro1_pt: pt.intro?.[0] || "",
      intro1_en: en.intro?.[0] || "",
      intro2_pt: pt.intro?.[1] || "",
      intro2_en: en.intro?.[1] || "",
      intro3_pt: pt.intro?.[2] || "",
      intro3_en: en.intro?.[2] || ""
    };
  }

  function formToHome(form) {
    return {
      pt: {
        keywords: [
          { slug: form.elements["keyword1_url_pt"].value, label: form.elements["keyword1_pt"].value },
          { slug: form.elements["keyword2_url_pt"].value, label: form.elements["keyword2_pt"].value },
          { slug: form.elements["keyword3_url_pt"].value, label: form.elements["keyword3_pt"].value }
        ],
        intro: [form.elements["intro1_pt"].value, form.elements["intro2_pt"].value, form.elements["intro3_pt"].value].filter(Boolean)
      },
      en: {
        keywords: [
          { slug: form.elements["keyword1_url_en"].value, label: form.elements["keyword1_en"].value },
          { slug: form.elements["keyword2_url_en"].value, label: form.elements["keyword2_en"].value },
          { slug: form.elements["keyword3_url_en"].value, label: form.elements["keyword3_en"].value }
        ],
        intro: [form.elements["intro1_en"].value, form.elements["intro2_en"].value, form.elements["intro3_en"].value].filter(Boolean)
      }
    };
  }


  function normalizeBilingualLinks(data) {
    const source = Array.isArray(data && data.items) ? data.items : [];
    const merged = new Map();

    source.forEach((item, index) => {
      // Entries already in the bilingual format are kept as they are.
      if (
        Object.prototype.hasOwnProperty.call(item, "nome_pt") ||
        Object.prototype.hasOwnProperty.call(item, "nome_en") ||
        Object.prototype.hasOwnProperty.call(item, "tipo_pt") ||
        Object.prototype.hasOwnProperty.call(item, "tipo_en")
      ) {
        const key = String(item.link || `__item_${index}`).trim().toLowerCase();
        const existing = merged.get(key) || {
          nome_pt: "",
          nome_en: "",
          tipo_pt: "",
          tipo_en: "",
          link: item.link || "#",
          visivel: item.visivel !== false,
          ordem: Number(item.ordem || 999)
        };

        existing.nome_pt = item.nome_pt || existing.nome_pt;
        existing.nome_en = item.nome_en || existing.nome_en;
        existing.tipo_pt = item.tipo_pt || existing.tipo_pt;
        existing.tipo_en = item.tipo_en || existing.tipo_en;
        existing.link = item.link || existing.link;
        existing.visivel = item.visivel !== false;
        existing.ordem = Math.min(Number(existing.ordem || 999), Number(item.ordem || 999));
        merged.set(key, existing);
        return;
      }

      // Legacy entries, formerly separated by idioma, are paired by URL.
      const key = String(item.link || `__legacy_${index}`).trim().toLowerCase();
      const existing = merged.get(key) || {
        nome_pt: "",
        nome_en: "",
        tipo_pt: "",
        tipo_en: "",
        link: item.link || "#",
        visivel: item.visivel !== false,
        ordem: Number(item.ordem || 999)
      };

      const lang = item.idioma === "en" ? "en" : "pt";
      existing[`nome_${lang}`] = item.nome || existing[`nome_${lang}`];
      existing[`tipo_${lang}`] = item.tipo || existing[`tipo_${lang}`];
      existing.link = item.link || existing.link;
      existing.visivel = existing.visivel && item.visivel !== false;
      existing.ordem = Math.min(Number(existing.ordem || 999), Number(item.ordem || 999));
      merged.set(key, existing);
    });

    return { items: Array.from(merged.values()) };
  }

  function projectPeriod(item) {
    const start = String(item && item.ano_inicio || "").trim();
    const end = String(item && item.ano_fim || "").trim();
    if (start && end) return `${start}–${end}`;
    if (start) return `${start}–`;
    if (end) return end;
    return String(item && item.periodo || "").trim();
  }

  function ensureMinimumItems(config) {
    const minimum = Number(config.minItems || 0);
    if (!minimum) return;
    const items = getAllItems(config);
    while (items.length < minimum) {
      const item = JSON.parse(JSON.stringify(config.blank));
      item.ordem = items.length + 1;
      items.push(item);
    }
  }

  async function loadCollection(preferLabel = "") {
    currentCollection = $("collectionSelect").value;
    const config = collections[currentCollection];
    setStatus("Carregando conteúdo do GitHub...");

    const file = await githubRequest(apiURL(config.path));
    currentSha = file.sha;
    currentData = JSON.parse(decodeBase64Unicode(file.content));

    if (config.bilingualLinks) {
      currentData = normalizeBilingualLinks(currentData);
    }

    if (["object-singleton", "home-bilingual"].includes(config.mode)) {
      if (config.mode === "object-singleton" && !currentData[config.key]) currentData[config.key] = { ...config.blank };
      currentActualIndex = 0;
      renderList();
      renderEditor();
      setStatus("Conteúdo carregado com a versão mais recente do GitHub.");
      return;
    }

    if (config.mode === "page-singleton") {
      if (!Array.isArray(currentData[config.root])) currentData[config.root] = [];
      let index = currentData[config.root].findIndex((item) => item.id === config.pageId);
      if (index < 0) {
        currentData[config.root].push({ ...config.blank });
        index = currentData[config.root].length - 1;
      }
      currentActualIndex = index;
      renderList();
      renderEditor();
      setStatus("Página carregada com a versão mais recente do GitHub.");
      return;
    }

    if (config.mode !== "menu" && !Array.isArray(currentData[config.root])) currentData[config.root] = [];

    ensureMinimumItems(config);
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
        if (config.sortRecent) {
          const yearA = Number(a.item.ano || 0);
          const yearB = Number(b.item.ano || 0);
          if (yearA !== yearB) return yearB - yearA;

          const recentA = Number(a.item.ordem || 0);
          const recentB = Number(b.item.ordem || 0);
          if (recentA !== recentB) return recentB - recentA;
        }

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

    if (["object-singleton", "home-bilingual"].includes(config.mode)) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "item-button active";
      btn.innerHTML = `<span class="item-title">${escapeHTML(config.label)}</span><span class="item-meta">conteúdo único bilíngue</span>`;
      list.appendChild(btn);
      return;
    }

    if (config.mode === "page-singleton") {
      const item = getCurrentItem();
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "item-button active";
      btn.innerHTML = `<span class="item-title">${escapeHTML(config.label)}</span><span class="item-meta">${escapeHTML(item?.slug_pt || "")} / ${escapeHTML(item?.slug_en || "")}</span>`;
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

    visibleRows.forEach(({ item, actualIndex }, visibleIndex) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "item-button" + (actualIndex === currentActualIndex ? " active" : "");
      const fallbackLabel = config.emptyLabel ? `${config.emptyLabel} ${visibleIndex + 1}` : "(sem título)";
      btn.innerHTML = `<span class="item-title">${escapeHTML(item[config.labelField] || fallbackLabel)}</span><span class="item-meta">${escapeHTML(config.meta ? config.meta(item) : "")}</span>`;
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

    if (config.mode === "object-singleton") return currentData[config.key] || config.blank;
    if (config.mode === "home-bilingual") return homeToForm(currentData);
    if (config.mode === "page-singleton") {
      const items = getAllItems(config);
      return currentActualIndex !== null ? items[currentActualIndex] : null;
    }

    const items = getAllItems(config);
    return currentActualIndex !== null ? items[currentActualIndex] : null;
  }


  function safeFileName(name) {
    return String(name || "capa")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9._-]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  }

  function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = String(reader.result || "");
        resolve(result.includes(",") ? result.split(",")[1] : result);
      };
      reader.onerror = () => reject(new Error("Não foi possível ler a imagem selecionada."));
      reader.readAsDataURL(file);
    });
  }

  async function uploadImageToGitHub(file, folder = "livros-academicos") {
    if (!file) return "";

    if (!file.type.startsWith("image/")) {
      throw new Error("Selecione um arquivo de imagem.");
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new Error("A imagem deve ter no máximo 5 MB.");
    }

    const extension = (file.name.split(".").pop() || "jpg").toLowerCase();
    const baseName = safeFileName(file.name.replace(/\.[^.]+$/, "")) || "capa";
    const fileName = `${Date.now()}-${baseName}.${extension}`;
    const repoPath = `assets/uploads/${folder}/${fileName}`;
    const content = await fileToBase64(file);

    setStatus("Enviando a capa para o GitHub...");

    await githubRequest(`https://api.github.com/repos/${OWNER}/${REPO}/contents/${repoPath}`, {
      method: "PUT",
      body: JSON.stringify({
        message: `Adiciona capa de livro acadêmico: ${fileName}`,
        content,
        branch: BRANCH
      })
    });

    return `/${repoPath}`;
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
      p.textContent = config.sortRecent
        ? `Categoria: ${fixedLabel}. Cadastre apenas uma vez; aparecerá em PT e EN.`
        : `Categoria: ${fixedLabel}`;
      form.appendChild(p);
    }

    if (config.singleAcrossLanguages) {
      const p = document.createElement("p");
      p.className = "hint";
      p.textContent = "Cadastre a coleção uma única vez. Use descrição em português e descrição em inglês para adaptar o texto em cada versão.";
      form.appendChild(p);
    }

    if (config.bilingualLinks) {
      const p = document.createElement("p");
      p.className = "hint";
      p.textContent = "Cadastre cada link uma única vez. O mesmo endereço aparecerá no contato e no rodapé, com textos em português e inglês.";
      form.appendChild(p);
    }

    if (currentCollection === "projetos") {
      const p = document.createElement("p");
      p.className = "hint";
      p.textContent = "Há 10 seções disponíveis. Preencha o título, escolha o idioma e informe os anos. Se o projeto estiver em andamento, deixe o ano de término vazio.";
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

    if (config.mode === "page-singleton" || config.mode === "home-bilingual") {
      const p = document.createElement("p");
      p.className = "hint";
      p.textContent = "Esta é uma entrada única com campos em português e inglês.";
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

      if (type === "image-upload") {
        const wrapper = document.createElement("div");
        wrapper.className = "image-upload-field";

        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.name = `${name}_file`;
        fileInput.accept = "image/png,image/jpeg,image/webp";

        const currentInput = document.createElement("input");
        currentInput.type = "hidden";
        currentInput.name = name;
        currentInput.value = item[name] || "";

        const preview = document.createElement("div");
        preview.className = "image-upload-preview";
        if (item[name]) {
          preview.innerHTML = `<img src="${escapeHTML(item[name])}" alt="${name === "foto" ? "Foto atual" : "Capa atual"}"><span>${name === "foto" ? "Foto atual" : "Capa atual"}</span>`;
        } else {
          preview.innerHTML = `<span>${name === "foto" ? "Nenhuma foto enviada." : "Nenhuma capa enviada."}</span>`;
        }

        fileInput.addEventListener("change", () => {
          const file = fileInput.files && fileInput.files[0];
          if (!file) return;
          const localURL = URL.createObjectURL(file);
          preview.innerHTML = `<img src="${localURL}" alt="${name === "foto" ? "Pré-visualização da foto" : "Pré-visualização da capa"}"><span>${name === "foto" ? "Nova foto selecionada" : "Nova capa selecionada"}</span>`;
        });

        const removeButton = document.createElement("button");
        removeButton.type = "button";
        removeButton.className = "secondary small-button";
        removeButton.textContent = name === "foto" ? "remover foto" : "remover capa";
        removeButton.addEventListener("click", () => {
          currentInput.value = "";
          fileInput.value = "";
          preview.innerHTML = `<span>${name === "foto" ? "Foto removida" : "Capa removida"}. Publique a alteração para confirmar.</span>`;
        });

        wrapper.appendChild(fileInput);
        wrapper.appendChild(currentInput);
        wrapper.appendChild(preview);
        wrapper.appendChild(removeButton);
        labelEl.appendChild(wrapper);
        form.appendChild(labelEl);
        return;
      } else if (type === "textarea") {
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

    if (config.mode === "home-bilingual") {
      return formToHome(form);
    }

    const values = config.fixed ? { ...config.fixed } : {};
    config.fields.forEach(([name, type]) => {
      const input = form.elements[name];
      if (!input) return;
      if (type === "checkbox") values[name] = Boolean(input.checked);
      else if (type === "number") values[name] = input.value === "" ? "" : Number(input.value);
      else if (type === "image-upload") values[name] = input.value || "";
      else values[name] = input.value;
    });

    if (config.sortRecent && !values.ordem) {
      values.ordem = Date.now();
    }

    return values;
  }

  async function saveCurrent() {
    const config = collections[currentCollection];
    if (!currentData) await loadCollection();

    if (config.mode === "home-bilingual") {
      currentData = collectEditorValues();
      await saveFile(`Atualiza ${currentCollection}`, config.label);
      return;
    }

    if (config.mode === "object-singleton") {
      currentData[config.key] = collectEditorValues();
      await saveFile(`Atualiza ${currentCollection}`, config.label);
      return;
    }

    const items = getAllItems(config);
    if (currentActualIndex === null || !items[currentActualIndex]) throw new Error("Nenhum item selecionado.");

    const oldLabel = items[currentActualIndex][config.labelField] || "";
    const values = collectEditorValues();

    if (currentCollection === "livros-academicos") {
      const fileInput = $("editorForm").elements["imagem_file"];
      const selectedFile = fileInput && fileInput.files ? fileInput.files[0] : null;
      if (selectedFile) {
        values.imagem = await uploadImageToGitHub(selectedFile, "livros-academicos");
      }
    }

    if (currentCollection === "page-sobre") {
      const photoInput = $("editorForm").elements["foto_file"];
      const selectedPhoto = photoInput && photoInput.files ? photoInput.files[0] : null;
      if (selectedPhoto) {
        values.foto = await uploadImageToGitHub(selectedPhoto, "sobre");
      }
    }

    const mergedValues = { ...items[currentActualIndex], ...values };
    if (currentCollection === "projetos") {
      mergedValues.periodo = projectPeriod(mergedValues);
    }
    items[currentActualIndex] = mergedValues;
    await saveFile(`Atualiza ${currentCollection}`, mergedValues[config.labelField] || oldLabel);
  }

  async function saveFile(message, preferLabel = "") {
    const config = collections[currentCollection];
    setStatus("Conferindo versão mais recente no GitHub...");

    try {
      const latestFile = await githubRequest(apiURL(config.path));
      if (latestFile && latestFile.sha) currentSha = latestFile.sha;
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
    if (["object-singleton", "home-bilingual", "page-singleton"].includes(config.mode)) {
      setStatus("Este é um conteúdo único. Edite os campos e clique em publicar alteração.");
      return;
    }
    const items = getAllItems(config);
    const newItem = JSON.parse(JSON.stringify(config.blank));

    if (config.sortRecent) {
      newItem.ano = String(new Date().getFullYear());
      newItem.ordem = Date.now();
    }

    items.push(newItem);
    currentActualIndex = items.length - 1;
    renderList();
    renderEditor();
    setStatus("Novo item criado. Preencha os campos e clique em publicar alteração.");
  }

  async function deleteItem() {
    const config = collections[currentCollection];
    if (["object-singleton", "home-bilingual", "page-singleton"].includes(config.mode)) {
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