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

        // Fallback 60fps CSS transition
        const triggerCssFallback = () => {
            document.documentElement.classList.add('theme-transitioning');
            applyNextTheme();
            setTimeout(() => {
                document.documentElement.classList.remove('theme-transitioning');
            }, 450);
        };

        // Check if View Transitions API is supported and user doesn't request reduced motion
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (!document.startViewTransition || prefersReducedMotion) {
            triggerCssFallback();
            return;
        }

        // Compute origin coordinates for the circular expansion
        let x = window.innerWidth / 2;
        let y = 0;

        if (event && event.clientX !== undefined && event.clientY !== undefined && (event.clientX !== 0 || event.clientY !== 0)) {
            x = event.clientX;
            y = event.clientY;
        } else {
            const toggleBtn = document.getElementById('theme-toggle-desktop') || document.querySelector('.header-theme-toggle');
            if (toggleBtn) {
                const rect = toggleBtn.getBoundingClientRect();
                x = rect.left + rect.width / 2;
                y = rect.top + rect.height / 2;
            }
        }

        const endRadius = Math.hypot(
            Math.max(x, window.innerWidth - x),
            Math.max(y, window.innerHeight - y)
        );

        try {
            const transition = document.startViewTransition(() => {
                applyNextTheme();
            });

            transition.ready.then(() => {
                const clipPath = [
                    `circle(0px at ${x}px ${y}px)`,
                    `circle(${endRadius}px at ${x}px ${y}px)`
                ];

                document.documentElement.animate(
                    {
                        clipPath: clipPath
                    },
                    {
                        duration: 480,
                        easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
                        pseudoElement: '::view-transition-new(root)'
                    }
                );
            }).catch(() => {
                // Audio or layout safe fallback
            });
        } catch (e) {
            triggerCssFallback();
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
