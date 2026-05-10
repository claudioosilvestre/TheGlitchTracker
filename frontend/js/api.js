import { MOCK_GLITCHES, MOCK_USERS } from './data/mockData.js';

const API_BASE = 'http://localhost:8080/api';
const USE_MOCK = false;


// Converts backend glitch response into frontend-friendly fields.
function mapGlitch(g) {
    return {
        id: g.id,
        title: g.title,
        description: g.description,

        status: g.glitchStatus,
        priority: g.glitchPriority,

        assignedTo: g.user?.name || 'Unassigned',
        assignedRole: g.user?.userRole || null,

        createdAt: g.createdAt,
        resolvedAt: g.resolvedAt
    };
}


// Fetches all glitches from backend.
export async function fetchGlitches() {
    if (USE_MOCK) {
        return MOCK_GLITCHES;
    }

    const res = await fetch(`${API_BASE}/glitches`);

    if (!res.ok) {
        throw new Error('Failed to fetch glitches');
    }

    const data = await res.json();

    return data.map(mapGlitch);
}


// Fetches one glitch by ID from the backend.
export async function fetchGlitchById(id) {
    const res = await fetch(`${API_BASE}/glitches/${id}`);

    if (!res.ok) {
        throw new Error('Failed to fetch glitch details');
    }

    const data = await res.json();

    return mapGlitch(data);
}


// Sends a new glitch to the backend.
export async function postGlitch(glitchData) {
    if (USE_MOCK) {
        const newGlitch = {
            id: Date.now(),
            ...glitchData,
            status: 'Identified',
        };

        MOCK_GLITCHES.push(newGlitch);

        return newGlitch;
    }

    const res = await fetch(`${API_BASE}/glitches`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(glitchData),
    });

    if (!res.ok) {
        throw new Error('Failed to create glitch');
    }

    return res.json();
}


// Updates the status of a glitch.
export async function updateGlitchStatus(id, status) {
    const res = await fetch(`${API_BASE}/glitches/${id}/status`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            glitchStatus: status
        }),
    });

    if (!res.ok) {
        throw new Error('Failed to update status');
    }

    return res.json();
}


// Updates glitch priority.
export async function updateGlitchPriority(id, priority) {
    const res = await fetch(`${API_BASE}/glitches/${id}/priority`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            glitchPriority: priority
        }),
    });

    if (!res.ok) {
        throw new Error('Failed to update priority');
    }

    return res.json();
}


// Assigns a user to a glitch.
export async function assignUserToGlitch(id, userId) {
    const res = await fetch(`${API_BASE}/glitches/${id}/users`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            userId: Number(userId)
        }),
    });

    if (!res.ok) {
        throw new Error('Failed to assign user');
    }

    return res.json();
}


// Marks glitch as resolved.
export async function resolveGlitch(id) {
    const res = await fetch(`${API_BASE}/glitches/${id}/resolve`, {
        method: 'PUT',
    });

    if (!res.ok) {
        throw new Error('Failed to resolve glitch');
    }

    return res.json();
}


// Fetches all users from backend.
export async function fetchUsers() {
    if (USE_MOCK) {
        return MOCK_USERS;
    }

    const res = await fetch(`${API_BASE}/users`);

    if (!res.ok) {
        throw new Error('Failed to fetch users');
    }

    return res.json();
}


// Creates one user / operative.
export async function postUser(userData) {
    const res = await fetch(`${API_BASE}/users`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });

    if (!res.ok) {
        throw new Error('Failed to create user');
    }

    return res.json();
}


// Deletes one user / operative.
export async function deleteUser(id) {
    const res = await fetch(`${API_BASE}/users/${id}`, {
        method: 'DELETE',
    });

    if (!res.ok) {
        throw new Error('Failed to delete user');
    }
}


// Uploads an operative avatar image.
export async function uploadAvatar(file) {
    const formData = new FormData();

    formData.append('file', file);

    const res = await fetch(`${API_BASE}/users/upload-avatar`, {
        method: 'POST',
        body: formData,
    });

    if (!res.ok) {
        throw new Error('Failed to upload avatar');
    }

    return res.text();
}

// Delete Glitch
export async function deleteGlitch(id) {
    const res = await fetch(`${API_BASE}/glitches/${id}`, {
        method: 'DELETE',
    });

    if (!res.ok) {
        throw new Error('Failed to delete glitch');
    }
}