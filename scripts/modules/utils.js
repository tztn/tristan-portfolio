/* ==========================================================================
   10: CONTACT FORM - ASYNCHRONOUS FORMSUBMIT DELIVERY, RATE LIMITING & VALIDATION
   ========================================================================== */
function initContactFeedback() {
    const copyBtn = document.getElementById("copy-email-btn");
    const contactForm = document.getElementById("contact-form");
    const emailToCopy = "agoilotristanray@gmail.com";

    // Direct reach copy button
    if (copyBtn) {
        copyBtn.addEventListener("click", async () => {
            try {
                await navigator.clipboard.writeText(emailToCopy);
                const originalHtml = copyBtn.innerHTML;
                copyBtn.innerHTML = '<span class="stack-mono-icon">✓</span><span>COPIED</span>';
                if (window.soundFX) window.soundFX.play("click");
                setTimeout(() => {
                    copyBtn.innerHTML = originalHtml;
                }, 2000);
            } catch (err) {
                console.error("Clipboard copy failed:", err);
            }
        });
    }

    if (!contactForm) return;

    // Endpoint for Web3Forms API submission
    const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";

    // Form elements
    const nameInput = document.getElementById("form-name");
    const emailInput = document.getElementById("form-email");
    const messageInput = document.getElementById("form-message");
    const gotchaInput = document.getElementById("form-gotcha");

    const errorName = document.getElementById("error-name");
    const errorEmail = document.getElementById("error-email");
    const errorMessage = document.getElementById("error-message");

    const submitBtn = document.getElementById("form-submit-btn");
    const feedbackHud = document.getElementById("form-feedback-hud");
    const rateLimitNotice = document.getElementById("rate-limit-notice");

    // Rate Limiting Config: 3 submissions per 24 hours
    const RATE_LIMIT_KEY_COUNT = "contact_submissions";
    const RATE_LIMIT_KEY_TIME = "contact_timestamp";
    const RATE_LIMIT_MAX = 3;
    const RATE_LIMIT_WINDOW_MS = 24 * 60 * 60 * 1000; // 24 hours

    function checkRateLimit() {
        try {
            const now = Date.now();
            let count = parseInt(localStorage.getItem(RATE_LIMIT_KEY_COUNT) || "0", 10);
            let timestamp = parseInt(localStorage.getItem(RATE_LIMIT_KEY_TIME) || "0", 10);

            if (isNaN(count)) count = 0;
            if (isNaN(timestamp) || timestamp === 0 || (now - timestamp) > RATE_LIMIT_WINDOW_MS) {
                count = 0;
                timestamp = now;
                localStorage.setItem(RATE_LIMIT_KEY_COUNT, "0");
                localStorage.setItem(RATE_LIMIT_KEY_TIME, timestamp.toString());
            }

            const isLimited = count >= RATE_LIMIT_MAX;
            updateRateLimitUI(isLimited);
            return isLimited;
        } catch (e) {
            return false;
        }
    }

    function recordSubmissionSuccess() {
        try {
            const now = Date.now();
            let count = parseInt(localStorage.getItem(RATE_LIMIT_KEY_COUNT) || "0", 10);
            let timestamp = parseInt(localStorage.getItem(RATE_LIMIT_KEY_TIME) || "0", 10);

            if (isNaN(count)) count = 0;
            if (isNaN(timestamp) || timestamp === 0 || (now - timestamp) > RATE_LIMIT_WINDOW_MS) {
                timestamp = now;
            }

            count += 1;
            localStorage.setItem(RATE_LIMIT_KEY_COUNT, count.toString());
            localStorage.setItem(RATE_LIMIT_KEY_TIME, timestamp.toString());

            const isLimited = count >= RATE_LIMIT_MAX;
            updateRateLimitUI(isLimited);
            return isLimited;
        } catch (e) {
            return false;
        }
    }

    function updateRateLimitUI(isLimited) {
        if (!submitBtn) return;
        if (isLimited) {
            submitBtn.disabled = true;
            if (rateLimitNotice) {
                rateLimitNotice.style.display = "block";
                rateLimitNotice.innerHTML = '[ Rate limit reached (3/day). Please reach out directly to <a href="mailto:' + emailToCopy + '">' + emailToCopy + '</a> ]';
            }
        } else {
            if (rateLimitNotice) {
                rateLimitNotice.style.display = "none";
                rateLimitNotice.innerHTML = "";
            }
        }
    }

    // Initialize rate limit state on page load
    checkRateLimit();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let errorTimeout = null;

    function clearFieldError(input, errorEl) {
        if (input) input.classList.remove("has-error");
        if (errorEl) errorEl.style.display = "none";
    }

    function clearAllErrors() {
        if (errorTimeout) {
            clearTimeout(errorTimeout);
            errorTimeout = null;
        }
        clearFieldError(nameInput, errorName);
        clearFieldError(emailInput, errorEmail);
        clearFieldError(messageInput, errorMessage);
    }

    function validateName() {
        if (!nameInput) return true;
        const val = nameInput.value.trim();
        if (val.length < 2) {
            nameInput.classList.add("has-error");
            if (errorName) errorName.style.display = "flex";
            return false;
        } else {
            clearFieldError(nameInput, errorName);
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
            clearFieldError(emailInput, errorEmail);
            return true;
        }
    }

    function validateMessage() {
        if (!messageInput) return true;
        const val = messageInput.value.trim();
        if (val.length < 10 || val.length > 1000) {
            messageInput.classList.add("has-error");
            if (errorMessage) errorMessage.style.display = "flex";
            return false;
        } else {
            clearFieldError(messageInput, errorMessage);
            return true;
        }
    }

    // Real-time clearing of error as user types valid input
    if (nameInput) {
        nameInput.addEventListener("input", () => {
            if (nameInput.value.trim().length >= 2) {
                clearFieldError(nameInput, errorName);
            }
        });
    }

    if (emailInput) {
        emailInput.addEventListener("input", () => {
            if (emailRegex.test(emailInput.value.trim())) {
                clearFieldError(emailInput, errorEmail);
            }
        });
    }

    if (messageInput) {
        messageInput.addEventListener("input", () => {
            const len = messageInput.value.trim().length;
            if (len >= 10 && len <= 1000) {
                clearFieldError(messageInput, errorMessage);
            }
        });
    }

    const idleBtnHtml = '<span>Send Message</span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>';
    let feedbackTimeout = null;

    // Contact form submit handler (Official Web3Forms Integration)
    contactForm.addEventListener("submit", async (e) => {
        // a. Call e.preventDefault()
        e.preventDefault();

        // b. Check the honeypot field (#form-gotcha). If filled, silently abort without sending.
        if (gotchaInput && gotchaInput.value.trim() !== "") {
            return;
        }

        // c. Run strict client-side validation
        const isNameValid = validateName();
        const isEmailValid = validateEmail();
        const isMessageValid = validateMessage();

        // If validation fails, display relevant inline .field-error-msg spans and auto-hide after 4 seconds
        if (!isNameValid || !isEmailValid || !isMessageValid) {
            if (!isNameValid && nameInput) nameInput.focus();
            else if (!isEmailValid && emailInput) emailInput.focus();
            else if (!isMessageValid && messageInput) messageInput.focus();

            // Auto-hide validation errors after a short amount of time (4 seconds) so they don't stay forever
            if (errorTimeout) clearTimeout(errorTimeout);
            errorTimeout = setTimeout(() => {
                clearAllErrors();
            }, 4000);

            if (window.soundFX) window.soundFX.play("click");
            return;
        }

        // Clear any pending error timeout if valid
        clearAllErrors();

        // Rate limiting check (3 submissions per 24 hours)
        if (checkRateLimit()) {
            if (feedbackHud) {
                feedbackHud.className = "form-feedback-hud font-mono feedback-error";
                feedbackHud.style.display = "block";
                feedbackHud.textContent = "✕ Rate limit reached (3 submissions per 24 hours). Please email agoilotristanray@gmail.com directly.";
            }
            return;
        }

        // d. If validation passes:
        // Disable the submit button and update button text/icon to show sending state
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span>Sending...</span>';
        }

        // Clear any existing feedback text in #form-feedback-hud
        if (feedbackHud) {
            feedbackHud.style.display = "none";
            feedbackHud.className = "form-feedback-hud font-mono";
            feedbackHud.textContent = "";
            if (feedbackTimeout) {
                clearTimeout(feedbackTimeout);
                feedbackTimeout = null;
            }
        }

        try {
            // Collect formData and send a POST request to Web3Forms
            const formData = new FormData(contactForm);
            const jsonObject = Object.fromEntries(formData.entries());

            const res = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(jsonObject)
            });
            const result = await res.json();

            // Handle response
            if (result.success) {
                // Reset form inputs
                contactForm.reset();

                // Hide all error spans and error classes
                if (nameInput) nameInput.classList.remove("has-error");
                if (emailInput) emailInput.classList.remove("has-error");
                if (messageInput) messageInput.classList.remove("has-error");
                if (errorName) errorName.style.display = "none";
                if (errorEmail) errorEmail.style.display = "none";
                if (errorMessage) errorMessage.style.display = "none";

                recordSubmissionSuccess();

                // Show success feedback in #form-feedback-hud
                if (feedbackHud) {
                    feedbackHud.className = "form-feedback-hud font-mono feedback-success";
                    feedbackHud.style.display = "block";
                    feedbackHud.textContent = "[200 OK] Message dispatched successfully.";

                    // Auto-hide the success message after 5 seconds
                    feedbackTimeout = setTimeout(() => {
                        feedbackHud.style.display = "none";
                        feedbackHud.textContent = "";
                    }, 5000);
                }

                if (window.soundFX) window.soundFX.play("success");
            } else {
                // Show failure feedback in #form-feedback-hud
                if (feedbackHud) {
                    feedbackHud.className = "form-feedback-hud font-mono feedback-error";
                    feedbackHud.style.display = "block";
                    feedbackHud.textContent = result.message || "Failed to send message. Please try again.";
                }
                if (window.soundFX) window.soundFX.play("click");
            }
        } catch (err) {
            console.error("Web3Forms submission error:", err);
            if (feedbackHud) {
                feedbackHud.className = "form-feedback-hud font-mono feedback-error";
                feedbackHud.style.display = "block";
                feedbackHud.textContent = "Failed to send message. Please try again.";
            }
            if (window.soundFX) window.soundFX.play("click");
        } finally {
            // In the finally block, re-enable the submit button and restore its original markup/text
            if (submitBtn) {
                const isLimited = checkRateLimit();
                submitBtn.disabled = isLimited;
                submitBtn.innerHTML = idleBtnHtml;
            }
        }
    });
}
