document.addEventListener('DOMContentLoaded', function() {
  // Configuración de los ejercicios
  const ejercicios = [
    {
      id: 'task-1',
      orden: ["Company Needs", "Team Goals", "Work Responsibilities", "Individual Opinions", "Personal Preferences"]
    },
    {
      id: 'task-2',
      orden: ["Following Rules", "Workplace Harmony", "Emotional Neutrality", "Recognized Effort", "Personal Desire"]
    },
    {
      id: 'task-3',
      orden: ["Results", "Deadlines", "Attitude", "Feelings", "Mental Health"]
    }
  ];
  let ejercicioActual = 0;
  const INSIGHT_TIME = 3000; // milisegundos
  let ejerciciosCompletados = 0;

  function setDragAndDrop(ejercicioIdx) {
    const ejercicio = ejercicios[ejercicioIdx];
    const section = document.getElementById(ejercicio.id);
    const draggablesContainer = section.querySelector('.draggables-container');
    const dropzones = section.querySelectorAll('.dropzone');
    let palabraArrastrada = null;

    // Delegación de eventos para draggables
    draggablesContainer.addEventListener('dragstart', (e) => {
      if (e.target.classList.contains('draggable')) {
        palabraArrastrada = e.target;
        e.target.classList.add('dragging');
      }
    });
    draggablesContainer.addEventListener('dragend', (e) => {
      if (e.target.classList.contains('draggable')) {
        palabraArrastrada = null;
        e.target.classList.remove('dragging');
      }
    });

    dropzones.forEach((zone) => {
      zone.addEventListener('dragover', (e) => {
        e.preventDefault();
        if (!zone.classList.contains('locked')) {
          zone.style.background = '#2d3a2d';
        }
      });
      zone.addEventListener('dragleave', (e) => {
        if (!zone.classList.contains('locked')) {
          zone.style.background = '';
        }
      });
      zone.addEventListener('drop', (e) => {
        e.preventDefault();
        if (!zone.classList.contains('locked') && palabraArrastrada) {
          if (zone.firstChild) {
            draggablesContainer.appendChild(zone.firstChild);
          }
          zone.appendChild(palabraArrastrada);
          zone.classList.add('filled');
          zone.style.background = '';
          if (palabraArrastrada.textContent === zone.dataset.correct) {
            zone.classList.add('locked');
            palabraArrastrada.setAttribute('draggable', 'false');
            palabraArrastrada.classList.add('locked');
            zone.classList.remove('incorrect');
            checkAllCorrect();
          } else {
            zone.classList.remove('locked');
            palabraArrastrada.setAttribute('draggable', 'true');
            palabraArrastrada.classList.remove('locked');
            zone.classList.add('incorrect');
            setTimeout(() => {
              draggablesContainer.appendChild(palabraArrastrada);
              zone.classList.remove('filled');
              zone.classList.remove('incorrect');
            }, 800);
          }
        }
      });
    });

    function checkAllCorrect() {
      const allLocked = Array.from(dropzones).every(z => z.classList.contains('locked'));
      if (allLocked) {
        const insight = section.querySelector('.insight-container');
        if (insight) {
          insight.style.display = 'block';
          insight.classList.remove('hide');
        }
        if (ejercicioActual + 1 < ejercicios.length) {
          setTimeout(() => {
            if (insight) insight.classList.add('hide');
            setTimeout(() => {
              section.classList.add('slide-out-left');
              setTimeout(() => {
                section.classList.add('hidden');
                section.style.display = 'none';
                ejerciciosCompletados++;
                actualizarContador();
                ejercicioActual++;
                mostrarSiguienteEjercicio();
              }, 600); // tiempo de la animación de salida
            }, 600); // tiempo para que el insight se desvanezca
          }, INSIGHT_TIME);
        } else {
          // Último ejercicio: el insight se queda y la sección no desaparece
          ejerciciosCompletados++;
          actualizarContador();
          marcarTareaCompletada('task_02');
          const audioFinal = new Audio('../assets/Success_Final.wav');
          audioFinal.volume = 0.5;
          setTimeout(() => { audioFinal.play(); }, 400);
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
    }
  }

  function actualizarContador() {
    const counter = document.getElementById('task02-counter');
    if (counter) {
      counter.textContent = "Completed" + " " + ejerciciosCompletados + '/' + ejercicios.length;
    }
  }

  function mostrarSiguienteEjercicio() {
    const ejercicio = ejercicios[ejercicioActual];
    const section = document.getElementById(ejercicio.id);
    // El contador solo se actualiza cuando se completa un ejercicio, no al mostrar el siguiente
    section.classList.add('pre-in');
    section.classList.remove('hidden');
    section.style.display = '';
    setTimeout(() => {
      section.classList.remove('pre-in');
      section.classList.add('slide-in-left');
      setTimeout(() => {
        section.classList.remove('slide-in-left');
      }, 600);
    }, 300); // delay para que se vean ambas animaciones
    setDragAndDrop(ejercicioActual);
  }

  // Inicializar el primer ejercicio y el contador
  actualizarContador();
  mostrarSiguienteEjercicio();
});

function marcarTareaCompletada(taskId) {
  let progreso = JSON.parse(localStorage.getItem('wlb_progress') || '{}');
  progreso[taskId] = true;
  localStorage.setItem('wlb_progress', JSON.stringify(progreso));
}
