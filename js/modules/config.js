export const getStandardPositions = () => [{x: 50, y: 190}, {x: 50, y: 510}, {x: 50, y: 830}, {x: 50, y: 1150}];

export const layoutConfigs = {
    'layout7': { title: 'BLANK 1', category: 'blank', framesCount: 1, templateSrc: 'assets/layouts/blank4.png', canvasW: 425, canvasH: 380, getPositions: () => [{x: 12, y: 12, w: 400, h: 300}] },
    'layout8': { title: 'BLANK 2', category: 'blank', framesCount: 1, templateSrc: 'assets/layouts/blank5.png', canvasW: 768, canvasH: 857, getPositions: () => [{x: 30, y: 36, w: 706, h: 663}] },
    'layout9': { title: 'BLANK 3', category: 'blank', framesCount: 1, templateSrc: 'assets/layouts/blank6.png', canvasW: 768, canvasH: 1024, getPositions: () => [{x: 30, y: 36, w: 706, h: 730}] },
    'layout10': { title: 'BLANK 4', category: 'blank', framesCount: 4, templateSrc: 'assets/layouts/blank1.png', canvasW: 500, canvasH: 1500, getPositions: () => [{x: 50, y: 50}, {x: 50, y: 370}, {x: 50, y: 690}, {x: 50, y: 1010}] },
    'layout11': { title: 'BLANK 5', category: 'blank', framesCount: 4, templateSrc: 'assets/layouts/blank2.png', canvasW: 500, canvasH: 1500, getPositions: () => [{x: 50, y: 120}, {x: 50, y: 440}, {x: 50, y: 760}, {x: 50, y: 1080}] },
    'layout12': { title: 'BLANK 6', category: 'blank', framesCount: 1, templateSrc: 'assets/layouts/blank3.png', canvasW: 2048, canvasH: 1536, getPositions: () => [{x: 0, y: 77, w: 2048, h: 1142}] },

    'layout1': { title: 'VOID', category: 'void', framesCount: 4, templateSrc: 'assets/layouts/layout-1.png', canvasW: 500, canvasH: 1500, getPositions: getStandardPositions },
    'layout2': { title: 'STREET CAPTURE', category: 'void', framesCount: 4, templateSrc: 'assets/layouts/layout-2.png', canvasW: 500, canvasH: 1500, getPositions: getStandardPositions },
    'layout6': { title: 'NEWSPAPER', category: 'void', framesCount: 3, templateSrc: 'assets/layouts/layout-6.png', canvasW: 1150, canvasH: 1500, getPositions: () => [{x: 42, y: 414, w: 600, h: 455}, {x: 705, y: 876, w: 400, h: 300}, {x: 440, y: 1182, w: 294, h: 220}] },
    
    'layout4': { title: 'TICKET', category: 'fun', framesCount: 4, templateSrc: 'assets/layouts/layout-4.png', canvasW: 500, canvasH: 1500, getPositions: () => [{x: 50, y: 50}, {x: 50, y: 370}, {x: 50, y: 690}, {x: 50, y: 1010}] },

    'layout3': { title: 'BMTH', category: 'band', framesCount: 4, templateSrc: 'assets/layouts/layout-3.png', canvasW: 500, canvasH: 1500, getPositions: getStandardPositions },
    'layout5': { title: 'ROLL IT', category: 'band', framesCount: 4, templateSrc: 'assets/layouts/layout-5.png', canvasW: 1760, canvasH: 600, getPositions: () => [{x: 32, y: 150}, {x: 464, y: 150}, {x: 896, y: 150}, {x: 1328, y: 150}] },
    

    'layoutreq1': { title: 'by Nafsumettikul', category: 'request', framesCount: 3, templateSrc: 'assets/layouts/layout-req-1.png', canvasW: 972, canvasH: 2750, getPositions: () => [{x:109.75, y: 567.38, w:784.37, h:571.35, r:15.30},{x: 110.78, y: 1147.16, w:784.37, h:571.35,r:-6.12}, {x:95.75, y: 1730, w:830.37, h:599.35, r:18}] },
    'layoutreq2': { title: 'by Nafsumettikul', category: 'request', framesCount: 3, templateSrc: 'assets/layouts/layout-req-2.png', canvasW: 707, canvasH: 2000, getPositions: () => [{x:53, y: 218, w:603, h:425, r:0},{x:53, y: 727, w:603, h:425, r:0},{x:53, y: 1239, w:603, h:425, r:0}] },
    'layoutreq3': { title: 'by Nafsumettikul', category: 'request', framesCount: 2, templateSrc: 'assets/layouts/layout-req-3.png', canvasW: 707, canvasH: 2000, getPositions: () => [{x:-36, y: 330, w:780, h:585, r:0},{x:-36, y: 1146, w:780, h:585, r:0}] },
    'layoutreq4': { title: 'by Nafsumettikul', category: 'request', framesCount: 3, templateSrc: 'assets/layouts/layout-req-4.png', canvasW: 707, canvasH: 2000, getPositions: () => [{x:-37.47, y: 105.53, w:782.94, h:619.94, r:0},{x:-37.47, y:728.53, w:782.94, h:619.94, r:0},{x:-49.5, y: 1309.5, w:805.98, h:638.97, r:0}] },
    'layoutreq5': { title: 'by Nafsumettikul', category: 'request', framesCount: 3, templateSrc: 'assets/layouts/layout-req-5.png', canvasW: 707, canvasH: 2000, getPositions: () => [{x:69, y:144, w:570, h:427.5, r:0},{x:69, y:668, w:570, h:427.5, r:0},{x:69, y: 1192, w:570, h:427.5, r:0}] },
    'layoutreq6': { title: 'by Nafsumettikul', category: 'request', framesCount: 2, templateSrc: 'assets/layouts/layout-req-6.png', canvasW: 707, canvasH: 2000, getPositions: () => [{x:-71, y:368, w:850, h:637.5, r:0},{x:-71, y:1046, w:850, h:637.5, r:0}] }
};