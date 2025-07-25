// Elementos del DOM
const taskContent = document.querySelector('.task-content');
const questionButton = document.querySelector('.group-button.question');
const popup = document.querySelector('.description-popup');
const overlay = document.querySelector('.description-overlay');
const closeButton = popup.querySelector('.close-popup');
const taskCloseButton = document.querySelector('.task-content .task-close-container');

// Función para la animación de entrada
function fadeInPage() {
    // Removemos cualquier clase de animación previa
    taskContent.classList.remove('fade-in', 'fade-out');
    
    // Forzamos un reflow
    void taskContent.offsetWidth;
    
    // Iniciamos la animación de entrada
    requestAnimationFrame(() => {
        taskContent.classList.add('fade-in');
    });
}

// Función para la animación de salida
function fadeOutPage(callback) {
    taskContent.classList.remove('fade-in');
    taskContent.classList.add('fade-out');
    
    // Esperamos a que termine la animación
    taskContent.addEventListener('animationend', () => {
        if (callback) callback();
    }, { once: true });
}

// Función para mostrar el popup
function showPopup() {
    popup.classList.add('active');
    overlay.classList.add('active');
}

// Función para ocultar el popup
function hidePopup() {
    popup.classList.remove('active');
    overlay.classList.remove('active');
}

// Event listeners para el popup de descripción
questionButton.addEventListener('click', showPopup);
closeButton.addEventListener('click', hidePopup);
overlay.addEventListener('click', hidePopup);

// Cerrar con la tecla ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        hidePopup();
    }
});

// Cerrar la tarea completa con animación
taskCloseButton.addEventListener('click', () => {
    fadeOutPage(() => {
        window.location.href = '../work.html';
    });
});

// Iniciar la animación de entrada cuando se carga la página
document.addEventListener('DOMContentLoaded', fadeInPage);
