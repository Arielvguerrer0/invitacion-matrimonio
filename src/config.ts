// Todos los datos de la boda en un solo lugar. Reemplaza lo que está entre [corchetes].
// Las horas, textos y colores sin corchetes son ejemplos editables.

export const boda = {
  novios: ['[Nombre]', '[Nombre]'],
  fecha: '2027-03-20T18:30:00',
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
    { hora: '18:30', titulo: 'El sí', detalle: 'Una promesa frente a quienes más queremos.' },
    { hora: '19:30', titulo: 'El brindis', detalle: 'Algo frío en la copa y el sol despidiéndose.' },
    { hora: '21:00', titulo: 'La mesa', detalle: 'Comer rico, conversar largo y repetir el brindis.' },
    { hora: '22:30', titulo: 'La fiesta', detalle: 'Los zapatos cómodos son bienvenidos.' },
  ],

  lugar: {
    eyebrow: 'Ceremonia y celebración',
    nombre: '[Nombre del lugar]',
    descripcion: '[Una frase sobre el lugar]',
    direccion: '[Dirección · Comuna · Región]',
    mapsUrl: 'https://maps.google.com',
  },

  dressCode: {
    titulo: ['Formal', 'elegante'],
    ellos: 'Traje oscuro o esmoquin',
    ellas: 'Vestido largo o midi de gala',
    tonos: [
      { nombre: 'Ciruela', color: '#4A3A6B' },
      { nombre: 'Lila', color: '#A895D6' },
      { nombre: 'Champaña', color: '#D9C39A' },
      { nombre: 'Salvia', color: '#9DAF95' },
    ],
    nota: 'Telas ligeras y zapatos cómodos para bailar. El blanco, para la novia.',
  },

  regalos: {
    texto: 'Si deseas tener un detalle con nosotros, aquí tienes nuestra cuenta. ¡Gracias por tanto cariño!',
    titular: '[Titular]',
    rut: '[00.000.000-0]',
    banco: '[Banco]',
    cuenta: '[Tipo · N°]',
    correo: '[correo@ejemplo.cl]',
  },

  rsvp: {
    texto: 'Hay un lugar en nuestra mesa que solo tú puedes ocupar.',
    fechaLimite: '[fecha límite]',
    maxPersonas: 5,
  },

  cierre: ['Las mejores historias', 'se celebran juntos.'],

  // Archivo mp3 dentro de /public, por ejemplo 'musica.mp3'. Vacío = sin música.
  musicaUrl: '',
  // Fotos dentro de /public, por ejemplo 'fotos/portada.jpg'. Vacío = espacios reservados.
  fotos: {
    portada: '',
    lugar: '',
    cierre: '',
  },
} as const;
