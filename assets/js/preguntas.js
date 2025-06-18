export let preguntas = {};

export async function cargarDatos() {
    const res = await fetch(`./data/practica/preguntas.json`);
    const data = await res.json();
    preguntas = data.preguntas || {};
}
