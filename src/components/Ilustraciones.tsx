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
        {/* Foil dorado con un brillo que lo recorre */}
        <linearGradient id={`oro-${id}`} x1="0" y1="0" x2="0.55" y2="0.55" spreadMethod="reflect">
          <stop offset="0" stopColor="#A8843F" />
          <stop offset="0.3" stopColor="#D4B066" />
          <stop offset="0.48" stopColor="#FFF4D2" />
          <stop offset="0.62" stopColor="#D9B86E" />
          <stop offset="1" stopColor="#9C7A36" />
          <animateTransform attributeName="gradientTransform" type="translate" values="-0.55 -0.55; 0.55 0.55; -0.55 -0.55" dur="7s" repeatCount="indefinite" />
        </linearGradient>
      </defs>
      <Rama fill={oro} />
      <g transform="translate(200 0) scale(-1 1)"><Rama fill={oro} /></g>
    </svg>
  );
}

// Contorno irregular y suave (cera derramada).
function contorno(cx: number, cy: number, r: number, amp: number, n = 56) {
  const pts: P[] = Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2;
    const gota = Math.exp(-(((a - 0.9) * 2.4) ** 2)) * 3.2 + Math.exp(-(((a - 3.9) * 3) ** 2)) * 2.4;
    const rr = r + amp * (Math.sin(i * 1.7) * 0.6 + Math.sin(i * 0.55 + 1) * 0.8) + gota;
    return [cx + rr * Math.cos(a), cy + rr * Math.sin(a)];
  });
  const mid = (p: P, q: P) => `${((p[0] + q[0]) / 2).toFixed(2)} ${((p[1] + q[1]) / 2).toFixed(2)}`;
  let d = `M${mid(pts[n - 1], pts[0])}`;
  for (let i = 0; i < n; i++) d += ` Q${pts[i][0].toFixed(2)} ${pts[i][1].toFixed(2)} ${mid(pts[i], pts[(i + 1) % n])}`;
  return `${d}Z`;
}

export function SelloCera({ className, monograma = '&' }: { className?: string; monograma?: string }) {
  const id = useId().replace(/:/g, '');
  const derrame = useMemo(() => contorno(40, 40, 34.5, 1.6), []);
  const texto = (fill: string, dx: number, dy: number) => (
    <text x={40 + dx} y={47 + dy} textAnchor="middle" fontFamily="'Pinyon Script', cursive" fontSize={monograma.length > 1 ? 19 : 28} fill={fill}>
      {monograma}
    </text>
  );
  return (
    <svg className={className} viewBox="0 0 80 80" aria-hidden="true">
      <defs>
        <radialGradient id={`cera-${id}`} cx="0.36" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#F6DFA0" />
          <stop offset="0.5" stopColor="#D1AA57" />
          <stop offset="1" stopColor="#8C6A2B" />
        </radialGradient>
        <radialGradient id={`hundido-${id}`} cx="0.62" cy="0.68" r="0.75">
          <stop offset="0" stopColor="#F1D995" />
          <stop offset="0.6" stopColor="#D8B464" />
          <stop offset="1" stopColor="#B38D42" />
        </radialGradient>
        <radialGradient id={`brillo-${id}`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.75" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
      </defs>
      <g transform="rotate(-8 40 40)">
        <path d={derrame} fill={`url(#cera-${id})`} />
        <circle cx="39.3" cy="39.3" r="27.6" fill="none" stroke="rgba(255,244,205,.7)" strokeWidth="1.6" />
        <circle cx="40.7" cy="40.7" r="27.6" fill="none" stroke="rgba(95,65,20,.5)" strokeWidth="1.6" />
        <circle cx="40" cy="40" r="26.6" fill={`url(#hundido-${id})`} />
        <circle cx="40" cy="40" r="22.5" fill="none" stroke="rgba(120,88,30,.5)" strokeWidth="1.1" strokeDasharray="0.4 2.4" strokeLinecap="round" />
        {texto('rgba(255,242,205,.85)', -0.7, -0.7)}
        {texto('rgba(100,70,20,.65)', 0.8, 0.8)}
        {texto('#D3AE5E', 0, 0)}
        <ellipse cx="27" cy="22" rx="11" ry="5" transform="rotate(-32 27 22)" fill={`url(#brillo-${id})`} />
        <ellipse cx="55" cy="60" rx="5" ry="2" transform="rotate(-32 55 60)" fill={`url(#brillo-${id})`} opacity="0.5" />
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
      <path d={d} fill="none" stroke="#9481C6" strokeWidth="17" strokeLinecap="round" />
      <path d={d} fill="none" stroke="#7764AE" strokeWidth="17" strokeLinecap="round" opacity="0.5" transform="translate(1.5 2)" />
      <path d={d} fill="none" stroke="#9481C6" strokeWidth="15" strokeLinecap="round" />
      <path d={d} fill="none" stroke="#D3C7F0" strokeWidth="5" strokeLinecap="round" opacity="0.7" transform="translate(-2 -3)" />
    </svg>
  );
}

export function Pluma({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 220 40" aria-hidden="true">
      <path d="M24 13 L3 20 L24 27 Z" fill="#D2AE62" />
      <path d="M5 20 L22 20" stroke="#8E6B2C" strokeWidth="0.8" />
      <path d="M24 12 L44 10 L44 30 L24 28 Z" fill="#4A3A6B" />
      <rect x="42" y="9" width="166" height="22" rx="11" fill="#3B2E57" />
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
      <rect x="92" y="14" width="16" height="110" fill="#A08ED0" />
      <rect x="10" y="62" width="180" height="14" fill="#A08ED0" />
      <path d="M100 69 C80 40 58 50 70 66 C76 74 90 72 100 69Z" fill="#8C79C0" />
      <path d="M100 69 C120 40 142 50 130 66 C124 74 110 72 100 69Z" fill="#8C79C0" />
      <path d="M100 69 L86 104 L92 101 L95 110 Z" fill="#8C79C0" />
      <path d="M100 69 L114 104 L108 101 L105 110 Z" fill="#8C79C0" />
      <ellipse cx="100" cy="69" rx="7" ry="6" fill="#7461A8" />
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
      <path d="M20 40 L45 33 L60 62 L75 33 L100 40 L108 150 L64 156 L60 96 L56 156 L12 150 Z" fill="#2F2A44" />
      <path d="M48 33 L60 62 L72 33 Z" fill="#FFFFFF" />
      <path d="M57 40 L60 37 L63 40 L61 62 L60 64 L59 62 Z" fill="#8C79C0" />
      <path d="M45 33 L54 92 L60 62 Z" fill="#3E3859" />
      <path d="M75 33 L66 92 L60 62 Z" fill="#3E3859" />
      <path d="M80 70 L92 68 L92 72 L80 74 Z" fill="#C9BCEB" />
      <circle cx="61" cy="104" r="1.8" fill="#1C1830" />
      <circle cx="61" cy="118" r="1.8" fill="#1C1830" />
    </svg>
  );
}

export function Vestido({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 170" aria-hidden="true">
      {PERCHA}
      <path d="M44 40 L48 56 M76 40 L72 56" stroke="#9481C6" strokeWidth="2" strokeLinecap="round" />
      <path d="M46 55 Q60 64 74 55 L72 84 Q60 89 48 84 Z" fill="#9481C6" />
      <path d="M48 84 Q60 89 72 84 Q90 122 106 162 Q60 172 14 162 Q30 122 48 84 Z" fill="#AE9DDB" />
      <path d="M56 90 Q50 126 40 164 M64 90 Q70 126 80 165 M60 90 L60 167" fill="none" stroke="#D6CCF2" strokeWidth="1" opacity="0.85" />
    </svg>
  );
}
