/* ==========================================================================
   THEME TOGGLE SYSTEM (CHANHDAI SYSTEM / LIGHT & DARK OBSIDIAN)
   ========================================================================== */

(function () {
    const THEME_STORAGE_KEY = 'portfolio_theme';

    function getPreferredTheme() {
        const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
        if (storedTheme === 'dark' || storedTheme === 'light') {
            return storedTheme;
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    function applyTheme(theme) {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
            document.documentElement.style.colorScheme = 'dark';
        } else {
            document.documentElement.classList.remove('dark');
            document.documentElement.style.colorScheme = 'light';
        }
    }

    function toggleTheme() {
        const isDark = document.documentElement.classList.contains('dark');
        const nextTheme = isDark ? 'light' : 'dark';
        localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
        applyTheme(nextTheme);

        // Sound effect integration if audio system exists
        if (window.playPortfolioSound) {
            window.playPortfolioSound('click');
        }
    }

    // Apply preferred theme on initial script execution
    applyTheme(getPreferredTheme());

    // Listen for system theme changes if user has not explicitly set a preference
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem(THEME_STORAGE_KEY)) {
            applyTheme(e.matches ? 'dark' : 'light');
        }
    });

    // Wire up theme toggles when DOM is interactive
    function initThemeListeners() {
        const toggleButtons = document.querySelectorAll(
            '#theme-toggle-desktop, .header-theme-toggle, [data-action="toggle-theme"]'
        );

        toggleButtons.forEach((btn) => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                toggleTheme();
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initThemeListeners);
    } else {
        initThemeListeners();
    }

    // Expose toggleTheme globally for cmdk or other scripts
    window.toggleTheme = toggleTheme;
})();
