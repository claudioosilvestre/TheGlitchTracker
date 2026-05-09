import { initRouter } from './router.js';

import {
    initMatrixRain,
    initClock
} from './effects.js';

import { initThemeSwitcher } from './theme.js';


// INIT
// Initializes visual effects, theme switcher and SPA router.
initMatrixRain();

initClock();

initThemeSwitcher();

initRouter();
