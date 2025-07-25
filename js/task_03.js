// Palabras y clasificación
const palabras = [
  { texto: 'system trust', tipo: 'corporativa' },
  { texto: 'self-expression', tipo: 'no-corporativa' },
  { texto: 'curiosity', tipo: 'no-corporativa' },
  { texto: 'productive repetition', tipo: 'corporativa' },
  { texto: 'absence of doubt', tipo: 'corporativa' },
  { texto: 'identity', tipo: 'no-corporativa' },
  { texto: 'efficiency', tipo: 'corporativa' },
  { texto: 'choice', tipo: 'no-corporativa' },
  { texto: 'autonomy', tipo: 'no-corporativa' },
  { texto: 'desire', tipo: 'no-corporativa' },
  { texto: 'emotion', tipo: 'no-corporativa' },
  { texto: 'professional growth', tipo: 'corporativa' },
  { texto: 'individualism', tipo: 'no-corporativa' },
  { texto: 'spontaneity', tipo: 'no-corporativa' },
  { texto: 'time discipline', tipo: 'corporativa' },
];

let indice = 0;

// Audios
const audioSuccess = new Audio('../assets/Success.wav');
const audioError = new Audio('../assets/Error.wav');
const audioFinal = new Audio('../assets/Success_Final.wav');

audioSuccess.volume = 0.25;
audioError.volume = 0.25;
audioFinal.volume = 0.25;

function renderPalabras() {
  const ul = document.getElementById('classifier-list');
  ul.innerHTML = '';
  palabras.forEach((palabra, i) => {
    const li = document.createElement('li');
    li.className = 'classifier-word' + (i === indice ? ' active' : '');
    li.textContent = palabra.texto;
    ul.appendChild(li);
  });
  actualizarAnimacion();
}

function actualizarAnimacion() {
  const ul = document.getElementById('classifier-list');
  const container = document.querySelector('.classifier-list-container');
  const visibleHeight = container ? container.offsetHeight : 220;
  // Calcular altura real de la palabra activa
  const active = ul.querySelector('.classifier-word.active');
  const palabraHeight = active ? active.offsetHeight : 56;
  // Calcular el gap real entre palabras (gap en px)
  let gap = 0;
  if (ul.children.length > 1) {
    const first = ul.children[0];
    const second = ul.children[1];
    gap = second.offsetTop - first.offsetTop - first.offsetHeight;
    if (gap < 0) gap = 0;
  }
  const totalHeight = palabraHeight + gap;
  // Centrar la palabra activa en el contenedor
  const offset = (visibleHeight / 2) - (palabraHeight / 2) - (indice * totalHeight);
  ul.style.transform = `translateY(${offset}px)`;
}

function mostrarExito() {
  const msg = document.getElementById('classifier-success');
  if (msg) {
    msg.style.display = '';
    msg.classList.add('show');
  }
  marcarTareaCompletada('task_03');
  setTimeout(() => {
    // Animación de salida
    document.body.style.transition = 'opacity 0.7s';
    document.body.style.opacity = '0';
    setTimeout(() => {
      window.location.href = '../work.html';
    }, 700);
  }, 2000);
}

function marcarTareaCompletada(taskId) {
  let progreso = JSON.parse(localStorage.getItem('wlb_progress') || '{}');
  progreso[taskId] = true;
  localStorage.setItem('wlb_progress', JSON.stringify(progreso));
}

function reiniciarJuego() {
  indice = 0;
  const msg = document.getElementById('classifier-success');
  if (msg) {
    msg.classList.remove('show');
    msg.style.display = '';
  }
  renderPalabras();
}

function avanzar(tipo) {
  if (palabras[indice].tipo === tipo) {
    indice++;
    if (indice >= palabras.length) {
      audioFinal.currentTime = 0;
      audioFinal.play();
      mostrarExito();
      return;
    }
    audioSuccess.currentTime = 0;
    audioSuccess.play();
    renderPalabras();
  } else {
    audioError.currentTime = 0;
    audioError.play();
    reiniciarJuego();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  renderPalabras();
  document.getElementById('btn-corporate').onclick = () => avanzar('corporativa');
  document.getElementById('btn-non-corporate').onclick = () => avanzar('no-corporativa');
});

window.addEventListener('resize', () => {
  renderPalabras();
});
