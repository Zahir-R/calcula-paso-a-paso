import { preguntas } from './preguntas.js';
import { mezclarArray } from './utils.js';
import { mostrarPreguntas } from './ui.js';
import { nTemporizador, programarTemporizador } from './state.js';

export function iniciarSimulacro() {
    // Detener cualquier temporizador anterior
    if (nTemporizador) clearInterval(nTemporizador);
    programarTemporizador(null);

    let todas = [];
    // Selecciona aleatoriamente hasta 4 preguntas de un tema t y las almacena en la lista todas[]
    // Esto va a llenar la lista con 16 elementos (4 por cada tema)
    Object.keys(preguntas).forEach(t => {
        const preguntasMaximas = mezclarArray(preguntas[t]).slice(0, 4);
        todas = todas.concat(preguntasMaximas);
    });

    // De las seleccionadas anteriormente, volver a mezclar para obtener 10 aleatorias.
    const seleccionadas = mezclarArray(todas).slice(0, 10);
    mostrarPreguntas(seleccionadas, true);
}
