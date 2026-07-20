import { layoutConfigs } from './config.js';

export function initCameraPage() {
    const selectedLayout = sessionStorage.getItem('void_layout');
    if (!selectedLayout || !layoutConfigs[selectedLayout]) return window.location.href = 'index.html';

    const config = layoutConfigs[selectedLayout];
    const video = document.getElementById('webcam');
    const startBtn = document.getElementById('start-btn');
    const flipBtn = document.getElementById('flip-camera-btn');
    const noiseOverlay = document.getElementById('video-noise-overlay');
    const countdownEl = document.getElementById('countdown-overlay');
    const flashEl = document.getElementById('flash-overlay');

    let stream = null;
    let currentFilter = 'none';
    let currentFacingMode = 'user';
    let capturedImages = [];
    let timerValue = 0; 
    let currentShotIndex = 0;

    startBtn.textContent = `CAPTURE ${config.framesCount} SHOTS`;

    document.querySelectorAll('.option-filter').forEach(card => {
        card.addEventListener('click', function() {
            document.querySelectorAll('.option-filter').forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            currentFilter = this.dataset.filter;
            video.style.filter = currentFilter === 'noise' ? 'grayscale(100%) contrast(120%)' : currentFilter;
            noiseOverlay.classList.toggle('hidden', currentFilter !== 'noise');
        });
    });

    document.querySelectorAll('.timer-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.timer-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            timerValue = parseInt(this.dataset.time);
        });
    });

    async function initCamera() {
        if (stream) stream.getTracks().forEach(track => track.stop());
        try {
            stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480, facingMode: currentFacingMode }, audio: false });
            video.srcObject = stream;
            video.style.transform = currentFacingMode === 'user' ? 'scaleX(-1)' : 'scaleX(1)';
        } catch (err) { alert("Izinkan akses kamera."); }
    }
    
    flipBtn.addEventListener('click', () => {
        currentFacingMode = currentFacingMode === 'user' ? 'environment' : 'user';
        initCamera();
    });

    const sleep = ms => new Promise(r => setTimeout(r, ms));
    
    async function takePhoto() {
        if (timerValue > 0) {
            for (let i = timerValue; i > 0; i--) {
                countdownEl.textContent = i; countdownEl.classList.remove('hidden'); await sleep(1000);
            }
            countdownEl.classList.add('hidden');
        }

        flashEl.style.opacity = 1; flashEl.classList.remove('hidden');
        setTimeout(() => flashEl.style.opacity = 0, 100);

        const framePositions = config.getPositions();
        const refFrame = framePositions[0]; 
        const targetW = refFrame.w || 640; 
        const targetH = refFrame.h || 480;

        const videoRatio = video.videoWidth / video.videoHeight;
        const targetRatio = targetW / targetH;
        let drawW, drawH, startX, startY;

        if (videoRatio > targetRatio) {
            drawH = video.videoHeight; 
            drawW = video.videoHeight * targetRatio; 
            startX = (video.videoWidth - drawW) / 2; 
            startY = 0;
        } else {
            drawW = video.videoWidth; 
            drawH = video.videoWidth / targetRatio; 
            startX = 0; 
            startY = (video.videoHeight - drawH) / 2;
        }

        const tc = document.createElement('canvas'); 
        tc.width = targetW; 
        tc.height = targetH;
        const tctx = tc.getContext('2d');

        if (currentFacingMode === 'user') { 
            tctx.translate(targetW, 0); 
            tctx.scale(-1, 1); 
        }

        tctx.filter = currentFilter === 'noise' ? 'grayscale(100%) contrast(120%)' : currentFilter; 
        tctx.drawImage(video, startX, startY, drawW, drawH, 0, 0, targetW, targetH);
        
        if (currentFilter === 'noise') {
            const imgData = tctx.getImageData(0, 0, targetW, targetH);
            for (let i = 0; i < imgData.data.length; i += 4) {
                const nv = (Math.random() - 0.5) * 60; 
                imgData.data[i] = Math.min(255, Math.max(0, imgData.data[i] + nv));
                imgData.data[i+1] = Math.min(255, Math.max(0, imgData.data[i+1] + nv));
                imgData.data[i+2] = Math.min(255, Math.max(0, imgData.data[i+2] + nv));
            }
            tctx.putImageData(imgData, 0, 0);
        }
        return tc.toDataURL('image/jpeg', 0.8);
    }

    startBtn.addEventListener('click', async () => {
        if (typeof gtag === 'function') {
            gtag('event', 'capture_button_click', {
                'event_category': 'Engagement',
                'event_label': 'Capture Button'
            });
        }
        if (timerValue > 0) {
            startBtn.disabled = true; 
            capturedImages = [];
            for (let j = 0; j < config.framesCount; j++) {
                await sleep(500);
                capturedImages.push(await takePhoto());
            }
            sessionStorage.setItem('void_images', JSON.stringify(capturedImages));
            window.location.href = 'edit.html'; 
        } else {
            const photo = await takePhoto();
            capturedImages.push(photo);
            currentShotIndex++;

            if (currentShotIndex >= config.framesCount) {
                sessionStorage.setItem('void_images', JSON.stringify(capturedImages));
                window.location.href = 'edit.html';
            } else {
                startBtn.textContent = `CAPTURE ${currentShotIndex + 1} / ${config.framesCount}`;
            }
        }
    });

    initCamera();
}