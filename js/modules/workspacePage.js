export function initWorkspacePage() {
    const baseImageSrc = sessionStorage.getItem('void_edited_image');
    if (!baseImageSrc) return window.location.href = 'index.html';

    const canvas = document.getElementById('final-canvas');
    const ctx = canvas.getContext('2d');
    const previewImg = document.getElementById('preview-image');
    const stickerLayer = document.getElementById('sticker-layer');
    const textInput = document.getElementById('custom-text-input');
    
    // Selector Custom Color Palette Baru
    const colorTriggerBtn = document.getElementById('color-trigger-btn');
    const colorOptionsMenu = document.getElementById('color-options-menu');
    const colorOptions = document.querySelectorAll('.color-option');
    let selectedColorValue = "#111111"; // Default Hitam

    // Selector Custom Dropdown Font
    const fontTriggerBtn = document.getElementById('font-trigger-btn');
    const fontOptionsMenu = document.getElementById('font-options-menu');
    const fontOptions = document.querySelectorAll('.font-option');
    let selectedFontValue = "'Fredoka', sans-serif"; 
    
    let activeSticker = null;

    const img = new Image();
    img.src = baseImageSrc;
    img.onload = () => {
        canvas.width = img.width; canvas.height = img.height;
        ctx.drawImage(img, 0, 0); previewImg.src = baseImageSrc;
        document.getElementById('loading-screen')?.classList.add('hidden');
    };

    const btnOpenSticker = document.getElementById('btn-open-sticker');
    const stickerModal = document.getElementById('sticker-modal');
    const btnCloseSticker = document.getElementById('btn-close-sticker');
    const stkCatBtns = document.querySelectorAll('.stk-cat-btn');
    const stickerThumbs = document.querySelectorAll('.sticker-grid .sticker-thumb');

    if (btnOpenSticker) btnOpenSticker.addEventListener('click', () => stickerModal.classList.remove('hidden'));
    if (btnCloseSticker) btnCloseSticker.addEventListener('click', () => stickerModal.classList.add('hidden'));
    if (stickerModal) stickerModal.addEventListener('click', (e) => { if (e.target === stickerModal) stickerModal.classList.add('hidden'); });

    stkCatBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            stkCatBtns.forEach(b => b.classList.remove('active')); btn.classList.add('active');
            const cat = btn.dataset.stkCat;
            stickerThumbs.forEach(thumb => thumb.classList.toggle('show', cat === 'all' || thumb.dataset.stkCat === cat));
        });
    });
    stickerThumbs.forEach(thumb => thumb.classList.add('show'));

    function attachEngine(wrapper, moveBtn, delBtn, rotateBtn, scaleBtn, isText = false) {
        function updateTransform() {
            wrapper.style.left = parseFloat(wrapper.dataset.pxX) + 'px';
            wrapper.style.top = parseFloat(wrapper.dataset.pxY) + 'px';
            wrapper.style.transform = `translate(-50%, -50%) rotate(${wrapper.dataset.rotate}deg) scale(${wrapper.dataset.scale})`;
        }

        function activate() {
            if(activeSticker && activeSticker !== wrapper) activeSticker.classList.remove('active');
            activeSticker = wrapper; wrapper.classList.add('active');
            document.querySelectorAll('.sticker-wrapper').forEach(stk => stk.style.zIndex = 10);
            wrapper.style.zIndex = 100;

            const textEl = wrapper.querySelector('.sticker-text');
            if (textEl) {
                if (textInput) textInput.value = textEl.innerText;
                
                // Sinkronisasi Warna Aktif ke Custom Color Palette
                const currentTextColor = wrapper.dataset.colorValue || "#111111";
                selectedColorValue = currentTextColor;
                colorOptions.forEach(opt => {
                    opt.classList.toggle('active', opt.dataset.color === currentTextColor);
                });
                
                // Sinkronisasi Font Aktif ke CUSTOM DROPWDOWN
                const currentFont = wrapper.dataset.fontValue || "'Fredoka', sans-serif";
                selectedFontValue = currentFont;
                fontOptions.forEach(opt => {
                    if (opt.dataset.font === currentFont) {
                        opt.classList.add('active');
                        if (fontTriggerBtn) {
                            fontTriggerBtn.textContent = opt.textContent + " ▼";
                            fontTriggerBtn.style.fontFamily = currentFont;
                        }
                    } else {
                        opt.classList.remove('active');
                    }
                });
            }
        }
        wrapper.addEventListener('mousedown', activate); wrapper.addEventListener('touchstart', activate, {passive: true});

        let startX, startY, initX, initY;
        function moveStart(e) {
            if (e.target === delBtn || e.target === rotateBtn || e.target === scaleBtn) return;
            e.preventDefault(); activate();
            startX = e.clientX || e.touches[0].clientX; startY = e.clientY || e.touches[0].clientY;
            initX = parseFloat(wrapper.dataset.pxX); initY = parseFloat(wrapper.dataset.pxY);
            document.addEventListener('mousemove', moving); document.addEventListener('touchmove', moving, {passive: false});
            document.addEventListener('mouseup', moveEnd); document.addEventListener('touchend', moveEnd);
        }
        function moving(e) {
            e.preventDefault();
            wrapper.dataset.pxX = initX + ((e.clientX || e.touches[0].clientX) - startX);
            wrapper.dataset.pxY = initY + ((e.clientY || e.touches[0].clientY) - startY);
            updateTransform();
        }
        function moveEnd() { document.removeEventListener('mousemove', moving); document.removeEventListener('touchmove', moving); document.removeEventListener('mouseup', moveEnd); document.removeEventListener('touchend', moveEnd); }
        wrapper.addEventListener('mousedown', moveStart); wrapper.addEventListener('touchstart', moveStart, {passive: false});

        delBtn.addEventListener('click', (e) => { e.stopPropagation(); wrapper.remove(); if(activeSticker === wrapper) activeSticker = null; });

        let initDist = 0, initScale = 1;
        function scaleStart(e) {
            e.stopPropagation(); e.preventDefault(); activate(); 
            const layerRect = stickerLayer.getBoundingClientRect();
            initDist = Math.hypot((e.clientX || e.touches[0].clientX) - (layerRect.left + parseFloat(wrapper.dataset.pxX)), (e.clientY || e.touches[0].clientY) - (layerRect.top + parseFloat(wrapper.dataset.pxY)));
            initScale = parseFloat(wrapper.dataset.scale);
            document.addEventListener('mousemove', scaling); document.addEventListener('touchmove', scaling, {passive: false});
            document.addEventListener('mouseup', scaleEnd); document.addEventListener('touchend', scaleEnd);
        }
        function scaling(e) {
            e.preventDefault(); const layerRect = stickerLayer.getBoundingClientRect();
            const curDist = Math.hypot((e.clientX || e.touches[0].clientX) - (layerRect.left + parseFloat(wrapper.dataset.pxX)), (e.clientY || e.touches[0].clientY) - (layerRect.top + parseFloat(wrapper.dataset.pxY)));
            wrapper.dataset.scale = initScale * (curDist / initDist); updateTransform();
        }
        function scaleEnd() { document.removeEventListener('mousemove', scaling); document.removeEventListener('touchmove', scaling); document.removeEventListener('mouseup', scaleEnd); document.removeEventListener('touchend', scaleEnd); }
        scaleBtn.addEventListener('mousedown', scaleStart); scaleBtn.addEventListener('touchstart', scaleStart, {passive: false});

        let initAngle = 0, initRotate = 0;
        function rotateStart(e) {
            e.stopPropagation(); e.preventDefault(); activate(); 
            const layerRect = stickerLayer.getBoundingClientRect();
            initAngle = Math.atan2((e.clientY || e.touches[0].clientY) - (layerRect.top + parseFloat(wrapper.dataset.pxY)), (e.clientX || e.touches[0].clientX) - (layerRect.left + parseFloat(wrapper.dataset.pxX)));
            initRotate = parseFloat(wrapper.dataset.rotate);
            document.addEventListener('mousemove', rotating); document.addEventListener('touchmove', rotating, {passive: false});
            document.addEventListener('mouseup', rotateEnd); document.addEventListener('touchend', rotateEnd);
        }
        function rotating(e) {
            e.preventDefault(); const layerRect = stickerLayer.getBoundingClientRect();
            const curAngle = Math.atan2((e.clientY || e.touches[0].clientY) - (layerRect.top + parseFloat(wrapper.dataset.pxY)), (e.clientX || e.touches[0].clientX) - (layerRect.left + parseFloat(wrapper.dataset.pxX)));
            wrapper.dataset.rotate = initRotate + ((curAngle - initAngle) * (180 / Math.PI)); updateTransform();
        }
        function rotateEnd() { document.removeEventListener('mousemove', rotating); document.removeEventListener('touchmove', rotating); document.removeEventListener('mouseup', rotateEnd); document.removeEventListener('touchend', rotateEnd); }
        rotateBtn.addEventListener('mousedown', rotateStart); rotateBtn.addEventListener('touchstart', rotateStart, {passive: false});
    }

    // --- CETAK STIKER GAMBAR ---
    document.querySelectorAll('.sticker-thumb').forEach(thumb => {
        thumb.addEventListener('click', () => {
            stickerModal.classList.add('hidden'); 
            const wrapper = document.createElement('div'); wrapper.className = 'sticker-wrapper';
            const pRect = stickerLayer.getBoundingClientRect();
            wrapper.dataset.scale = 1; wrapper.dataset.rotate = 0; wrapper.dataset.pxX = pRect.width / 2; wrapper.dataset.pxY = pRect.height / 2;
            wrapper.innerHTML = `
                <img src="${thumb.dataset.src}" class="sticker-img" decoding="async" loading="lazy">
                <div class="sticker-handle handle-delete"><img src="assets/icons/delete.png" alt="Delete" style="width: 100%; height: 100%;"></div>
                <div class="sticker-handle handle-rotate"><img src="assets/icons/rotate.png" alt="Rotate" style="width: 80%; height: 80%;"></div>
                <div class="sticker-handle handle-scale"><img src="assets/icons/scale.png" alt="Scale" style="width: 100%; height: 100%;"></div>`;
            stickerLayer.appendChild(wrapper);
            wrapper.style.left = wrapper.dataset.pxX + 'px'; wrapper.style.top = wrapper.dataset.pxY + 'px'; wrapper.style.transform = `translate(-50%, -50%)`;
            attachEngine(wrapper, null, wrapper.querySelector('.handle-delete'), wrapper.querySelector('.handle-rotate'), wrapper.querySelector('.handle-scale'));
            wrapper.dispatchEvent(new Event('mousedown')); 
        });
    });

    // --- RENDER STIKER TEKS BARU ---
    function createNewTextSticker(text, font, color) {
        const wrapper = document.createElement('div'); wrapper.className = 'sticker-wrapper text-wrapper';
        const pRect = stickerLayer.getBoundingClientRect();
        wrapper.dataset.scale = 1; wrapper.dataset.rotate = 0; wrapper.dataset.pxX = pRect.width / 2; wrapper.dataset.pxY = pRect.height / 2;
        wrapper.dataset.fontValue = font;
        wrapper.dataset.colorValue = color; 
        // Ganti bagian wrapper.innerHTML di fungsi createNewTextSticker
wrapper.innerHTML = `
    <div class="sticker-text" style="font-family: ${font}; font-size: 32px; color: ${color}; white-space: pre-wrap; padding: 10px;">${text}</div>
    <div class="sticker-handle handle-delete"><img src="assets/icons/delete.png" style="width: 100%; height: 100%;"></div>
    <div class="sticker-handle handle-rotate"><img src="assets/icons/rotate.png" style="width: 80%; height: 80%;"></div>
    <div class="sticker-handle handle-scale"><img src="assets/icons/scale.png" style="width: 100%; height: 100%;"></div>`;
        stickerLayer.appendChild(wrapper);
        wrapper.style.left = wrapper.dataset.pxX + 'px'; wrapper.style.top = wrapper.dataset.pxY + 'px'; wrapper.style.transform = `translate(-50%, -50%)`;
        attachEngine(wrapper, null, wrapper.querySelector('.handle-delete'), wrapper.querySelector('.handle-rotate'), wrapper.querySelector('.handle-scale'), true);
        wrapper.dispatchEvent(new Event('mousedown'));
    }

    const btnAddText = document.getElementById('btn-add-text');
    if (btnAddText) {
        btnAddText.addEventListener('click', () => {
            const defaultText = 'Ketik Teks';
            createNewTextSticker(defaultText, selectedFontValue, selectedColorValue);
            if (textInput) { textInput.value = defaultText; textInput.focus(); textInput.select(); }
        });
    }

    // --- REALTIME INPUT ---
    if (textInput) {
        textInput.addEventListener('input', () => {
            if (activeSticker && activeSticker.classList.contains('text-wrapper')) {
                const textEl = activeSticker.querySelector('.sticker-text');
                if (textEl) textEl.innerText = textInput.value || ' ';
            } else if (textInput.value.trim().length === 1) {
                createNewTextSticker(textInput.value, selectedFontValue, selectedColorValue);
            }
        });
    }

    // --- OPERASIONAL CUSTOM COLOR PALETTE ---
    if (colorTriggerBtn && colorOptionsMenu) {
        colorTriggerBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            colorOptionsMenu.classList.toggle('hidden');
            if(fontOptionsMenu) fontOptionsMenu.classList.add('hidden'); // Tutup font jika terbuka
        });
    }

    colorOptions.forEach(option => {
        option.addEventListener('click', () => {
            colorOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            
            selectedColorValue = option.dataset.color;
            
            if (activeSticker && activeSticker.classList.contains('text-wrapper')) {
                const textEl = activeSticker.querySelector('.sticker-text');
                if (textEl) {
                    textEl.style.color = selectedColorValue;
                    activeSticker.dataset.colorValue = selectedColorValue;
                }
            }
            colorOptionsMenu.classList.add('hidden');
        });
    });

    // --- OPERASIONAL CUSTOM MODAL COLOR PICKER ---
    const btnCustomColor = document.getElementById('btn-custom-color');
    const colorModal = document.getElementById('color-modal');
    const btnCloseColor = document.getElementById('btn-close-color');
    const colorPreview = document.getElementById('color-preview');
    const hexInput = document.getElementById('hex-input');
    const btnApplyColor = document.getElementById('btn-apply-color');
    
    const rangeR = document.getElementById('range-r');
    const rangeG = document.getElementById('range-g');
    const rangeB = document.getElementById('range-b');
    const valR = document.getElementById('val-r');
    const valG = document.getElementById('val-g');
    const valB = document.getElementById('val-b');

    function rgbToHex(r, g, b) {
        return "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1).toUpperCase();
    }

    function updateCustomColor() {
        const r = parseInt(rangeR.value);
        const g = parseInt(rangeG.value);
        const b = parseInt(rangeB.value);
        
        valR.innerText = r;
        valG.innerText = g;
        valB.innerText = b;
        
        const hex = rgbToHex(r, g, b);
        colorPreview.style.backgroundColor = hex;
        hexInput.value = hex;
    }

    if (btnCustomColor) {
        btnCustomColor.addEventListener('click', (e) => {
            e.stopPropagation();
            colorOptionsMenu.classList.add('hidden');
            colorModal.classList.remove('hidden');
        });
    }

    if (btnCloseColor) btnCloseColor.addEventListener('click', () => colorModal.classList.add('hidden'));

    [rangeR, rangeG, rangeB].forEach(slider => {
        slider.addEventListener('input', updateCustomColor);
    });

    if (btnApplyColor) {
        btnApplyColor.addEventListener('click', () => {
            selectedColorValue = hexInput.value;
            colorOptions.forEach(opt => opt.classList.remove('active'));
            
            if (activeSticker && activeSticker.classList.contains('text-wrapper')) {
                const textEl = activeSticker.querySelector('.sticker-text');
                if (textEl) {
                    textEl.style.color = selectedColorValue;
                    activeSticker.dataset.colorValue = selectedColorValue;
                }
            }
            colorModal.classList.add('hidden');
        });
    }

    // --- OPERASIONAL CUSTOM DROPDOWN FONT ---
    if (fontTriggerBtn && fontOptionsMenu) {
        fontTriggerBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            fontOptionsMenu.classList.toggle('hidden');
            if(colorOptionsMenu) colorOptionsMenu.classList.add('hidden'); // Tutup warna jika terbuka
        });
    }

    fontOptions.forEach(option => {
        option.addEventListener('click', () => {
            fontOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            
            selectedFontValue = option.dataset.font;
            fontTriggerBtn.textContent = option.textContent + " ▼";
            fontTriggerBtn.style.fontFamily = selectedFontValue;
            
            if (activeSticker && activeSticker.classList.contains('text-wrapper')) {
                const textEl = activeSticker.querySelector('.sticker-text');
                if (textEl) {
                    textEl.style.fontFamily = selectedFontValue;
                    activeSticker.dataset.fontValue = selectedFontValue;
                }
            }
            fontOptionsMenu.classList.add('hidden');
        });
    });

    // Tutup menu jika klik di luar
    document.addEventListener('click', (e) => {
        if(fontOptionsMenu && !e.target.closest('#custom-font-dropdown')) fontOptionsMenu.classList.add('hidden');
        if(colorOptionsMenu && !e.target.closest('#custom-color-dropdown')) colorOptionsMenu.classList.add('hidden');
    });

    document.getElementById('workspace').addEventListener('mousedown', (e) => { if (!e.target.closest('.sticker-wrapper') && !e.target.closest('.editor-floating-panel') && activeSticker) { activeSticker.classList.remove('active'); activeSticker = null; } });
    document.getElementById('workspace').addEventListener('touchstart', (e) => { if (!e.target.closest('.sticker-wrapper') && !e.target.closest('.editor-floating-panel') && activeSticker) { activeSticker.classList.remove('active'); activeSticker = null; } }, {passive: true});

    // --- BAKE CANVAS ---
    document.getElementById('btn-done-edit').addEventListener('click', () => {
        if(activeSticker) activeSticker.classList.remove('active'); 
        document.getElementById('loading-screen')?.classList.remove('hidden');
        
        const ratioX = canvas.width / stickerLayer.offsetWidth;
        const ratioY = canvas.height / stickerLayer.offsetHeight;
        ctx.drawImage(img, 0, 0); 

        document.querySelectorAll('.sticker-wrapper').forEach(wrapper => {
            const s = parseFloat(wrapper.dataset.scale);
            const r = parseFloat(wrapper.dataset.rotate);
            const pxLeft = parseFloat(wrapper.dataset.pxX);
            const pxTop = parseFloat(wrapper.dataset.pxY);
            const cx = pxLeft * ratioX; const cy = pxTop * ratioY;

            ctx.save(); ctx.translate(cx, cy); ctx.rotate(r * Math.PI / 180);

            const imgEl = wrapper.querySelector('.sticker-img');
            const textEl = wrapper.querySelector('.sticker-text');

            if (imgEl) {
                const cWidth = (100 * s) * ratioX;
                const aspect = imgEl.naturalHeight / imgEl.naturalWidth;
                const cHeight = cWidth * aspect;
                ctx.drawImage(imgEl, -cWidth/2, -cHeight/2, cWidth, cHeight);
            } else if (textEl) {
                const style = window.getComputedStyle(textEl);
                const scaledFontSize = parseFloat(style.fontSize) * s * ratioX;
                
                ctx.font = `${style.fontWeight} ${scaledFontSize}px ${wrapper.dataset.fontValue || style.fontFamily}`;
                ctx.fillStyle = wrapper.dataset.colorValue || style.color || '#111111';
                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                
                const lines = textEl.innerText.split('\n');
                const lineHeight = scaledFontSize * 1.2; 
                
                lines.forEach((line, index) => {
                    const yOffset = (index - (lines.length - 1) / 2) * lineHeight;
                    ctx.fillText(line, 0, yOffset);
                });
            }
            ctx.restore();
        });

        sessionStorage.setItem('void_edited_image', canvas.toDataURL('image/png'));
        window.location.href = 'edit.html'; 
    });
}