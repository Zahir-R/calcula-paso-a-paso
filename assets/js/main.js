// Difiere la carga de la app hasta que el navegador esté en idle
// Si no existe IdleCallback, sigue ejecutando core.js pero con un delay, mejorando TBT y FCP
if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
        import('./core.js').then(m => m.inicializarApp());
    });
} else {
    setTimeout(() => {
        import('./core.js').then(m => m.inicializarApp());
    }, 300);
}
