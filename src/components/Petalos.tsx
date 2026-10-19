import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';

const COLORES = ['#C9B8EA', '#B5A1E0', '#E6DCF5', '#FFFFFF', '#D9C9F0'];

// Lluvia de pétalos lila que cae una sola vez al abrir el sobre.
export function Petalos({ cantidad = 26 }: { cantidad?: number }) {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 14000);
    return () => clearTimeout(t);
  }, []);

  const petalos = useMemo(() => Array.from({ length: cantidad }, (_, i) => {
    const r = (k: number) => { const x = Math.sin(i * 91.7 + k * 13.3) * 43758.5453; return x - Math.floor(x); };
    return {
      left: r(1) * 100,
      delay: 0.9 + r(2) * 1.8,
      dur: 6 + r(3) * 4.5,
      size: 10 + r(4) * 12,
      sway: (r(5) - 0.5) * 140,
      rot: r(6) * 360,
      color: COLORES[i % COLORES.length],
    };
  }), [cantidad]);

  if (!visible) return null;
  return (
    <div className="petalos" aria-hidden="true">
      {petalos.map((p, i) => (
        <motion.svg
          key={i}
          viewBox="0 0 20 20"
          style={{ left: `${p.left}%`, width: p.size, height: p.size }}
          initial={{ y: '-8vh', x: 0, rotate: p.rot, opacity: 0 }}
          animate={{ y: '108vh', x: [0, p.sway, -p.sway / 2, p.sway / 3], rotate: p.rot + 420, opacity: [0, 1, 1, 0] }}
          transition={{ duration: p.dur, delay: p.delay, ease: 'linear' }}
        >
          <path d="M10 1 C16 5 17 13 10 19 C3 13 4 5 10 1Z" fill={p.color} stroke="rgba(110,90,150,.3)" strokeWidth="0.5" />
          <path d="M10 3 L10 16" stroke="rgba(110,90,150,.18)" strokeWidth="0.5" />
        </motion.svg>
      ))}
    </div>
  );
}
