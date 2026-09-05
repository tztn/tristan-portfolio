/* ==========================================================================
   PORTFOLIO INTERACTIVE LOGIC (CAD BLUEPRINT, CMDK & TERMINAL)
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    initAudioFeedback();
    initIsometricFigTracking();
    initPronounceAudio();
    initCommandPalette();
    initPhtClock();
    initGithubHeatmap();
    initProjectsFilter();
    initProjectDetailsController();
    initStackStandaloneController();
    initTerminalHud();
    initContactFeedback();
    initScrollReveal();
    initEducationAccordion();
});

/* ==========================================================================
   05: PROJECT DATA & STANDALONE PAGE CONTROLLER (CHANHDAI EXACT REFERENCE)
   ========================================================================== */
const projectOrder = ["sneakrs", "dlails", "stym", "lostfound", "supermarket"];

const projectData = {
    sneakrs: {
        id: "sneakrs",
        title: "SNEAKRS Landing Concept & UI Design",
        badge: "FIGMA / UI",
        lead: "A high-fidelity streetwear and sneaker storefront concept prototyped in Figma with dynamic design tokens, responsive auto-layout structures, and interactive spring animations.",
        story: "Designed to push the boundary between high-end editorial aesthetics and functional e-commerce UX. It explores fluid typographic scaling, dark/light theme color variables, and rapid prototyping workflows using modern Figma auto-layout components.",
        desc: "The concept focuses on lightning-fast product discoverability, curated streetwear drops, and tactile drawer micro-interactions that elevate brand trust and consumer engagement.",
        architecture: "Constructed in Figma utilizing Auto-Layout 5.0, unified token variables (spacing, typography, border-radius, shadows), and interactive state components with smart animate spring curve physics.",
        contributions: [
            "Crafted fluid responsive grid frames from 320px mobile viewport to 1440px ultra-wide desktop.",
            "Established centralized color token variables with 1-click light/dark mode preview switching.",
            "Built interactive cart drawer with quantity counters and spring-animated checkout progress.",
            "Designed typography scale utilizing Geist font family with high-contrast display weights."
        ],
        date: "2025-06-21",
        domain: "tztn.github.io/sneakrs",
        domainSummary: "Streetwear storefront concept with Figma auto-layout 5.0 tokens.",
        buildHash: "65327da",
        categoryLabel: "Figma / UI Design",
        deployedOn: "Figma Community",
        tags: ["Figma", "Design Tokens", "Auto-Layout 5.0", "UI/UX", "Interactive Prototype"],
        img: "assets/images/projects/sneakrs-figma.png",
        externalLink: "https://www.figma.com/@tristanray"
    },
    dlails: {
        id: "dlails",
        title: "DLAILS Lab Incident Logger & Station Manager",
        badge: "JAVA / SWING",
        lead: "A practical desktop telemetry and station utilization management system designed for campus computer laboratories and hardware maintenance auditing.",
        story: "Built to solve real-world computer laboratory management challenges at NCST, replacing manual paper logbooks with an automated, thread-safe desktop telemetry system.",
        desc: "DLAILS provides laboratory custodians and instructors with real-time workstation allocation monitoring, automated student time tracking, and instant diagnostic maintenance reports.",
        architecture: "Developed with pure Java Swing implementing the Model-View-Controller (MVC) architecture, custom FlatLaf Look & Feel skinning, JDBC connection pooling, and serialized disk logs.",
        contributions: [
            "Architected dynamic station utilization grid with real-time seat reservation locks.",
            "Implemented automated CSV and formatted PDF diagnostic incident report exports.",
            "Engineered searchable audit log system with priority level filtering and student ID search.",
            "Optimized SQL queries for fast lookup across 10,000+ attendance records."
        ],
        date: "2025-03-27",
        domain: "tztn.github.io/dlails",
        domainSummary: "Desktop computer lab management & technician incident logging system.",
        buildHash: "f9241b8",
        categoryLabel: "Java Desktop / Swing",
        deployedOn: "Java Runtime (JVM 17)",
        tags: ["Java 17", "Swing GUI", "MySQL", "JDBC", "File Streams", "OOP"],
        img: "assets/images/projects/dlails.png",
        externalLink: "https://github.com/tztn"
    },
    stym: {
        id: "stym",
        title: "Stym Responsive Digital Game Storefront",
        badge: "WEB / JS",
        lead: "A modern, responsive gaming storefront website featuring trending title showcases, dynamic catalog grids, and clean tactile navigation.",
        story: "Inspired by modern digital game distribution platforms like Steam and Epic Games, Stym delivers a clean, focused user experience optimized for discoverability and high visual impact.",
        desc: "Includes client-side genre filtering, dynamic sorting by price and release date, interactive media carousels, and persistent cart checkout powered by Web Storage.",
        architecture: "Engineered purely with vanilla JavaScript (ES6+), semantic HTML5, CSS Grid with fluid clamp typography, and asynchronous JSON catalog fetching.",
        contributions: [
            "Built instant client-side catalog filtering by genre, price threshold, and platform badges.",
            "Implemented persistent shopping cart state management using Web Storage API (localStorage).",
            "Designed fluid responsive hero showcase carousel with smooth touch gesture support.",
            "Engineered modular badge tagging system for discounts, DLCs, and system requirements."
        ],
        date: "2025-01-04",
        domain: "tztn.github.io/stym",
        domainSummary: "Responsive digital gaming storefront with client-side catalog search.",
        buildHash: "a4819ce",
        categoryLabel: "Front-End / Web",
        deployedOn: "GitHub Pages",
        tags: ["HTML5", "CSS3", "JavaScript (ES6+)", "Responsive Design", "Web Storage"],
        img: "assets/images/projects/stym.png",
        externalLink: "https://github.com/tztn"
    },
    lostfound: {
        id: "lostfound",
        title: "NCST Campus Lost & Found Web Portal",
        badge: "BOOTSTRAP / PHP",
        lead: "A campus-wide reporting and claim verification web portal built with Bootstrap 5 and PHP for tracking misplaced items and securing student recoveries.",
        story: "Engineered to streamline campus safety operations at NCST, enabling students and staff to immediately report lost possessions and verify claims securely with photographic evidence.",
        desc: "Features role-based access control for administrative item verification, instant keyword searching with categorical pills, and automated claim status notifications.",
        architecture: "Constructed with PHP MVC backend, normalized MySQL database schema (3NF), PDO prepared statements for SQL injection prevention, and responsive Bootstrap 5 components.",
        contributions: [
            "Designed responsive item card feed with instant categorical filter pills and search index.",
            "Engineered secure student submission forms with image file uploads and MIME type validation.",
            "Implemented administrative dashboard for claim approvals and audit trail logging.",
            "Structured relational database tables with foreign key constraints ensuring data integrity."
        ],
        date: "2024-11-18",
        domain: "tztn.github.io/ncst-lost-found",
        domainSummary: "Campus web portal for lost item tracking and claim verification.",
        buildHash: "c7193de",
        categoryLabel: "Bootstrap & PHP",
        deployedOn: "Apache / XAMPP",
        tags: ["Bootstrap 5", "PHP 8", "MySQL", "PDO", "3NF Relational DB", "Web App"],
        img: "assets/images/projects/lostfound.png",
        externalLink: "https://github.com/tztn"
    },
    supermarket: {
        id: "supermarket",
        title: "Supermarket POS & Inventory System",
        badge: "C++20 / SYSTEMS",
        lead: "A reliable point-of-sale console application for retail inventory management, logarithmic barcode binary search, and automated purchase auditing.",
        story: "Developed to demonstrate robust low-level systems programming in C++20, emphasizing deterministic memory management, custom data structures, and binary file persistence.",
        desc: "Performs real-time barcode lookups, calculates sales taxes and promotional discounts, manages stock replenishment thresholds, and formats ASCII receipts for thermal printing.",
        architecture: "Written in ISO C++20 with custom dynamic array structures, robust binary file serialization, structured exception handling, and formatted CLI tables.",
        contributions: [
            "Implemented algorithmic barcode/SKU binary search ensuring low latency product queries.",
            "Built calculation routines for tiered promotional discounts and itemized receipt generation.",
            "Created automated binary backup routines for transaction history and stock depletion alerts.",
            "Engineered interactive console menu UI with strict input sanitation and validation."
        ],
        date: "2024-09-15",
        domain: "tztn.github.io/supermarket-pos",
        domainSummary: "CLI Point of Sale application with binary serialization and inventory search.",
        buildHash: "3b8417f",
        categoryLabel: "C++20 / Systems",
        deployedOn: "Native Windows / CLI",
        tags: ["C++20", "Data Structures", "Binary I/O", "CLI Systems", "OOP"],
        img: "assets/images/projects/supermarket.png",
        externalLink: "https://github.com/tztn"
    }
};

let currentActiveProjectId = null;

function initProjectDetailsController() {
    const mainWrapper = document.getElementById("main-content-wrapper");
    const standaloneView = document.getElementById("project-standalone-view");
    const standaloneContainer = document.getElementById("standalone-container");
    const triggers = document.querySelectorAll("[data-project-trigger]");

    if (!standaloneView || !standaloneContainer) return;

    function renderProjectStandalone(projectId) {
        const data = projectData[projectId];
        if (!data) return;

        currentActiveProjectId = projectId;
        const currentIndex = projectOrder.indexOf(projectId);
        const prevId = projectOrder[(currentIndex - 1 + projectOrder.length) % projectOrder.length];
        const nextId = projectOrder[(currentIndex + 1) % projectOrder.length];

        standaloneContainer.innerHTML = `
            <!-- Top Actions Bar (Image 1 reference match) -->
            <div class="proj-standalone-topbar">
                <button type="button" class="proj-back-btn" id="proj-back-btn" aria-label="Back to projects">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="19" y1="12" x2="5" y2="12"></line>
                        <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                    <span>Projects</span>
                </button>

                <div class="proj-nav-actions">
                    <button type="button" class="proj-action-btn proj-icon-btn" id="proj-prev-btn" title="Previous Project: ${projectData[prevId].title}">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="15 18 9 12 15 6"></polyline>
                        </svg>
                    </button>

                    <button type="button" class="proj-action-btn proj-icon-btn" id="proj-next-btn" title="Next Project: ${projectData[nextId].title}">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                    </button>
                </div>
            </div>

            <!-- Standalone Article Content (Image 1 reference match) -->
            <article class="proj-standalone-article">
                <h1 class="proj-standalone-title">${data.title}</h1>
                
                <div class="proj-standalone-narrative">
                    <p class="proj-lead-text">${data.lead}</p>
                    <p>${data.story}</p>
                </div>

                <!-- Showcase Media Box -->
                <div class="proj-standalone-media">
                    <img src="${data.img}" alt="${data.title}" loading="eager">
                </div>

                <!-- Deep Dive Content -->
                <div class="proj-standalone-body">
                    <p class="proj-body-p">${data.desc}</p>

                    <div class="proj-section-block">
                        <div class="proj-block-heading font-mono">// ARCHITECTURE &amp; DESIGN SYSTEM</div>
                        <p class="proj-block-desc">${data.architecture}</p>
                    </div>

                    <div class="proj-section-block">
                        <div class="proj-block-heading font-mono">// KEY IMPLEMENTATIONS &amp; HIGHLIGHTS</div>
                        <ul class="proj-highlights-list font-mono">
                            ${data.contributions.map(item => `<li>${item}</li>`).join('')}
                        </ul>
                    </div>
                </div>

                <!-- Bottom CAD Engineering Specs Matrix (Image 2 exact match) -->
                <div class="proj-spec-table-container">
                    <div class="proj-spec-header-row font-mono">
                        <span class="proj-spec-domain">${data.domain}</span>
                        <span class="proj-spec-summary">${data.domainSummary}</span>
                    </div>

                    <div class="proj-spec-matrix">
                        <div class="proj-spec-cell">
                            <span class="proj-spec-k font-mono">CRAFTED BY</span>
                            <span class="proj-spec-v font-mono"><a href="https://github.com/tztn" target="_blank" rel="noopener noreferrer">@tztn</a></span>
                        </div>
                        <div class="proj-spec-cell">
                            <span class="proj-spec-k font-mono">DATE</span>
                            <span class="proj-spec-v font-mono">${data.date}</span>
                        </div>
                        <div class="proj-spec-cell">
                            <span class="proj-spec-k font-mono">CATEGORY</span>
                            <span class="proj-spec-v font-mono">${data.categoryLabel}</span>
                        </div>
                        <div class="proj-spec-cell">
                            <span class="proj-spec-k font-mono">DEPLOYED ON</span>
                            <span class="proj-spec-v font-mono"><span class="deploy-delta">▲</span> ${data.deployedOn}</span>
                        </div>
                        <div class="proj-spec-cell">
                            <span class="proj-spec-k font-mono">SOURCE CODE</span>
                            <span class="proj-spec-v font-mono"><a href="${data.externalLink}" target="_blank" rel="noopener noreferrer">GitHub</a></span>
                        </div>
                        <div class="proj-spec-cell">
                            <span class="proj-spec-k font-mono">STATUS</span>
                            <div class="proj-spec-status font-mono">
                                <span class="status-dot"></span> Active &amp; Verified
                            </div>
                        </div>
                        <div class="proj-spec-cell proj-spec-cell-wide">
                            <span class="proj-spec-k font-mono">STACK</span>
                            <div class="proj-spec-stack-list font-mono">
                                ${data.tags.map(t => `<span>${t}</span>`).join(' • ')}
                            </div>
                        </div>
                    </div>

                    <!-- Bottom Bar with Monogram & Links (Image 2) -->
                    <div class="proj-spec-bottom-bar">
                        <div class="proj-brand-monogram">
                            <svg class="pixel-logo-svg" viewBox="0 0 32 16" fill="currentColor" style="width: 26px; height: 13px;">
                                <rect x="0" y="0" width="13" height="3.5" />
                                <rect x="5" y="3.5" width="3.5" height="12.5" />
                                <rect x="16" y="0" width="3.5" height="16" />
                                <rect x="19.5" y="0" width="7" height="3.5" />
                                <rect x="23" y="3.5" width="3.5" height="4" />
                                <rect x="19.5" y="7.5" width="7" height="3.5" />
                                <rect x="23" y="11" width="3.5" height="5" />
                            </svg>
                        </div>
                        <div class="proj-bottom-socials">
                            <a href="https://github.com/tztn" target="_blank" rel="noopener noreferrer">GitHub</a>
                            <a href="mailto:agoilotristanray@gmail.com">Email</a>
                            <a href="https://discord.com" target="_blank" rel="noopener noreferrer">Discord</a>
                        </div>
                    </div>
                </div>
            </article>
        `;

        // Bind in-page actions
        const backBtn = document.getElementById("proj-back-btn");
        const prevBtn = document.getElementById("proj-prev-btn");
        const nextBtn = document.getElementById("proj-next-btn");

        if (backBtn) {
            backBtn.addEventListener("click", () => {
                showMainOverview();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener("click", () => {
                openStandaloneProject(prevId);
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener("click", () => {
                openStandaloneProject(nextId);
            });
        }
    }

    const projectsDirView = document.getElementById("projects-standalone-view");
    const openProjectsDirBtn = document.getElementById("open-projects-standalone-btn");
    const projectsDirBackBtn = document.getElementById("projects-dir-back-btn");
    const stackView = document.getElementById("stack-standalone-view");
    let navigatedFromDir = false;

    function openProjectsDirectory() {
        if (stackView) stackView.style.display = "none";
        if (standaloneView) standaloneView.style.display = "none";
        if (mainWrapper) mainWrapper.style.display = "none";
        if (projectsDirView) projectsDirView.style.display = "block";
        window.scrollTo({ top: 0, behavior: "smooth" });
        window.history.pushState(null, "", "#projects-dir");
        if (window.soundFX) window.soundFX.play("popover");
    }

    function closeProjectsDirectory() {
        if (projectsDirView) projectsDirView.style.display = "none";
        if (mainWrapper) mainWrapper.style.display = "";
        window.history.pushState(null, "", "#projects");
        const projectsEl = document.getElementById("projects");
        if (projectsEl) {
            projectsEl.scrollIntoView({ behavior: "smooth" });
        }
        if (window.soundFX) window.soundFX.play("click");
    }

    function openStandaloneProject(projectId) {
        if (!projectData[projectId]) return;
        if (projectsDirView && projectsDirView.style.display !== "none") {
            navigatedFromDir = true;
            projectsDirView.style.display = "none";
        } else {
            navigatedFromDir = false;
        }
        if (stackView) stackView.style.display = "none";
        renderProjectStandalone(projectId);
        if (mainWrapper) mainWrapper.style.display = "none";
        standaloneView.style.display = "block";
        window.scrollTo({ top: 0, behavior: "smooth" });
        window.history.pushState(null, "", "#project/" + projectId);
        if (window.soundFX) window.soundFX.play("click");
    }

    function showMainOverview() {
        currentActiveProjectId = null;
        standaloneView.style.display = "none";
        if (navigatedFromDir && projectsDirView) {
            navigatedFromDir = false;
            projectsDirView.style.display = "block";
            window.history.pushState(null, "", "#projects-dir");
            window.scrollTo({ top: 0, behavior: "smooth" });
            if (window.soundFX) window.soundFX.play("click");
            return;
        }
        navigatedFromDir = false;
        if (projectsDirView) projectsDirView.style.display = "none";
        if (mainWrapper) mainWrapper.style.display = "";
        window.history.pushState(null, "", "#projects");
        const projectsEl = document.getElementById("projects");
        if (projectsEl) {
            projectsEl.scrollIntoView({ behavior: "smooth" });
        }
        if (window.soundFX) window.soundFX.play("click");
    }

    window.openProjectModal = function (projectId) {
        openStandaloneProject(projectId);
    };

    window.openProjectsDirectory = openProjectsDirectory;
    window.closeProjectsDirectory = closeProjectsDirectory;
    window.openStandaloneProject = openStandaloneProject;
    window.showMainOverview = showMainOverview;

    if (openProjectsDirBtn) {
        openProjectsDirBtn.addEventListener("click", (e) => {
            e.preventDefault();
            openProjectsDirectory();
        });
    }

    if (projectsDirBackBtn) {
        projectsDirBackBtn.addEventListener("click", () => {
            closeProjectsDirectory();
        });
    }

    // Trigger buttons on project cards and CAD directory rows
    function bindProjectTriggers() {
        const allTriggers = document.querySelectorAll("[data-project-trigger]");
        allTriggers.forEach(card => {
            card.addEventListener("click", () => {
                const id = card.getAttribute("data-project-trigger");
                if (id) openStandaloneProject(id);
            });
            card.addEventListener("keydown", (e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    const id = card.getAttribute("data-project-trigger");
                    if (id) openStandaloneProject(id);
                }
            });
        });
    }
    bindProjectTriggers();

    // Keyboard navigation (← / → for next/prev project, ESC for back)
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            if (standaloneView && standaloneView.style.display === "block") {
                showMainOverview();
            } else if (projectsDirView && projectsDirView.style.display === "block") {
                closeProjectsDirectory();
            }
        } else if (standaloneView && standaloneView.style.display === "block" && currentActiveProjectId) {
            if (e.key === "ArrowLeft") {
                const idx = projectOrder.indexOf(currentActiveProjectId);
                const prev = projectOrder[(idx - 1 + projectOrder.length) % projectOrder.length];
                openStandaloneProject(prev);
            } else if (e.key === "ArrowRight") {
                const idx = projectOrder.indexOf(currentActiveProjectId);
                const next = projectOrder[(idx + 1) % projectOrder.length];
                openStandaloneProject(next);
            }
        }
    });

    // Hash change handler for direct links and browser back/forward
    function handleHashRouting() {
        const hash = window.location.hash;
        if (hash && hash.startsWith("#project/")) {
            const id = hash.replace("#project/", "");
            if (projectData[id]) {
                openStandaloneProject(id);
            }
        } else if (hash === "#projects-dir" || hash === "#projects-view") {
            openProjectsDirectory();
        } else if (hash === "#stack-dir" || hash === "#stack-view") {
            if (window.openStandaloneStack) window.openStandaloneStack();
        } else if (standaloneView.style.display === "block" || (projectsDirView && projectsDirView.style.display === "block")) {
            currentActiveProjectId = null;
            standaloneView.style.display = "none";
            if (projectsDirView) projectsDirView.style.display = "none";
            if (mainWrapper) mainWrapper.style.display = "";
        }
    }

    window.addEventListener("hashchange", handleHashRouting);
    handleHashRouting();
}

/* ==========================================================================
   09: LIVE PHT CLOCK (CAVITE, PH — GMT + 8) & OVERVIEW FIG. 1 TRACKING
   ========================================================================== */
function initPhtClock() {
    const clockEl = document.getElementById("pht-clock-text");
    const footerClockEl = document.getElementById("pht-footer-clock");

    function update() {
        const now = new Date();
        const options = {
            timeZone: "Asia/Manila",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
        };
        const timeStr = now.toLocaleTimeString("en-US", options);
        if (clockEl) clockEl.textContent = `${timeStr} // UTC+8`;
        if (footerClockEl) footerClockEl.textContent = timeStr;
    }

    update();
    setInterval(update, 1000);
}

/* Cursor Tracking Animation & Tactile Click for Fig. 1 Isometric Blueprint */
function initIsometricFigTracking() {
    const heroZone = document.getElementById("blueprint-hero-zone");
    const isoMesh = document.getElementById("iso-mesh-group") || document.getElementById("portrait-avatar-mesh");
    const isoContainer = document.getElementById("isometric-fig-structure") || document.getElementById("interactive-portrait");

    if (!isoMesh || !heroZone) return;

    let targetRotX = 0;
    let targetRotY = 0;
    let currentRotX = 0;
    let currentRotY = 0;
    let isHovering = false;
    let animFrame = null;

    function lerp(start, end, factor) {
        return start + (end - start) * factor;
    }

    function render() {
        currentRotX = lerp(currentRotX, targetRotX, 0.12);
        currentRotY = lerp(currentRotY, targetRotY, 0.12);

        isoMesh.style.transform = `perspective(700px) rotateX(${currentRotX.toFixed(2)}deg) rotateY(${currentRotY.toFixed(2)}deg)`;

        if (isHovering || Math.abs(currentRotX) > 0.05 || Math.abs(currentRotY) > 0.05) {
            animFrame = requestAnimationFrame(render);
        } else {
            animFrame = null;
        }
    }

    heroZone.addEventListener("mousemove", (e) => {
        isHovering = true;
        const rect = heroZone.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Normalized offsets from -1 to 1
        const normX = (x / rect.width - 0.5) * 2;
        const normY = (y / rect.height - 0.5) * 2;

        targetRotY = normX * 18; // Yaw
        targetRotX = -normY * 14; // Pitch

        if (!animFrame) animFrame = requestAnimationFrame(render);
    });

    heroZone.addEventListener("mouseleave", () => {
        isHovering = false;
        targetRotX = 0;
        targetRotY = 0;
        if (!animFrame) animFrame = requestAnimationFrame(render);
    });

    if (isoContainer) {
        isoContainer.addEventListener("click", () => {
            isoContainer.classList.remove("pulse-active");
            void isoContainer.offsetWidth; // Force reflow
            isoContainer.classList.add("pulse-active");
            if (window.soundFX) window.soundFX.play("click");
        });

        isoContainer.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                isoContainer.click();
            }
        });
    }
}

/* Pronounce Audio Feedback (Synthesizes name pronunciation chime) */
function initPronounceAudio() {
    const pronounceBtn = document.getElementById("pronounce-speaker-btn");
    if (!pronounceBtn) return;

    pronounceBtn.addEventListener("click", () => {
        if (window.soundFX) {
            window.soundFX.play("success");
        }
    });
}

/* ==========================================================================
   11: SCROLL REVEAL OBSERVER
   ========================================================================== */
function initScrollReveal() {
    const sections = document.querySelectorAll(".panel");
    if (!sections.length) return;

    // Immediately mark sections visible in viewport on initial load
    sections.forEach((panel, idx) => {
        const rect = panel.getBoundingClientRect();
        const inViewport = rect.top < window.innerHeight && rect.bottom > 0;
        if (idx === 0 || inViewport) {
            panel.classList.add("revealed");
        }
        panel.classList.add("reveal-ready");
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("revealed");
            }
        });
    }, { threshold: 0.08, rootMargin: "0px 0px -40px 0px" });

    sections.forEach(s => observer.observe(s));
}

/* ==========================================================================
   12: GITHUB REAL CONTRIBUTIONS HEATMAP (@tztn)
   ========================================================================== */
function initGithubHeatmap() {
    const container = document.getElementById("heatmap-matrix");
    const totalLabel = document.getElementById("heatmap-total-contributions");
    if (!container) return;

    // Tristan's actual verified GitHub contribution calendar data for tztn
    const tztnContributions = [
        { "date": "2025-09-09", "count": 2, "level": 2 },
        { "date": "2025-09-10", "count": 2, "level": 2 },
        { "date": "2025-09-19", "count": 2, "level": 2 },
        { "date": "2025-09-21", "count": 2, "level": 2 },
        { "date": "2025-10-11", "count": 2, "level": 2 },
        { "date": "2025-10-12", "count": 1, "level": 1 },
        { "date": "2025-10-14", "count": 4, "level": 4 },
        { "date": "2025-10-15", "count": 4, "level": 4 },
        { "date": "2025-10-18", "count": 2, "level": 2 },
        { "date": "2026-03-15", "count": 2, "level": 2 },
        { "date": "2026-08-30", "count": 1, "level": 1 }
    ];

    function renderMatrix(contributions, totalCount) {
        container.innerHTML = "";
        if (totalLabel) totalLabel.textContent = `${totalCount} contributions`;

        const weeks = 52;
        let dayIndex = 0;

        for (let w = 0; w < weeks; w++) {
            const col = document.createElement("div");
            col.className = "heatmap-col";

            for (let d = 0; d < 7; d++) {
                const cell = document.createElement("div");
                cell.className = "heatmap-cell";

                if (dayIndex < contributions.length) {
                    const day = contributions[dayIndex];
                    if (day.level > 0) {
                        cell.classList.add(`l${day.level}`);
                    }
                    cell.title = `${day.date}: ${day.count} contribution${day.count === 1 ? '' : 's'}`;
                }
                col.appendChild(cell);
                dayIndex++;
            }
            container.appendChild(col);
        }
    }

    function generateFullYearFallback() {
        const fullDays = [];
        const lookup = {};
        tztnContributions.forEach(item => { lookup[item.date] = item; });
        const startDate = new Date("2025-08-31");
        for (let i = 0; i < 365; i++) {
            const curr = new Date(startDate);
            curr.setDate(startDate.getDate() + i);
            const iso = curr.toISOString().split("T")[0];
            fullDays.push(lookup[iso] || { date: iso, count: 0, level: 0 });
        }
        renderMatrix(fullDays, 24);
    }

    // Attempt live API fetch with instant fallback
    fetch("https://github-contributions-api.jogruber.de/v4/tztn?y=last")
        .then(res => res.json())
        .then(data => {
            if (data && data.contributions && data.contributions.length > 0) {
                renderMatrix(data.contributions, data.total ? data.total.lastYear : 24);
            } else {
                generateFullYearFallback();
            }
        })
        .catch(() => {
            generateFullYearFallback();
        });
}

/* ==========================================================================
   13: TACTILE AUDIO FEEDBACK (HOVER & CLICK SOUND SYNTHESIS & TOP BAR TOGGLE)
   ========================================================================== */
function initAudioFeedback() {
    let audioCtx = null;
    let sfxEnabled = true;

    // Load initial state from storage
    const storedState = localStorage.getItem("portfolio_sfx_enabled");
    if (storedState !== null) {
        sfxEnabled = storedState === "true";
    }

    const audioToggleBtn = document.getElementById("audio-toggle-btn");

    function updateAudioButtonUI() {
        if (!audioToggleBtn) return;
        if (sfxEnabled) {
            audioToggleBtn.classList.remove("muted");
            audioToggleBtn.title = "Toggle Sound FX [ON]";
            audioToggleBtn.setAttribute("aria-label", "Sound Effects Enabled (Click to Mute)");
        } else {
            audioToggleBtn.classList.add("muted");
            audioToggleBtn.title = "Toggle Sound FX [MUTED]";
            audioToggleBtn.setAttribute("aria-label", "Sound Effects Muted (Click to Enable)");
        }
    }

    updateAudioButtonUI();

    if (audioToggleBtn) {
        audioToggleBtn.addEventListener("click", () => {
            sfxEnabled = !sfxEnabled;
            localStorage.setItem("portfolio_sfx_enabled", sfxEnabled ? "true" : "false");
            updateAudioButtonUI();
            if (sfxEnabled) {
                soundFX.play("click");
            }
        });
    }

    function getAudioContext() {
        if (!audioCtx) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (AudioContextClass) {
                audioCtx = new AudioContextClass();
            }
        }
        if (audioCtx && audioCtx.state === "suspended") {
            audioCtx.resume();
        }
        return audioCtx;
    }

    const soundFX = {
        play(type) {
            if (!sfxEnabled) return;
            const ctx = getAudioContext();
            if (!ctx) return;

            try {
                const now = ctx.currentTime;

                if (type === "hover") {
                    // Ultra-subtle, airy tactile micro-tick
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.type = "sine";
                    osc.frequency.setValueAtTime(1600, now);
                    osc.frequency.exponentialRampToValueAtTime(2200, now + 0.025);

                    gain.gain.setValueAtTime(0.02, now);
                    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.025);

                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.start(now);
                    osc.stop(now + 0.025);
                } else if (type === "click") {
                    // @soundcn/click-soft tactile sound
                    if (window.soundcn && window.soundcn.playClickSoft) {
                        window.soundcn.playClickSoft({ volume: 0.6 });
                    } else {
                        // Crisp mechanical click fallback
                        const osc = ctx.createOscillator();
                        const gain = ctx.createGain();
                        osc.type = "triangle";
                        osc.frequency.setValueAtTime(800, now);
                        osc.frequency.exponentialRampToValueAtTime(200, now + 0.035);

                        gain.gain.setValueAtTime(0.06, now);
                        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);

                        osc.connect(gain);
                        gain.connect(ctx.destination);
                        osc.start(now);
                        osc.stop(now + 0.035);
                    }
                } else if (type === "popover") {
                    // Soft UI popover / modal open sound
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.type = "sine";
                    osc.frequency.setValueAtTime(440, now);
                    osc.frequency.exponentialRampToValueAtTime(880, now + 0.05);

                    gain.gain.setValueAtTime(0.04, now);
                    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);

                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.start(now);
                    osc.stop(now + 0.05);
                } else if (type === "success") {
                    // Gentle positive confirmation chime
                    const osc1 = ctx.createOscillator();
                    const osc2 = ctx.createOscillator();
                    const gain = ctx.createGain();

                    osc1.type = "sine";
                    osc2.type = "sine";
                    osc1.frequency.setValueAtTime(523.25, now); // C5
                    osc2.frequency.setValueAtTime(659.25, now + 0.08); // E5

                    gain.gain.setValueAtTime(0.05, now);
                    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);

                    osc1.connect(gain);
                    osc2.connect(gain);
                    gain.connect(ctx.destination);

                    osc1.start(now);
                    osc1.stop(now + 0.1);
                    osc2.start(now + 0.08);
                    osc2.stop(now + 0.25);
                }
            } catch (err) {
                // AudioContext safely handled
            }
        },
        toggle() {
            sfxEnabled = !sfxEnabled;
            localStorage.setItem("portfolio_sfx_enabled", sfxEnabled ? "true" : "false");
            updateAudioButtonUI();
            return sfxEnabled;
        }
    };

    window.soundFX = soundFX;
    window.playPortfolioSound = (type) => soundFX.play(type);

    // Attach hover and click sound triggers to important elements
    let lastHoverTime = 0;
    function attachSoundListeners() {
        const interactiveSelectors = [
            ".header-nav-link",
            ".mobile-nav-link",
            ".project-filter-pill",
            ".project-craft-card",
            ".stack-pill-chip",
            ".cmdk-trigger-btn",
            ".header-audio-toggle",
            ".header-theme-toggle",
            ".mobile-menu-toggle",
            ".contact-submit-btn",
            ".copy-email-btn",
            ".back-to-top-btn",
            ".social-icon-btn",
            ".social-btn-box",
            ".interactive-portrait-container",
            ".pronounce-speaker-btn",
            ".cmdk-item",
            ".modal-close-btn",
            ".t-quick-chip",
            ".edu-card-header",
            ".edu-skill-pill"
        ];

        const elements = document.querySelectorAll(interactiveSelectors.join(","));
        elements.forEach(el => {
            if (el.dataset.soundAttached) return;
            el.dataset.soundAttached = "true";

            el.addEventListener("mouseenter", () => {
                const now = Date.now();
                if (now - lastHoverTime > 40) {
                    lastHoverTime = now;
                    soundFX.play("hover");
                }
            });

            el.addEventListener("click", () => {
                soundFX.play("click");
            });
        });
    }

    // Initialize on first user gesture
    window.addEventListener("pointerdown", () => {
        getAudioContext();
    }, { once: true });

    attachSoundListeners();

    // Re-scan when DOM changes (e.g. project modals or filters)
    const observer = new MutationObserver(() => {
        attachSoundListeners();
    });
    observer.observe(document.body, { childList: true, subtree: true });
}

/* ==========================================================================
   EDUCATION ACCORDION TOGGLE
   ========================================================================== */
function initEducationAccordion() {
    const eduCards = document.querySelectorAll("[data-edu-card]");
    eduCards.forEach(card => {
        const toggleBtn = card.querySelector("[data-edu-toggle]");
        if (!toggleBtn) return;

        toggleBtn.addEventListener("click", () => {
            const isActive = card.classList.contains("active");
            card.classList.toggle("active");

            const btn = card.querySelector(".edu-toggle-btn");
            if (btn) {
                btn.setAttribute("aria-expanded", (!isActive).toString());
            }
        });
    });
}
