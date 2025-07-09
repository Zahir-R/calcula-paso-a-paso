// Dada una string, devolver el primer caracter en mayúsculas y el resto sin modificar
export function capitalizar(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Se le asigna un número random a cada elemento de una array, para luego ordenarlos 
// en función a su valor asignado luego, devolver el primer elemento de cada par
export function mezclarArray(arr) {
    return arr.map(v => [v, Math.random()]).sort((a, b) => a[1] - b[1]).map(v => v[0]);
}

// Carga MathJax de forma dinámica si se necesita, luego ejecuta la callback
// Si está cargado, llama a la función inmediatamente
export function cargarMathJax(callback) {
    if (window.MathJax) {
        callback();
    } else {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';
        script.onload = callback;
        document.head.appendChild(script);
    }
}