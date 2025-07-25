document.addEventListener('DOMContentLoaded', function() {
    // Registrar el plugin de texto
    gsap.registerPlugin(TextPlugin);

    // Animación del header
    const header = document.querySelector('.main-header');
    const contractSection = document.querySelector('.contract-interactive');
    const knowMoreBtn = document.querySelector('.know-more');

    if (header) {
        // Configurar el estado inicial de los elementos
        gsap.set(header, {
            y: 150,
            scale: 1.2
        });

        gsap.set(contractSection, {
            y: 60,
            opacity: 0
        });

        gsap.set(knowMoreBtn, {
            scale: 0.8,
            opacity: 0
        });

        // Crear la timeline para la secuencia de animaciones
        const tl = gsap.timeline();

        // 1. Animación del header
        tl.to(header, {
            y: 0,
            scale: 1,
            duration: 1.5,
            ease: "power2.out",
            delay: 1.5
        });

        // 2. Animación del texto del contrato después del header
        const contractText = document.querySelector('.contract-section p');
        if (contractText) {
            const originalText = contractText.textContent;
            contractText.textContent = '';
            
            // Dividir el texto en líneas
            const lines = originalText.split('. ').map(line => line.trim() + '.');
            
            // Crear un contenedor para cada línea
            lines.forEach((line, index) => {
                const lineElement = document.createElement('div');
                lineElement.textContent = line;
                lineElement.style.opacity = 0;
                lineElement.style.transform = 'translateY(20px)';
                lineElement.style.filter = 'blur(3px)';
                lineElement.style.position = 'relative';
                lineElement.style.marginBottom = '0.5em';
                contractText.appendChild(lineElement);
                
                // Añadir la animación de cada línea a la timeline
                tl.to(lineElement, {
                    opacity: 1,
                    y: 0,
                    filter: 'blur(0px)',
                    duration: 1,
                    delay: index * 0.1,
                    ease: "power2.out"
                }, "-=0.9"); // Comenzar ligeramente antes de que termine la animación anterior
            });
        }

        // 3. Animación de la sección contract-interactive
        tl.to(contractSection, {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power2.out"
        }, "-=0.8");

        // 4. Animación del botón know-more
        tl.to(knowMoreBtn, {
            scale: 1,
            opacity: 1,
            duration: 1,
            ease: "power2.out"
        }, "-=0.8");
    }

    // Verificar si estamos en la página que necesita la animación
    const contractAnimation = document.getElementById('contract-animation');
    
    if (contractAnimation && typeof lottie !== 'undefined') {
        var animation = lottie.loadAnimation({
            container: contractAnimation,
            renderer: 'svg',
            loop: false,
            autoplay: false,
            path: 'assets/contract_open.json'
        });

        if (contractSection) {
            contractSection.addEventListener('mouseenter', function() {
                animation.playSegments([0, animation.totalFrames], true);
            });

            contractSection.addEventListener('mouseleave', function() {
                animation.playSegments([animation.totalFrames, 0], true);
            });

            contractSection.addEventListener('click', () => {
                window.location.href = 'contract.html';
            });
        }
    }

    // Nuevo código para el modal
    const modal = document.getElementById('contract-modal');
    const closeBtn = document.querySelector('.close-button');
    const signInBtn = document.querySelector('.sign-in');

    if (knowMoreBtn && modal) {
        // Abrir modal
        knowMoreBtn.addEventListener('click', function() {
            modal.classList.add('show');
            modal.classList.remove('hide');
            modal.style.display = 'flex';
        });

        // Cerrar modal con el botón X
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                modal.classList.remove('show');
                modal.classList.add('hide');
                // Espera a que termine la animación antes de ocultar el modal
                setTimeout(() => {
                    modal.style.display = 'none';
                }, 250);
            });
        }

        // Cerrar modal al hacer clic fuera
        window.addEventListener('click', function(event) {
            if (event.target === modal) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });

        // Redirigir al hacer clic en Sign in
        if (signInBtn) {
            signInBtn.addEventListener('click', function() {
                window.location.href = 'contract.html';
            });
        }
    }
});

