let teoria = {};

fetch('teoria.json')
    .then(res => res.json())
    .then(data => {
        teoria = data;
    })

// --- Variables globales ---
let preguntas = {};
let resoluciones = {};
let modo = "estudio";
let tema = "funciones";
let preguntasActuales = [];
let respuestasUsuario = [];
let timer = null;
let tiempoRestante = 0;

// --- Elementos DOM ---
const modeSelector = document.getElementById('mode');
const topicSelector = document.getElementById('topic');
const startBtn = document.getElementById('startBtn');
const contentSection = document.getElementById('contentSection');
const resultSection = document.getElementById('resultSection');

// --- Cargar preguntas y resoluciones desde JSON externo ---
startBtn.disabled = true;
fetch('preguntas.json')
    .then(res => res.json())
    .then(data => {
        if (data && data.preguntas) {
            preguntas = data.preguntas;
        }
        if (data && data.resoluciones) {
            resoluciones = data.resoluciones;
        }
        startBtn.disabled = false;
    })
    .catch(() => {
        startBtn.disabled = false;
        alert('No se pudieron cargar las preguntas.');
    });

// --- Funciones principales ---
modeSelector.addEventListener('change', () => {
    modo = modeSelector.value;
    topicSelector.disabled = (modo === 'simulacro');
});

startBtn.addEventListener('click', () => {
    modo = modeSelector.value;
    tema = topicSelector.value;
    contentSection.style.display = 'block';
    resultSection.style.display = 'none';
    if (modo === 'estudio') mostrarTeoria();
    else if (modo === 'practica') iniciarPractica();
    else if (modo === 'simulacro') iniciarSimulacro();
});

function mostrarTeoria() {
    const resumen = teoria[tema].resumen.replace(/\n/g, '<br>');
    const ejemplo = teoria[tema].ejemplo.replace(/\n/g, '<br>');
    contentSection.innerHTML = `
        <h2>${capitalizar(tema)}</h2>
        <p><b>Resumen:</b> ${resumen}</p>
        <p><b>Ejemplo:</b> ${ejemplo}</p>
    `;
    if (window.MathJax) MathJax.typesetPromise();
}

function iniciarPractica() {
    if (!preguntas[tema] || preguntas[tema].length === 0) {
        contentSection.innerHTML = '<p>No hay preguntas para este tema.</p>';
        return;
    }
    preguntasActuales = [...preguntas[tema]];
    mostrarPreguntas(preguntasActuales, false);
}

function iniciarSimulacro() {
    // Mezcla preguntas de todos los temas
    let todas = [];
    Object.keys(preguntas).forEach(t => {
        todas = todas.concat(preguntas[t]);
    });
    preguntasActuales = mezclarArray(todas).slice(0, 10); // 10 preguntas mixtas
    tiempoRestante = 600;
    mostrarPreguntas(preguntasActuales, true);
    iniciarTemporizador();
}

function mostrarPreguntas(lista, esSimulacro) {
    respuestasUsuario = Array(lista.length).fill(null);
    let html = '';
    if (esSimulacro) {
        html = `<div id="timer">Tiempo restante: <span id="tiempo">${tiempoRestante}</span> s</div>`;
    }
    lista.forEach((q, i) => {
        html += `<div class="pregunta">
            <p><b>${i+1}. ${q.pregunta}</b></p>
            ${q.opciones.map((op, j) => `
                <label class="option-label">
                    <input type="radio" name="p${i}" value="${j}">
                    <span class="option-text">${op}</span>
                </label><br>
            `).join('')}
        </div>`;
    });
    html += `<button id="submitBtn">Finalizar</button>`;
    contentSection.innerHTML = html;
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
            <h4>Pregunta ${i+1}: ${q.pregunta}</h4>
            <div class="options-feedback">`;
        q.opciones.forEach((op, j) => {
            let optionClass = '';
            if (j === q.respuesta) {
                optionClass = 'correct-answer';
            } else if (j === userAnswerIndex) {
                optionClass = 'user-answer';
            }
            detalle += `<div class="option ${optionClass}">
                ${op}
                ${j === q.respuesta ? '<span class=\"feedback-icon\">✓</span>' : ''}
                ${j === userAnswerIndex && !isCorrect ? '<span class=\"feedback-icon\">✗</span>' : ''}
            </div>`;
        });
        detalle += `</div>
            <button class="show-solution-btn" data-index="${i}">Mostrar resolución paso a paso</button>
        </div>`;
    });
    let total = lista.length;
    let resultado = `<h3>Resultado: ${correctas} / ${total} correctas (${Math.round(correctas/total*100)}%)</h3>`;
    resultado += `<div class="feedback-container">${detalle}</div>`;
    if (esSimulacro) {
        resultado += '<h4>Temas a reforzar:</h4><ul>';
        Object.keys(feedback).forEach(t => {
            resultado += `<li>${capitalizar(t)}: ${feedback[t]} error(es)</li>`;
        });
        resultado += '</ul>';
    }
    resultSection.innerHTML = resultado;
    resultSection.style.display = 'block';
    contentSection.style.display = 'none';
    if (timer) clearInterval(timer);
    if (window.MathJax) MathJax.typesetPromise();
    document.querySelectorAll('.show-solution-btn').forEach(btn => {
        btn.onclick = () => mostrarResolucion(parseInt(btn.dataset.index), lista);
    });
}

function mostrarResolucion(idx, lista) {
    let resol = '';
    const q = lista[idx];
    if (resoluciones && q && q.id && resoluciones[q.id]) {
        resol = resoluciones[q.id];
    } else if (q && q.resolucion) {
        resol = q.resolucion;
    } else {
        resol = '<i>No hay resolución detallada disponible para esta pregunta.</i>';
    }
    const modal = document.createElement('div');
    modal.className = 'modal-resolucion';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>Resolución paso a paso</h3>
            <div class="resolucion-text">${resol}</div>
            <button class="close-modal-btn">Volver a revisión</button>
        </div>
    `;
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    if (window.MathJax) MathJax.typesetPromise([modal]);
    modal.querySelector('.close-modal-btn').onclick = () => {
        document.body.removeChild(modal);
        document.body.style.overflow = '';
    };
}

function iniciarTemporizador() {
    timer = setInterval(() => {
        tiempoRestante--;
        document.getElementById('tiempo').textContent = tiempoRestante;
        if (tiempoRestante <= 0) {
            clearInterval(timer);
            // Recoge las respuestas seleccionadas hasta el momento
            preguntasActuales.forEach((q, i) => {
                const seleccion = document.querySelector(`input[name='p${i}']:checked`);
                respuestasUsuario[i] = seleccion ? parseInt(seleccion.value) : null;
            });
            corregir(preguntasActuales, true);
        }
    }, 1000);
}

function mezclarArray(arr) {
    return arr.map(v => [v, Math.random()]).sort((a,b) => a[1]-b[1]).map(v => v[0]);
}

function capitalizar(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function obtenerTemaPregunta(q) {
    for (let t in preguntas) {
        if (preguntas[t].includes(q)) return t;
    }
    return;
}
