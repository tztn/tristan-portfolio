/* ==========================================================================
   PORTFOLIO SCRIPTS (PARTICLE CANVAS, CURSOR, TERMINAL & MODAL)
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    initInteractiveCanvas();
    initCustomCursor();
    initDevDock();
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
   02.5: INTERACTIVE DEVDOCK CONTROLLER (SHELF FILTERS & LIVE PREVIEWS)
   ========================================================================== */
function initDevDock() {
    const dock = document.getElementById("hero-dock-container");
    const filterPills = document.querySelectorAll(".dock-pill");
    const itemCards = document.querySelectorAll(".dock-item-card");
    const terminalView = document.getElementById("dock-terminal-view");
    const searchInput = document.getElementById("dock-search-input");

    if (!dock) return;

    // Filter Switcher
    filterPills.forEach(pill => {
        pill.addEventListener("click", () => {
            filterPills.forEach(p => p.classList.remove("active"));
            pill.classList.add("active");

            const filter = pill.getAttribute("data-dock-filter");
            if (filter === "terminal") {
                itemCards.forEach(c => c.style.display = "none");
                if (terminalView) terminalView.style.display = "flex";
            } else {
                if (terminalView) terminalView.style.display = "none";
                itemCards.forEach(card => {
                    const cat = card.getAttribute("data-category");
                    if (filter === "all" || cat === filter) {
                        card.style.display = "flex";
                    } else {
                        card.style.display = "none";
                    }
                });
            }
        });
    });

    // Real-time Search
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            const query = e.target.value.toLowerCase().trim();
            if (query === "terminal" || query === "cmd" || query === "sh" || query === "help") {
                filterPills.forEach(p => p.classList.toggle("active", p.getAttribute("data-dock-filter") === "terminal"));
                itemCards.forEach(c => c.style.display = "none");
                if (terminalView) terminalView.style.display = "flex";
                return;
            }

            if (terminalView && terminalView.style.display === "flex") {
                terminalView.style.display = "none";
                filterPills.forEach(p => p.classList.toggle("active", p.getAttribute("data-dock-filter") === "all"));
            }

            itemCards.forEach(card => {
                const text = card.textContent.toLowerCase();
                if (!query || text.includes(query)) {
                    card.style.display = "flex";
                } else {
                    card.style.display = "none";
                }
            });
        });
    }

    // Subtle 3D Mouse Perspective Physics on Dock
    dock.addEventListener("mousemove", (e) => {
        const rect = dock.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -1.8;
        const rotateY = ((x - centerX) / centerX) * 2.2;
        dock.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
    });

    dock.addEventListener("mouseleave", () => {
        dock.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)";
    });
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
            { type: "out", key: "Role:", text: "Front-End Developer & UI Designer" },
            { type: "out", key: "Focus:", text: "Bootstrap, Figma UI Design, Responsive Web & Practical Software" },
            { type: "out", key: "Status:", text: "Available for internships, front-end & UI design roles" },
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
                    { type: "out", key: "Socials:", text: "GitHub: /tztn" },
                    { type: "out", key: "Transmission:", text: "SYS_STATUS: READY_FOR_DEPLOYMENT" },
                    { type: "out", quote: true, text: "Channel open for software engineering inquiries." }
                ];
                renderLines(contactLines, true);
            }
        });
    });
}

/* ==========================================================================
   04: SKILLS MATRIX MINIMAL HOVER TOOLTIP & FILTER ENGINE
   ========================================================================== */
const skillsHexData = {
    cpp: { name: "C++", level: "Advanced" },
    java: { name: "Java", level: "Advanced" },
    python: { name: "Python", level: "Advanced" },
    mysql: { name: "MySQL", level: "Advanced" },
    php: { name: "PHP", level: "Intermediate" },
    javascript: { name: "JavaScript", level: "Advanced" },
    vue: { name: "Vue.js", level: "Intermediate" },
    html5: { name: "HTML5", level: "Advanced" },
    css3: { name: "CSS3", level: "Advanced" },
    figma: { name: "Figma", level: "Intermediate" },
    vscode: { name: "VS Code", level: "Advanced" },
    git: { name: "Git / GitHub", level: "Advanced" },
    netbeans: { name: "NetBeans", level: "Intermediate" },
    xampp: { name: "XAMPP", level: "Intermediate" }
};

function initSkillsHUD() {
    const container = document.querySelector(".skills-hex-container");
    const grid = document.getElementById("skills-hex-grid");
    const popover = document.getElementById("hex-popover-card");
    const techNodes = document.querySelectorAll(".tech-logo-item, .tech-brand-tile, .tech-node");
    const filterPills = document.querySelectorAll(".skills-filter-pill");

    if (!container || !popover || !techNodes.length) return;

    const popName = document.getElementById("hex-pop-name");
    const popLevel = document.getElementById("hex-pop-level");

    let activeNode = null;
    let hideTimeout = null;

    function positionPopover(node) {
        const containerRect = container.getBoundingClientRect();
        const nodeRect = node.getBoundingClientRect();

        const popWidth = popover.offsetWidth || 150;
        const popHeight = popover.offsetHeight || 36;

        // Center horizontally relative to node
        let left = (nodeRect.left - containerRect.left) + (nodeRect.width / 2) - (popWidth / 2);
        
        // Keep within container bounds
        if (left < 6) left = 6;
        if (left + popWidth > containerRect.width - 6) left = containerRect.width - popWidth - 6;

        // Position above the node
        let top = (nodeRect.top - containerRect.top) - popHeight - 8;

        // If overflowing above, position below
        if (top < 0) {
            top = (nodeRect.bottom - containerRect.top) + 8;
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
        if (popLevel) {
            popLevel.textContent = data.level;
            popLevel.className = `tooltip-level-chip font-mono level-${data.level.toLowerCase()}`;
        }

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
        }, 120);
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
        title: "DLAILS — Digital Lab Utilization & Incident Logger",
        badge: "[ DESKTOP / JAVA ]",
        category: "systems",
        lang: "Java",
        langColor: "#f89820",
        image: "assets/images/projects/dlails.png",
        stack: "Java, Java Swing, MySQL, JDBC, NetBeans IDE",
        arch: "Desktop Client-Server Setup, MySQL Database, Event-Driven UI",
        status: "COMPLETED & ACTIVE",
        overview: "A desktop management application for tracking computer laboratory usage, student terminal logins, and recording maintenance reports across school laboratories.",
        contributions: [
            "Designed a clean Java Swing user interface for student login and seat allocation.",
            "Connected Java front-end to a MySQL database using JDBC for reliable record keeping.",
            "Implemented an incident logging module for students and lab technicians to report workstation issues."
        ],
        tags: ["Java", "Java Swing", "MySQL", "JDBC", "NetBeans"]
    },
    lostfound: {
        id: "lostfound",
        title: "Lost & Found NCST — Campus Web Portal",
        badge: "[ WEB / BOOTSTRAP ]",
        category: "web",
        lang: "PHP / Bootstrap",
        langColor: "#777bb4",
        image: "assets/images/projects/lostfound.png",
        stack: "PHP, MySQL, Bootstrap, HTML5, CSS3",
        arch: "Responsive Web Portal, MySQL Database, Role-Based Login",
        status: "COMPLETED & TESTED",
        overview: "A responsive campus web portal built with Bootstrap and PHP to help students and staff report, search, and claim lost items at NCST.",
        contributions: [
            "Built responsive web layouts using Bootstrap, ensuring clean display on mobile phones, tablets, and desktop computers.",
            "Created an intuitive search tool that helps students quickly find reported lost and found items.",
            "Developed user roles for students and security staff to verify claims and update item statuses."
        ],
        tags: ["Bootstrap", "PHP", "MySQL", "HTML5", "CSS3"]
    },
    stym: {
        id: "stym",
        title: "Stym — Gaming Storefront Website",
        badge: "[ FRONT-END / WEB ]",
        category: "web",
        lang: "Bootstrap / JavaScript",
        langColor: "#f7df1e",
        image: "assets/images/projects/stym.png",
        stack: "HTML5, CSS3, JavaScript, Bootstrap",
        arch: "Front-End Web Layout, Responsive Product Cards, Interactive Catalog",
        status: "COMPLETED & LIVE",
        overview: "A responsive gaming storefront website designed with Bootstrap and JavaScript, featuring trending game banners, category filters, and product cards.",
        contributions: [
            "Designed an engaging dark-mode storefront layout with modern typography and sleek product cards.",
            "Built responsive catalog grids using Bootstrap classes and modular CSS.",
            "Added interactive JavaScript hover effects, game detail previews, and shopping cart buttons."
        ],
        tags: ["Bootstrap", "HTML5", "CSS3", "JavaScript"]
    },
    sneakrs: {
        id: "sneakrs",
        title: "SNEAKRS — Streetwear & Sneaker E-Commerce UI",
        badge: "[ FIGMA / UI DESIGN ]",
        category: "tools",
        lang: "Figma Design",
        langColor: "#f24e1e",
        image: "assets/images/projects/sneakrs-figma.png",
        externalLink: "https://www.figma.com/design/TtzDl0lTbHSKuFOdQaV4gu/LAB-1-MIDTERM-AGOILO---MANAOG-?node-id=0-1&t=pc5Yyb29vXaNwzzi-1",
        externalLinkLabel: "[ OPEN FIGMA PROJECT ↗ ]",
        stack: "Figma, Auto-Layout, UI Components, Color Tokens, Typography",
        arch: "Modular Figma Component Library, Auto-Layout Frames, Clean UI System",
        status: "DESIGN PROTOTYPE",
        overview: "A modern e-commerce landing page design for limited-edition sneakers and streetwear, prototyped in Figma with reusable components and auto-layout.",
        contributions: [
            "Created a bold, modern visual identity with high-contrast typography and dynamic sneaker showcase layouts.",
            "Built reusable Figma UI components with Auto-Layout for responsive card resizing.",
            "Organized consistent color styles, button states, and spacing tokens for smooth developer handoff."
        ],
        tags: ["Figma", "UI/UX Design", "Auto-Layout", "Design System"]
    },
    supermarket: {
        id: "supermarket",
        title: "Supermarket POS & Billing System",
        badge: "[ DESKTOP / C++ ]",
        category: "programming",
        lang: "C++",
        langColor: "#00599c",
        image: "assets/images/projects/supermarket.png",
        stack: "C++, Object-Oriented Programming (OOP), File Handling",
        arch: "Object-Oriented Console App, Local File Storage",
        status: "COMPLETED",
        overview: "A reliable point-of-sale console tool written in C++ for managing store inventory, computing receipt totals with discounts, and saving sales records to files.",
        contributions: [
            "Structured product and customer classes using clean Object-Oriented Programming principles.",
            "Implemented file handling to store and retrieve inventory data without needing external software.",
            "Created clear interactive console menus with helpful input validation."
        ],
        tags: ["C++", "OOP", "File Storage", "Console App"]
    }
};

// Aliases for legacy triggers
projectData.p1 = projectData.dlails;
projectData.p2 = projectData.lostfound;
projectData.p3 = projectData.stym;
projectData.p4 = projectData.sneakrs;
projectData.p5 = projectData.supermarket;

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
        const mainTitle = document.getElementById("detail-main-title");
        const langDot = document.getElementById("detail-lang-dot");
        const langText = document.getElementById("detail-lang-text");
        const statusPill = document.getElementById("detail-status-pill");
        const overviewP = document.getElementById("detail-overview-text");
        const stackList = document.getElementById("detail-stack-list");
        const archText = document.getElementById("detail-arch-text");
        const contributionsList = document.getElementById("detail-contributions-list");
        const showcaseImg = document.getElementById("detail-showcase-img");
        const showcaseTitle = document.getElementById("detail-showcase-title");
        const externalLink = document.getElementById("detail-external-link");

        if (stickyBadge) stickyBadge.textContent = data.badge;
        if (mainTitle) mainTitle.textContent = data.title;
        if (langText) langText.textContent = data.lang;
        if (langDot) langDot.style.backgroundColor = data.langColor || "var(--text-primary)";
        if (statusPill) statusPill.textContent = data.status;
        if (overviewP) overviewP.textContent = data.overview;
        if (archText) archText.textContent = data.arch;

        if (showcaseImg && data.image) {
            showcaseImg.src = data.image;
            showcaseImg.alt = data.title;
        }
        if (showcaseTitle) {
            showcaseTitle.textContent = `${data.id}_interface_view.png`;
        }
        if (externalLink) {
            if (data.externalLink) {
                externalLink.href = data.externalLink;
                externalLink.style.display = "inline-flex";
                if (data.externalLinkLabel) {
                    externalLink.innerHTML = `<span>${data.externalLinkLabel}</span>`;
                }
            } else {
                externalLink.style.display = "none";
            }
        }

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
