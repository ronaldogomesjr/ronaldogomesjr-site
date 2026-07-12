(function () {
  const OWNER = 'ronaldogomesjr';
  const REPO = 'ronaldogomesjr-site';
  const BRANCH = 'main';
  const PATH = 'content/tecnologia-digital.json';
  const TOKEN_KEY = 'rgjr_site_github_token';

  let sha = '';
  let data = null;

  const fieldGroups = [
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
  ];

  function token() {
    const typed = document.getElementById('tokenInput')?.value.trim();
    if (typed) return typed;
    try { return localStorage.getItem(TOKEN_KEY) || ''; } catch (_) { return ''; }
  }

  function apiUrl() {
    return `https://api.github.com/repos/${OWNER}/${REPO}/contents/${PATH}?ref=${BRANCH}&_=${Date.now()}`;
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

  async function request(options = {}) {
    const accessToken = token();
    if (!accessToken) throw new Error('Insira e salve o token do GitHub antes de editar a página Tecnologia digital.');

    const response = await fetch(apiUrl(), {
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

  function setMessage(message, error = false) {
    const element = document.getElementById('technologyEditorStatus');
    if (!element) return;
    element.textContent = message;
    element.style.color = error ? '#7f2f2f' : '';
  }

  function createField(name, type, label, value) {
    const wrapper = document.createElement('label');
    wrapper.className = 'design-admin-field';
    const title = document.createElement('span');
    title.textContent = label;
    wrapper.appendChild(title);
    const control = document.createElement(type === 'textarea' ? 'textarea' : 'input');
    control.name = name;
    control.value = value ?? '';
    if (type !== 'textarea') control.type = type;
    if (type === 'textarea') control.rows = 4;
    wrapper.appendChild(control);
    return wrapper;
  }

  function render() {
    const form = document.getElementById('technologyEditorForm');
    if (!form || !data) return;
    form.innerHTML = '';
    fieldGroups.forEach(([name, type, label]) => {
      form.appendChild(createField(name, type, label, data[name]));
    });
  }

  async function load() {
    setMessage('Carregando a página Tecnologia digital…');
    try {
      const payload = await request();
      sha = payload.sha;
      data = JSON.parse(decodeBase64(payload.content));
      render();
      setMessage('Página Tecnologia digital carregada. Todos os textos abaixo podem ser editados.');
    } catch (error) {
      setMessage(error.message, true);
    }
  }

  function collect() {
    const form = document.getElementById('technologyEditorForm');
    const next = { ...data };
    fieldGroups.forEach(([name]) => {
      next[name] = form.elements[name]?.value ?? '';
    });
    return next;
  }

  async function save() {
    if (!data || !sha) return load();
    setMessage('Publicando alterações…');
    try {
      const next = collect();
      const payload = await request({
        method: 'PUT',
        body: JSON.stringify({
          message: 'Atualiza conteúdo da página Tecnologia digital',
          content: encodeBase64(`${JSON.stringify(next, null, 2)}\n`),
          sha,
          branch: BRANCH
        })
      });
      sha = payload.content.sha;
      data = next;
      setMessage('Alterações publicadas. Aguarde o novo deploy do site.');
    } catch (error) {
      setMessage(error.message, true);
    }
  }

  function updateVisibility() {
    const select = document.getElementById('collectionSelect');
    const panel = document.getElementById('technologyCustomEditor');
    const grid = document.querySelector('.admin-grid');
    const addButton = document.getElementById('addBtn');
    const value = select?.value || '';
    const active = value === 'page-tecnologia-digital';
    const customActive = ['page-design', 'page-tecnologia-digital'].includes(value);
    if (panel) panel.hidden = !active;
    if (grid) grid.hidden = customActive;
    if (addButton) addButton.hidden = customActive;
  }

  function initialize() {
    const style = document.createElement('style');
    style.textContent = `
      .technology-admin-panel[hidden] { display: none !important; }
    `;
    document.head.appendChild(style);

    const select = document.getElementById('collectionSelect');
    const loadButton = document.getElementById('loadBtn');
    if (!select || !loadButton) return;

    const chooser = select.closest('.admin-card');
    const panel = document.createElement('section');
    panel.id = 'technologyCustomEditor';
    panel.className = 'admin-card technology-admin-panel';
    panel.hidden = true;
    panel.innerHTML = `
      <h2>editar página Tecnologia digital</h2>
      <p class="hint">Título, descrição, perspectiva e SEO. As versões em português e inglês são salvas juntas.</p>
      <p id="technologyEditorStatus" class="status">Clique em carregar para abrir os campos.</p>
      <form id="technologyEditorForm" class="editor-form design-admin-form"></form>
      <div class="actions"><button id="technologyEditorSave" type="button">publicar alteração</button></div>
    `;
    chooser.insertAdjacentElement('afterend', panel);

    select.addEventListener('change', updateVisibility);
    loadButton.addEventListener('click', (event) => {
      if (select.value !== 'page-tecnologia-digital') return;
      event.preventDefault();
      event.stopImmediatePropagation();
      load();
    }, true);

    document.getElementById('technologyEditorSave').addEventListener('click', save);
    updateVisibility();
  }

  document.addEventListener('DOMContentLoaded', initialize);
})();
