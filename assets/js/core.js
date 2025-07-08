import { cargarDatos } from './preguntas.js';
import { mostrarTeoria } from './teoria.js';
import { iniciarPractica } from './practica.js';
import { iniciarSimulacro } from './simulacro.js';

export async function inicializarApp() {
    const selectorModo = document.getElementById('modo');
    const selectorTema = document.getElementById('tema');
    const startBtn = document.getElementById('startBtn');

    let modo = selectorModo.value || "estudio";     // Tomar el input del usuario o estudio como predeterminado
    let tema = selectorTema.value || "funciones";  // Tomar el input del usuario o funciones como predeterminado

    selectorTema.disabled = (modo === 'simulacro');  // Desactivar el selector de temas según el modo

    selectorModo.addEventListener('change', () => {
        modo = selectorModo.value;
        selectorTema.disabled = (modo === 'simulacro');
    });

    startBtn.disabled = true;
try {
        await cargarDatos();
        startBtn.disabled = false;
    } catch {
        alert("No se pudieron cargar las preguntas.");
        startBtn.disabled = false;
    }

    startBtn.addEventListener('click', () => {
        tema = selectorTema.value;
        modo = selectorModo.value;
        if (modo === 'estudio') mostrarTeoria(tema);
        else if (modo === 'practica') iniciarPractica(tema);
        else if (modo === 'simulacro') iniciarSimulacro();
    });
}
