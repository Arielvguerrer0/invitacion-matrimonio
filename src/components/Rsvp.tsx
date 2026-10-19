import { useState, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { boda } from '../config';
import { guardarConfirmacion } from '../lib/rsvp';
import { Icono } from './Icono';
import { Papel } from './Papel';

export function Rsvp() {
  const [a, b] = boda.novios;
  const [nombre, setNombre] = useState('');
  const [asiste, setAsiste] = useState(true);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState(false);
  const [estado, setEstado] = useState<'form' | 'enviando' | 'enviado'>('form');

  const enviar = async (e: FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) return setError(true);
    setEstado('enviando');
    await guardarConfirmacion({ nombre: nombre.trim(), asiste, mensaje });
    setEstado('enviado');
  };

  return (
    <Papel semilla={41} rotar={-0.6} className="carta carta-rsvp">
      <AnimatePresence mode="wait">
        {estado !== 'enviado' ? (
          <motion.form key="form" onSubmit={enviar} className="rsvp-form" exit={{ opacity: 0, filter: 'blur(6px)' }}>
            <div className="script rsvp-saludo">Queridos {a} y {b}:</div>

            <div className="campo">
              <label htmlFor="rsvp-nombre">Tu nombre</label>
              <input id="rsvp-nombre" type="text" autoComplete="name" placeholder="Nombre y apellido" value={nombre}
                onChange={(e) => { setNombre(e.target.value); setError(false); }} />
              {error && <div className="error">Escribe tu nombre para poder confirmar.</div>}
            </div>

            <fieldset className="campo">
              <legend>¿Nos acompañas?</legend>
              <div className="opciones">
                <button type="button" className={`opcion${asiste ? ' activa' : ''}`} aria-pressed={asiste} onClick={() => setAsiste(true)}>
                  <Icono nombre="check" size={18} /> Sí, ahí estaré
                </button>
                <button type="button" className={`opcion${!asiste ? ' activa' : ''}`} aria-pressed={!asiste} onClick={() => setAsiste(false)}>
                  <Icono nombre="x" size={18} /> No podré ir
                </button>
              </div>
            </fieldset>

            <div className="campo">
              <label htmlFor="rsvp-mensaje">Unas palabras para los novios <span className="opcional">(opcional)</span></label>
              <textarea id="rsvp-mensaje" rows={3} placeholder="Les deseo…" value={mensaje} onChange={(e) => setMensaje(e.target.value)} />
            </div>

            <button type="submit" className="btn btn-full" disabled={estado === 'enviando'}>
              <Icono nombre="pluma" /> {estado === 'enviando' ? 'Enviando…' : 'Confirmar asistencia'}
            </button>
          </motion.form>
        ) : (
          <motion.div key="gracias" className="rsvp-gracias"
            initial={{ opacity: 0, filter: 'blur(8px)' }} animate={{ opacity: 1, filter: 'blur(0px)' }} transition={{ duration: 1 }}>
            <div className="icono-circulo"><Icono nombre="check" size={26} /></div>
            <div className="titulo titulo-sm">{asiste ? `¡Gracias, ${nombre.trim().split(' ')[0]}!` : 'Gracias por avisarnos'}</div>
            <p className="cuerpo">
              {asiste
                ? 'Recibimos tu carta. Nos hace muy felices que nos acompañes.'
                : 'Te echaremos de menos. Gracias por responder y por tu cariño.'}
            </p>
            <div className="script firma">{a} y {b}</div>
            <button type="button" className="btn-texto" onClick={() => setEstado('form')}>Editar mi respuesta</button>
          </motion.div>
        )}
      </AnimatePresence>
    </Papel>
  );
}
