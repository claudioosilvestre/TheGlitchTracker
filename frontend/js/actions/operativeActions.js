import {
    deleteUser,
    postUser,
    uploadAvatar
} from '../api.js';

import { renderOperatives } from '../pages/operativesPage.js';

import { showMsg } from '../utils.js';


// Toggle formulário
export function bindAddOperativeToggle() {
    document
        .getElementById('btn-add-operative')
        ?.addEventListener('click', () => {
            const form = document.getElementById('form-add-operative');

            form.style.display =
                form.style.display === 'none'
                    ? 'block'
                    : 'none';
        });
}


// Submeter novo operativo
export function bindSubmitOperative() {
    document
        .getElementById('btn-submit-operative')
        ?.addEventListener('click', async () => {
            const name = document.getElementById('op-name').value.trim();
            const userRole = document.getElementById('op-role').value;
            const profileUrl = document.getElementById('op-profile').value.trim();
            const avatarFile = document.getElementById('op-avatar').files[0];

            if (!name) {
                showMsg('msg-op-err', 'ERROR: Name is required.');
                return;
            }

            try {
                let avatar = null;

                if (avatarFile) {
                    avatar = await uploadAvatar(avatarFile);
                }

                await postUser({
                    name,
                    userRole,
                    profileUrl,
                    avatar
                });

                showMsg('msg-op-ok');

                document.getElementById('op-name').value = '';
                document.getElementById('op-profile').value = '';
                document.getElementById('op-avatar').value = '';

                renderOperatives();

            } catch (err) {
                showMsg('msg-op-err', `ERROR: ${err.message}`);
            }
        });
}


// Apagar operativo
export function bindDeleteOperativeButtons() {
    document
        .querySelectorAll('.btn-delete[data-user-id]')
        .forEach(btn => {
            btn.addEventListener('click', async () => {
                const userId = Number(btn.dataset.userId);

                try {
                    await deleteUser(userId);

                    renderOperatives();

                } catch (err) {
                    console.error(err);
                }
            });
        });
}


// Binds all operative page actions.
export function bindOperativesActions() {
    bindAddOperativeToggle();

    bindSubmitOperative();

    bindDeleteOperativeButtons();
}
