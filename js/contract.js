document.addEventListener('DOMContentLoaded', function() {
    
    // Configurar el estado inicial de los elementos
    gsap.set('.contract-header', {
        opacity: 0,
        scale: 0.9
    });

    gsap.set([
        '.contract-form',
        '.download-btn-wrapper',
        '.contract-description',
        '.buttons-container',
        '.continue-arrow'
    ], {
        opacity: 0,
        scale: 0.9,
    });

    // Crear la timeline para la secuencia de animaciones
    const tl = gsap.timeline();

    // Secuencia de animaciones
    tl.to('.contract-header', {
        opacity: 1,
        scale: 1,
        duration: 1,
        ease: "power2.out"
    })
    .to('.contract-form', {
        opacity: 1,
        scale: 1,
        duration: 1,
        ease: "power2.out"
    }, "-=0.8")
    .to('.download-btn-wrapper', {
        opacity: 1,
        scale: 1,
        duration: 1,
        ease: "power2.out"
    }, "-=0.8")
    .to('.contract-description', {
        opacity: 1,
        scale: 1,
        duration: 1,
        ease: "power2.out"
    }, "-=0.8")
    .to('.buttons-container', {
        opacity: 1,
        scale: 1,
        duration: 1,
        ease: "power2.out"
    }, "-=0.8")
    .to('.continue-arrow', {
        opacity: 1,
        scale: 1,
        duration: 1,
        ease: "power2.out"
    }, "-=0.8");

    setupEventListeners();

    // Añadir evento para el botón de descarga
    const downloadButton = document.getElementById('downloadFormButton');
    if (downloadButton) {
        downloadButton.addEventListener('click', descargarFormularioComoImagen);
    }

    const startButton = document.querySelector('.group-button.continue-arrow');
    if (startButton) {
        startButton.addEventListener('click', () => {
            window.location.href = 'platform.html';
        });
    }

    const codeField = document.getElementById('employeeCode');
    if (codeField) {
        codeField.textContent = generarEmployeeCode();
    }
});

// Función para configurar los event listeners
function setupEventListeners() {
    const photoInput = document.getElementById('photo-input');
    const uploadBtn = document.getElementById('upload-btn');
    const cameraBtn = document.getElementById('camera-btn');

    if (uploadBtn) {
        uploadBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            photoInput.click();
        });
    }

    if (photoInput) {
        photoInput.addEventListener('change', handleImageUpload);
    }

    if (cameraBtn) {
        cameraBtn.addEventListener('click', handleCamera);
    }
}

// Función para aplicar filtros: grayscale, blur y noise
function applyImageFilters(imageUrl, callback) {
    console.log('Aplicando filtros: grayscale, blur y noise');
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = function() {
        // Obtener el tamaño del contenedor .form-left
        const formLeft = document.querySelector('.form-left');
        const rect = formLeft.getBoundingClientRect();
        const targetWidth = Math.round(rect.width);
        const targetHeight = Math.round(rect.height);

        // Crear canvas con el tamaño del contenedor
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = targetWidth;
        canvas.height = targetHeight;

        // Calcular recorte tipo object-fit: cover
        const imgAspect = img.width / img.height;
        const targetAspect = targetWidth / targetHeight;
        let drawWidth, drawHeight, offsetX, offsetY;
        if (imgAspect > targetAspect) {
            // Imagen más ancha que el contenedor
            drawHeight = targetHeight;
            drawWidth = img.width * (targetHeight / img.height);
            offsetX = -(drawWidth - targetWidth) / 2;
            offsetY = 0;
        } else {
            // Imagen más alta que el contenedor
            drawWidth = targetWidth;
            drawHeight = img.height * (targetWidth / img.width);
            offsetX = 0;
            offsetY = -(drawHeight - targetHeight) / 2;
        }

        // Dibuja la imagen recortada
        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

        // Aplica escala de grises
        let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        let data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            const avg = 0.299 * data[i] + 0.587 * data[i+1] + 0.114 * data[i+2];
            data[i] = data[i+1] = data[i+2] = avg;
        }
        ctx.putImageData(imageData, 0, 0);

        // Aplica desenfoque medio (usando stack blur simple)
        stackBlurCanvasRGBA(canvas, 0, 0, canvas.width, canvas.height, 8); // radio 8 = desenfoque medio

        // Añade ruido
        imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            const noise = (Math.random() - 0.5) * 40; // ruido entre -20 y 20
            data[i] = Math.min(255, Math.max(0, data[i] + noise));
            data[i+1] = Math.min(255, Math.max(0, data[i+1] + noise));
            data[i+2] = Math.min(255, Math.max(0, data[i+2] + noise));
        }
        ctx.putImageData(imageData, 0, 0);

        callback(canvas.toDataURL());
    };
    img.src = imageUrl;
}

// Algoritmo StackBlur (versión compacta para radio bajo)
function stackBlurCanvasRGBA(canvas, top_x, top_y, width, height, radius) {
    if (isNaN(radius) || radius < 1) return;
    radius |= 0;
    const context = canvas.getContext('2d');
    let imageData;
    try {
        imageData = context.getImageData(top_x, top_y, width, height);
    } catch(e) {
        return;
    }
    const pixels = imageData.data;
    const div = radius + radius + 1;
    const w4 = width << 2;
    let yi = 0, yw = 0;
    const r = [];
    for (let y = 0; y < height; y++) {
        let rsum = 0, gsum = 0, bsum = 0, asum = 0;
        for (let i = -radius; i <= radius; i++) {
            const p = (yi + Math.min(width - 1, Math.max(i, 0))) << 2;
            rsum += pixels[p];
            gsum += pixels[p + 1];
            bsum += pixels[p + 2];
            asum += pixels[p + 3];
        }
        for (let x = 0; x < width; x++) {
            const p = (yi + x) << 2;
            pixels[p] = rsum / div;
            pixels[p + 1] = gsum / div;
            pixels[p + 2] = bsum / div;
            pixels[p + 3] = asum / div;
            const p1 = (yi + Math.max(0, x - radius)) << 2;
            const p2 = (yi + Math.min(width - 1, x + radius)) << 2;
            rsum += pixels[p2] - pixels[p1];
            gsum += pixels[p2 + 1] - pixels[p1 + 1];
            bsum += pixels[p2 + 2] - pixels[p1 + 2];
            asum += pixels[p2 + 3] - pixels[p1 + 3];
        }
        yi += width;
    }
    context.putImageData(imageData, top_x, top_y);
}

// Función para actualizar el DOM con la imagen procesada
function updateImageDisplay(processedImageUrl) {
    const formLeft = document.querySelector('.form-left');
    formLeft.innerHTML = `
        <div class="photo-placeholder photo-loaded">
            <img src="${processedImageUrl}" class="uploaded-image">
            <button class="change-photo-btn">Change Photo</button>
        </div>
    `;

    const changePhotoBtn = document.querySelector('.change-photo-btn');
    if (changePhotoBtn) {
        changePhotoBtn.addEventListener('click', resetPhotoUpload);
    }
}

// Función para resetear la subida de foto
function resetPhotoUpload() {
    const formLeft = document.querySelector('.form-left');
    formLeft.innerHTML = `
        <div class="photo-placeholder" id="photo-placeholder">
            <div class="photo-options">
                <button type="button" class="photo-option" id="upload-btn">Upload File</button>
                <button type="button" class="photo-option" id="camera-btn">Use Camera</button>
            </div>
            <p class="info-photo">*Upload or take a photo for your employee profile (max. 1MB)</p>
        </div>
        <input type="file" id="photo-input" accept="image/jpeg,image/jpg,image/png,image/webp" style="display: none;">
    `;

    setupEventListeners();
}

// Función para manejar la subida de archivo
function handleImageUpload(event) {
    console.log('Iniciando upload');
    const file = event.target.files[0];
    if (file) {
        const maxSize = 1048576; // 1MB
        if (file.size > maxSize) {
            alert('La imagen debe ser menor a 1MB. Por favor, comprime la imagen o selecciona otra.');
            return;
        }

        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            console.log('Tipo de archivo:', file.type);
            alert('Por favor, sube una imagen en formato JPG, JPEG, PNG o WEBP');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                applyImageFilters(e.target.result, updateImageDisplay);
            };
            img.onerror = function() {
                console.error('Error al cargar la imagen:', file.type);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}

// Función para manejar la captura de cámara
function handleCamera(e) {
    e.preventDefault();
    e.stopPropagation();
    
    if (!('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices)) {
        alert('Tu dispositivo no tiene acceso a la cámara o no está soportado');
        return;
    }

    try {
        const videoContainer = document.createElement('div');
        videoContainer.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.9); z-index: 1000; display: flex; flex-direction: column; align-items: center; justify-content: center;';
        
        const video = document.createElement('video');
        video.style.cssText = 'max-width: 100%; max-height: 80vh;';
        video.autoplay = true;
        
        const captureBtn = document.createElement('button');
        captureBtn.textContent = 'Capturar Foto';
        captureBtn.style.cssText = 'margin-top: 20px; padding: 10px 20px; background: var(--green-dark); border: none; color: white; border-radius: 5px; cursor: pointer;';
        
        const closeBtn = document.createElement('button');
        closeBtn.textContent = '×';
        closeBtn.style.cssText = 'position: absolute; top: 20px; right: 20px; background: none; border: none; color: white; font-size: 30px; cursor: pointer;';

        videoContainer.appendChild(video);
        videoContainer.appendChild(captureBtn);
        videoContainer.appendChild(closeBtn);
        document.body.appendChild(videoContainer);

        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
                video.srcObject = stream;

                captureBtn.onclick = () => {
                    console.log('Iniciando captura');
                    const canvas = document.createElement('canvas');
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                    canvas.getContext('2d').drawImage(video, 0, 0);
                    
                    const imageUrl = canvas.toDataURL('image/jpeg');
                    applyImageFilters(imageUrl, updateImageDisplay);

                    stream.getTracks().forEach(track => track.stop());
                    videoContainer.remove();
                };

                closeBtn.onclick = () => {
                    stream.getTracks().forEach(track => track.stop());
                    videoContainer.remove();
                };
            })
            .catch(err => {
                alert('Error al acceder a la cámara: ' + err.message);
            });

    } catch (err) {
        alert('Error al acceder a la cámara: ' + err.message);
    }
}

// Función para descargar el formulario como imagen
function descargarFormularioComoImagen() {
    const formulario = document.getElementById('contractForm');

    // Forzar mayúsculas en los campos
    const inputs = formulario.querySelectorAll('input, textarea');
    inputs.forEach(el => {
        el.value = el.value.toUpperCase();
    });
    // Solo la opción seleccionada de cada select en mayúsculas
    const selects = formulario.querySelectorAll('select');
    selects.forEach(select => {
        const selectedOption = select.options[select.selectedIndex];
        if (selectedOption) {
            selectedOption.textContent = selectedOption.textContent.toUpperCase();
        }
    });

    // Detectar si hay foto subida (busca .uploaded-image en .form-left)
    const formLeft = document.querySelector('.form-left');
    let placeholderHTML = '';
    let fotoInsertada = false;
    if (!formLeft.querySelector('img.uploaded-image')) {
        // Guardar el HTML actual del placeholder
        placeholderHTML = formLeft.innerHTML;
        // Insertar la imagen por defecto SIN filtros
        formLeft.innerHTML = `
            <div class="photo-placeholder photo-loaded">
                <img src="assets/default-photo.jpg" class="uploaded-image">
                <button class="change-photo-btn">Change Photo</button>
            </div>
        `;
        const changePhotoBtn = document.querySelector('.change-photo-btn');
        if (changePhotoBtn) {
            changePhotoBtn.addEventListener('click', resetPhotoUpload);
        }
        fotoInsertada = true;
    }

    // Ocultar todos los botones .change-photo-btn antes de exportar
    const changePhotoBtns = document.querySelectorAll('.change-photo-btn');
    changePhotoBtns.forEach(btn => btn.style.display = 'none');

    html2canvas(formulario, {
        allowTaint: true,
        useCORS: true,
        scrollX: 0,
        scrollY: 0,
        scale: 2, // Mejor calidad
        backgroundColor: '#ffffff'
    }).then(canvas => {
        // Obtener el nombre y rol para el nombre del archivo
        const nameInput = document.querySelector('input[name="name"]');
        const roleSelect = document.querySelector('select[name="role"]');
        const name = nameInput.value.trim() || 'employee';
        const role = roleSelect.value.trim() || 'role';
        
        // Crear nombre de archivo personalizado
        const fileName = `worklife_${name}_${role}.png`.toLowerCase().replace(/\s+/g, '_');
        
        const enlaceDescarga = document.createElement('a');
        enlaceDescarga.href = canvas.toDataURL('image/png', 1.0);
        enlaceDescarga.download = fileName;
        enlaceDescarga.click();

        // Restaurar el placeholder si insertamos la imagen por defecto
        if (fotoInsertada) {
            formLeft.innerHTML = placeholderHTML;
            setupEventListeners();
        }
        // Volver a mostrar los botones .change-photo-btn
        changePhotoBtns.forEach(btn => btn.style.display = '');
    }).catch(error => {
        console.error('Error al generar la imagen:', error);
        // Restaurar el placeholder si insertamos la imagen por defecto
        if (fotoInsertada) {
            formLeft.innerHTML = placeholderHTML;
            setupEventListeners();
        }
        // Volver a mostrar los botones .change-photo-btn
        changePhotoBtns.forEach(btn => btn.style.display = '');
    });
}

function generarEmployeeCode() {
    const parte1 = String(Math.floor(Math.random() * 100)).padStart(2, '0');
    const parte2 = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
    return `${parte1}-${parte2}`;
}

