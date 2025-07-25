document.addEventListener('DOMContentLoaded', function() {
    // Configurar estado inicial de los elementos
    gsap.set('.head-container', {
        opacity: 0
    });

    // Solo aplicar animaciones si no es móvil
    if (window.innerWidth > 640) {
        gsap.set('.platform-box', {
            opacity: 0,
            x: -20
        });

        // Crear timeline para la secuencia de animaciones
        const tl = gsap.timeline();

        // Animación del header
        tl.to('.head-container', {
            opacity: 1,
            duration: 2,
            delay: 0.5,
            ease: "power2.out"
        })
        // Animación de las platform-boxes
        .to('.platform-box', {
            opacity: 1,
            x: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: "bezier.out(0.16, 1, 0.3, 1)"
        }, "-=1.5");
    } else {
        // En móvil, solo mostrar los elementos sin animación
        gsap.set('.head-container', { opacity: 1 });
        gsap.set('.platform-box', { opacity: 1 });
    }

    updateProgressBars();
    initializeBoxInteraction();
    initializeMobileBoxes();
});

function getProgressPercentage() {
    const progreso = JSON.parse(localStorage.getItem('wlb_progress') || '{}');
    const total = 5;
    let completadas = 0;
    ['task_01', 'task_02', 'task_03', 'task_04', 'task_05'].forEach(t => {
        if (progreso[t]) completadas++;
    });
    return Math.min(100, Math.round((completadas / total) * 100));
}

function updateProgressBars() {
    const progressContainers = document.querySelectorAll('.progress-percentage');
    const percentage = getProgressPercentage();

    progressContainers.forEach(container => {
        const numberElement = container.querySelector('.progress-percentage-number');
        const progressFill = container.querySelector('.progress-fill');
        
        if (numberElement && progressFill) {
            numberElement.textContent = `${percentage}%`;
            progressFill.style.width = `${percentage}%`;
        }
    });
}

function initializeBoxInteraction() {
    // Excellent -> Work Box
    const excellentButton = document.querySelector('.mood-state:has(.excelent)');
    const goodButton = document.querySelector('.mood-state.good');
    const unmotivatedButton = document.querySelector('.mood-state.unmotivated');
    
    const breatheBox = document.querySelector('.breathe-box');
    const workBox = document.querySelector('.work-box');
    const inspirationBox = document.querySelector('.inspiration-box');

    // Add click event for breathe button in both desktop and mobile layouts
    const breatheButtons = document.querySelectorAll('.breathe');
    breatheButtons.forEach(button => {
        button.addEventListener('click', () => {
            window.location.href = 'relaxation.html';
        });
    });

    // Add click event for inspiration button
    const inspirationButton = document.querySelector('button.inspiration');
    if (inspirationButton) {
        inspirationButton.addEventListener('click', () => {
            window.location.href = 'manifesto.html';
        });
    }

    // Add click event for work button
    const workButton = document.querySelector('button.work');
    if (workButton) {
        workButton.addEventListener('click', () => {
            window.location.href = 'work.html';
        });
    }

    // Excellent -> Work Box
    excellentButton.addEventListener('mouseenter', () => {
        breatheBox.style.opacity = '0.2';
        inspirationBox.style.opacity = '0.2';
        workBox.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
    });

    excellentButton.addEventListener('mouseleave', () => {
        breatheBox.style.opacity = '';
        inspirationBox.style.opacity = '';
        workBox.style.backgroundColor = '';
    });

    // Good -> Inspiration Box
    goodButton.addEventListener('mouseenter', () => {
        breatheBox.style.opacity = '0.2';
        workBox.style.opacity = '0.2';
        inspirationBox.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
    });

    goodButton.addEventListener('mouseleave', () => {
        breatheBox.style.opacity = '';
        workBox.style.opacity = '';
        inspirationBox.style.backgroundColor = '';
    });

    // Unmotivated -> Breathe Box
    unmotivatedButton.addEventListener('mouseenter', () => {
        workBox.style.opacity = '0.2';
        inspirationBox.style.opacity = '0.2';
        breatheBox.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
    });

    unmotivatedButton.addEventListener('mouseleave', () => {
        workBox.style.opacity = '';
        inspirationBox.style.opacity = '';
        breatheBox.style.backgroundColor = '';
    });
}

/*ESTADOS PARA MÓVIL DE PLATFORM BOX*/
function initializeMobileBoxes() {
    if (window.innerWidth <= 640) {
        const platformBoxes = document.querySelectorAll('.platform-box');
        
        // Expandir la primera box por defecto
        platformBoxes[0]?.classList.add('expanded');

        platformBoxes.forEach((box, index) => {
            // Añadir click al box completo
            box.addEventListener('click', (e) => {
                handleBoxClick(e, box, platformBoxes);
            });

            // Añadir click específico al toggle
            const toggle = box.querySelector('.toggle-icon');
            if (toggle) {
                toggle.addEventListener('click', (e) => {
                    e.stopPropagation(); // Prevenir doble activación
                    handleBoxClick(e, box, platformBoxes);
                });
            }
        });
    }
}

function handleBoxClick(e, clickedBox, allBoxes) {
    // Si ya está expandida, no hacer nada
    if (clickedBox.classList.contains('expanded')) {
        return;
    }

    // Colapsar todas las boxes
    allBoxes.forEach(box => {
        if (box !== clickedBox) {
            box.classList.remove('expanded');
        }
    });

    // Expandir la box clickeada
    clickedBox.classList.add('expanded');
}



