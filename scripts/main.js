/* ==========================================================================
   PORTFOLIO SCRIPTS (PARTICLE CANVAS, CURSOR, TERMINAL & MODAL)
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    initInteractiveCanvas();
    initCustomCursor();
    initTerminalTypewriter();
    initSkillsHUD();
    initProjectsFilter();
    initProjectDetailsController();
    initContactFeedback();
    initScrollReveal();
});

/* ==========================================================================
   01: INTERACTIVE PARTICLE CONSTELLATION CANVAS
   ========================================================================== */
function initInteractiveCanvas() {
    const canvas = document.getElementById("bg-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let particles = [];
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 35 : 75;
    const maxDistance = isMobile ? 85 : 125;
    const mouseRadius = 140;

    let mouse = { x: null, y: null };

    window.addEventListener("mousemove", (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener("mouseleave", () => {
        mouse.x = null;
        mouse.y = null;
    });

    window.addEventListener("resize", () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        createParticles();
    });

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.7;
            this.vy = (Math.random() - 0.5) * 0.7;
            this.radius = Math.random() * 1.5 + 1;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;

            if (mouse.x !== null && mouse.y !== null) {
                const dx = this.x - mouse.x;
                const dy = this.y - mouse.y;
                const dist = Math.hypot(dx, dy);

                if (dist < mouseRadius) {
                    const force = (mouseRadius - dist) / mouseRadius;
                    const angle = Math.atan2(dy, dx);
                    this.x += Math.cos(angle) * force * 1.8;
                    this.y += Math.sin(angle) * force * 1.8;
                }
            }
        }

        draw(color) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.fill();
        }
    }

    function createParticles() {
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    createParticles();

    function animate() {
        ctx.clearRect(0, 0, width, height);

        const isDark = document.documentElement.classList.contains("dark");
        const nodeColor = isDark ? "rgba(250, 250, 250, 0.45)" : "rgba(9, 9, 11, 0.35)";
        const lineColor = isDark ? "rgba(250, 250, 250," : "rgba(9, 9, 11,";

        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw(nodeColor);

            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.hypot(dx, dy);

                if (dist < maxDistance) {
                    const opacity = (1 - dist / maxDistance) * (isDark ? 0.18 : 0.12);
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `${lineColor} ${opacity})`;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(animate);
    }

    animate();
}

/* ==========================================================================
   02: CUSTOM CURSOR HUD FOLLOWER
   ========================================================================== */
function initCustomCursor() {
    const cursor = document.getElementById("custom-cursor");
    const follower = document.getElementById("custom-cursor-follower");
    if (!cursor || !follower) return;

    let mouseX = -100, mouseY = -100;
    let followerX = -100, followerY = -100;

    window.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    });

    function loop() {
        followerX += (mouseX - followerX) * 0.18;
        followerY += (mouseY - followerY) * 0.18;
        follower.style.transform = `translate(${followerX}px, ${followerY}px)`;
        requestAnimationFrame(loop);
    }
    loop();

    const hoverables = document.querySelectorAll("a, button, .skill-badge, .project-card, .filter-btn");
    hoverables.forEach((el) => {
        el.addEventListener("mouseenter", () => follower.classList.add("expand"));
        el.addEventListener("mouseleave", () => follower.classList.remove("expand"));
    });

    window.addEventListener("mousedown", () => follower.classList.add("click"));
    window.addEventListener("mouseup", () => follower.classList.remove("click"));
}

/* ==========================================================================
   03: INTERACTIVE CYBER TERMINAL ENGINE & TYPEWRITER
   ========================================================================== */
function initTerminalTypewriter() {
    const terminalBody = document.getElementById("terminal-body");
    const tabs = document.querySelectorAll(".terminal-tab");
    const cmdChips = document.querySelectorAll(".cmd-chip");
    if (!terminalBody) return;

    let currentTimer = null;
    let typingInterval = null;

    const tabData = {
        profile: [
            { type: "cmd", text: "fetch --developer" },
            { type: "out", key: "Name:", text: "Tristan Ray Agoilo" },
            { type: "out", key: "Role:", text: "Systems Developer & Software Engineer" },
            { type: "out", key: "Focus:", text: "Desktop Architectures, Campus Web Systems, C++ POS Utilities & UI Tokens" },
            { type: "out", key: "Status:", text: "Available for ambitious systems engineering & full-stack roles" },
            { type: "cmd", text: "ping -c 1 core_philosophy" },
            { type: "out", quote: true, text: '"Complexity is easy. Simplicity, contrast, and performance are hard work."' }
        ],
        telemetry: [
            { type: "cmd", text: "diagnostics --system-health" },
            { type: "out", key: "Kernel:", text: "Production Ready // x86_64" },
            { type: "out", key: "Uptime:", text: "99.98% High Availability" },
            { type: "out", key: "Network:", text: "12ms Response Latency (Direct)" },
            { type: "out", key: "Database:", text: "MySQL Engine Active // Indexed Relations" },
            { type: "out", key: "Security:", text: "RBAC Matrix & Parameterized Queries Enforced" },
            { type: "out", quote: true, text: "All diagnostic health checks passed with 0 critical anomalies." }
        ],
        stack: [
            { type: "cmd", text: "stack --inspect-runtime" },
            { type: "out", key: "Languages:", text: "Java (JDK 21), C++ (C++20), PHP 8.2, JavaScript (ES6+), Python 3" },
            { type: "out", key: "Frameworks:", text: "Java Swing UI, Bootstrap 5, Vue.js, Express/Node" },
            { type: "out", key: "Database:", text: "MySQL, Relational Schema Normalization (3NF), JDBC" },
            { type: "out", key: "Toolchains:", text: "Figma (Design Tokens), NetBeans, VS Code, Git/GitHub" },
            { type: "out", quote: true, text: "Zero bloat. Deterministic architectures built for efficiency." }
        ],
        philosophy: [
            { type: "cmd", text: "cat /etc/core_philosophy.txt" },
            { type: "out", key: "Tenet 01:", text: "Reliability first: backend data integrity precedes visual flourish." },
            { type: "out", key: "Tenet 02:", text: "High contrast: interfaces must provide clear information hierarchy." },
            { type: "out", key: "Tenet 03:", text: "Clean syntax: maintainable code is an engineering responsibility." },
            { type: "out", quote: true, text: '"Architecture is about the decisions you wish you could get right the first time."' }
        ]
    };

    function clearTimers() {
        if (currentTimer) clearTimeout(currentTimer);
        if (typingInterval) clearInterval(typingInterval);
    }

    function renderLines(lines, animate = true) {
        clearTimers();
        terminalBody.innerHTML = "";

        if (!animate) {
            lines.forEach(item => {
                const lineEl = document.createElement("div");
                if (item.type === "cmd") {
                    lineEl.className = "terminal-line";
                    lineEl.innerHTML = `<span class="terminal-prompt">$</span> <span class="cmd-text">${item.text}</span>`;
                } else {
                    lineEl.className = "terminal-line output-line";
                    if (item.key) {
                        lineEl.innerHTML = `<span class="key">${item.key}</span> ${item.text}`;
                    } else if (item.quote) {
                        lineEl.innerHTML = `<span class="italic">${item.text}</span>`;
                    }
                }
                terminalBody.appendChild(lineEl);
            });

            const idleLine = document.createElement("div");
            idleLine.className = "terminal-line";
            idleLine.innerHTML = `<span class="terminal-prompt">$</span> <span class="terminal-cursor-blink">_</span>`;
            terminalBody.appendChild(idleLine);
            terminalBody.scrollTop = terminalBody.scrollHeight;
            return;
        }

        let lineIdx = 0;

        function printNextLine() {
            if (lineIdx >= lines.length) {
                const idleLine = document.createElement("div");
                idleLine.className = "terminal-line";
                idleLine.innerHTML = `<span class="terminal-prompt">$</span> <span class="terminal-cursor-blink">_</span>`;
                terminalBody.appendChild(idleLine);
                terminalBody.scrollTop = terminalBody.scrollHeight;
                return;
            }

            const item = lines[lineIdx];
            const lineEl = document.createElement("div");

            if (item.type === "cmd") {
                lineEl.className = "terminal-line";
                lineEl.innerHTML = `<span class="terminal-prompt">$</span> <span class="cmd-text"></span><span class="terminal-cursor-blink">_</span>`;
                terminalBody.appendChild(lineEl);

                const cmdSpan = lineEl.querySelector(".cmd-text");
                const blinkCursor = lineEl.querySelector(".terminal-cursor-blink");
                let charIdx = 0;

                typingInterval = setInterval(() => {
                    cmdSpan.textContent += item.text[charIdx];
                    if (window.SoundSystem && charIdx % 2 === 0) {
                        window.SoundSystem.playKeySound();
                    }
                    charIdx++;
                    if (charIdx >= item.text.length) {
                        clearInterval(typingInterval);
                        blinkCursor.remove();
                        lineIdx++;
                        currentTimer = setTimeout(printNextLine, 160);
                    }
                }, 26);
            } else {
                lineEl.className = "terminal-line output-line";
                if (item.key) {
                    lineEl.innerHTML = `<span class="key">${item.key}</span> ${item.text}`;
                } else if (item.quote) {
                    lineEl.innerHTML = `<span class="italic">${item.text}</span>`;
                }
                terminalBody.appendChild(lineEl);
                terminalBody.scrollTop = terminalBody.scrollHeight;
                lineIdx++;
                currentTimer = setTimeout(printNextLine, 90);
            }
        }

        printNextLine();
    }

    // Initial Animated Typewriter Run on page load
    setTimeout(() => renderLines(tabData.profile, true), 350);

    // Tab Switching
    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            tabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");

            const tabKey = tab.getAttribute("data-tab");
            if (tabData[tabKey]) {
                renderLines(tabData[tabKey], true);
            }
        });
    });

    // Quick Command Chips Toolbar
    cmdChips.forEach(chip => {
        chip.addEventListener("click", () => {
            const cmd = chip.getAttribute("data-cmd");

            // Visual active flash on chip
            cmdChips.forEach(c => c.classList.remove("chip-active"));
            chip.classList.add("chip-active");
            setTimeout(() => chip.classList.remove("chip-active"), 350);

            if (cmd === "clear") {
                clearTimers();
                terminalBody.innerHTML = `
                    <div class="terminal-line"><span class="terminal-prompt">$</span> <span class="cmd-text">clear</span></div>
                    <div class="terminal-line"><span class="terminal-prompt">$</span> <span class="terminal-cursor-blink">_</span></div>
                `;
            } else if (cmd === "fetch") {
                tabs.forEach(t => t.classList.toggle("active", t.getAttribute("data-tab") === "profile"));
                renderLines(tabData.profile, true);
            } else if (cmd === "stack") {
                tabs.forEach(t => t.classList.toggle("active", t.getAttribute("data-tab") === "stack"));
                renderLines(tabData.stack, true);
            } else if (cmd === "projects") {
                tabs.forEach(t => t.classList.remove("active"));
                const projectLines = [
                    { type: "cmd", text: "list --all-repositories" },
                    { type: "out", key: "[p1] DLAILS Lab Incident Logger:", text: "Java Swing UI, MySQL, JDBC // PRODUCTION_STABLE" },
                    { type: "out", key: "[p2] Lost & Found NCST System:", text: "PHP, MySQL, Bootstrap // CAMPUS_PORTAL" },
                    { type: "out", key: "[p3] Stym Web Platform:", text: "JavaScript, CSS3, Figma Tokens // INTERACTIVE_UI" },
                    { type: "out", key: "[p4] Supermarket POS Utility:", text: "C++20, Object-Oriented, Binary I/O // HIGH_EFFICIENCY" },
                    { type: "out", quote: true, text: "Scroll to section [04 // PROJECTS] to view full architecture & specs." }
                ];
                renderLines(projectLines, true);
            } else if (cmd === "contact") {
                tabs.forEach(t => t.classList.remove("active"));
                const contactLines = [
                    { type: "cmd", text: "netstat --contact-endpoints" },
                    { type: "out", key: "Direct Email:", text: "agoilotristanray@gmail.com" },
                    { type: "out", key: "Location:", text: "Cavite, Philippines [UTC+8]" },
                    { type: "out", key: "Socials:", text: "GitHub: /tztn | LinkedIn: /in/tristan-agoilo" },
                    { type: "out", key: "Transmission:", text: "SYS_STATUS: READY_FOR_DEPLOYMENT" },
                    { type: "out", quote: true, text: "Channel open for software engineering inquiries." }
                ];
                renderLines(contactLines, true);
            }
        });
    });
}

/* ==========================================================================
   04: SKILLS MATRIX INTERACTIVE HEX POPOVER & FILTER ENGINE
   ========================================================================== */
const skillsHexData = {
    cpp: {
        name: "C++",
        badge: "[ SYSTEMS // C++20 ]",
        level: "Expert (3+ Yrs)",
        quote: "Low-level memory management, multithreaded concurrency routines, and high-performance algorithmic execution.",
        focus: "Pointers & References, SHA-256 Routines, File I/O Streams, RAII Concurrency"
    },
    java: {
        name: "Java",
        badge: "[ DESKTOP // JDK 21 ]",
        level: "Expert (3+ Yrs)",
        quote: "Object-oriented desktop architectures, Java Swing POS client interfaces, and JDBC transactional connectivity.",
        focus: "OOP Design Patterns, Swing Layout Managers, ACID Database Queries, Event Dispatch Thread"
    },
    python: {
        name: "Python",
        badge: "[ DATA // PYTHON 3 ]",
        level: "Advanced (2+ Yrs)",
        quote: "Quantitative data modeling with Pandas, statistical regression analysis, and batch filesystem automation scripts.",
        focus: "Pandas DataFrame Pipelines, NumPy Math Modeling, Matplotlib Visualizations, System Automation"
    },
    mysql: {
        name: "MySQL",
        badge: "[ DATABASE // SQL ]",
        level: "Advanced (3+ Yrs)",
        quote: "Relational schema engineering, composite index tuning, foreign key constraints, and ACID-compliant transaction pipelines.",
        focus: "Schema Normalization (3NF), Query Execution Optimization, Relational Integrity"
    },
    php: {
        name: "PHP",
        badge: "[ BACKEND // PHP 8.2 ]",
        level: "Intermediate (2+ Yrs)",
        quote: "Server-side RESTful API controllers, role-based access verification, and session state management for campus portals.",
        focus: "PDO Prepared Statements, RBAC Authorization Matrices, CRUD Query Optimization"
    },
    javascript: {
        name: "JavaScript",
        badge: "[ CLIENT // ES6+ ]",
        level: "Advanced (3+ Yrs)",
        quote: "Reactive UI state management, Web Audio API synthesis, dynamic HTML5 canvas shaders, and asynchronous event handlers.",
        focus: "DOM Event Delegation, Asynchronous Promises, Web Audio API, Interactive Canvas"
    },
    vue: {
        name: "Vue.js",
        badge: "[ FRAMEWORK // VUE 3 ]",
        level: "Advanced (2+ Yrs)",
        quote: "Single-file component composition, reactive state stores, and modular interface workflows for responsive web tools.",
        focus: "Component Composition, Props & Emit Reactivity, Virtual DOM Diffing"
    },
    html5: {
        name: "HTML5",
        badge: "[ MARKUP // SEMANTIC ]",
        level: "Expert (4+ Yrs)",
        quote: "Semantic document architecture, accessible ARIA roles, and standards-compliant structural markup hierarchies.",
        focus: "Semantic Elements, ARIA Roles, SEO Meta Structures"
    },
    css3: {
        name: "CSS3",
        badge: "[ STYLING // MODERN ]",
        level: "Expert (4+ Yrs)",
        quote: "Custom property token design systems, CSS Grid/Flexbox layouts, glassmorphic filters, and GPU-accelerated micro-animations.",
        focus: "CSS Variables Design System, Flexbox/Grid Systems, 3D Perspective Transforms"
    },
    figma: {
        name: "Figma",
        badge: "[ DESIGN // TOKENS ]",
        level: "Expert (3+ Yrs)",
        quote: "High-contrast monochrome UI design systems, responsive auto-layout prototypes, and scalable vector assets.",
        focus: "Design Tokens Hierarchy, Auto-Layout Components, Interactive Prototype Flows"
    },
    vscode: {
        name: "VS Code",
        badge: "[ DEV // WORKSPACE ]",
        level: "Expert (4+ Yrs)",
        quote: "Custom workspace configurations, integrated debugger terminals, and multi-language linting extensions.",
        focus: "Git Worktrees, Workspace Configs, Profiler Diagnostics"
    },
    git: {
        name: "Git / GitHub",
        badge: "[ VERSION // CI/CD ]",
        level: "Advanced (3+ Yrs)",
        quote: "Branch control workflows, atomic commits, repository documentation, and pull request code reviews.",
        focus: "Branch Rebasing & Merging, Commit History Integrity, Remote Collaborations"
    },
    netbeans: {
        name: "Apache NetBeans",
        badge: "[ JAVA IDE // GUI ]",
        level: "Advanced (2+ Yrs)",
        quote: "Ant/Maven build lifecycles, Swing GUI form builders, and bytecode compilation workflows for desktop clients.",
        focus: "Maven/Ant Compilers, Swing Form Architecture, JVM Debugging"
    },
    xampp: {
        name: "XAMPP Stack",
        badge: "[ LOCAL SERVER // ENV ]",
        level: "Advanced (3+ Yrs)",
        quote: "Local development hosting environment for Apache web servers, PHP runtimes, and phpMyAdmin MySQL instances.",
        focus: "Apache VirtualHosts, phpMyAdmin Administration, Local Port Routing"
    }
};

function initSkillsHUD() {
    const container = document.querySelector(".skills-hex-container");
    const grid = document.getElementById("skills-hex-grid");
    const popover = document.getElementById("hex-popover-card");
    const techNodes = document.querySelectorAll(".tech-logo-item, .tech-brand-tile, .tech-node");
    const filterPills = document.querySelectorAll(".skills-filter-pill");

    if (!container || !popover || !techNodes.length) return;

    const popName = document.getElementById("hex-pop-name");
    const popBadge = document.getElementById("hex-pop-badge");
    const popLevel = document.getElementById("hex-pop-level");
    const popQuote = document.getElementById("hex-pop-quote");
    const popFocus = document.getElementById("hex-pop-focus");

    let activeNode = null;
    let hideTimeout = null;

    function positionPopover(node) {
        const containerRect = container.getBoundingClientRect();
        const nodeRect = node.getBoundingClientRect();

        const popWidth = popover.offsetWidth || 340;
        const popHeight = popover.offsetHeight || 190;

        // Center horizontally relative to node
        let left = (nodeRect.left - containerRect.left) + (nodeRect.width / 2) - (popWidth / 2);
        
        // Keep within container bounds
        if (left < 0) left = 0;
        if (left + popWidth > containerRect.width) left = containerRect.width - popWidth;

        // Position above the node
        let top = (nodeRect.top - containerRect.top) - popHeight - 14;

        // If overflowing above, position below
        if (top < 0) {
            top = (nodeRect.bottom - containerRect.top) + 14;
        }

        popover.style.left = `${Math.round(left)}px`;
        popover.style.top = `${Math.round(top)}px`;
    }

    function showPopover(node) {
        clearTimeout(hideTimeout);
        const skillId = node.getAttribute("data-skill-id");
        const data = skillsHexData[skillId];
        if (!data) return;

        techNodes.forEach(n => n.classList.remove("active-node"));
        node.classList.add("active-node");
        activeNode = node;

        if (popName) popName.textContent = data.name;
        if (popBadge) popBadge.textContent = data.badge;
        if (popLevel) popLevel.textContent = data.level;
        if (popQuote) popQuote.textContent = `${data.quote}`;
        if (popFocus) popFocus.textContent = data.focus;

        popover.classList.add("visible");
        positionPopover(node);
    }

    function hidePopover() {
        hideTimeout = setTimeout(() => {
            popover.classList.remove("visible");
            if (activeNode) {
                activeNode.classList.remove("active-node");
                activeNode = null;
            }
        }, 180);
    }

    techNodes.forEach((node) => {
        node.addEventListener("mouseenter", () => showPopover(node));
        node.addEventListener("focus", () => showPopover(node));
        node.addEventListener("mouseleave", hidePopover);
        node.addEventListener("blur", hidePopover);
        node.addEventListener("click", (e) => {
            showPopover(node);
        });
    });

    // Keep popover visible if user hovers directly onto the card (e.g. to click Read Story)
    popover.addEventListener("mouseenter", () => {
        clearTimeout(hideTimeout);
    });
    popover.addEventListener("mouseleave", hidePopover);

    // Category Filter Pills
    filterPills.forEach(pill => {
        pill.addEventListener("click", () => {
            filterPills.forEach(p => p.classList.remove("active"));
            pill.classList.add("active");

            const filter = pill.getAttribute("data-skill-filter");
            techNodes.forEach(node => {
                const category = node.getAttribute("data-category");
                if (filter === "all" || category === filter) {
                    node.classList.remove("filter-hidden");
                } else {
                    node.classList.add("filter-hidden");
                }
            });
            hidePopover();
        });
    });

    window.addEventListener("resize", () => {
        if (activeNode && popover.classList.contains("visible")) {
            positionPopover(activeNode);
        }
    }, { passive: true });
}

/* ==========================================================================
   05: PROJECT CATEGORY FILTERING & REAL-TIME SEARCH (KOYEB UI)
   ========================================================================== */
function initProjectsFilter() {
    const filterBtns = document.querySelectorAll(".filter-btn, .koyeb-filter-pill");
    const projectCards = document.querySelectorAll(".koyeb-app-card, .bento-project-card, .project-card");
    const searchInput = document.getElementById("koyeb-search-input");

    if (!projectCards.length) return;

    let currentFilter = "all";
    let searchQuery = "";

    function filterCards() {
        projectCards.forEach(card => {
            const category = card.getAttribute("data-category");
            const cardText = card.textContent.toLowerCase();

            const matchesCategory = currentFilter === "all" || category === currentFilter;
            const matchesSearch = !searchQuery || cardText.includes(searchQuery);

            if (matchesCategory && matchesSearch) {
                card.classList.remove("filter-hidden");
            } else {
                card.classList.add("filter-hidden");
            }
        });
    }

    filterBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            filterBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            currentFilter = btn.getAttribute("data-filter") || "all";
            filterCards();
        });
    });

    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            searchQuery = e.target.value.trim().toLowerCase();
            filterCards();
        });
    }
}

/* ==========================================================================
   06: PROJECT DETAIL IN-PAGE VIEW CONTROLLER (NO DISRUPTIVE POPUPS)
   ========================================================================== */
const projectData = {
    dlails: {
        id: "dlails",
        title: "Digital Laboratory Utilization & Incident Logging System (DLAILS)",
        badge: "[ SYSTEMS / DESKTOP ]",
        category: "systems",
        repo: "https://github.com/tztn/DLAILS",
        repoSlug: "tztn / DLAILS",
        lang: "Java",
        langColor: "#f89820",
        stack: "Java, Java Swing, MySQL, JDBC, NetBeans IDE",
        arch: "Desktop Client-Server Architecture, ACID Database Transactions, Event Dispatch Thread",
        status: "PUBLIC_REPO // PRODUCTION_STABLE",
        overview: "A desktop management system for tracking computer lab utilization, student sessions, hardware availability, and real-time incident logging across campus laboratories.",
        contributions: [
            "Architected a responsive Java Swing desktop interface with specialized layout managers for rapid student workstation allocation.",
            "Engineered transactional JDBC database layer ensuring zero concurrency collision during simultaneous student terminal logins.",
            "Implemented real-time hardware fault and peripheral incident reporting module with technician resolution audit logs."
        ],
        tags: ["Java", "Java Swing", "MySQL", "JDBC", "NetBeans"]
    },
    lostfound: {
        id: "lostfound",
        title: "Lost & Found NCST System",
        badge: "[ WEB SYSTEMS ]",
        category: "web",
        repo: "https://github.com/tztn/lost-found-ncst-system",
        repoSlug: "tztn / lost-found-ncst-system",
        lang: "PHP",
        langColor: "#777bb4",
        stack: "PHP, MySQL, HTML5, CSS3, Bootstrap",
        arch: "MVC Web Architecture, Relational Schema (3NF), Role-Based Access Control (RBAC)",
        status: "PUBLIC_REPO // CAMPUS_PILOT",
        overview: "A web-based campus portal for reporting, tracking, and verifying lost and found property at NCST, featuring role-based admin workflows and automated claim verifications.",
        contributions: [
            "Engineered 3NF relational schema in MySQL with composite indexes for lightning-fast keyword matching between lost logs and found entries.",
            "Implemented multi-tier RBAC authorization allowing Campus Security, Department Administrators, and Students secure access.",
            "Built tamper-resistant administrative audit logs tracking verification statuses, physical locker IDs, and claim handover paperwork."
        ],
        tags: ["PHP", "MySQL", "HTML5", "CSS3", "Bootstrap"]
    },
    stym: {
        id: "stym",
        title: "Stym (Systems & Web Platform)",
        badge: "[ WEB / FRONTEND ]",
        category: "web",
        repo: "https://github.com/tztn/Stym",
        repoSlug: "tztn / Stym",
        lang: "JavaScript",
        langColor: "#f7df1e",
        stack: "HTML5, CSS3, JavaScript, Figma",
        arch: "Component Composition, CSS Custom Property Design Tokens, High-Contrast Responsive Layouts",
        status: "PUBLIC_REPO // ACTIVE",
        overview: "A responsive web interface and interactive dashboard concept engineered for clean data visualization, user navigation, and modern component workflows.",
        contributions: [
            "Defined complete typography and design token systems in Figma and translated into responsive CSS custom properties.",
            "Engineered lightweight, dependency-free interactive UI components with fluid micro-animations and accessibility standards.",
            "Integrated cross-browser responsive layouts optimized for high-density displays and mobile viewport sizes."
        ],
        tags: ["HTML5", "CSS3", "JavaScript", "Figma"]
    },
    supermarket: {
        id: "supermarket",
        title: "Supermarket Management & POS Utility",
        badge: "[ PROGRAMMING / C++ ]",
        category: "programming",
        repo: "https://github.com/tztn/supermarket",
        repoSlug: "tztn / supermarket",
        lang: "C++",
        langColor: "#00599c",
        stack: "C++, OOP, File Handling / DBMS Concepts, CLI / Console",
        arch: "Object-Oriented Architecture, Binary File Serialization, In-Memory Data Structures",
        status: "PUBLIC_REPO // CORE_TOOLKIT",
        overview: "A high-efficiency console-based supermarket inventory, pricing, and point-of-sale checkout system built with Object-Oriented C++ and persistent data structures.",
        contributions: [
            "Engineered binary file serialization streams (fstream) for persistent, corruption-resistant storage of product inventories without external DBMS.",
            "Implemented object-oriented product catalog classes with polymorphic discount calculations and real-time inventory deductions.",
            "Built robust console input validation routines preventing memory leaks, buffer overruns, and incorrect billing computations."
        ],
        tags: ["C++", "OOP", "File Handling", "CLI / Console"]
    }
};

// Aliases for legacy triggers
projectData.p1 = projectData.dlails;
projectData.p2 = projectData.lostfound;
projectData.p3 = projectData.stym;
projectData.p4 = projectData.supermarket;

function initProjectDetailsController() {
    const bentoContainer = document.getElementById("projects-bento-view");
    const detailView = document.getElementById("project-detail-view");
    const backBtn = document.getElementById("back-to-projects-btn");
    const projectSection = document.getElementById("projects");

    if (!detailView || !bentoContainer) return;

    function renderProjectDetail(projectId) {
        const data = projectData[projectId];
        if (!data) return;

        // Populate detail view fields
        const stickyBadge = document.getElementById("detail-sticky-badge");
        const stickyGithub = document.getElementById("detail-sticky-github");
        const mainTitle = document.getElementById("detail-main-title");
        const langDot = document.getElementById("detail-lang-dot");
        const langText = document.getElementById("detail-lang-text");
        const statusPill = document.getElementById("detail-status-pill");
        const overviewP = document.getElementById("detail-overview-text");
        const stackList = document.getElementById("detail-stack-list");
        const archText = document.getElementById("detail-arch-text");
        const contributionsList = document.getElementById("detail-contributions-list");
        const cloneCode = document.getElementById("detail-clone-code");
        const primaryGithubBtn = document.getElementById("detail-primary-github-btn");

        if (stickyBadge) stickyBadge.textContent = data.badge;
        if (stickyGithub) stickyGithub.href = data.repo;
        if (mainTitle) mainTitle.textContent = data.title;
        if (langText) langText.textContent = data.lang;
        if (langDot) langDot.style.backgroundColor = data.langColor || "var(--text-primary)";
        if (statusPill) statusPill.textContent = data.status;
        if (overviewP) overviewP.textContent = data.overview;
        if (archText) archText.textContent = data.arch;

        if (stackList) {
            stackList.innerHTML = "";
            data.tags.forEach(tag => {
                const span = document.createElement("span");
                span.className = "detail-tag-chip font-mono";
                span.textContent = `[ ${tag} ]`;
                stackList.appendChild(span);
            });
        }

        if (contributionsList) {
            contributionsList.innerHTML = "";
            data.contributions.forEach(item => {
                const li = document.createElement("li");
                li.textContent = item;
                contributionsList.appendChild(li);
            });
        }

        if (cloneCode) {
            cloneCode.textContent = `git clone ${data.repo}.git`;
        }

        if (primaryGithubBtn) {
            primaryGithubBtn.href = data.repo;
        }

        // Smooth in-page transition
        bentoContainer.classList.add("view-hidden");
        detailView.classList.remove("view-hidden");
        detailView.classList.add("view-active");

        // Scroll to projects section top cleanly
        if (projectSection) {
            projectSection.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }

    function returnToProjectsGrid() {
        detailView.classList.remove("view-active");
        detailView.classList.add("view-hidden");
        bentoContainer.classList.remove("view-hidden");

        if (projectSection) {
            projectSection.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }

    // Attach trigger listeners
    document.addEventListener("click", (e) => {
        const trigger = e.target.closest("[data-project-trigger], [data-project-id]");
        if (trigger && !trigger.classList.contains("modal-close-btn")) {
            const id = trigger.getAttribute("data-project-trigger") || trigger.getAttribute("data-project-id");
            if (id && projectData[id]) {
                e.preventDefault();
                renderProjectDetail(id);
            }
        }
    });

    if (backBtn) {
        backBtn.addEventListener("click", (e) => {
            e.preventDefault();
            returnToProjectsGrid();
        });
    }

    // 1-Click Clone Command Copy
    const copyCloneBtn = document.getElementById("copy-clone-btn");
    if (copyCloneBtn) {
        copyCloneBtn.addEventListener("click", () => {
            const cloneCode = document.getElementById("detail-clone-code");
            if (cloneCode) {
                navigator.clipboard.writeText(cloneCode.textContent.trim()).then(() => {
                    const originalText = copyCloneBtn.textContent;
                    copyCloneBtn.textContent = "[ COPIED! ]";
                    setTimeout(() => {
                        copyCloneBtn.textContent = originalText;
                    }, 2000);
                });
            }
        });
    }
}

/* ==========================================================================
   07: CONTACT FEEDBACK & CYBER ERROR VALIDATION
   ========================================================================== */
function initContactFeedback() {
    const copyBtn = document.getElementById("copy-email-btn");
    const contactForm = document.getElementById("contact-form");
    const emailToCopy = "agoilotristanray@gmail.com";

    // Copy Email to Clipboard
    if (copyBtn) {
        copyBtn.addEventListener("click", async () => {
            try {
                await navigator.clipboard.writeText(emailToCopy);
                const originalText = copyBtn.textContent;
                copyBtn.textContent = "[COPIED ✓]";
                copyBtn.classList.add("btn-copy-pulse");

                setTimeout(() => {
                    copyBtn.textContent = originalText;
                    copyBtn.classList.remove("btn-copy-pulse");
                }, 2000);
            } catch (err) {
                console.error("Clipboard copy failed:", err);
            }
        });
    }

    // Cyber Form Validation & Submission
    if (contactForm) {
        const nameInput = document.getElementById("form-name");
        const emailInput = document.getElementById("form-email");
        const messageInput = document.getElementById("form-message");
        const nameError = document.getElementById("name-error");
        const emailError = document.getElementById("email-error");
        const messageError = document.getElementById("message-error");
        const submitBtn = document.getElementById("form-submit-btn");
        const feedbackHud = document.getElementById("form-feedback-hud");

        function validateName() {
            if (!nameInput.value.trim()) {
                nameInput.classList.add("field-error");
                nameError.textContent = "ERR_REQUIRED: Full Name is necessary.";
                nameError.classList.add("visible");
                return false;
            } else {
                nameInput.classList.remove("field-error");
                nameError.classList.remove("visible");
                return true;
            }
        }

        function validateEmail() {
            const val = emailInput.value.trim();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!val) {
                emailInput.classList.add("field-error");
                emailError.textContent = "ERR_REQUIRED: Email address is necessary.";
                emailError.classList.add("visible");
                return false;
            } else if (!emailRegex.test(val)) {
                emailInput.classList.add("field-error");
                emailError.textContent = "ERR_INVALID: Please enter a valid email address.";
                emailError.classList.add("visible");
                return false;
            } else {
                emailInput.classList.remove("field-error");
                emailError.classList.remove("visible");
                return true;
            }
        }

        function validateMessage() {
            if (!messageInput.value.trim()) {
                messageInput.classList.add("field-error");
                messageError.textContent = "ERR_REQUIRED: Scope/Message details are necessary.";
                messageError.classList.add("visible");
                return false;
            } else {
                messageInput.classList.remove("field-error");
                messageError.classList.remove("visible");
                return true;
            }
        }

        // Real-time cleanup on input
        nameInput?.addEventListener("input", () => {
            if (nameInput.value.trim()) {
                nameInput.classList.remove("field-error");
                nameError.classList.remove("visible");
            }
        });

        emailInput?.addEventListener("input", () => {
            if (emailInput.value.trim()) {
                emailInput.classList.remove("field-error");
                emailError.classList.remove("visible");
            }
        });

        messageInput?.addEventListener("input", () => {
            if (messageInput.value.trim()) {
                messageInput.classList.remove("field-error");
                messageError.classList.remove("visible");
            }
        });

        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const isNameValid = validateName();
            const isEmailValid = validateEmail();
            const isMessageValid = validateMessage();

            if (!isNameValid || !isEmailValid || !isMessageValid) {
                feedbackHud.className = "form-feedback-hud font-mono error";
                feedbackHud.textContent = "TRANSMISSION_FAILED: Please fix validation errors above.";
                return;
            }

            // Valid - Transmit
            feedbackHud.className = "form-feedback-hud font-mono transmitting";
            feedbackHud.textContent = "TRANSMITTING: Establishing connection...";
            submitBtn.disabled = true;
            const originalBtnContent = submitBtn.innerHTML;
            submitBtn.innerHTML = `<span>TRANSMITTING...</span>`;

            setTimeout(() => {
                contactForm.reset();
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnContent;
                feedbackHud.className = "form-feedback-hud font-mono success";
                feedbackHud.textContent = "TRANSMISSION_SUCCESS: Message transmitted to Tristan. I'll get back to you soon.";

                setTimeout(() => {
                    feedbackHud.className = "form-feedback-hud font-mono";
                    feedbackHud.style.display = "none";
                }, 5000);
            }, 700);
        });
    }
}

/* ==========================================================================
   08: SCROLL REVEAL OBSERVER
   ========================================================================== */
function initScrollReveal() {
    const revealSections = document.querySelectorAll(".reveal-section");
    const staggerItems = document.querySelectorAll(".stagger-item");

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("revealed");
            }
        });
    }, { threshold: 0.1 });

    revealSections.forEach(sec => revealObserver.observe(sec));
    staggerItems.forEach(item => revealObserver.observe(item));
}
