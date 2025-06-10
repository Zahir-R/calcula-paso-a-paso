if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
        import('./core.js').then(m => m.inicializarApp());
    });
} else {
    setTimeout(() => {
        import('./core.js').then(m => m.inicializarApp());
    }, 500);
}
