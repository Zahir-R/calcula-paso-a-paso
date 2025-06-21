import { capitalizar } from './utils.js';

export function mostrarTeoria(tema) {
    const archivo = `./data/teoria/teoria${capitalizar(tema)}.html`;
    fetch(archivo)
        .then(res => res.text())
        .then(html => {
            const section = document.getElementById('contentSection');
            section.innerHTML = html;
            section.style.display = 'block';
            document.getElementById('resultSection').style.display = 'none';
            if (window.MathJax) MathJax.typesetPromise([section]);
        })
        .catch(() => {
            document.getElementById('contentSection').innerHTML = '<p>No se pudo cargar la teoría para este tema.</p>';
        });
}
