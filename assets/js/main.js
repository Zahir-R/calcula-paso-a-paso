if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
        import('./core.js').then(m => m.inicializarApp());
    });
} else {
    setTimeout(() => {
        import('./core.js').then(m => m.inicializarApp());
    }, 300); // Cambio de 500 a 300
}
