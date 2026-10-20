import { useEffect, useMemo, useRef, useState, type PointerEvent } from 'react';
import {
  AnimatePresence, animate, motion, useMotionTemplate, useMotionValue, useSpring,
  type AnimationPlaybackControls,
} from 'framer-motion';
import { boda } from '../config';
import { formatearFecha } from '../lib/fecha';
import { asset } from '../lib/asset';
import { deckle } from './Papel';
import { Azahar, Cinta, Laurel, SelloCera } from './Ilustraciones';
import { Icono } from './Icono';
import { Petalos } from './Petalos';

type Etapa = 'cerrado' | 'abriendo' | 'abierto';
type Props = { invitado: string; onAbrir: () => void; onAbierto: () => void };

const EASE_PUERTA = [0.65, 0, 0.25, 1] as const;

const inicial = (n: string) => (n.startsWith('[') ? '' : n.trim().charAt(0).toUpperCase());

export function Sobre({ invitado, onAbrir, onAbierto }: Props) {
  const [etapa, setEtapa] = useState<Etapa>('cerrado');
  const f = formatearFecha(boda.fecha);
  const [a, b] = boda.novios;
  const abierto = etapa !== 'cerrado';
  const monograma = inicial(a) && inicial(b) ? `${inicial(a)}&${inicial(b)}` : '&';

  const clipIzq = useMemo(() => deckle({ arriba: true, izquierda: true, abajo: true }, 3, 0.6), []);
  const clipDer = useMemo(() => deckle({ arriba: true, derecha: true, abajo: true }, 7, 0.6), []);
  const flecoIzq = useMemo(() => deckle({ arriba: true, izquierda: true, abajo: true }, 5, 1.3), []);
  const flecoDer = useMemo(() => deckle({ arriba: true, derecha: true, abajo: true }, 9, 1.3), []);
  const clipTarjeta = useMemo(() => deckle({ arriba: true, derecha: true, abajo: true, izquierda: true }, 11, 0.5), []);

  // Inclinación 3D y reflejo de luz que siguen al dedo / mouse.
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const gx = useMotionValue(30);
  const gy = useMotionValue(25);
  const srx = useSpring(rx, { stiffness: 70, damping: 14 });
  const sry = useSpring(ry, { stiffness: 70, damping: 14 });
  const reflejo = useMotionTemplate`radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,.42), rgba(255,255,255,0) 48%)`;
  const reposo = useRef<AnimationPlaybackControls[]>([]);

  useEffect(() => {
    reposo.current = [
      animate(gx, [20, 80, 20], { duration: 7, repeat: Infinity, ease: 'easeInOut' }),
      animate(gy, [18, 62, 18], { duration: 9, repeat: Infinity, ease: 'easeInOut' }),
      animate(ry, [-4, 4, -4], { duration: 8, repeat: Infinity, ease: 'easeInOut' }),
      animate(rx, [3, -2, 3], { duration: 10, repeat: Infinity, ease: 'easeInOut' }),
    ];
    return () => reposo.current.forEach((c) => c.stop());
  }, [gx, gy, rx, ry]);

  const mover = (e: PointerEvent<HTMLElement>) => {
    if (abierto) return;
    reposo.current.forEach((c) => c.stop());
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    ry.set((x - 0.5) * 16);
    rx.set(-(y - 0.5) * 12);
    gx.set(x * 100);
    gy.set(y * 100);
  };

  const abrir = () => {
    if (abierto) return;
    reposo.current.forEach((c) => c.stop());
    rx.set(0);
    ry.set(0);
    setEtapa('abriendo');
    onAbrir();
    setTimeout(() => { setEtapa('abierto'); onAbierto(); }, 3000);
  };

  const item = {
    oculto: { opacity: 0, y: 10, filter: 'blur(6px)' },
    visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 1 } },
  };

  const puerta = (lado: 'izq' | 'der') => {
    const izq = lado === 'izq';
    return (
      <motion.div
        className={`puerta puerta-${lado}`}
        style={{ transformOrigin: izq ? '0% 50%' : '100% 50%' }}
        animate={{ rotateY: abierto ? (izq ? -172 : 172) : 0 }}
        transition={{ duration: 2, delay: 0.55, ease: EASE_PUERTA }}
      >
        <div className="puerta-fleco" style={{ clipPath: izq ? flecoIzq : flecoDer }} />
        <div className="puerta-cara" style={{ clipPath: izq ? clipIzq : clipDer }}>
          <div className="puerta-arte" style={{ left: izq ? 0 : '-100%' }}><Laurel className="laurel" /></div>
          <div className="fibra" />
        </div>
        <div className="puerta-dorso" style={{ clipPath: izq ? clipIzq : clipDer }}><div className="fibra" /></div>
        {/* Cada puerta lleva la mitad del sello: al abrir, el sello se parte */}
        <div className={`sello-mitad sello-${lado}`}><SelloCera monograma={monograma} /></div>
      </motion.div>
    );
  };

  return (
    <section className="hero" onPointerMove={mover}>
      <div className="hero-vineta" aria-hidden="true" />
      <motion.div className="deco-azahar" initial={{ opacity: 0, x: -20, y: -20 }} animate={{ opacity: 1, x: 0, y: 0 }} transition={{ duration: 1.4 }}>
        <Azahar />
      </motion.div>
      <motion.div className="deco-cinta" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1.4, delay: 0.2 }}>
        <Cinta />
      </motion.div>

      <motion.div className="hero-encabezado" animate={{ opacity: abierto ? 0 : 1, y: abierto ? -12 : 0 }} transition={{ duration: 0.6 }}>
        <div className="eyebrow">Una invitación</div>
        <div className="script hero-para">para {invitado}</div>
      </motion.div>

      <div className="porton-escena">
        <motion.div
          className="porton"
          style={{ rotateX: srx, rotateY: sry }}
          onClick={abrir}
          animate={etapa === 'abriendo' ? { x: [0, -3, 3, -2, 1, 0] } : { x: 0 }}
          transition={{ duration: 0.45 }}
        >
          <div className="porton-sombra" aria-hidden="true" />

          {/* Interior: la tarjeta que aparece al abrir */}
          <div className="porton-interior">
            <div className="tarjeta" style={{ clipPath: clipTarjeta }}>
              <div className="fibra fibra-suave" />
              <motion.div
                className="tarjeta-luz"
                initial={{ x: '-130%' }}
                animate={abierto ? { x: '150%' } : { x: '-130%' }}
                transition={{ duration: 2.4, delay: 0.9, ease: 'easeInOut' }}
              />
              <motion.div
                className="tarjeta-contenido"
                initial="oculto"
                animate={abierto ? 'visible' : 'oculto'}
                variants={{ visible: { transition: { staggerChildren: 0.2, delayChildren: 1.7 } } }}
              >
                <motion.div variants={item} className="eyebrow eyebrow-sm">Nos casamos</motion.div>
                <motion.div variants={item} className="arco">
                  <div className={`arco-foto${boda.fotos.portada ? '' : ' ph'}`}>
                    {boda.fotos.portada ? <img src={asset(boda.fotos.portada)} alt="" /> : <span className="ph-label">[Foto]</span>}
                  </div>
                </motion.div>
                <motion.div variants={item} className="script tarjeta-nombres">
                  {a} <span className="y">y</span> {b}
                </motion.div>
                <motion.div variants={item} className="tarjeta-fecha">{f.corta}</motion.div>
              </motion.div>
            </div>
          </div>

          {puerta('izq')}
          {puerta('der')}

          {/* Luz que se escapa por la unión */}
          <motion.div
            className="costura"
            aria-hidden="true"
            animate={abierto ? { opacity: [1, 1, 0] } : { opacity: [0.25, 0.9, 0.25] }}
            transition={abierto ? { duration: 0.9 } : { duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
          />
          {/* Sello entero mientras está cerrado; al abrir quedan las dos mitades */}
          {!abierto && <div className="sello-entero"><SelloCera monograma={monograma} /></div>}
          {/* Reflejo sobre el papel */}
          <motion.div className="porton-reflejo" aria-hidden="true" style={{ background: reflejo }} animate={{ opacity: abierto ? 0 : 1 }} />

          {!abierto && <button type="button" className="porton-boton" aria-label="Abrir la invitación" onClick={abrir} />}
        </motion.div>
      </div>

      <div className="hero-pie">
        <AnimatePresence mode="wait">
          {etapa === 'cerrado' && (
            <motion.div key="toca" className="hint" exit={{ opacity: 0 }}>Toca el sello para abrir</motion.div>
          )}
          {etapa === 'abierto' && (
            <motion.div key="desliza" className="desliza" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}>
              <span>Desliza para continuar</span>
              <motion.span animate={{ y: [0, 6, 0] }} transition={{ duration: 1.6, repeat: Infinity }}>
                <Icono nombre="abajo" size={20} />
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {abierto && <Petalos />}
    </section>
  );
}
