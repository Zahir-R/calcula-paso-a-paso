import { preguntas } from './preguntas.js';
import { mezclarArray } from './utils.js';
import { mostrarPreguntas } from './ui.js';

export function iniciarSimulacro() {
    let todas = [];
    Object.keys(preguntas).forEach(t => {
        todas = todas.concat(preguntas[t]);
    });
    const seleccionadas = mezclarArray(todas).slice(0, 10); // 10 preguntas aleatorias
    mostrarPreguntas(seleccionadas, true);
}
