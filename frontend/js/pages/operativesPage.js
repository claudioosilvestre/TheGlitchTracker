import {
    fetchGlitches,
    fetchUsers
} from '../api.js';

import {
    renderOperativeAvatar,
    renderProfileLink
} from '../components.js';

import {
    bindOperativesActions
} from '../actions/operativeActions.js';

import {
    roleLabels
} from '../utils.js';


// OPERATIVES
// Renders the operatives page
// Shows all users and how many active glitches they have assigned
export async function renderOperatives() {
    const app = document.getElementById('app');

    app.innerHTML = `<div class="loading">> LOADING OPERATIVE ROSTER...</div>`;

    let users, glitches;

    try {
        [users, glitches] = await Promise.all([
            fetchUsers(),
            fetchGlitches()
        ]);
    } catch (err) {
        app.innerHTML = `<div class="msg error show">> ERROR: ${err.message}</div>`;
        return;
    }

    const cards = users.map(u => {
        const count = glitches.filter(g =>
            g.assignedTo === u.name && g.status !== 'SYSTEM_FIXED'
        ).length;

        return `
            <div class="operative-card">
                ${renderProfileLink(u.profileUrl)}

                ${renderOperativeAvatar(u)}

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

                <input
                    class="form-input"
                    id="op-avatar"
                    type="file"
                    accept=".png,.jpg,.jpeg,image/png,image/jpeg"
                />
            </div>

            <button class="btn-submit" id="btn-submit-operative">> INJECT OPERATIVE</button>
            <div class="msg success" id="msg-op-ok">> OPERATIVE ADDED.</div>
            <div class="msg error" id="msg-op-err">> FAILED TO ADD OPERATIVE.</div>
        </div>

        <div class="operatives-grid">${cards}</div>
    `;

    bindOperativesActions();
}
