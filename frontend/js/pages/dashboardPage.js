import { fetchGlitches } from '../api.js';

import { renderColumn } from '../components.js';


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


