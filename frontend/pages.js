import {
    fetchGlitches,
    fetchGlitchById,
    fetchUsers,
    postGlitch,
    postUser,
    deleteUser,
    resolveGlitch,
    uploadAvatar
} from './api.js';



import {
    renderColumn
} from './components.js';

import {
    showMsg,
    priorityClass,
    userAvatars,
    roleLabels,
    statusLabels,
    priorityLabels
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
    console.log('STATUS VALUES:', glitches.map(g => g.glitchStatus));
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
    glitches.filter(g => g.status === 'IDENTIFIED'),

    'Bending the Rules':
    glitches.filter(g => g.status === 'BENDING_THE_RULES'),

    'System Fixed':
    glitches.filter(g => g.status === 'SYSTEM_FIXED'),
};

const total = glitches.length;

const critical =
    glitches.filter(g => g.priority === 'AGENT_SMITH').length;

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

        <div class="stat-chip-agent-smith">
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
        `<option value="${u.id}">${u.name}</option>`
    )
    .join('');

    app.innerHTML = `
      <div class="page-title">
      > REPORT_NEW_GLITCH //
    <span>OPERATIVE INPUT</span>
    </div>

    <div class="glitch-card form-card">

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
                <option value="" disabled selected>
            -- Select Threat Level --
        </option>
        
        <option value="AGENT_SMITH">
            Agent Smith — CRITICAL
            </option>

            <option value="HIGH_ALERT">
            High Alert — HIGH
            </option>

            <option value="GLITCH">
            Glitch — MEDIUM
            </option>

            <option value="DEJA_VU">
            Déjà Vu — LOW
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
        
        const userId = document.getElementById('f-assign').value;
        
        await postGlitch({
            title,
            description: desc,
            glitchPriority: priority,
            user: userId ? { id: Number(userId) } : null
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

    app.innerHTML = `<div class="loading">> LOADING OPERATIVE ROSTER...</div>`;

    let users, glitches;

    try {
        [users, glitches] = await Promise.all([fetchUsers(), fetchGlitches()]);
    } catch (err) {
        app.innerHTML = `<div class="msg error show">> ERROR: ${err.message}</div>`;
        return;
    }

    const cards = users.map(u => {
        const count = glitches.filter(g =>
            g.assignedTo === u.name && g.status !== 'SYSTEM_FIXED'
        ).length;

        const profileUrl = u.profileUrl ? 
        (u.profileUrl.startsWith('http') ? 
        u.profileUrl : 'https://' + u.profileUrl)
        : "";

        return `
            <div class="operative-card">
            
                <div class="operative-url">

                    ${profileUrl ? 
                        `<a href="${profileUrl}" target="_blank" class="profile-link">
                    <img src="images/github.svg" alt="Github Profile" class="github-icon"></a>` 
                        : `<img src="images/github.svg" alt="Github Profile" class="github-icon">`}
                </div>


                <div class="operative-avatar">
                
<img
    src="${u.avatar
        ? `http://localhost:8080${u.avatar}`
        : (userAvatars[u.name] || 'images/avatar.jpg')}"
    alt="${u.name}"
/>
                </div>

                <div class="operative-name">${u.name}</div>
                <div class="operative-role">${roleLabels[u.userRole] || u.userRole}</div>
                <div class="operative-count">${count} active mission${count !== 1 ? 's' : ''}</div>
                <button class="btn-delete" data-user-id="${u.id}">✕ REMOVE</button>
            </div>
        `;
    }).join('');

    app.innerHTML = `
        <div class="page-title">
            > NEBUCHADNEZZAR_CREW // <span>OPERATIVE STATUS</span>
        </div>

        <button class="btn-submit" id="btn-add-operative">> ADD OPERATIVE</button>

        <div id="form-add-operative" style="display:none;">
            <div class="form-group">
                <label class="form-label">Name *</label>
                <input class="form-input" id="op-name" type="text" placeholder="Operative name..." />
          
                <label class="form-label">Github Profile</label>
                <input class="form-input" id="op-profile" type="text" placeholder="Github profile URL..." />
           

                <label class="form-label">Role *</label>
                <select class="form-select" id="op-role">
                    <option value="OPERATIVE">Operative</option>
                    <option value="CAPTAIN">Captain</option>
                    <option value="OPERATOR">Operator</option>
                    <option value="PROGRAMMER">Programmer</option>
                    <option value="ANALYST">Analyst</option>
                    <option value="ENGINEER">Engineer</option>
                    <option value="RECRUIT">Recruit</option>
                </select>
            


    <label class="form-label">PROFILE IMAGE *</label>

    <input class="form-input" id="op-avatar" type="file" accept=".png,.jpg,.jpeg,image/png,image/jpeg"/>
    </div>


            <button class="btn-submit" id="btn-submit-operative">> INJECT OPERATIVE</button>
            <div class="msg success" id="msg-op-ok">> OPERATIVE ADDED.</div>
            <div class="msg error" id="msg-op-err">> FAILED TO ADD OPERATIVE.</div>
        </div>

        <div class="operatives-grid">${cards}</div>
    `;

    // Toggle formulário
    document.getElementById('btn-add-operative').addEventListener('click', () => {
        const form = document.getElementById('form-add-operative');
        form.style.display = form.style.display === 'none' ? 'block' : 'none';
    });

    // Submeter novo operativo
    document.getElementById('btn-submit-operative').addEventListener('click', async () => {
        const name = document.getElementById('op-name').value.trim();
        const userRole = document.getElementById('op-role').value;
        const profileUrl = document.getElementById('op-profile').value.trim();
        const avatarFile = document.getElementById('op-avatar').files[0];

        if (!name) {
            showMsg('msg-op-err', 'ERROR: Name is required.');
            return;
        }

        try {
            let avatar = null;

            if (avatarFile) {
                avatar = await uploadAvatar(avatarFile);
            }

            console.log({
    name,
    userRole,
    profileUrl,
    avatar
});

            await postUser({
                name,
                userRole,
                profileUrl,
                avatar
            });

            showMsg('msg-op-ok');

            document.getElementById('op-name').value = '';
            document.getElementById('op-profile').value = '';
            document.getElementById('op-avatar').value = '';

            renderOperatives();

        } catch (err) {
            showMsg('msg-op-err', `ERROR: ${err.message}`);
        }
});

    // Apagar operativo
    document.querySelectorAll('.btn-delete[data-user-id]').forEach(btn => {
        btn.addEventListener('click', async () => {
            const userId = Number(btn.dataset.userId);
            try {
                await deleteUser(userId);
                renderOperatives();
            } catch (err) {
                console.error(err);
            }
        });
    });
}


// GLITCH DETAILS
// Renders the detail page for one glitch.
// The glitch ID comes from the current URL.
export async function renderGlitchDetails(id) {
    const app = document.getElementById('app');

    app.innerHTML = `
        <div class="loading">
            > LOADING GLITCH DETAILS...
        </div>
    `;

    let glitch;

    try {
        glitch = await fetchGlitchById(id);
    } catch (err) {
        app.innerHTML = `
            <div class="msg error show">
                > ERROR: Cannot load glitch details.
                ${err.message}
            </div>
        `;
        return;
    }

    const pClass = priorityClass[glitch.priority] || 'priority-low';

    const createdAt = glitch.createdAt
        ? new Date(glitch.createdAt).toLocaleString()
        : 'Unknown';

    const resolvedAt = glitch.resolvedAt
        ? new Date(glitch.resolvedAt).toLocaleString()
        : 'Not resolved';

    app.innerHTML = `
        <div class="page-title">
            > GLITCH_DETAILS //
            <span>#GLT-${String(glitch.id).padStart(4, '0')}</span>
        </div>

        <div class="glitch-card glitch-details-card">
            <div class="card-id">
                #GLT-${String(glitch.id).padStart(4, '0')}
            </div>

            <div class="card-title glitch-details-title">
                ${glitch.title}
            </div>

            <div class="card-footer glitch-details-footer">
                <span class="priority-badge ${pClass}">
                    ${priorityLabels[glitch.priority] || glitch.priority}
                </span>

                <span class="card-assignee">
                    @${glitch.assignedTo}
                </span>
            </div>

            <div class="glitch-details-section">
                <h3>> DESCRIPTION</h3>
                <p>${glitch.description || 'No description available.'}</p>
            </div>

            <div class="glitch-details-grid">
                <div class="detail-box">
                    <span>Status</span>
                    <strong>${statusLabels[glitch.status] || glitch.status}</strong>
                </div>

                <div class="detail-box ${pClass}">
                    <span>Priority</span>
                    <strong>${priorityLabels[glitch.priority] || glitch.priority}</strong>
                </div>

                <div class="detail-box">
                    <span>Assigned To</span>
                    <strong>${glitch.assignedTo}</strong>
                </div>

                <div class="detail-box">
                    <span>Role</span>
                    <strong>${roleLabels[glitch.assignedRole] || glitch.assignedRole || 'Unknown'}</strong>
                </div>

                <div class="detail-box">
                    <span>Created At</span>
                    <strong>${createdAt}</strong>
                </div>

                <div class="detail-box">
                    <span>Resolved At</span>
                    <strong>${resolvedAt}</strong>
                </div>
            </div>

          

            <button class="btn-submit" id="btn-back-dashboard">
                > RETURN TO DASHBOARD
            </button>


               ${glitch.status !== 'SYSTEM_FIXED' ? `
    <button class="btn-submit" id="btn-resolve-glitch">
        > MARK AS RESOLVED
    </button>
` : ''}
        </div>
    `;

    document
        .getElementById('btn-resolve-glitch')
        .addEventListener('click', async () => {

            try {
                await resolveGlitch(id);

                renderGlitchDetails(id);

            } catch (err) {

                console.error(err);
            }
        });

    document
        .getElementById('btn-back-dashboard')
        .addEventListener('click', () => {

            window.history.pushState({}, '', '/dashboard');

            renderDashboard();
        });
}





// ARCHIVE GLITCHES
// Shows all resolved / fixed glitches (history view)
export async function renderArchiveGlitches() {

    const app = document.getElementById('app');

    app.innerHTML = `<div class="loading">> ACCESSING ARCHIVE DATABASE...</div>`;

    let glitches;

    try {
        glitches = await fetchGlitches();
    } catch (err) {
        app.innerHTML = `<div class="msg error show">> ERROR: ${err.message}</div>`;
        return;
    }

    app.innerHTML = `
        <div class="page-title">
            > GLITCH_ARCHIVE // <span>HISTORICAL RECORDS</span>
        </div>

        <div class="stats-bar">
            <div class="stat-chip">
                <strong>${glitches.length}</strong>
                Total Glitches
            </div>
        </div>

        <div class="filter-bar">
            <select class="form-select" id="filter-status">
                <option value="">All Statuses</option>
                <option value="IDENTIFIED">Identified</option>
                <option value="BENDING_THE_RULES">Bending the Rules</option>
                <option value="SYSTEM_FIXED">System Fixed</option>
            </select>

            <select class="form-select" id="filter-priority">
                <option value="">All Priorities</option>
                <option value="AGENT_SMITH">Agent Smith — CRITICAL</option>
                <option value="HIGH_ALERT">High Alert — HIGH</option>
                <option value="GLITCH">Glitch — MEDIUM</option>
                <option value="DEJA_VU">Déjà Vu — LOW</option>
            </select>
        </div>

        <div class="archive-list" id="archive-list"></div>
    `;

    function renderList(filtered) {
        document.getElementById('archive-list').innerHTML = filtered.length === 0
            ? `<div class="empty-col">// NO GLITCHES FOUND //</div>`
            : filtered.map(g => {
                const pClass = priorityClass[g.priority] || 'priority-low';

                return `
                <div class="glitch-card archive-card" data-glitch-id="${g.id}">
                    <div class="card-id">#GLT-${String(g.id).padStart(4, '0')}</div>
                    <div class="card-title">${g.title}</div>
                    <div class="card-footer">
                        <span class="priority-badge ${pClass}">${g.priority}</span>
                        <span class="card-assignee">${g.assignedTo}</span>
                    </div>
                    <div class="archive-meta">
                        Created: ${g.createdAt ? new Date(g.createdAt).toLocaleString() : 'Unknown'}
                        ${g.resolvedAt ? `| Resolved: ${new Date(g.resolvedAt).toLocaleString()}` : ''}
                    </div>
                </div>
            `;
            }).join('');
    }

    function applyFilters() {
        const statusFilter = document.getElementById('filter-status').value;
        const priorityFilter = document.getElementById('filter-priority').value;

        const filtered = glitches.filter(g => {
            const matchStatus = !statusFilter || g.status === statusFilter;
            const matchPriority = !priorityFilter || g.priority === priorityFilter;
            return matchStatus && matchPriority;
        });

        renderList(filtered);
    }

    document.getElementById('filter-status').addEventListener('change', applyFilters);
    document.getElementById('filter-priority').addEventListener('change', applyFilters);

    // renderiza todos por defeito
    renderList(glitches);
}