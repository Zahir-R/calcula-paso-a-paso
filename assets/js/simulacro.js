import { preguntas } from './preguntas.js';
import { mezclarArray } from './utils.js';
import { mostrarPreguntas } from './ui.js';
import { nTemporizador, programarTemporizador } from './state.js';

export function iniciarSimulacro() {
    // Detener cualquier temporizador anterior
    if (nTemporizador) clearInterval(nTemporizador);
    programarTemporizador(null);

    let todas = [];
    Object.keys(preguntas).forEach(t => {
        const preguntasMaximas = mezclarArray(preguntas[t]).slice(0, 4);
        todas = todas.concat(preguntasMaximas);
    });

    const seleccionadas = mezclarArray(todas).slice(0, 10);
    mostrarPreguntas(seleccionadas, true);
}
