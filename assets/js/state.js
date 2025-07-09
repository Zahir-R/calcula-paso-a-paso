export let nTemporizador = null;
// Programa un nuevo temporizador para no sobreescribir uno antiguo
export function programarTemporizador(nuevoTemporizador){
    nTemporizador = nuevoTemporizador;
}