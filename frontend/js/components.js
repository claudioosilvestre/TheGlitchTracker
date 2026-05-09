import {
    BACKEND_BASE_URL,
    priorityClass,
    priorityLabels,
    userAvatars,
} from './utils.js';


// Renders an individual glitch card
// Displays ID, title, priority and assigned user
export function renderCard(g) {
    const pClass = priorityClass[g.priority] || 'priority-low';

    return `
    <div class="glitch-card" data-glitch-id="${g.id}">
        <div class="card-id">
            #GLT-${String(g.id).padStart(4, '0')} 
        </div>

        <div class="card-title">
            ${g.title}
        </div>

        <div class="card-footer">
            <span class="priority-badge ${pClass}">
                ${priorityLabels[g.priority] || g.priority}
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


// Renders a GitHub/profile icon.
// If profileUrl exists, the icon becomes a link.
export function renderProfileLink(profileUrl) {
    const normalizedUrl =
        profileUrl
            ? (profileUrl.startsWith('http')
                ? profileUrl
                : 'https://' + profileUrl)
            : '';

    return `
        <div class="operative-url">
            ${
                normalizedUrl
                    ? `<a href="${normalizedUrl}" target="_blank" class="profile-link">
                        <img src="images/github.svg" alt="Github Profile" class="github-icon">
                    </a>`
                    : `<img src="images/github.svg" alt="Github Profile" class="github-icon">`
            }
        </div>
    `;
}


// Renders operative avatar.
// Uses backend uploaded image when available, otherwise falls back to local image.
export function renderOperativeAvatar(user) {
    const src =
        user.avatar
            ? `${BACKEND_BASE_URL}${user.avatar}`
            : (userAvatars[user.name] || 'images/avatar.jpg');

    return `
        <div class="operative-avatar">
            <img src="${src}" alt="${user.name}" />
        </div>
    `;
}
