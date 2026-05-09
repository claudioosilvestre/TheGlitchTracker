export const userAvatars = {
    'Cláudio Silvestre': 'images/claudio.png',
    'Maria Sousa':  'images/maria.png',
    'Francisco Almeida': 'images/chico.png',
};

export const roleLabels = {
    'CAPTAIN':    'Captain',
    'OPERATIVE':  'Operative',
    'OPERATOR':   'Operator',
    'PROGRAMMER': 'Programmer',
};

// PRIORITY MAP
export const priorityClass = {
    'AGENT_SMITH': 'priority-critical',
    'HIGH_ALERT': 'priority-high',
    'GLITCH': 'priority-medium',
    'DEJA_VU': 'priority-low',
};

export const statusLabels = {
    'IDENTIFIED': 'Identified',
    'BENDING_THE_RULES': 'Bending the Rules',
    'SYSTEM_FIXED': 'System Fixed',
};

export const priorityLabels = {
    'AGENT_SMITH': 'Agent Smith',
    'HIGH_ALERT': 'High Alert',
    'GLITCH': 'Glitch',
    'DEJA_VU': 'Déjà Vu',
};


// Displays a temporary success or error message.
// Automatically hides after a few seconds
export function showMsg(id, customText) {
    const el = document.getElementById(id);

    if (customText) {
    el.textContent = `> ${customText}`;
}

el.classList.add('show');

setTimeout(() => {
    el.classList.remove('show');
}, 4000);
}