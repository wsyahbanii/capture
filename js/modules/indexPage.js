import { layoutConfigs } from './config.js';

export function initIndexPage() {
    const filterBtn = document.getElementById('filter-dropdown-btn');
    const filterMenu = document.getElementById('filter-dropdown-menu');
    const layoutGrid = document.getElementById('layout-grid');
    const nextBtn = document.getElementById('next-to-camera');
    let selectedLayout = null;

    for (const [id, config] of Object.entries(layoutConfigs)) {
        const card = document.createElement('div');
        card.className = `option-card show`;
        card.dataset.layout = id;
        card.dataset.category = config.category;
        card.innerHTML = `<img src="${config.templateSrc}" class="layout-thumbnail"><span>${config.title}</span>`;
        
        card.addEventListener('click', () => {
            document.querySelectorAll('#layout-grid .option-card').forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            selectedLayout = id;
            nextBtn.classList.remove('hidden'); 
            nextBtn.disabled = false;
            nextBtn.textContent = `NEXT: CAPTURE ${config.framesCount} SHOTS ➔`;
        });
        layoutGrid.appendChild(card);
    }

    nextBtn.addEventListener('click', () => {
        sessionStorage.setItem('void_layout', selectedLayout);
        window.location.href = 'camera.html';
    });
    
    if (filterBtn) {
        filterBtn.addEventListener('click', (e) => {
            e.stopPropagation(); 
            filterMenu.classList.toggle('hidden');
        });
    }

    document.addEventListener('click', (e) => {
        if (filterMenu && !filterMenu.contains(e.target) && e.target !== filterBtn) {
            filterMenu.classList.add('hidden');
        }
    });

    document.querySelectorAll('.cat-btn[data-cat]').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.cat-btn[data-cat]').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const cat = btn.dataset.cat;
            
            if (btn.classList.contains('dropdown-item')) {
                filterBtn.classList.add('active');
                filterBtn.textContent = `CATEGORY: ${btn.textContent} ▼`;
            } else {
                filterBtn.classList.remove('active');
                filterBtn.textContent = 'CATEGORY ▼'; 
            }

            if (filterMenu) filterMenu.classList.add('hidden');

            document.querySelectorAll('#layout-grid .option-card').forEach(card => {
                card.classList.toggle('show', cat === 'all' || card.dataset.category === cat);
            });
        });
    });
}