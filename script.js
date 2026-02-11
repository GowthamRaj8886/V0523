document.addEventListener('DOMContentLoaded', () => {

    // --- Sound Effects ---
    const sfxFlip = document.getElementById('sfx-flip');
    const sfxPaper = document.getElementById('sfx-paper');

    function playSfx(type) {
        if (type === 'flip' && sfxFlip) {
            sfxFlip.currentTime = 0;
            sfxFlip.play().catch(e => { }); // catch autoplay policy
        } else if (type === 'paper' && sfxPaper) {
            sfxPaper.currentTime = 0;
            sfxPaper.play().catch(e => { });
        }
    }


    // --- Navigation Logic ---
    const pages = document.querySelectorAll('.page-section');
    const navLinks = document.querySelectorAll('.nav-link');

    function navigateTo(targetId) {
        // Sound
        playSfx('flip');

        // Cleanup Final Page State (Reset Yes/No interaction)
        if (targetId !== 'page-final') {
            const btnNo = document.getElementById('btnNo');
            const choiceContainer = document.querySelector('.choice-container');
            const proposalContent = document.getElementById('proposalContent');
            const successMessage = document.getElementById('successMessage');

            // Reset No Button position
            if (btnNo && choiceContainer && btnNo.parentNode === document.body) {
                choiceContainer.appendChild(btnNo);
                btnNo.style.position = '';
                btnNo.style.left = '';
                btnNo.style.top = '';
                btnNo.style.zIndex = '';
            }
            if (btnNo) btnNo.style.display = ''; // Show button again

            // Reset Success State
            if (proposalContent && successMessage) {
                proposalContent.classList.remove('hidden');
                successMessage.classList.add('hidden');
                successMessage.classList.remove('fade-in-up');
            }
        }

        // Fade out current
        pages.forEach(page => {
            if (page.classList.contains('active')) {
                page.classList.remove('active');
            }
        });

        // Fade in target after small delay
        setTimeout(() => {
            const targetPage = document.getElementById(targetId);
            if (targetPage) {
                targetPage.classList.add('active');
                initPageAnimations(targetId); // Trigger custom animations
            }
        }, 500); // Wait for transition
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const target = e.target.getAttribute('data-target');
            navigateTo(target);
        });
    });


    // --- Lock Screen Logic ---
    const unlockBtn = document.getElementById('unlockBtn');
    const unlockInput = document.getElementById('unlockInput');
    const bgMusic = document.getElementById('bgMusic');
    const musicControl = document.getElementById('musicControl');

    function unlock() {
        const answer = unlockInput.value.trim().toLowerCase();
        if (answer === 'black') {
            navigateTo('page-cover');

            // Try to play music
            bgMusic.volume = 0.5;
            bgMusic.play().then(() => {
                musicControl.classList.remove('hidden');
            }).catch(e => console.log("Audio autoplay prevented"));
        } else {
            unlockInput.style.borderColor = 'red';
            setTimeout(() => unlockInput.style.borderColor = '#E63946', 500);
        }
    }

    unlockBtn.addEventListener('click', unlock);
    unlockInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') unlock();
    });

    // Music Toggle
    musicControl.addEventListener('click', () => {
        if (bgMusic.paused) {
            bgMusic.play();
            musicControl.textContent = '🎵';
        } else {
            bgMusic.pause();
            musicControl.textContent = '🔇';
        }
    });


    // --- Custom Cursor (Trailing Hearts) ---
    const cursorContainer = document.getElementById('cursor-container');
    const colors = ['#FFC0CB', '#FF69B4', '#E63946', '#FFF'];

    document.addEventListener('mousemove', (e) => {
        const x = e.clientX;
        const y = e.clientY;

        if (Math.random() < 0.3) {
            const heart = document.createElement('div');
            heart.classList.add('cursor-trail');
            heart.style.left = x + 'px';
            heart.style.top = y + 'px';
            heart.style.background = colors[Math.floor(Math.random() * colors.length)];

            cursorContainer.appendChild(heart);
            setTimeout(() => {
                heart.remove();
            }, 1000);
        }
    });

    // --- 3D Book Tilt Effect ---
    const bookContainer = document.querySelector('.book-container');
    const bookCover = document.querySelector('.book-cover');

    if (bookContainer && bookCover) {
        bookContainer.addEventListener('mousemove', (e) => {
            const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
            const yAxis = (window.innerHeight / 2 - e.pageY) / 25;
            bookCover.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
        });

        bookContainer.addEventListener('mouseleave', () => {
            bookCover.style.transform = `rotateY(0deg) rotateX(0deg)`;
        });
    }


    // --- Time Together Counter ---
    function startTimer() {
        // Set your start date here: YYYY, MM (0-11), DD
        const startDate = new Date(2025, 4, 14); // May 14, 2025
        const timerElement = document.getElementById('timer');

        if (!timerElement) return;

        function update() {
            const now = new Date();
            const diff = now - startDate;

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((diff / 1000 / 60) % 60);
            const seconds = Math.floor((diff / 1000) % 60);

            timerElement.textContent = `${days} Days, ${hours} Hrs, ${minutes} Mins, ${seconds} Secs`;
        }
        setInterval(update, 1000);
        update();
    }
    startTimer();


    // --- Page Specific Animations ---
    function initPageAnimations(pageId) {

        // Chapter 1: Typewriter - DISABLED for new layout
        if (pageId === 'page-chap1') {
            // Logic handled by CSS animations now
        }


        // Final: Rose Petals
        if (pageId === 'page-final') {
            startRosePetals();
            initFinalPageInteraction(); // Initialize buttons for SPA
        }
    }


    // --- Chapter 5: Heartbeat Interaction ---
    const heartBtn = document.getElementById('heartBeat');
    const heartContainer = document.querySelector('.heartbeater');
    const message = document.getElementById('heartMessage');
    const nextBtn = document.getElementById('nextBtn');

    let clicks = 0;

    if (heartContainer) {
        heartContainer.addEventListener('click', () => {
            clicks++;
            if (clicks === 1) heartBtn.style.animationDuration = '0.6s';
            else if (clicks === 2) heartBtn.style.animationDuration = '0.3s';
            else if (clicks >= 3) {
                heartContainer.classList.add('fade-out');
                setTimeout(() => {
                    heartContainer.style.display = 'none';
                    message.classList.add('show');
                    nextBtn.classList.remove('hidden');
                }, 500);
            }
        });
    }

});

// --- Open Whenever Letters logic ---
function openLetter(type) {
    const overlay = document.getElementById('letter-overlay');
    const content = document.getElementById('letter-content');

    // Play sound
    const sfxPaper = document.getElementById('sfx-paper');
    if (sfxPaper) { sfxPaper.currentTime = 0; sfxPaper.play().catch(() => { }); }

    let text = "";
    if (type === 'sad') {
        text = "My love, remember that even the darkest clouds pass. I'm here for you, always. Close your eyes and imagine me holding your hand.";
    } else if (type === 'miss') {
        text = "I miss you too. More than words can say. Look at the sky; we are under the same one. I'll be seeing you soon.";
    } else if (type === 'mad') {
        text = "Take a deep breath. I love you even when you're frustrated. Let's fix this together. You are my priority.";
    }

    content.textContent = text;
    overlay.classList.remove('hidden');
}

function closeLetter() {
    document.getElementById('letter-overlay').classList.add('hidden');
}
window.openLetter = openLetter;
window.closeLetter = closeLetter;


// --- Rose Petals Animation ---
function startRosePetals() {
    const canvas = document.getElementById('confettiCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const petals = [];
    const colors = ['#C21E56', '#D81B60', '#E91E63', '#F48FB1', '#FFC0CB'];

    function createPetal() {
        return {
            x: Math.random() * canvas.width,
            y: -20,
            size: Math.random() * 15 + 10,
            color: colors[Math.floor(Math.random() * colors.length)],
            speed: Math.random() * 2 + 1,
            sway: Math.random() * 2 - 1,
            swaySpeed: Math.random() * 0.05 + 0.01,
            angle: Math.random() * Math.PI * 2,
            spin: Math.random() * 0.02 - 0.01
        };
    }

    function drawPetal(p) {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(p.size / 2, -p.size / 2, p.size, 0, 0, p.size);
        ctx.bezierCurveTo(-p.size, 0, -p.size / 2, -p.size / 2, 0, 0);
        ctx.fill();
        ctx.restore();
    }

    function update() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (petals.length < 50) petals.push(createPetal());

        for (let i = 0; i < petals.length; i++) {
            const p = petals[i];
            p.y += p.speed;
            p.angle += p.spin;
            p.x += Math.sin(p.y * p.swaySpeed) * 2;

            drawPetal(p);

            if (p.y > canvas.height) petals[i] = createPetal();
        }
        requestAnimationFrame(update);
    }
    update();
}

// --- FINAL PAGE INTERACTION ---
// Wrap logic in a function to be called by both SPA and Standalone
function initFinalPageInteraction() {
    // Check if we already added listeners to avoid duplicates if called multiple times
    if (window.finalPageInitialized) return;

    const btnYes = document.getElementById('btnYes');
    const btnNo = document.getElementById('btnNo');
    const proposalContent = document.getElementById('proposalContent');
    const successMessage = document.getElementById('successMessage');

    // Playful messages for the No button
    const noMessages = [
        "Are you sure? 😢",
        "Think again! 🤔",
        "Don't break my heart! 💔",
        "You don't have a choice! 😈",
        "Try the other button! 👉",
        "Nice try! 💨",
        "Nope! 🛡️"
    ];

    if (btnNo) {
        // Remove old listeners if any (simple way: clone node? or just flag)
        // Since we check finalPageInitialized, we assume clean slate.

        // Function to move the No button
        const moveButton = (e) => {
            // Fix: Move button to body to avoid transform containment issues from parent
            if (btnNo.parentNode !== document.body) {
                document.body.appendChild(btnNo);
                btnNo.style.position = 'fixed';
                btnNo.style.zIndex = '9999'; // Ensure it's on top
            }

            const x = Math.random() * (window.innerWidth - btnNo.offsetWidth - 50);
            const y = Math.random() * (window.innerHeight - btnNo.offsetHeight - 50);

            btnNo.style.left = `${Math.max(20, x)}px`;
            btnNo.style.top = `${Math.max(20, y)}px`;

            // Show random toast message
            showToast(noMessages[Math.floor(Math.random() * noMessages.length)]);
        };

        // Desktop hover
        btnNo.addEventListener('mouseover', moveButton);
        // Mobile tap (if they manage to tap it)
        btnNo.addEventListener('click', (e) => {
            e.preventDefault();
            moveButton();
        });
    }

    if (btnYes) {
        btnYes.addEventListener('click', () => {
            // Create heart explosion effect
            createHeartExplosion(btnYes);

            // Wait for hearts to start, then show success
            setTimeout(() => {
                // Hide proposal, show success
                if (proposalContent) proposalContent.classList.add('hidden');
                if (btnNo) btnNo.style.display = 'none'; // Make sure No button is gone
                if (successMessage) {
                    successMessage.classList.remove('hidden');
                    successMessage.classList.add('fade-in-up');
                }
            }, 800);
        });
    }

    window.finalPageInitialized = true;
}

// Call on load if we are on standalone final.html
if (document.body.classList.contains('page-final')) {
    initFinalPageInteraction();
}

// Simple Toast Notification
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'premium-toast';
    toast.innerText = message;
    document.body.appendChild(toast);

    // Toast Styles
    Object.assign(toast.style, {
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(255, 255, 255, 0.95)',
        color: '#d72638',
        padding: '12px 24px',
        borderRadius: '50px',
        fontFamily: "'Raleway', sans-serif",
        fontWeight: 'bold',
        zIndex: '1000',
        boxShadow: '0 5px 20px rgba(0,0,0,0.3)',
        opacity: '0',
        transition: 'opacity 0.3s',
        fontSize: '1rem'
    });

    // Animate in
    requestAnimationFrame(() => toast.style.opacity = '1');

    // Remove after 2 seconds
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}

// --- Chapter 5: Envelope Logic ---
function initEnvelope() {
    // Note: IDs remained the same (envelopeContainer, envelopeFlap), so this logic still works!
    // We only changed the CSS classes for styling.
    // However, let's verify if the flap logic relies on the class name for the open state.
    // Yes, we add 'open'. We need to make sure the CSS matches.
    // The CSS for .grand-envelope-flap.open exists.

    // Wait, let's ensure we are selecting the right elements if we used classes.
    // But we used IDs in HTML: id="envelopeContainer", id="envelopeFlap". 
    // So this JS actually doesn't strictly NEED changing if I kept the IDs the same.
    // But for consistency let's double check.

    const container = document.getElementById('envelopeContainer');
    const flap = document.getElementById('envelopeFlap');
    const sealBtn = document.getElementById('waxSealBtn');
    const letter = document.getElementById('letterPaper');
    const instruction = document.getElementById('envInstruction');
    const nextBtn = document.querySelector('#page-chap5 #nextBtn');

    if (!container || !flap || !sealBtn || !letter) return;

    container.addEventListener('click', () => {
        // 1. Break Seal
        sealBtn.classList.add('broken');
        if (instruction) instruction.style.opacity = '0';

        // 2. Open Flap
        setTimeout(() => {
            flap.classList.add('open');

            // 3. Slide Letter Out
            setTimeout(() => {
                letter.classList.add('slide-out');

                // 4. Show Next Button
                setTimeout(() => {
                    if (nextBtn) {
                        nextBtn.classList.remove('hidden');
                        nextBtn.classList.add('fade-in-up');
                    }
                }, 1500);

            }, 400); // Wait for flap to open slightly
        }, 200); // Short delay for seal break
    });
}

// --- ATMOSPHERIC FEATURES LOGIC ---
document.addEventListener('DOMContentLoaded', () => {

    // 2. Rose Tracker State Manager
    function updateRoseState(pageId) {
        const roseContainer = document.getElementById('rose-tracker');
        if (!roseContainer) return;

        // Reset classes
        roseContainer.classList.remove('rose-tracker-bud', 'rose-tracker-opening', 'rose-tracker-half', 'rose-tracker-full');

        // Step 1: Closed Bud
        if (pageId === 'page-cover' || pageId === 'page-chap1') {
            roseContainer.classList.add('rose-tracker-bud');
        }
        // Step 2: Opening (Stem grows, leaves appear)
        else if (pageId === 'page-chap2') {
            roseContainer.classList.add('rose-tracker-opening');
        }
        // Step 3: Half Bloom (More petals)
        else if (pageId === 'page-chap4') {
            roseContainer.classList.add('rose-tracker-half');
        }
        // Step 4: Full Bloom
        else if (pageId === 'page-chap5' || pageId === 'page-letters' || pageId === 'page-final') {
            roseContainer.classList.add('rose-tracker-full');
            startFallingPetals();
        } else {
            stopFallingPetals();
        }
    }

    // 4. Falling Petals Generator
    let petalInterval;
    function startFallingPetals() {
        if (petalInterval) return; // Already running

        petalInterval = setInterval(() => {
            const petal = document.createElement('div');
            petal.className = 'falling-petal';

            // Random start position near rose tracker (Right Bottom)
            const roseRect = document.getElementById('rose-tracker').getBoundingClientRect();
            // Randomly offset from rose center
            const startX = roseRect.left + 50 + (Math.random() * 40 - 20);
            const startY = roseRect.top + 50;

            petal.style.left = `${startX}px`;
            petal.style.top = `${startY}px`;

            // Randomize animation duration
            const duration = 2 + Math.random() * 2;
            petal.style.animation = `petalFall ${duration}s cubic-bezier(0.4, 0, 1, 1) forwards`;

            document.body.appendChild(petal);

            // Cleanup
            setTimeout(() => {
                petal.remove();
            }, duration * 1000);

        }, 800); // Frequency
    }

    function stopFallingPetals() {
        if (petalInterval) {
            clearInterval(petalInterval);
            petalInterval = null;
        }
    }

    // Initial State
    updateRoseState('page-cover');

    // MutationObserver to detect active page changes
    const pageObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                if (mutation.target.classList.contains('active')) {
                    updateRoseState(mutation.target.id);


                }
            }
        });
    });

    document.querySelectorAll('.page-section').forEach(page => {
        pageObserver.observe(page, { attributes: true });
    });


    // 3. Audio Visualizer (CSS Activation)
    function addVisualizer(targetSelector) {
        const target = document.querySelector(targetSelector);
        if (target && !target.querySelector('.visualizer-ring')) {
            const ring = document.createElement('div');
            ring.className = 'visualizer-ring visualizer-active';
            target.appendChild(ring);
        }
    }

    addVisualizer('.book-title');
    // Note: Button on final page might not exist yet if generated, but it is static in HTML now.
    addVisualizer('#btnYes');

    // 7. Wax Seal Logic
    const waxSeal = document.querySelector('.wax-seal');
    const sealOverlay = document.querySelector('.wax-seal-overlay');

    if (waxSeal && sealOverlay) {
        waxSeal.addEventListener('click', () => {
            waxSeal.classList.add('broken');
            // Play paper/crack sound if available?
            const sfxPaper = document.getElementById('sfx-paper');
            if (sfxPaper) sfxPaper.play();

            setTimeout(() => {
                const letterContainer = document.getElementById('letterContainer');
                if (letterContainer) {
                    letterContainer.classList.add('letter-theme-active');

                    // Reveal text
                    const staticContent = letterContainer.querySelector('.letter-content-static');
                    if (staticContent) {
                        staticContent.classList.remove('opacity-0');
                        staticContent.classList.add('fade-in-up');
                    }
                }

                sealOverlay.classList.add('hidden-seal');
                setTimeout(() => {
                    sealOverlay.style.display = 'none';
                }, 800);
            }, 600);
        });
    }

});

// OVERRIDE NavigateTo for 3D Flip 
window.navigateTo = function (targetId) {
    const current = document.querySelector('.page-section.active');
    const next = document.getElementById(targetId);

    if (!current || !next) return;

    // Play Flip Sound
    const sfx = document.getElementById('sfx-flip');
    if (sfx) {
        sfx.currentTime = 0;
        sfx.play();
    }

    // 3D Flip Animation
    current.classList.add('turn-out');
    next.classList.add('active', 'turn-in');

    // Force Reflow
    void next.offsetWidth;

    next.classList.add('turn-in-active');

    // Update State (Rose, etc) - trigger existing observers
    // The observer expects 'active' class which we added.


    setTimeout(() => {
        current.classList.remove('active', 'turn-out');
        next.classList.remove('turn-in', 'turn-in-active');



    }, 1000); // Wait for transition
};


// ========================================
// NEW DESIGN ENHANCEMENTS JAVASCRIPT
// ========================================

document.addEventListener('DOMContentLoaded', () => {

    // 1. INK BLOT TRANSITION EFFECT
    const inkBlotOverlay = document.getElementById('inkBlotOverlay');

    // Override existing navigateTo to include ink blot effect
    const originalNavigateTo = window.navigateTo;
    window.navigateTo = function (targetId) {
        // Trigger ink blot
        if (inkBlotOverlay) {
            inkBlotOverlay.style.display = 'block';
            inkBlotOverlay.classList.add('active');

            setTimeout(() => {
                // Call original navigation during ink blot expansion
                if (originalNavigateTo) {
                    originalNavigateTo(targetId);
                }

                // Fade out ink blot
                setTimeout(() => {
                    inkBlotOverlay.classList.add('fade-out');
                    setTimeout(() => {
                        inkBlotOverlay.classList.remove('active', 'fade-out');
                        inkBlotOverlay.style.display = 'none';
                    }, 800);
                }, 400);
            }, 400);
        } else {
            // Fallback if no ink blot element
            if (originalNavigateTo) {
                originalNavigateTo(targetId);
            }
        }
    };


    // 2. PAGE CURL CLICK NAVIGATION WITH 3D FLIP
    document.querySelectorAll('.page-curl').forEach(curl => {
        curl.addEventListener('click', (e) => {
            const target = curl.getAttribute('data-target');
            if (target) {
                // Get current and target pages
                const currentPage = document.querySelector('.page-section.active');
                const targetPage = document.getElementById(target);

                if (currentPage && targetPage) {
                    // Add flipping classes
                    currentPage.classList.add('flipping-out');
                    targetPage.classList.add('flipping-in');

                    // Navigate after flip starts
                    setTimeout(() => {
                        window.navigateTo(target);

                        // Clean up flip classes after animation
                        setTimeout(() => {
                            currentPage.classList.remove('flipping-out');
                            targetPage.classList.remove('flipping-in');
                        }, 800);
                    }, 400);
                } else {
                    // Fallback to normal navigation
                    window.navigateTo(target);
                }
            }
        });
    });

    // 3. HANDWRITTEN ANNOTATIONS - Auto-show after delay
    const showAnnotations = () => {
        const activeSection = document.querySelector('.page-section.active');
        if (activeSection) {
            const annotations = activeSection.querySelectorAll('.annotation');
            annotations.forEach((annotation, index) => {
                setTimeout(() => {
                    annotation.classList.add('visible');
                }, 2000 + (index * 500)); // Stagger appearance
            });
        }
    };

    // Trigger annotations when page becomes active
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                if (mutation.target.classList.contains('active')) {
                    // Reset previous annotations
                    document.querySelectorAll('.annotation').forEach(a => a.classList.remove('visible'));
                    // Show new ones
                    setTimeout(showAnnotations, 500);
                }
            }
        });
    });

    document.querySelectorAll('.page-section').forEach(page => {
        observer.observe(page, { attributes: true });
    });

    // Show annotations on initial page
    setTimeout(showAnnotations, 2000);

    // 4. INTERACTIVE FIREFLIES / SPARKLES
    const fireflyContainer = document.getElementById('firefly-container');
    let fireflyInterval;
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    // Track mouse position
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Create firefly element
    function createFirefly(x, y) {
        const firefly = document.createElement('div');
        firefly.className = 'firefly';

        // Random offset from cursor
        const offsetX = (Math.random() - 0.5) * 100;
        const offsetY = (Math.random() - 0.5) * 100;

        firefly.style.left = (x + offsetX) + 'px';
        firefly.style.top = (y + offsetY) + 'px';

        // Random animation duration
        const duration = 2 + Math.random() * 2;
        firefly.style.animationDuration = duration + 's';

        fireflyContainer.appendChild(firefly);

        // Remove after animation
        setTimeout(() => {
            firefly.remove();
        }, duration * 1000);
    }

    // Create sparkle trail
    function createSparkle(x, y) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.style.left = x + 'px';
        sparkle.style.top = y + 'px';

        document.body.appendChild(sparkle);

        setTimeout(() => {
            sparkle.remove();
        }, 1500);
    }

    // Generate fireflies periodically near cursor
    function startFireflies() {
        if (fireflyInterval) return;

        fireflyInterval = setInterval(() => {
            // Create firefly near mouse position
            createFirefly(mouseX, mouseY);

            // Occasionally create sparkle
            if (Math.random() < 0.3) {
                createSparkle(mouseX, mouseY);
            }
        }, 800);
    }

    function stopFireflies() {
        if (fireflyInterval) {
            clearInterval(fireflyInterval);
            fireflyInterval = null;
        }
    }

    // Start fireflies on certain pages
    const fireflyPages = ['page-cover', 'page-chap3', 'page-final'];

    const pageObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const target = mutation.target;
                if (target.classList.contains('active')) {
                    if (fireflyPages.includes(target.id)) {
                        startFireflies();
                    } else {
                        stopFireflies();
                    }
                }
            }
        });
    });

    document.querySelectorAll('.page-section').forEach(page => {
        pageObserver.observe(page, { attributes: true });
    });

    // Check initial page
    const initialActive = document.querySelector('.page-section.active');
    if (initialActive && fireflyPages.includes(initialActive.id)) {
        startFireflies();
    }

});


// ========================================
// PAGE FLIPPER NAVIGATION SYSTEM
// ========================================

document.addEventListener('DOMContentLoaded', () => {

    // Define page order
    const pageOrder = [
        'lock-screen',
        'page-cover',
        'page-chap1',
        'page-chap2',
        'page-chap3',
        'page-chap4',
        'page-chap5',
        'page-letters',
        'page-final'
    ];

    // Get current page index
    function getCurrentPageIndex() {
        const activePage = document.querySelector('.page-section.active');
        if (!activePage) return -1;
        return pageOrder.indexOf(activePage.id);
    }

    // Navigate to next/previous page
    function navigateToPage(direction) {
        const currentIndex = getCurrentPageIndex();
        if (currentIndex === -1) return;

        let targetIndex = currentIndex + direction;

        // Boundary checks
        if (targetIndex < 0) targetIndex = 0;
        if (targetIndex >= pageOrder.length) targetIndex = pageOrder.length - 1;

        // Don't navigate if already at boundary
        if (targetIndex === currentIndex) return;

        // Skip lock screen when going back
        if (direction === -1 && pageOrder[targetIndex] === 'lock-screen') {
            return; // Can't go back to lock screen
        }

        const targetPageId = pageOrder[targetIndex];
        if (window.navigateTo) {
            window.navigateTo(targetPageId);
        }
    }

    // Click zone navigation
    const navZoneLeft = document.getElementById('navZoneLeft');
    const navZoneRight = document.getElementById('navZoneRight');

    if (navZoneLeft) {
        navZoneLeft.addEventListener('click', (e) => {
            // Don't trigger if clicking on interactive elements
            if (e.target.closest('button, a, .envelope, .polaroid, input, .wax-seal, .page-curl')) {
                return;
            }
            navigateToPage(-1); // Go to previous page
        });
    }

    if (navZoneRight) {
        navZoneRight.addEventListener('click', (e) => {
            // Don't trigger if clicking on interactive elements
            if (e.target.closest('button, a, .envelope, .polaroid, input, .wax-seal, .page-curl')) {
                return;
            }
            navigateToPage(1); // Go to next page
        });
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        // Don't trigger if typing in input
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }

        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            e.preventDefault();
            navigateToPage(1);
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            e.preventDefault();
            navigateToPage(-1);
        }
    });

    // Hide keyboard hint after first interaction
    const keyboardHint = document.getElementById('keyboardHint');
    let hintHidden = false;

    function hideHint() {
        if (!hintHidden && keyboardHint) {
            keyboardHint.classList.add('hide');
            hintHidden = true;
        }
    }

    // Hide hint on first navigation
    document.addEventListener('keydown', hideHint, { once: true });
    if (navZoneLeft) navZoneLeft.addEventListener('click', hideHint, { once: true });
    if (navZoneRight) navZoneRight.addEventListener('click', hideHint, { once: true });

    // Update navigation zones visibility based on current page
    function updateNavZones() {
        const currentIndex = getCurrentPageIndex();
        const currentPageId = pageOrder[currentIndex];

        // Hide nav zones on lock screen and final page
        if (currentPageId === 'lock-screen' || currentPageId === 'page-final') {
            if (navZoneLeft) navZoneLeft.style.display = 'none';
            if (navZoneRight) navZoneRight.style.display = 'none';
        } else {
            if (navZoneLeft) navZoneLeft.style.display = 'block';
            if (navZoneRight) navZoneRight.style.display = 'block';
        }

        // Hide left arrow on first navigable page (cover)
        if (currentPageId === 'page-cover') {
            if (navZoneLeft) navZoneLeft.style.opacity = '0.3';
        } else {
            if (navZoneLeft) navZoneLeft.style.opacity = '1';
        }

        // Hide right arrow on last page
        if (currentIndex === pageOrder.length - 1) {
            if (navZoneRight) navZoneRight.style.opacity = '0.3';
        } else {
            if (navZoneRight) navZoneRight.style.opacity = '1';
        }
    }

    // Observe page changes
    const navObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                if (mutation.target.classList.contains('active')) {
                    updateNavZones();
                }
            }
        });
    });

    document.querySelectorAll('.page-section').forEach(page => {
        navObserver.observe(page, { attributes: true });
    });

    // Initial update
    updateNavZones();

});


// ========================================
// HEART EXPLOSION EFFECT FOR YES BUTTON
// ========================================

function createHeartExplosion(button) {
    const rect = button.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Create 20 hearts
    for (let i = 0; i < 20; i++) {
        const heart = document.createElement('div');
        heart.textContent = '❤️';
        heart.style.position = 'fixed';
        heart.style.left = centerX + 'px';
        heart.style.top = centerY + 'px';
        heart.style.fontSize = (Math.random() * 20 + 20) + 'px';
        heart.style.pointerEvents = 'none';
        heart.style.zIndex = '10000';
        heart.style.transition = 'all 1.5s ease-out';

        document.body.appendChild(heart);

        // Animate heart outward
        setTimeout(() => {
            const angle = (Math.PI * 2 * i) / 20;
            const distance = Math.random() * 300 + 150;
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;

            heart.style.transform = `translate(${x}px, ${y}px) rotate(${Math.random() * 360}deg) scale(${Math.random() + 0.5})`;
            heart.style.opacity = '0';
        }, 50);

        // Remove heart after animation
        setTimeout(() => {
            heart.remove();
        }, 1600);
    }
}


// ========================================
// MOBILE-FRIENDLY FEATURES
// ========================================

// 1. DRAGGABLE POLAROIDS (TOUCH + MOUSE)
function initDraggablePolaroids() {
    // Only select polaroids inside the scrapbook layout (Chapter 2)
    const polaroids = document.querySelectorAll('.scrapbook-layout .polaroid');
    const container = document.querySelector('.scrapbook-layout');

    if (!polaroids.length || !container) return;

    // Spread out positions more predictably (less overlap)
    polaroids.forEach((card, index) => {
        // Distribute in a slight arc/grid instead of pure random
        const row = Math.floor(index / 2); // 0 or 1
        const col = index % 2; // 0 or 1

        // Base positions: Top-Left, Top-Right, Bottom-Center, etc.
        let x, y;

        // Tighter grouping to keep them 'on the table'
        if (index === 0) { x = 35; y = 40; }
        else if (index === 1) { x = 65; y = 45; }
        else { x = 50; y = 55; } // Moved up from 70% to 55%

        // Add small random noise
        x += (Math.random() * 10 - 5);
        y += (Math.random() * 10 - 5);

        const rot = (Math.random() * 30 - 15); // -15 to +15 deg

        card.style.left = `${x}%`;
        card.style.top = `${y}%`;
        card.style.transform = `translate(-50%, -50%) rotate(${rot}deg)`;

        // Save initial rotation for later restoration
        card.dataset.rotation = rot;

        makeDraggable(card);
    });
}

function makeDraggable(element) {
    let isDragging = false;
    let startX, startY;
    let initialLeft, initialTop;

    // Mouse Events
    element.addEventListener('mousedown', startDrag);
    window.addEventListener('mousemove', drag);
    window.addEventListener('mouseup', endDrag);

    // Touch Events
    element.addEventListener('touchstart', startDrag, { passive: false });
    window.addEventListener('touchmove', drag, { passive: false });
    window.addEventListener('touchend', endDrag);

    function startDrag(e) {
        // Only start if it's the target element
        if (e.target.closest('.polaroid') !== element) return;

        if (e.type === 'touchstart') {
            // e.preventDefault(); // Prevent scrolling - handled by CSS touch-action but good backup
        }

        isDragging = true;

        // Bring to front
        document.querySelectorAll('.polaroid').forEach(p => p.style.zIndex = 1);
        element.style.zIndex = 100;

        // Get start coordinates
        const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
        const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;

        startX = clientX;
        startY = clientY;

        // Get current position (parsed from inline style percentage if possible, else computed)
        const rect = element.getBoundingClientRect();
        const parentRect = element.parentElement.getBoundingClientRect();

        // Calculate offset from parent top-left
        initialLeft = rect.left - parentRect.left + (rect.width / 2); // Center point relative to parent
        initialTop = rect.top - parentRect.top + (rect.height / 2);
    }

    function drag(e) {
        if (!isDragging) return;

        if (e.type === 'touchmove') {
            e.preventDefault(); // Critical for mobile to stop scrolling
        }

        const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
        const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;

        const deltaX = clientX - startX;
        const deltaY = clientY - startY;

        // Convert pixels to % of container width for responsiveness
        const container = element.parentElement;
        const newLeftPercent = ((initialLeft + deltaX) / container.offsetWidth) * 100;
        const newTopPercent = ((initialTop + deltaY) / container.offsetHeight) * 100;

        element.style.left = `${newLeftPercent}%`;
        element.style.top = `${newTopPercent}%`;
    }

    function endDrag() {
        if (!isDragging) return;
        isDragging = false;

        // Restore rotation with small bounce
        const rot = element.dataset.rotation || 0;
        element.style.transform = `translate(-50%, -50%) rotate(${rot}deg)`;
    }
}


// 2. TYPEWRITER EFFECT FOR LETTERS
// Reverted to simple text display (No Typewriter)
window.openLetter = function (type) {
    const overlay = document.getElementById('letter-overlay');
    const content = document.getElementById('letter-content');

    // Show overlay
    if (overlay) overlay.classList.remove('hidden');

    let text = "";
    if (type === 'sad') {
        text = "My love, remember that even the darkest clouds pass. I'm here for you, always. Close your eyes and imagine me holding your hand.";
    } else if (type === 'miss') {
        text = "I miss you too. More than words can say. Look at the sky; we are under the same one. I'll be seeing you soon.";
    } else if (type === 'mad') {
        text = "Take a deep breath. I love you even when you're frustrated. Let's fix this together. You are my priority.";
    }

    // Instant text
    if (content) content.textContent = text;
};

// Init Drag on Load
document.addEventListener('DOMContentLoaded', () => {
    // Wait for layout
    setTimeout(initDraggablePolaroids, 500);
});

// --- Scroll-Based Animation Trigger (Intersection Observer) ---
document.addEventListener('DOMContentLoaded', () => {
    const chap4Observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Determine if we should play animation
                const section = entry.target;
                const texts = section.querySelectorAll('.fade-text');

                // Only start sequence if not already playing/done
                // We check if the first one is already visible
                if (texts.length > 0 && !texts[0].classList.contains('visible')) {

                    let step = 0;
                    function showNext() {
                        if (step < texts.length) {
                            texts[step].classList.add('visible');
                            step++;
                            setTimeout(showNext, 2500); // 2.5s delay between lines
                        }
                    }
                    setTimeout(showNext, 500); // Initial delay
                }
            }
        });
    }, { threshold: 0.3 }); // Trigger when 30% visible

    const chap4 = document.getElementById('page-chap4');
    if (chap4) chap4Observer.observe(chap4);
});




