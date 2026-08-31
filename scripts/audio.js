/* ==========================================================================
   CYBERPUNK / TERMINAL AUDIO FEEDBACK SYSTEM (WEB AUDIO API)
   Synthesizes ultra-low-latency mechanical clicks, terminal chirps & pips.
   Zero external dependencies or audio file assets required.
   ========================================================================== */

const SoundSystem = (() => {
    let audioCtx = null;
    let masterGain = null;
    let isMuted = false;
    let lastHoverTime = 0;
    let lastClickTime = 0;

    // Initialize state from localStorage
    const storedState = localStorage.getItem("portfolio_sfx_enabled");
    if (storedState !== null) {
        isMuted = storedState === "false";
    }

    function initAudioContext() {
        if (!audioCtx) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (AudioContextClass) {
                audioCtx = new AudioContextClass();
                masterGain = audioCtx.createGain();
                masterGain.gain.setValueAtTime(isMuted ? 0 : 0.75, audioCtx.currentTime);
                masterGain.connect(audioCtx.destination);
            }
        }
        if (audioCtx && audioCtx.state === "suspended") {
            audioCtx.resume();
        }
    }

    // Ensure audio context is unlocked on first user interaction
    function setupLazyInit() {
        const triggerEvents = ["pointerdown", "mousedown", "click", "keydown", "touchstart", "mousemove"];
        const unlock = () => {
            initAudioContext();
            triggerEvents.forEach(evt => window.removeEventListener(evt, unlock, { capture: true }));
        };
        triggerEvents.forEach(evt => window.addEventListener(evt, unlock, { capture: true, passive: true }));
    }

    /* --------------------------------------------------------------------------
       SFX SYNTHESIZERS (CLEAR, SATISFYING TACTILE SOUNDS)
       -------------------------------------------------------------------------- */

    /**
     * Subtle, crisp tactile chirp on hover.
     */
    function playHoverSound() {
        if (isMuted) return;
        const now = Date.now();
        if (now - lastHoverTime < 28) return; // Responsive throttle
        lastHoverTime = now;

        initAudioContext();
        if (!audioCtx) return;

        try {
            const t = audioCtx.currentTime;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();

            osc.type = "sine";
            osc.frequency.setValueAtTime(1850, t);
            osc.frequency.exponentialRampToValueAtTime(750, t + 0.022);

            gain.gain.setValueAtTime(0.18, t);
            gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.022);

            osc.connect(gain);
            gain.connect(masterGain);

            osc.start(t);
            osc.stop(t + 0.026);
        } catch (e) {
            // Autoplay safe
        }
    }

    /**
     * Punchy, satisfying mechanical switch "click" on button / card interactions.
     */
    function playClickSound() {
        if (isMuted) return;
        const now = Date.now();
        if (now - lastClickTime < 25) return; // Debounce double triggers
        lastClickTime = now;

        initAudioContext();
        if (!audioCtx) return;

        try {
            const t = audioCtx.currentTime;
            
            // 1. Tactile Mechanical Thock (Low-Mid Body)
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();

            osc.type = "triangle";
            osc.frequency.setValueAtTime(420, t);
            osc.frequency.exponentialRampToValueAtTime(95, t + 0.045);

            gain.gain.setValueAtTime(0.58, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.045);

            osc.connect(gain);
            gain.connect(masterGain);

            osc.start(t);
            osc.stop(t + 0.05);

            // 2. High-Frequency Tactile Snap (Crisp switch transient)
            const snap = audioCtx.createOscillator();
            const snapGain = audioCtx.createGain();

            snap.type = "sine";
            snap.frequency.setValueAtTime(1600, t);
            snap.frequency.exponentialRampToValueAtTime(320, t + 0.02);

            snapGain.gain.setValueAtTime(0.32, t);
            snapGain.gain.exponentialRampToValueAtTime(0.001, t + 0.02);

            snap.connect(snapGain);
            snapGain.connect(masterGain);

            snap.start(t);
            snap.stop(t + 0.025);
        } catch (e) {
            // Autoplay safe
        }
    }

    /**
     * Soft typewriter key sound.
     */
    function playKeySound() {
        if (isMuted) return;
        initAudioContext();
        if (!audioCtx) return;

        try {
            const t = audioCtx.currentTime;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();

            const freq = 600 + Math.random() * 220;
            osc.type = "sine";
            osc.frequency.setValueAtTime(freq, t);
            osc.frequency.exponentialRampToValueAtTime(freq * 0.45, t + 0.018);

            gain.gain.setValueAtTime(0.24, t);
            gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.018);

            osc.connect(gain);
            gain.connect(masterGain);

            osc.start(t);
            osc.stop(t + 0.022);
        } catch (e) {
            // Autoplay safe
        }
    }

    /**
     * Modal opening chime.
     */
    function playModalOpenSound() {
        if (isMuted) return;
        initAudioContext();
        if (!audioCtx) return;

        try {
            const t = audioCtx.currentTime;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();

            osc.type = "sine";
            osc.frequency.setValueAtTime(420, t);
            osc.frequency.exponentialRampToValueAtTime(840, t + 0.07);

            gain.gain.setValueAtTime(0.25, t);
            gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.07);

            osc.connect(gain);
            gain.connect(masterGain);

            osc.start(t);
            osc.stop(t + 0.08);
        } catch (e) {
            // Autoplay safe
        }
    }

    /**
     * Clean, soft toggle switch audio.
     */
    function playToggleSound(enabled) {
        initAudioContext();
        if (!audioCtx) return;

        try {
            const t = audioCtx.currentTime;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();

            osc.type = "sine";
            if (enabled) {
                osc.frequency.setValueAtTime(400, t);
                osc.frequency.exponentialRampToValueAtTime(680, t + 0.045);
            } else {
                osc.frequency.setValueAtTime(620, t);
                osc.frequency.exponentialRampToValueAtTime(340, t + 0.038);
            }

            gain.gain.setValueAtTime(0.35, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

            osc.connect(gain);
            gain.connect(masterGain);

            osc.start(t);
            osc.stop(t + 0.055);
        } catch (e) {
            // Autoplay safe
        }
    }

    function setMuted(muted) {
        isMuted = muted;
        localStorage.setItem("portfolio_sfx_enabled", (!muted).toString());
        if (masterGain && audioCtx) {
            masterGain.gain.setValueAtTime(isMuted ? 0 : 0.75, audioCtx.currentTime);
        }
        updateToggleUI();
        if (!isMuted) {
            playToggleSound(true);
        }
    }

    function toggleMute() {
        setMuted(!isMuted);
    }

    function getMuted() {
        return isMuted;
    }

    function updateToggleUI() {
        const toggleBtns = document.querySelectorAll(".sfx-toggle-btn, .sfx-toggle-btn-mobile");
        toggleBtns.forEach(btn => {
            if (isMuted) {
                btn.classList.add("sfx-muted");
                btn.setAttribute("aria-pressed", "false");
                const label = btn.querySelector(".sfx-label, .sfx-label-mobile");
                if (label) label.textContent = "[ SFX: OFF ]";
            } else {
                btn.classList.remove("sfx-muted");
                btn.setAttribute("aria-pressed", "true");
                const label = btn.querySelector(".sfx-label, .sfx-label-mobile");
                if (label) label.textContent = "[ SFX: ON ]";
            }
        });
    }

    function attachUIListeners() {
        // Universal Hover SFX across all interactive portfolio elements
        const hoverTargets = "a, button, [role='button'], .skill-badge, .tech-logo-item, .tech-logo-bubble, .tech-brand-tile, .tech-node, .skills-filter-pill, .project-card, .bento-project-card, .koyeb-app-card, .koyeb-featured-card, .koyeb-filter-pill, .koyeb-action-btn, .deck-card, .filter-btn, .cmd-chip, .terminal-tab, .telemetry-card, .popover-item, .hero-spec-chip, .timeline-card, .bento-badge, .nav-link, .mobile-nav-link, .name-word, .koyeb-link-btn, .koyeb-view-all-link, .hex-read-story-btn, .btn-copy-mono, input, .clone-box";
        
        document.addEventListener("mouseover", (e) => {
            const target = e.target.closest(hoverTargets);
            if (target && !target.hasAttribute("data-no-sfx")) {
                playHoverSound();
            }
        }, { passive: true });

        // Universal Click SFX on ALL clickable controls throughout the portfolio
        const clickTargets = "a, button, [role='button'], input[type='submit'], input[type='button'], .btn, .nav-link, .mobile-nav-link, .tech-logo-item, .tech-logo-bubble, .skills-filter-pill, .tech-brand-tile, .tech-node, .filter-btn, .cmd-chip, .terminal-tab, .project-card, .bento-project-card, .koyeb-app-card, .koyeb-featured-card, .koyeb-filter-pill, .koyeb-action-btn, .deck-card, .popover-item, .modal-close-btn, .theme-toggle-btn, .sfx-toggle-btn, .contact-social-link, .btn-copy-mono, [data-project-trigger], .name-word, .koyeb-link-btn, .koyeb-view-all-link, .hex-read-story-btn, .back-projects-btn";
        
        const triggerClick = (e) => {
            const target = e.target.closest(clickTargets);
            if (target && !target.hasAttribute("data-no-sfx")) {
                initAudioContext();
                playClickSound();
            }
        };

        document.addEventListener("pointerdown", triggerClick, { passive: true });
        document.addEventListener("click", triggerClick, { passive: true });

        // SFX Toggle button event listeners
        const toggleDesktop = document.getElementById("sfx-toggle-btn");
        const toggleMobile = document.getElementById("sfx-toggle-mobile");
        if (toggleDesktop) {
            toggleDesktop.addEventListener("click", (e) => {
                e.stopPropagation();
                toggleMute();
            });
        }
        if (toggleMobile) {
            toggleMobile.addEventListener("click", (e) => {
                e.stopPropagation();
                toggleMute();
            });
        }

        updateToggleUI();
    }

    function init() {
        setupLazyInit();
        updateToggleUI();
        attachUIListeners();
    }

    return {
        init,
        playHoverSound,
        playClickSound,
        playKeySound,
        playModalOpenSound,
        playToggleSound,
        toggleMute,
        setMuted,
        getMuted
    };
})();

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => SoundSystem.init());
} else {
    SoundSystem.init();
}


