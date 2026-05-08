import { MOCK_GLITCHES, MOCK_USERS } from './mockData.js';


// When the backend is ready we MUST change this line
const API_BASE = 'http://localhost:8080/api';


// ATTENTION:
// this is the MOCK DATA until the backend isn't ready!
// THEN the fetchGlitches/fetchUsers functions will do the job.
const USE_MOCK = false;
// to be changed to false when backend is ready
// OR adjust we'll need to agree on approach




// API FUNCTIONS
// functions ready to connect to backend
// while not ready we're using mock data.


// Fetches all glitches from backend
// (now it's from mock data - REMOVE THIS COMMENT LATER when Backend connection is done)
// Returns a list of glitch objects.
export async function fetchGlitches() {

    if (USE_MOCK) {
    return MOCK_GLITCHES;
}

const res = await fetch(`${API_BASE}/glitches`);

if (!res.ok) {
    throw new Error('Failed to fetch glitches');
}

const data = await res.json();

return data.map(g => ({
    id: g.id,
    title: g.title,
    description: g.description,

    status: g.glitchStatus,        // IDENTIFIED / BENDING_THE_RULES / SYSTEM_FIXED
    priority: g.glitchPriority,    // GLITCH / HIGH_ALERT / AGENT_SMITH etc

    assignedTo: g.user?.name || 'Unassigned',

    createdAt: g.createdAt,
    resolvedAt: g.resolvedAt
}));
}


// Fetches all users from backend
// (now it's from mock data - REMOVE THIS COMMENT LATER when Backend connection is done)
// Returns a list of user objects.
export async function fetchUsers() {
    if (USE_MOCK) return MOCK_USERS;

    const res = await fetch(`${API_BASE}/users`);

    if (!res.ok) {
    throw new Error('Failed to fetch users');
}

return res.json();
}


// Sends a new glitch to the backend
// (now it adds to mock - REMOVE THIS COMMENT LATER when Backend connection is done)
// Automatically assigns a unique ID and default status.
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


// Updates the status of a glitch
// (e.g., Identified → Fixed)
export async function updateGlitchStatus(id, status) {
    if (USE_MOCK) {
    const g = MOCK_GLITCHES.find(g => g.id === id);

    if (g) {
        g.status = status;
    }

    return g;
}

const res = await fetch(`${API_BASE}/glitches/${id}/status`, {
    method: 'PATCH',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
});

if (!res.ok) {
    throw new Error('Failed to update status');
}

return res.json();
}