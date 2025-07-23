import { capitalizar, cargarMathJax } from './utils.js';

// Fetch de un tema seleccionado para extraer el texto de su html
export function mostrarTeoria(tema) {
    localStorage.removeItem('sesionActiva');
    const archivo = `./data/teoria/teoria${capitalizar(tema)}.html`;
    fetch(archivo)
        .then(res => res.text())
        .then(html => {
            // Mostrar el texto en seccionContenido y ocultar la seccionResultados
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
