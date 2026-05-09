import {
    fetchUsers,
    postGlitch,
    resolveGlitch,
    updateGlitchStatus,
    updateGlitchPriority,
    assignUserToGlitch
} from '../api.js';

import { renderGlitchDetails } from '../pages/glitchDetailsPage.js';

import { showMsg } from '../utils.js';


// Loads users and creates the option list used by the New Glitch form.
export async function buildUserOptions() {
    let users = [];

    try {
        users = await fetchUsers();
    } catch {}

    return users
        .map(u => `<option value="${u.id}">${u.name}</option>`)
        .join('');
}


// Submits the New Glitch form.
export function bindNewGlitchForm() {
    document
        .getElementById('btn-submit')
        ?.addEventListener('click', async () => {
            const title =
                document.getElementById('f-title').value.trim();

            const desc =
                document.getElementById('f-desc').value.trim();

            const priority =
                document.getElementById('f-priority').value;

            const userId =
                document.getElementById('f-assign').value;

            if (!title) {
                showMsg('msg-err', 'ERROR: Glitch title is required.');
                return;
            }

            if (!priority) {
                showMsg('msg-err', 'ERROR: Threat level is required.');
                return;
            }

            try {
                await postGlitch({
                    title,
                    description: desc,
                    glitchPriority: priority,
                    user: userId ? { id: Number(userId) } : null
                });

                showMsg('msg-ok');

                document.getElementById('f-title').value = '';
                document.getElementById('f-desc').value = '';
                document.getElementById('f-priority').value = '';

            } catch (err) {
                showMsg('msg-err', `ERROR: ${err.message}`);
            }
        });
}


// Enables edit mode and saves glitch changes.
export function bindEditGlitchButton(id) {
    const editButton =
        document.getElementById('btn-edit-glitch');

    const saveButton =
        document.getElementById('btn-save-glitch');

    if (!editButton || !saveButton) {
        return;
    }

    editButton.addEventListener('click', () => {
        document
            .querySelectorAll('.view-mode')
            .forEach(el => {
                el.style.display = 'none';
            });

        document
            .querySelectorAll('.edit-mode')
            .forEach(el => {
                el.style.display = 'block';
            });

        editButton.style.display = 'none';
        saveButton.style.display = 'inline-block';
    });

    saveButton.addEventListener('click', async () => {
        const status =
            document.getElementById('edit-status').value;

        const priority =
            document.getElementById('edit-priority').value;

        const userId =
            document.getElementById('edit-user').value;

        try {
            await updateGlitchStatus(id, status);
            await updateGlitchPriority(id, priority);
            await assignUserToGlitch(id, userId);

            renderGlitchDetails(id);

        } catch (err) {
            console.error(err);
        }
    });
}


// Marks one glitch as resolved and reloads the detail page.
export function bindResolveGlitchButton(id) {
    document
        .getElementById('btn-resolve-glitch')
        ?.addEventListener('click', async () => {
            try {
                await resolveGlitch(id);

                renderGlitchDetails(id);

            } catch (err) {
                console.error(err);
            }
        });
}