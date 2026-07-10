(function () {
  const OWNER = "ronaldogomesjr";
  const REPO = "ronaldogomesjr-site";
  const BRANCH = "main";
  const TOKEN_KEY = "rgjr_site_github_token";
  let memoryToken = "";

  function setTokenStatus(message, isError = false) {
    const element = document.getElementById("tokenStatus");
    if (!element) return;
    element.textContent = message;
    element.classList.toggle("error", Boolean(isError));
  }

  function readStoredToken() {
    try {
      const token = window.localStorage.getItem(TOKEN_KEY);
      if (token) return { token, storage: "local" };
    } catch (_) {}

    try {
      const token = window.sessionStorage.getItem(TOKEN_KEY);
      if (token) return { token, storage: "session" };
    } catch (_) {}

    return memoryToken ? { token: memoryToken, storage: "memory" } : { token: "", storage: "none" };
  }

  function storeToken(token) {
    memoryToken = token;

    try {
      window.localStorage.setItem(TOKEN_KEY, token);
      if (window.localStorage.getItem(TOKEN_KEY) === token) {
        try { window.sessionStorage.removeItem(TOKEN_KEY); } catch (_) {}
        return "local";
      }
    } catch (_) {}

    try {
      window.sessionStorage.setItem(TOKEN_KEY, token);
      if (window.sessionStorage.getItem(TOKEN_KEY) === token) return "session";
    } catch (_) {}

    return "memory";
  }

  function removeStoredToken() {
    memoryToken = "";
    try { window.localStorage.removeItem(TOKEN_KEY); } catch (_) {}
    try { window.sessionStorage.removeItem(TOKEN_KEY); } catch (_) {}
  }

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

  const publicationPageFields = [
    ["title_pt", "text", "Título da página em português"],
    ["title_en", "text", "Page title in English"],
    ["intro_pt", "textarea", "Descrição abaixo do título em português"],
    ["intro_en", "textarea", "Description below the title in English"],
    ["meta_title_pt", "text", "Título SEO em português"],
    ["meta_title_en", "text", "SEO title in English"],
    ["meta_description_pt", "textarea", "Descrição SEO em português"],
    ["meta_description_en", "textarea", "SEO description in English"]
  ];

  function publicationPageCollection(pageId, label, defaults) {
    return {
      mode: "object-singleton",
      path: "content/publication-pages.json",
      key: pageId,
      label,
      fields: publicationPageFields,
      singletonHint: "Esta é uma página bilíngue. Os textos em português e em inglês são salvos juntos.",
      blank: {
        title_pt: defaults.title_pt,
        title_en: defaults.title_en,
        intro_pt: defaults.intro_pt,
        intro_en: defaults.intro_en,
        meta_title_pt: "",
        meta_title_en: "",
        meta_description_pt: "",
        meta_description_en: ""
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
    "page-artigos": publicationPageCollection("artigos", "página: artigos / journal articles", {
      slug_pt: "artigos",
      slug_en: "journal-articles",
      title_pt: "artigos",
      title_en: "journal articles",
      intro_pt: "Artigos publicados em periódicos acadêmicos.",
      intro_en: "Articles published in academic journals.",
      ordem: 21
    }),
    "page-capitulos": publicationPageCollection("capitulos", "página: capítulos / book chapters", {
      slug_pt: "capitulos",
      slug_en: "book-chapters",
      title_pt: "capítulos",
      title_en: "book chapters",
      intro_pt: "Capítulos publicados em livros acadêmicos e coletâneas.",
      intro_en: "Chapters published in academic books and edited collections.",
      ordem: 22
    }),
    "page-livros-academicos": publicationPageCollection("livros-academicos", "página: livros acadêmicos / academic books", {
      slug_pt: "livros-academicos",
      slug_en: "academic-books",
      title_pt: "livros acadêmicos",
      title_en: "academic books",
      intro_pt: "Livros acadêmicos e obras organizadas.",
      intro_en: "Academic books and edited volumes.",
      ordem: 23
    }),
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


    "grupos-pesquisa": {
      mode: "list",
      path: "content/research-groups.json",
      root: "items",
      labelField: "nome_pt",
      label: item => item.nome_pt || item.nome_en || "grupo de pesquisa",
      meta: item => [item.nome_en, item.link].filter(Boolean).join(" · "),
      fields: [
        ["nome_pt", "text", "Nome do grupo em português"],
        ["nome_en", "text", "Research group name in English"],
        ["descricao_pt", "textarea", "Descrição do grupo em português"],
        ["descricao_en", "textarea", "Research group description in English"],
        ["link", "text", "Hiperlink para o site do grupo"],
        ["visivel", "checkbox", "Visível nas duas versões do site"],
        ["ordem", "number", "Ordem"]
      ],
      blank: {
        nome_pt: "",
        nome_en: "",
        descricao_pt: "",
        descricao_en: "",
        link: "",
        visivel: true,
        ordem: 999
      }
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
      labelField: "titulo_pt",
      bilingualProjects: true,
      minItems: 10,
      emptyLabel: "seção disponível",
      label: item => item.titulo_pt || item.titulo_en || "",
      meta: item => [projectPeriod(item), item.titulo_en].filter(Boolean).join(" · "),
      fields: [
        ["titulo_pt", "text", "Título em português"],
        ["titulo_en", "text", "Título em inglês"],
        ["descricao_pt", "textarea", "Descrição em português"],
        ["descricao_en", "textarea", "Descrição em inglês"],
        ["ano_inicio", "text", "Ano de início — compartilhado"],
        ["ano_fim", "text", "Ano de término — compartilhado"],
        ["parceiros_pt", "text", "Parceiros / instituições em português"],
        ["parceiros_en", "text", "Partners / institutions in English"],
        ["link_pt", "text", "Hiperlink da versão em português"],
        ["link_en", "text", "Hiperlink da versão em inglês"],
        ["visivel", "checkbox", "Visível nas duas versões do site"],
        ["destaque", "checkbox", "Destaque"],
        ["ordem", "number", "Ordem"]
      ],
      blank: {
        titulo_pt: "",
        titulo_en: "",
        descricao_pt: "",
        descricao_en: "",
        ano_inicio: "",
        ano_fim: "",
        periodo: "",
        parceiros_pt: "",
        parceiros_en: "",
        link_pt: "#",
        link_en: "#",
        visivel: false,
        destaque: false,
        ordem: 999
      }
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
        ["nome_pt", "text", "Nome do item em português"],
        ["nome_en", "text", "Nome do item em inglês"],
        ["descricao_pt", "textarea", "Descrição em português"],
        ["descricao_en", "textarea", "Descrição em inglês"],
        ["tipo_pt", "text", "Texto do hiperlink em português"],
        ["tipo_en", "text", "Texto do hiperlink em inglês"],
        ["link", "text", "URL do hiperlink — compartilhada entre PT e EN"],
        ["visivel", "checkbox", "Visível no contato e no rodapé"],
        ["ordem", "number", "Ordem"]
      ],
      blank: {
        nome_pt: "",
        nome_en: "",
        descricao_pt: "",
        descricao_en: "",
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
    const typedToken = $("tokenInput").value.trim();
    if (typedToken) return typedToken;
    return readStoredToken().token;
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
          descricao_pt: "",
          descricao_en: "",
          tipo_pt: "",
          tipo_en: "",
          link: item.link || "#",
          visivel: item.visivel !== false,
          ordem: Number(item.ordem || 999)
        };

        existing.nome_pt = item.nome_pt || existing.nome_pt;
        existing.nome_en = item.nome_en || existing.nome_en;
        existing.descricao_pt = item.descricao_pt ?? (item.idioma !== "en" ? item.descricao : undefined) ?? existing.descricao_pt;
        existing.descricao_en = item.descricao_en ?? (item.idioma === "en" ? item.descricao : undefined) ?? existing.descricao_en;
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
        descricao_pt: "",
        descricao_en: "",
        tipo_pt: "",
        tipo_en: "",
        link: item.link || "#",
        visivel: item.visivel !== false,
        ordem: Number(item.ordem || 999)
      };

      const lang = item.idioma === "en" ? "en" : "pt";
      existing[`nome_${lang}`] = item.nome || existing[`nome_${lang}`];
      existing[`descricao_${lang}`] = item[`descricao_${lang}`] ?? item.descricao ?? existing[`descricao_${lang}`];
      existing[`tipo_${lang}`] = item.tipo || existing[`tipo_${lang}`];
      existing.link = item.link || existing.link;
      existing.visivel = existing.visivel && item.visivel !== false;
      existing.ordem = Math.min(Number(existing.ordem || 999), Number(item.ordem || 999));
      merged.set(key, existing);
    });

    return { items: Array.from(merged.values()) };
  }

  function firstProjectLink(...values) {
    const found = values.find((value) => {
      const link = String(value || "").trim();
      return link && link !== "#";
    });
    return found ? String(found).trim() : "#";
  }

  function parseProjectPeriod(item) {
    const directStart = String(item && item.ano_inicio || "").trim();
    const directEnd = String(item && item.ano_fim || "").trim();
    if (directStart || directEnd) return { start: directStart, end: directEnd };

    const period = String(item && item.periodo || "").trim();
    if (!period) return { start: "", end: "" };

    const normalized = period.replace(/[—-]/g, "–");
    const range = normalized.match(/^(\d{4})\s*–\s*(\d{4})?$/);
    if (range) return { start: range[1] || "", end: range[2] || "" };

    const single = normalized.match(/^(\d{4})$/);
    if (single) return { start: single[1], end: single[1] };
    return { start: "", end: "" };
  }

  function normalizeProjectItem(item) {
    const period = parseProjectPeriod(item);
    const hasBilingualFields = [
      "titulo_pt", "titulo_en", "descricao_pt", "descricao_en",
      "parceiros_pt", "parceiros_en", "link_pt", "link_en"
    ].some((key) => Object.prototype.hasOwnProperty.call(item || {}, key));

    if (hasBilingualFields) {
      return {
        titulo_pt: item.titulo_pt || (item.idioma !== "en" ? item.titulo || "" : ""),
        titulo_en: item.titulo_en || (item.idioma === "en" ? item.titulo || "" : ""),
        descricao_pt: item.descricao_pt || (item.idioma !== "en" ? item.descricao || "" : ""),
        descricao_en: item.descricao_en || (item.idioma === "en" ? item.descricao || "" : ""),
        ano_inicio: item.ano_inicio || period.start,
        ano_fim: item.ano_fim || period.end,
        periodo: item.periodo || "",
        parceiros_pt: item.parceiros_pt || (item.idioma !== "en" ? item.parceiros || "" : ""),
        parceiros_en: item.parceiros_en || (item.idioma === "en" ? item.parceiros || "" : ""),
        link_pt: firstProjectLink(item.link_pt, item.idioma !== "en" ? item.link : ""),
        link_en: firstProjectLink(item.link_en, item.idioma === "en" ? item.link : ""),
        visivel: item.visivel !== false,
        destaque: Boolean(item.destaque),
        ordem: Number(item.ordem || 999)
      };
    }

    const lang = item && item.idioma === "en" ? "en" : "pt";
    return {
      titulo_pt: lang === "pt" ? item.titulo || "" : "",
      titulo_en: lang === "en" ? item.titulo || "" : "",
      descricao_pt: lang === "pt" ? item.descricao || "" : "",
      descricao_en: lang === "en" ? item.descricao || "" : "",
      ano_inicio: period.start,
      ano_fim: period.end,
      periodo: item.periodo || "",
      parceiros_pt: lang === "pt" ? item.parceiros || "" : "",
      parceiros_en: lang === "en" ? item.parceiros || "" : "",
      link_pt: lang === "pt" ? item.link || "#" : "#",
      link_en: lang === "en" ? item.link || "#" : "#",
      visivel: item.visivel !== false,
      destaque: Boolean(item.destaque),
      ordem: Number(item.ordem || 999)
    };
  }

  function normalizeBilingualProjects(data) {
    const source = Array.isArray(data && data.items) ? data.items : [];
    const ready = [];
    const legacyPt = [];
    const legacyEn = [];

    source.forEach((item, index) => {
      const hasBilingualFields = [
        "titulo_pt", "titulo_en", "descricao_pt", "descricao_en",
        "parceiros_pt", "parceiros_en", "link_pt", "link_en"
      ].some((key) => Object.prototype.hasOwnProperty.call(item || {}, key));

      if (hasBilingualFields) {
        ready.push({ item: normalizeProjectItem(item), index });
      } else if (item && item.idioma === "en") {
        legacyEn.push({ item, index });
      } else {
        legacyPt.push({ item, index });
      }
    });

    const byOrder = (a, b) => {
      const orderA = Number(a.item.ordem || 9999);
      const orderB = Number(b.item.ordem || 9999);
      return orderA === orderB ? a.index - b.index : orderA - orderB;
    };
    legacyPt.sort(byOrder);
    legacyEn.sort(byOrder);

    const usedEn = new Set();
    const pairs = [];

    legacyPt.forEach((ptEntry) => {
      const ptLink = String(ptEntry.item.link || "").trim().toLowerCase();
      let enIndex = -1;

      if (ptLink && ptLink !== "#") {
        enIndex = legacyEn.findIndex((entry, index) => !usedEn.has(index) && String(entry.item.link || "").trim().toLowerCase() === ptLink);
      }
      if (enIndex < 0) {
        enIndex = legacyEn.findIndex((entry, index) => !usedEn.has(index));
      }

      const enEntry = enIndex >= 0 ? legacyEn[enIndex] : null;
      if (enEntry) usedEn.add(enIndex);
      pairs.push({ pt: ptEntry.item, en: enEntry ? enEntry.item : null, index: ptEntry.index });
    });

    legacyEn.forEach((enEntry, index) => {
      if (!usedEn.has(index)) pairs.push({ pt: null, en: enEntry.item, index: enEntry.index });
    });

    pairs.forEach(({ pt, en, index }) => {
      const ptItem = pt ? normalizeProjectItem(pt) : normalizeProjectItem({ idioma: "pt", visivel: false });
      const enItem = en ? normalizeProjectItem(en) : normalizeProjectItem({ idioma: "en", visivel: false });
      const start = ptItem.ano_inicio || enItem.ano_inicio;
      const end = ptItem.ano_fim || enItem.ano_fim;
      const visibleValues = [pt, en].filter(Boolean).map((entry) => entry.visivel !== false);

      ready.push({
        index,
        item: {
          titulo_pt: ptItem.titulo_pt,
          titulo_en: enItem.titulo_en,
          descricao_pt: ptItem.descricao_pt,
          descricao_en: enItem.descricao_en,
          ano_inicio: start,
          ano_fim: end,
          periodo: projectPeriod({ ano_inicio: start, ano_fim: end, periodo: ptItem.periodo || enItem.periodo }),
          parceiros_pt: ptItem.parceiros_pt,
          parceiros_en: enItem.parceiros_en,
          link_pt: ptItem.link_pt || "#",
          link_en: enItem.link_en || "#",
          visivel: visibleValues.length ? visibleValues.some(Boolean) : false,
          destaque: Boolean(ptItem.destaque || enItem.destaque),
          ordem: Math.min(Number(ptItem.ordem || 999), Number(enItem.ordem || 999))
        }
      });
    });

    ready.sort((a, b) => {
      const orderA = Number(a.item.ordem || 9999);
      const orderB = Number(b.item.ordem || 9999);
      return orderA === orderB ? a.index - b.index : orderA - orderB;
    });

    return { items: ready.map((entry) => entry.item) };
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
    let nextOrder = items.reduce((max, item) => Math.max(max, Number(item.ordem || 0)), 0) + 1;
    while (items.length < minimum) {
      const item = JSON.parse(JSON.stringify(config.blank));
      item.ordem = nextOrder++;
      items.push(item);
    }
  }

  function getItemLabel(config, item) {
    if (!item) return "";
    if (typeof config.label === "function") return config.label(item) || "";
    return item[config.labelField] || "";
  }

  function findPageSingletonIndex(items, config) {
    if (!Array.isArray(items)) return -1;

    // Primeiro, procura pelo identificador exato da página. Isso evita que
    // capítulos ou livros acadêmicos sejam confundidos com outra entrada.
    const exactIdIndex = items.findIndex((item) => item && item.id === config.pageId);
    if (exactIdIndex >= 0) return exactIdIndex;

    // Compatibilidade com versões antigas que tinham apenas os slugs.
    const exactSlugIndex = items.findIndex((item) => item && (
      (config.blank.slug_pt && item.slug_pt === config.blank.slug_pt) ||
      (config.blank.slug_en && item.slug_en === config.blank.slug_en)
    ));
    return exactSlugIndex;
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

    if (config.bilingualProjects) {
      currentData = normalizeBilingualProjects(currentData);
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
      const pageItems = currentData[config.root];
      let index = findPageSingletonIndex(pageItems, config);

      if (index < 0) {
        // A entrada é criada somente na memória. Ela será persistida no GitHub
        // quando o usuário clicar em “publicar alteração”.
        pageItems.push({ ...config.blank });
        index = pageItems.length - 1;
      } else {
        // Normaliza o identificador sem alterar os textos já cadastrados.
        pageItems[index] = {
          ...config.blank,
          ...pageItems[index],
          id: config.pageId,
          slug_pt: pageItems[index].slug_pt || config.blank.slug_pt,
          slug_en: pageItems[index].slug_en || config.blank.slug_en
        };
      }

      currentActualIndex = index;
      renderList();
      renderEditor();
      setStatus("Página carregada. Edite a descrição em PT/EN e clique em publicar alteração.");
      return;
    }

    if (config.mode !== "menu" && !Array.isArray(currentData[config.root])) currentData[config.root] = [];

    ensureMinimumItems(config);
    rebuildVisibleRows();

    if (preferLabel) {
      const found = visibleRows.find(row => getItemLabel(config, row.item) === preferLabel);
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
        return String(getItemLabel(config, a.item)).localeCompare(String(getItemLabel(config, b.item)));
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
      btn.innerHTML = `<span class="item-title">${escapeHTML(getItemLabel(config, item) || fallbackLabel)}</span><span class="item-meta">${escapeHTML(config.meta ? config.meta(item) : "")}</span>`;
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
      p.textContent = "Cadastre cada item uma única vez. Preencha o nome, a descrição e o texto do hiperlink em português e em inglês. A URL é compartilhada; o nome do item também será usado no rodapé.";
      form.appendChild(p);
    }

    if (currentCollection === "projetos") {
      const p = document.createElement("p");
      p.className = "hint";
      p.textContent = "Cada seção corresponde a um único projeto. Preencha, na mesma seção, o título e a descrição em português e em inglês. Os anos, a visibilidade e a ordem são compartilhados pelas duas versões. Há pelo menos 10 seções disponíveis.";
      form.appendChild(p);
    }

    if (config.mode === "object-singleton") {
      const p = document.createElement("p");
      p.className = "hint";
      p.textContent = config.singletonHint || "Aqui você edita o nome/marca e os links do cabeçalho.";
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

    if (config.mode === "page-singleton") {
      if (!Array.isArray(currentData[config.root])) currentData[config.root] = [];

      const pageItems = currentData[config.root];
      const values = collectEditorValues();
      let pageIndex = findPageSingletonIndex(pageItems, config);
      const existing = pageIndex >= 0 ? pageItems[pageIndex] : {};

      const mergedPage = {
        ...config.blank,
        ...existing,
        ...values,
        id: config.pageId,
        slug_pt: existing.slug_pt || config.blank.slug_pt,
        slug_en: existing.slug_en || config.blank.slug_en,
        intro_pt: String(values.intro_pt ?? existing.intro_pt ?? config.blank.intro_pt ?? ""),
        intro_en: String(values.intro_en ?? existing.intro_en ?? config.blank.intro_en ?? "")
      };

      if (pageIndex < 0) {
        pageItems.push(mergedPage);
        pageIndex = pageItems.length - 1;
      } else {
        pageItems[pageIndex] = mergedPage;
      }

      currentActualIndex = pageIndex;
      await saveFile(`Atualiza ${currentCollection}`, config.label);

      // Confirma no conteúdo recarregado que a entrada correta foi persistida.
      const confirmedIndex = findPageSingletonIndex(getAllItems(config), config);
      const confirmedPage = confirmedIndex >= 0 ? getAllItems(config)[confirmedIndex] : null;
      const savedPt = confirmedPage && String(confirmedPage.intro_pt ?? "") === mergedPage.intro_pt;
      const savedEn = confirmedPage && String(confirmedPage.intro_en ?? "") === mergedPage.intro_en;
      if (!savedPt || !savedEn) {
        throw new Error("O GitHub respondeu, mas a descrição não foi confirmada. Recarregue o painel e tente novamente.");
      }

      setStatus(`Descrição de ${config.label} salva em português e inglês.`);
      return;
    }

    const items = getAllItems(config);
    if (currentActualIndex === null || !items[currentActualIndex]) throw new Error("Nenhum item selecionado.");

    const oldLabel = getItemLabel(config, items[currentActualIndex]);
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

    if (currentCollection === "links") {
      // Persist the bilingual contact fields explicitly. This prevents older
      // legacy keys from replacing the descriptions during a reload.
      mergedValues.nome_pt = String(values.nome_pt ?? mergedValues.nome_pt ?? "");
      mergedValues.nome_en = String(values.nome_en ?? mergedValues.nome_en ?? "");
      mergedValues.descricao_pt = String(values.descricao_pt ?? "");
      mergedValues.descricao_en = String(values.descricao_en ?? "");
      mergedValues.tipo_pt = String(values.tipo_pt ?? mergedValues.tipo_pt ?? "");
      mergedValues.tipo_en = String(values.tipo_en ?? mergedValues.tipo_en ?? "");
      mergedValues.link = String(values.link ?? mergedValues.link ?? "#");
      mergedValues.visivel = values.visivel !== false;
      mergedValues.ordem = values.ordem === "" ? 999 : Number(values.ordem ?? mergedValues.ordem ?? 999);

      // Compatibility field for any older renderer still active during deploy.
      mergedValues.descricao = mergedValues.descricao_pt || mergedValues.descricao_en || "";

      delete mergedValues.idioma;
      delete mergedValues.nome;
      delete mergedValues.tipo;
    }

    if (currentCollection === "projetos") {
      mergedValues.periodo = projectPeriod(mergedValues);
      mergedValues.link = firstProjectLink(mergedValues.link_pt, mergedValues.link_en);
      mergedValues.titulo = mergedValues.titulo_pt || mergedValues.titulo_en || "";
      mergedValues.descricao = mergedValues.descricao_pt || mergedValues.descricao_en || "";
      mergedValues.parceiros = mergedValues.parceiros_pt || mergedValues.parceiros_en || "";
      delete mergedValues.idioma;
    }
    items[currentActualIndex] = mergedValues;
    await saveFile(`Atualiza ${currentCollection}`, getItemLabel(config, mergedValues) || oldLabel);
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

  $("saveTokenBtn").addEventListener("click", async event => {
    event.preventDefault();
    const token = $("tokenInput").value.trim();
    if (!token) {
      setTokenStatus("Cole o token antes de salvar.", true);
      setStatus("Cole o token antes de salvar.", true);
      return;
    }

    const storage = storeToken(token);
    const persistenceMessage = storage === "local"
      ? "Token salvo permanentemente neste navegador."
      : storage === "session"
        ? "O navegador bloqueou o armazenamento permanente. O token foi salvo apenas para esta sessão."
        : "O navegador bloqueou o armazenamento local. O token ficará disponível somente enquanto esta página permanecer aberta.";

    setTokenStatus(`${persistenceMessage} Testando acesso ao GitHub...`);
    setStatus("Testando o token no GitHub...");

    try {
      const response = await githubRequest(`https://api.github.com/repos/${OWNER}/${REPO}/contents/content/site.json?ref=${BRANCH}&_=${Date.now()}`);
      if (!response || typeof response !== "object") throw new Error("Resposta inesperada do GitHub.");
      setTokenStatus(`${persistenceMessage} Acesso ao repositório confirmado.`);
      setStatus("Token salvo e acesso ao GitHub confirmado.");
    } catch (error) {
      const message = String(error && error.message ? error.message : error);
      setTokenStatus(`${persistenceMessage} Porém, o GitHub recusou o acesso: ${message}`, true);
      setStatus(`O token foi armazenado, mas não foi validado: ${message}`, true);
    }
  });

  $("forgetTokenBtn").addEventListener("click", event => {
    event.preventDefault();
    removeStoredToken();
    $("tokenInput").value = "";
    setTokenStatus("Token apagado deste navegador.");
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

  const savedTokenInfo = readStoredToken();
  if (savedTokenInfo.token) {
    $("tokenInput").value = savedTokenInfo.token;
    const locationLabel = savedTokenInfo.storage === "local"
      ? "neste navegador"
      : savedTokenInfo.storage === "session"
        ? "nesta sessão"
        : "temporariamente nesta página";
    setTokenStatus(`Token encontrado ${locationLabel}. Clique em “salvar e testar token” para confirmar o acesso.`);
    setStatus("Token encontrado. Escolha um conteúdo e clique em carregar, ou teste o token novamente.");
  } else {
    setTokenStatus("Nenhum token salvo neste endereço do painel.");
  }
})();