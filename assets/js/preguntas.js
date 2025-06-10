export let preguntas = {};
export let resoluciones = {};

export async function cargarDatos() {
    const res = await fetch(`./data/practica/preguntas.json`);
    const data = await res.json();
    preguntas = data.preguntas || {};
    resoluciones = data.resoluciones || {};
}
