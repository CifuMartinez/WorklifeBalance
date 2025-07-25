document.addEventListener('DOMContentLoaded', () => {
    // Animación inicial
    const orbitalSystem = document.querySelector('.orbital-system');
    const centerCircle = orbitalSystem.querySelector('.center-circle');
    const orbits = orbitalSystem.querySelectorAll('.orbit');
    const circles = document.querySelectorAll('.circle-button');

    // Configuración inicial
    gsap.set([centerCircle, ...orbits], { opacity: 0, scale: 0.5 });
    gsap.set(circles, { opacity: 0});

    // Timeline para la animación secuencial
    const tl = gsap.timeline();

    // Animación del sistema orbital
    tl.to(centerCircle, {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: "power2.out"
    });

    // Animación de las órbitas secuencialmente
    orbits.forEach((orbit, index) => {
        tl.to(orbit, {
            opacity: 1,
            scale: 1,
            duration: 0.8,
            ease: "power2.out"
        }, "-=0.6"); // Se superpone ligeramente con la animación anterior
    });

    // Animación de los botones circulares (solo opacidad)
    tl.to(circles, {
        opacity: 1,
        duration: 0.8,
        ease: "power2.out",
        stagger: 0.1
    }, "-=0.4");

    const circlesContainer = document.querySelector('.circles-container');
    const messageDisplay = document.querySelector('.message-display');
    const messageText = messageDisplay.querySelector('.message');

    // Audio setup
    const ambientMusic = document.getElementById('ambient-music');
    const clickSound = document.getElementById('click-sound');
    const soundToggle = document.querySelector('.sound-toggle');
    let isPlaying = true;

    // Initial audio configuration
    ambientMusic.volume = 0;
    ambientMusic.loop = true;
    clickSound.volume = 0.2; // Lower volume for click effect
    
    // Reproducir música automáticamente al cargar
    ambientMusic.play().then(() => {
        // Fade in volume
        let volume = 0;
        const fadeIn = setInterval(() => {
            if (volume < 0.3) {
                volume += 0.01;
                ambientMusic.volume = volume;
            } else {
                clearInterval(fadeIn);
            }
        }, 50);
        soundToggle.classList.remove('muted');
    }).catch(error => {
        console.error('Error playing audio:', error);
        soundToggle.classList.add('muted');
        isPlaying = false;
    });

    // Function to play click sound
    function playClickSound() {
        if (!soundToggle.classList.contains('muted')) {
            clickSound.currentTime = 0; // Reset sound to play it immediately
            clickSound.play();
        }
    }

    // Event when audio ends
    ambientMusic.addEventListener('ended', () => {
        if (isPlaying) {
            ambientMusic.currentTime = 0;
            ambientMusic.play();
        }
    });

    soundToggle.addEventListener('click', () => {
        if (!isPlaying) {
            ambientMusic.play();
            // Fade in volume
            let volume = 0;
            const fadeIn = setInterval(() => {
                if (volume < 0.3) {
                    volume += 0.01;
                    ambientMusic.volume = volume;
                } else {
                    clearInterval(fadeIn);
                }
            }, 50);
            soundToggle.classList.remove('muted');
            isPlaying = true;
        } else {
            // Fade out volume
            let volume = ambientMusic.volume;
            const fadeOut = setInterval(() => {
                if (volume > 0) {
                    volume -= 0.01;
                    ambientMusic.volume = volume;
                } else {
                    ambientMusic.pause();
                    clearInterval(fadeOut);
                }
            }, 50);
            soundToggle.classList.add('muted');
            isPlaying = false;
        }
    });

    // Handle audio errors
    ambientMusic.addEventListener('error', (e) => {
        console.error('Error playing audio:', e);
        soundToggle.classList.add('muted');
        isPlaying = false;
    });

    // Variable to store current active button
    let activeButton = null;

    // Handle circle clicks
    circles.forEach(circle => {
        circle.addEventListener('click', (event) => {
            event.stopPropagation(); // Prevenir que el clic se propague al documento
            playClickSound(); // Play click sound

            // If there's an active button, remove its active class
            if (activeButton) {
                activeButton.classList.remove('active');
            }

            // If clicking the same button that was already active
            if (activeButton === circle) {
                activeButton = null;
                messageDisplay.classList.remove('visible');
                circlesContainer.classList.remove('has-active');
                return;
            }

            // Activate new button
            circle.classList.add('active');
            activeButton = circle;
            circlesContainer.classList.add('has-active');
            
            const message = circle.getAttribute('data-message');
            showMessage(message);
        });
    });

    // Manejar clics fuera de los botones
    document.addEventListener('click', (event) => {
        if (activeButton && !event.target.closest('.circle-button')) {
            activeButton.classList.remove('active');
            activeButton = null;
            messageDisplay.classList.remove('visible');
            circlesContainer.classList.remove('has-active');
        }
    });

    function showMessage(message) {
        messageText.textContent = message;
        messageDisplay.classList.add('visible');
    }
});