import { preguntas } from './preguntas.js';
import { mezclarArray } from './utils.js';
import { mostrarPreguntas } from './ui.js';

// Dado un tema, crear una lista de preguntas sobre el mismo. Cuando no exista, mostrar un mensaje que lo indique
export function iniciarPractica(tema) {
    const lista = preguntas[tema];
    if (!lista || lista.length === 0) {
        document.getElementById('seccionContenido').innerHTML = '<p>No hay preguntas para este tema.</p>';
        return;
    }
    // Selecciona 10 preguntas aleatorias y las muestra en seccionContenido
    const seleccionadas = mezclarArray(lista).slice(0, 10);
    mostrarPreguntas(seleccionadas, false);
}
