// task_01.js

// Palabras y asociaciones (pares correctos)
const asociaciones = [
    { id: 1, palabra: 'Efficiency', pareja: 2 },
    { id: 2, palabra: 'Waste', pareja: 1 },
    { id: 3, palabra: 'Obedience', pareja: 4 },
    { id: 4, palabra: 'Autonomy', pareja: 3 },
    { id: 5, palabra: 'Harmony', pareja: 6 },
    { id: 6, palabra: 'Conflict', pareja: 5 },
    { id: 7, palabra: 'Silence', pareja: 8 },
    { id: 8, palabra: 'Expression', pareja: 7 },
    { id: 9, palabra: 'Commitment', pareja: 10 },
    { id: 10, palabra: 'Ambivalence', pareja: 9 },
    { id: 11, palabra: 'Severance', pareja: 12 },
    { id: 12, palabra: 'Identity', pareja: 11 },
];

// Mezclar las palabras para mostrar
function mezclar(array) {
    return array
        .map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);
}

const container = document.querySelector('.task-container');

let seleccion = [];
let bloqueadas = [];

// Variables globales para el orden y posiciones
let palabrasMezcladasGlobal = mezclar(asociaciones);
let posicionesGlobales = [];

// Conexiones
let conexionesCorrectas = []; // [{id1, id2, x1, y1, x2, y2}]
let conexionTemporal = null;

// Calcula posiciones solo una vez al cargar la página
function calcularPosiciones() {
    posicionesGlobales = [];
    const cajas = [];
    // Crear cajas ocultas para medir
    palabrasMezcladasGlobal.forEach(({ id, palabra }) => {
        const box = document.createElement('button');
        box.className = 'asociacion-box';
        box.textContent = palabra;
        box.style.visibility = 'hidden';
        box.style.position = 'absolute';
        box.style.left = '0px';
        box.style.top = '0px';
        container.appendChild(box);
        cajas.push(box);
    });

    // Esperar dos frames para medir bien
    return new Promise(resolve => {
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                const contRect = container.getBoundingClientRect();
                const contW = contRect.width;
                const contH = contRect.height;
                const margen = 4;
                cajas.forEach((box, i) => {
                    const maxIntentos = 200;
                    let intentos = 0;
                    let left, top, solapa;
                    const boxRect = box.getBoundingClientRect();
                    const boxW = boxRect.width;
                    const boxH = boxRect.height;
                    const maxLeft = Math.max(margen, contW - boxW - margen);
                    const maxTop = Math.max(margen, contH - boxH - margen);
                    do {
                        left = Math.random() * maxLeft;
                        top = Math.random() * maxTop;
                        solapa = posicionesGlobales.some(pos => {
                            return !(
                                left + boxW < pos.left ||
                                left > pos.left + pos.width ||
                                top + boxH < pos.top ||
                                top > pos.top + pos.height
                            );
                        });
                        intentos++;
                    } while (solapa && intentos < maxIntentos);
                    posicionesGlobales.push({ left, top, width: boxW, height: boxH });
                });
                // Elimina las cajas ocultas
                cajas.forEach(box => box.remove());
                resolve();
            });
        });
    });
}

function actualizarContador() {
    const contador = document.querySelector('.asociaciones-contador');
    const total = asociaciones.length / 2;
    const completadas = bloqueadas.length / 2;
    contador.textContent = `Completed ${ completadas}/${total}`;
}

function getBoxCenter(box) {
    const rect = box.getBoundingClientRect();
    const contRect = container.getBoundingClientRect();
    return {
        x: rect.left - contRect.left + rect.width / 2,
        y: rect.top - contRect.top + rect.height / 2
    };
}

function getCablePath(x1, y1, x2, y2) {
    // Calcula el desplazamiento para la ondulación
    const dx = x2 - x1;
    const dy = y2 - y1;
    // Punto de control 1 (cerca del inicio, desplazado)
    const cx1 = x1 + dx * 0.25 + (Math.abs(dy) > Math.abs(dx) ? 0 : 30 * Math.sign(dy));
    const cy1 = y1 + dy * 0.25 + (Math.abs(dx) > Math.abs(dy) ? 0 : 30 * Math.sign(dx));
    // Punto de control 2 (cerca del final, desplazado)
    const cx2 = x1 + dx * 0.75 - (Math.abs(dy) > Math.abs(dx) ? 0 : 30 * Math.sign(dy));
    const cy2 = y1 + dy * 0.75 - (Math.abs(dx) > Math.abs(dy) ? 0 : 30 * Math.sign(dx));
    return `M${x1},${y1} C${cx1},${cy1} ${cx2},${cy2} ${x2},${y2}`;
}

function renderConexiones() {
    const svg = document.querySelector('.asociaciones-svg');
    svg.innerHTML = '';
    // Líneas correctas (cables)
    conexionesCorrectas.forEach(({x1, y1, x2, y2}) => {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', getCablePath(x1, y1, x2, y2));
        path.setAttribute('stroke', '#84c269'); // color cable oscuro
        path.setAttribute('stroke-width', '2');
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke-linecap', 'round');
        svg.appendChild(path);
    });
    // Línea temporal (cable rojo)
    if (conexionTemporal) {
        const {x1, y1, x2, y2, color} = conexionTemporal;
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', getCablePath(x1, y1, x2, y2));
        path.setAttribute('stroke', color || '#bfdfad');
        path.setAttribute('stroke-width', '2');
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke-linecap', 'round');
        svg.appendChild(path);
    }
}

function renderPalabras() {
    container.innerHTML = '';
    // Asegurarse de que el SVG esté presente
    let svg = document.querySelector('.asociaciones-svg');
    if (!svg) {
        svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.classList.add('asociaciones-svg');
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');
        container.appendChild(svg);
    }
    palabrasMezcladasGlobal.forEach(({ id, palabra }, i) => {
        const box = document.createElement('button');
        box.className = 'asociacion-box';
        box.textContent = palabra;
        box.disabled = bloqueadas.includes(id);
        box.dataset.id = id;
        box.addEventListener('click', handleSeleccion);
        // Usa la posición calculada
        const pos = posicionesGlobales[i];
        box.style.position = 'absolute';
        box.style.left = pos.left + 'px';
        box.style.top = pos.top + 'px';
        container.appendChild(box);
    });
    actualizarContador();
    renderConexiones();
    // Mostrar mensaje si está completado
    const total = asociaciones.length / 2;
    const completadas = bloqueadas.length / 2;
    if (completadas === total) {
        marcarTareaCompletada('task_01');
        mostrarMensajeCompletado();
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

function handleSeleccion(e) {
    const id = parseInt(e.target.dataset.id);
    const box = e.target;
    if (seleccion.length === 0) {
        seleccion.push(id);
        box.classList.add('seleccionada');
    } else if (seleccion.length === 1 && seleccion[0] !== id) {
        seleccion.push(id);
        box.classList.add('seleccionada');
        // Dibuja línea temporal
        const box1 = document.querySelector(`.asociacion-box[data-id='${seleccion[0]}']`);
        const box2 = document.querySelector(`.asociacion-box[data-id='${seleccion[1]}']`);
        const {x: x1, y: y1} = getBoxCenter(box1);
        const {x: x2, y: y2} = getBoxCenter(box2);
        conexionTemporal = {x1, y1, x2, y2, color: '#bfdfad'};
        renderConexiones();
        comprobarAsociacion();
    }
}

function comprobarAsociacion() {
    const [id1, id2] = seleccion;
    const palabra1 = asociaciones.find(a => a.id === id1);
    const box1 = document.querySelector(`.asociacion-box[data-id='${id1}']`);
    const box2 = document.querySelector(`.asociacion-box[data-id='${id2}']`);
    const {x: x1, y: y1} = getBoxCenter(box1);
    const {x: x2, y: y2} = getBoxCenter(box2);

    if (palabra1.pareja === id2) {
        bloqueadas.push(id1, id2);
        conexionesCorrectas.push({id1, id2, x1, y1, x2, y2});
        setTimeout(() => {
            conexionTemporal = null;
            renderPalabras();
            renderConexiones();
            seleccion = [];
        }, 600);
    } else {
        setTimeout(() => {
            conexionTemporal = null;
            renderConexiones();
            document.querySelectorAll('.asociacion-box').forEach(box => {
                box.classList.remove('seleccionada');
            });
            seleccion = [];
        }, 600);
    }
}

// Inicializa posiciones y renderiza
calcularPosiciones().then(renderPalabras);

function marcarTareaCompletada(taskId) {
    let progreso = JSON.parse(localStorage.getItem('wlb_progress') || '{}');
    progreso[taskId] = true;
    localStorage.setItem('wlb_progress', JSON.stringify(progreso));
}

function mostrarMensajeCompletado() {
    // Mensaje visual
    const msg = document.createElement('div');
    msg.textContent = 'Alignment Achieved!';
    msg.style.position = 'fixed';
    msg.style.top = '50%';
    msg.style.left = '50%';
    msg.style.transform = 'translate(-50%, -50%)';
    msg.style.background = '#232823';
    msg.style.color = '#bfdfad';
    msg.style.padding = '1rem 1.5rem';
  msg.style.fontSize = '1.2rem';
  msg.style.borderRadius = '1.8em';
  msg.style.zIndex = '100';
    msg.style.textAlign = 'center';
    document.body.appendChild(msg);
    setTimeout(() => { msg.remove(); }, 2000);

    // Audio siempre al completar la tarea
    const audioFinal = new Audio('../assets/Success_Final.wav');
    audioFinal.volume = 0.5;
    setTimeout(() => { audioFinal.play(); }, 400);
} 