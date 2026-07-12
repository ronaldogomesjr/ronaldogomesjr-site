(function () {
  const OWNER = 'ronaldogomesjr';
  const REPO = 'ronaldogomesjr-site';
  const BRANCH = 'main';
  const PATH = 'content/design.json';
  const TOKEN_KEY = 'rgjr_site_github_token';

  let sha = '';
  let data = null;

  const fieldGroups = [
    ['title_pt', 'text', 'Título — português'],
    ['title_en', 'text', 'Título — inglês'],
    ['intro_pt', 'textarea', 'Descrição — português'],
    ['intro_en', 'textarea', 'Descrição — inglês'],
    ['center_pt', 'textarea', 'Texto central do diagrama — português'],
    ['center_en', 'textarea', 'Texto central do diagrama — inglês'],
    ['perspective_title_pt', 'text', 'Título da perspectiva — português'],
    ['perspective_title_en', 'text', 'Título da perspectiva — inglês'],
    ['perspective_text_pt', 'textarea', 'Texto da perspectiva — português'],
    ['perspective_text_en', 'textarea', 'Texto da perspectiva — inglês'],
    ['meta_title_pt', 'text', 'Título SEO — português'],
    ['meta_title_en', 'text', 'Título SEO — inglês'],
    ['meta_description_pt', 'textarea', 'Descrição SEO — português'],
    ['meta_description_en', 'textarea', 'Descrição SEO — inglês']
  ];

  const nodeLabels = ['Pessoas', 'Linguagem', 'Contextos', 'Tecnologias', 'Experiências'];

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
    if (!accessToken) throw new Error('Insira e salve o token do GitHub antes de editar a página Design.');

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
    const element = document.getElementById('designEditorStatus');
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
    const form = document.getElementById('designEditorForm');
    if (!form || !data) return;
    form.innerHTML = '';

    fieldGroups.forEach(([name, type, label]) => {
      form.appendChild(createField(name, type, label, data[name]));
    });

    const nodesTitle = document.createElement('h3');
    nodesTitle.textContent = 'Elementos do diagrama';
    form.appendChild(nodesTitle);

    const nodes = Array.isArray(data.nodes) ? data.nodes : [];
    for (let index = 0; index < 5; index += 1) {
      const node = nodes[index] || {};
      const group = document.createElement('fieldset');
      const legend = document.createElement('legend');
      legend.textContent = `${index + 1}. ${nodeLabels[index]}`;
      group.appendChild(legend);
      group.appendChild(createField(`node_${index}_title_pt`, 'text', 'Título — português', node.title_pt));
      group.appendChild(createField(`node_${index}_title_en`, 'text', 'Título — inglês', node.title_en));
      group.appendChild(createField(`node_${index}_text_pt`, 'textarea', 'Descrição — português', node.text_pt));
      group.appendChild(createField(`node_${index}_text_en`, 'textarea', 'Descrição — inglês', node.text_en));
      form.appendChild(group);
    }
  }

  async function load() {
    setMessage('Carregando a página Design…');
    try {
      const payload = await request();
      sha = payload.sha;
      data = JSON.parse(decodeBase64(payload.content));
      render();
      setMessage('Página Design carregada. Todos os textos abaixo podem ser editados.');
    } catch (error) {
      setMessage(error.message, true);
    }
  }

  function collect() {
    const form = document.getElementById('designEditorForm');
    const next = { ...data };

    fieldGroups.forEach(([name]) => {
      next[name] = form.elements[name]?.value ?? '';
    });

    next.nodes = Array.from({ length: 5 }, (_, index) => ({
      title_pt: form.elements[`node_${index}_title_pt`]?.value ?? '',
      title_en: form.elements[`node_${index}_title_en`]?.value ?? '',
      text_pt: form.elements[`node_${index}_text_pt`]?.value ?? '',
      text_en: form.elements[`node_${index}_text_en`]?.value ?? ''
    }));

    delete next.steps;
    delete next.quote_pt;
    delete next.quote_en;
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
          message: 'Atualiza conteúdo da página Design',
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
    const panel = document.getElementById('designCustomEditor');
    const grid = document.querySelector('.admin-grid');
    const addButton = document.getElementById('addBtn');
    const active = select?.value === 'page-design';

    if (panel) panel.hidden = !active;
    if (grid) grid.hidden = active;
    if (addButton) addButton.hidden = active;
  }

  function initialize() {
    const style = document.createElement('style');
    style.textContent = `
      .design-admin-panel[hidden] { display: none !important; }
      .design-admin-form { display: grid; gap: 18px; margin-top: 24px; }
      .design-admin-form h3 { margin: 18px 0 0; font-size: 1rem; text-transform: lowercase; }
      .design-admin-form fieldset { display: grid; gap: 14px; padding: 18px; border: 1px solid rgba(36,37,38,.12); }
      .design-admin-form legend { padding: 0 8px; font-weight: 600; }
      .design-admin-field { display: grid; gap: 7px; }
      .design-admin-field > span { font-size: .78rem; letter-spacing: .06em; }
      .design-admin-field input, .design-admin-field textarea { width: 100%; }
    `;
    document.head.appendChild(style);

    const select = document.getElementById('collectionSelect');
    const loadButton = document.getElementById('loadBtn');
    if (!select || !loadButton) return;

    const chooser = select.closest('.admin-card');
    const panel = document.createElement('section');
    panel.id = 'designCustomEditor';
    panel.className = 'admin-card design-admin-panel';
    panel.hidden = true;
    panel.innerHTML = `
      <h2>editar página Design</h2>
      <p class="hint">Título, descrição, texto central, cinco elementos do diagrama e perspectiva. As versões em português e inglês são salvas juntas.</p>
      <p id="designEditorStatus" class="status">Clique em carregar para abrir os campos.</p>
      <form id="designEditorForm" class="editor-form design-admin-form"></form>
      <div class="actions"><button id="designEditorSave" type="button">publicar alteração</button></div>
    `;
    chooser.insertAdjacentElement('afterend', panel);

    select.addEventListener('change', updateVisibility);
    loadButton.addEventListener('click', (event) => {
      if (select.value !== 'page-design') return;
      event.preventDefault();
      event.stopImmediatePropagation();
      load();
    }, true);

    document.getElementById('designEditorSave').addEventListener('click', save);
    updateVisibility();
  }

  document.addEventListener('DOMContentLoaded', initialize);
})();
