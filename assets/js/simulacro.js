import { preguntas } from './preguntas.js';
import { mezclarArray } from './utils.js';
import { mostrarPreguntas } from './ui.js';
import { nTimer, setTimer } from './state.js';

export function iniciarSimulacro() {
    // Detener cualquier temporizador anterior
    if (nTimer) clearInterval(nTimer);
    setTimer(null);

    let todas = [];
    Object.keys(preguntas).forEach(t => {
        const maxQuestions = mezclarArray(preguntas[t]).slice(0, 4);
        todas = todas.concat(maxQuestions);
    });

    const seleccionadas = mezclarArray(todas).slice(0, 10);
    mostrarPreguntas(seleccionadas, true);
}
