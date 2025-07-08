import { capitalizar, cargarMathJax } from './utils.js';

export function mostrarTeoria(tema) {
    const archivo = `./data/teoria/teoria${capitalizar(tema)}.html`;
    fetch(archivo)
        .then(res => res.text())
        .then(html => {
            const seccion = document.getElementById('seccionContenido');
            seccion.innerHTML = html;
            seccion.style.display = 'block';
            document.getElementById('seccionResultados').style.display = 'none';
            cargarMathJax(() => {
                MathJax.typesetPromise([seccion]);
            });
        })
        .catch(() => {
            document.getElementById('seccionContenido').innerHTML = '<p>No se pudo cargar la teoría para este tema.</p>';
        });
}
