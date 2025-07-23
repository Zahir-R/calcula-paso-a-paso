import { cargarDatos } from './preguntas.js';
import { mostrarTeoria } from './teoria.js';
import { iniciarPractica } from './practica.js';
import { iniciarSimulacro } from './simulacro.js';
import { restaurarSesion } from './ui.js'

export async function inicializarApp() {
    const selectorModo = document.getElementById('modo');
    const selectorTema = document.getElementById('tema');
    const startBtn = document.getElementById('startBtn');

    // Recuperar selección previa de modo y tema
    const modoGuardado = localStorage.getItem('modo');
    const temaGuardado = localStorage.getItem('tema');
    if (modoGuardado) selectorModo.value = modoGuardado;
    if (temaGuardado) selectorTema.value = temaGuardado;

    let modo = selectorModo.value || "estudio";     // Tomar el input del usuario o estudio como predeterminado
    let tema = selectorTema.value || "funciones";  // Tomar el input del usuario o funciones como predeterminado

    selectorTema.disabled = (modo === 'simulacro');  // Desactivar el selector de temas según el modo

    selectorModo.addEventListener('change', () => {
        modo = selectorModo.value;
        selectorTema.disabled = (modo === 'simulacro');
        localStorage.setItem('modo', modo);
    });
    selectorTema.addEventListener('change', () => {
        tema = selectorTema.value;
        localStorage.setItem('tema', tema);
    });

    startBtn.disabled = true;

    const sesionGuardada = localStorage.getItem('sesionActiva');
    if (sesionGuardada) {
        const sesion = JSON.parse(sesionGuardada);
        if (confirm('¿Recuperar sesión anterior?')) {
            await cargarDatos();
            restaurarSesion(sesion);
            startBtn.disabled = false;
            // Registrar el event listener si no está registrado
            if (!startBtn.dataset.listener) {
                startBtn.addEventListener('click', () => {
                    tema = selectorTema.value;
                    modo = selectorModo.value;
                    localStorage.setItem('modo', modo);
                    localStorage.setItem('tema', tema);
                    if (modo === 'estudio') mostrarTeoria(tema);
                    else if (modo === 'practica') iniciarPractica(tema);
                    else if (modo === 'simulacro') iniciarSimulacro();
                });
                startBtn.dataset.listener = 'true';
            }
            return;
        }
    }

    try {
        await cargarDatos();
        startBtn.disabled = false;
    } catch {
        alert("No se pudieron cargar las preguntas.");
        startBtn.disabled = false;
    }

    // Registrar el event listener si no está registrado
    if (!startBtn.dataset.listener) {
        startBtn.addEventListener('click', () => {
            tema = selectorTema.value;
            modo = selectorModo.value;
            localStorage.setItem('modo', modo);
            localStorage.setItem('tema', tema);
            if (modo === 'estudio') mostrarTeoria(tema);
            else if (modo === 'practica') iniciarPractica(tema);
            else if (modo === 'simulacro') iniciarSimulacro();
        });
        startBtn.dataset.listener = 'true';
    }
}
