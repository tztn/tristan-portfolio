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
    const themeLabel = document.getElementById("theme-label");
    const htmlElement = document.documentElement;

    function updateLabel() {
        if (!themeLabel) return;
        const isDark = htmlElement.classList.contains("dark");
        themeLabel.textContent = isDark ? "LIGHT MODE" : "DARK MODE";
    }

    updateLabel();

    function toggleTheme() {
        const isDark = htmlElement.classList.toggle("dark");
        localStorage.setItem("theme", isDark ? "dark" : "light");
        updateLabel();
    }

    if (toggleDesktopBtn) {
        toggleDesktopBtn.addEventListener("click", toggleTheme);
    }
    if (toggleMobileBtn) {
        toggleMobileBtn.addEventListener("click", toggleTheme);
    }

    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
        if (!localStorage.getItem("theme")) {
            if (e.matches) {
                htmlElement.classList.add("dark");
            } else {
                htmlElement.classList.remove("dark");
            }
            updateLabel();
        }
    });
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initTheme);
} else {
    initTheme();
}
