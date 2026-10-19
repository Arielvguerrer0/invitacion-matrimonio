import { useId, useMemo } from 'react';

type P = [number, number];
const bez = (a: P, b: P, c: P, t: number): P => {
  const u = 1 - t;
  return [u * u * a[0] + 2 * u * t * b[0] + t * t * c[0], u * u * a[1] + 2 * u * t * b[1] + t * t * c[1]];
};
const tan = (a: P, b: P, c: P, t: number): P => [
  2 * (1 - t) * (b[0] - a[0]) + 2 * t * (c[0] - b[0]),
  2 * (1 - t) * (b[1] - a[1]) + 2 * t * (c[1] - b[1]),
];
const grados = (v: P) => (Math.atan2(v[1], v[0]) * 180) / Math.PI;

const HOJA = 'M0 0 Q6 -3.4 13 0 Q6 3.4 0 0Z';
const PETALO = 'M0 0 Q2.8 -3.2 0 -6.4 Q-2.8 -3.2 0 0Z';

function Flor({ x, y, r = 1, fill, centro }: { x: number; y: number; r?: number; fill: string; centro: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${r})`}>
      {[0, 72, 144, 216, 288].map((g) => <path key={g} d={PETALO} transform={`rotate(${g})`} fill={fill} />)}
      <circle r="1.4" fill={centro} />
    </g>
  );
}

// Rama de laurel dorado (una mitad); se refleja para la otra.
function Rama({ fill }: { fill: string }) {
  const p0: P = [100, 118], p1: P = [34, 112], p2: P = [28, 22];
  const tallo = `M${p0} Q${p1} ${p2}`;
  const hojas = useMemo(() => {
    const out: { x: number; y: number; rot: number; s: number }[] = [];
    let lado = 1;
    for (let t = 0.08; t <= 0.97; t += 0.055) {
      const [x, y] = bez(p0, p1, p2, t);
      const ang = grados(tan(p0, p1, p2, t));
      out.push({ x, y, rot: ang + lado * 46, s: 1.55 - t * 0.6 });
      lado *= -1;
    }
    const [x, y] = bez(p0, p1, p2, 1);
    out.push({ x, y, rot: grados(tan(p0, p1, p2, 1)), s: 0.95 });
    return out;
  }, []);
  const flores = [0.26, 0.48, 0.7, 0.9].map((t, i) => {
    const [x, y] = bez(p0, p1, p2, t);
    return { x: x - 11 + i * 2, y: y - 3, r: 1.55 - i * 0.18 };
  });
  return (
    <g>
      <path d={tallo} fill="none" stroke={fill} strokeWidth="1.8" strokeLinecap="round" />
      {hojas.map((h, i) => (
        <path key={i} d={HOJA} fill={fill} transform={`translate(${h.x.toFixed(1)} ${h.y.toFixed(1)}) rotate(${h.rot.toFixed(1)}) scale(${h.s.toFixed(2)})`} />
      ))}
      {flores.map((f, i) => <Flor key={i} x={f.x} y={f.y} r={f.r} fill={fill} centro="#9C7A36" />)}
    </g>
  );
}

export function Laurel({ className }: { className?: string }) {
  const id = useId().replace(/:/g, '');
  const oro = `url(#oro-${id})`;
  return (
    <svg className={className} viewBox="0 0 200 150" aria-hidden="true">
      <defs>
        <linearGradient id={`oro-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F6E7B8" />
          <stop offset="0.35" stopColor="#CDA75C" />
          <stop offset="0.6" stopColor="#F0DCA0" />
          <stop offset="1" stopColor="#A8843F" />
        </linearGradient>
      </defs>
      <Rama fill={oro} />
      <g transform="translate(200 0) scale(-1 1)"><Rama fill={oro} /></g>
    </svg>
  );
}

export function SelloCera({ className }: { className?: string }) {
  const id = useId().replace(/:/g, '');
  const borde = useMemo(() => {
    const pts = Array.from({ length: 40 }, (_, i) => {
      const a = (i / 40) * Math.PI * 2;
      const r = 36 + Math.sin(i * 2.3) * 1.6 + Math.cos(i * 5.1) * 1.1;
      return `${(40 + r * Math.cos(a)).toFixed(1)} ${(40 + r * Math.sin(a)).toFixed(1)}`;
    });
    return `M${pts.join(' L')}Z`;
  }, []);
  return (
    <svg className={className} viewBox="0 0 80 80" aria-hidden="true">
      <defs>
        <radialGradient id={`cera-${id}`} cx="0.38" cy="0.32" r="0.75">
          <stop offset="0" stopColor="#F7E1A0" />
          <stop offset="0.45" stopColor="#D2AB57" />
          <stop offset="1" stopColor="#8E6B2C" />
        </radialGradient>
      </defs>
      <path d={borde} fill={`url(#cera-${id})`} />
      <circle cx="40" cy="40" r="27" fill="none" stroke="rgba(255,240,200,.55)" strokeWidth="1" />
      <circle cx="40" cy="40" r="25" fill="none" stroke="rgba(110,80,25,.45)" strokeWidth="2" />
      <g transform="translate(40 40) scale(2.3)">
        {[0, 72, 144, 216, 288].map((g) => (
          <path key={g} d={PETALO} transform={`rotate(${g})`} fill="#E6C774" stroke="#9A7633" strokeWidth="0.35" />
        ))}
        <circle r="1.5" fill="#A8843F" />
      </g>
    </svg>
  );
}

export function Azahar({ className }: { className?: string }) {
  const flores: [number, number, number][] = [[58, 40, 2.2], [92, 66, 2.6], [30, 22, 1.8], [118, 92, 1.9]];
  const hojas: [number, number, number, number][] = [
    [20, 34, 30, 3.4], [44, 58, -20, 3.8], [72, 30, 40, 3.2], [80, 86, -10, 4], [108, 62, 30, 3.6], [128, 112, 10, 3.2], [6, 12, 50, 2.6],
  ];
  return (
    <svg className={className} viewBox="0 0 160 140" aria-hidden="true">
      <path d="M-4 6 C34 22 70 46 136 118" fill="none" stroke="#5B7246" strokeWidth="2" strokeLinecap="round" />
      {hojas.map(([x, y, r, s], i) => (
        <path key={i} d={HOJA} transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`} fill={i % 2 ? '#3F5E37' : '#5E8048'} />
      ))}
      {flores.map(([x, y, s], i) => (
        <g key={i} transform={`translate(${x} ${y}) scale(${s})`}>
          {[0, 72, 144, 216, 288].map((g) => (
            <path key={g} d={PETALO} transform={`rotate(${g + i * 20})`} fill="#FFFFFF" stroke="#E2DCCD" strokeWidth="0.3" />
          ))}
          <circle r="1.6" fill="#E9C46A" />
          <circle r="0.6" cx="1" cy="-0.6" fill="#C79A3B" />
        </g>
      ))}
      <ellipse cx="74" cy="56" rx="3" ry="4.6" transform="rotate(30 74 56)" fill="#FFFFFF" stroke="#E2DCCD" strokeWidth="0.6" />
      <ellipse cx="104" cy="80" rx="2.6" ry="4" transform="rotate(40 104 80)" fill="#FFFFFF" stroke="#E2DCCD" strokeWidth="0.6" />
    </svg>
  );
}

export function Cinta({ className }: { className?: string }) {
  const d = 'M170 14 C128 24 150 74 108 86 C66 98 78 56 46 74 C22 88 34 112 8 126';
  return (
    <svg className={className} viewBox="0 0 170 130" aria-hidden="true">
      <path d={d} fill="none" stroke="#5F80C8" strokeWidth="17" strokeLinecap="round" />
      <path d={d} fill="none" stroke="#8FA9E0" strokeWidth="6" strokeLinecap="round" opacity="0.55" transform="translate(-2 -3)" />
    </svg>
  );
}

export function Pluma({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 220 40" aria-hidden="true">
      <path d="M24 13 L3 20 L24 27 Z" fill="#D2AE62" />
      <path d="M5 20 L22 20" stroke="#8E6B2C" strokeWidth="0.8" />
      <path d="M24 12 L44 10 L44 30 L24 28 Z" fill="#2B3866" />
      <rect x="42" y="9" width="166" height="22" rx="11" fill="#1F2A4D" />
      <rect x="150" y="9" width="7" height="22" fill="#C9A45C" />
      <rect x="160" y="6" width="44" height="4" rx="2" fill="#C9A45C" />
      <rect x="48" y="12" width="96" height="3" rx="1.5" fill="rgba(255,255,255,.18)" />
    </svg>
  );
}

export function SobreRegalo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 134" aria-hidden="true">
      <rect x="10" y="14" width="180" height="110" rx="3" fill="#FBF7EE" stroke="#E2D9C6" />
      <path d="M10 14 L100 76 L190 14" fill="none" stroke="#E2D9C6" strokeWidth="1.2" />
      <rect x="92" y="14" width="16" height="110" fill="#6F8FD0" />
      <rect x="10" y="62" width="180" height="14" fill="#6F8FD0" />
      <path d="M100 69 C80 40 58 50 70 66 C76 74 90 72 100 69Z" fill="#5F80C8" />
      <path d="M100 69 C120 40 142 50 130 66 C124 74 110 72 100 69Z" fill="#5F80C8" />
      <path d="M100 69 L86 104 L92 101 L95 110 Z" fill="#5F80C8" />
      <path d="M100 69 L114 104 L108 101 L105 110 Z" fill="#5F80C8" />
      <ellipse cx="100" cy="69" rx="7" ry="6" fill="#4C6CB4" />
    </svg>
  );
}

const PERCHA = (
  <g fill="none" stroke="#8A8577" strokeWidth="1.6" strokeLinecap="round">
    <path d="M60 22 C60 14 68 14 68 8 C68 3 60 2 58 7" />
    <path d="M60 22 L18 42 M60 22 L102 42" />
  </g>
);

export function Traje({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 170" aria-hidden="true">
      {PERCHA}
      <path d="M20 40 L45 33 L60 62 L75 33 L100 40 L108 150 L64 156 L60 96 L56 156 L12 150 Z" fill="#26345E" />
      <path d="M48 33 L60 62 L72 33 Z" fill="#FFFFFF" />
      <path d="M57 40 L60 37 L63 40 L61 62 L60 64 L59 62 Z" fill="#1A2444" />
      <path d="M45 33 L54 92 L60 62 Z" fill="#33467E" />
      <path d="M75 33 L66 92 L60 62 Z" fill="#33467E" />
      <path d="M80 70 L92 68 L92 72 L80 74 Z" fill="#FFFFFF" />
      <circle cx="61" cy="104" r="1.8" fill="#121A33" />
      <circle cx="61" cy="118" r="1.8" fill="#121A33" />
    </svg>
  );
}

export function Vestido({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 170" aria-hidden="true">
      {PERCHA}
      <path d="M44 40 L48 56 M76 40 L72 56" stroke="#6F8FD0" strokeWidth="2" strokeLinecap="round" />
      <path d="M46 55 Q60 64 74 55 L72 84 Q60 89 48 84 Z" fill="#6F8FD0" />
      <path d="M48 84 Q60 89 72 84 Q90 122 106 162 Q60 172 14 162 Q30 122 48 84 Z" fill="#7E9DDA" />
      <path d="M56 90 Q50 126 40 164 M64 90 Q70 126 80 165 M60 90 L60 167" fill="none" stroke="#A9C0EC" strokeWidth="1" opacity="0.8" />
    </svg>
  );
}
