import { preguntas } from './preguntas.js';
import { capitalizar } from './utils.js';

let respuestasUsuario = [];
let timer = null;
let preguntasActuales = [];
let tiempoRestante = 0;

export function mostrarPreguntas(lista, esSimulacro) {
    preguntasActuales = lista;
    respuestasUsuario = Array(lista.length).fill(null);
    let html = '';

    if (esSimulacro) {
        tiempoRestante = 600;
        html += `<div id="timer">Tiempo restante: <span id="tiempo">${tiempoRestante}</span> s</div>`;
        iniciarTemporizador();
    }

    lista.forEach((q, i) => {
        html += `<div class="pregunta">
            <p><b>${i + 1}. ${q.pregunta}</b></p>
            ${q.opciones.map((op, j) => `
                <label class="option-label">
                    <input type="radio" name="p${i}" value="${j}">
                    <span class="option-text">${op}</span>
                </label><br>
            `).join('')}
        </div>`;
    });

    html += `<button id="submitBtn">Finalizar</button>`;
    const contentSection = document.getElementById('contentSection');
    contentSection.innerHTML = html;
    contentSection.style.display = 'block';
    document.getElementById('resultSection').style.display = 'none';

    document.getElementById('submitBtn').onclick = () => corregir(lista, esSimulacro);
    if (window.MathJax) MathJax.typesetPromise();
}

function corregir(lista, esSimulacro) {
    lista.forEach((q, i) => {
        const seleccion = document.querySelector(`input[name='p${i}']:checked`);
        respuestasUsuario[i] = seleccion ? parseInt(seleccion.value) : null;
    });

    let correctas = 0;
    let feedback = {};
    let detalle = '';

    lista.forEach((q, i) => {
        const userAnswerIndex = respuestasUsuario[i];
        const isCorrect = userAnswerIndex === q.respuesta;
        if (isCorrect) {
            correctas++;
        } else {
            const temaPregunta = obtenerTemaPregunta(q);
            feedback[temaPregunta] = (feedback[temaPregunta] || 0) + 1;
        }

        detalle += `<div class="question-feedback ${isCorrect ? 'correct' : 'incorrect'}">
            <h4>Pregunta ${i + 1}: ${q.pregunta}</h4>
            <div class="options-feedback">`;

        q.opciones.forEach((op, j) => {
            let optionClass = '';
            if (j === q.respuesta) optionClass = 'correct-answer';
            else if (j === userAnswerIndex) optionClass = 'user-answer';

            detalle += `<div class="option ${optionClass}">
                ${op}
                ${j === q.respuesta ? '<span class="feedback-icon">✓</span>' : ''}
                ${j === userAnswerIndex && !isCorrect ? '<span class="feedback-icon">✗</span>' : ''}
            </div>`;
        });

        detalle += `</div>
            <button class="show-solution-btn" data-index="${i}">Mostrar resolución paso a paso</button>
        </div>`;
    });

    let resultado = `<h3>Resultado: ${correctas} / ${lista.length} correctas (${Math.round(correctas / lista.length * 100)}%)</h3>`;
    resultado += `<div class="feedback-container">${detalle}</div>`;

    if (esSimulacro) {
        resultado += '<h4>Temas a reforzar:</h4><ul>';
        Object.keys(feedback).forEach(t => {
            resultado += `<li>${capitalizar(t)}: ${feedback[t]} error(es)</li>`;
        });
        resultado += '</ul>';
    }

    const resultSection = document.getElementById('resultSection');
    resultSection.innerHTML = resultado;
    resultSection.style.display = 'block';
    document.getElementById('contentSection').style.display = 'none';

    if (timer) clearInterval(timer);
    if (window.MathJax) MathJax.typesetPromise();

    document.querySelectorAll('.show-solution-btn').forEach(btn => {
        btn.onclick = () => mostrarResolucion(parseInt(btn.dataset.index), lista);
    });
}

const resolucionCache = {};

async function mostrarResolucion(idx, lista) {
    const q = lista[idx];
    const tema = obtenerTemaPregunta(q);
    const archivo = `./data/practica/practica${capitalizar(tema)}.html`;
    const resolId = `resolucion-${q.id}`;

    let htmlTema;
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
            <div class="resolucion-text">${resolHtml}</div>
            <button class="close-modal-btn">Volver a revisión</button>
        </div>
    `;
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';

    modal.querySelector('.close-modal-btn').onclick = () => {
        document.body.removeChild(modal);
        document.body.style.overflow = '';
    };

    if (window.MathJax) MathJax.typesetPromise([modal]);
}

function iniciarTemporizador() {
    timer = setInterval(() => {
        tiempoRestante--;
        document.getElementById('tiempo').textContent = tiempoRestante;
        if (tiempoRestante <= 0) {
            clearInterval(timer);
            corregir(preguntasActuales, true);
        }
    }, 1000);
}

function obtenerTemaPregunta(q) {
    for (let t in preguntas) {
        if (preguntas[t].includes(q)) return t;
    }
    return 'desconocido';
}
