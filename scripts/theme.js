// Prevent FOUC (Flash of Unstyled Content)
(() => {
    const cachedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (cachedTheme === "dark" || (!cachedTheme && systemPrefersDark)) {
        document.documentElement.classList.add("dark");
    } else {
        document.documentElement.classList.remove("dark");
    }
})();

function initTheme() {
    const toggleDesktopBtn = document.getElementById("theme-toggle-desktop");
    const toggleMobileBtn = document.getElementById("theme-toggle-mobile");
    const htmlElement = document.documentElement;

    function applyTheme(isDark) {
        if (isDark) {
            htmlElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            htmlElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }

    function animateButton(btn) {
        if (!btn) return;
        btn.classList.add("animating");
        setTimeout(() => {
            btn.classList.remove("animating");
        }, 400);
    }

    function toggleTheme(e) {
        const isDark = htmlElement.classList.contains("dark");
        const nextIsDark = !isDark;
        const triggerBtn = e?.currentTarget || toggleDesktopBtn || toggleMobileBtn;

        animateButton(triggerBtn);

        // Check if View Transitions API is supported and motion is not reduced
        const supportsViewTransitions = Boolean(document.startViewTransition) && 
            !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        if (!supportsViewTransitions) {
            applyTheme(nextIsDark);
            return;
        }

        // Circular ripple origin from button position or viewport center
        let x = window.innerWidth / 2;
        let y = window.innerHeight / 2;

        if (triggerBtn) {
            const rect = triggerBtn.getBoundingClientRect();
            x = rect.left + rect.width / 2;
            y = rect.top + rect.height / 2;
        } else if (e?.clientX && e?.clientY) {
            x = e.clientX;
            y = e.clientY;
        }

        // Calculate distance to furthest corner of screen
        const endRadius = Math.hypot(
            Math.max(x, window.innerWidth - x),
            Math.max(y, window.innerHeight - y)
        );

        const transition = document.startViewTransition(() => {
            applyTheme(nextIsDark);
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
                    duration: 450,
                    easing: "cubic-bezier(0.16, 1, 0.3, 1)",
                    pseudoElement: "::view-transition-new(root)"
                }
            );
        });
    }

    if (toggleDesktopBtn) {
        toggleDesktopBtn.addEventListener("click", toggleTheme);
    }
    if (toggleMobileBtn) {
        toggleMobileBtn.addEventListener("click", toggleTheme);
    }

    // System theme change listener
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
        if (!localStorage.getItem("theme")) {
            applyTheme(e.matches);
        }
    });
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initTheme);
} else {
    initTheme();
}
