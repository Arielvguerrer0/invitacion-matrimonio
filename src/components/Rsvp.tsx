import { useState, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { boda } from '../config';
import { guardarConfirmacion } from '../lib/rsvp';
import { Icono } from './Icono';
import { Papel } from './Papel';

// El nombre viene en el link de cada invitación (?invitado=...).
export function Rsvp({ invitado }: { invitado: string }) {
  const [a, b] = boda.novios;
  const personalizado = invitado !== boda.invitadoPorDefecto;
  const [asiste, setAsiste] = useState(true);
  const [mensaje, setMensaje] = useState('');
  const [estado, setEstado] = useState<'form' | 'enviando' | 'enviado'>('form');

  const enviar = async (e: FormEvent) => {
    e.preventDefault();
    setEstado('enviando');
    await guardarConfirmacion({ nombre: personalizado ? invitado : '(link sin nombre)', asiste, mensaje });
    setEstado('enviado');
  };

  return (
    <Papel semilla={41} rotar={-0.6} className="carta carta-rsvp">
      <AnimatePresence mode="wait">
        {estado !== 'enviado' ? (
          <motion.form key="form" onSubmit={enviar} className="rsvp-form" exit={{ opacity: 0, filter: 'blur(6px)' }}>
            <div className="script rsvp-saludo">{personalizado ? `Hola, ${invitado}:` : 'Hola:'}</div>

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
            <div className="titulo titulo-sm">
              {asiste ? (personalizado ? `¡Gracias, ${invitado}!` : '¡Gracias!') : 'Gracias por avisarnos'}
            </div>
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
