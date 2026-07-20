import { initIndexPage } from './modules/indexPage.js';
import { initCameraPage } from './modules/cameraPage.js';
import { initEditPage } from './modules/editPage.js';
import { initWorkspacePage } from './modules/workspacePage.js';

document.addEventListener('DOMContentLoaded', () => {
    const currentPage = document.body.dataset.page;

    if (currentPage === 'index') {
        initIndexPage();
    } else if (currentPage === 'camera') {
        initCameraPage();
    } else if (currentPage === 'edit') {
        initEditPage();
    } else if (currentPage === 'workspace') {
        initWorkspacePage();
    }
});