export type Confirmacion = {
  nombre: string;
  asiste: boolean;
  mensaje: string;
};

// Por ahora guarda en el navegador (localStorage) para poder probar.
// Cuando elijamos backend (Supabase o Google Sheets) solo cambia esta función.
export async function guardarConfirmacion(c: Confirmacion) {
  const clave = 'confirmaciones';
  const previas = JSON.parse(localStorage.getItem(clave) ?? '[]');
  previas.push({ ...c, enviadoEn: new Date().toISOString() });
  localStorage.setItem(clave, JSON.stringify(previas));
  console.info('Confirmación guardada (local):', c);
  await new Promise((r) => setTimeout(r, 700));
}
