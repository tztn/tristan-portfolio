/* ==========================================================================
   NAVIGATION & SCROLLSPY (CAD BLUEPRINT ARCHITECTURE)
   ========================================================================== */

function initNavigation() {
    const menuToggle = document.getElementById("mobile-menu-toggle");
    const mobileDrawer = document.getElementById("mobile-drawer");
    const navLinks = document.querySelectorAll(".header-nav-link, .mobile-nav-link");
    const backToTopBtn = document.getElementById("back-to-top-btn");

    /* 01: Mobile Drawer Toggle */
    function toggleMobileMenu() {
        if (menuToggle) menuToggle.classList.toggle("open");
        if (mobileDrawer) mobileDrawer.classList.toggle("open");
    }

    function closeMobileMenu() {
        if (menuToggle) menuToggle.classList.remove("open");
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
        });
    });

    document.addEventListener("click", (e) => {
        if (mobileDrawer && mobileDrawer.classList.contains("open")) {
            const isClickInside = mobileDrawer.contains(e.target) || (menuToggle && menuToggle.contains(e.target));
            if (!isClickInside) {
                closeMobileMenu();
            }
        }
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            closeMobileMenu();
        }
    });

    /* 02: Scroll Spy */
    const panels = document.querySelectorAll(".panel");

    const observerOptions = {
        root: null,
        rootMargin: "-20% 0px -65% 0px",
        threshold: 0
    };

    const panelObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                navLinks.forEach(link => {
                    if (link.getAttribute("href") === `#${sectionId}`) {
                        link.classList.add("active");
                    } else {
                        link.classList.remove("active");
                    }
                });
            }
        });
    }, observerOptions);

    panels.forEach(p => panelObserver.observe(p));

    /* 03: Back to Top */
    if (backToTopBtn) {
        backToTopBtn.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initNavigation);
} else {
    initNavigation();
}
