/* ==========================================================================
   PORTFOLIO SCRIPTS (PARTICLE CANVAS, CURSOR, TERMINAL & MODAL)
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    initInteractiveCanvas();
    initCustomCursor();
    initTerminalTypewriter();
    initSkillsHUD();
    initProjectsFilter();
    initProjectModal();
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

    const tabData = {
        profile: [
            { type: "cmd", text: "fetch --developer" },
            { type: "out", key: "Name:", text: "Tristan Ray Agoilo" },
            { type: "out", key: "Role:", text: "Systems Developer & Software Engineer" },
            { type: "out", key: "Focus:", text: "Scalable Backends, Desktop POS Architecture, Creative Frontends" },
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
            { type: "out", key: "Languages:", text: "C++ (C++20), Java (JDK 21), Python 3, JavaScript (ES6+), PHP 8.2" },
            { type: "out", key: "Frameworks:", text: "Vue.js, Java Swing UI, Bootstrap 5, Express/Node" },
            { type: "out", key: "Database:", text: "MySQL, Relational Schema Normalization, JDBC" },
            { type: "out", key: "Design Tools:", text: "Figma (Design Tokens), VS Code, NetBeans, Git" },
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

    function renderLines(lines, animate = true) {
        if (currentTimer) clearTimeout(currentTimer);
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
            return;
        }

        let lineIdx = 0;

        function printNextLine() {
            if (lineIdx >= lines.length) {
                const idleLine = document.createElement("div");
                idleLine.className = "terminal-line";
                idleLine.innerHTML = `<span class="terminal-prompt">$</span> <span class="terminal-cursor-blink">_</span>`;
                terminalBody.appendChild(idleLine);
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

                const interval = setInterval(() => {
                    cmdSpan.textContent += item.text[charIdx];
                    charIdx++;
                    if (charIdx >= item.text.length) {
                        clearInterval(interval);
                        blinkCursor.remove();
                        lineIdx++;
                        currentTimer = setTimeout(printNextLine, 180);
                    }
                }, 28);
            } else {
                lineEl.className = "terminal-line output-line";
                if (item.key) {
                    lineEl.innerHTML = `<span class="key">${item.key}</span> ${item.text}`;
                } else if (item.quote) {
                    lineEl.innerHTML = `<span class="italic">${item.text}</span>`;
                }
                terminalBody.appendChild(lineEl);
                lineIdx++;
                currentTimer = setTimeout(printNextLine, 110);
            }
        }

        printNextLine();
    }

    // Initial Animated Run
    setTimeout(() => renderLines(tabData.profile, true), 300);

    // Tab Switching
    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            tabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");

            const tabKey = tab.getAttribute("data-tab");
            if (tabData[tabKey]) {
                renderLines(tabData[tabKey], false);
            }
        });
    });

    // Quick Command Chips
    cmdChips.forEach(chip => {
        chip.addEventListener("click", () => {
            const cmd = chip.getAttribute("data-cmd");
            if (cmd === "clear") {
                if (currentTimer) clearTimeout(currentTimer);
                terminalBody.innerHTML = `<div class="terminal-line"><span class="terminal-prompt">$</span> <span class="terminal-cursor-blink">_</span></div>`;
            } else if (cmd === "fetch") {
                tabs.forEach(t => t.classList.toggle("active", t.getAttribute("data-tab") === "profile"));
                renderLines(tabData.profile, false);
            } else if (cmd === "stack") {
                tabs.forEach(t => t.classList.toggle("active", t.getAttribute("data-tab") === "stack"));
                renderLines(tabData.stack, false);
            } else if (cmd === "projects") {
                const projectLines = [
                    { type: "cmd", text: "list --all-repositories" },
                    { type: "out", key: "[p1] Lost & Found Campus Portal:", text: "PHP, MySQL, Bootstrap // DEPLOYED" },
                    { type: "out", key: "[p2] Campus Canteen Kiosk POS:", text: "Java Swing UI, MySQL, JDBC // PRODUCTION" },
                    { type: "out", key: "[p3] Desktop Systems Utilities:", text: "C++, Python, Encryption Suite // OPEN_SOURCE" },
                    { type: "out", key: "[p4] EdTech Research Analysis:", text: "Python, Pandas, Regression Models // PUBLISHED" },
                    { type: "out", quote: true, text: "Scroll down to section 04 to inspect full specifications & contributions." }
                ];
                renderLines(projectLines, false);
            } else if (cmd === "contact") {
                const contactLines = [
                    { type: "cmd", text: "netstat --contact-endpoints" },
                    { type: "out", key: "Direct Email:", text: "tristan.agoilo@example.com" },
                    { type: "out", key: "Location:", text: "Manila, Philippines [UTC+8]" },
                    { type: "out", key: "Socials:", text: "GitHub: /tristan-agoilo | LinkedIn: /in/tristan-agoilo" },
                    { type: "out", quote: true, text: "Transmission channel open for software engineering inquiries." }
                ];
                renderLines(contactLines, false);
            }
        });
    });
}

/* ==========================================================================
   04: SKILLS MATRIX INTERACTIVE HUD
   ========================================================================== */
function initSkillsHUD() {
    const badges = document.querySelectorAll(".skill-badge");
    const hudStatus = document.querySelector(".hud-status");
    const hudDetails = document.querySelector(".hud-details");
    const hudName = document.querySelector(".hud-val-name");
    const hudLevel = document.querySelector(".hud-val-level");
    const hudDesc = document.querySelector(".hud-desc");

    if (!badges.length || !hudDetails) return;

    badges.forEach((badge) => {
        badge.addEventListener("mouseenter", () => {
            badges.forEach(b => b.classList.remove("active-hud"));
            badge.classList.add("active-hud");

            const name = badge.querySelector(".badge-text")?.textContent || "";
            const level = badge.getAttribute("data-level") || "";
            const desc = badge.getAttribute("data-desc") || "";

            hudName.textContent = name;
            hudLevel.textContent = level;
            hudDesc.textContent = desc;

            hudStatus.classList.add("hidden");
            hudDetails.classList.remove("hidden");
        });
    });
}

/* ==========================================================================
   05: PROJECT CATEGORY FILTERING
   ========================================================================== */
function initProjectsFilter() {
    const filterBtns = document.querySelectorAll(".filter-btn");
    const projectCards = document.querySelectorAll(".project-card");

    if (!filterBtns.length || !projectCards.length) return;

    filterBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            filterBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            const filter = btn.getAttribute("data-filter");

            projectCards.forEach(card => {
                const category = card.getAttribute("data-category");
                if (filter === "all" || category === filter) {
                    card.classList.remove("filter-hidden");
                } else {
                    card.classList.add("filter-hidden");
                }
            });
        });
    });
}

/* ==========================================================================
   06: PROJECT DETAIL MODAL DIALOG
   ========================================================================== */
const projectData = {
    p1: {
        title: "Lost & Found Campus Portal",
        badge: "SYSTEMS & WEB ARCHITECTURE",
        stack: "PHP, MySQL, Apache, Bootstrap, JavaScript",
        arch: "MVC, Relational Database, RBAC Permission Matrix",
        status: "DEPLOYED_CAMPUS_PILOT",
        desc: "A secure, campus-wide web service designed to manage lost property logs and claims. Features item tracking, claim verification workflows, and an administrative panel.",
        contributions: [
            "Architected relational schema with index tuning on item query searches.",
            "Implemented security validations for authenticated claim verification.",
            "Engineered administrative audit log to prevent unauthorized status changes."
        ],
        tags: ["PHP", "MySQL", "Bootstrap", "Systems"]
    },
    p2: {
        title: "Campus Canteen Kiosk",
        badge: "DESKTOP POS SYSTEM",
        stack: "Java, Swing UI, MySQL, JDBC",
        arch: "Desktop Client, Transactional POS Architecture",
        status: "PRODUCTION_STABLE",
        desc: "An automated self-service point-of-sale desktop system built to streamline cafeteria orders, shorten checkout queues, and sync sales transactions directly to a database.",
        contributions: [
            "Designed a responsive desktop touch interface using Java Swing UI layout managers.",
            "Implemented ACID-compliant SQL queries for itemized receipt printing.",
            "Built automated stock inventory counters with low-inventory notifications."
        ],
        tags: ["Java", "Swing UI", "MySQL", "Systems"]
    },
    p3: {
        title: "Desktop Systems & Script Utilities",
        badge: "SYSTEMS AUTOMATION",
        stack: "C++, Python, Java, Bash",
        arch: "CLI Tools, Concurrency, Hardware Diagnostics",
        status: "OPEN_SOURCE_TOOLKIT",
        desc: "A collection of systems utilities for batch filesystem manipulation, CPU/memory metric monitors, and string encryption suites.",
        contributions: [
            "Built multithreaded file organizers achieving zero data loss on large directories.",
            "Implemented SHA-256 and AES string encryption algorithms in C++.",
            "Created Python automated reporting scripts for memory allocation benchmarks."
        ],
        tags: ["C++", "Python", "Java", "Programming"]
    },
    p4: {
        title: "EdTech Engagement Research",
        badge: "DATA ANALYSIS & RESEARCH",
        stack: "Python, Pandas, NumPy, Matplotlib",
        arch: "Statistical Modeling, Pipeline Automation",
        status: "PUBLISHED_RESEARCH",
        desc: "A quantitative statistics analysis exploring student engagement with educational software tools and its measurable impact on STEM exam performance.",
        contributions: [
            "Cleaned and normalized raw survey data from over 500 participants.",
            "Conducted regression and variance analysis to isolate primary performance factors.",
            "Produced publication-ready visual charts and correlation graphs."
        ],
        tags: ["Python", "Pandas", "Data Analysis"]
    },
    p5: {
        title: "Brand Identity & Digital Art",
        badge: "VECTOR & UI DESIGN",
        stack: "Figma, Adobe Illustrator, Vector Geometry",
        arch: "Design Systems, Token Guides, Asset Specs",
        status: "COMMERCIAL_RELEASE",
        desc: "A complete vector design collection encompassing typography hierarchies, responsive grid tokens, and technical illustration sheets for physical and digital assets.",
        contributions: [
            "Defined high-contrast dark/light monochrome token guidelines in Figma.",
            "Created scalable vector badge systems with exact Pantone color matching.",
            "Built reusable UI asset libraries for web prototypes."
        ],
        tags: ["Figma", "Vector Art", "Design"]
    }
};

function initProjectModal() {
    const modal = document.getElementById("project-modal");
    const closeBtn = document.getElementById("modal-close-btn");
    const cards = document.querySelectorAll(".project-card");

    if (!modal) return;

    function openModal(projectId) {
        const data = projectData[projectId];
        if (!data) return;

        document.getElementById("modal-badge").textContent = data.badge;
        document.getElementById("modal-title").textContent = data.title;
        document.getElementById("modal-spec-stack").textContent = data.stack;
        document.getElementById("modal-spec-arch").textContent = data.arch;
        document.getElementById("modal-spec-status").textContent = data.status;
        document.getElementById("modal-desc").textContent = data.desc;

        const contributionsList = document.getElementById("modal-contributions-list");
        contributionsList.innerHTML = "";
        data.contributions.forEach(item => {
            const li = document.createElement("li");
            li.textContent = item;
            contributionsList.appendChild(li);
        });

        const tagsContainer = document.getElementById("modal-tags");
        tagsContainer.innerHTML = "";
        data.tags.forEach(tag => {
            const span = document.createElement("span");
            span.className = "project-card-tag";
            span.textContent = tag;
            tagsContainer.appendChild(span);
        });

        modal.classList.add("open");
        modal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
    }

    function closeModal() {
        modal.classList.remove("open");
        modal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
    }

    cards.forEach(card => {
        card.addEventListener("click", () => {
            const id = card.getAttribute("data-project-id");
            if (id) openModal(id);
        });
    });

    if (closeBtn) closeBtn.addEventListener("click", closeModal);

    modal.addEventListener("click", (e) => {
        if (e.target === modal) closeModal();
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal.classList.contains("open")) {
            closeModal();
        }
    });
}

/* ==========================================================================
   07: CONTACT FEEDBACK & CYBER ERROR VALIDATION
   ========================================================================== */
function initContactFeedback() {
    const copyBtn = document.getElementById("copy-email-btn");
    const contactForm = document.getElementById("contact-form");
    const emailToCopy = "tristan.agoilo@example.com";

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
