import { preguntas } from './preguntas.js';
import { mezclarArray } from './utils.js';
import { mostrarPreguntas } from './ui.js';

export function iniciarPractica(tema) {
    const lista = preguntas[tema];
    if (!lista || lista.length === 0) {
        document.getElementById('contentSection').innerHTML = '<p>No hay preguntas para este tema.</p>';
        return;
    }
    const seleccionadas = mezclarArray(lista).slice(0, 10);
    mostrarPreguntas(seleccionadas, false);
}
