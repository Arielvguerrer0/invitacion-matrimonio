import { useEffect, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, motion, useInView, useScroll } from 'framer-motion';
import { boda } from '../config';
import { descargarIcs, formatearFecha, restante, semanasDelMes } from '../lib/fecha';
import { asset } from '../lib/asset';
import { Tinta, Titulo } from './Aparecer';
import { Icono } from './Icono';
import { Azahar, Pluma, SobreRegalo, Traje, Vestido } from './Ilustraciones';
import { Papel } from './Papel';
import { Rsvp } from './Rsvp';

const f = formatearFecha(boda.fecha);
const [a, b] = boda.novios;

function Bienvenida() {
  return (
    <section className="sec sec-bienvenida">
      <Papel semilla={21} rotar={-1.2} className="carta">
        <Azahar className="carta-azahar" />
        <Tinta><div className="eyebrow">{f.numerica}</div></Tinta>
        <Titulo lineas={boda.bienvenida.titulo} />
        <Tinta retraso={0.3}><p className="cuerpo">{boda.bienvenida.texto}</p></Tinta>
        <Tinta retraso={0.4}><p className="cuerpo">{boda.bienvenida.cierre}</p></Tinta>
        <Tinta retraso={0.5}><div className="script firma">{a} y {b}</div></Tinta>
      </Papel>
      <motion.div
        className="pluma"
        initial={{ opacity: 0, x: 60, y: 40, rotate: -28 }}
        whileInView={{ opacity: 1, x: 0, y: 0, rotate: -34 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 1.4, delay: 0.4, ease: [0.2, 0.7, 0.2, 1] }}
      >
        <Pluma />
      </motion.div>
    </section>
  );
}

function CuentaRegresiva() {
  const [ahora, setAhora] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setAhora(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="cuenta">
      {restante(f.fecha, ahora).map((c) => (
        <div key={c.etiqueta} className="cuenta-caja">
          <div className="cuenta-num">{c.valor}</div>
          <div className="cuenta-lbl">{c.etiqueta}</div>
        </div>
      ))}
    </div>
  );
}

function Calendario() {
  const semanas = semanasDelMes(f.fecha);
  return (
    <Papel semilla={33} rotar={1.6} className="calendario">
      <div className="cal-cabecera">
        <span className="script cal-mes">{f.mes}</span>
        <span className="cal-anio">{f.anio}</span>
      </div>
      <div className="cal-grilla cal-dias-semana" aria-hidden="true">
        {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d, i) => <span key={i}>{d}</span>)}
      </div>
      <div className="cal-grilla">
        {semanas.flat().map((d, i) => (
          <span key={i} className={d === f.dia ? 'cal-dia marcado' : 'cal-dia'}>
            {d}
            {d === f.dia && (
              <svg className="cal-circulo" viewBox="0 0 40 40" aria-hidden="true">
                <motion.path
                  d="M20 4 C30 3 37 11 36 21 C35 31 27 37 18 36 C9 35 3 27 5 17 C7 9 13 5 22 5"
                  fill="none" stroke="#B48E45" strokeWidth="1.8" strokeLinecap="round"
                  initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
                  viewport={{ once: true, amount: 1 }} transition={{ duration: 1.4, delay: 0.5, ease: 'easeInOut' }}
                />
              </svg>
            )}
          </span>
        ))}
      </div>
      <div className="cal-pie">{f.diaSemana} · {f.hora}</div>
    </Papel>
  );
}

function GuardaLaFecha() {
  return (
    <section className="sec">
      <Tinta><div className="eyebrow">Guarda la fecha</div></Tinta>
      <motion.div
        className="fecha-oro"
        initial={{ opacity: 0, scale: 0.88, filter: 'blur(12px)' }}
        whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 1.4, ease: [0.2, 0.7, 0.2, 1] }}
      >
        {f.dia}
      </motion.div>
      <Tinta retraso={0.2}><div className="script fecha-mes">{f.mes}</div></Tinta>
      <Tinta retraso={0.3}><div className="eyebrow">{f.anio}</div></Tinta>
      <Titulo lineas={['Hay un día', 'que ya es nuestro.']} />
      <Tinta><Calendario /></Tinta>
      <Tinta><div className="italica-sm">Cada vez falta menos</div></Tinta>
      <Tinta><CuentaRegresiva /></Tinta>
      <Tinta>
        <button type="button" className="btn"
          onClick={() => descargarIcs(`Matrimonio de ${a} y ${b}`, f.fecha, boda.duracionHoras, `${boda.lugar.nombre}, ${boda.lugar.direccion}`)}>
          <Icono nombre="calendario" /> Agendar la fecha
        </button>
      </Tinta>
    </section>
  );
}

function ItemDia({ it }: { it: (typeof boda.itinerario)[number] }) {
  const ref = useRef<HTMLLIElement>(null);
  const visto = useInView(ref, { margin: '0px 0px -40% 0px' });
  return (
    <motion.li ref={ref} className="dia-item" animate={{ opacity: visto ? 1 : 0.3, filter: visto ? 'blur(0px)' : 'blur(2px)' }} transition={{ duration: 0.6 }}>
      <div className="dia-hora">{it.hora}<small>hrs</small></div>
      <span className={`dia-punto${visto ? ' activo' : ''}`} />
      <div>
        <div className="dia-titulo">{it.titulo}</div>
        <div className="dia-detalle">{it.detalle}</div>
      </div>
    </motion.li>
  );
}

function OrdenDelDia() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 60%'] });
  return (
    <section className="sec">
      <Titulo eyebrow="El orden del día" lineas={['Nuestro día,', 'contigo.']} />
      <div ref={ref} className="dia">
        <div className="dia-linea" aria-hidden="true"><motion.div className="dia-progreso" style={{ scaleY: scrollYProgress }} /></div>
        <ol className="dia-lista">
          {boda.itinerario.map((it) => <ItemDia key={it.titulo} it={it} />)}
        </ol>
      </div>
    </section>
  );
}

function Lugar() {
  const l = boda.lugar;
  return (
    <section className="sec">
      <Titulo eyebrow={l.eyebrow} lineas={[l.nombre]} />
      <motion.div
        className="polaroid"
        initial={{ opacity: 0, rotate: -7, y: 40 }}
        whileInView={{ opacity: 1, rotate: -2.5, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 1.2, ease: [0.2, 0.7, 0.2, 1] }}
      >
        <div className={`polaroid-foto${boda.fotos.lugar ? '' : ' ph'}`}>
          {boda.fotos.lugar ? <img src={asset(boda.fotos.lugar)} alt={l.nombre} /> : <span className="ph-label">[Foto del lugar]</span>}
        </div>
      </motion.div>
      <Tinta><p className="cuerpo italica">{l.descripcion}</p></Tinta>
      <Tinta><div className="direccion">{l.direccion}</div></Tinta>
      <Tinta>
        <a className="btn" href={l.mapsUrl} target="_blank" rel="noreferrer"><Icono nombre="pin" /> Cómo llegar</a>
      </Tinta>
    </section>
  );
}

function Percha({ children, etiqueta, texto, retraso }: { children: ReactNode; etiqueta: string; texto: string; retraso: number }) {
  return (
    <div className="percha">
      <motion.div
        className="percha-ilus"
        style={{ transformOrigin: '50% 4%' }}
        initial={{ opacity: 0, rotate: retraso ? 9 : -9, y: -20 }}
        whileInView={{ opacity: 1, rotate: 0, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ type: 'spring', stiffness: 60, damping: 6, delay: retraso }}
      >
        {children}
      </motion.div>
      <div className="script percha-etiqueta">{etiqueta}</div>
      <div className="percha-texto">{texto}</div>
    </div>
  );
}

function DressCode() {
  const d = boda.dressCode;
  return (
    <section className="sec">
      <Titulo eyebrow="Código de vestimenta" lineas={d.titulo} />
      <div className="perchas">
        <Percha etiqueta="Ellos" texto={d.ellos} retraso={0}><Traje /></Percha>
        <Percha etiqueta="Ellas" texto={d.ellas} retraso={0.15}><Vestido /></Percha>
      </div>
      <Tinta><div className="italica-sm">Tonos que nos encantarían</div></Tinta>
      <div className="tonos">
        {d.tonos.map((t, i) => (
          <motion.div key={t.nombre} className="tono"
            initial={{ opacity: 0, scale: 0.5 }} whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }} transition={{ type: 'spring', stiffness: 200, damping: 14, delay: i * 0.1 }}>
            <span className="tono-color" style={{ background: t.color }} />
            <span className="tono-nombre">{t.nombre}</span>
          </motion.div>
        ))}
      </div>
      <Tinta><p className="cuerpo nota">{d.nota}</p></Tinta>
    </section>
  );
}

function Regalos() {
  const r = boda.regalos;
  const [abierto, setAbierto] = useState(false);
  const [copiado, setCopiado] = useState(false);
  const filas: [string, string][] = [['Titular', r.titular], ['RUT', r.rut], ['Banco', r.banco], ['Cuenta', r.cuenta], ['Correo', r.correo]];
  const copiar = async () => {
    try { await navigator.clipboard.writeText(filas.map(([k, v]) => `${k}: ${v}`).join('\n')); } catch { /* sin permiso */ }
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };
  return (
    <section className="sec">
      <Titulo eyebrow="Regalos" lineas={['Tu presencia es', 'nuestro regalo']} />
      <Tinta><p className="cuerpo">{r.texto}</p></Tinta>
      <motion.div className="regalo" animate={{ y: [0, -8, 0], rotate: [-2, 1, -2] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}>
        <SobreRegalo />
      </motion.div>
      <button type="button" className="btn" aria-expanded={abierto} onClick={() => setAbierto((x) => !x)}>
        <Icono nombre="tarjeta" /> {abierto ? 'Ocultar datos' : 'Ver datos de la cuenta'}
      </button>
      <AnimatePresence>
        {abierto && (
          <motion.div className="datos" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
            <Papel semilla={55} className="datos-papel">
              <dl>{filas.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
              <button type="button" className="btn btn-borde btn-full" onClick={copiar}>
                <Icono nombre="copiar" /> {copiado ? '¡Datos copiados!' : 'Copiar datos'}
              </button>
            </Papel>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function Confirmacion() {
  return (
    <section className="sec" id="confirmar">
      <Titulo eyebrow="Confirmación" lineas={['Una carta', 'de vuelta']} />
      <Tinta><p className="cuerpo">{boda.rsvp.texto} Confírmanos antes del {boda.rsvp.fechaLimite}.</p></Tinta>
      <Tinta><Rsvp /></Tinta>
    </section>
  );
}

function Cierre() {
  return (
    <footer className="cierre">
      <div className={`cierre-foto${boda.fotos.cierre ? '' : ' ph-oscuro'}`}>
        {boda.fotos.cierre && <img src={asset(boda.fotos.cierre)} alt="" />}
      </div>
      <div className="cierre-velo" />
      <div className="cierre-texto">
        <Titulo lineas={boda.cierre} claro />
        <Tinta retraso={0.5}><div className="script cierre-script">Te esperamos</div></Tinta>
        <Tinta retraso={0.7}><div className="eyebrow claro-eyebrow">{a} & {b} · {f.numerica}</div></Tinta>
        {!boda.fotos.cierre && <div className="ph-label claro-ph">[Foto de cierre]</div>}
      </div>
    </footer>
  );
}

export function Invitacion() {
  return (
    <motion.main className="invitacion" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
      <Bienvenida />
      <GuardaLaFecha />
      <OrdenDelDia />
      <Lugar />
      <DressCode />
      <Regalos />
      <Confirmacion />
      <Cierre />
    </motion.main>
  );
}
