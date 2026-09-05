/* ==========================================================================
   08: INTERACTIVE CLI TERMINAL HUD (SINGLE-VIEW CONTENT SWAP)
   ========================================================================== */
function initTerminalHud() {
    const terminalInput = document.getElementById("terminal-cli-input");
    const activeViewContainer = document.getElementById("terminal-active-view");
    const screenBody = document.getElementById("terminal-screen-body");
    const promptBar = document.getElementById("terminal-prompt-bar");
    if (!terminalInput || !activeViewContainer) return;

    if (promptBar) {
        promptBar.addEventListener("click", () => {
            terminalInput.focus();
        });
    }

    // Command History & Autocomplete
    const commandHistory = [];
    let historyIndex = -1;
    let typingTimer = null;

    const availableCommands = [
        "help",
        "projects",
        "about",
        "stack",
        "skills",
        "contact",
        "whoami",
        "time",
        "clear",
        "open 01",
        "open 02",
        "open 03",
        "open 04",
        "open 05"
    ];

    const projectMap = {
        "1": "sneakrs",
        "01": "sneakrs",
        "sneakrs": "sneakrs",
        "2": "lostfound",
        "02": "lostfound",
        "lostfound": "lostfound",
        "3": "dlails",
        "03": "dlails",
        "dlails": "dlails",
        "4": "stym",
        "04": "stym",
        "stym": "stym",
        "5": "pos",
        "05": "pos",
        "pos": "pos"
    };

    function cancelTyping() {
        if (typingTimer) {
            clearInterval(typingTimer);
            typingTimer = null;
        }
    }

    terminalInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            cancelTyping();
            const rawCmd = terminalInput.value;
            const cmd = rawCmd.trim().toLowerCase();
            if (cmd) {
                commandHistory.push(rawCmd);
                historyIndex = commandHistory.length;
            }
            terminalInput.value = "";
            processCommand(cmd);
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            if (commandHistory.length > 0 && historyIndex > 0) {
                historyIndex--;
                terminalInput.value = commandHistory[historyIndex];
            } else if (commandHistory.length > 0 && historyIndex === 0) {
                terminalInput.value = commandHistory[0];
            }
        } else if (e.key === "ArrowDown") {
            e.preventDefault();
            if (historyIndex < commandHistory.length - 1) {
                historyIndex++;
                terminalInput.value = commandHistory[historyIndex];
            } else {
                historyIndex = commandHistory.length;
                terminalInput.value = "";
            }
        } else if (e.key === "Tab") {
            e.preventDefault();
            const val = terminalInput.value.trim().toLowerCase();
            if (!val) return;
            const matches = availableCommands.filter(c => c.startsWith(val));
            if (matches.length === 1) {
                terminalInput.value = matches[0];
            } else if (matches.length > 1) {
                renderActiveView("tab autocomplete", [
                    `<div>Matching commands:</div>`,
                    `<div style="margin-top: 4px; display: flex; flex-wrap: wrap; gap: 6px;">${matches.map(m => `<span class="term-tag">${m}</span>`).join("")}</div>`
                ]);
            }
        } else if (e.key === "l" && e.ctrlKey) {
            e.preventDefault();
            clearTerminal();
        }
    });

    function escapeHtml(str) {
        return String(str).replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
    }

    // Single-View Content Swap Function (Replaces view with fast 120ms transition)
    function renderActiveView(cmd, linesArray, isBannerOnly = false) {
        if (window.soundFX) window.soundFX.play("click");

        // Wipe previous active output and replace with new view
        activeViewContainer.innerHTML = "";
        const viewEl = document.createElement("div");
        viewEl.className = "term-view-swap-anim";

        if (!isBannerOnly) {
            const promptLine = document.createElement("div");
            promptLine.className = "term-cmd-line";
            promptLine.innerHTML = `
                <span class="term-p-user">visitor</span><span class="term-p-at">@</span><span class="term-p-host">tztn</span><span class="term-p-colon">:</span><span class="term-p-path">~</span><span class="term-p-symbol">&gt;</span>
                <span>${escapeHtml(cmd)}</span>
            `;
            viewEl.appendChild(promptLine);
        }

        const responseBlock = document.createElement("div");
        responseBlock.className = "term-response-block";
        responseBlock.innerHTML = linesArray.join("");
        viewEl.appendChild(responseBlock);

        activeViewContainer.appendChild(viewEl);

        // Wire project row clicks
        const projectRows = viewEl.querySelectorAll(".term-project-row");
        projectRows.forEach(pRow => {
            pRow.addEventListener("click", () => {
                const targetProj = pRow.getAttribute("data-proj-id");
                if (targetProj && window.openProjectModal) {
                    if (window.soundFX) window.soundFX.play("click");
                    window.openProjectModal(targetProj);
                }
            });
        });

        // Reset scroll position to top of screen body
        if (screenBody) screenBody.scrollTop = 0;
    }

    function clearTerminal() {
        if (window.soundFX) window.soundFX.play("click");
        renderActiveView("clear", [
            `<div>Console cleared. Type <span class="term-cmd-highlight">help</span> or click any quick command above to load a view.</div>`
        ]);
    }

    // Animate typing character-by-character when quick commands are clicked
    function typeAndExecute(cmd) {
        cancelTyping();
        terminalInput.value = "";
        terminalInput.focus();

        let i = 0;
        typingTimer = setInterval(() => {
            if (i < cmd.length) {
                terminalInput.value += cmd.charAt(i);
                i++;
                if (window.soundFX) window.soundFX.play("hover");
            } else {
                cancelTyping();
                setTimeout(() => {
                    const executedCmd = terminalInput.value.trim().toLowerCase();
                    terminalInput.value = "";
                    processCommand(executedCmd);
                }, 80);
            }
        }, 25);
    }

    function processCommand(cmd) {
        if (!cmd) return;

        // Check for 'open <id>' command
        if (cmd.startsWith("open ") || cmd.startsWith("view ")) {
            const arg = cmd.split(" ")[1];
            const targetProj = projectMap[arg];
            if (targetProj) {
                renderActiveView(cmd, [
                    `<div>Opening project specification <span class="term-tag">${targetProj}</span>...</div>`
                ]);
                setTimeout(() => {
                    if (window.openProjectModal) {
                        window.openProjectModal(targetProj);
                    }
                }, 250);
            } else {
                renderActiveView(cmd, [
                    `<div>Project not found: '${escapeHtml(arg)}'. Valid options: <code>open 01</code> through <code>open 05</code>.</div>`
                ]);
            }
            return;
        }

        switch (cmd) {
            case "help":
                renderActiveView("help", [
                    `<div><strong>Available Commands:</strong></div>`,
                    `<div><span class="term-tag">projects</span> &mdash; List all featured engineering projects in structured table</div>`,
                    `<div><span class="term-tag">open &lt;num&gt;</span> &mdash; Inspect specific project details (e.g. <code>open 01</code>)</div>`,
                    `<div><span class="term-tag">about</span> &mdash; Bio narrative, education & engineering principles</div>`,
                    `<div><span class="term-tag">stack</span> &mdash; View complete categorized technical stack matrix</div>`,
                    `<div><span class="term-tag">skills</span> &mdash; Core architectural and design competencies</div>`,
                    `<div><span class="term-tag">contact</span> &mdash; Direct communication channels & social links</div>`,
                    `<div><span class="term-tag">whoami</span> &mdash; Inspect visitor session authorization state</div>`,
                    `<div><span class="term-tag">time</span> &mdash; Current Philippine Standard Time (PHT // UTC+8)</div>`,
                    `<div><span class="term-tag">clear</span> &mdash; Reset and clear screen content (Ctrl+L)</div>`
                ]);
                break;

            case "about":
            case "bio":
                renderActiveView(cmd, [
                    `<div><strong>Tristan Ray Agoilo</strong> &mdash; Front-End Developer & UI Designer</div>`,
                    `<div style="margin-top: 4px; line-height: 1.65;">Front-End Developer and UI Designer pursuing a BSIT degree at NCST. Focused on crafting responsive, component-driven web applications with an eye for micro-interactions, clean architecture, and modern visual design.</div>`,
                    `<div style="margin-top: 6px; color: var(--text-muted); font-size: 0.75rem;">Type <span class="term-cmd-highlight">skills</span> or <span class="term-cmd-highlight">stack</span> to see technical proficiency.</div>`
                ]);
                break;

            case "projects":
            case "work":
                renderActiveView(cmd, [
                    `<div><strong>Featured Projects (5) &mdash; Click a row or type <code>open &lt;num&gt;</code>:</strong></div>`,
                    `<div class="term-project-table">
                        <div class="term-project-row" data-proj-id="sneakrs">
                            <span class="term-proj-tag">[ 01 // FIGMA ]</span>
                            <span class="term-proj-title">SNEAKRS Concept</span>
                            <span class="term-proj-desc">High-contrast modern e-commerce landing experience</span>
                            <span class="term-proj-action">open ↗</span>
                        </div>
                        <div class="term-project-row" data-proj-id="lostfound">
                            <span class="term-proj-tag">[ 02 // PHP ]</span>
                            <span class="term-proj-title">NCST Lost &amp; Found</span>
                            <span class="term-proj-desc">Campus safety claim verification &amp; reporting portal</span>
                            <span class="term-proj-action">open ↗</span>
                        </div>
                        <div class="term-project-row" data-proj-id="dlails">
                            <span class="term-proj-tag">[ 03 // JAVA ]</span>
                            <span class="term-proj-title">DLAILS Logger</span>
                            <span class="term-proj-desc">Thread-safe computer lab telemetry desktop application</span>
                            <span class="term-proj-action">open ↗</span>
                        </div>
                        <div class="term-project-row" data-proj-id="stym">
                            <span class="term-proj-tag">[ 04 // JS ]</span>
                            <span class="term-proj-title">Stym Storefront</span>
                            <span class="term-proj-desc">Component-driven digital asset &amp; software store</span>
                            <span class="term-proj-action">open ↗</span>
                        </div>
                        <div class="term-project-row" data-proj-id="pos">
                            <span class="term-proj-tag">[ 05 // C++ ]</span>
                            <span class="term-proj-title">Supermarket POS</span>
                            <span class="term-proj-desc">High-throughput inventory &amp; checkout engine</span>
                            <span class="term-proj-action">open ↗</span>
                        </div>
                    </div>`
                ]);
                break;

            case "stack":
            case "tech":
                renderActiveView(cmd, [
                    `<div><strong>Technical Stack Matrix:</strong></div>`,
                    `<div>• <strong>Frontend:</strong> React, Next.js, TypeScript, JavaScript (ES6+), Tailwind CSS, Vite, HTML5, CSS3</div>`,
                    `<div>• <strong>Backend:</strong> Express.js, FastAPI, Node.js, Java (Swing), PHP, C++20</div>`,
                    `<div>• <strong>Databases:</strong> MySQL, PostgreSQL, MongoDB, Relational Normalization (3NF)</div>`,
                    `<div>• <strong>Tools &amp; Cloud:</strong> Git, GitHub, Docker, Vercel, Figma, VS Code, PostHog, OpenAI API</div>`
                ]);
                break;

            case "skills":
                renderActiveView(cmd, [
                    `<div><strong>Core Architectural &amp; Design Competencies:</strong></div>`,
                    `<div>• <strong>UI Engineering:</strong> Component Architecture, Design Systems, Micro-Interactions, Responsive Layouts</div>`,
                    `<div>• <strong>Backend &amp; Systems:</strong> RESTful API Design, Multi-Threading, System Telemetry, 3NF Schema Optimization</div>`,
                    `<div>• <strong>Methodologies:</strong> Clean Architecture, Pixel-Precision, Separation of Concerns, Performance Tuning</div>`
                ]);
                break;

            case "contact":
            case "email":
                renderActiveView(cmd, [
                    `<div><strong>Direct Communication:</strong></div>`,
                    `<div>• Email: <a href="mailto:agoilotristanray@gmail.com" style="color: var(--emerald); text-decoration: underline;">agoilotristanray@gmail.com</a></div>`,
                    `<div>• GitHub: <a href="https://github.com/tztn" target="_blank" rel="noopener noreferrer" style="color: var(--emerald); text-decoration: underline;">github.com/tztn</a></div>`,
                    `<div>• Location: Cavite, Philippines (GMT+8)</div>`
                ]);
                break;

            case "whoami":
                renderActiveView(cmd, [
                    `<div><strong>Session Identity:</strong> visitor@tztn-devbox [Guest Client]</div>`,
                    `<div style="color: var(--text-muted); font-size: 0.72rem; margin-top: 2px;">Role: Engineering Recruiter / Design Enthusiast • Status: Authenticated • Protocol: HTTPS/TLS</div>`
                ]);
                break;

            case "time":
            case "date":
                const now = new Date();
                renderActiveView(cmd, [
                    `<div>Current Manila Time: <strong>${now.toLocaleTimeString("en-US", { timeZone: "Asia/Manila" })}</strong> (PHT // UTC+8)</div>`
                ]);
                break;

            case "clear":
            case "cls":
                clearTerminal();
                break;

            default:
                renderActiveView(cmd, [
                    `<div>Command not recognized: '<span style="color: #ef4444;">${escapeHtml(cmd)}</span>'. Type <span class="term-cmd-highlight">help</span> for all available commands.</div>`
                ]);
        }
    }

    // Initialize with Help command view on load
    renderActiveView("help", [
        `<div><strong>Available Commands:</strong></div>`,
        `<div><span class="term-tag">projects</span> &mdash; List all featured engineering projects in structured table</div>`,
        `<div><span class="term-tag">open &lt;num&gt;</span> &mdash; Inspect specific project details (e.g. <code>open 01</code>)</div>`,
        `<div><span class="term-tag">about</span> &mdash; Bio narrative, education & engineering principles</div>`,
        `<div><span class="term-tag">stack</span> &mdash; View complete categorized technical stack matrix</div>`,
        `<div><span class="term-tag">skills</span> &mdash; Core architectural and design competencies</div>`,
        `<div><span class="term-tag">contact</span> &mdash; Direct communication channels & social links</div>`,
        `<div><span class="term-tag">whoami</span> &mdash; Inspect visitor session authorization state</div>`,
        `<div><span class="term-tag">time</span> &mdash; Current Philippine Standard Time (PHT // UTC+8)</div>`,
        `<div><span class="term-tag">clear</span> &mdash; Reset and clear screen content (Ctrl+L)</div>`
    ], true);

    const quickChips = document.querySelectorAll(".t-quick-chip");
    quickChips.forEach(chip => {
        chip.addEventListener("click", () => {
            const cmd = chip.getAttribute("data-cmd");
            if (cmd) {
                typeAndExecute(cmd);
            }
        });
    });
}

