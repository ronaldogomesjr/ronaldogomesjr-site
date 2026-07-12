(function () {
  'use strict';

  const OWNER = 'ronaldogomesjr';
  const REPO = 'ronaldogomesjr-site';
  const BRANCH = 'main';
  const TOKEN_KEY = 'rgjr_site_github_token';
  const PAGES_PATH = 'content/pages.json';

  const FIELDS = [
    { name: 'title_pt', type: 'text', label: 'Título da página — português', group: 'Português' },
    { name: 'intro_pt', type: 'textarea', label: 'Texto de abertura — português', group: 'Português', rows: 7 },
    { name: 'section1_title_pt', type: 'text', label: 'Título da seção Perspectiva — português', group: 'Português' },
    { name: 'section1_text_pt', type: 'textarea', label: 'Texto da seção Perspectiva — português', group: 'Português', rows: 8 },
    { name: 'title_en', type: 'text', label: 'Page title — English', group: 'English' },
    { name: 'intro_en', type: 'textarea', label: 'Opening text — English', group: 'English', rows: 7 },
    { name: 'section1_title_en', type: 'text', label: 'Perspective section title — English', group: 'English' },
    { name: 'section1_text_en', type: 'textarea', label: 'Perspective section text — English', group: 'English', rows: 8 }
  ];

  const PAGES = {
    'page-design': {
      id: 'design',
      label: 'Design',
      commit: 'Atualiza conteúdo da página Design',
      legacyPath: 'content/design.json',
      preview: '/pt/design/'
    },
    'page-tecnologia-digital': {
      id: 'tecnologia-digital',
      label: 'Tecnologia digital',
      commit: 'Atualiza conteúdo da página Tecnologia digital',
      legacyPath: 'content/tecnologia-digital.json',
      preview: '/pt/tecnologia-digital/'
    },
    'page-educacao-linguistica': {
      id: 'educacao-linguistica',
      label: 'Educação linguística',
      commit: 'Atualiza conteúdo da página Educação linguística',
      legacyPath: 'content/educacao-linguistica.json',
      preview: '/pt/educacao-linguistica/'
    }
  };

  let currentKey = '';
  let currentConfig = null;
  let currentItem = null;

  function getToken() {
    const typed = document.getElementById('tokenInput')?.value.trim();
    if (typed) return typed;
    try {
      return localStorage.getItem(TOKEN_KEY) || '';
    } catch (_) {
      return '';
    }
  }

  function apiUrl(path, method = 'GET') {
    const base = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${path}`;
    if (method === 'GET') {
      return `${base}?ref=${encodeURIComponent(BRANCH)}&_=${Date.now()}`;
    }
    return `${base}?_=${Date.now()}`;
  }

  function decodeBase64(value) {
    const binary = atob(String(value || '').replace(/\n/g, ''));
    const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
    return new TextDecoder('utf-8').decode(bytes);
  }

  function encodeBase64(value) {
    const bytes = new TextEncoder().encode(value);
    let binary = '';
    bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
    return btoa(binary);
  }

  async function githubRequest(path, options = {}) {
    const token = getToken();
    if (!token) throw new Error('Insira e salve o token do GitHub antes de editar esta página.');

    const method = String(options.method || 'GET').toUpperCase();
    const response = await fetch(apiUrl(path, method), {
      cache: 'no-store',
      ...options,
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${token}`,
        'X-GitHub-Api-Version': '2022-11-28',
        ...(options.headers || {})
      }
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(payload.message || `Erro HTTP ${response.status}`);
    }
    return payload;
  }

  async function readJson(path) {
    const payload = await githubRequest(path);
    return {
      sha: payload.sha,
      data: JSON.parse(decodeBase64(payload.content))
    };
  }

  async function writeJson(path, data, sha, message) {
    return githubRequest(path, {
      method: 'PUT',
      body: JSON.stringify({
        message,
        content: encodeBase64(`${JSON.stringify(data, null, 2)}\n`),
        sha,
        branch: BRANCH
      })
    });
  }

  function setStatus(message, isError = false) {
    const element = document.getElementById('conceptEditorStatus');
    if (!element) return;
    element.textContent = message;
    element.classList.toggle('concept-status-error', isError);
  }

  function createField(field, value) {
    const wrapper = document.createElement('label');
    wrapper.className = 'concept-admin-field';

    const caption = document.createElement('span');
    caption.textContent = field.label;
    wrapper.appendChild(caption);

    const control = document.createElement(field.type === 'textarea' ? 'textarea' : 'input');
    control.name = field.name;
    control.value = value ?? '';
    if (field.type === 'textarea') control.rows = field.rows || 5;
    else control.type = field.type;
    wrapper.appendChild(control);

    return wrapper;
  }

  function createGroup(title) {
    const section = document.createElement('section');
    section.className = 'concept-language-group';
    const heading = document.createElement('h3');
    heading.textContent = title;
    section.appendChild(heading);
    return section;
  }

  function renderForm() {
    const form = document.getElementById('conceptEditorForm');
    const heading = document.getElementById('conceptEditorHeading');
    const hint = document.getElementById('conceptEditorHint');
    const source = document.getElementById('conceptEditorSource');
    if (!form || !currentConfig || !currentItem) return;

    form.innerHTML = '';
    if (heading) heading.textContent = `editar página ${currentConfig.label}`;
    if (hint) hint.textContent = 'Estes campos controlam diretamente os textos exibidos no site.';
    if (source) source.textContent = 'Fonte principal: content/pages.json · cópia de compatibilidade atualizada automaticamente.';

    const groups = new Map();
    FIELDS.forEach((field) => {
      if (!groups.has(field.group)) {
        const section = createGroup(field.group);
        groups.set(field.group, section);
        form.appendChild(section);
      }
      groups.get(field.group).appendChild(createField(field, currentItem[field.name]));
    });
  }

  function findPage(documentData, pageId) {
    if (!documentData || !Array.isArray(documentData.items)) return null;
    return documentData.items.find((item) => item && item.id === pageId) || null;
  }

  function collectFields(baseItem) {
    const form = document.getElementById('conceptEditorForm');
    if (!form) return null;
    const next = { ...baseItem };
    FIELDS.forEach((field) => {
      next[field.name] = form.elements[field.name]?.value ?? '';
    });
    return next;
  }

  function mergeLegacy(legacyData, item) {
    return {
      ...(legacyData && typeof legacyData === 'object' ? legacyData : {}),
      title_pt: item.title_pt ?? '',
      title_en: item.title_en ?? '',
      intro_pt: item.intro_pt ?? '',
      intro_en: item.intro_en ?? '',
      perspective_title_pt: item.section1_title_pt ?? '',
      perspective_title_en: item.section1_title_en ?? '',
      perspective_text_pt: item.section1_text_pt ?? '',
      perspective_text_en: item.section1_text_en ?? ''
    };
  }

  function fieldsMatch(item, savedItem) {
    return FIELDS.every((field) => String(item[field.name] ?? '') === String(savedItem[field.name] ?? ''));
  }

  async function loadSelectedPage() {
    const select = document.getElementById('collectionSelect');
    const key = select?.value || '';
    const config = PAGES[key];
    if (!config) return;

    currentKey = key;
    currentConfig = config;
    currentItem = null;
    setStatus(`Carregando a página ${config.label}…`);

    try {
      const pages = await readJson(PAGES_PATH);
      const item = findPage(pages.data, config.id);
      if (!item) throw new Error(`A página ${config.label} não foi encontrada em ${PAGES_PATH}.`);
      currentItem = item;
      renderForm();
      setStatus(`Página ${config.label} carregada com os textos atualmente publicados.`);
    } catch (error) {
      setStatus(error.message, true);
    }
  }

  async function saveCurrentPage() {
    if (!currentConfig || !currentItem) {
      setStatus('Selecione a página e clique em carregar antes de publicar.', true);
      return;
    }

    const saveButton = document.getElementById('conceptEditorSave');
    if (saveButton) saveButton.disabled = true;
    setStatus('Publicando e verificando a alteração…');

    try {
      const latestPages = await readJson(PAGES_PATH);
      if (!latestPages.data || !Array.isArray(latestPages.data.items)) {
        throw new Error(`${PAGES_PATH} não tem a estrutura esperada.`);
      }

      const index = latestPages.data.items.findIndex((item) => item && item.id === currentConfig.id);
      if (index < 0) throw new Error(`A página ${currentConfig.label} não foi encontrada em ${PAGES_PATH}.`);

      const nextItem = collectFields(latestPages.data.items[index]);
      const nextPages = {
        ...latestPages.data,
        items: latestPages.data.items.map((item, itemIndex) => itemIndex === index ? nextItem : item)
      };

      await writeJson(PAGES_PATH, nextPages, latestPages.sha, currentConfig.commit);

      // Mantém também o arquivo antigo usado por versões anteriores do site.
      const legacy = await readJson(currentConfig.legacyPath);
      const nextLegacy = mergeLegacy(legacy.data, nextItem);
      await writeJson(
        currentConfig.legacyPath,
        nextLegacy,
        legacy.sha,
        `${currentConfig.commit} — compatibilidade`
      );

      // Verifica no GitHub se a fonte principal recebeu exatamente os novos textos.
      const verifiedPages = await readJson(PAGES_PATH);
      const verifiedItem = findPage(verifiedPages.data, currentConfig.id);
      if (!verifiedItem || !fieldsMatch(nextItem, verifiedItem)) {
        throw new Error('O GitHub recebeu o commit, mas a verificação dos textos não coincidiu. Recarregue o painel e tente novamente.');
      }

      currentItem = verifiedItem;
      renderForm();
      setStatus(`Alteração publicada e verificada. A página ${currentConfig.label} já pode ser recarregada no site.`);

      const preview = document.getElementById('conceptEditorPreview');
      if (preview) {
        preview.href = `${currentConfig.preview}?conteudo=${Date.now()}`;
        preview.hidden = false;
      }
    } catch (error) {
      setStatus(error.message, true);
    } finally {
      if (saveButton) saveButton.disabled = false;
    }
  }

  function updateVisibility() {
    const select = document.getElementById('collectionSelect');
    const value = select?.value || '';
    const active = Boolean(PAGES[value]);
    const panel = document.getElementById('conceptCustomEditor');
    const grid = document.querySelector('.admin-grid');
    const addButton = document.getElementById('addBtn');

    if (panel) panel.hidden = !active;
    if (grid) grid.hidden = active;
    if (addButton) addButton.hidden = active;

    if (active && value !== currentKey) {
      currentKey = value;
      currentConfig = PAGES[value];
      currentItem = null;
      const form = document.getElementById('conceptEditorForm');
      if (form) form.innerHTML = '';
      const heading = document.getElementById('conceptEditorHeading');
      if (heading) heading.textContent = `editar página ${currentConfig.label}`;
      const source = document.getElementById('conceptEditorSource');
      if (source) source.textContent = 'Fonte principal: content/pages.json';
      const preview = document.getElementById('conceptEditorPreview');
      if (preview) preview.hidden = true;
      setStatus('Clique em carregar para abrir os textos atuais desta página.');
    }
  }

  function initialize() {
    const style = document.createElement('style');
    style.textContent = `
      .concept-admin-panel[hidden] { display: none !important; }
      .concept-admin-form { display: grid; gap: 26px; margin-top: 24px; }
      .concept-language-group { display: grid; gap: 16px; padding-top: 4px; }
      .concept-language-group + .concept-language-group { padding-top: 24px; border-top: 1px solid rgba(36,37,38,.12); }
      .concept-language-group > h3 { margin: 0; font-size: 1rem; text-transform: none; }
      .concept-admin-field { display: grid; gap: 7px; }
      .concept-admin-field > span { font-size: .78rem; letter-spacing: .035em; }
      .concept-admin-field input, .concept-admin-field textarea { width: 100%; }
      .concept-editor-source { margin: 5px 0 0; font-size: .8rem; opacity: .7; }
      .concept-status-error { color: #7f2f2f !important; }
      #conceptEditorSave:disabled { opacity: .55; cursor: wait; }
      #conceptEditorPreview[hidden] { display: none !important; }
    `;
    document.head.appendChild(style);

    const select = document.getElementById('collectionSelect');
    const loadButton = document.getElementById('loadBtn');
    const chooser = select?.closest('.admin-card');
    if (!select || !loadButton || !chooser) return;

    const panel = document.createElement('section');
    panel.id = 'conceptCustomEditor';
    panel.className = 'admin-card concept-admin-panel';
    panel.hidden = true;
    panel.innerHTML = `
      <h2 id="conceptEditorHeading">editar página conceitual</h2>
      <p id="conceptEditorHint" class="hint">Selecione uma página e clique em carregar.</p>
      <p id="conceptEditorSource" class="concept-editor-source"></p>
      <p id="conceptEditorStatus" class="status">Clique em carregar para abrir os campos.</p>
      <form id="conceptEditorForm" class="editor-form concept-admin-form"></form>
      <div class="actions">
        <button id="conceptEditorSave" type="button">publicar alteração</button>
        <a id="conceptEditorPreview" class="back-link" href="#" target="_blank" rel="noopener" hidden>abrir página atualizada →</a>
      </div>
    `;
    chooser.insertAdjacentElement('afterend', panel);

    select.addEventListener('change', updateVisibility);
    loadButton.addEventListener('click', (event) => {
      if (!PAGES[select.value]) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      loadSelectedPage();
    }, true);

    document.getElementById('conceptEditorSave')?.addEventListener('click', saveCurrentPage);
    updateVisibility();
  }

  document.addEventListener('DOMContentLoaded', initialize);
})();
