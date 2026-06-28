
(function () {
  const OWNER = "ronaldogomesjr";
  const REPO = "ronaldogomesjr-site";
  const BRANCH = "main";
  const TOKEN_KEY = "rgjr_site_github_token";

  const collections = {
    "publicacoes": {
      path: "content/publicacoes.json",
      root: "items",
      labelField: "titulo",
      meta: item => [item.tipo, item.ano, item.idioma].filter(Boolean).join(" · "),
      fields: [
        ["tipo", "select", "Tipo", ["artigo", "capitulo", "livro_academico"]],
        ["idioma", "select", "Idioma", ["pt", "en"]],
        ["ano", "text", "Ano"],
        ["titulo", "text", "Título"],
        ["autores", "text", "Autores"],
        ["veiculo", "text", "Veículo / periódico / livro / editora"],
        ["link", "text", "Link externo"],
        ["visivel", "checkbox", "Visível no site"],
        ["destaque", "checkbox", "Destaque"],
        ["ordem", "number", "Ordem"]
      ],
      blank: { tipo: "artigo", idioma: "pt", ano: "", titulo: "", autores: "", veiculo: "", link: "", visivel: true, destaque: false, ordem: 999 }
    },
    "projetos": {
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
        ["link", "text", "Link externo"],
        ["visivel", "checkbox", "Visível no site"],
        ["destaque", "checkbox", "Destaque"],
        ["ordem", "number", "Ordem"]
      ],
      blank: { idioma: "pt", titulo: "", descricao: "", periodo: "", parceiros: "", link: "", visivel: true, destaque: false, ordem: 999 }
    },
    "livros-didaticos": {
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
        ["link", "text", "Link externo"],
        ["imagem", "text", "URL da imagem"],
        ["visivel", "checkbox", "Visível no site"],
        ["destaque", "checkbox", "Destaque"],
        ["ordem", "number", "Ordem"]
      ],
      blank: { idioma: "pt", titulo: "", editora: "", ano: "", nivel: "", descricao: "", link: "", imagem: "", visivel: true, destaque: false, ordem: 999 }
    },
    "links": {
      path: "content/links.json",
      root: "items",
      labelField: "nome",
      meta: item => [item.tipo, item.idioma].filter(Boolean).join(" · "),
      fields: [
        ["idioma", "select", "Idioma", ["pt", "en"]],
        ["nome", "text", "Nome"],
        ["tipo", "text", "Tipo"],
        ["link", "text", "Link"],
        ["visivel", "checkbox", "Visível no site"],
        ["ordem", "number", "Ordem"]
      ],
      blank: { idioma: "pt", nome: "", tipo: "", link: "", visivel: true, ordem: 999 }
    }
  };

  let currentCollection = "publicacoes";
  let currentData = null;
  let currentSha = null;
  let currentIndex = 0;

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
    return `https://api.github.com/repos/${OWNER}/${REPO}/contents/${path}?ref=${BRANCH}`;
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
    try { data = text ? JSON.parse(text) : null; } catch (e) { data = text; }

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

  async function loadCollection() {
    currentCollection = $("collectionSelect").value;
    const config = collections[currentCollection];
    setStatus("Carregando conteúdo do GitHub...");

    const file = await githubRequest(apiURL(config.path));
    currentSha = file.sha;
    currentData = JSON.parse(decodeBase64Unicode(file.content));

    if (!Array.isArray(currentData[config.root])) {
      currentData[config.root] = [];
    }

    currentIndex = 0;
    renderList();
    renderEditor();
    setStatus("Conteúdo carregado.");
  }

  function renderList() {
    const list = $("itemList");
    const config = collections[currentCollection];
    const items = currentData ? currentData[config.root] : [];

    list.innerHTML = "";

    if (!items.length) {
      list.innerHTML = "<p class='hint'>Nenhum item cadastrado.</p>";
      return;
    }

    items.forEach((item, index) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "item-button" + (index === currentIndex ? " active" : "");
      btn.innerHTML = `
        <span class="item-title">${escapeHTML(item[config.labelField] || "(sem título)")}</span>
        <span class="item-meta">${escapeHTML(config.meta(item))}</span>
      `;
      btn.addEventListener("click", () => {
        currentIndex = index;
        renderList();
        renderEditor();
      });
      list.appendChild(btn);
    });
  }

  function renderEditor() {
    const form = $("editorForm");
    const config = collections[currentCollection];
    const items = currentData ? currentData[config.root] : [];
    const item = items[currentIndex];

    form.innerHTML = "";

    if (!item) {
      form.innerHTML = "<p class='hint'>Selecione ou crie um item.</p>";
      return;
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

  async function saveCurrent() {
    if (!currentData) await loadCollection();

    const config = collections[currentCollection];
    const items = currentData[config.root];
    if (!items[currentIndex]) throw new Error("Nenhum item selecionado.");

    items[currentIndex] = collectEditorValues();

    await saveFile(`Atualiza ${currentCollection}`);
    renderList();
    renderEditor();
  }

  async function saveFile(message) {
    const config = collections[currentCollection];
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

      if (result && result.content && result.content.sha) {
        currentSha = result.content.sha;
      }

      setStatus("Alteração publicada. Recarregando a categoria...");
      await reloadCurrentAfterSave();
      setStatus("Alteração publicada. Você já pode inserir outro item nesta categoria.");
    } catch (error) {
      if (String(error.message || "").toLowerCase().includes("sha") || String(error.message || "").toLowerCase().includes("conflict")) {
        setStatus("O conteúdo mudou no GitHub. Recarreguei a categoria; tente publicar novamente.", true);
        await reloadCurrentAfterSave();
        return;
      }
      throw error;
    }
  }

  async function reloadCurrentAfterSave() {
    const config = collections[currentCollection];
    const selectedTitle = currentData && currentData[config.root] && currentData[config.root][currentIndex]
      ? (currentData[config.root][currentIndex][config.labelField] || "")
      : "";

    const file = await githubRequest(apiURL(config.path));
    currentSha = file.sha;
    currentData = JSON.parse(decodeBase64Unicode(file.content));

    if (!Array.isArray(currentData[config.root])) {
      currentData[config.root] = [];
    }

    if (selectedTitle) {
      const newIndex = currentData[config.root].findIndex(item => item[config.labelField] === selectedTitle);
      currentIndex = newIndex >= 0 ? newIndex : Math.max(0, currentData[config.root].length - 1);
    } else {
      currentIndex = Math.max(0, currentData[config.root].length - 1);
    }

    renderList();
    renderEditor();
  }

  async function addItem() {
    const config = collections[currentCollection];
    if (!currentData) {
      await loadCollection();
    }
    currentData[config.root].push(JSON.parse(JSON.stringify(config.blank)));
    currentIndex = currentData[config.root].length - 1;
    renderList();
    renderEditor();
    setStatus("Novo item criado. Preencha os campos e clique em publicar alteração.");
  }

  async function deleteItem() {
    const config = collections[currentCollection];
    if (!currentData || !currentData[config.root][currentIndex]) return;

    const ok = confirm("Tem certeza que deseja excluir este item?");
    if (!ok) return;

    currentData[config.root].splice(currentIndex, 1);
    currentIndex = Math.max(0, currentIndex - 1);

    await saveFile(`Remove item de ${currentCollection}`);
    renderList();
    renderEditor();
  }

  function escapeHTML(value) {
    return String(value || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
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
    try {
      setBusy(true);
      await loadCollection();
    } catch (err) {
      setStatus(err.message, true);
    } finally {
      setBusy(false);
    }
  });
  $("collectionSelect").addEventListener("change", async () => {
    try {
      setBusy(true);
      await loadCollection();
    } catch (err) {
      setStatus(err.message, true);
    } finally {
      setBusy(false);
    }
  });
  $("addBtn").addEventListener("click", async () => {
    try {
      setBusy(true);
      await addItem();
    } catch (err) {
      setStatus(err.message, true);
    } finally {
      setBusy(false);
    }
  });
  $("saveBtn").addEventListener("click", async event => {
    event.preventDefault();
    try {
      setBusy(true);
      await saveCurrent();
    } catch (err) {
      setStatus(err.message, true);
    } finally {
      setBusy(false);
    }
  });
  $("deleteBtn").addEventListener("click", async event => {
    event.preventDefault();
    try {
      setBusy(true);
      await deleteItem();
    } catch (err) {
      setStatus(err.message, true);
    } finally {
      setBusy(false);
    }
  });

  const savedToken = localStorage.getItem(TOKEN_KEY);
  if (savedToken) {
    $("tokenInput").value = savedToken;
    setStatus("Token já salvo neste navegador. Clique em carregar.");
  }
})();
