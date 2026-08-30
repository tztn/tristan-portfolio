/* ==========================================================================
   TOP HEADER NAVIGATION, HEX-STYLE POPOVERS & SCROLLSPY
   ========================================================================== */

function initNavigation() {
    const header = document.getElementById("top-header");
    const menuToggle = document.getElementById("menu-toggle");
    const mobileDrawer = document.getElementById("mobile-drawer");
    const navLinks = document.querySelectorAll(".nav-link, .mobile-nav-link");
    const popoverItems = document.querySelectorAll(".popover-item[data-project-trigger]");
    const popoverParents = document.querySelectorAll(".has-popover");

    /* --------------------------------------------------------------------------
       01: Header Elevation on Scroll
       -------------------------------------------------------------------------- */
    function handleScroll() {
        if (header) {
            header.classList.toggle("scrolled", window.scrollY > 15);
        }
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    /* --------------------------------------------------------------------------
       02: Mobile Drawer Toggle
       -------------------------------------------------------------------------- */
    function toggleMobileMenu() {
        if (header) header.classList.toggle("menu-open");
        if (mobileDrawer) mobileDrawer.classList.toggle("open");
    }

    function closeMobileMenu() {
        if (header) header.classList.remove("menu-open");
        if (mobileDrawer) mobileDrawer.classList.remove("open");
    }

    if (menuToggle) {
        menuToggle.addEventListener("click", (e) => {
            e.stopPropagation();
            toggleMobileMenu();
        });
    }

    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            closeMobileMenu();
            popoverParents.forEach(p => p.classList.remove("popover-open"));
        });
    });

    document.addEventListener("click", (e) => {
        if (header && header.classList.contains("menu-open")) {
            const isClickInside = header.contains(e.target) || (mobileDrawer && mobileDrawer.contains(e.target));
            if (!isClickInside) {
                closeMobileMenu();
            }
        }
    });

    /* --------------------------------------------------------------------------
       03: Popover Interactivity & Project Modal Triggers
       -------------------------------------------------------------------------- */
    popoverItems.forEach(item => {
        item.addEventListener("click", (e) => {
            const projectId = item.getAttribute("data-project-trigger");
            if (projectId) {
                // Find matching project card in DOM and trigger modal
                const targetCard = document.querySelector(`.project-card[data-project-id="${projectId}"]`);
                if (targetCard) {
                    targetCard.click();
                }
            }
            popoverParents.forEach(p => p.classList.remove("popover-open"));
        });
    });

    // Close popovers on ESC
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            popoverParents.forEach(p => p.classList.remove("popover-open"));
            closeMobileMenu();
        }
    });

    /* --------------------------------------------------------------------------
       04: Scroll Spy (Active Navigation Highlights)
       -------------------------------------------------------------------------- */
    const sections = document.querySelectorAll(".content-section");

    const observerOptions = {
        root: null,
        rootMargin: "-20% 0px -60% 0px",
        threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;

                navLinks.forEach(link => {
                    if (link.getAttribute("data-section") === sectionId) {
                        link.classList.add("active");
                    } else {
                        link.classList.remove("active");
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initNavigation);
} else {
    initNavigation();
}
