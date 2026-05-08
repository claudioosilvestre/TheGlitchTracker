import {
    renderDashboard,
    renderNewGlitch,
    renderOperatives,
    renderArchiveGlitches
} from './pages.js';

import {
    initMatrixRain,
    initClock
} from './effects.js';


// ROUTER (History API)
const routes = {
    '/dashboard': renderDashboard,
    '/new-glitch': renderNewGlitch,
    '/operatives': renderOperatives,
    '/archive-glitches': renderArchiveGlitches,
};


// Navigates to a new "page" without reloading the browser.
// Updates the URL using the History API and renders the correct view.
function navigate(path) {
    window.history.pushState({}, '', path);

    loadPage(path);

    updateNav(path);
}

// Loads and renders the page based on the current path.
// If the route does not exist, it defaults to the dashboard.
function loadPage(path) {
    const render =
    routes[path] || renderDashboard;

    render();
}

// Updates the navigation UI.
// Adds or removes the "active" class based on the current route.
function updateNav(path) {
    document
    .querySelectorAll('.nav-link')
    .forEach(link => {

        link.classList.toggle(
        'active',
        link.dataset.page === path.replace('/', '')
    );
    });
}


// Listens for browser back/forward button actions.
// Ensures the correct page is rendered when navigation history changes.
window.addEventListener('popstate', () => {

    const path = window.location.pathname;

    loadPage(path);

    updateNav(path);
});


// Intercepts clicks on navigation links.
// Prevents full page reload and uses SPA navigation instead.
document.addEventListener('click', e => {

    const link = e.target.closest('.nav-link');

    if (link) {
    e.preventDefault();

    navigate(link.getAttribute('href'));
}
});


// INIT
// Initializes visual effects and clock.
// Loads the correct page based on the current URL.
initMatrixRain();

initClock();

const initialPath =
window.location.pathname === '/'
    ? '/dashboard'
    : window.location.pathname;

loadPage(initialPath);

updateNav(initialPath);