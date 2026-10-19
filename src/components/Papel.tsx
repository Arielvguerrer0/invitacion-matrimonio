import { useMemo, type CSSProperties, type ReactNode } from 'react';

type Lados = { arriba?: boolean; derecha?: boolean; abajo?: boolean; izquierda?: boolean };

const rnd = (i: number, s: number) => {
  const x = Math.sin(i * 127.1 + s * 311.7) * 43758.5453;
  return x - Math.floor(x);
};

// Borde de papel rasgado como clip-path.
export function deckle(lados: Lados, semilla = 1, amp = 0.9, pasos = 56) {
  const p: string[] = [];
  const v = (i: number, k: number, m = 1) => rnd(i, semilla + k) * amp * m;
  const pct = (i: number) => ((i / pasos) * 100).toFixed(2);
  for (let i = 0; i <= pasos; i++) p.push(`${pct(i)}% ${lados.arriba ? v(i, 1).toFixed(2) : 0}%`);
  for (let i = 1; i <= pasos; i++) p.push(`${lados.derecha ? (100 - v(i, 2, 1.6)).toFixed(2) : 100}% ${pct(i)}%`);
  for (let i = pasos - 1; i >= 0; i--) p.push(`${pct(i)}% ${lados.abajo ? (100 - v(i, 3)).toFixed(2) : 100}%`);
  for (let i = pasos - 1; i >= 1; i--) p.push(`${lados.izquierda ? v(i, 4, 1.6).toFixed(2) : 0}% ${pct(i)}%`);
  return `polygon(${p.join(',')})`;
}

const TODOS: Lados = { arriba: true, derecha: true, abajo: true, izquierda: true };

export function Papel({ children, semilla = 1, rotar = 0, className = '', style }: {
  children: ReactNode; semilla?: number; rotar?: number; className?: string; style?: CSSProperties;
}) {
  const clip = useMemo(() => deckle(TODOS, semilla, 0.7), [semilla]);
  return (
    <div className="papel-sombra" style={{ transform: rotar ? `rotate(${rotar}deg)` : undefined, ...style }}>
      <div className={`papel ${className}`} style={{ clipPath: clip }}>{children}</div>
    </div>
  );
}
