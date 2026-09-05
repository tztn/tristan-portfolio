/* ==========================================================================
   02: COMMAND PALETTE (CMDK // âŒ˜K / Ctrl+K)
   ========================================================================== */
function initCommandPalette() {
    const overlay = document.getElementById("cmdk-overlay");
    const input = document.getElementById("cmdk-input");
    const list = document.getElementById("cmdk-list");
    const triggerBtn = document.getElementById("cmdk-trigger-btn");
    const closeKbd = document.querySelector(".cmdk-close-kbd");

    if (!overlay || !input || !list) return;

    function openCmdk() {
        overlay.classList.add("open");
        input.value = "";
        filterItems("");
        input.focus();
        if (window.lenis) window.lenis.stop();
        if (window.soundFX) window.soundFX.play("popover");
    }

    function closeCmdk() {
        overlay.classList.remove("open");
        if (window.lenis) window.lenis.start();
    }

    if (triggerBtn) {
        triggerBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            openCmdk();
        });
    }

    if (closeKbd) {
        closeKbd.addEventListener("click", closeCmdk);
    }

    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) closeCmdk();
    });

    document.addEventListener("keydown", (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
            e.preventDefault();
            if (overlay.classList.contains("open")) {
                closeCmdk();
            } else {
                openCmdk();
            }
        } else if (e.key === "Escape" && overlay.classList.contains("open")) {
            closeCmdk();
        }
    });

    function getVisibleItems() {
        return Array.from(list.querySelectorAll(".cmdk-item:not([style*='display: none'])"));
    }

    function filterItems(query) {
        const q = query.toLowerCase().trim();
        const items = list.querySelectorAll(".cmdk-item");
        const groups = list.querySelectorAll(".cmdk-group-title");

        items.forEach(item => {
            const label = (item.getAttribute("data-cmdk-label") || item.textContent).toLowerCase();
            const match = !q || label.includes(q);
            item.style.display = match ? "flex" : "none";
        });

        groups.forEach(group => {
            let next = group.nextElementSibling;
            let hasVisible = false;
            while (next && next.classList.contains("cmdk-item")) {
                if (next.style.display !== "none") hasVisible = true;
                next = next.nextElementSibling;
            }
            group.style.display = hasVisible ? "block" : "none";
        });

        const visible = getVisibleItems();
        items.forEach(i => i.classList.remove("selected"));
        if (visible.length > 0) visible[0].classList.add("selected");
    }

    input.addEventListener("input", (e) => {
        filterItems(e.target.value);
    });

    input.addEventListener("keydown", (e) => {
        const visible = getVisibleItems();
        if (!visible.length) return;

        let currentIndex = visible.findIndex(item => item.classList.contains("selected"));

        if (e.key === "ArrowDown") {
            e.preventDefault();
            if (currentIndex < visible.length - 1) {
                visible[currentIndex].classList.remove("selected");
                visible[currentIndex + 1].classList.add("selected");
                visible[currentIndex + 1].scrollIntoView({ block: "nearest" });
            }
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            if (currentIndex > 0) {
                visible[currentIndex].classList.remove("selected");
                visible[currentIndex - 1].classList.add("selected");
                visible[currentIndex - 1].scrollIntoView({ block: "nearest" });
            }
        } else if (e.key === "Enter") {
            e.preventDefault();
            if (currentIndex >= 0 && visible[currentIndex]) {
                executeCmdkItem(visible[currentIndex]);
            }
        }
    });

    list.addEventListener("click", (e) => {
        const item = e.target.closest(".cmdk-item");
        if (item) executeCmdkItem(item);
    });

    function executeCmdkItem(item) {
        const action = item.getAttribute("data-cmdk-action");
        const target = item.getAttribute("data-cmdk-target");

        closeCmdk();

        if (action === "navigate" && target) {
            const el = document.querySelector(target);
            if (el) {
                if (window.lenis) {
                    window.lenis.scrollTo(el, { offset: -24, duration: 1.15 });
                } else {
                    el.scrollIntoView({ behavior: "smooth" });
                }
            }
        } else if (action === "project" && target) {
            if (window.openProjectModal) window.openProjectModal(target);
        } else if (action === "stack-dir") {
            if (window.openStandaloneStack) window.openStandaloneStack(target || "all");
        } else if (action === "theme") {
            const themeBtn = document.getElementById("theme-toggle-desktop");
            if (themeBtn) themeBtn.click();
        } else if (action === "sfx") {
            const sfxBtn = document.getElementById("audio-toggle-btn");
            if (sfxBtn) sfxBtn.click();
        } else if (action === "copy-email") {
            const copyBtn = document.getElementById("copy-email-btn");
            if (copyBtn) copyBtn.click();
        } else if (action === "link" && target) {
            window.open(target, "_blank");
        }
    }
}

