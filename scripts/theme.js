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
        let x = window.innerWidth - 36;
        let y = 28;

        const toggleBtn = document.getElementById('theme-toggle-desktop') || document.querySelector('.header-theme-toggle');
        if (toggleBtn) {
            const rect = toggleBtn.getBoundingClientRect();
            x = Math.round(rect.left + rect.width / 2);
            y = Math.round(rect.top + rect.height / 2);
        } else if (event && event.clientX && event.clientY) {
            x = Math.round(event.clientX);
            y = Math.round(event.clientY);
        }

        document.documentElement.style.setProperty('--toggle-x', `${x}px`);
        document.documentElement.style.setProperty('--toggle-y', `${y}px`);

        const endRadius = Math.hypot(
            Math.max(x, window.innerWidth - x),
            Math.max(y, window.innerHeight - y)
        );

        // Trigger native CSS View Transition using @ncdai/theme-toggle-effect-circle-blur starting at icon
        try {
            const transition = document.startViewTransition(() => {
                applyNextTheme();
            });

            transition.ready.then(() => {
                const endSize = Math.ceil(endRadius * 2.8);
                const halfEnd = Math.ceil(endSize / 2);
                document.documentElement.animate(
                    {
                        maskPosition: [
                            `${x}px ${y}px`,
                            `${x - halfEnd}px ${y - halfEnd}px`
                        ],
                        maskSize: [
                            `0px 0px`,
                            `${endSize}px ${endSize}px`
                        ],
                        WebkitMaskPosition: [
                            `${x}px ${y}px`,
                            `${x - halfEnd}px ${y - halfEnd}px`
                        ],
                        WebkitMaskSize: [
                            `0px 0px`,
                            `${endSize}px ${endSize}px`
                        ]
                    },
                    {
                        duration: 850,
                        easing: 'linear(0 0%, 0.1684 2.66%, 0.3165 5.49%, 0.446 8.52%, 0.5581 11.78%, 0.6535 15.29%, 0.7341 19.11%, 0.8011 23.3%, 0.8557 27.93%, 0.8962 32.68%, 0.9283 38.01%, 0.9529 44.08%, 0.9711 51.14%, 0.9833 59.06%, 0.9915 68.74%, 1 100%)',
                        pseudoElement: '::view-transition-new(root)',
                        fill: 'both'
                    }
                );
            }).catch(() => {});
        } catch (e) {
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
