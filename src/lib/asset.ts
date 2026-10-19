// Resuelve archivos de /public respetando la ruta base (GitHub Pages).
export const asset = (ruta: string) => (ruta ? import.meta.env.BASE_URL + ruta.replace(/^\//, '') : '');
