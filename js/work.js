document.addEventListener('DOMContentLoaded', function() {
    const foldersContainer = document.querySelector('.folders-container');
    const folders = Array.from(document.querySelectorAll('.folder'));
    const slides = Array.from(document.querySelectorAll('.slide'));
    const arrowUp = document.querySelector('.arrow-up');
    const arrowDown = document.querySelector('.arrow-down');
    const progressLines = document.querySelectorAll('.line-percentage');
    const numberPercentage = document.querySelector('.number-percentage');
    
    const progressBadges = document.querySelectorAll('.badget-progress .badge');
    const earnedBadges = document.querySelectorAll('.badges-grid .badge');
    
    let currentIndex = 2;
    const folderHeight = 300;
    let isScrolling = false;
    let touchStartX = 0;
    let touchEndX = 0;
    
    const badgeColors = {
        1: 'var(--green-light)',
        2: 'var(--skin-light)',
        3: 'var(--blue-light)',
        4: 'var(--pink-light)',
        5: 'var(--purple-light)',
        6: 'var(--yellow-light)'
    };
    
    function updateBadges(percentage) {
        const isMobile = window.innerWidth <= 1024;
        const badgeThresholds = [20, 40, 60, 80, 90, 100];
        
        // Orden diferente según el viewport
        const gridOrder = isMobile ? 
            [6, 5, 4, 3, 2, 1] : // Orden secuencial para móvil
            [4, 6, 2, 5, 1, 3];  // Orden original para desktop
        
        Array.from(progressBadges).reverse().forEach((badge, index) => {
            const shouldBeActive = percentage >= badgeThresholds[index];
            const badgeNumber = progressBadges.length - index;
            const badgeContainer = badge.closest('.badge-container');
            
            if (shouldBeActive) {
                badge.src = `assets/Badge_${badgeNumber}_done.svg`;
                if (badgeContainer) {
                    badgeContainer.style.border = `1px solid #282828`;
                    badgeContainer.style.opacity = '0.8';
                }
            } else {
                badge.src = `assets/Badge_${badgeNumber}.svg`;
                if (badgeContainer) {
                    badgeContainer.style.border = 'none';
                }
            }
            
            // Actualizar los badges en la cuadrícula usando el orden correspondiente
            const gridIndex = gridOrder.indexOf(badgeNumber);
            if (gridIndex !== -1 && earnedBadges[gridIndex]) {
                const earnedBadgeContainer = earnedBadges[gridIndex].closest('.badge-container');
                if (shouldBeActive) {
                    earnedBadges[gridIndex].src = `assets/Badge_${badgeNumber}_done.svg`;
                    if (earnedBadgeContainer) {
                        earnedBadgeContainer.style.border = `1px solid ${badgeColors[badgeNumber]}`;
                    }
                } else {
                    earnedBadges[gridIndex].src = `assets/Badge_${badgeNumber}.svg`;
                    if (earnedBadgeContainer) {
                        earnedBadgeContainer.style.border = '1px solid #282828';
                    }
                }
            }
        });
    }
    
    function showCompletionModal() {
        const modal = document.querySelector('.completion-modal');
        if (!modal) return;
        
        // Mostrar y animar el modal
        modal.classList.add('active');
    }
    
    function updateProgressBar() {
        const isMobile = window.innerWidth <= 1024;
        // Calcula el porcentaje real desde wlb_progress
        const porcentaje = getProgressPercentage(); 
        
        // Mostrar modal cuando se alcance el 100%
        if (porcentaje === 100) {
            setTimeout(showCompletionModal, 500);
        }
        
        // Seleccionar el contenedor activo según el viewport
        const activeContainer = isMobile ? 
            document.querySelector('.progress-bar-container.phone') : 
            document.querySelector('.progress-bar-container.desktop');
        
        if (!activeContainer) return;
        
        // Actualizar el número de porcentaje y el span en el contenedor activo
        const activeNumberPercentage = activeContainer.querySelector('.number-percentage');
        if (activeNumberPercentage) {
            activeNumberPercentage.innerHTML = `${porcentaje}<span>%</span>`;
        }
        
        // Obtener y actualizar las líneas del contenedor activo
        const progressLines = activeContainer.querySelectorAll('.line-percentage');
        const totalLines = 20; // Total de líneas para representar 100%
        const activeLines = Math.floor((porcentaje / 100) * totalLines);
        
        // Convertir a array y aplicar reverse solo para desktop
        let linesArray = Array.from(progressLines);
        if (!isMobile) {
            linesArray = linesArray.reverse();
        }
        
        linesArray.forEach((line, index) => {
            line.style.transition = `background-color 0.5s ease ${index * 0.1}s`;
            
            if (index < activeLines) {
                line.style.background = 'var(--green-light)';
                line.style.transform = 'scaleX(1)';
            } else {
                line.style.background = 'transparent';
                line.style.transform = 'scaleX(0.95)';
            }
        });
        
        // Actualizar los badges basados en el mismo porcentaje
        updateBadges(porcentaje);
    }

    function updateSlider() {
        const isMobile = window.innerWidth <= 1024;
        
        if (isMobile) {
            const slideDistance = 290; // Ancho de carpeta + gap
            const containerWidth = foldersContainer.offsetWidth;
        const centerOffset = (containerWidth - slideDistance) / 2;
        const translateX = -(currentIndex * slideDistance) + centerOffset;
            
            // Establecer gap consistente
            foldersContainer.style.transition = 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
            foldersContainer.style.transform = `translateX(${translateX+25}px)`;
            
            folders.forEach((folder, index) => {
                folder.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease';
                folder.classList.remove('active');
                folder.style.transform = 'scale(0.8)';
                
                const documentFolder = folder.querySelector('.document-folder');
                
                if (index === currentIndex) {
                    folder.classList.add('active');
                    folder.style.transform = 'scale(1)';
                    if (documentFolder) {
                        documentFolder.style.visibility = 'visible';
                        documentFolder.style.opacity = '1';
                    }
                } else {
                    if (documentFolder) {
                        documentFolder.style.visibility = 'hidden';
                        documentFolder.style.opacity = '0';
                    }
                }
                
                if (index < slides.length) {
                    slides[index].style.background = index === currentIndex 
                        ? 'var(--green-light)' 
                        : 'transparent';
                }
            });
        } else {
            // Restablecer el gap para desktop
            foldersContainer.style.gap = '';
            
            const offset = window.innerHeight / 2;
            const translateY = -(currentIndex * folderHeight) + offset;
            
            // Agregar transición suave para el contenedor
            foldersContainer.style.transition = 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
            foldersContainer.style.transform = `translateY(${translateY+130}px)`;
            
            folders.forEach((folder, index) => {
                // Agregar transiciones suaves para cada carpeta
                folder.style.transition = 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
                folder.classList.remove('active');
                folder.style.transform = 'scale(0.8) translateY(0)';
                folder.style.opacity = '0.5';
                
                const documentFolder = folder.querySelector('.document-folder');
                
                if (index === currentIndex) {
                    folder.classList.add('active');
                    folder.style.transform = 'scale(1) translateY(0)';
                    folder.style.opacity = '1';
                    if (documentFolder) {
                        documentFolder.style.visibility = 'visible';
                        documentFolder.style.opacity = '1';
                        documentFolder.style.transition = 'visibility 0.3s, opacity 0.3s';
                    }
                } else {
                    if (documentFolder) {
                        documentFolder.style.visibility = 'hidden';
                        documentFolder.style.opacity = '0';
                        documentFolder.style.transition = 'visibility 0.3s, opacity 0.3s';
                    }
                }
                
                if (index < slides.length) {
                    slides[index].style.transition = 'background-color 0.3s ease';
                    slides[index].style.background = index === currentIndex 
                        ? 'var(--green-light)' 
                        : 'transparent';
                }
            });
        }
        
        setTimeout(() => {
            isScrolling = false;
        }, 800);
    }

    function handleScroll(event) {
        if (isScrolling) return;
        
        const isMobile = window.innerWidth <= 1024;
        const delta = isMobile ? Math.sign(event.deltaX) : Math.sign(event.deltaY);
        
        if (delta > 0 && currentIndex < folders.length - 1) {
            isScrolling = true;
            currentIndex++;
            updateSlider();
        } else if (delta < 0 && currentIndex > 0) {
            isScrolling = true;
            currentIndex--;
            updateSlider();
        }
    }

    foldersContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
    });

    foldersContainer.addEventListener('touchmove', (e) => {
        touchEndX = e.touches[0].clientX;
    });

    foldersContainer.addEventListener('touchend', () => {
        if (!isScrolling && window.innerWidth <= 1024) {
            const swipeDistance = touchEndX - touchStartX;
            if (Math.abs(swipeDistance) > 50) {
                if (swipeDistance > 0 && currentIndex > 0) {
                    isScrolling = true;
                    currentIndex--;
                    updateSlider();
                } else if (swipeDistance < 0 && currentIndex < folders.length - 1) {
                    isScrolling = true;
                    currentIndex++;
                    updateSlider();
                }
            }
        }
    });

    arrowUp.addEventListener('click', () => {
        if (!isScrolling && currentIndex > 0) {
            isScrolling = true;
            currentIndex--;
            updateSlider();
        }
    });
    
    arrowDown.addEventListener('click', () => {
        if (!isScrolling && currentIndex < folders.length - 1) {
            isScrolling = true;
            currentIndex++;
            updateSlider();
        }
    });

    window.addEventListener('wheel', handleScroll);
    window.addEventListener('resize', updateSlider);
    window.addEventListener('resize', updateProgressBar);

    updateSlider();
    updateProgressBar();

    // Función para manejar el clic en las carpetas
    function handleFolderClick(e) {
        if (!e.currentTarget.classList.contains('folder')) return;
        
        // Prevenir la navegación por defecto
        e.preventDefault();
        
        // Obtener el enlace
        const href = e.currentTarget.getAttribute('href');
        if (!href) return;
        
        // Agregar la clase de animación
        e.currentTarget.classList.add('clicked');
        
        // Esperar a que termine la animación antes de navegar
        setTimeout(() => {
            window.location.href = href;
        }, 600); // Mismo tiempo que la animación
    }

    // Agregar el event listener a todas las carpetas que son enlaces
    document.querySelectorAll('.folder[href]').forEach(folder => {
        folder.addEventListener('click', handleFolderClick);
    });

    // NUEVO: Leer progreso de localStorage y calcular porcentaje
    function getProgressPercentage() {
        const progreso = JSON.parse(localStorage.getItem('wlb_progress') || '{}');
        const total = 5;
        let completadas = 0;
        ['task_01', 'task_02', 'task_03', 'task_04', 'task_05'].forEach(t => {
            if (progreso[t]) completadas++;
        });
        return Math.min(100, Math.round((completadas / total) * 100));
    }

    // Al cargar, actualizar la barra de progreso y badges
    const porcentaje = getProgressPercentage();
    const percentageElements = document.querySelectorAll('.number-percentage');
    percentageElements.forEach(element => {
        element.innerHTML = `${porcentaje}<span>%</span>`;
    });
    updateProgressBar();

    // Actualizar el estado de cada carpeta según el progreso
    const progreso = JSON.parse(localStorage.getItem('wlb_progress') || '{}');
    const folderIds = ['task_01', 'task_02', 'task_03', 'task_04', 'task_05'];
    document.querySelectorAll('.folders-container .folder').forEach((folder, i) => {
        const h2 = folder.querySelector('h2.folder-progress');
        if (h2) {
            if (progreso[folderIds[i]]) {
                h2.textContent = 'Completed';
                folder.classList.add('locked');
            } else {
                h2.textContent = 'Waiting...';
                folder.classList.remove('locked');
            }
        }
    });

    function resetProgress() {
        localStorage.removeItem('wlb_progress');
        location.reload();
    }

    // Atajo de teclado para reiniciar progreso (Ctrl+Alt+R)
    window.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key.toLowerCase() === 'r') {
            resetProgress();
        }
    });

    // Atajo con barra espaciadora para completar todas las tareas
    window.addEventListener('keydown', function(e) {
        if (e.code === 'Space' && e.ctrlKey) {
            // Marcar todas las carpetas como completadas
            const progreso = {};
            ['task_01', 'task_02', 'task_03', 'task_04', 'task_05'].forEach(taskId => {
                progreso[taskId] = true;
            });
            localStorage.setItem('wlb_progress', JSON.stringify(progreso));
            
            // Actualizar la interfaz
            document.querySelectorAll('.folders-container .folder').forEach((folder, i) => {
                const h2 = folder.querySelector('h2.folder-progress');
                if (h2) {
                    h2.textContent = 'Completed';
                    folder.classList.add('locked');
                }
            });
            
            // Actualizar la barra de progreso y mostrar el modal
            updateProgressBar();
        }
    });

    const modal = document.querySelector('.completion-modal');
    if (modal) {
        const closeButton = modal.querySelector('.close-modal');
        if (closeButton) {
            closeButton.addEventListener('click', resetProgress);
        }
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                resetProgress();
        }
    });
    }
});
