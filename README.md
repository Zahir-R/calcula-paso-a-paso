# Calcula Paso A Paso - Plataforma de Práctica de Cálculo I

Herramienta interactiva para practicar cálculo diferencial e integral, diseñada para estudiantes universitarios. Incluye modos de estudio, práctica y simulacro con retroalimentación inmediata.

**[Ver en vivo](https://zahir-r.github.io/calcula-paso-a-paso/)**

## Características principales

### Modo Estudio
- Teoría organizada por temas (funciones, límites, derivadas e integrales)
- Ejemplos resueltos con MathJax para visualizar fórmulas

###  Modo Práctica
- Banco de +50 preguntas con selección aleatoria
- 10 preguntas por sesión
- Retroalimentación inmediata al finalizar
- Resoluciones paso a paso para cada problema

### Modo Simulacro
- Examen integrado con preguntas de todos los temas
- Temporizador de 30 minutos
- Diagnóstico de temas a reforzar
- Guardado automático de progreso (localStorage)

## Tecnologías utilizadas
- **Frontend**: HTML5, CSS3, JavaScript
- **Renderizado matemático**: MathJax 3
- **Optimización**: Lazy loading, requestIdleCallback, carga modular
- **Hosting**: GitHub Pages

## Estructura del proyecto
```
calcula-paso-a-paso/
├── assets/
│   ├── css/               # Estilos principales
│   ├── js/                # Código modularizado
├── data/
│   ├── practica/          # Banco de preguntas y respuestas
│   └── teoria/            # Archivos HTML con teoría
├── index.html             # Punto de entrada
└── LICENSE                # Licencia MIT
```

## Cómo usar
1. Selecciona un modo:
   - **Estudio**: Para aprender teoría y ejemplos
   - **Práctica**: Para ejercitar un tema específico
   - **Simulacro**: Para evaluar todos los temas bajo tiempo
2. Elige un tema (excepto en simulacro)
3. Presiona el botón de comenzar para desplegar el modo seleccionado
4. Consulta soluciones paso a paso
5. Revisa tu progreso al finalizar

## Ejecutar localmente
```
git clone https://github.com/zahir-r/calcula-paso-a-paso.git
cd calcula-paso-a-paso
# No se requieren dependencias - solo abrir index.html
```

## Licencia
Este proyecto está bajo la licencia MIT. Consulta el archivo [LICENSE](LICENSE) para más detalles.
