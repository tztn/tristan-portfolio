/* ==========================================================================
   THEME TOGGLE SYSTEM (60 FPS VIEW TRANSITIONS & CHANHDAI OBSIDIAN CAD)
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

    function toggleTheme(event) {
        const isDark = document.documentElement.classList.contains('dark');
        const nextTheme = isDark ? 'light' : 'dark';

        // Play tactile click sound
        if (window.playPortfolioSound) {
            window.playPortfolioSound('click');
        } else if (window.soundcn && window.soundcn.playClickSoft) {
            window.soundcn.playClickSoft({ volume: 0.6 });
        }

        const applyNextTheme = () => {
            localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
            applyTheme(nextTheme);
        };

        // Fallback 60fps CSS transition if View Transitions API is not supported or user prefers reduced motion
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (!document.startViewTransition || prefersReducedMotion) {
            document.documentElement.classList.add('theme-transitioning');
            applyNextTheme();
            setTimeout(() => {
                document.documentElement.classList.remove('theme-transitioning');
            }, 450);
            return;
        }

        // Determine exact center coordinates of the toggle icon
        let targetBtn = (event && event.currentTarget && event.currentTarget.getBoundingClientRect) ? event.currentTarget : null;
        if (!targetBtn && event && event.target && event.target.closest) {
            targetBtn = event.target.closest('#theme-toggle-desktop, .header-theme-toggle, [data-action="toggle-theme"]');
        }
        if (!targetBtn) {
            targetBtn = document.getElementById('theme-toggle-desktop') || document.querySelector('.header-theme-toggle');
        }

        let x, y;
        if (targetBtn) {
            const rect = targetBtn.getBoundingClientRect();
            x = Math.round(rect.left + rect.width / 2);
            y = Math.round(rect.top + rect.height / 2);
        } else if (event && typeof event.clientX === 'number' && typeof event.clientY === 'number' && (event.clientX !== 0 || event.clientY !== 0)) {
            x = Math.round(event.clientX);
            y = Math.round(event.clientY);
        } else {
            x = Math.round(window.innerWidth - 36);
            y = 28;
        }

        // Calculate end radius and circle blur expansion bounds
        const maxDist = Math.hypot(
            Math.max(x, window.innerWidth - x),
            Math.max(y, window.innerHeight - y)
        );
        const endSize = Math.ceil(maxDist * 2.8);
        const halfSize = Math.ceil(endSize / 2);
        const endPosX = x - halfSize;
        const endPosY = y - halfSize;

        // Set CSS variables on root BEFORE starting the view transition for instant hardware-accelerated start
        const root = document.documentElement;
        root.style.setProperty('--toggle-x', `${x}px`);
        root.style.setProperty('--toggle-y', `${y}px`);
        root.style.setProperty('--mask-end-size', `${endSize}px`);
        root.style.setProperty('--mask-end-pos-x', `${endPosX}px`);
        root.style.setProperty('--mask-end-pos-y', `${endPosY}px`);

        // Suppress conflicting CSS color/background transitions during the snapshot
        root.classList.add('theme-transitioning-vt');

        // Trigger native CSS View Transition using @ncdai/theme-toggle-effect-circle-blur starting at icon
        try {
            const transition = document.startViewTransition(() => {
                applyNextTheme();
            });

            transition.finished.finally(() => {
                root.classList.remove('theme-transitioning-vt');
            });
        } catch (e) {
            root.classList.remove('theme-transitioning-vt');
            applyNextTheme();
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
                toggleTheme(e);
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initThemeListeners);
    } else {
        initThemeListeners();
    }

    // Expose toggleTheme globally for cmdk or other scripts
    window.toggleTheme = (event) => toggleTheme(event);
})();
