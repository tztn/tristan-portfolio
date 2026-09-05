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

