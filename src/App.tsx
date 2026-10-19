import { useEffect, useMemo, useRef, useState } from 'react';
import { boda } from './config';
import { Sobre } from './components/Sobre';
import { Invitacion } from './components/Invitacion';
import { Icono } from './components/Icono';
import { asset } from './lib/asset';

export default function App() {
  const [abierto, setAbierto] = useState(false);
  const [sonando, setSonando] = useState(false);
  const audio = useRef<HTMLAudioElement>(null);

  const invitado = useMemo(
    () => new URLSearchParams(window.location.search).get('invitado') || boda.invitadoPorDefecto,
    [],
  );

  // Sin scroll hasta abrir el sobre.
  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    document.documentElement.style.overflow = abierto ? '' : 'hidden';
  }, [abierto]);

  const iniciarMusica = () => {
    audio.current?.play().then(() => setSonando(true)).catch(() => setSonando(false));
  };

  const alternarMusica = () => {
    if (!audio.current) return;
    if (sonando) { audio.current.pause(); setSonando(false); } else iniciarMusica();
  };

  return (
    <div className="app">
      {boda.musicaUrl && (
        <>
          <audio ref={audio} src={asset(boda.musicaUrl)} loop preload="auto" />
          <button type="button" className="boton-musica" onClick={alternarMusica}
            aria-label={sonando ? 'Silenciar música' : 'Activar música'}>
            <Icono nombre={sonando ? 'sonido' : 'silencio'} size={18} />
          </button>
        </>
      )}
      <Sobre invitado={invitado} onAbrir={iniciarMusica} onAbierto={() => setAbierto(true)} />
      {abierto && <Invitacion />}
    </div>
  );
}
