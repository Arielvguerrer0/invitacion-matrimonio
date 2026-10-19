const RUTAS = {
  calendario: 'M3 5h18v16H3zM3 10h18M8 3v4M16 3v4',
  pin: 'M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11zM14.5 10a2.5 2.5 0 1 1-5 0a2.5 2.5 0 0 1 5 0z',
  pluma: 'M4 20l4-1 11-11-3-3L5 16zM14 7l3 3',
  tarjeta: 'M3 6h18v12H3zM3 10h18M7 15h4',
  copiar: 'M9 9h11v11H9zM5 15V5a2 2 0 0 1 2-2h8',
  check: 'M5 12l5 5 9-10',
  x: 'M6 6l12 12M18 6L6 18',
  menos: 'M6 12h12',
  mas: 'M12 6v12M6 12h12',
  abajo: 'M6 9l6 6 6-6',
  sonido: 'M4 9v6h4l5 4V5L8 9zM16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11',
  silencio: 'M4 9v6h4l5 4V5L8 9zM17 9l5 6M22 9l-5 6',
} as const;

export type NombreIcono = keyof typeof RUTAS;

export function Icono({ nombre, size = 18, grosor = 1.6 }: { nombre: NombreIcono; size?: number; grosor?: number }) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={grosor} strokeLinecap="round" strokeLinejoin="round">
      <path d={RUTAS[nombre]} />
    </svg>
  );
}
