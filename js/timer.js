document.addEventListener('DOMContentLoaded', function() {
    initializeWorkTimer();
    initializeTooltip();
    initializeClockAnimation();
});

function initializeWorkTimer() {
    // Usar un timestamp persistente para el inicio
    let startTimestamp = parseInt(localStorage.getItem('wlb_timer_start'));
    if (!startTimestamp) {
        startTimestamp = Date.now();
        localStorage.setItem('wlb_timer_start', startTimestamp);
    }

    function updateTime() {
        const timeElements = document.querySelectorAll('.time');
        const now = Date.now();
        const seconds = Math.floor((now - startTimestamp) / 1000);
        
        // Reiniciar cuando llegue a 8 minutos (480 segundos)
        if (seconds >= 480) {
            startTimestamp = Date.now();
            localStorage.setItem('wlb_timer_start', startTimestamp);
        }
        
        const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
        const secs = String(seconds % 60).padStart(2, '0');
        timeElements.forEach(timeElement => {
            timeElement.textContent = `${mins}:${secs}`;
        });
    }

    // Iniciar el timer
    updateTime();
    setInterval(updateTime, 1000);
}

function initializeTooltip() {
    // Intentar encontrar el contenedor del timer en cualquiera de las páginas
    const container = document.querySelector('.head-container-right') || 
                     document.querySelector('.timer-container');
    
    if (!container) return; // Si no encuentra ninguno, salir de la función
    
    let tooltip = null;

    // Crear el tooltip
    function createTooltip() {
        tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.innerHTML = container.dataset.tooltip;
        document.body.appendChild(tooltip);
    }

    // Actualizar posición del tooltip
    function updateTooltipPosition(e) {
        if (!tooltip) return;
        
        const offset = 15; // Distancia del cursor
        tooltip.style.left = `${e.clientX-80 + offset}px`;
        tooltip.style.top = `${e.clientY + offset}px`;
    }

    // Mostrar tooltip
    container.addEventListener('mouseenter', () => {
        createTooltip();
        tooltip.classList.add('visible');
    });

    // Actualizar posición mientras se mueve el ratón
    container.addEventListener('mousemove', (e) => {
        updateTooltipPosition(e);
    });

    // Ocultar y eliminar tooltip
    container.addEventListener('mouseleave', () => {
        if (tooltip) {
            tooltip.remove();
            tooltip = null;
        }
    });
}

function initializeClockAnimation() {
    // Destruir animaciones existentes para evitar duplicados
    lottie.destroy();

    if (window.innerWidth > 640) {
        // Animación para desktop/tablet
        const desktopClock = document.getElementById('clock-animation');
        if (desktopClock) {
            lottie.loadAnimation({
                container: desktopClock,
                renderer: 'svg',
                loop: true,
                autoplay: true,
                path: 'assets/clock_animation.json'
            });
        }
    } else {
        // Animación para móvil
        const mobileClock = document.getElementById('clock-animation-mobile');
        if (mobileClock) {
            lottie.loadAnimation({
                container: mobileClock,
                renderer: 'svg',
                loop: true,
                autoplay: true,
                path: 'assets/clock_animation.json'
            });
        }
    }
}

// Manejar cambios de tamaño de ventana con debounce
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        initializeClockAnimation();
    }, 250);
}); 