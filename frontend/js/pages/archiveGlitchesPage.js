import { fetchGlitches } from '../api.js';

import {
    formatDateTime,
    priorityClass,
    priorityLabels
} from '../utils.js';


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
        document.getElementById('archive-list').innerHTML =
            filtered.length === 0
                ? `<div class="empty-col">// NO GLITCHES FOUND //</div>`
                : filtered.map(g => {
                    const pClass =
                        priorityClass[g.priority] || 'priority-low';

                    return `
                        <div class="glitch-card archive-card" data-glitch-id="${g.id}">
                            <div class="card-id">#GLT-${String(g.id).padStart(4, '0')}</div>
                            <div class="card-title">${g.title}</div>
                            <div class="card-footer">
                                <span class="priority-badge ${pClass}">
                                    ${priorityLabels[g.priority] || g.priority}
                                </span>
                                <span class="card-assignee">${g.assignedTo}</span>
                            </div>
                            <div class="archive-meta">
                                Created: ${formatDateTime(g.createdAt)}
                                ${g.resolvedAt ? `| Resolved: ${formatDateTime(g.resolvedAt)}` : ''}
                            </div>
                        </div>
                    `;
                }).join('');
    }

    function applyFilters() {
        const statusFilter =
            document.getElementById('filter-status').value;

        const priorityFilter =
            document.getElementById('filter-priority').value;

        const filtered = glitches.filter(g => {
            const matchStatus =
                !statusFilter || g.status === statusFilter;

            const matchPriority =
                !priorityFilter || g.priority === priorityFilter;

            return matchStatus && matchPriority;
        });

        renderList(filtered);
    }

    document
        .getElementById('filter-status')
        .addEventListener('change', applyFilters);

    document
        .getElementById('filter-priority')
        .addEventListener('change', applyFilters);

    // renderiza todos por defeito
    renderList(glitches);
}
