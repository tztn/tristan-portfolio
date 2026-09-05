/* ==========================================================================
   NAVIGATION, LENIS 60 FPS SMOOTH SCROLL & SCROLLSPY (CAD ARCHITECTURE)
   ========================================================================== */

(function () {
    let lenis = null;

    // 01: Initialize Lenis for 60fps Butter-Smooth Kinetic Momentum Scrolling
    if (typeof Lenis !== "undefined") {
        try {
            lenis = new Lenis({
                duration: 1.15,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                orientation: "vertical",
                gestureOrientation: "vertical",
                smoothWheel: true,
                wheelMultiplier: 0.95,
                touchMultiplier: 1.5,
                infinite: false
            });

            function raf(time) {
                lenis.raf(time);
                requestAnimationFrame(raf);
            }
            requestAnimationFrame(raf);
            window.lenis = lenis;
        } catch (err) {
            // Safe fallback to native smooth scroll
        }
    }

    function initNavigation() {
        const menuToggle = document.getElementById("mobile-menu-toggle");
        const mobileDrawer = document.getElementById("mobile-drawer");
        const navLinks = document.querySelectorAll(".header-nav-link, .mobile-nav-link");
        const backToTopBtn = document.getElementById("back-to-top-btn");

        /* 02: Mobile Drawer Toggle */
        function toggleMobileMenu() {
            const isOpen = mobileDrawer && mobileDrawer.classList.contains("open");
            if (isOpen) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        }

        function openMobileMenu() {
            if (menuToggle) menuToggle.classList.add("open");
            if (mobileDrawer) mobileDrawer.classList.add("open");
            if (lenis) lenis.stop();
        }

        function closeMobileMenu() {
            if (menuToggle) menuToggle.classList.remove("open");
            if (mobileDrawer) mobileDrawer.classList.remove("open");
            if (lenis) lenis.start();
        }

        if (menuToggle) {
            menuToggle.addEventListener("click", (e) => {
                e.stopPropagation();
                toggleMobileMenu();
            });
        }

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

        /* 04: Fluid 60fps Anchor Gliding (Lenis Interpolation) */
        document.querySelectorAll('a[href^="#"]').forEach((link) => {
            link.addEventListener("click", (e) => {
                const href = link.getAttribute("href");
                if (!href || href === "#") return;
                const targetSelector = href === "#overview" ? "#home" : href;
                let targetEl = null;

                try {
                    targetEl = document.querySelector(targetSelector);
                } catch (err) {
                    return;
                }

                if (targetEl) {
                    e.preventDefault();
                    closeMobileMenu();

                    // If any standalone view is active, close it
                    const standaloneWrappers = document.querySelectorAll(".project-standalone-wrapper");
                    standaloneWrappers.forEach(w => w.style.display = "none");
                    const mainWrapper = document.getElementById("main-content-wrapper");
                    if (mainWrapper) mainWrapper.style.display = "";

                    if (window.soundFX) {
                        window.soundFX.play("click");
                    }

                    if (lenis) {
                        lenis.scrollTo(targetEl, {
                            offset: -24,
                            duration: 1.15
                        });
                    } else {
                        targetEl.scrollIntoView({ behavior: "smooth" });
                    }

                    if (window.history && window.history.pushState) {
                        window.history.pushState(null, null, href);
                    }
                }
            });
        });

        /* 05: Scroll Spy */
        const panels = document.querySelectorAll(".panel");

        if (window.location.hash) {
            setTimeout(() => {
                const hash = window.location.hash;
                const target = hash === "#overview" ? document.getElementById("home") : document.querySelector(hash);
                if (target) {
                    if (lenis) {
                        lenis.scrollTo(target, { offset: -24, duration: 1.15 });
                    } else {
                        target.scrollIntoView({ behavior: "smooth" });
                    }
                }
            }, 100);
        }

        const observerOptions = {
            root: null,
            rootMargin: "-20% 0px -65% 0px",
            threshold: 0
        };

        const panelObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.id;
                    navLinks.forEach((link) => {
                        const href = link.getAttribute("href");
                        if (href === `#${sectionId}` || (sectionId === "home" && href === "#overview")) {
                            link.classList.add("active");
                        } else {
                            link.classList.remove("active");
                        }
                    });
                }
            });
        }, observerOptions);

        panels.forEach((p) => panelObserver.observe(p));

        /* 06: Back to Top */
        if (backToTopBtn) {
            backToTopBtn.addEventListener("click", (e) => {
                e.preventDefault();
                if (window.soundFX) {
                    window.soundFX.play("click");
                }
                if (lenis) {
                    lenis.scrollTo(0, { duration: 1.15 });
                } else {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                }
            });
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initNavigation);
    } else {
        initNavigation();
    }
})();
