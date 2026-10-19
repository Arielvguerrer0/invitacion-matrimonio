import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

// Aparición "de tinta": de borroso a nítido al entrar en pantalla.
export function Tinta({ children, retraso = 0, className }: { children: ReactNode; retraso?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 14, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 1.1, delay: retraso, ease: [0.2, 0.7, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}

// Título de dos líneas: la segunda en cursiva.
export function Titulo({ eyebrow, lineas, claro = false }: { eyebrow?: string; lineas: readonly string[]; claro?: boolean }) {
  return (
    <div className={`titulo-bloque${claro ? ' claro' : ''}`}>
      {eyebrow && <Tinta><div className="eyebrow">{eyebrow}</div></Tinta>}
      <h2 className="titulo">
        {lineas.map((l, i) => (
          <Tinta key={l} retraso={0.12 + i * 0.18}>
            <span className={i === 1 ? 'titulo-cursiva' : undefined}>{l}</span>
          </Tinta>
        ))}
      </h2>
    </div>
  );
}
