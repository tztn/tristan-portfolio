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

    // Endpoint for FormSubmit AJAX submission
    const FORMSUBMIT_ENDPOINT = "https://formsubmit.co/ajax/agoilotristanray@gmail.com";

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
        if (val.length < 10) {
            messageInput.classList.add("has-error");
            if (errorMessage) errorMessage.style.display = "flex";
            return false;
        } else {
            messageInput.classList.remove("has-error");
            if (errorMessage) errorMessage.style.display = "none";
            return true;
        }
    }

    // Real-time inline validation feedback
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

    const idleBtnHtml = '<span>Send Message</span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>';

    // Contact form submit handler
    contactForm.addEventListener("submit", (e) => {
        e.preventDefault();

        // 1. Check the honeypot field (_gotcha). If filled, silently abort without sending.
        if (gotchaInput && gotchaInput.value.trim() !== "") {
            return;
        }

        // 2. Validate inputs:
        //    - Name: at least 2 characters.
        //    - Email: standard valid email regex pattern.
        //    - Message: at least 10 characters.
        //    - If invalid, show inline errors, focus the first error, and abort.
        const isNameValid = validateName();
        const isEmailValid = validateEmail();
        const isMessageValid = validateMessage();

        if (!isNameValid || !isEmailValid || !isMessageValid) {
            if (!isNameValid && nameInput) nameInput.focus();
            else if (!isEmailValid && emailInput) emailInput.focus();
            else if (!isMessageValid && messageInput) messageInput.focus();
            return;
        }

        // 3. Enforce 24-hour rate limiting using localStorage: maximum 3 submissions per 24 hours.
        //    If limit reached, show warning banner and abort.
        if (checkRateLimit()) {
            if (feedbackHud) {
                feedbackHud.className = "form-feedback-hud font-mono feedback-error";
                feedbackHud.style.display = "block";
                feedbackHud.textContent = "✕ Rate limit reached (3 submissions per 24 hours). Please email agoilotristanray@gmail.com directly.";
            }
            return;
        }

        // 4. Disable submit button and set text to "Sending...".
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span>Sending...</span>';
        }
        if (feedbackHud) {
            feedbackHud.style.display = "none";
            feedbackHud.className = "form-feedback-hud font-mono";
            feedbackHud.textContent = "";
        }

        // 5. Send the fetch POST request
        fetch(FORMSUBMIT_ENDPOINT, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                name: nameInput.value.trim(),
                email: emailInput.value.trim(),
                message: messageInput.value.trim(),
                _subject: `New Portfolio Message from ${nameInput.value.trim()}`
            })
        })
        .then(res => {
            if (!res.ok) {
                throw new Error("HTTP error " + res.status);
            }
            return res.json();
        })
        .then(data => {
            nameInput.value = "";
            emailInput.value = "";
            messageInput.value = "";
            if (nameInput) nameInput.classList.remove("has-error");
            if (emailInput) emailInput.classList.remove("has-error");
            if (messageInput) messageInput.classList.remove("has-error");

            // Record rate limit timestamp in localStorage
            recordSubmissionSuccess();

            // Display green monospace success banner:
            // "✓ Message sent successfully. I'll get back to you soon."
            if (feedbackHud) {
                feedbackHud.className = "form-feedback-hud font-mono feedback-success";
                feedbackHud.style.display = "block";
                feedbackHud.textContent = "✓ Message sent successfully. I'll get back to you soon.";
            }

            if (window.soundFX) window.soundFX.play("success");
        })
        .catch(err => {
            console.error("Submission error:", err);
            // Display red monospace error banner:
            // "✕ Failed to send message. Please email agoilotristanray@gmail.com directly."
            if (feedbackHud) {
                feedbackHud.className = "form-feedback-hud font-mono feedback-error";
                feedbackHud.style.display = "block";
                feedbackHud.textContent = "✕ Failed to send message. Please email agoilotristanray@gmail.com directly.";
            }

            if (window.soundFX) window.soundFX.play("click");
        })
        .finally(() => {
            // Reset submit button state back to active
            if (submitBtn) {
                const isLimited = checkRateLimit();
                submitBtn.disabled = isLimited;
                submitBtn.innerHTML = idleBtnHtml;
            }
        });
    });
}
