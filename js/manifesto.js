document.addEventListener('DOMContentLoaded', () => {
    // Registrar el plugin ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    const manifestoItems = document.querySelectorAll('.manifesto-item');
    gsap.set(manifestoItems, { opacity: 0 });

    // Refrescar ScrollTrigger tras cargar todas las imágenes de manifesto-item
    const images = document.querySelectorAll('.manifesto-item img');
    let loaded = 0;
    images.forEach(img => {
        if (img.complete) {
            loaded++;
            if (loaded === images.length) ScrollTrigger.refresh();
        } else {
            img.addEventListener('load', () => {
                loaded++;
                if (loaded === images.length) ScrollTrigger.refresh();
            });
        }
    });

    const isMobile = () => window.innerWidth < 768;

    const setupAnimation = () => {
        if (isMobile()) {
            manifestoItems.forEach((item) => {
                gsap.to(item, {
                    scrollTrigger: {
                        trigger: item,
                        start: "top 80%",
                        toggleActions: "play none none none",
                        once: true,
                        scroller: ".manifesto-container"
                    },
                    opacity: 1,
                    duration: 1.5,
                    ease: "power2.out"
                });
            });
            setTimeout(() => ScrollTrigger.refresh(), 500);
        } else {
            const tl = gsap.timeline();
            tl.to(manifestoItems, {
                opacity: 1,
                duration: 2,
                ease: "power2.out",
                stagger: 0.4
            });
        }
    };

    setupAnimation();

    window.addEventListener('resize', () => {
        gsap.killTweensOf(manifestoItems);
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        gsap.set(manifestoItems, { opacity: 0 });
        setupAnimation();
    });

    window.addEventListener('load', () => {
        ScrollTrigger.refresh();
    });

    // Cargar la animación Lottie
    const container = document.getElementById('manifesto-door');
    let animation = null;

    // Función para cargar la animación
    function loadAnimation() {
        // Destruir la animación anterior si existe
        if (animation) {
            animation.destroy();
        }

        // Crear nueva instancia de la animación
        animation = lottie.loadAnimation({
            container: container,
            renderer: 'svg',
            loop: false,
            autoplay: false,
            path: 'assets/open-eyes_door/open-eyes_door.json',
            name: 'manifesto-door-animation'
        });

        // Manejar errores de carga
        animation.addEventListener('data_failed', () => {
            console.error('Error al cargar la animación');
            container.classList.add('hidden');
        });

        // Manejar carga exitosa
        animation.addEventListener('data_ready', () => {
            console.log('Animación cargada correctamente');
            container.classList.remove('hidden');
            animation.play();
        });
    }

    // Cargar la animación después de 5 segundos
    setTimeout(loadAnimation, 5000);

    // Manejar el clic en la animación
    container.addEventListener('click', () => {
        if (animation) {
            animation.destroy(); // Limpiar la animación antes de redirigir
        }
        window.location.href = 'truth.html?section=1';
    });

    // Limpiar la animación cuando se desmonte el componente
    window.addEventListener('beforeunload', () => {
        if (animation) {
            animation.destroy();
        }
    });
});