/* ==========================================================================
   NAVIGATION, LENIS 60 FPS SMOOTH SCROLL & SCROLLSPY (CAD ARCHITECTURE)
   ========================================================================== */

(function () {
    let lenis = null;

    // 01: Set manual scroll restoration immediately so browser doesn't jump prematurely
    if ("scrollRestoration" in history) {
        history.scrollRestoration = "manual";
    }

    // 02: Initialize Lenis for 60fps Butter-Smooth Kinetic Momentum Scrolling
    if (typeof Lenis !== "undefined") {
        try {
            lenis = new Lenis({
                duration: 1.05,
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

    // 03: Standalone View Check
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

    // 04: Synchronize Navigation Link Hrefs
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

    // 05: Update Nav Active States
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

    // 06: Dynamic Header Height Offset Calculator
    function getHeaderOffset() {
        const header = document.querySelector(".top-header");
        if (!header) return -56;
        const rect = header.getBoundingClientRect();
        return -Math.round(rect.height || 56);
    }

    // 07: Programmatic Scroll Lock to Prevent ScrollSpy Jitter During Navigation
    let isProgrammaticScroll = false;
    let programmaticScrollTimer = null;

    function setProgrammaticScroll(targetKey, durationMs = 1000) {
        isProgrammaticScroll = true;
        updateNavActiveState(targetKey);
        if (programmaticScrollTimer) clearTimeout(programmaticScrollTimer);
        programmaticScrollTimer = setTimeout(() => {
            isProgrammaticScroll = false;
        }, durationMs + 60);
    }

    // 08: Unified Scroll-To-Section Engine
    function scrollToSection(targetId, options = {}) {
        const { immediate = false, duration = 1.0, updateHash = true, playSound = true } = options;
        const cleanId = (targetId || "").replace(/^#/, "").replace("overview", "home");
        const isHome = !cleanId || cleanId === "home" || cleanId === "overview";

        // Close mobile drawer if open
        const menuToggle = document.getElementById("mobile-menu-toggle");
        const mobileDrawer = document.getElementById("mobile-drawer");
        if (menuToggle) menuToggle.classList.remove("open");
        if (mobileDrawer) mobileDrawer.classList.remove("open");
        if (window.lenis && !immediate) window.lenis.start();

        // Cleanly exit standalone mode if returning to main content
        const wasStandalone = isStandaloneActive();
        if (wasStandalone) {
            const standaloneWrappers = document.querySelectorAll(".project-standalone-wrapper");
            standaloneWrappers.forEach((w) => (w.style.display = "none"));
            const mainWrapper = document.getElementById("main-content-wrapper");
            if (mainWrapper) mainWrapper.style.display = "";

            if (window.currentActiveProjectId !== undefined) {
                window.currentActiveProjectId = null;
            }
            syncNavLinksHref(false);
        }

        if (playSound && !immediate && window.soundFX) {
            window.soundFX.play("click");
        }

        // Lock ScrollSpy during programmatic glide
        setProgrammaticScroll(isHome ? "home" : cleanId, immediate ? 0 : Math.round(duration * 1000));

        if (updateHash && window.history && window.history.pushState) {
            const newHash = isHome ? "#overview" : `#${cleanId}`;
            if (window.location.hash !== newHash) {
                window.history.pushState(null, "", newHash);
            }
        }

        if (isHome) {
            if (window.lenis) {
                window.lenis.scrollTo(0, { immediate, duration });
            } else {
                window.scrollTo({ top: 0, left: 0, behavior: immediate ? "auto" : "smooth" });
                document.documentElement.scrollTop = 0;
                document.body.scrollTop = 0;
            }
            return;
        }

        const targetEl = document.getElementById(cleanId);
        if (!targetEl) {
            if (window.lenis) {
                window.lenis.scrollTo(0, { immediate, duration });
            } else {
                window.scrollTo({ top: 0, left: 0, behavior: immediate ? "auto" : "smooth" });
            }
            return;
        }

        // Immediately ensure target panel is marked revealed so vertical transform does not alter offset calculation
        targetEl.classList.add("revealed");

        const offset = getHeaderOffset();

        if (window.lenis) {
            try { window.lenis.resize(); } catch (err) {}
            window.lenis.scrollTo(targetEl, {
                offset: offset,
                immediate: immediate,
                duration: duration
            });
        } else {
            const targetRect = targetEl.getBoundingClientRect();
            const currentY = window.pageYOffset || document.documentElement.scrollTop || 0;
            const targetY = targetRect.top + currentY + offset;
            window.scrollTo({
                top: targetY,
                left: 0,
                behavior: immediate ? "auto" : "smooth"
            });
        }
    }
    window.scrollToSection = scrollToSection;

    // 09: Discrete Back-to-Top Controller
    function scrollToTop(e) {
        if (e) {
            try { e.preventDefault(); } catch (err) {}
            try { e.stopPropagation(); } catch (err) {}
        }
        scrollToSection("home", { duration: 0.9, playSound: true });
    }
    window.scrollToTop = scrollToTop;

    // 10: Navigation Initialization
    function initNavigation() {
        const menuToggle = document.getElementById("mobile-menu-toggle");
        const mobileDrawer = document.getElementById("mobile-drawer");
        const navLinks = document.querySelectorAll(".header-nav-link, .mobile-nav-link, .header-brand");

        // Mobile drawer toggle handlers
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
            if (e.key === "Escape" && mobileDrawer && mobileDrawer.classList.contains("open")) {
                closeMobileMenu();
            }
        });

        // Nav Links Click Gliding
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

                e.preventDefault();
                scrollToSection(targetSection, { duration: 1.0, updateHash: true, playSound: true });
            });
        });

        // 11: ScrollSpy Observer
        const panels = document.querySelectorAll(".panel");

        const observerOptions = {
            root: null,
            rootMargin: "-12% 0px -45% 0px",
            threshold: 0
        };

        const panelObserver = new IntersectionObserver((entries) => {
            if (isStandaloneActive() || isProgrammaticScroll) return;

            const currentY = window.pageYOffset || document.documentElement.scrollTop || 0;

            // Overview/Home top threshold
            if (currentY < 70) {
                updateNavActiveState("home");
                return;
            }

            // Bottom of document threshold: automatically select last section (Contact)
            const scrollBottom = window.innerHeight + currentY;
            const docHeight = document.documentElement.scrollHeight;
            if (scrollBottom >= docHeight - 40) {
                updateNavActiveState("contact");
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

        // 12: Throttled Floating Back-to-Top Button Visibility
        const floatingBtt = document.getElementById("back-to-top-btn");
        let bttTicking = false;

        function updateFloatingBtt() {
            if (!floatingBtt) return;
            const scrollY = window.pageYOffset || document.documentElement.scrollTop || window.scrollY || 0;
            if (scrollY > 300) {
                floatingBtt.classList.add("visible");
            } else {
                floatingBtt.classList.remove("visible");
            }
            bttTicking = false;
        }

        function onScrollBtt() {
            if (!bttTicking) {
                bttTicking = true;
                requestAnimationFrame(updateFloatingBtt);
            }
        }

        window.addEventListener("scroll", onScrollBtt, { passive: true });
        updateFloatingBtt();

        // Click delegation for Back to Top buttons
        document.addEventListener("click", (e) => {
            const btt = e.target.closest(".standalone-btt-btn, .back-to-top-btn, .floating-back-to-top-btn, #back-to-top-btn");
            if (btt) {
                scrollToTop(e);
            }
        });

        // 13: Direct URL Hash Visits & Page Load Alignment Normalizer
        const initialHash = (window.location.hash || "").toLowerCase();
        if (!initialHash || initialHash === "#" || initialHash === "#overview" || initialHash === "#home") {
            window.scrollTo(0, 0);
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
            if (lenis) lenis.scrollTo(0, { immediate: true });
            updateNavActiveState("home");
        } else if (initialHash.startsWith("#project/") || initialHash === "#projects-dir" || initialHash === "#projects-view" || initialHash === "#stack-dir" || initialHash === "#stack-view") {
            // Standalone view handling handled by controllers
            const isStandalone = true;
            syncNavLinksHref(isStandalone);
            if (initialHash.startsWith("#project/") || initialHash === "#projects-dir" || initialHash === "#projects-view") {
                updateNavActiveState("projects");
            } else {
                updateNavActiveState("stack");
            }
        } else {
            // In-page section target: align cleanly on frame ready
            const targetSection = initialHash.replace("#", "");
            updateNavActiveState(targetSection);
            requestAnimationFrame(() => {
                scrollToSection(targetSection, { immediate: true, updateHash: false, playSound: false });
            });
        }

        // Secondary normalization when images, fonts and external assets finish loading
        window.addEventListener("load", () => {
            if (lenis) {
                try { lenis.resize(); } catch (e) {}
            }
            const hash = (window.location.hash || "").toLowerCase();
            if (hash && hash !== "#" && hash !== "#overview" && hash !== "#home" && !hash.startsWith("#project/") && hash !== "#projects-dir" && hash !== "#stack-dir") {
                const target = hash.replace("#", "");
                scrollToSection(target, { immediate: true, updateHash: false, playSound: false });
            }
        });

        // 14: Hash Change & History Navigation (Back / Forward)
        function handleHashSync(event) {
            const hash = window.location.hash || "";
            const isStandalone = isStandaloneActive();
            syncNavLinksHref(isStandalone);

            if (hash.startsWith("#project/") || hash === "#projects-dir" || hash === "#projects-view") {
                updateNavActiveState("projects");
            } else if (hash === "#stack-dir" || hash === "#stack-view") {
                updateNavActiveState("stack");
            } else if (!isStandalone) {
                const clean = hash.replace("#", "");
                if (clean) {
                    updateNavActiveState(clean);
                } else {
                    updateNavActiveState("home");
                }

                // If popstate (browser back/forward button clicked), smoothly glide to destination section
                if (event && event.type === "popstate") {
                    scrollToSection(clean || "home", { immediate: false, duration: 0.8, updateHash: false, playSound: false });
                }
            }
        }

        window.addEventListener("hashchange", handleHashSync);
        window.addEventListener("popstate", handleHashSync);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initNavigation);
    } else {
        initNavigation();
    }
})();
