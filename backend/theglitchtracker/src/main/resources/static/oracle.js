
const API_BASE = 'http://localhost:8080/api';

// NOTA: Dados Mock para simular falhas no sistema enquanto o servidor não está ligado.
let MOCK_GLITCHES = [
  { id: 1, title: "Agent detected near the Oracle's kitchen", description: "System anomaly in sector 7G. Possible Smith replication.", status: "Identified", priority: "Agent Smith", assignedTo: "Neo" },
  { id: 2, title: "Déjà vu loop in Mega City East", description: "Cat seen twice. Matrix being altered.", status: "Identified", priority: "Deja Vu", assignedTo: "Trinity" },
  { id: 3, title: "Phone line compromised at Booth 42", description: "Exit route blocked. Requires immediate investigation.", status: "Bending the Rules", priority: "High Alert", assignedTo: "Morpheus" },
  { id: 4, title: "Residual self-image corruption", description: "Operative's construct loading incorrectly.", status: "Bending the Rules", priority: "Deja Vu", assignedTo: "Neo" },
  { id: 5, title: "Zion broadcast signal restored", description: "Frequency interference resolved.", status: "System Fixed", priority: "Deja Vu", assignedTo: "Tank" },
  { id: 6, title: "Smith clone purged from subway grid", description: "Matrix integrity restored in affected zone.", status: "System Fixed", priority: "Agent Smith", assignedTo: "Trinity" },
];

// Frontend usa a URL diretamente - <img src={produto.imagem_url} alt={produto.nome} />
// PostgresSQL cria a Tabela dos Users com o PK = Id, NAME & Image_URL
// Backend serve ficheiros estáticos | Endpoint que retorna dados + caminho da imagem
const MOCK_USERS = [
  { id: 1, name: "Neo",      role: "The One",   avatar: "frontend/images/Neo.jpeg" },
  { id: 2, name: "Trinity",  role: "Operative", avatar: "frontend/images/Trinity.png" },
  { id: 3, name: "Morpheus", role: "Captain",   avatar: "frontend/images/Morpheus.jpg" },
  { id: 4, name: "Tank",     role: "Operator",  avatar: "frontend/images/Tank.jpg" },
];

// PRIORITY MAP
// NOTA: mapa de níveis de ameaça para classes CSS de cores (definidas no oracle.css).
const priorityClass = {
  'Agent Smith': 'priority-critical',
  'High Alert':  'priority-high',
  'Glitch':      'priority-medium',
  'Deja Vu':     'priority-low',
};

// STATUS FLOW
// NOTA: Define a ordem lógica do quadro Kanban: Identified -> Bending the Rules -> System Fixed.
const nextStatus = {
  'Identified':        'Bending the Rules',
  'Bending the Rules': 'System Fixed',
  'System Fixed':      null,
};

// =============================================================================
// BACKEND MAPPING
// NOTA: O backend usa enums em UPPER_SNAKE_CASE (ex: AGENT_SMITH, BENDING_THE_RULES).
//       O frontend usa strings legíveis (ex: "Agent Smith", "Bending the Rules").
//       Estes mapas fazem a conversão nos dois sentidos.
// =============================================================================

// Converte GlitchStatus do backend → frontend
const statusMap = {
  'IDENTIFIED':        'Identified',
  'BENDING_THE_RULES': 'Bending the Rules',
  'SYSTEM_FIXED':      'System Fixed',
};

// Converte status do frontend → enum do backend
const statusReverseMap = {
  'Identified':        'IDENTIFIED',
  'Bending the Rules': 'BENDING_THE_RULES',
  'System Fixed':      'SYSTEM_FIXED',
};

// Converte GlitchPriority do backend → frontend
const priorityMap = {
  'AGENT_SMITH': 'Agent Smith',
  'HIGH_ALERT':  'High Alert',
  'GLITCH':      'Glitch',
  'DEJA_VU':     'Deja Vu',
};

// Converte priority do frontend → enum do backend
const priorityReverseMap = {
  'Agent Smith': 'AGENT_SMITH',
  'High Alert':  'HIGH_ALERT',
  'Glitch':      'GLITCH',
  'Deja Vu':     'DEJA_VU',
};

// =============================================================================
// MAPPERS
// NOTA: Funções que transformam os objetos do backend no formato esperado pelo frontend.
//       O backend devolve objetos aninhados (ex: glitch.user.name), o frontend
//       trabalha com campos simples (ex: glitch.assignedTo).
// =============================================================================

// Converte um objeto Glitch do backend para o formato do frontend.
// O campo "user" (objeto) é achatado para "assignedTo" (string com o nome).
// Os enums glitchStatus e glitchPriority são convertidos para strings legíveis.
function mapGlitch(g) {
  return {
    id:          g.id,
    title:       g.title,
    description: g.description,
    status:      statusMap[g.glitchStatus]   || g.glitchStatus,
    priority:    priorityMap[g.glitchPriority] || g.glitchPriority,
    assignedTo:  g.user ? g.user.name : 'Unassigned',
  };
}

// Converte um objeto User do backend para o formato do frontend.
// O campo "userRole" (enum) é convertido para a sua descrição legível.
// O campo "avatar" é construído com base no nome do user (convenção de ficheiro).
// NOTA: Os ficheiros de imagem têm de existir em frontend/images/ com o nome exato do user.
//       Extensões suportadas: .jpeg (Neo), .png (Trinity), .jpg (Morpheus, Tank).
//       Se adicionares novos users, garante que o ficheiro de imagem existe.
function mapUser(u) {
  // Mapa de extensões por nome — ajusta se adicionares novos operativos
  const avatarExtensions = {
    'Neo':      'jpeg',
    'Trinity':  'png',
    'Morpheus': 'jpg',
    'Tank':     'jpg',
  };
  const ext = avatarExtensions[u.name] || 'jpg';

  return {
    id:     u.id,
    name:   u.name,
    role:   u.userRole,
    avatar: `frontend/images/${u.name}.${ext}`,
  };
}

// =============================================================================
// ROUTER (History API)
// NOTA: Objeto que faz o mapping das rotas da URL para as funções de renderização de cada página.
// =============================================================================

const routes = {
  '/dashboard':  renderDashboard,
  '/new-glitch': renderNewGlitch,
  '/operatives': renderOperatives,
};

// NOTA: Função principal da SPA. Muda o URL sem recarregar a página e chama o loadPage.
function navigate(path) {
  window.history.pushState({}, '', path);
  loadPage(path);
  updateNav(path);
}

// Loads and renders the page based on the current path.
// If the route does not exist, it defaults to the dashboard.
function loadPage(path) {
  const render = routes[path] || renderDashboard;
  render();
}

// Updates the navigation UI.
// Adds or removes the "active" class based on the current route.
function updateNav(path) {
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.dataset.page === path.replace('/', ''));
  });
}

// Listens for browser back/forward button actions.
// Ensures the correct page is rendered when navigation history changes.
window.addEventListener('popstate', () => {
  const path = window.location.pathname;
  loadPage(path);
  updateNav(path);
});

// NOTA: Este Listener impede que o browser faça o refresh normal, usando a função navigate() em vez disso.
document.addEventListener('click', e => {
  const link = e.target.closest('.nav-link');
  if (link) {
    e.preventDefault();
    navigate(link.getAttribute('href'));
  }
});

// =============================================================================
// API FUNCTIONS
// NOTA: Quando USE_MOCK = true, todas as funções retornam dados locais (MOCK_*).
//       Quando USE_MOCK = false, as funções comunicam com o backend via fetch.
//       Para ativar o backend: muda USE_MOCK para false e garante que o servidor
//       está a correr em localhost:8080.
// =============================================================================

const USE_MOCK = false; // Muda para true para usar dados mock sem backend

// Fetches all glitches from backend.
// Converte cada objeto Glitch do formato do backend para o formato do frontend via mapGlitch().
// Returns a list of glitch objects.
async function fetchGlitches() {
  if (USE_MOCK) return MOCK_GLITCHES;
  const res = await fetch(`${API_BASE}/glitches`);
  if (!res.ok) throw new Error('Failed to fetch glitches');
  const data = await res.json();
  return data.map(mapGlitch);
}

// Fetches all users from backend.
// Converte cada objeto User do formato do backend para o formato do frontend via mapUser().
async function fetchUsers() {
  if (USE_MOCK) return MOCK_USERS;
  const res = await fetch(`${API_BASE}/users`);
  if (!res.ok) throw new Error('Failed to fetch users');
  const data = await res.json();
  return data.map(mapUser);
}

// Sends a new glitch to the backend.
// NOTA: O frontend envia priority e status como strings legíveis.
//       Antes de enviar, convertemos para os enums do backend (UPPER_SNAKE_CASE).
//       O assignedTo (nome do user) não é enviado aqui — a associação ao user
//       é feita separadamente via PATCH /api/glitches/{id}/users se necessário.
//       O glitchStatus inicial é sempre IDENTIFIED.
async function postGlitch(glitchData) {
  if (USE_MOCK) {
    const newGlitch = { id: Date.now(), ...glitchData, status: 'Identified' };
    MOCK_GLITCHES.push(newGlitch);
    return newGlitch;
  }

  const res = await fetch(`${API_BASE}/glitches`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title:          glitchData.title,
      description:    glitchData.description,
      glitchPriority: priorityReverseMap[glitchData.priority],
      glitchStatus:   'IDENTIFIED',
    }),
  });

  if (!res.ok) throw new Error('Failed to create glitch');
  return mapGlitch(await res.json());
}

// Updates the status of a glitch (e.g., Identified -> Bending the Rules -> System Fixed).
// NOTA: Função usada para MOVER o glitch para a próxima coluna do Kanban.
//       O backend espera o objeto com o campo "glitchStatus" em UPPER_SNAKE_CASE.
//       O endpoint do backend é PUT (não PATCH) — /api/glitches/{id}/status.
async function updateGlitchStatus(id, status) {
  if (USE_MOCK) {
    const g = MOCK_GLITCHES.find(g => g.id === id);
    if (g) g.status = status;
    return g;
  }

  const res = await fetch(`${API_BASE}/glitches/${id}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ glitchStatus: statusReverseMap[status] }),
  });

  if (!res.ok) throw new Error('Failed to update status');
  return mapGlitch(await res.json());
}

// =============================================================================
// PAGES (DASHBOARD, NEW GLITCH FORM, OPERATIVES)
// =============================================================================

// DASHBOARD
// Renders the main dashboard view.
// Displays statistics and organizes glitches into columns.
// NOTA: Reconstrói o HTML da dashboard, filtrando os glitches por status para as colunas.
async function renderDashboard() {
  const app = document.getElementById('app');
  app.innerHTML = `<div class="loading">&gt; SCANNING MATRIX FOR ANOMALIES...</div>`;

  let glitches;

  try {
    glitches = await fetchGlitches();
  } catch (err) {
    app.innerHTML = `<div class="msg error show">&gt; ERROR: Cannot connect to Oracle system. ${err.message}</div>`;
    return;
  }

  const cols = {
    'Identified':        glitches.filter(g => g.status === 'Identified'),
    'Bending the Rules': glitches.filter(g => g.status === 'Bending the Rules'),
    'System Fixed':      glitches.filter(g => g.status === 'System Fixed'),
  };

  const total = glitches.length;
  const fixed = cols['System Fixed'].length;

  app.innerHTML = `
    <div class="page-title">&gt; MATRIX_ANOMALY_DASHBOARD // <span>LIVE FEED</span></div>

    <div class="stats-bar">
      <div class="stat-chip"><strong>${total}</strong>Total Glitches</div>
      <div class="stat-chip"><strong>${cols['Identified'].length}</strong>Identified</div>
      <div class="stat-chip"><strong>${cols['Bending the Rules'].length}</strong>In Progress</div>
      <div class="stat-chip"><strong>${fixed}</strong>System Fixed</div>
    </div>

    <div class="kanban-board">
      ${renderColumn('IDENTIFIED', 'col-identified', cols['Identified'])}
      ${renderColumn('BENDING THE RULES', 'col-inprogress', cols['Bending the Rules'])}
      ${renderColumn('SYSTEM FIXED', 'col-fixed', cols['System Fixed'])}
    </div>
  `;
}

// Renders a single column in the Kanban board.
function renderColumn(title, cssClass, glitches) {
  return `
    <div class="kanban-col ${cssClass}">
      <div class="col-header">
        <span class="col-title">${title}</span>
        <span class="col-count">${glitches.length}</span>
      </div>
      <div class="col-cards">
        ${glitches.length === 0
          ? `<div class="empty-col">// NO ANOMALIES DETECTED //</div>`
          : glitches.map(renderCard).join('')
        }
      </div>
    </div>
  `;
}

// Renders an individual glitch card.
// NOTA: Gera o cartão. Se houver um "próximo estado" (next), adiciona o botão de seta (ao ultimo nao adiciona)
function renderCard(g) {
  const pClass = priorityClass[g.priority] || 'priority-low';
  const next = nextStatus[g.status];

  return `
    <div class="glitch-card" data-id="${g.id}">
      <div class="card-id">#GLT-${String(g.id).padStart(4, '0')}</div>
      <div class="card-title">${g.title}</div>

      <div class="card-footer">
        <span class="priority-badge ${pClass}">${g.priority}</span>
        <span class="card-assignee">@${g.assignedTo}</span>
      </div>

      ${
        next
          ? `<button class="btn-next-status" data-id="${g.id}" data-next="${next}">
              →
            </button>`
          : ''
      }
    </div>
  `;
}

// NEW GLITCH FORM
// Renders the form to create a new glitch.
// NOTA: Implementa dropdowns customizados para evitar bugs de cores em browsers como Firefox!
async function renderNewGlitch() {
  const app = document.getElementById('app');
  let users = [];

  try {
    users = await fetchUsers();
  } catch {}

  const priorityOptions = [
    { value: '',            label: '-- Choose priority --' },
    { value: 'Agent Smith', label: 'Agent Smith — Critical' },
    { value: 'High Alert',  label: 'High Alert' },
    { value: 'Glitch',      label: 'Glitch — Medium' },
    { value: 'Deja Vu',     label: 'Déjà Vu — Low' },
  ];

  // NOTA: Os operativos do dropdown vêm do backend (via fetchUsers + mapUser).
  //       Se o backend não estiver disponível, o dropdown fica apenas com a opção vazia.
  const assignOptions = [
    { value: '', label: '-- Choose operative --' },
    ...users.map(u => ({ value: u.name, label: u.name })),
  ];

  // Builds a fully custom dropdown (replaces native <select> for Firefox fix!)
  function buildDropdown(id, options) {
    const items = options.map(o =>
      `<div class="dd-option" data-value="${o.value}">${o.label}</div>`
    ).join('');

    return `
      <div class="dd-wrapper" id="${id}-wrapper">
        <div class="dd-selected" id="${id}-selected">${options[0].label}</div>
        <div class="dd-list" id="${id}-list">${items}</div>
        <input type="hidden" id="${id}" value="${options[0].value}" />
      </div>
    `;
  }

  app.innerHTML = `
    <div class="page-title">&gt; REPORT_NEW_GLITCH // <span>OPERATIVE INPUT</span></div>

    <div class="form-container">
      <div class="form-group">
        <label class="form-label">Glitch Title *</label>
        <input class="form-input" id="f-title" type="text" placeholder="Give your Glitch a Title..." />
      </div>

      <div class="form-group">
        <label class="form-label">Description</label>
        <textarea class="form-textarea" id="f-desc" placeholder="Describe the Anomaly..."></textarea>
      </div>

      <div class="form-group">
        <label class="form-label">Threat Level (Priority) *</label>
        ${buildDropdown('f-priority', priorityOptions)}
      </div>

      <div class="form-group">
        <label class="form-label">Assign to Operative *</label>
        ${buildDropdown('f-assign', assignOptions)}
      </div>

      <button class="btn-submit" id="btn-submit">&gt; INJECT INTO SYSTEM</button>

      <div class="msg success" id="msg-ok">&gt; GLITCH LOGGED. THE ORACLE HAS BEEN NOTIFIED.</div>
      <div class="msg error" id="msg-err">&gt; TRANSMISSION FAILED. TRY AGAIN.</div>
    </div>
  `;

  // Initializes each custom dropdown: toggle open/close and select an option.
  function initDropdown(id) {
    const selected = document.getElementById(`${id}-selected`);
    const list     = document.getElementById(`${id}-list`);
    const hidden   = document.getElementById(id);

    selected.addEventListener('click', (e) => {
      e.stopPropagation();
      document.querySelectorAll('.dd-list.open').forEach(l => {
        if (l !== list) l.classList.remove('open');
      });
      list.classList.toggle('open');
    });

    list.querySelectorAll('.dd-option').forEach(opt => {
      opt.addEventListener('click', (e) => {
        e.stopPropagation();
        selected.textContent = opt.textContent;
        hidden.value = opt.dataset.value;
        list.classList.remove('open');
        list.querySelectorAll('.dd-option').forEach(o => o.classList.remove('active'));
        opt.classList.add('active');
      });
    });
  }

  initDropdown('f-priority');
  initDropdown('f-assign');

  // Close dropdowns when clicking outside - se nao tivesse isto a lista do dropdwn ficava ali solta
  document.addEventListener('click', () => {
    document.querySelectorAll('.dd-list.open').forEach(l => l.classList.remove('open'));
  });

  // NOTA: Lógica de submissão do formulário. Valida campos e envia para a API (postGlitch).
  //       O assignedTo (nome do operativo) é enviado mas não é processado no POST do backend —
  //       a associação user<->glitch é feita via PATCH /api/glitches/{id}/users com o userId.
  //       Para ligar o operativo ao glitch após criação, seria necessário um segundo pedido.
  document.getElementById('btn-submit').addEventListener('click', async () => {
    const title      = document.getElementById('f-title').value.trim();
    const desc       = document.getElementById('f-desc').value.trim();
    const priority   = document.getElementById('f-priority').value;
    const assignedTo = document.getElementById('f-assign').value;

    if (!title) {
      showMsg('msg-err', 'ERROR: Glitch title is required.');
      return;
    }

    if (!priority) {
      showMsg('msg-err', 'ERROR: Threat level is required.');
      return;
    }

    if (!assignedTo) {
      showMsg('msg-err', 'ERROR: Assign an operative.');
      return;
    }

    try {
      await postGlitch({ title, description: desc, priority, assignedTo });
      showMsg('msg-ok');

      // Limpeza do formulário após sucesso - tenho que rever porque quando da erro e depois da sucess parece que fica ali imenso tempo a marinar
      document.getElementById('f-title').value = '';
      document.getElementById('f-desc').value  = '';
      document.getElementById('f-priority-selected').textContent = '-- Choose priority --';
      document.getElementById('f-priority').value = '';
      document.getElementById('f-assign-selected').textContent = '-- Choose operative --';
      document.getElementById('f-assign').value = '';
      document.querySelectorAll('.dd-option').forEach(o => o.classList.remove('active'));
    } catch (err) {
      showMsg('msg-err', `ERROR: ${err.message}`);
    }
  });
}

// Displays a temporary success or error message.
// NOTA: tenho que rever porque quando da erro e depois da sucess parece que fica ali imenso tempo a marinar
function showMsg(id, customText) {
  const el = document.getElementById(id);
  if (customText) el.textContent = `> ${customText}`;
  el.classList.add('show');
  setTimeout(() => {
    el.classList.remove('show');
  }, 4000);
}

// OPERATIVES
// Renders the operatives page.
// NOTA: Carrega a lista de operativos e conta quantos glitches ativos cada um tem atribuídos.
//       O avatar é construído pelo mapUser() com base no nome do user.
//       O role vem do enum UserRole do backend (ex: CAPTAIN, OPERATIVE...).
async function renderOperatives() {
  const app = document.getElementById('app');
  app.innerHTML = `<div class="loading">&gt; LOADING OPERATIVE ROSTER...</div>`;

  let users, glitches;

  try {
    [users, glitches] = await Promise.all([fetchUsers(), fetchGlitches()]);
  } catch (err) {
    app.innerHTML = `<div class="msg error show">&gt; ERROR: ${err.message}</div>`;
    return;
  }

  // 421 - create another div with mission completed
  const cards = users.map(u => {
    const count = glitches.filter(g => g.assignedTo === u.name && g.status !== 'System Fixed').length;

    return `
      <div class="operative-card">
        <div class="operative-avatar">
          <img src="${u.avatar}" alt="${u.name}" />
        </div>
        <div class="operative-name">${u.name}</div>
        <div class="operative-role">${u.role}</div>
        <div class="operative-count">${count} active mission${count !== 1 ? 's' : ''}</div>
      </div>
    `;
  }).join('');

  app.innerHTML = `
    <div class="page-title">&gt; NEBUCHADNEZZAR_CREW // <span>OPERATIVE STATUS</span></div>
    <div class="operatives-grid">${cards}</div>
  `;
}

// Handles clicks on the Kanban card status button.
// NOTA: Listener global para capturar cliques no botão de mudar status e atualizar a view.
//       Usa event delegation — o listener fica no document e filtra pelo botão correto.
document.addEventListener('click', async (e) => {
  const btn = e.target.closest('.btn-next-status');
  if (!btn) return;

  e.preventDefault();
  e.stopPropagation();

  const id   = Number(btn.dataset.id);
  const next = btn.dataset.next;

  try {
    await updateGlitchStatus(id, next);
    renderDashboard();
  } catch (err) {
    console.error(err);
  }
});

// =============================================================================
// MATRIX RAIN (Canvas)
// NOTA: Cria a animação clássica de queda de caracteres verdes num elemento <canvas>.
//       chars = '01アイウエカキクケサシスタチ'
// =============================================================================
function initMatrixRain() {
  const container = document.getElementById('matrixRain');
  const canvas = document.createElement('canvas');
  container.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  const CHAR_SIZE = 22;
  const FPS       = 24;
  const INTERVAL  = 1000 / FPS;

  function resize() {
    canvas.width  = Math.floor(window.innerWidth / CHAR_SIZE) * CHAR_SIZE;
    canvas.height = Math.floor(window.innerHeight / CHAR_SIZE) * CHAR_SIZE;
  }

  resize();

  let cols  = Math.floor(canvas.width / CHAR_SIZE);
  let drops = Array(cols).fill(1);
  const chars = '01アイウエカキクケサシスタチ'.split('');

  let lastTime = 0;
  let rafId;

  function draw(timestamp) {
    rafId = requestAnimationFrame(draw);
    if (timestamp - lastTime < INTERVAL) return;
    lastTime = timestamp;

    ctx.fillStyle = 'rgba(0,0,0,0.04)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#00ff41';
    ctx.shadowColor = '#00ff41';
    ctx.shadowBlur = 8;
    ctx.font = `${CHAR_SIZE}px Share Tech Mono, monospace`;

    for (let i = 0; i < drops.length; i++) {
      const char = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillText(char, i * CHAR_SIZE, drops[i] * CHAR_SIZE);

      if (drops[i] * CHAR_SIZE > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
  }

  rafId = requestAnimationFrame(draw);

  // NOTA: Desativa a animação se a page não tiver visível para poupar recursos.
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(rafId);
    } else {
      lastTime = 0;
      rafId = requestAnimationFrame(draw);
    }
  });

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      resize();
      cols  = Math.floor(canvas.width / CHAR_SIZE);
      drops = Array(cols).fill(1);
    }, 200);
  });
}

// CLOCK
// NOTA: Inicializa o relógio digital no cabeçalho.
//       Vai ser útil para quando implementar o created_at, updated_at e resolved_at.
function initClock() {
  const el = document.getElementById('clock');
  function tick() {
    const now = new Date();
    el.textContent = now.toLocaleTimeString('en-GB');
  }
  tick();
  setInterval(tick, 1000);
}

// =============================================================================
// INIT
// NOTA: Ponto de entrada do sistema. Ativa os efeitos visuais e carrega a página inicial.
// =============================================================================
initMatrixRain();
initClock();

const initialPath = window.location.pathname === '/' ? '/dashboard' : window.location.pathname;

loadPage(initialPath);
updateNav(initialPath);