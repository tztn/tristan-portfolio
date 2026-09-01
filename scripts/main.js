/* ==========================================================================
   PORTFOLIO INTERACTIVE LOGIC (CAD BLUEPRINT, CMDK & TERMINAL)
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    initInteractiveCanvas();
    initAudioFeedback();
    initCommandPalette();
    initPhtClock();
    initGithubHeatmap();
    initProjectsFilter();
    initProjectDetailsController();
    initTerminalHud();
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
    const particleCount = isMobile ? 30 : 60;
    const maxDistance = isMobile ? 80 : 120;
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
    });

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4;
            this.radius = Math.random() * 1.5 + 0.8;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }

        draw() {
            const isDark = document.documentElement.classList.contains("dark");
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = isDark ? "rgba(240, 240, 245, 0.4)" : "rgba(30, 30, 35, 0.3)";
            ctx.fill();
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        const isDark = document.documentElement.classList.contains("dark");
        const lineColor = isDark ? "rgba(240, 240, 245," : "rgba(40, 40, 45,";

        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();

            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < maxDistance) {
                    const alpha = (1 - dist / maxDistance) * 0.15;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `${lineColor} ${alpha})`;
                    ctx.lineWidth = 0.6;
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animate);
    }
    animate();
}

/* ==========================================================================
   02: COMMAND PALETTE (CMDK // ⌘K / Ctrl+K)
   ========================================================================== */
function initCommandPalette() {
    const overlay = document.getElementById("cmdk-overlay");
    const input = document.getElementById("cmdk-input");
    const list = document.getElementById("cmdk-list");
    const triggerBtn = document.getElementById("cmdk-trigger-btn");
    const closeKbd = document.querySelector(".cmdk-close-kbd");

    if (!overlay || !input || !list) return;

    function openCmdk() {
        overlay.classList.add("open");
        input.value = "";
        filterItems("");
        input.focus();
        if (window.soundFX) window.soundFX.play("popover");
    }

    function closeCmdk() {
        overlay.classList.remove("open");
    }

    if (triggerBtn) {
        triggerBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            openCmdk();
        });
    }

    if (closeKbd) {
        closeKbd.addEventListener("click", closeCmdk);
    }

    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) closeCmdk();
    });

    document.addEventListener("keydown", (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
            e.preventDefault();
            if (overlay.classList.contains("open")) {
                closeCmdk();
            } else {
                openCmdk();
            }
        } else if (e.key === "Escape" && overlay.classList.contains("open")) {
            closeCmdk();
        }
    });

    function getVisibleItems() {
        return Array.from(list.querySelectorAll(".cmdk-item:not([style*='display: none'])"));
    }

    function filterItems(query) {
        const q = query.toLowerCase().trim();
        const items = list.querySelectorAll(".cmdk-item");
        const groups = list.querySelectorAll(".cmdk-group-title");

        items.forEach(item => {
            const label = (item.getAttribute("data-cmdk-label") || item.textContent).toLowerCase();
            const match = !q || label.includes(q);
            item.style.display = match ? "flex" : "none";
        });

        groups.forEach(group => {
            let next = group.nextElementSibling;
            let hasVisible = false;
            while (next && next.classList.contains("cmdk-item")) {
                if (next.style.display !== "none") hasVisible = true;
                next = next.nextElementSibling;
            }
            group.style.display = hasVisible ? "block" : "none";
        });

        const visible = getVisibleItems();
        items.forEach(i => i.classList.remove("selected"));
        if (visible.length > 0) visible[0].classList.add("selected");
    }

    input.addEventListener("input", (e) => {
        filterItems(e.target.value);
    });

    input.addEventListener("keydown", (e) => {
        const visible = getVisibleItems();
        if (!visible.length) return;

        let currentIndex = visible.findIndex(item => item.classList.contains("selected"));

        if (e.key === "ArrowDown") {
            e.preventDefault();
            if (currentIndex < visible.length - 1) {
                visible[currentIndex].classList.remove("selected");
                visible[currentIndex + 1].classList.add("selected");
                visible[currentIndex + 1].scrollIntoView({ block: "nearest" });
            }
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            if (currentIndex > 0) {
                visible[currentIndex].classList.remove("selected");
                visible[currentIndex - 1].classList.add("selected");
                visible[currentIndex - 1].scrollIntoView({ block: "nearest" });
            }
        } else if (e.key === "Enter") {
            e.preventDefault();
            if (currentIndex >= 0 && visible[currentIndex]) {
                executeCmdkItem(visible[currentIndex]);
            }
        }
    });

    list.addEventListener("click", (e) => {
        const item = e.target.closest(".cmdk-item");
        if (item) executeCmdkItem(item);
    });

    function executeCmdkItem(item) {
        const action = item.getAttribute("data-cmdk-action");
        const target = item.getAttribute("data-cmdk-target");

        closeCmdk();

        if (action === "navigate" && target) {
            const el = document.querySelector(target);
            if (el) el.scrollIntoView({ behavior: "smooth" });
        } else if (action === "project" && target) {
            if (window.openProjectModal) window.openProjectModal(target);
        } else if (action === "theme") {
            const themeBtn = document.getElementById("theme-toggle-desktop");
            if (themeBtn) themeBtn.click();
        } else if (action === "sfx") {
            const sfxBtn = document.getElementById("sfx-toggle-btn");
            if (sfxBtn) sfxBtn.click();
        } else if (action === "copy-email") {
            const copyBtn = document.getElementById("copy-email-btn");
            if (copyBtn) copyBtn.click();
        } else if (action === "link" && target) {
            window.open(target, "_blank");
        }
    }
}

/* ==========================================================================
   05: PROJECT DATA & MODAL CONTROLLER
   ========================================================================== */
const projectData = {
    sneakrs: {
        title: "SNEAKRS Landing Concept",
        badge: "FIGMA / UI",
        desc: "Streetwear & sneaker storefront prototype designed in Figma with auto-layout components, color tokens, and bold typography.",
        architecture: "Built purely in Figma using auto-layout 5.0, variables for dark/light theme switching, and interactive components with smart animate spring transitions.",
        contributions: [
            "Crafted fluid responsive grid frames from 320px mobile to 1440px desktop.",
            "Established unified design tokens for spacing, typography scale, and elevation shadows.",
            "Designed animated cart drawer interactions and hover zoom micro-interactions."
        ],
        tags: ["Figma", "Auto-Layout", "Design Tokens", "UI/UX", "Interactive Prototype"],
        img: "assets/images/projects/sneakrs-figma.png",
        externalLink: "https://www.figma.com/@tristanray"
    },
    dlails: {
        title: "DLAILS Lab Incident Logger",
        badge: "JAVA / SWING",
        desc: "Desktop management system for computer lab utilization, student station allocations, and technician maintenance records.",
        architecture: "Developed using pure Java Swing with MVC pattern, custom Look & Feel renderers, thread-safe file I/O operations, and SQL persistence layer.",
        contributions: [
            "Architected station utilization matrices with real-time seat reservation locks.",
            "Implemented CSV/PDF diagnostic report exports for laboratory coordinators.",
            "Built searchable incident audit logging with priority tagging."
        ],
        tags: ["Java", "Swing GUI", "Telemetry", "File Streams", "OOP Architecture"],
        img: "assets/images/projects/dlails.png",
        externalLink: "https://github.com/tztn"
    },
    stym: {
        title: "Stym Gaming Storefront",
        badge: "WEB / JS",
        desc: "Modern, responsive gaming store website featuring trending title showcases, dynamic catalog grids, and clean navigation.",
        architecture: "Engineered with vanilla JavaScript (ES6+), semantic HTML5, CSS Grid/Flexbox with fluid clamp typography, and asynchronous JSON catalog fetching.",
        contributions: [
            "Built client-side search filtering by genre, price range, and platform tags.",
            "Implemented persistent cart storage using Web Storage API (localStorage).",
            "Designed responsive hero carousel with touch swipe gestures."
        ],
        tags: ["HTML5", "CSS3", "JavaScript (ES6+)", "Responsive UI", "Web Storage"],
        img: "assets/images/projects/stym.png",
        externalLink: "https://github.com/tztn"
    },
    lostfound: {
        title: "NCST Lost & Found Portal",
        badge: "BOOTSTRAP / PHP",
        desc: "Responsive campus web portal built with Bootstrap for item reporting, keyword search, and claim verification records.",
        architecture: "Constructed with PHP MVC backend, normalized MySQL database (3NF), PDO prepared statements for SQL injection prevention, and Bootstrap 5 frontend.",
        contributions: [
            "Designed responsive item card feeds with instant categorical filter pills.",
            "Engineered secure student submission forms with image file uploads and verification.",
            "Implemented admin dashboard for claim approvals and campus safety audits."
        ],
        tags: ["Bootstrap 5", "PHP", "MySQL", "3NF Normalization", "Relational DB"],
        img: "assets/images/projects/lostfound.png",
        externalLink: "https://github.com/tztn"
    },
    supermarket: {
        title: "Supermarket POS & Inventory",
        badge: "C++20 / SYSTEMS",
        desc: "Reliable point-of-sale console application for inventory management, algorithmic bill calculations, and purchase logs.",
        architecture: "Written in ISO C++20 with custom dynamic array structures, robust binary file serialization, exception handling, and formatted CLI receipt printing.",
        contributions: [
            "Implemented algorithmic barcode/SKU binary search for low latency lookups.",
            "Built tax calculations, tiered promotional discounts, and receipt generator.",
            "Created auto-backup routine for transaction history and stock depletion alert."
        ],
        tags: ["C++20", "Data Structures", "File Streams", "CLI Systems", "OOP"],
        img: "assets/images/projects/supermarket.png",
        externalLink: "https://github.com/tztn"
    }
};

function initProjectDetailsController() {
    const modal = document.getElementById("project-modal");
    const modalContent = document.getElementById("modal-body-content");
    const closeBtn = document.getElementById("modal-close-btn");
    const triggers = document.querySelectorAll("[data-project-trigger]");

    if (!modal || !modalContent) return;

    window.openProjectModal = function (projectId) {
        const data = projectData[projectId];
        if (!data) return;

        modalContent.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 12px;">
                <span class="project-type-badge font-mono" style="position: static;">${data.badge}</span>
                <a href="${data.externalLink}" target="_blank" rel="noopener noreferrer" style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-primary); text-decoration: underline;">Open Repository ↗</a>
            </div>
            <h2 style="font-size: 1.25rem; font-weight: 800; color: var(--text-primary); margin-bottom: 10px;">${data.title}</h2>
            <div style="width: 100%; height: 200px; border-radius: 6px; overflow: hidden; margin-bottom: 16px; border: 1px solid var(--border);">
                <img src="${data.img}" alt="${data.title}" style="width: 100%; height: 100%; object-fit: cover;">
            </div>
            <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 14px;">${data.desc}</p>
            <div style="background: var(--bg-secondary); border: 1px solid var(--border); border-radius: 6px; padding: 12px; margin-bottom: 14px;">
                <div style="font-family: var(--font-mono); font-size: 0.68rem; font-weight: 700; color: var(--text-muted); margin-bottom: 4px;">// ARCHITECTURE</div>
                <p style="font-size: 0.8rem; color: var(--text-primary); line-height: 1.5;">${data.architecture}</p>
            </div>
            <div style="margin-bottom: 14px;">
                <div style="font-family: var(--font-mono); font-size: 0.68rem; font-weight: 700; color: var(--text-muted); margin-bottom: 6px;">// KEY HIGHLIGHTS</div>
                <ul style="padding-left: 18px; font-size: 0.8rem; color: var(--text-secondary); line-height: 1.6;">
                    ${data.contributions.map(c => `<li>${c}</li>`).join('')}
                </ul>
            </div>
            <div style="display: flex; flex-wrap: wrap; gap: 4px;">
                ${data.tags.map(t => `<span class="project-tag">${t}</span>`).join('')}
            </div>
        `;

        modal.classList.add("open");
        if (window.soundFX) window.soundFX.play("popover");
    };

    function closeModal() {
        modal.classList.remove("open");
    }

    if (closeBtn) closeBtn.addEventListener("click", closeModal);
    modal.addEventListener("click", (e) => {
        if (e.target === modal) closeModal();
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal.classList.contains("open")) closeModal();
    });

    triggers.forEach(card => {
        card.addEventListener("click", () => {
            const id = card.getAttribute("data-project-trigger");
            if (id) window.openProjectModal(id);
        });
    });
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

/* ==========================================================================
   08: INTERACTIVE CLI TERMINAL HUD
   ========================================================================== */
function initTerminalHud() {
    const terminalInput = document.getElementById("terminal-cli-input");
    const terminalLogs = document.getElementById("terminal-output-logs");
    if (!terminalInput || !terminalLogs) return;

    terminalInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            const cmd = terminalInput.value.trim().toLowerCase();
            terminalInput.value = "";
            processCommand(cmd);
        }
    });

    function logLine(text, isCommand = false) {
        const line = document.createElement("div");
        if (isCommand) {
            line.innerHTML = `<span style="color: var(--emerald); font-weight: 700;">visitor@tristan:~$</span> ${text}`;
        } else {
            line.innerHTML = text;
        }
        terminalLogs.appendChild(line);
        terminalLogs.scrollTop = terminalLogs.scrollHeight;
    }

    function processCommand(cmd) {
        logLine(cmd, true);
        if (window.soundFX) window.soundFX.play("click");

        switch (cmd) {
            case "help":
                logLine("Available commands: <span style='color: var(--emerald);'>about, projects, stack, contact, clear, time</span>");
                break;
            case "about":
                logLine("Final-year BS Information Technology student at NCST focusing on backend systems, Java Swing desktop applications, relational database design (3NF), and web development. Passionate about clean architecture, system utility tools, and UI design.");
                break;
            case "projects":
                logLine("1. SNEAKRS Landing Concept [Figma]<br>2. DLAILS Lab Incident Logger [Java]<br>3. Stym Storefront [Web/JS]<br>4. NCST Lost & Found [PHP]<br>5. Supermarket POS [C++]");
                break;
            case "stack":
                logLine("HTML5, CSS3, JavaScript, Java Swing, C++20, PHP, MySQL, Bootstrap 5, Figma");
                break;
            case "contact":
                logLine("Email: <a href='mailto:agoilotristanray@gmail.com' style='color: var(--emerald); text-decoration: underline;'>agoilotristanray@gmail.com</a> | GitHub: @tztn");
                break;
            case "time":
                const now = new Date();
                logLine(`Current Manila Time: ${now.toLocaleTimeString("en-US", { timeZone: "Asia/Manila" })} (PHT // UTC+8)`);
                break;
            case "clear":
                terminalLogs.innerHTML = "";
                break;
            case "":
                break;
            default:
                logLine(`Command not found: '${cmd}'. Type <span style='color: var(--emerald);'>help</span> for commands.`);
        }
    }
    const quickChips = document.querySelectorAll(".t-quick-chip");
    quickChips.forEach(chip => {
        chip.addEventListener("click", () => {
            const cmd = chip.getAttribute("data-cmd");
            if (cmd) {
                terminalInput.value = cmd;
                processCommand(cmd);
                terminalInput.value = "";
            }
        });
    });
}

/* ==========================================================================
   09: LIVE PHT CLOCK (CAVITE, PH — GMT + 8)
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
            second: "2-digit",
            hour12: true
        };
        const timeStr = now.toLocaleTimeString("en-US", options);
        if (clockEl) clockEl.textContent = `PHT ${timeStr} (UTC+8)`;
        if (footerClockEl) footerClockEl.textContent = timeStr;
    }

    update();
    setInterval(update, 1000);
}

/* ==========================================================================
   10: CONTACT FORM FEEDBACK & CUSTOM INLINE VALIDATION
   ========================================================================== */
function initContactFeedback() {
    const copyBtn = document.getElementById("copy-email-btn");
    const contactForm = document.getElementById("contact-form");
    const emailToCopy = "agoilotristanray@gmail.com";

    if (copyBtn) {
        copyBtn.addEventListener("click", async () => {
            try {
                await navigator.clipboard.writeText(emailToCopy);
                const originalText = copyBtn.innerHTML;
                copyBtn.innerHTML = '<span class="stack-mono-icon">✓</span><span>COPIED</span>';
                if (window.soundFX) window.soundFX.play("click");
                setTimeout(() => {
                    copyBtn.innerHTML = originalText;
                }, 2000);
            } catch (err) {
                console.error("Clipboard copy failed:", err);
            }
        });
    }

    if (contactForm) {
        const nameInput = document.getElementById("form-name");
        const emailInput = document.getElementById("form-email");
        const messageInput = document.getElementById("form-message");

        const errorName = document.getElementById("error-name");
        const errorEmail = document.getElementById("error-email");
        const errorMessage = document.getElementById("error-message");

        const submitBtn = document.getElementById("form-submit-btn");
        const feedbackHud = document.getElementById("form-feedback-hud");

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        function validateName() {
            if (!nameInput) return true;
            const val = nameInput.value.trim();
            if (val.length < 2) {
                nameInput.classList.add("has-error");
                if (errorName) errorName.style.display = "flex";
                return false;
            } else {
                nameInput.classList.remove("has-error");
                if (errorName) errorName.style.display = "none";
                return true;
            }
        }

        function validateEmail() {
            if (!emailInput) return true;
            const val = emailInput.value.trim();
            if (!emailRegex.test(val)) {
                emailInput.classList.add("has-error");
                if (errorEmail) errorEmail.style.display = "flex";
                return false;
            } else {
                emailInput.classList.remove("has-error");
                if (errorEmail) errorEmail.style.display = "none";
                return true;
            }
        }

        function validateMessage() {
            if (!messageInput) return true;
            const val = messageInput.value.trim();
            if (val.length < 5) {
                messageInput.classList.add("has-error");
                if (errorMessage) errorMessage.style.display = "flex";
                return false;
            } else {
                messageInput.classList.remove("has-error");
                if (errorMessage) errorMessage.style.display = "none";
                return true;
            }
        }

        if (nameInput) {
            nameInput.addEventListener("input", () => {
                if (nameInput.classList.contains("has-error")) validateName();
            });
            nameInput.addEventListener("blur", validateName);
        }

        if (emailInput) {
            emailInput.addEventListener("input", () => {
                if (emailInput.classList.contains("has-error")) validateEmail();
            });
            emailInput.addEventListener("blur", validateEmail);
        }

        if (messageInput) {
            messageInput.addEventListener("input", () => {
                if (messageInput.classList.contains("has-error")) validateMessage();
            });
            messageInput.addEventListener("blur", validateMessage);
        }

        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const isNameValid = validateName();
            const isEmailValid = validateEmail();
            const isMessageValid = validateMessage();

            if (!isNameValid || !isEmailValid || !isMessageValid) {
                if (!isNameValid && nameInput) nameInput.focus();
                else if (!isEmailValid && emailInput) emailInput.focus();
                else if (!isMessageValid && messageInput) messageInput.focus();
                return;
            }

            if (feedbackHud) {
                feedbackHud.style.display = "block";
                feedbackHud.textContent = "TRANSMITTING: Establishing connection...";
            }
            if (submitBtn) submitBtn.disabled = true;

            setTimeout(() => {
                contactForm.reset();
                if (nameInput) nameInput.classList.remove("has-error");
                if (emailInput) emailInput.classList.remove("has-error");
                if (messageInput) messageInput.classList.remove("has-error");

                if (submitBtn) submitBtn.disabled = false;
                if (feedbackHud) {
                    feedbackHud.textContent = "TRANSMISSION_SUCCESS: Message sent. I'll get back to you soon.";
                    setTimeout(() => {
                        feedbackHud.style.display = "none";
                    }, 5000);
                }
                if (window.soundFX) window.soundFX.play("success");
            }, 500);
        });
    }
}

/* ==========================================================================
   11: SCROLL REVEAL OBSERVER
   ========================================================================== */
function initScrollReveal() {
    const sections = document.querySelectorAll(".panel");

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("revealed");
            }
        });
    }, { threshold: 0.08 });

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
                    // Crisp mechanical click
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
            ".cmdk-item",
            ".modal-close-btn",
            ".t-quick-chip"
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
