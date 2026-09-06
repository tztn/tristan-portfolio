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

            // Page Load / Refresh Normalization for Lenis
            const initH = (window.location.hash || "").toLowerCase();
            if (!initH || initH === "#" || initH === "#overview" || initH === "#home") {
                if ("scrollRestoration" in history) {
                    history.scrollRestoration = "manual";
                }
                lenis.scrollTo(0, { immediate: true });
                window.scrollTo(0, 0);
                document.documentElement.scrollTop = 0;
                document.body.scrollTop = 0;
            }
        } catch (err) {
            // Safe fallback to native smooth scroll
        }
    }

    function isStandaloneActive() {
        const standaloneWrappers = document.querySelectorAll(".project-standalone-wrapper");
        for (let i = 0; i < standaloneWrappers.length; i++) {
            const w = standaloneWrappers[i];
            if (w.style.display === "block" || (getComputedStyle(w).display !== "none" && w.offsetWidth > 0)) {
                return true;
            }
        }
        const hash = window.location.hash || "";
        if (hash.startsWith("#project/") || hash === "#projects-dir" || hash === "#projects-view" || hash === "#stack-dir" || hash === "#stack-view") {
            return true;
        }
        return false;
    }
    window.isStandaloneActive = isStandaloneActive;

    function syncNavLinksHref(isStandalone) {
        const navLinks = document.querySelectorAll(".header-nav-link, .mobile-nav-link, .header-brand");
        navLinks.forEach((link) => {
            const rawHref = link.getAttribute("data-base-href") || link.getAttribute("href") || "";
            const hashIndex = rawHref.indexOf("#");
            const hashPart = hashIndex !== -1 ? rawHref.substring(hashIndex) : rawHref;
            if (!link.getAttribute("data-base-href")) {
                link.setAttribute("data-base-href", hashPart);
            }
            if (isStandalone) {
                link.setAttribute("href", `index.html${hashPart}`);
            } else {
                link.setAttribute("href", hashPart);
            }
        });
    }
    window.syncNavLinksHref = syncNavLinksHref;

    function updateNavActiveState(targetSectionOrView) {
        const navLinks = document.querySelectorAll(".header-nav-link, .mobile-nav-link");
        let activeKey = (targetSectionOrView || "").replace(/^#/, "").replace(/^\//, "").toLowerCase();

        if (activeKey.startsWith("project/") || activeKey === "projects-dir" || activeKey === "projects-view") {
            activeKey = "projects";
        } else if (activeKey === "stack-dir" || activeKey === "stack-view") {
            activeKey = "stack";
        } else if (activeKey === "overview" || !activeKey || activeKey === "home") {
            activeKey = "home";
        }

        navLinks.forEach((link) => {
            const rawHref = link.getAttribute("data-base-href") || link.getAttribute("href") || "";
            const linkKey = rawHref.replace(/^.*#/, "").replace("overview", "home").toLowerCase();

            if (linkKey === activeKey) {
                link.classList.add("active");
            } else {
                link.classList.remove("active");
            }
        });
    }
    window.updateNavActiveState = updateNavActiveState;

    function initNavigation() {
        const menuToggle = document.getElementById("mobile-menu-toggle");
        const mobileDrawer = document.getElementById("mobile-drawer");
        const navLinks = document.querySelectorAll(".header-nav-link, .mobile-nav-link, .header-brand");

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

        /* 03: Standalone Aware Nav Link Gliding */
        navLinks.forEach((link) => {
            const rawHref = link.getAttribute("href") || "";
            const hashIndex = rawHref.indexOf("#");
            const hashPart = hashIndex !== -1 ? rawHref.substring(hashIndex) : rawHref;
            if (!link.getAttribute("data-base-href")) {
                link.setAttribute("data-base-href", hashPart);
            }

            link.addEventListener("click", (e) => {
                const baseHref = link.getAttribute("data-base-href") || hashPart;
                if (!baseHref || baseHref === "#") return;

                const isBrand = link.classList.contains("header-brand");
                const targetSection = (isBrand || baseHref === "#overview" || baseHref === "#home") ? "home" : baseHref.replace("#", "");
                const isOverviewTarget = (targetSection === "home" || targetSection === "overview" || isBrand);

                // Prevent default anchor jump so browser's native jump doesn't conflict with Lenis
                e.preventDefault();
                closeMobileMenu();

                const mainWrapper = document.getElementById("main-content-wrapper");
                const wasStandalone = isStandaloneActive();

                if (wasStandalone) {
                    // Cleanly hide standalone views and restore main overview
                    const standaloneWrappers = document.querySelectorAll(".project-standalone-wrapper");
                    standaloneWrappers.forEach((w) => (w.style.display = "none"));
                    if (mainWrapper) mainWrapper.style.display = "";

                    if (window.currentActiveProjectId !== undefined) {
                        window.currentActiveProjectId = null;
                    }

                    syncNavLinksHref(false);

                    if (window.soundFX) {
                        window.soundFX.play("click");
                    }

                    if (window.history && window.history.pushState) {
                        window.history.pushState(null, "", isOverviewTarget ? "#overview" : baseHref);
                    }

                    updateNavActiveState(targetSection);

                    if (window.lenis) {
                        try { window.lenis.resize(); } catch (err) {}
                    }

                    requestAnimationFrame(() => {
                        if (window.lenis) {
                            try { window.lenis.resize(); } catch (err) {}
                        }
                        requestAnimationFrame(() => {
                            if (isOverviewTarget) {
                                // Explicitly scroll to absolute 0
                                if (window.lenis) {
                                    window.lenis.scrollTo(0, { duration: 1.0 });
                                } else {
                                    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
                                }
                            } else {
                                const targetEl = document.getElementById(targetSection);
                                if (targetEl) {
                                    if (window.lenis) {
                                        window.lenis.scrollTo(targetEl, { offset: -56, duration: 1.0 });
                                    } else {
                                        targetEl.scrollIntoView({ behavior: "smooth" });
                                    }
                                } else {
                                    if (window.lenis) {
                                        window.lenis.scrollTo(0, { duration: 1.0 });
                                    } else {
                                        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
                                    }
                                }
                            }
                        });
                    });
                } else {
                    // Standard in-page navigation
                    if (window.soundFX) {
                        window.soundFX.play("click");
                    }

                    if (isOverviewTarget) {
                        // Explicitly scroll to absolute 0
                        if (window.lenis) {
                            window.lenis.scrollTo(0, { duration: 1.0 });
                        } else {
                            window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
                        }

                        if (window.history && window.history.pushState) {
                            window.history.pushState(null, "", "#overview");
                        }
                        updateNavActiveState("home");
                    } else {
                        const targetEl = document.getElementById(targetSection);
                        if (targetEl) {
                            if (window.lenis) {
                                window.lenis.scrollTo(targetEl, {
                                    offset: -56,
                                    duration: 1.0
                                });
                            } else {
                                targetEl.scrollIntoView({ behavior: "smooth" });
                            }

                            if (window.history && window.history.pushState) {
                                window.history.pushState(null, "", baseHref);
                            }
                            updateNavActiveState(targetSection);
                        }
                    }
                }
            });
        });

        /* 04: Scroll Spy & Page Load Normalization */
        const panels = document.querySelectorAll(".panel");

        const initialHash = (window.location.hash || "").toLowerCase();
        if (!initialHash || initialHash === "#" || initialHash === "#overview" || initialHash === "#home") {
            if ("scrollRestoration" in history) {
                history.scrollRestoration = "manual";
            }
            if (lenis) {
                lenis.scrollTo(0, { immediate: true });
            }
            window.scrollTo(0, 0);
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
            updateNavActiveState("home");
        } else if (initialHash.startsWith("#project/") || initialHash === "#projects-dir" || initialHash === "#projects-view" || initialHash === "#stack-dir" || initialHash === "#stack-view") {
            handleHashSync();
        } else {
            setTimeout(() => {
                try {
                    const target = document.querySelector(window.location.hash);
                    if (target) {
                        if (lenis) {
                            lenis.scrollTo(target, { offset: -56, duration: 1.0 });
                        } else {
                            target.scrollIntoView({ behavior: "smooth" });
                        }
                    }
                } catch (e) {
                    // Ignore invalid selector syntax in hash
                }
            }, 100);
        }

        const observerOptions = {
            root: null,
            rootMargin: "-20% 0px -65% 0px",
            threshold: 0
        };

        const panelObserver = new IntersectionObserver((entries) => {
            // Do not override active highlight when user is inside a standalone view
            if (isStandaloneActive()) return;

            // If user is scrolled near top, keep Overview active
            const currentY = window.pageYOffset || document.documentElement.scrollTop || 0;
            if (currentY < 60) {
                updateNavActiveState("home");
                return;
            }

            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.id;
                    updateNavActiveState(sectionId);
                }
            });
        }, observerOptions);

        panels.forEach((p) => panelObserver.observe(p));

        /* 05: Back to Top Controllers (Discrete Inline & Floating past 400px) */
        function scrollToTop(e) {
            if (e) {
                try { e.preventDefault(); } catch (err) {}
                try { e.stopPropagation(); } catch (err) {}
            }
            if (window.soundFX) {
                window.soundFX.play("click");
            } else if (window.soundcn && window.soundcn.playClickSoft) {
                window.soundcn.playClickSoft();
            }

            // 1. Force Lenis scroll synchronization
            if (window.lenis) {
                try {
                    window.lenis.start();
                    window.lenis.resize();
                    const currentY = window.pageYOffset || document.documentElement.scrollTop || window.scrollY || 0;
                    window.lenis.targetScroll = currentY;
                    window.lenis.animatedScroll = currentY;
                    window.lenis.scrollTo(0, { duration: 0.9, force: true });
                } catch (err) {}
            }

            // 2. Always trigger native scroll smoothly as guaranteed mechanism
            try {
                window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
                document.documentElement.scrollTo({ top: 0, left: 0, behavior: "smooth" });
                document.body.scrollTo({ top: 0, left: 0, behavior: "smooth" });
            } catch (err) {
                window.scrollTo(0, 0);
            }
        }
        window.scrollToTop = scrollToTop;

        // Delegate clicks for any back-to-top button
        document.addEventListener("click", (e) => {
            const btt = e.target.closest(".standalone-btt-btn, #standalone-floating-btt, .back-to-top-btn, #back-to-top-btn");
            if (btt) {
                scrollToTop(e);
            }
        });

        // Floating button visibility past 400px
        function updateFloatingBtt() {
            const floatingBtn = document.getElementById("standalone-floating-btt");
            if (!floatingBtn) return;
            const scrollY = window.pageYOffset || document.documentElement.scrollTop || window.scrollY || 0;
            const isStandalone = isStandaloneActive();

            if (isStandalone && scrollY > 400) {
                floatingBtn.classList.add("visible");
            } else {
                floatingBtn.classList.remove("visible");
            }
        }

        window.addEventListener("scroll", updateFloatingBtt, { passive: true });
        if (window.lenis) {
            window.lenis.on("scroll", updateFloatingBtt);
        }

        /* 06: Hash & Standalone State Synchronizer */
        function handleHashSync() {
            const hash = window.location.hash || "";
            const isStandalone = isStandaloneActive();
            syncNavLinksHref(isStandalone);

            if (hash.startsWith("#project/") || hash === "#projects-dir" || hash === "#projects-view") {
                updateNavActiveState("projects");
            } else if (hash === "#stack-dir" || hash === "#stack-view") {
                updateNavActiveState("stack");
            } else if (!isStandalone) {
                const clean = hash.replace("#", "");
                if (clean) updateNavActiveState(clean);
            }
            updateFloatingBtt();
        }

        window.addEventListener("hashchange", handleHashSync);
        window.addEventListener("popstate", handleHashSync);
        handleHashSync();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initNavigation);
    } else {
        initNavigation();
    }
})();
