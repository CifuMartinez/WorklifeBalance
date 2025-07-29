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
    let touchStartY = 0;
    let touchStartX = 0;
    let isDragging = false;

    // Delegación de eventos para draggables (Mouse)
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

    // Eventos táctiles para draggables
    draggablesContainer.addEventListener('touchstart', (e) => {
      const target = e.target;
      if (target.classList.contains('draggable')) {
        palabraArrastrada = target;
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        isDragging = true;
        target.classList.add('dragging');
        e.preventDefault();
      }
    });

    draggablesContainer.addEventListener('touchmove', (e) => {
      if (isDragging && palabraArrastrada) {
        e.preventDefault();
        const touch = e.touches[0];
        const deltaX = touch.clientX - touchStartX;
        const deltaY = touch.clientY - touchStartY;
        
        // Mover el elemento visualmente
        palabraArrastrada.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
        palabraArrastrada.style.zIndex = '1000';
      }
    });

    draggablesContainer.addEventListener('touchend', (e) => {
      if (isDragging && palabraArrastrada) {
        isDragging = false;
        palabraArrastrada.classList.remove('dragging');
        palabraArrastrada.style.transform = '';
        palabraArrastrada.style.zIndex = '';
        
        // Encontrar la dropzone más cercana
        const touch = e.changedTouches[0];
        const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
        const dropzone = elementBelow?.closest('.dropzone');
        
        if (dropzone && !dropzone.classList.contains('locked')) {
          handleDrop(palabraArrastrada, dropzone);
        }
        
        palabraArrastrada = null;
      }
    });

    dropzones.forEach((zone) => {
      // Eventos de mouse
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
          handleDrop(palabraArrastrada, zone);
        }
      });

      // Eventos táctiles para dropzones
      zone.addEventListener('touchstart', (e) => {
        if (!zone.classList.contains('locked')) {
          zone.style.background = '#2d3a2d';
        }
      });

      zone.addEventListener('touchend', (e) => {
        if (!zone.classList.contains('locked')) {
          zone.style.background = '';
        }
      });
    });

    function handleDrop(element, dropzone) {
      if (dropzone.firstChild) {
        draggablesContainer.appendChild(dropzone.firstChild);
      }
      dropzone.appendChild(element);
      dropzone.classList.add('filled');
      dropzone.style.background = '';
      
      if (element.textContent === dropzone.dataset.correct) {
        dropzone.classList.add('locked');
        element.setAttribute('draggable', 'false');
        element.classList.add('locked');
        dropzone.classList.remove('incorrect');
        checkAllCorrect();
      } else {
        dropzone.classList.remove('locked');
        element.setAttribute('draggable', 'true');
        element.classList.remove('locked');
        dropzone.classList.add('incorrect');
        setTimeout(() => {
          draggablesContainer.appendChild(element);
          dropzone.classList.remove('filled');
          dropzone.classList.remove('incorrect');
        }, 800);
      }
    }

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
