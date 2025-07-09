export let preguntas = {};

// Carga todas las preguntas de preguntas.json y las almacena en un objeto preguntas
export async function cargarDatos() {
    const res = await fetch(`./data/practica/preguntas.json`);
    const data = await res.json();
    preguntas = data.preguntas || {};
}
