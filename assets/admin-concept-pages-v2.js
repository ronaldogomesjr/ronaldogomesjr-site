(function () {
  const OWNER = 'ronaldogomesjr';
  const REPO = 'ronaldogomesjr-site';
  const BRANCH = 'main';
  const TOKEN_KEY = 'rgjr_site_github_token';

  const PAGES = {
    'page-design': {
      path: 'content/design.json',
      label: 'Design',
      commit: 'Atualiza conteúdo da página Design',
      fields: [
        ['title_pt', 'text', 'Título — português'],
        ['title_en', 'text', 'Título — inglês'],
        ['intro_pt', 'textarea', 'Descrição — português'],
        ['intro_en', 'textarea', 'Descrição — inglês'],
        ['center_pt', 'textarea', 'Texto acessível da arte — português'],
        ['center_en', 'textarea', 'Texto acessível da arte — inglês'],
        ['perspective_title_pt', 'text', 'Título da perspectiva — português'],
        ['perspective_title_en', 'text', 'Título da perspectiva — inglês'],
        ['perspective_text_pt', 'textarea', 'Texto da perspectiva — português'],
        ['perspective_text_en', 'textarea', 'Texto da perspectiva — inglês'],
        ['meta_title_pt', 'text', 'Título SEO — português'],
        ['meta_title_en', 'text', 'Título SEO — inglês'],
        ['meta_description_pt', 'textarea', 'Descrição SEO — português'],
        ['meta_description_en', 'textarea', 'Descrição SEO — inglês']
      ],
      nodes: true
    },
    'page-tecnologia-digital': {
      path: 'content/tecnologia-digital.json',
      label: 'Tecnologia digital',
      commit: 'Atualiza conteúdo da página Tecnologia digital',
      fields: [
        ['title_pt', 'text', 'Título — português'],
        ['title_en', 'text', 'Título — inglês'],
        ['intro_pt', 'textarea', 'Descrição — português'],
        ['intro_en', 'textarea', 'Descrição — inglês'],
        ['perspective_title_pt', 'text', 'Título da perspectiva — português'],
        ['perspective_title_en', 'text', 'Título da perspectiva — inglês'],
        ['perspective_text_pt', 'textarea', 'Texto da perspectiva — português'],
        ['perspective_text_en', 'textarea', 'Texto da perspectiva — inglês'],
        ['meta_title_pt', 'text', 'Título SEO — português'],
        ['meta_title_en', 'text', 'Título SEO — inglês'],
        ['meta_description_pt', 'textarea', 'Descrição SEO — português'],
        ['meta_description_en', 'textarea', 'Descrição SEO — inglês']
      ]
    },
    'page-educacao-linguistica': {
      path: 'content/educacao-linguistica.json',
      label: 'Educação linguística',
      commit: 'Atualiza conteúdo da página Educação linguística',
      fields: [
        ['title_pt', 'text', 'Título — português'],
        ['title_en', 'text', 'Título — inglês'],
        ['intro_pt', 'textarea', 'Descrição — português'],
        ['intro_en', 'textarea', 'Descrição — inglês'],
        ['perspective_title_pt', 'text', 'Título da perspectiva — português'],
        ['perspective_title_en', 'text', 'Título da perspectiva — inglês'],
        ['perspective_text_pt', 'textarea', 'Texto da perspectiva — português'],
        ['perspective_text_en', 'textarea', 'Texto da perspectiva — inglês'],
        ['meta_title_pt', 'text', 'Título SEO — português'],
        ['meta_title_en', 'text', 'Título SEO — inglês'],
        ['meta_description_pt', 'textarea', 'Descrição SEO — português'],
        ['meta_description_en', 'textarea', 'Descrição SEO — inglês']
      ]
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
    try { return localStorage.getItem(TOKEN_KEY) || ''; } catch (_) { return ''; }
  }

  function apiUrl(path) {
    return `https://api.github.com/repos/${OWNER}/${REPO}/contents/${path}?ref=${BRANCH}&_=${Date.now()}`;
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

  async function request(path, options = {}) {
    const accessToken = getToken();
    if (!accessToken) throw new Error('Insira e salve o token do GitHub antes de editar esta página.');

    const response = await fetch(apiUrl(path), {
      cache: 'no-store',
      ...options,
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${accessToken}`,
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

  function createField(name, type, label, value) {
    const wrapper = document.createElement('label');
    wrapper.className = 'concept-admin-field';

    const caption = document.createElement('span');
    caption.textContent = label;
    wrapper.appendChild(caption);

    const control = document.createElement(type === 'textarea' ? 'textarea' : 'input');
    control.name = name;
    control.value = value ?? '';
    if (type === 'textarea') control.rows = 5;
    else control.type = type;
    wrapper.appendChild(control);
    return wrapper;
  }

  function renderForm() {
    const form = document.getElementById('conceptEditorForm');
    const heading = document.getElementById('conceptEditorHeading');
    const hint = document.getElementById('conceptEditorHint');
    if (!form || !currentConfig || !currentData) return;

    form.innerHTML = '';
    if (heading) heading.textContent = `editar página ${currentConfig.label}`;
    if (hint) hint.textContent = 'Título, descrição, perspectiva e metadados em português e inglês. As alterações são publicadas diretamente no conteúdo do site.';

    currentConfig.fields.forEach(([name, type, label]) => {
      form.appendChild(createField(name, type, label, currentData[name]));
    });

    if (currentConfig.nodes) {
      const sectionTitle = document.createElement('h3');
      sectionTitle.textContent = 'Textos acessíveis da arte';
      form.appendChild(sectionTitle);

      const nodes = Array.isArray(currentData.nodes) ? currentData.nodes : [];
      for (let index = 0; index < 5; index += 1) {
        const node = nodes[index] || {};
        const group = document.createElement('fieldset');
        const legend = document.createElement('legend');
        legend.textContent = `${index + 1}. ${NODE_LABELS[index]}`;
        group.appendChild(legend);
        group.appendChild(createField(`node_${index}_title_pt`, 'text', 'Título — português', node.title_pt));
        group.appendChild(createField(`node_${index}_title_en`, 'text', 'Título — inglês', node.title_en));
        group.appendChild(createField(`node_${index}_text_pt`, 'textarea', 'Descrição — português', node.text_pt));
        group.appendChild(createField(`node_${index}_text_en`, 'textarea', 'Descrição — inglês', node.text_en));
        form.appendChild(group);
      }
    }
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
      const payload = await request(config.path);
      currentSha = payload.sha;
      currentData = JSON.parse(decodeBase64(payload.content));
      renderForm();
      setStatus(`Página ${config.label} carregada. Edite os campos e publique a alteração.`);
    } catch (error) {
      setStatus(error.message, true);
    }
  }

  function collectData() {
    const form = document.getElementById('conceptEditorForm');
    if (!form || !currentConfig || !currentData) return null;

    const next = { ...currentData };
    currentConfig.fields.forEach(([name]) => {
      next[name] = form.elements[name]?.value ?? '';
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
    if (!currentConfig || !currentData || !currentSha) {
      await loadSelectedPage();
      return;
    }

    setStatus('Publicando alterações…');
    try {
      const next = collectData();
      const payload = await request(currentConfig.path, {
        method: 'PUT',
        body: JSON.stringify({
          message: currentConfig.commit,
          content: encodeBase64(`${JSON.stringify(next, null, 2)}\n`),
          sha: currentSha,
          branch: BRANCH
        })
      });
      currentSha = payload.content.sha;
      currentData = next;
      setStatus('Alterações publicadas. Aguarde o novo deployment do site.');
    } catch (error) {
      setStatus(error.message, true);
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
      if (heading) heading.textContent = `editar página ${currentConfig.label}`;
      setStatus('Clique em carregar para abrir os campos desta página.');
    }
  }

  function initialize() {
    const style = document.createElement('style');
    style.textContent = `
      .concept-admin-panel[hidden] { display: none !important; }
      .concept-admin-form { display: grid; gap: 18px; margin-top: 24px; }
      .concept-admin-form h3 { margin: 24px 0 0; font-size: 1rem; text-transform: lowercase; }
      .concept-admin-form fieldset { display: grid; gap: 14px; padding: 18px; border: 1px solid rgba(36,37,38,.12); }
      .concept-admin-form legend { padding: 0 8px; font-weight: 600; }
      .concept-admin-field { display: grid; gap: 7px; }
      .concept-admin-field > span { font-size: .78rem; letter-spacing: .04em; }
      .concept-admin-field input, .concept-admin-field textarea { width: 100%; }
      .concept-status-error { color: #7f2f2f !important; }
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
