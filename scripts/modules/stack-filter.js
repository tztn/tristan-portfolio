/* ==========================================================================
   05B: TECH STACK STANDALONE DIRECTORY CONTROLLER
   ========================================================================== */
function initStackStandaloneController() {
    const stackView = document.getElementById("stack-standalone-view");
    const stackContainer = document.getElementById("standalone-stack-container");
    const mainWrapper = document.getElementById("main-content-wrapper");
    const projectView = document.getElementById("project-standalone-view");
    const openBtn = document.getElementById("open-stack-standalone-btn");
    const marqueeWrapper = document.getElementById("stack-marquee-wrapper");

    if (!stackView || !stackContainer) return;

    const stackCategories = [
        {
            label: "FRONTEND",
            items: [
                "JavaScript", "TypeScript", "React", "Next.js", "Vue.js", "Tailwind CSS",
                "SCSS", "Styled Components", "Vite", "Webpack", "ESLint", "Prettier"
            ]
        },
        {
            label: "BACKEND",
            items: [
                "Node.js", "Python", "Java", "PHP", "Express.js", "NestJS",
                "FastAPI", "Spring Boot", "Laravel", "PostgreSQL", "MySQL", "MongoDB",
                "DynamoDB", "OAuth", "JWT", "LDAP", "REST", "GraphQL",
                "gRPC", "AWS Lambda"
            ]
        },
        {
            label: "DEVOPS & CLOUD",
            items: [
                "AWS", "GCP", "Azure", "GitHub Actions", "Jenkins", "GitLab CI",
                "Terraform", "AWS CloudFormation", "Docker", "Kubernetes", "Prometheus",
                "Grafana", "Datadog"
            ]
        },
        {
            label: "AI & MACHINE LEARNING",
            items: [
                "TensorFlow", "PyTorch", "LangChain", "Transformers", "OpenAI",
                "Anthropic", "Mistral", "Hugging Face", "LlamaIndex", "AutoGPT",
                "Claude Code", "Codex"
            ]
        }
    ];

    function renderStackDirectory() {
        stackContainer.innerHTML = `
            <div class="proj-standalone-topbar">
                <button type="button" class="proj-back-btn font-mono" id="stack-back-btn">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="19" y1="12" x2="5" y2="12"></line>
                        <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                    <span>Back to Overview</span>
                </button>
                <div class="proj-standalone-cat-badge font-mono">
                    <span>Tristan Ray // Tech Stack</span>
                </div>
            </div>

            <article class="stack-ref-article">
                <h1 class="stack-ref-main-title font-sans">tech stack</h1>
                
                <p class="stack-ref-narrative">
                    The tools, frameworks, and platforms I reach for â€” across the front end, back end, infrastructure, and AI.
                </p>

                ${stackCategories.map(cat => `
                    <div class="stack-ref-group">
                        <div class="stack-ref-group-label font-mono">${cat.label}</div>
                        <div class="stack-ref-pills-wrap">
                            ${cat.items.map(item => `
                                <span class="stack-ref-pill font-mono">${item}</span>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}
            </article>
        `;

        // Wire up Back button
        const backBtn = document.getElementById("stack-back-btn");
        if (backBtn) {
            backBtn.addEventListener("click", () => {
                closeStandaloneStack();
            });
        }
    }

    function openStandaloneStack() {
        if (projectView) projectView.style.display = "none";
        renderStackDirectory();
        if (mainWrapper) mainWrapper.style.display = "none";
        stackView.style.display = "block";
        window.scrollTo({ top: 0, behavior: "smooth" });
        window.history.pushState(null, "", "#stack-dir");
        if (window.soundFX) window.soundFX.play("popover");
    }

    function closeStandaloneStack() {
        stackView.style.display = "none";
        if (mainWrapper) mainWrapper.style.display = "";
        window.history.pushState(null, "", "#stack");
        const stackEl = document.getElementById("stack");
        if (stackEl) {
            stackEl.scrollIntoView({ behavior: "smooth" });
        }
        if (window.soundFX) window.soundFX.play("click");
    }

    window.openStandaloneStack = openStandaloneStack;
    window.closeStandaloneStack = closeStandaloneStack;

    // Trigger button "All stack"
    if (openBtn) {
        openBtn.addEventListener("click", () => {
            openStandaloneStack("all");
        });
    }

    // Trigger on marquee wrapper or marquee items
    if (marqueeWrapper) {
        marqueeWrapper.addEventListener("click", () => {
            openStandaloneStack("all");
        });
    }

    // Keyboard navigation (ESC for back)
    document.addEventListener("keydown", (e) => {
        if (stackView.style.display === "block" && e.key === "Escape") {
            closeStandaloneStack();
        }
    });

    // Hash change handler
    function handleStackHash() {
        const hash = window.location.hash;
        if (hash === "#stack-dir" || hash.startsWith("#stack-dir/")) {
            const cat = hash.replace("#stack-dir/", "").replace("#stack-dir", "") || "all";
            openStandaloneStack(cat);
        } else if (stackView.style.display === "block" && !hash.startsWith("#project/")) {
            stackView.style.display = "none";
            if (mainWrapper) mainWrapper.style.display = "";
        }
    }

    window.addEventListener("hashchange", handleStackHash);
    handleStackHash();
}

/* ==========================================================================
   06: PROJECTS FILTER
   ========================================================================== */
function initProjectsFilter() {
    const filterPills = document.querySelectorAll(".project-filter-pill");
    const projectCards = document.querySelectorAll(".project-craft-card");

    filterPills.forEach(pill => {
        pill.addEventListener("click", () => {
            filterPills.forEach(p => p.classList.remove("active"));
            pill.classList.add("active");

            const filter = pill.getAttribute("data-filter");

            projectCards.forEach(card => {
                const category = card.getAttribute("data-category");
                if (filter === "all" || category === filter) {
                    card.style.display = "flex";
                } else {
                    card.style.display = "none";
                }
            });
            if (window.soundFX) window.soundFX.play("click");
        });
    });
}

/* ==========================================================================
   07: COMPONENT DEMOS INTERACTION
   ========================================================================== */
function initComponentDemos() {
    const toggleSwitches = document.querySelectorAll(".demo-toggle-switch");
    toggleSwitches.forEach(sw => {
        sw.addEventListener("click", () => {
            sw.classList.toggle("active");
            if (window.soundFX) window.soundFX.play("click");
        });
    });
}

