// Todos los datos de la boda en un solo lugar. Reemplaza lo que está entre [corchetes].
// Las horas, textos y colores sin corchetes son ejemplos editables.

export const boda = {
  novios: ['Tamara', 'Sergio'],
  fecha: '2027-03-20T17:30:00',
  duracionHoras: 7,

  // Invitado por defecto; con ?invitado=Familia%20Pérez en la URL se personaliza.
  invitadoPorDefecto: 'ti',

  bienvenida: {
    titulo: ['Y ahora,', 'para siempre'],
    texto:
      'Después de tantos momentos compartidos, decidimos dar el paso más importante de nuestras vidas. Con la bendición de nuestras familias, queremos que seas parte de este día.',
    cierre: 'Nos hará muy felices que estés.',
  },

  itinerario: [
    { hora: '17:30', titulo: 'El sí', detalle: 'Una promesa frente a quienes más queremos.' },
    { hora: '18:30', titulo: 'El brindis', detalle: 'Algo frío en la copa y el sol despidiéndose.' },
    { hora: '20:00', titulo: 'La mesa', detalle: 'Comer rico, conversar largo y repetir el brindis.' },
    { hora: '21:30', titulo: 'La fiesta', detalle: 'Los zapatos cómodos son bienvenidos.' },
  ],

  lugar: {
    eyebrow: 'Ceremonia y celebración',
    nombre: 'Aires del Maipo',
    descripcion:
      'Para llegar es mejor usar los botones o escribir «Aires del Maipo» en tu app de mapas: a veces la dirección arroja otra ubicación.',
    direccion: 'Av. Concha y Toro 01340, Puente Alto (límite con Pirque), Región Metropolitana',
    mapsUrl: 'https://goo.gl/maps/cW2xE4Yu69y',
    wazeUrl: 'https://waze.com/ul/h66jbdn899',
  },

  dressCode: {
    titulo: ['Dress Code:', 'All Black'],
    ellos: 'Look completo en negro',
    ellas: 'Look completo en negro',
    tonosTitulo: 'El único color de la noche',
    tonos: [{ nombre: 'Negro', color: '#141217' }],
    nota: 'Ayúdanos a pintar la noche vistiendo un look completamente negro.',
  },

  regalos: {
    texto: 'Si deseas tener un detalle con nosotros, aquí tienes nuestras cuentas. ¡Gracias por tanto cariño!',
    cuentas: [
      {
        titular: 'Sergio Sepulveda Quimen',
        rut: '17.667.227-7',
        banco: 'Banco Bci',
        tipo: 'Cuenta Corriente',
        numero: '50463543',
        correo: 'ssquimen@gmail.com',
      },
      {
        titular: 'Tamara Veliz Guerrero',
        rut: '18.244.248-8',
        banco: 'Banco Santander',
        tipo: 'Cuenta Corriente',
        numero: '86 95182 7',
        correo: 'ta.velizg18@gmail.com',
      },
    ],
  },

  rsvp: {
    texto: 'Hay un lugar en nuestra mesa que solo tú puedes ocupar.',
    fechaLimite: '[fecha límite]',
  },

  // Playlist colaborativa de Spotify. En Spotify: playlist > ··· > Invitar colaboradores > copiar enlace.
  playlist: {
    // ID de la playlist (lo que va después de /playlist/ en el enlace). Vacío = muestra un espacio reservado.
    id: '0Mao7plqib1ag8vRwmrG0B',
    // Enlace de invitación para colaborar (permite a los invitados agregar canciones).
    enlaceColaborar:
      'https://open.spotify.com/playlist/0Mao7plqib1ag8vRwmrG0B?si=4oEAtYh3TuS-d4TBrvL8mw&pt=e7b3c17c576518e45978445f62232d33&pi=tHHnLZ7ASg--c',
  },

  cierre: ['Las mejores historias', 'se celebran juntos.'],

  // Archivo mp3 dentro de /public, por ejemplo 'musica.mp3'. Vacío = sin música.
  musicaUrl: 'musica.mp3',
  // Fotos dentro de /public, por ejemplo 'fotos/portada.jpg'. Vacío = espacios reservados.
  fotos: {
    portada: 'fotos/portada.jpg',
    lugar: 'fotos/lugar.jpg',
    cierre: 'fotos/cierre.jpg',
  },
} as const;
