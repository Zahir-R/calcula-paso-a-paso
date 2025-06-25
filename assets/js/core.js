import { cargarDatos } from './preguntas.js';
import { mostrarTeoria } from './teoria.js';
import { iniciarPractica } from './practica.js';
import { iniciarSimulacro } from './simulacro.js';

export async function inicializarApp() {
    const modeSelector = document.getElementById('mode');
    const topicSelector = document.getElementById('topic');
    const startBtn = document.getElementById('startBtn');

    let modo = "estudio";
    let tema = "funciones";

    modeSelector.addEventListener('change', () => {
        modo = modeSelector.value;
        topicSelector.disabled = (modo === 'simulacro');
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
        tema = topicSelector.value;
        modo = modeSelector.value;
        if (modo === 'estudio') mostrarTeoria(tema);
        else if (modo === 'practica') iniciarPractica(tema);
        else if (modo === 'simulacro') {
            topicSelector.disabled = true;
            iniciarSimulacro();
        }
    });
}
