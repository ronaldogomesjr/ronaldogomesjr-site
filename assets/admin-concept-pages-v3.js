(function () {
  'use strict';

  const OWNER = 'ronaldogomesjr';
  const REPO = 'ronaldogomesjr-site';
  const BRANCH = 'main';
  const TOKEN_KEY = 'rgjr_site_github_token';

  const COMMON_FIELDS = [
    { name: 'title_pt', type: 'text', label: 'Título da página — português', group: 'Português' },
    { name: 'intro_pt', type: 'textarea', label: 'Texto de abertura — português', group: 'Português' },
    { name: 'perspective_title_pt', type: 'text', label: 'Título da seção Perspectiva — português', group: 'Português' },
    { name: 'perspective_text_pt', type: 'textarea', label: 'Texto da seção Perspectiva — português', group: 'Português', rows: 7 },
    { name: 'meta_title_pt', type: 'text', label: 'Título SEO — português', group: 'Português' },
    { name: 'meta_description_pt', type: 'textarea', label: 'Descrição SEO — português', group: 'Português' },
    { name: 'title_en', type: 'text', label: 'Page title — English', group: 'English' },
    { name: 'intro_en', type: 'textarea', label: 'Opening text — English', group: 'English' },
    { name: 'perspective_title_en', type: 'text', label: 'Perspective section title — English', group: 'English' },
    { name: 'perspective_text_en', type: 'textarea', label: 'Perspective section text — English', group: 'English', rows: 7 },
    { name: 'meta_title_en', type: 'text', label: 'SEO title — English', group: 'English' },
    { name: 'meta_description_en', type: 'textarea', label: 'SEO description — English', group: 'English' }
  ];

  const PAGES = {
    'page-design': {
      path: 'content/design.json',
      label: 'Design',
      commit: 'Atualiza conteúdo da página Design',
      fields: [
        ...COMMON_FIELDS.slice(0, 2),
        { name: 'center_pt', type: 'textarea', label: 'Texto acessível da arte — português', group: 'Português' },
        ...COMMON_FIELDS.slice(2, 6),
        ...COMMON_FIELDS.slice(6, 8),
        { name: 'center_en', type: 'textarea', label: 'Accessible artwork text — English', group: 'English' },
        ...COMMON_FIELDS.slice(8)
      ],
      nodes: true
    },
    'page-tecnologia-digital': {
      path: 'content/tecnologia-digital.json',
      label: 'Tecnologia digital',
      commit: 'Atualiza conteúdo da página Tecnologia digital',
      fields: COMMON_FIELDS
    },
    'page-educacao-linguistica': {
      path: 'content/educacao-linguistica.json',
      label: 'Educação linguística',
      commit: 'Atualiza conteúdo da página Educação linguística',
      fields: COMMON_FIELDS
    }
  };

  const NODE_LABELS = ['Pessoas', 'Linguagem', 'Contextos', 'Tecnologias', 'Experiências'];

  let currentKey = '';
  let currentConfig = null;
  let currentData = null;
  let currentSha = '';

  function getToken() {
    const typed = document.getElementById('tokenInput')?.value.trim();
    if (typed) return typed;
    try {
      return localStorage.getItem(TOKEN_KEY) || '';
    } catch (_) {
      return '';
    }
  }

  function apiUrl(path) {
    return `https://api.github.com/repos/${OWNER}/${REPO}/contents/${path}?ref=${encodeURIComponent(BRANCH)}&_=${Date.now()}`;
  }

  function decodeBase64(value) {
    const binary = atob(String(value || '').replace(/\n/g, ''));
    const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
    return new TextDecoder('utf-8').decode(bytes);
  }

  function encodeBase64(value) {
    const bytes = new TextEncoder().encode(value);
    let binary = '';
    bytes.forEach((byte) => {
      binary += String.fromCharCode(byte);
    });
    return btoa(binary);
  }

  async function request(path, options = {}) {
    const token = getToken();
    if (!token) throw new Error('Insira e salve o token do GitHub antes de editar esta página.');

    const response = await fetch(apiUrl(path), {
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
    if (!response.ok) throw new Error(payload.message || `Erro HTTP ${response.status}`);
    return payload;
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
    if (!form || !currentConfig || !currentData) return;

    form.innerHTML = '';
    if (heading) heading.textContent = `editar página ${currentConfig.label}`;
    if (hint) hint.textContent = 'Os campos abaixo vêm do mesmo arquivo de conteúdo que alimenta a página publicada.';
    if (source) source.textContent = `Arquivo: ${currentConfig.path}`;

    const groups = new Map();
    currentConfig.fields.forEach((field) => {
      if (!groups.has(field.group)) {
        const section = createGroup(field.group);
        groups.set(field.group, section);
        form.appendChild(section);
      }
      groups.get(field.group).appendChild(createField(field, currentData[field.name]));
    });

    if (currentConfig.nodes) {
      const artSection = createGroup('Textos acessíveis da arte');
      artSection.classList.add('concept-art-group');
      const nodes = Array.isArray(currentData.nodes) ? currentData.nodes : [];

      for (let index = 0; index < 5; index += 1) {
        const node = nodes[index] || {};
        const fieldset = document.createElement('fieldset');
        const legend = document.createElement('legend');
        legend.textContent = `${index + 1}. ${NODE_LABELS[index]}`;
        fieldset.appendChild(legend);
        fieldset.appendChild(createField({ name: `node_${index}_title_pt`, type: 'text', label: 'Título — português' }, node.title_pt));
        fieldset.appendChild(createField({ name: `node_${index}_title_en`, type: 'text', label: 'Title — English' }, node.title_en));
        fieldset.appendChild(createField({ name: `node_${index}_text_pt`, type: 'textarea', label: 'Descrição — português' }, node.text_pt));
        fieldset.appendChild(createField({ name: `node_${index}_text_en`, type: 'textarea', label: 'Description — English' }, node.text_en));
        artSection.appendChild(fieldset);
      }
      form.appendChild(artSection);
    }
  }

  async function readCurrentFile(config) {
    const payload = await request(config.path);
    return {
      sha: payload.sha,
      data: JSON.parse(decodeBase64(payload.content))
    };
  }

  async function loadSelectedPage() {
    const select = document.getElementById('collectionSelect');
    const key = select?.value || '';
    const config = PAGES[key];
    if (!config) return;

    currentKey = key;
    currentConfig = config;
    currentData = null;
    currentSha = '';
    setStatus(`Carregando a página ${config.label}…`);

    try {
      const current = await readCurrentFile(config);
      currentSha = current.sha;
      currentData = current.data;
      renderForm();
      setStatus(`Página ${config.label} carregada. O texto exibido é o que está salvo no GitHub.`);
    } catch (error) {
      setStatus(error.message, true);
    }
  }

  function collectData(baseData) {
    const form = document.getElementById('conceptEditorForm');
    if (!form || !currentConfig) return null;

    const next = { ...baseData };
    currentConfig.fields.forEach((field) => {
      next[field.name] = form.elements[field.name]?.value ?? '';
    });

    if (currentConfig.nodes) {
      next.nodes = Array.from({ length: 5 }, (_, index) => ({
        title_pt: form.elements[`node_${index}_title_pt`]?.value ?? '',
        title_en: form.elements[`node_${index}_title_en`]?.value ?? '',
        text_pt: form.elements[`node_${index}_text_pt`]?.value ?? '',
        text_en: form.elements[`node_${index}_text_en`]?.value ?? ''
      }));
    }

    return next;
  }

  async function saveCurrentPage() {
    if (!currentConfig) {
      setStatus('Selecione uma das três páginas conceituais.', true);
      return;
    }

    if (!currentData) {
      await loadSelectedPage();
      return;
    }

    const saveButton = document.getElementById('conceptEditorSave');
    if (saveButton) saveButton.disabled = true;
    setStatus('Conferindo a versão mais recente e publicando…');

    try {
      const latest = await readCurrentFile(currentConfig);
      const next = collectData(latest.data);
      const payload = await request(currentConfig.path, {
        method: 'PUT',
        body: JSON.stringify({
          message: currentConfig.commit,
          content: encodeBase64(`${JSON.stringify(next, null, 2)}\n`),
          sha: latest.sha,
          branch: BRANCH
        })
      });

      currentSha = payload.content.sha;
      currentData = next;
      setStatus('Alteração publicada. Recarregue a página do site para ver o novo texto.');
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
      currentData = null;
      currentSha = '';
      const form = document.getElementById('conceptEditorForm');
      if (form) form.innerHTML = '';
      const heading = document.getElementById('conceptEditorHeading');
      const source = document.getElementById('conceptEditorSource');
      if (heading) heading.textContent = `editar página ${currentConfig.label}`;
      if (source) source.textContent = `Arquivo: ${currentConfig.path}`;
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
      .concept-language-group fieldset { display: grid; gap: 14px; padding: 18px; border: 1px solid rgba(36,37,38,.12); }
      .concept-language-group legend { padding: 0 8px; font-weight: 600; }
      .concept-admin-field { display: grid; gap: 7px; }
      .concept-admin-field > span { font-size: .78rem; letter-spacing: .035em; }
      .concept-admin-field input,
      .concept-admin-field textarea { width: 100%; }
      .concept-editor-source { margin: 5px 0 0; font-size: .8rem; opacity: .7; }
      .concept-status-error { color: #7f2f2f !important; }
      #conceptEditorSave:disabled { opacity: .55; cursor: wait; }
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
      <div class="actions"><button id="conceptEditorSave" type="button">publicar alteração</button></div>
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
