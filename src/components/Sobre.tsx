import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { boda } from '../config';
import { formatearFecha } from '../lib/fecha';
import { asset } from '../lib/asset';
import { deckle } from './Papel';
import { Azahar, Cinta, Laurel, SelloCera } from './Ilustraciones';
import { Icono } from './Icono';

type Etapa = 'cerrado' | 'abriendo' | 'abierto';
type Props = { invitado: string; onAbrir: () => void; onAbierto: () => void };

const EASE_PUERTA = [0.65, 0, 0.25, 1] as const;

export function Sobre({ invitado, onAbrir, onAbierto }: Props) {
  const [etapa, setEtapa] = useState<Etapa>('cerrado');
  const f = formatearFecha(boda.fecha);
  const [a, b] = boda.novios;
  const abierto = etapa !== 'cerrado';

  const clipIzq = useMemo(() => deckle({ arriba: true, izquierda: true, abajo: true }, 3, 0.6), []);
  const clipDer = useMemo(() => deckle({ arriba: true, derecha: true, abajo: true }, 7, 0.6), []);
  const clipTarjeta = useMemo(() => deckle({ arriba: true, derecha: true, abajo: true, izquierda: true }, 11, 0.5), []);

  const abrir = () => {
    if (abierto) return;
    setEtapa('abriendo');
    onAbrir();
    setTimeout(() => { setEtapa('abierto'); onAbierto(); }, 2900);
  };

  const item = {
    oculto: { opacity: 0, y: 10, filter: 'blur(6px)' },
    visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 1 } },
  };

  return (
    <section className="hero">
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

      <div className="porton">
        {/* Interior: la tarjeta que aparece al abrir */}
        <div className="porton-interior">
          <div className="tarjeta" style={{ clipPath: clipTarjeta }}>
            <motion.div
              className="tarjeta-luz"
              initial={{ x: '-130%' }}
              animate={abierto ? { x: '150%' } : { x: '-130%' }}
              transition={{ duration: 2.4, delay: 0.7, ease: 'easeInOut' }}
            />
            <motion.div
              className="tarjeta-contenido"
              initial="oculto"
              animate={abierto ? 'visible' : 'oculto'}
              variants={{ visible: { transition: { staggerChildren: 0.2, delayChildren: 1.5 } } }}
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

        {/* Puerta izquierda */}
        <motion.div
          className="puerta puerta-izq"
          style={{ transformOrigin: '0% 50%' }}
          animate={{ rotateY: abierto ? -172 : 0 }}
          transition={{ duration: 1.9, delay: 0.35, ease: EASE_PUERTA }}
        >
          <div className="puerta-cara" style={{ clipPath: clipIzq }}>
            <div className="puerta-arte" style={{ left: 0 }}><Laurel className="laurel" /></div>
            <div className="grano" />
          </div>
          <div className="puerta-dorso" style={{ clipPath: clipIzq }} />
        </motion.div>

        {/* Puerta derecha, con el sello */}
        <motion.div
          className="puerta puerta-der"
          style={{ transformOrigin: '100% 50%' }}
          animate={{ rotateY: abierto ? 172 : 0 }}
          transition={{ duration: 1.9, delay: 0.35, ease: EASE_PUERTA }}
        >
          <div className="puerta-cara" style={{ clipPath: clipDer }}>
            <div className="puerta-arte" style={{ left: '-100%' }}><Laurel className="laurel" /></div>
            <div className="grano" />
          </div>
          <div className="puerta-dorso" style={{ clipPath: clipDer }} />
          <motion.div
            className="sello"
            style={{ x: '-50%', y: '-50%' }}
            animate={abierto ? { scale: [1, 0.9, 1.02] } : { scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <SelloCera />
          </motion.div>
        </motion.div>

        {/* Luz que se escapa por la unión */}
        <motion.div
          className="costura"
          aria-hidden="true"
          animate={abierto ? { opacity: [1, 1, 0], scaleY: [1, 1.04, 1] } : { opacity: [0.25, 0.9, 0.25] }}
          transition={abierto ? { duration: 0.6 } : { duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
        />

        {!abierto && <button type="button" className="porton-boton" aria-label="Abrir la invitación" onClick={abrir} />}
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
    </section>
  );
}
