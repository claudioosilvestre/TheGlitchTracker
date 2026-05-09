// UI ACTIONS
// Small shared UI helpers for future buttons, toggles and forms.


// Shows or hides an element by id.
export function toggleElementDisplay(id) {
    const el = document.getElementById(id);

    if (!el) {
        return;
    }

    el.style.display =
        el.style.display === 'none'
            ? 'block'
            : 'none';
}
