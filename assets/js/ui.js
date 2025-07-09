import { preguntas } from './preguntas.js';
import { capitalizar, cargarMathJax } from './utils.js';
import { programarTemporizador } from './state.js';

let respuestasUsuario = [];
let temporizador = null;
let preguntasActuales = [];
let tiempoRestante = 0;

export function mostrarPreguntas(lista, esSimulacro) {
    preguntasActuales = lista;
    respuestasUsuario = Array(lista.length).fill(null); // Si el usuario no terminó de responder, las respuestas se guardan como null
    let html = '';

    if (esSimulacro) {
        tiempoRestante = 1800;
        if (temporizador) clearInterval(temporizador); // Detener temporizador anterior si existe
        iniciarTemporizador();
        programarTemporizador(temporizador); // Actualizar el temporizador global
        html += `<div id="temporizador">Tiempo restante: <span id="tiempo">${mostrarTiempoRestante(tiempoRestante)}</span> s</div>`;
    }

    /*
    * Itera por cada pregunta en la lista, con su índice, para cada pregunta se crea un div con el índice y la pregunta
    * Por cada opción se crea un label con input tipo radio con valor j del usuario
    * Todo se junta y se inserta en el div de cada pregunta
    */
    lista.forEach((q, i) => {
        html += `<div class="pregunta">
            <p><strong>${i + 1}. ${q.pregunta}</strong></p>
            ${q.opciones.map((op, j) => `
                <label class="option-label">
                    <input type="radio" name="p${i}" value="${j}">
                    <span">${op}</span>
                </label><br>
            `).join('')}
        </div>`;
    });

    // Se crea un botón para finalizar y se ocultan los resultados
    html += `<button id="submitBtn">Finalizar</button>`;
    const seccionContenido = document.getElementById('seccionContenido');
    seccionContenido.innerHTML = html;
    seccionContenido.style.display = 'block';
    document.getElementById('seccionResultados').style.display = 'none';

    document.getElementById('submitBtn').onclick = () => corregir(lista, esSimulacro);
    
    cargarMathJax(() => {
        MathJax.typesetPromise();
    });
}

function corregir(lista, esSimulacro) {
    // Para cada pregunta se selecciona el input del usuario i
    // Si no seleccionó nada, se marca como null, y si marcó una respuesta, se almacena en respuestaasUsuario[i]
    lista.forEach((q, i) => {
        const seleccion = document.querySelector(`input[name='p${i}']:checked`);
        respuestasUsuario[i] = seleccion ? parseInt(seleccion.value) : null;
    });

    let correctas = 0;
    let feedback = {};
    let detalle = '';

    lista.forEach((q, i) => {
        const indiceRespuestas = respuestasUsuario[i];
        // Compara la respuesta del usuario con la respuesta correcta
        const esCorrecta = indiceRespuestas === q.respuesta;
        if (esCorrecta) {
            correctas++;
        } else {
            // Incrementa temas a mejorar según la pregunta incorrecta
            const temaPregunta = obtenerTemaPregunta(q);
            feedback[temaPregunta] = (feedback[temaPregunta] || 0) + 1;
        }

        // Se crea un div por cada respuesta para aplicar css
        detalle += `<div class="question-feedback ${esCorrecta ? 'rCorrecta' : 'rIncorrecta'}">
            <h4>Pregunta ${i + 1}: ${q.pregunta}</h4>
            <div class="options-feedback">`;

        // Para cada opción se marca la respuesta correcta y la respuesta del usuario
        q.opciones.forEach((op, j) => {
            let optionClass = '';
            if (j === q.respuesta) optionClass = 'respuesta-correcta';
            else if (j === indiceRespuestas) optionClass = 'respuesta-usuario';

            // Si la respuesta del usuario coincide con la correcta se marca con un aspa
            // Si no, se marca con una X, en caso de que no haya respondido, no se marca nada ''
            detalle += `<div class="option ${optionClass}">
                ${op}
                ${j === q.respuesta ? '<span class="feedback-icon">✓</span>' : ''}
                ${j === indiceRespuestas && !esCorrecta ? '<span class="feedback-icon">✗</span>' : ''}
            </div>`;
        });

        // Cierre del div inicial y creación del botón para mostrar la resolución
        detalle += `</div>
            <button class="mostrar-solucion" data-index="${i}">Mostrar resolución paso a paso</button>
        </div>`;
    });

    let resultado = `<h3>Resultado: ${correctas} / ${lista.length} correctas (${Math.round(correctas / lista.length * 100)}%)</h3>`;
    resultado += `<div class="feedback-container">${detalle}</div>`;

    // Si se seleccionó simulacro, itera por cada elemento de feedback{} y muestra la cantidad de errores de cada tema
    if (esSimulacro) {
        resultado += '<h4>Temas a reforzar:</h4><ul>';
        Object.keys(feedback).forEach(t => {
            resultado += `<li>${capitalizar(t)}: ${feedback[t]} error(es)</li>`;
        });
        resultado += '</ul>';
    }

    const seccionResultados = document.getElementById('seccionResultados');
    seccionResultados.innerHTML = resultado;
    seccionResultados.style.display = 'block';
    document.getElementById('seccionContenido').style.display = 'none';

    if (temporizador) clearInterval(temporizador); // Detener el temporizador si existiera
    
    cargarMathJax(() => {
        MathJax.typesetPromise();
    });

    document.querySelectorAll('.mostrar-solucion').forEach(btn => {
        btn.onclick = () => mostrarResolucion(parseInt(btn.dataset.index), lista); // Muestra el modal según las preguntas actuales
    });
}

const resolucionCache = {};

async function mostrarResolucion(idx, lista) {
    // Accede al html de cada tema según su índice
    const q = lista[idx];
    const tema = obtenerTemaPregunta(q);
    const archivo = `./data/practica/practica${capitalizar(tema)}.html`;
    const resolId = `resolucion-${q.id}`;

    let htmlTema;
    // Si la resolución se guardó en caché, la muestra inmediatamente
    // Caso contrario, hace fetch del archivo y extrae su texto para almacenarlo en caché
    if (resolucionCache[tema]) {
        htmlTema = resolucionCache[tema];
    } else {
        const res = await fetch(archivo);
        htmlTema = await res.text();
        resolucionCache[tema] = htmlTema;
    }

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlTema;
    const resolDiv = tempDiv.querySelector(`#${resolId}`);

    const resolHtml = resolDiv ? resolDiv.innerHTML : '<i>No hay resolución disponible para este problema.</i>'

    const modal = document.createElement('div');
    modal.className = 'modal-resolucion';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>Resolución paso a paso</h3>
            <div class="texto-resolucion">${resolHtml}</div>
            <button class="cerrar-modal">Volver a revisión</button>
        </div>
    `;
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    modal.querySelector('.cerrar-modal').onclick = () => {
        document.body.removeChild(modal);
        document.body.style.overflow = '';
    };

    cargarMathJax(() => {
        MathJax.typesetPromise();
    });
}

function iniciarTemporizador() {
    // Actualiza el texto del temporizador cada segundo
    temporizador = setInterval(() => {
        tiempoRestante--;
        document.getElementById('tiempo').textContent = mostrarTiempoRestante(tiempoRestante);
        // Cuando el temporizador llega a 0, se elimina el temporizador y se procede a corregir con las respuestas actuales
        if (tiempoRestante <= 0) {
            clearInterval(temporizador);
            programarTemporizador(null);
            corregir(preguntasActuales, true);
        }
    }, 1000);
    programarTemporizador(temporizador); // Actualizar el temporizador global
}

function mostrarTiempoRestante(segundosRestantes) {
    const minutos = Math.floor(segundosRestantes / 60);
    const segundos = segundosRestantes % 60;
    // Convierte los minutos y segundos a strings, luego toma los 2 primeros dígitos de cada uno
    return `${minutos.toString().padStart(2,'0')}:${segundos.toString().padStart(2,'0')}`;
}

// Itera por cada elemento de preguntas (de preguntas.js) y luego retorna el tema t cuando la pregunta q es encontrada
function obtenerTemaPregunta(q) {
    for (let t in preguntas) {
        if (preguntas[t].includes(q)) return t;
    }
    return 'desconocido';
}
