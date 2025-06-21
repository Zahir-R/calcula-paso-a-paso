export function capitalizar(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export function mezclarArray(arr) {
    return arr.map(v => [v, Math.random()]).sort((a, b) => a[1] - b[1]).map(v => v[0]);
}