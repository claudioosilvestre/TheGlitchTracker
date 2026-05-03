
// When the backend is ready we MUST change this line
const API_BASE = 'http://localhost:8080/api';

// ATTENTION: this is the MOCK DATA until the backend isn't ready! THEN the fetchGlitches/fetchUsers functions will to the job.

let MOCK_GLITCHES = [
  { id: 1, title: "Agent detected near the Oracle's kitchen", description: "System anomaly in sector 7G. Possible Smith replication.", status: "Identified", priority: "Agent Smith", assignedTo: "Neo" },
  { id: 2, title: "Déjà vu loop in Mega City East", description: "Cat seen twice. Matrix being altered.", status: "Identified", priority: "Deja Vu", assignedTo: "Trinity" },
  { id: 3, title: "Phone line compromised at Booth 42", description: "Exit route blocked. Requires immediate investigation.", status: "Bending the Rules", priority: "High Alert", assignedTo: "Morpheus" },
  { id: 4, title: "Residual self-image corruption", description: "Operative's construct loading incorrectly.", status: "Bending the Rules", priority: "Deja Vu", assignedTo: "Neo" },
  { id: 5, title: "Zion broadcast signal restored", description: "Frequency interference resolved.", status: "System Fixed", priority: "Deja Vu", assignedTo: "Tank" },
  { id: 6, title: "Smith clone purged from subway grid", description: "Matrix integrity restored in affected zone.", status: "System Fixed", priority: "Agent Smith", assignedTo: "Trinity" },
];

const MOCK_USERS = [
  { id: 1, name: "Neo",      role: "The One",        avatar: "🕶️" },
  { id: 2, name: "Trinity",  role: "Operative",      avatar: "🔫" },
  { id: 3, name: "Morpheus", role: "Captain",        avatar: "🚢" },
  { id: 4, name: "Tank",     role: "Operator",       avatar: "💻" },
];

// PRIORITY MAP
const priorityClass = {
  'Agent Smith': 'priority-critical',
  'High Alert':  'priority-high',
  'Glitch':      'priority-medium',
  'Deja Vu':     'priority-low',
};

// ROUTER (History API)
const routes = {
  '/dashboard':   renderDashboard,
  '/new-glitch':  renderNewGlitch,
  '/operatives':  renderOperatives,
};

// Navigates to a new "page" without reloading the browser.
// Updates the URL using the History API and renders the correct view.
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

// Intercepts clicks on navigation links.
// Prevents full page reload and uses SPA navigation instead.
document.addEventListener('click', e => {
  const link = e.target.closest('.nav-link');
  if (link) {
    e.preventDefault();
    navigate(link.getAttribute('href'));
  }
});

// API FUNCTIONS
// fucntions ready to connect to backend - while not ready we're using mock data.

const USE_MOCK = true; // to be chandef to false when backedn os ready OR adjust we'll need to agree on approach

// Fetches all glitches from backend (now it's fromn mock data - REMOVE THIS COMMENT LATER when Backend connection is done)
// Returns a list of glitch objects.
async function fetchGlitches() {
  if (USE_MOCK) return MOCK_GLITCHES;
  const res = await fetch(`${API_BASE}/glitches`);
  if (!res.ok) throw new Error('Failed to fetch glitches');
  return res.json();
}

// Fetches all users from backend (now it's fromn mock data - REMOVE THIS COMMENT LATER when Backend connection is done)
// Returns a list of user objects.
async function fetchUsers() {
  if (USE_MOCK) return MOCK_USERS;
  const res = await fetch(`${API_BASE}/users`);
  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
}

// Sends a new glitch to the backend (now it adds to mock - REMOVE THIS COMMENT LATER when Backend connection is done)
// Automatically assigns a unique ID and default status.
async function postGlitch(glitchData) {
  if (USE_MOCK) {
    const newGlitch = { id: Date.now(), ...glitchData, status: 'Identified' };
    MOCK_GLITCHES.push(newGlitch);
    return newGlitch;
  }
  const res = await fetch(`${API_BASE}/glitches`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(glitchData),
  });
  if (!res.ok) throw new Error('Failed to create glitch');
  return res.json();
}

// Updates the status of a glitch (e.g., Identified → Fixed)
async function updateGlitchStatus(id, status) {
  if (USE_MOCK) {
    const g = MOCK_GLITCHES.find(g => g.id === id);
    if (g) g.status = status;
    return g;
  }
  const res = await fetch(`${API_BASE}/glitches/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error('Failed to update status');
  return res.json();
}

// PAGES (DASHBOARD, NEW GLITCH FORM, OPERATIVES)

// DASHBOARD
// Renders the main dashboard view.
// Displays statistics and organizes glitches into columns.
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
    'Identified':       glitches.filter(g => g.status === 'Identified'),
    'Bending the Rules': glitches.filter(g => g.status === 'Bending the Rules'),
    'System Fixed':     glitches.filter(g => g.status === 'System Fixed'),
  };

  const total    = glitches.length;
  const critical = glitches.filter(g => g.priority === 'Agent Smith').length;
  const fixed    = cols['System Fixed'].length;

  app.innerHTML = `
    <div class="page-title">&gt; MATRIX_ANOMALY_DASHBOARD // <span>LIVE FEED</span></div>

    <div class="stats-bar">
      <div class="stat-chip"><strong>${total}</strong>Total Glitches</div>
      <div class="stat-chip"><strong>${cols['Identified'].length}</strong>Identified</div>
      <div class="stat-chip"><strong>${cols['Bending the Rules'].length}</strong>In Progress</div>
      <div class="stat-chip"><strong>${fixed}</strong>System Fixed</div>
      <div class="stat-chip"><strong>${critical}</strong>⚠ Agent Smith Level</div>
    </div>

    <div class="kanban-board">
      ${renderColumn('IDENTIFIED', 'col-identified', cols['Identified'])}
      ${renderColumn('BENDING THE RULES', 'col-inprogress', cols['Bending the Rules'])}
      ${renderColumn('SYSTEM FIXED', 'col-fixed', cols['System Fixed'])}
    </div>
  `;
}

// Renders a single column in the Kanban board.
// Each column represents a status (Identified, In Progress, Fixed).
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

// Renders an individual glitch card
// Displays ID, title, priority and assigned user
function renderCard(g) {
  const pClass = priorityClass[g.priority] || 'priority-low';
  return `
    <div class="glitch-card">
      <div class="card-id">#GLT-${String(g.id).padStart(4, '0')}</div>
      <div class="card-title">${g.title}</div>
      <div class="card-footer">
        <span class="priority-badge ${pClass}">${g.priority}</span>
        <span class="card-assignee">@${g.assignedTo || 'Unassigned'}</span>
      </div>
    </div>
  `;
}

// NEW GLITCH FORM
// Renders the form to create a new glitch.
// Loads users and allows assigning a glitch to an operative.
async function renderNewGlitch() {
  const app = document.getElementById('app');
  let users = [];
  try { users = await fetchUsers(); } catch {}

  const userOptions = users.map(u => `<option value="${u.name}">${u.name}</option>`).join('');

  app.innerHTML = `
    <div class="page-title">&gt; REPORT_NEW_GLITCH // <span>OPERATIVE INPUT</span></div>
    <div class="form-container">
      <div class="form-group">
        <label class="form-label">Glitch Title *</label>
        <input class="form-input" id="f-title" type="text" placeholder="Describe the anomaly..." />
      </div>
      <div class="form-group">
        <label class="form-label">Description</label>
        <textarea class="form-textarea" id="f-desc" placeholder="Additional intel..."></textarea>
      </div>
      <div class="form-group">
        <label class="form-label">Threat Level (Priority) *</label>
        <select class="form-select" id="f-priority">
          <option value="Agent Smith">Agent Smith — Critical</option>
          <option value="High Alert">High Alert</option>
          <option value="Glitch">Glitch — Medium</option>
          <option value="Deja Vu">Déjà Vu — Low</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Assign to Operative</label>
        <select class="form-select" id="f-assign">
          <option value="">-- Unassigned --</option>
          ${userOptions}
        </select>
      </div>
      <button class="btn-submit" id="btn-submit">&gt; INJECT INTO SYSTEM</button>
      <div class="msg success" id="msg-ok">&gt; GLITCH LOGGED. THE ORACLE HAS BEEN NOTIFIED.</div>
      <div class="msg error" id="msg-err">&gt; TRANSMISSION FAILED. TRY AGAIN.</div>
    </div>
  `;

  document.getElementById('btn-submit').addEventListener('click', async () => {
    const title    = document.getElementById('f-title').value.trim();
    const desc     = document.getElementById('f-desc').value.trim();
    const priority = document.getElementById('f-priority').value;
    const assignedTo = document.getElementById('f-assign').value || 'Unassigned';

    if (!title) {
      showMsg('msg-err', 'ERROR: Glitch title is required.');
      return;
    }

    try {
      await postGlitch({ title, description: desc, priority, assignedTo });
      showMsg('msg-ok');
      document.getElementById('f-title').value = '';
      document.getElementById('f-desc').value  = '';
    } catch (err) {
      showMsg('msg-err', `ERROR: ${err.message}`);
    }
  });
}

// Displays a temporary success or error message.
// Automatically hides after a few seconds
function showMsg(id, customText) {
  const el = document.getElementById(id);
  if (customText) el.textContent = `> ${customText}`;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 4000);
}

// OPERATIVES
// Renders the operatives page.
// Shows all users and how many active glitches they have assigned.
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

  const cards = users.map(u => {
    const count = glitches.filter(g => g.assignedTo === u.name && g.status !== 'System Fixed').length;
    return `
      <div class="operative-card">
        <div class="operative-avatar">${u.avatar || '👤'}</div>
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

  // MATRIX RAIN (Canvas)
// Creates the Matrix "rain" animation using a canvas element.
// Continuously draws falling characters on the screen.
function initMatrixRain() {
  const container = document.getElementById('matrixRain');
  const canvas = document.createElement('canvas');
  container.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;

  const cols   = Math.floor(canvas.width / 16);
  const drops  = Array(cols).fill(1);
  const chars  = '01アイウエオカキクケコサシスセソタチ'.split('');

  function draw() {
    ctx.fillStyle = 'rgba(0,0,0,0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#00ff41';
    ctx.font = '14px Share Tech Mono';
    drops.forEach((y, i) => {
      const char = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillText(char, i * 16, y * 16);
      if (y * 16 > canvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    });
  }

  setInterval(draw, 60);
  window.addEventListener('resize', () => {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}

// CLOCK
// Initializes and updates the live clock in the header.
// Refreshes every second.
function initClock() {
  const el = document.getElementById('clock');
  function tick() {
    const now = new Date();
    el.textContent = now.toLocaleTimeString('en-GB');
  }
  tick();
  setInterval(tick, 1000);
}

// INIT
// Initializes visual effects and clock.
// Loads the correct page based on the current URL.
initMatrixRain();
initClock();
const initialPath = window.location.pathname === '/' ? '/dashboard' : window.location.pathname;
loadPage(initialPath);
updateNav(initialPath);

}

