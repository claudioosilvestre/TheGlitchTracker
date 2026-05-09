import {
    fetchGlitchById,
    fetchUsers
} from '../api.js';

import {
    bindResolveGlitchButton,
    bindEditGlitchButton
} from '../actions/glitchActions.js';

import {
    bindBackDashboardButton
} from '../actions/navigationActions.js';

import {
    formatDateTime,
    priorityClass,
    priorityLabels,
    roleLabels,
    statusLabels
} from '../utils.js';


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
    let users = [];

    try {
        [glitch, users] = await Promise.all([
            fetchGlitchById(id),
            fetchUsers()
        ]);
    } catch (err) {
        app.innerHTML = `
            <div class="msg error show">
                > ERROR: Cannot load glitch details.
                ${err.message}
            </div>
        `;
        return;
    }

    const pClass =
        priorityClass[glitch.priority] || 'priority-low';

    const createdAt =
        formatDateTime(glitch.createdAt);

    const resolvedAt =
        formatDateTime(glitch.resolvedAt, 'Not resolved');

    const userOptions = users
        .map(user => `
            <option value="${user.id}" ${user.name === glitch.assignedTo ? 'selected' : ''}>
                ${user.name}
            </option>
        `)
        .join('');

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

                    <strong class="view-mode">
                        ${statusLabels[glitch.status] || glitch.status}
                    </strong>

                    <select class="form-select edit-mode" id="edit-status" style="display:none;">
                        <option value="IDENTIFIED" ${glitch.status === 'IDENTIFIED' ? 'selected' : ''}>
                            Identified
                        </option>

                        <option value="BENDING_THE_RULES" ${glitch.status === 'BENDING_THE_RULES' ? 'selected' : ''}>
                            Bending the Rules
                        </option>

                        <option value="SYSTEM_FIXED" ${glitch.status === 'SYSTEM_FIXED' ? 'selected' : ''}>
                            System Fixed
                        </option>
                    </select>
                </div>

                <div class="detail-box ${pClass}">
                    <span>Priority</span>

                    <strong class="view-mode">
                        ${priorityLabels[glitch.priority] || glitch.priority}
                    </strong>

                    <select class="form-select edit-mode" id="edit-priority" style="display:none;">
                        <option value="AGENT_SMITH" ${glitch.priority === 'AGENT_SMITH' ? 'selected' : ''}>
                            Agent Smith — CRITICAL
                        </option>

                        <option value="HIGH_ALERT" ${glitch.priority === 'HIGH_ALERT' ? 'selected' : ''}>
                            High Alert — HIGH
                        </option>

                        <option value="GLITCH" ${glitch.priority === 'GLITCH' ? 'selected' : ''}>
                            Glitch — MEDIUM
                        </option>

                        <option value="DEJA_VU" ${glitch.priority === 'DEJA_VU' ? 'selected' : ''}>
                            Déjà Vu — LOW
                        </option>
                    </select>
                </div>

                <div class="detail-box">
                    <span>Assigned To</span>

                    <strong class="view-mode">
                        ${glitch.assignedTo}
                    </strong>

                    <select class="form-select edit-mode" id="edit-user" style="display:none;">
                        ${userOptions}
                    </select>
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

            <button class="btn-submit" id="btn-edit-glitch">
                > EDIT
            </button>

            <button class="btn-submit" id="btn-save-glitch" style="display:none;">
                > SAVE CHANGES
            </button>

            ${glitch.status !== 'SYSTEM_FIXED' ? `
                <button class="btn-submit" id="btn-resolve-glitch">
                    > MARK AS RESOLVED
                </button>
            ` : ''}
        </div>
    `;

    bindBackDashboardButton();

    bindEditGlitchButton(id);

    if (glitch.status !== 'SYSTEM_FIXED') {
        bindResolveGlitchButton(id);
    }
}