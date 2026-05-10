// THEME SWITCHER
// Changes the active CSS theme dynamically.

const ORACLE_THEME = '/css/oracle.css';
const SLEEK_THEME = '/css/sleek.css';


// Updates the switch visual state.
function updateToggleVisual(themeButton, theme) {
    if (theme === ORACLE_THEME) {
        themeButton.classList.add('oracle-active');
    } else {
        themeButton.classList.remove('oracle-active');
    }
}


// Sets the active theme and persists it.
function setTheme(themeStylesheet, themeButton, theme) {
    themeStylesheet.setAttribute('href', theme);

    localStorage.setItem('theme', theme);

    document.body.dataset.theme =
        theme === ORACLE_THEME
            ? 'oracle'
            : 'sleek';

    updateToggleVisual(themeButton, theme);
}


// Initializes the theme switch button.
export function initThemeSwitcher() {
    const themeButton =
        document.getElementById('btn-theme-toggle');

    const themeStylesheet =
        document.getElementById('themeStylesheet');

    if (!themeButton || !themeStylesheet) {
        return;
    }

    const savedTheme =
        localStorage.getItem('theme');

    const initialTheme =
        savedTheme || SLEEK_THEME;

    setTheme(themeStylesheet, themeButton, initialTheme);

    themeButton.addEventListener('click', () => {
        const currentTheme =
            themeStylesheet.getAttribute('href');

        const nextTheme =
            currentTheme === ORACLE_THEME
                ? SLEEK_THEME
                : ORACLE_THEME;

        setTheme(themeStylesheet, themeButton, nextTheme);
    });
}
