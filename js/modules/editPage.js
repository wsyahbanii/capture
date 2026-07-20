import { layoutConfigs } from './config.js';

export function initEditPage() {
    const layoutId = sessionStorage.getItem('void_layout');
    const imagesStr = sessionStorage.getItem('void_images');
    const editedImgStr = sessionStorage.getItem('void_edited_image'); 

    if (!layoutId || !imagesStr || !layoutConfigs[layoutId]) return window.location.href = 'index.html';

    const config = layoutConfigs[layoutId];
    const previewImg = document.getElementById('preview-image');

    if (editedImgStr) {
        previewImg.src = editedImgStr;
        document.getElementById('loading-screen')?.classList.add('hidden');
    } else {
        const capturedImages = JSON.parse(imagesStr);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = config.canvasW; canvas.height = config.canvasH;
        ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        const positions = config.getPositions();
        let loadedCount = 0;

        capturedImages.forEach((src, index) => {
            const img = new Image(); img.src = src;
            img.onload = () => {
                const pos = positions[index];
                const drawW = pos.w || 400; const drawH = pos.h || 300;
                ctx.save();
                ctx.translate(pos.x + (drawW/2), pos.y + (drawH/2));
                if (pos.r) ctx.rotate(pos.r * Math.PI / 180);
                ctx.drawImage(img, -drawW/2, -drawH/2, drawW, drawH);
                ctx.restore();
                
                loadedCount++;
                if (loadedCount === capturedImages.length) {
                    const tpl = new Image(); tpl.src = config.templateSrc;
                    tpl.onload = () => {
                        ctx.drawImage(tpl, 0, 0, canvas.width, canvas.height);
                        const finalBase = canvas.toDataURL('image/png');
                        previewImg.src = finalBase; 
                        sessionStorage.setItem('void_edited_image', finalBase); 
                        document.getElementById('loading-screen')?.classList.add('hidden');
                    };
                }
            };
        });
    }

    document.getElementById('btn-enter-edit')?.addEventListener('click', () => {
        window.location.href = 'workspace.html';
    });

    document.getElementById('download-btn')?.addEventListener('click', () => {
        const link = document.createElement('a');
        link.download = `VOID-BOOTH-${Date.now()}.png`;
        link.href = previewImg.src;
        link.click();
    });

    document.getElementById('retake-btn')?.addEventListener('click', () => {
        sessionStorage.removeItem('void_edited_image');
        window.location.href = 'camera.html';
    });
}