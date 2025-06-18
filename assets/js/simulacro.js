import { preguntas } from './preguntas.js';
import { mezclarArray } from './utils.js';
import { mostrarPreguntas } from './ui.js';

export function iniciarSimulacro() {
    let todas = [];
    Object.keys(preguntas).forEach(t => {
        const maxQuestions = mezclarArray(preguntas[t]).slice(0, 4); // So that the exam will always cover at least 3 topics
        todas = todas.concat(maxQuestions);
    });
    const seleccionadas = mezclarArray(todas).slice(0, 10);
    mostrarPreguntas(seleccionadas, true);
}
