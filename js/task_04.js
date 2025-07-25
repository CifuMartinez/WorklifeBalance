const shapes = [
  '../assets/shape_01.svg', // La que debe destacar
  '../assets/shape_02.svg',
  '../assets/shape_03.svg',
  '../assets/shape_04.svg',
  '../assets/shape_05.svg'
];

const totalRows = 40;
const totalCols = 60;
const disruptiveCount = 20; // Puedes aumentar la cantidad de disruptivos

// Generar posiciones aleatorias para los disruptivos
const disruptivePositions = new Set();
while (disruptivePositions.size < disruptiveCount) {
  disruptivePositions.add(
    Math.floor(Math.random() * totalRows * totalCols)
  );
}

const container = document.getElementById('symbol-system');
const viewport = document.querySelector('.symbol-system-viewport');

// Parámetros de tamaño según el CSS
const cellSize = 40; // tamaño de celda (grid)
const gap = 4;       // gap entre celdas

// Cálculo del tamaño real del grid
const gridWidth = totalCols * cellSize + (totalCols - 1) * gap;
const gridHeight = totalRows * cellSize + (totalRows - 1) * gap;

// Cálculo del tamaño real del viewport
const viewportWidth = viewport.clientWidth;
const viewportHeight = viewport.clientHeight;

// Límites de desplazamiento para no dejar espacios en negro
const maxX = Math.min(0, viewportWidth - gridWidth);
const maxY = Math.min(0, viewportHeight - gridHeight);

let posX = 0, posY = 0;
const step = cellSize + gap;

let disruptivesLeft = disruptiveCount;

for (let i = 0; i < totalRows * totalCols; i++) {
  const div = document.createElement('div');
  div.classList.add('symbol-shape', 'animated');
  // Duración entre 1.2s y 2.2s, delay entre 0 y 1.5s
  div.style.animationDuration = (1.2 + Math.random()).toFixed(2) + 's';
  div.style.animationDelay = (Math.random() * 1.5).toFixed(2) + 's';
  let shapeSrc, isDisruptive = false;

  if (disruptivePositions.has(i)) {
    // Elegir un shape disruptivo diferente al principal (shape_01)
    const otherShapes = shapes.slice(1); // shapes[1] en adelante
    const randomIndex = Math.floor(Math.random() * otherShapes.length);
    shapeSrc = otherShapes[randomIndex];
    div.classList.add('disruptive');
    isDisruptive = true;
  } else {
    shapeSrc = shapes[0]; // shape_01 como shape principal
  }

  div.innerHTML = `<img src="${shapeSrc}" alt="shape" />`;
  if (isDisruptive) {
    div.addEventListener('click', function() {
      if (!div.classList.contains('clicked')) {
        div.style.opacity = 0.2;
        div.classList.remove('animated');
        div.classList.add('clicked');
        disruptivesLeft--;
        counter.textContent = `Disruptives: ${disruptivesLeft}`;
        // Reproducir sonido
        const audio = new Audio('../assets/Disruptive.wav');
        audio.volume = 0.3;
        audio.play();
        // Si se han encontrado todos los disruptivos
        if (disruptivesLeft === 0) {
          mostrarMensajeCompletado();
          marcarTareaCompletada('task_04');
          setTimeout(() => {
            // Animación de salida
            document.body.style.transition = 'opacity 0.7s';
            document.body.style.opacity = '0';
            setTimeout(() => {
              window.location.href = '../work.html';
            }, 700);
          }, 2500);
        }
      }
    });
  }
  container.appendChild(div);
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') posX = Math.max(posX - step, maxX);
  if (e.key === 'ArrowLeft')  posX = Math.min(posX + step, 0);
  if (e.key === 'ArrowDown')  posY = Math.max(posY - step, maxY);
  if (e.key === 'ArrowUp')    posY = Math.min(posY + step, 0);
  container.style.left = posX + 'px';
  container.style.top = posY + 'px';
  updateCounterVisibility();
});

// Para swipe en móvil, usa eventos touchstart/touchmove/touchend

viewport.addEventListener('wheel', function(e) {
  e.preventDefault(); // Evita el scroll normal de la página

  // Ajusta la sensibilidad si lo deseas
  const scrollStep = step / 2;

  // Movimiento horizontal
  if (e.deltaX !== 0) {
    posX = Math.max(Math.min(posX - e.deltaX, 0), maxX);
  }
  // Movimiento vertical
  if (e.deltaY !== 0) {
    posY = Math.max(Math.min(posY - e.deltaY, 0), maxY);
  }

  container.style.left = posX + 'px';
  container.style.top = posY + 'px';
  updateCounterVisibility();
}, { passive: false });

// Crear el contador flotante
const counter = document.createElement('div');
counter.className = 'symbol-counter';
counter.textContent = `Disruptives: ${disruptiveCount}`;
document.body.appendChild(counter);

function updateCounterVisibility() {
  // Si estamos en la esquina inferior (posY === maxY) y derecha (posX === maxX)
  if (posY === maxY && posX === maxX) {
    counter.style.opacity = '0';
    counter.style.pointerEvents = 'none';
  } else {
    counter.style.opacity = '1';
    counter.style.pointerEvents = 'auto';
  }
}

function marcarTareaCompletada(taskId) {
  let progreso = JSON.parse(localStorage.getItem('wlb_progress') || '{}');
  progreso[taskId] = true;
  localStorage.setItem('wlb_progress', JSON.stringify(progreso));
}

function mostrarMensajeCompletado() {
  // Mensaje visual
  const msg = document.createElement('div');
  msg.textContent = 'Anomaly Isolated!';
  msg.style.position = 'fixed';
  msg.style.top = '50%';
  msg.style.left = '50%';
  msg.style.transform = 'translate(-50%, -50%)';
  msg.style.background = '#f3eee8';
  msg.style.color = '#000000';
  msg.style.padding = '1.25rem';
  msg.style.fontSize = '1.2rem';
  msg.style.borderRadius = '1.8em';
  msg.style.zIndex = '100';
  msg.style.textAlign = 'center';
  document.body.appendChild(msg);
  setTimeout(() => { msg.remove(); }, 2000);

  // Audio siempre al completar la tarea
  const audioFinal = new Audio('../assets/Success_Final.wav');
  audioFinal.volume = 0.3;
  setTimeout(() => { audioFinal.play(); }, 400);
}
