const pad = (n: number) => String(n).padStart(2, '0');

export function formatearFecha(iso: string) {
  const t = new Date(iso);
  const mes = t.toLocaleDateString('es-CL', { month: 'long' });
  const diaSemana = t.toLocaleDateString('es-CL', { weekday: 'long' });
  const h = t.getHours();
  const momento = h < 12 ? 'de la mañana' : h < 20 ? 'de la tarde' : 'de la noche';
  return {
    fecha: t,
    dia: t.getDate(),
    mes: mes.charAt(0).toUpperCase() + mes.slice(1),
    anio: t.getFullYear(),
    diaSemana: diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1),
    corta: `${t.getDate()} · ${mes} · ${t.getFullYear()}`,
    numerica: `${pad(t.getDate())} · ${pad(t.getMonth() + 1)} · ${String(t.getFullYear()).slice(2)}`,
    hora: `${h % 12 || 12}:${pad(t.getMinutes())} ${momento}`,
  };
}

export function restante(objetivo: Date, ahora: number) {
  const diff = Math.max(0, objetivo.getTime() - ahora);
  return [
    { valor: String(Math.floor(diff / 864e5)), etiqueta: 'Días' },
    { valor: pad(Math.floor(diff / 36e5) % 24), etiqueta: 'Horas' },
    { valor: pad(Math.floor(diff / 6e4) % 60), etiqueta: 'Min' },
    { valor: pad(Math.floor(diff / 1e3) % 60), etiqueta: 'Seg' },
  ];
}

// Semanas del mes (lunes primero) para el calendario.
export function semanasDelMes(fecha: Date) {
  const anio = fecha.getFullYear();
  const mes = fecha.getMonth();
  const offset = (new Date(anio, mes, 1).getDay() + 6) % 7;
  const dias = new Date(anio, mes + 1, 0).getDate();
  const celdas: (number | null)[] = [...Array(offset).fill(null), ...Array.from({ length: dias }, (_, i) => i + 1)];
  while (celdas.length % 7) celdas.push(null);
  return Array.from({ length: celdas.length / 7 }, (_, i) => celdas.slice(i * 7, i * 7 + 7));
}

// Descarga un .ics para agregar el evento al calendario.
export function descargarIcs(titulo: string, inicio: Date, horas: number, lugar: string) {
  const f = (d: Date) =>
    `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
  const fin = new Date(inicio.getTime() + horas * 36e5);
  const ics = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//invitacion//ES', 'BEGIN:VEVENT',
    `UID:${inicio.getTime()}@invitacion`, `DTSTART:${f(inicio)}`, `DTEND:${f(fin)}`,
    `SUMMARY:${titulo}`, `LOCATION:${lugar}`, 'END:VEVENT', 'END:VCALENDAR',
  ].join('\r\n');
  const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = 'matrimonio.ics';
  a.click();
  URL.revokeObjectURL(url);
}
