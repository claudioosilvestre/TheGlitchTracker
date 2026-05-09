import { renderDashboard } from './pages/dashboardPage.js';
import { renderNewGlitch } from './pages/newGlitchPage.js';
import { renderOperatives } from './pages/operativesPage.js';
import { renderGlitchDetails } from './pages/glitchDetailsPage.js';
import { renderArchiveGlitches } from './pages/archiveGlitchesPage.js';


// ROUTER (History API)
const routes = {
    '/dashboard': renderDashboard,
    '/new-glitch': renderNewGlitch,
    '/operatives': renderOperatives,
    '/archive-glitches': renderArchiveGlitches,
};


// Navigates to a new "page" without reloading the browser.
// Updates the URL using the History API and renders the correct view.
export function navigate(path) {
    window.history.pushState({}, '', path);

    loadPage(path);

    updateNav(path);
}


// Loads and renders the page based on the current path.
// Supports both fixed routes and dynamic glitch detail routes.
export function loadPage(path) {
    const glitchDetailsMatch = path.match(/^\/glitches\/(\d+)$/);

    if (glitchDetailsMatch) {
        const id = Number(glitchDetailsMatch[1]);

        renderGlitchDetails(id);

        return;
    }

    const render =
        routes[path] || renderDashboard;

    render();
}


// Updates the navigation UI.
// Adds or removes the "active" class based on the current route.
export function updateNav(path) {
    document
        .querySelectorAll('.nav-link')
        .forEach(link => {
            link.classList.toggle(
                'active',
                link.dataset.page === path.replace('/', '')
            );
        });
}


// Intercepts clicks on navigation links.
// Prevents full page reload and uses SPA navigation instead.
// Accepts clicks on Glitch Cards to show the Glitch details page.
function bindGlobalNavigation() {
    document.addEventListener('click', e => {
        const link = e.target.closest('.nav-link');
        const card = e.target.closest('[data-glitch-id]');

        if (link) {
            e.preventDefault();

            navigate(link.getAttribute('href'));

            return;
        }

        if (card) {
            const id = card.dataset.glitchId;

            navigate(`/glitches/${id}`);
        }
    });
}


// Listens for custom navigation events.
// Useful for page buttons without importing router everywhere.
function bindCustomNavigationEvents() {
    window.addEventListener('app:navigate', e => {
        navigate(e.detail);
    });
}


// Listens for browser back/forward button actions.
// Ensures the correct page is rendered when navigation history changes.
function bindBrowserHistory() {
    window.addEventListener('popstate', () => {
        const path = window.location.pathname;

        loadPage(path);

        updateNav(path);
    });
}


// Initializes router and loads the first page.
export function initRouter() {
    bindGlobalNavigation();

    bindCustomNavigationEvents();

    bindBrowserHistory();

    const initialPath =
        window.location.pathname === '/'
            ? '/dashboard'
            : window.location.pathname;

    loadPage(initialPath);

    updateNav(initialPath);
}
