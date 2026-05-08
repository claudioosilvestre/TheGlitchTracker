// PRIORITY MAP
export const priorityClass = {
    'Agent Smith': 'priority-critical',
    'High Alert': 'priority-high',
    'Glitch': 'priority-medium',
    'Deja Vu': 'priority-low',
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