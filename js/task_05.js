document.addEventListener('DOMContentLoaded', () => {
    // Definición de los combos, mensajes y los iconos de cada combo
    const combos = [
        {
            icons: ['heart_icon', 'lock_icon', 'improve_icon'],
            msg: 'Emotions, when safely stored, no longer interfere. Progress is made in silence.'
        },
        {
            icons: ['turn_off_icon', 'brain_icon', 'efficiency_icon'],
            msg: 'When thought powers down, action powers up. Clarity is not required to perform.'
        },
        {
            icons: ['worklife_icon', 'experiment_icon', 'balance_icon'],
            msg: 'Through structured experimentation, purpose is found. The system shapes the self.'
        }
    ];
    const iconos = [
        'heart_icon', 'lock_icon', 'improve_icon',
        'turn_off_icon', 'brain_icon', 'efficiency_icon',
        'worklife_icon', 'balance_icon',
        'document_icon', 'message_icon', 'search_icon', 'person_icon',
        'experiment_icon'
    ];
    const COLUMN_LENGTH = 7;
    const VISIBLE_ICONS = 3;
    let columns = [[], [], []];
    let completedCombos = 0; // Solo se puede resolver el combo actual

    function initColumns() {
        for (let c = 0; c < 3; c++) {
            columns[c] = [];
            combos.forEach(combo => {
                columns[c].push(combo.icons[c]);
            });
            while (columns[c].length < COLUMN_LENGTH) {
                const random = iconos[Math.floor(Math.random() * iconos.length)];
                columns[c].push(random);
            }
            columns[c] = columns[c].sort(() => Math.random() - 0.5);
        }
    }

    function renderColumns() {
        // Iconos usados en combos anteriores
        let usedIcons = [[], [], []];
        for (let i = 0; i < completedCombos; i++) {
            combos[i].icons.forEach((icon, col) => usedIcons[col].push(icon));
        }
        for (let c = 0; c < 3; c++) {
            const ul = document.querySelector(`.icon-list[data-col='${c}']`);
            ul.innerHTML = '';
            let start = 1;
            if (columns[c].length < VISIBLE_ICONS) start = 0;
            for (let i = 0; i < VISIBLE_ICONS; i++) {
                let idx = (start + i) % columns[c].length;
                const icon = columns[c][idx];
                const li = document.createElement('li');
                if (i === 1) li.classList.add('selected');
                // Resaltar iconos usados en combos anteriores
                if (usedIcons[c].includes(icon)) li.classList.add('used');
                // Resaltar si es el combo actual y está resuelto
                if (isMatchedIcon(c, icon, idx)) li.classList.add('matched');
                // Añadir clase 'correct' solo si el icono está en el centro y es parte del combo actual
                if (completedCombos < combos.length && 
                    icon === combos[completedCombos].icons[c] && 
                    i === 1) {
                    li.classList.add('correct');
                }
                const img = document.createElement('img');
                img.src = `../assets/${icon}.svg`;
                img.alt = icon;
                li.appendChild(img);
                ul.appendChild(li);
            }
        }
    }

    function moveColumn(col, dir) {
        if (dir === 'up') {
            columns[col].unshift(columns[col].pop());
        } else {
            columns[col].push(columns[col].shift());
        }
        renderColumns();
        checkCombo();
    }

    function isMatchedIcon(col, icon, idx) {
        if (completedCombos >= combos.length) return false;
        const combo = combos[completedCombos].icons;
        // Solo resaltar si los tres iconos centrales están alineados
        const fila = [columns[0][2], columns[1][2], columns[2][2]];
        if (fila[0] === combo[0] && fila[1] === combo[1] && fila[2] === combo[2]) {
            return columns[col][2] === combo[col] && idx === 2;
        }
        return false;
    }

    function checkCombo() {
        if (completedCombos >= combos.length) return;
        const fila = [columns[0][2], columns[1][2], columns[2][2]];
        const combo = combos[completedCombos].icons;
        if (combo[0] === fila[0] && combo[1] === fila[1] && combo[2] === fila[2]) {
            // Sonido de conexión
            const audio = new Audio('../assets/Connection.wav');
            audio.play();
            audio.volume = 0.3;
            completedCombos++;
            renderColumns();
            mostrarMensaje(true);
            renderProgress();
        } else {
            mostrarMensaje(false);
        }
    }

    function mostrarMensaje(found) {
        const msg = document.querySelector('.ruleta-hint-message');
        msg.classList.remove('final-message');
        if (completedCombos >= combos.length) {
            msg.textContent = 'All symbolic connections have been successfully identified!';
            msg.classList.add('final-message');
            marcarTareaCompletada('task_05');
            // Reproducir sonido de éxito y redirigir tras un delay
            const audio = new Audio('../assets/Success_Final.wav');
            audio.play();
            audio.volume = 0.3;
            setTimeout(() => {
                window.location.href = '../work.html';
            }, 1800); // Espera a que suene el audio antes de redirigir
        } else {
            msg.textContent = combos[completedCombos].msg;
        }
    }

    function renderProgress() {
        const progress = document.querySelector('.ruleta-progress');
        progress.innerHTML = '';
        for (let i = 0; i < completedCombos; i++) {
            const combo = combos[i];
            const comboDiv = document.createElement('div');
            comboDiv.className = 'ruleta-progress-combo completed';
            combo.icons.forEach(icon => {
                const img = document.createElement('img');
                img.src = `../assets/${icon}.svg`;
                img.alt = icon;
                comboDiv.appendChild(img);
            });
            progress.appendChild(comboDiv);
        }
    }

    function marcarTareaCompletada(taskId) {
        let progreso = JSON.parse(localStorage.getItem('wlb_progress') || '{}');
        progreso[taskId] = true;
        localStorage.setItem('wlb_progress', JSON.stringify(progreso));
    }

    document.querySelectorAll('.arrow-btn').forEach(btn => {
        btn.addEventListener('click', e => {
            const col = parseInt(btn.dataset.col);
            const dir = btn.classList.contains('up') ? 'up' : 'down';
            moveColumn(col, dir);
        });
    });

    // Inicializar
    initColumns();
    renderColumns();
    renderProgress();
    mostrarMensaje(false);
});

