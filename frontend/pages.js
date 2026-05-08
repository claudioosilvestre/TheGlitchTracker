import {
    fetchGlitches,
    fetchUsers,
    postGlitch
} from './api.js';

import {
    renderColumn
} from './components.js';

import {
    showMsg
} from './utils.js';


// PAGES
// (DASHBOARD, NEW GLITCH FORM, OPERATIVES)


// DASHBOARD
// Renders the main dashboard view.
// Displays statistics and organizes glitches into columns.
export async function renderDashboard() {
    const app = document.getElementById('app');

    app.innerHTML = `
    <div class="loading">
    > SCANNING MATRIX FOR ANOMALIES...
    </div>
    `;

    let glitches;

    try {
    glitches = await fetchGlitches();
    console.log('GLITCHES FROM API:', glitches);
} catch (err) {
    app.innerHTML = `
    <div class="msg error show">
        > ERROR: Cannot connect to Oracle system.
        ${err.message}
        </div>
    `;
    return;
}

const cols = {
    'Identified':
    glitches.filter(g => g.status === 'Identified'),

    'Bending the Rules':
    glitches.filter(g => g.status === 'Bending the Rules'),

    'System Fixed':
    glitches.filter(g => g.status === 'System Fixed'),
};

const total = glitches.length;

const critical =
    glitches.filter(g => g.priority === 'Agent Smith').length;

    const fixed =
    cols['System Fixed'].length;

    app.innerHTML = `
    <div class="page-title">
      > MATRIX_ANOMALY_DASHBOARD //
    <span>LIVE FEED</span>
    </div>

    <div class="stats-bar">
    <div class="stat-chip">
        <strong>${total}</strong>
        Total Glitches
        </div>

        <div class="stat-chip">
        <strong>${cols['Identified'].length}</strong>
        Identified
        </div>

        <div class="stat-chip">
        <strong>${cols['Bending the Rules'].length}</strong>
        In Progress
        </div>

        <div class="stat-chip">
        <strong>${fixed}</strong>
        System Fixed
        </div>

        <div class="stat-chip">
        <strong>${critical}</strong>
        ⚠ Agent Smith Level
        </div>
    </div>

    <div class="kanban-board">
    ${renderColumn(
        'IDENTIFIED',
        'col-identified',
        cols['Identified']
    )}

    ${renderColumn(
        'BENDING THE RULES',
        'col-inprogress',
        cols['Bending the Rules']
    )}

    ${renderColumn(
        'SYSTEM FIXED',
        'col-fixed',
        cols['System Fixed']
    )}
    </div>
    `;
}


// NEW GLITCH FORM
// Renders the form to create a new glitch.
// Loads users and allows assigning a glitch to an operative.
export async function renderNewGlitch() {
    const app = document.getElementById('app');

    let users = [];

    try {
    users = await fetchUsers();
} catch {}

const userOptions = users
    .map(u =>
        `<option value="${u.name}">${u.name}</option>`
    )
    .join('');

    app.innerHTML = `
    <div class="page-title">
      > REPORT_NEW_GLITCH //
    <span>OPERATIVE INPUT</span>
    </div>

    <div class="form-container">

    <div class="form-group">
        <label class="form-label">
          Glitch Title *
        </label>

        <input
        class="form-input"
        id="f-title"
        type="text"
        placeholder="Describe the anomaly..."
        />
        </div>

        <div class="form-group">
        <label class="form-label">
        Description
        </label>

        <textarea
        class="form-textarea"
        id="f-desc"
        placeholder="Additional intel..."
        ></textarea>
        </div>

        <div class="form-group">
        <label class="form-label">
          Threat Level (Priority) *
        </label>

        <select class="form-select" id="f-priority">
        <option value="Agent Smith">
            Agent Smith — Critical
            </option>

            <option value="High Alert">
            High Alert
            </option>

            <option value="Glitch">
            Glitch — Medium
            </option>

            <option value="Deja Vu">
            Déjà Vu — Low
            </option>
        </select>
        </div>

        <div class="form-group">
        <label class="form-label">
        Assign to Operative
        </label>

        <select class="form-select" id="f-assign">
        <option value="">
            -- Unassigned --
            </option>

            ${userOptions}
        </select>
        </div>

        <button class="btn-submit" id="btn-submit">
        > INJECT INTO SYSTEM
        </button>

        <div class="msg success" id="msg-ok">
        > GLITCH LOGGED.
        THE ORACLE HAS BEEN NOTIFIED.
        </div>

        <div class="msg error" id="msg-err">
        > TRANSMISSION FAILED.
        TRY AGAIN.
        </div>

    </div>
    `;

    document
    .getElementById('btn-submit')
    .addEventListener('click', async () => {

        const title =
        document.getElementById('f-title').value.trim();

        const desc =
        document.getElementById('f-desc').value.trim();

        const priority =
        document.getElementById('f-priority').value;

        const assignedTo =
        document.getElementById('f-assign').value
        || 'Unassigned';

        if (!title) {
        showMsg(
            'msg-err',
            'ERROR: Glitch title is required.'
        );

        return;
    }

    try {
        await postGlitch({
            title,
            description: desc,
            priority,
            assignedTo
        });

        showMsg('msg-ok');

        document.getElementById('f-title').value = '';
        document.getElementById('f-desc').value = '';

    } catch (err) {
        showMsg(
            'msg-err',
            `ERROR: ${err.message}`
        );
    }
    });
}


// OPERATIVES
// Renders the operatives page
// Shows all users and how many active glitches they have assigned
export async function renderOperatives() {
    const app = document.getElementById('app');

    app.innerHTML = `
    <div class="loading">
    > LOADING OPERATIVE ROSTER...
    </div>
    `;

    let users;
    let glitches;

    try {
    [users, glitches] = await Promise.all([
        fetchUsers(),
        fetchGlitches()
    ]);
} catch (err) {
    app.innerHTML = `
    <div class="msg error show">
        > ERROR: ${err.message}
        </div>
    `;
    return;
}

const cards = users.map(u => {

    const count = glitches.filter(g =>
        g.assignedTo === u.name &&
        g.status !== 'System Fixed'
    ).length;

    return `
    <div class="operative-card">
        <div class="operative-avatar">
        ${u.avatar || '👤'}
        </div>

        <div class="operative-name">
        ${u.name}
        </div>

        <div class="operative-role">
        ${u.role}
        </div>

        <div class="operative-count">
        ${count} active mission${count !== 1 ? 's' : ''}
        </div>
        </div>
    `;
}).join('');

app.innerHTML = `
    <div class="page-title">
      > NEBUCHADNEZZAR_CREW //
    <span>OPERATIVE STATUS</span>
    </div>

    <div class="operatives-grid">
    ${cards}
    </div>
`;
}