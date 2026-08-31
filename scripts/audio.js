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

    // Initialize state from localStorage (default: enabled)
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
                masterGain.gain.setValueAtTime(isMuted ? 0 : 0.08, audioCtx.currentTime);
                masterGain.connect(audioCtx.destination);
            }
        }
        if (audioCtx && audioCtx.state === "suspended") {
            audioCtx.resume();
        }
    }

    // Ensure audio context is unlocked on first user interaction
    function setupLazyInit() {
        const triggerEvents = ["pointerdown", "click", "keydown", "touchstart"];
        const unlock = () => {
            initAudioContext();
            triggerEvents.forEach(evt => window.removeEventListener(evt, unlock, { capture: true }));
        };
        triggerEvents.forEach(evt => window.addEventListener(evt, unlock, { capture: true, passive: true }));
    }

    /* --------------------------------------------------------------------------
       SFX SYNTHESIZERS
       -------------------------------------------------------------------------- */

    /**
     * Subtle, high-frequency mechanical "pip" on element hover.
     */
    function playHoverSound() {
        if (isMuted) return;
        const now = Date.now();
        if (now - lastHoverTime < 38) return; // Throttle rapid sweeps
        lastHoverTime = now;

        initAudioContext();
        if (!audioCtx) return;

        try {
            const t = audioCtx.currentTime;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            const filter = audioCtx.createBiquadFilter();

            osc.type = "sine";
            osc.frequency.setValueAtTime(2400, t);
            osc.frequency.exponentialRampToValueAtTime(1500, t + 0.016);

            filter.type = "highpass";
            filter.frequency.setValueAtTime(800, t);

            gain.gain.setValueAtTime(0.026, t);
            gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.016);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(masterGain);

            osc.start(t);
            osc.stop(t + 0.02);
        } catch (e) {
            // Browser autoplay safety
        }
    }

    /**
     * Crisp terminal switch / key select sound on button/card click.
     */
    function playClickSound() {
        if (isMuted) return;
        initAudioContext();
        if (!audioCtx) return;

        try {
            const t = audioCtx.currentTime;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();

            osc.type = "triangle";
            osc.frequency.setValueAtTime(460, t);
            osc.frequency.exponentialRampToValueAtTime(130, t + 0.032);

            gain.gain.setValueAtTime(0.06, t);
            gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.032);

            osc.connect(gain);
            gain.connect(masterGain);

            osc.start(t);
            osc.stop(t + 0.038);
        } catch (e) {
            // Browser autoplay safety
        }
    }

    /**
     * Soft mechanical key click for terminal typewriter characters.
     */
    function playKeySound() {
        if (isMuted) return;
        initAudioContext();
        if (!audioCtx) return;

        try {
            const t = audioCtx.currentTime;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();

            const freq = 750 + Math.random() * 320;
            osc.type = "sine";
            osc.frequency.setValueAtTime(freq, t);
            osc.frequency.exponentialRampToValueAtTime(freq * 0.45, t + 0.012);

            gain.gain.setValueAtTime(0.02, t);
            gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.012);

            osc.connect(gain);
            gain.connect(masterGain);

            osc.start(t);
            osc.stop(t + 0.015);
        } catch (e) {
            // Browser autoplay safety
        }
    }

    /**
     * Terminal modal opening tone.
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
            osc.frequency.setValueAtTime(280, t);
            osc.frequency.exponentialRampToValueAtTime(780, t + 0.065);

            gain.gain.setValueAtTime(0.04, t);
            gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.075);

            osc.connect(gain);
            gain.connect(masterGain);

            osc.start(t);
            osc.stop(t + 0.08);
        } catch (e) {
            // Browser autoplay safety
        }
    }

    /**
     * Toggle sound feedback when enabling/disabling audio.
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
                osc.frequency.setValueAtTime(540, t);
                osc.frequency.exponentialRampToValueAtTime(1080, t + 0.07);
            } else {
                osc.frequency.setValueAtTime(840, t);
                osc.frequency.exponentialRampToValueAtTime(420, t + 0.05);
            }

            gain.gain.setValueAtTime(0.045, t);
            gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.08);

            osc.connect(gain);
            gain.connect(audioCtx.destination);

            osc.start(t);
            osc.stop(t + 0.09);
        } catch (e) {
            // Browser autoplay safety
        }
    }

    function setMuted(muted) {
        isMuted = muted;
        localStorage.setItem("portfolio_sfx_enabled", (!muted).toString());
        if (masterGain && audioCtx) {
            masterGain.gain.setValueAtTime(isMuted ? 0 : 0.08, audioCtx.currentTime);
        }
        updateToggleUI();
        playToggleSound(!isMuted);
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
        // Hover SFX across interactive portfolio elements
        const hoverTargets = "a, button, .skill-badge, .project-card, .filter-btn, .cmd-chip, .terminal-tab, .telemetry-card, .popover-item, .hero-spec-chip";
        document.addEventListener("mouseover", (e) => {
            const target = e.target.closest(hoverTargets);
            if (target && !target.hasAttribute("data-no-sfx")) {
                playHoverSound();
            }
        }, { passive: true });

        // Click SFX on actionable controls
        const clickTargets = "button, .btn, .filter-btn, .cmd-chip, .terminal-tab, .project-card, .modal-close-btn, .theme-toggle-btn, .sfx-toggle-btn, .contact-social-link";
        document.addEventListener("click", (e) => {
            const target = e.target.closest(clickTargets);
            if (target && !target.classList.contains("sfx-toggle-btn") && !target.classList.contains("sfx-toggle-btn-mobile")) {
                playClickSound();
            }
        }, { passive: true });

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
