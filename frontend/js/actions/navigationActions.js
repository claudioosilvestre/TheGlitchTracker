import { requestNavigation } from '../utils.js';


// Navigates back to the dashboard using the SPA router.
export function bindBackDashboardButton() {
    document
        .getElementById('btn-back-dashboard')
        ?.addEventListener('click', () => {
            requestNavigation('/dashboard');
        });
}
