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

    const stackSections = [
        {
            category: "Frontend",
            items: [
                {
                    name: "HTML",
                    icon: `<svg class="stack-brand-icon" viewBox="0 0 24 24"><path d="M12 2L3 5l1.6 14.5L12 22l7.4-2.5L21 5l-9-3zm0 2.2l7.1 2.4-1.3 12.3-5.8 2-5.8-2L4.9 6.6 12 4.2zm-4.7 5.3h9.4l-.3 3.3H9.9l.2 1.9 4.6-.2-.2 2.2-4.4.2-.3-2.2H8l.5 3.9 6.2-.3.6-5.8H7.3V9.5z"/></svg>`
                },
                {
                    name: "CSS",
                    icon: `<svg class="stack-brand-icon" viewBox="0 0 24 24"><path d="M1.5 0h21l-1.91 21.48L12 24l-8.59-2.52L1.5 0zm15.48 4.87H7.03l.28 3.13h8.32l-.28 3.13H7.59l.28 3.13h7.2l-.32 3.55-2.75.76-2.75-.76-.18-1.98H6.12l.34 3.86L12 22.42l5.54-1.54 1.44-16.01z"/></svg>`
                },
                {
                    name: "JavaScript",
                    icon: `<svg class="stack-brand-icon" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15.5H9.5v-4H8v-1.5h3v5.5zm5.5 0h-4v-1.5h2.5v-1h-2v-3h3.5v1.5H15v1h1.5v3z"/></svg>`
                },
                {
                    name: "Vue.js",
                    icon: `<svg class="stack-brand-icon" viewBox="0 0 24 24"><path d="M24 1.61H14.06L12 5.16 9.94 1.61H0L12 22.39ZM12 14.08 5.16 2.23H9.59L12 6.41l2.41-4.18h4.43Z"/></svg>`
                },
                {
                    name: "Tailwind CSS",
                    icon: `<svg class="stack-brand-icon" viewBox="0 0 24 24"><path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.335 6.182 14.974 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.335 13.382 8.974 12 6.001 12z"/></svg>`
                },
                {
                    name: "Bootstrap",
                    icon: `<svg class="stack-brand-icon" viewBox="0 0 24 24"><path d="M3 5.4C3 4.075 4.075 3 5.4 3h13.2C19.925 3 21 4.075 21 5.4v13.2c0 1.325-1.075 2.4-2.4 2.4H5.4A2.4 2.4 0 0 1 3 18.6V5.4zm6.65 3.3v6.6h3.41c1.47 0 2.44-.76 2.44-1.98 0-.87-.56-1.52-1.43-1.7v-.06c.72-.19 1.18-.8 1.18-1.56 0-1.12-.9-1.75-2.24-1.75H9.65zm1.54 1.25h1.72c.67 0 1.09.31 1.09.84 0 .56-.44.88-1.14.88h-1.67V9.95zm0 2.85h1.86c.78 0 1.24.34 1.24.94 0 .61-.48.96-1.28.96h-1.82v-1.9z"/></svg>`
                },
                {
                    name: "Styled Components",
                    icon: `<svg class="stack-brand-icon" viewBox="0 0 24 24"><path d="M3.5 18c0-3.5 4-4.5 4-7.5 0-2-1.5-3.5-3.5-3.5-1.5 0-2.5.8-3 1.8V5.5C1.8 4 3.5 3 5.5 3 9 3 12 5.5 12 9c0 3.5-4 4.5-4 7.5 0 2 1.5 3.5 3.5 3.5 1.5 0 2.5-.8 3-1.8v3.3c-.8 1.5-2.5 2.5-4.5 2.5-3.5 0-6.5-2.5-6.5-6zm9 0c0-3.5 4-4.5 4-7.5 0-2-1.5-3.5-3.5-3.5-1.5 0-2.5.8-3 1.8V5.5c.8-1.5 2.5-2.5 4.5-2.5 3.5 0 6.5 2.5 6.5 6 0 3.5-4 4.5-4 7.5 0 2 1.5 3.5 3.5 3.5 1.5 0 2.5-.8 3-1.8v3.3c-.8 1.5-2.5 2.5-4.5 2.5-3.5 0-6.5-2.5-6.5-6z"/></svg>`
                },
                {
                    name: "Figma",
                    icon: `<svg class="stack-brand-icon" viewBox="0 0 24 24"><path d="M12 12a4 4 0 1 1 8 0 4 4 0 0 1-8 0z M4 20a4 4 0 0 1 4-4h4v4a4 4 0 1 1-8 0z M12 0v8h4a4 4 0 1 0 0-8h-4z M4 4a4 4 0 0 0 4 4h4V0H8a4 4 0 0 0-4 4z M4 12a4 4 0 0 0 4 4h4V8H8a4 4 0 0 0-4 4z"/></svg>`
                }
            ],
            emptyCount: 1
        },
        {
            category: "Backend & Database",
            items: [
                {
                    name: "Node.js",
                    icon: `<svg class="stack-brand-icon" viewBox="0 0 24 24"><path d="M12 2l10 5.8v11.6L12 22 2 16.4V7.8L12 2zm0 2.3L4.2 8.8v6.9L12 20.2l7.8-4.5V8.8L12 4.3zm-1.1 5.4h2.2v4.5h-2.2V9.7zm0 5.6h2.2v1.5h-2.2v-1.5z"/></svg>`
                },
                {
                    name: "PHP",
                    icon: `<svg class="stack-brand-icon" viewBox="0 0 24 24"><path d="M7.01 10.207h-.944l-.515 2.648h.838c.556 0 .97-.105 1.242-.314.272-.21.455-.559.55-1.049.092-.47.05-.802-.124-.995-.175-.193-.523-.29-1.047-.29zM12 5.688C5.373 5.688 0 8.514 0 12s5.373 6.313 12 6.313S24 15.486 24 12c0-3.486-5.373-6.312-12-6.312zm-3.26 7.451c-.261.25-.575.438-.917.551-.336.108-.765.164-1.285.164H5.357l-.327 1.681H3.652l1.23-6.326h2.65c.797 0 1.378.209 1.744.628.366.418.476 1.002.33 1.752a2.836 2.836 0 0 1-.305.847c-.143.255-.33.49-.561.703zm4.024.715l.543-2.799c.063-.318.039-.536-.068-.651-.107-.116-.336-.174-.687-.174H11.46l-.704 3.625H9.388l1.23-6.327h1.367l-.327 1.682h1.218c.767 0 1.295.134 1.586.401s.378.7.263 1.299l-.572 2.944h-1.389zm7.597-2.265a2.782 2.782 0 0 1-.305.847c-.143.255-.33.49-.561.703a2.44 2.44 0 0 1-.917.551c-.336.108-.765.164-1.286.164h-1.18l-.327 1.682h-1.378l1.23-6.326h2.649c.797 0 1.378.209 1.744.628.366.417.477 1.001.331 1.751zM17.766 10.207h-.943l-.516 2.648h.838c.557 0 .971-.105 1.242-.314.272-.21.455-.559.551-1.049.092-.47.049-.802-.125-.995s-.524-.29-1.047-.29z"/></svg>`
                },
                {
                    name: "Laravel",
                    icon: `<svg class="stack-brand-icon" viewBox="0 0 24 24"><path d="M23.642 5.43a.465.465 0 0 0-.215-.224l-7.797-4.48a.488.488 0 0 0-.482 0L7.35 5.206a.485.485 0 0 0-.24.42v8.96a.485.485 0 0 0 .24.42l7.798 4.48a.488.488 0 0 0 .482 0l7.797-4.48a.485.485 0 0 0 .24-.42V5.626a.465.465 0 0 0-.025-.196zm-8.037-3.92 6.832 3.92-2.88 1.654-6.832-3.92 2.88-1.654zm-7.315 4.76 6.832 3.92v3.308l-6.832-3.92V6.27zm7.798 12.01-6.832-3.92 2.88-1.655 6.832 3.921-2.88 1.654zm.966-2.21v-3.307l2.88-1.655v3.308l-2.88 1.654zm0-4.417V8.344l2.88-1.654v3.308l-2.88 1.655zm3.846-2.209V6.136l2.88-1.655v3.308l-2.88 1.655z"/></svg>`
                },
                {
                    name: "Python",
                    icon: `<svg class="stack-brand-icon" viewBox="0 0 24 24"><path d="M11.91 2c-3.12 0-5.06 1.41-5.06 3.69v2.74h5.18V9.3H4.14C1.86 9.3 0 11.23 0 13.51s1.86 4.21 4.14 4.21h2.71v-2.73c0-2.28 1.94-3.69 5.06-3.69h5.06V8.56c0-2.28-1.94-3.69-5.06-3.69h-5v2.85h5V2zm-2.28 1.48c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm9.31 4.74c0 2.28-1.94 3.69-5.06 3.69H8.82v2.74h7.89c2.28 0 4.14-1.93 4.14-4.21S19 6.22 16.72 6.22h-2.71v2.73c0 2.28-1.94 3.69-5.06 3.69H3.89v2.74h5.05c3.12 0 5.06-1.41 5.06-3.69V8.95h-5v2.85h5v-3.58z"/></svg>`
                },
                {
                    name: "Java",
                    icon: `<svg class="stack-brand-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1" /><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" /><line x1="6" y1="2" x2="6" y2="4" /><line x1="10" y1="2" x2="10" y2="4" /><line x1="14" y1="2" x2="14" y2="4" /></svg>`
                },
                {
                    name: "C++",
                    icon: `<svg class="stack-brand-icon" viewBox="0 0 24 24"><path d="M22.394 6c-.167-.29-.398-.543-.652-.69L12.926.22c-.509-.294-1.34-.294-1.848 0L2.26 5.31c-.508.293-.923 1.013-.923 1.6v10.18c0 .294.104.62.271.91.167.29.398.543.652.69l8.816 5.09c.508.293 1.34.293 1.848 0l8.816-5.09c.254-.147.485-.4.652-.69.167-.29.27-.616.27-.91V6.91c.003-.294-.1-.62-.268-.91zM12 19.11c-3.92 0-7.109-3.19-7.11 0-3.92 3.19-7.11 7.11-7.11a7.133 7.133 0 016.156 3.553l-3.076 1.78a3.567 3.567 0 00-3.08-1.78A3.56 3.56 0 008.444 12 3.56 3.56 0 0012 15.555a3.57 3.57 0 003.08-1.778l3.078 1.78A7.135 7.135 0 0112 19.11zm7.11-6.715h-.79v.79h-.79v-.79h-.79v-.79h.79v-.79h.79v.79h.79zm2.962 0h-.79v.79h-.79v-.79h-.79v-.79h.79v-.79h.79v.79h.79z"/></svg>`
                },
                {
                    name: "MySQL",
                    icon: `<svg class="stack-brand-icon" viewBox="0 0 24 24"><path d="M16.405 5.501c-.347.804-.845 1.554-1.468 2.197.803-.347 1.554-.845 2.197-1.468-.243-.277-.487-.517-.729-.729zm2.463 3.655c-.569.643-1.242 1.189-1.986 1.614.947-.197 1.838-.598 2.614-1.168-.204-.158-.415-.306-.628-.446zM7.342 9.245C5.071 9.479 3.09 10.741 2 12.637c.722.569 1.564.986 2.477 1.214.47-.833 1.127-1.547 1.916-2.079-.319-.8-.671-1.636-1.051-2.527zm14.444 4.095c-.382-.446-.827-.838-1.319-1.165-.634.821-1.472 1.46-2.434 1.854.898.396 1.892.571 2.875.504.305-.383.593-.787.878-1.193zM12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm.052 17.525c-3.14 0-5.882-1.74-7.309-4.321.436-.08.877-.202 1.309-.368 1.194 2.115 3.447 3.541 6.05 3.541 3.86 0 7-3.14 7-7 0-.583-.075-1.147-.21-1.688.384-.251.745-.536 1.077-.852.41 1.042.633 2.174.633 3.54 0 5.247-4.278 9.148-8.55 9.148z"/></svg>`
                }
            ],
            emptyCount: 2
        },
        {
            category: "Tools & Deployment",
            items: [
                {
                    name: "Git",
                    icon: `<svg class="stack-brand-icon" viewBox="0 0 24 24"><path d="M23.546 10.93L13.067.452c-.604-.603-1.582-.603-2.188 0L8.708 2.627l2.76 2.76c.645-.215 1.379-.07 1.889.441.516.515.658 1.258.438 1.9l3.053 3.053c.642-.22 1.385-.077 1.9.438.779.779.779 2.05 0 2.829-.78.779-2.05.779-2.83 0-.54-.54-.672-1.332-.395-1.996l-2.85-2.85v4.544c.22.12.427.279.61.462.779.779.779 2.05 0 2.829-.78.779-2.05.779-2.83 0-.779-.78-.779-2.05 0-2.83.25-.25.556-.41.879-.49v-4.63a2.03 2.03 0 0 1-.879-.49c-.533-.532-.667-1.31-.413-1.965L5.753 5.586l-5.3 5.344c-.604.604-.604 1.582 0 2.188l10.48 10.478c.604.604 1.582.604 2.187 0l10.426-10.478c.604-.604.604-1.582 0-2.188z"/></svg>`
                },
                {
                    name: "GitHub",
                    icon: `<svg class="stack-brand-icon" viewBox="0 0 24 24"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>`
                },
                {
                    name: "VS Code",
                    icon: `<svg class="stack-brand-icon" viewBox="0 0 24 24"><path d="M23.15 2.587L18.21.21a1.494 1.494 0 0 0-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 0 0-1.276.057L.327 7.261A1 1 0 0 0 .326 8.74L3.899 12 .326 15.26a1 1 0 0 0 .001 1.479L1.65 17.94a.999.999 0 0 0 1.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 0 0 1.704.29l4.942-2.377A1.5 1.5 0 0 0 24 20.06V3.939a1.5 1.5 0 0 0-.85-1.352zm-5.146 14.861L10.826 12l7.178-5.448v10.896z"/></svg>`
                },
                {
                    name: "AntiGravity",
                    icon: `<svg class="stack-brand-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="2.5" fill="currentColor" stroke="none" /><ellipse cx="12" cy="12" rx="9.5" ry="3.8" transform="rotate(30 12 12)" /><ellipse cx="12" cy="12" rx="9.5" ry="3.8" transform="rotate(-30 12 12)" /><ellipse cx="12" cy="12" rx="9.5" ry="3.8" transform="rotate(90 12 12)" /></svg>`
                },
                {
                    name: "Vercel",
                    icon: `<svg class="stack-brand-icon" viewBox="0 0 24 24"><path d="m12 1 12 21H0L12 1z" /></svg>`
                },
                {
                    name: "Netlify",
                    icon: `<svg class="stack-brand-icon" viewBox="0 0 24 24"><path d="M6.49 19.04h-.23L5.13 17.9v-.23l1.73-1.71h1.2l.15.15v1.2L6.5 19.04ZM5.13 6.31V6.1l1.13-1.13h.23L8.2 6.68v1.2l-.15.15h-1.2L5.13 6.31Zm9.96 9.09h-1.65l-.14-.13v-3.83c0-.68-.27-1.2-1.1-1.23-.42 0-.9 0-1.43.02l-.07.08v4.96l-.14.14H8.9l-.13-.14V8.73l.13-.14h3.7a2.6 2.6 0 0 1 2.61 2.6v4.08l-.13.14Zm-8.37-2.44H.14L0 12.82v-1.64l.14-.14h6.58l.14.14v1.64l-.14.14Zm17.14 0h-6.58l-.14-.14v-1.64l.14-.14h6.58l.14.14v1.64l-.14.14ZM11.05 6.55V1.64l.14-.14h1.65l.14.14v4.9l-.14.14h-1.65l-.14-.13Zm0 15.81v-4.9l.14-.14h1.65l.14.13v4.91l-.14.14h-1.65l-.14-.14Z"/></svg>`
                }
            ],
            emptyCount: 0
        }
    ];

    function renderStackDirectory() {
        function chunkIntoRows(items, chunkSize = 3) {
            const rows = [];
            for (let i = 0; i < items.length; i += chunkSize) {
                const slice = items.slice(i, i + chunkSize);
                while (slice.length < chunkSize) {
                    slice.push(null);
                }
                rows.push(slice);
            }
            return rows;
        }

        stackContainer.innerHTML = `
            <div class="stack-matrix-board">
                <!-- Continuous Full-Height 3-Column Vertical Guide Lines Overlay -->
                <div class="stack-matrix-guide-lines" aria-hidden="true">
                    <div class="stack-guide-col"></div>
                    <div class="stack-guide-col"></div>
                    <div class="stack-guide-col"></div>
                </div>

                <!-- Row 1: Empty Spacer Grid Row (Image Reference) -->
                <div class="stack-matrix-row stack-spacer-matrix-row" aria-hidden="true">
                    <div class="stack-spacer-col"></div>
                    <div class="stack-spacer-col"></div>
                    <div class="stack-spacer-col"></div>
                </div>

                <!-- Row 2: Sub-Navigation Row -->
                <div class="stack-matrix-row stack-subnav-matrix-row">
                    <div class="stack-subnav-col stack-subnav-left">
                        <button type="button" class="proj-back-btn font-mono" id="stack-back-btn">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                                <line x1="19" y1="12" x2="5" y2="12"></line>
                                <polyline points="12 19 5 12 12 5"></polyline>
                            </svg>
                            <span>Back to Overview</span>
                        </button>
                    </div>
                    <div class="stack-subnav-col stack-subnav-center" aria-hidden="true"></div>
                    <div class="stack-subnav-col stack-subnav-right" aria-hidden="true"></div>
                </div>

                <!-- Header Area Row (Spans Columns 1 & 2, Column 3 is Empty CAD space) -->
                <div class="stack-matrix-row stack-hero-matrix-row">
                    <div class="stack-hero-col-main">
                        <span class="stack-hero-eyebrow font-mono">SYSTEMS // REGISTRY</span>
                        <h1 class="stack-hero-heading">Tech Stack.</h1>
                        <p class="stack-hero-sub">
                            Core technologies, runtime environments, and architectural tools utilized across client applications, systems development, and database engineering.
                        </p>
                    </div>
                    <div class="stack-hero-col-side" aria-hidden="true"></div>
                </div>

                <!-- Categorized Sections -->
                ${stackSections.map(sec => {
                    const rows = chunkIntoRows(sec.items, 3);
                    return `
                        <!-- Category Header Row -->
                        <div class="stack-matrix-row stack-cat-header-row">
                            <div class="stack-cat-title-cell font-mono">${sec.category}</div>
                            <div class="stack-cat-empty-cell" aria-hidden="true"></div>
                            <div class="stack-cat-empty-cell" aria-hidden="true"></div>
                        </div>

                        <!-- 3-Column Matrix Item Rows -->
                        ${rows.map(row => `
                            <div class="stack-matrix-row">
                                ${row.map(item => item ? `
                                    <div class="stack-item-cell">
                                        <div class="stack-brand-lockup">
                                            ${item.icon}
                                            <span class="stack-brand-name">${item.name}</span>
                                        </div>
                                    </div>
                                ` : `
                                    <div class="stack-item-cell stack-empty-cell" aria-hidden="true"></div>
                                `).join('')}
                            </div>
                        `).join('')}
                    `;
                }).join('')}
            </div>
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
        const projectsDirView = document.getElementById("projects-standalone-view");
        if (projectsDirView) projectsDirView.style.display = "none";
        if (projectView) projectView.style.display = "none";
        renderStackDirectory();
        if (mainWrapper) mainWrapper.style.display = "none";
        stackView.style.display = "block";
        if (window.forceScrollToTop) {
            window.forceScrollToTop();
        } else {
            window.scrollTo(0, 0);
        }
        if (window.updateNavActiveState) window.updateNavActiveState("stack");
        if (window.syncNavLinksHref) window.syncNavLinksHref(true);
        window.history.pushState(null, "", "#stack-dir");
        if (window.soundFX) window.soundFX.play("popover");
    }

    function closeStandaloneStack() {
        stackView.style.display = "none";
        if (mainWrapper) mainWrapper.style.display = "";
        if (window.syncNavLinksHref) window.syncNavLinksHref(false);
        if (window.updateNavActiveState) window.updateNavActiveState("stack");
        window.history.pushState(null, "", "#stack");
        if (window.lenis) {
            try { window.lenis.resize(); } catch (e) {}
        }
        const stackEl = document.getElementById("stack");
        if (stackEl) {
            if (window.lenis) {
                try {
                    window.lenis.scrollTo(stackEl, { offset: -24, duration: 1.0 });
                } catch (e) {
                    stackEl.scrollIntoView({ behavior: "smooth" });
                }
            } else {
                stackEl.scrollIntoView({ behavior: "smooth" });
            }
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

