import { priorityClass } from './utils.js';


// Renders an individual glitch card
// Displays ID, title, priority and assigned user
export function renderCard(g) {
    const pClass = priorityClass[g.priority] || 'priority-low';

    return `
    <div class="glitch-card">
    <div class="card-id">
        #GLT-${String(g.id).padStart(4, '0')}
        </div>

        <div class="card-title">
        ${g.title}
        </div>

        <div class="card-footer">
        <span class="priority-badge ${pClass}">
        ${g.priority}
        </span>

        <span class="card-assignee">
        @${g.assignedTo || 'Unassigned'}
        </span>
        </div>
    </div>
    `;
}


// Renders a single column in the Kanban board.
// Each column represents a status
// (Identified, In Progress, Fixed).
export function renderColumn(title, cssClass, glitches) {
    return `
    <div class="kanban-col ${cssClass}">
    <div class="col-header">
        <span class="col-title">${title}</span>
        <span class="col-count">${glitches.length}</span>
        </div>

        <div class="col-cards">
        ${
            glitches.length === 0
            ? `<div class="empty-col">// NO ANOMALIES DETECTED //</div>`
            : glitches.map(renderCard).join('')
        }
        </div>
    </div>
    `;
}