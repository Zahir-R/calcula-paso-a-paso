export function capitalizar(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export function mezclarArray(arr) {
    return arr.map(v => [v, Math.random()]).sort((a, b) => a[1] - b[1]).map(v => v[0]);
}

export function ensureMathJaxLoaded(callback) {
    if (window.MathJax) {
        callback();
    } else {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';
        script.onload = callback;
        document.head.appendChild(script);
    }
}