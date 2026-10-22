import type { WorkoutDay } from '../types/workout';

export const PROTOCOL_TARGET_DATE_ISO = '2026-12-05T00:00:00';
export const PROTOCOL_START_DATE_ISO = '2026-10-21T00:00:00'; // Inicio del protocolo: 21 de octubre de 2026
export const PROTOCOL_TOTAL_WEEKS = 6;

export const WORKOUT_PLAN: WorkoutDay[] = [
  {
    id: 'day-1',
    dayNumber: 1,
    title: 'DÍA 1: Empuje (Pecho, Hombros y Tríceps)',
    subtitle: 'Pecho Alto de Armadura, Hombros Anchos y Tríceps en Máquina/Polea',
    exercises: [
      {
        id: 'd1-e1',
        name: 'Press Inclinado en Multipower / Barra Guiada (o Máquina Inclinada)',
        targetSets: 4,
        targetReps: '10-12',
        restSeconds: 90,
        cues: 'Banca a 30°. La barra guiada hace el equilibrio por ti: baja controlado a la parte alta del pecho (clavícula) y empuja fuerte.',
        videoUrl: 'https://www.youtube.com/embed/8iPEnn-ltC8',
        dumbbellAlternative: {
          name: 'Press Inclinado con Mancuernas en Banco a 30°',
          cues: 'Banco a 30°. Baja con los codos a 45-60° respecto al torso hasta sentir estiramiento en la parte alta del pecho, y empuja convergiendo ligeramente sin chocar las mancuernas.',
          videoUrl: 'https://www.youtube.com/embed/8iPEnn-ltC8',
        },
      },
      {
        id: 'd1-e2',
        name: 'Press de Hombros en Máquina Sentado',
        targetSets: 3,
        targetReps: '10-12',
        restSeconds: 90,
        cues: 'Pega bien la espalda al respaldo. Empuja sin chocar las placas al bajar para mantener tensión continua en los hombros.',
        videoUrl: 'https://www.youtube.com/embed/qEwKCR5JCog',
        dumbbellAlternative: {
          name: 'Press Militar Sentado con Mancuernas',
          cues: 'Banco casi vertical (75-80°). Inicia a la altura de las orejas y empuja verticalmente controlando la bajada en 2 segundos sin arquear la espalda baja.',
          videoUrl: 'https://www.youtube.com/embed/qEwKCR5JCog',
        },
      },
      {
        id: 'd1-e3',
        name: 'Contractora de Pecho en Máquina (Peck Deck)',
        supersetGroup: 'A',
        supersetOrder: 1,
        targetSets: 3,
        targetReps: '12-15',
        restSeconds: 0,
        cues: 'Saca el pecho, mantén los codos ligeramente flexionados y aprieta 1 segundo al juntar los brazos frente a ti.',
        videoUrl: 'https://www.youtube.com/embed/Iwe6AmxVf7o',
        dumbbellAlternative: {
          name: 'Aperturas con Mancuernas en Banco Plano',
          cues: 'Codos ligeramente flexionados y fijos como abrazando un barril. Abre hasta sentir tensión en el pectoral y cierra apretando arriba sin juntar las mancuernas del todo.',
          videoUrl: 'https://www.youtube.com/embed/eozdVDA78K0',
        },
      },
      {
        id: 'd1-e4',
        name: 'Elevaciones Laterales con Mancuernas (Sentado en banco)',
        supersetGroup: 'A',
        supersetOrder: 2,
        targetSets: 4,
        targetReps: '12-15',
        restSeconds: 60,
        cues: 'Usa peso ligero/moderado. Sentarte evita que te balances con la espalda; sube los codos hasta la altura de los hombros.',
        videoUrl: 'https://www.youtube.com/embed/PzsMitRdI_8',
        dumbbellAlternative: {
          name: 'Elevaciones Laterales Inclinadas con Mancuerna en Banco (a una mano)',
          cues: 'Túmbate de lado en un banco a 45° o 60°. Esta inclinación cambia la curva de resistencia y elimina por completo el balanceo corporal.',
          videoUrl: 'https://www.youtube.com/embed/PzsMitRdI_8',
        },
      },
      {
        id: 'd1-e5',
        name: 'Extensión de Tríceps en Polea Alta con Barra Corta (o Triángulo)',
        supersetGroup: 'B',
        supersetOrder: 1,
        targetSets: 3,
        targetReps: '10-12',
        restSeconds: 0,
        cues: 'Pega los codos a las costillas. La barra permite meter más peso que la cuerda para darle grosor inmediato al brazo.',
        videoUrl: 'https://www.youtube.com/embed/2z8JmcrW-As',
        dumbbellAlternative: {
          name: 'Press Francés con Mancuernas en Banco Plano',
          cues: 'Tumbado boca arriba con agarre neutro. Dobla los codos llevando las mancuernas a los lados de la frente y extiende sintiendo la cabeza lateral del tríceps.',
          videoUrl: 'https://www.youtube.com/embed/ir5Psb4V90E',
        },
      },
      {
        id: 'd1-e6',
        name: 'Extensión de Tríceps en Polea Alta con Cuerda',
        supersetGroup: 'B',
        supersetOrder: 2,
        targetSets: 3,
        targetReps: '12-15',
        restSeconds: 60,
        cues: 'Con un peso más ligero que en B1, abre la cuerda al final del movimiento y aprieta el tríceps 1 segundo abajo.',
        videoUrl: 'https://www.youtube.com/embed/vB5OHsJ3EME',
        dumbbellAlternative: {
          name: 'Extensión de Tríceps Sobre la Cabeza con Mancuerna (Copa a dos manos)',
          cues: 'Sentado en banco, sujeta una mancuerna con ambas manos en forma de copa tras la nuca. Extiende los codos verticalmente para estirar la cabeza larga del tríceps.',
          videoUrl: 'https://www.youtube.com/embed/vB5OHsJ3EME',
        },
      },
    ],
  },
  {
    id: 'day-2',
    dayNumber: 2,
    title: 'DÍA 2: Tracción (Espalda en "V" y Bíceps)',
    subtitle: 'Amplitud Dorsal, Espalda Alta Densa y Bíceps en Polea',
    exercises: [
      {
        id: 'd2-e1',
        name: 'Jalón al Pecho en Polea Alta (Agarre abierto o neutro)',
        targetSets: 4,
        targetReps: '10-12',
        restSeconds: 90,
        cues: 'Saca el pecho e imagina llevar los codos hacia los bolsillos traseros. No tires con el cuerpo hacia atrás.',
        videoUrl: 'https://www.youtube.com/embed/CAwf7n6Luuc',
        dumbbellAlternative: {
          name: 'Remo con Mancuerna Pesada a una Mano (Apoyado en banco)',
          cues: 'Una rodilla y mano en el banco. Tracciona llevando la mancuerna hacia la cadera/bolsillo trasero para enfocar la amplitud dorsal en lugar del trapecio.',
          videoUrl: 'https://www.youtube.com/embed/dFzUjzfih7k',
        },
      },
      {
        id: 'd2-e2',
        name: 'Remo en Máquina Sentado con Apoyo en el Pecho (Agarre abierto)',
        targetSets: 4,
        targetReps: '10-12',
        restSeconds: 90,
        cues: 'El cojín del pecho protege tu espalda baja. Tira llevando los codos hacia atrás y junta las escápulas al final.',
        videoUrl: 'https://www.youtube.com/embed/TeFo51Q_Nsc',
        dumbbellAlternative: {
          name: 'Remo con Mancuernas en Banco Inclinado (Pecho Apoyado)',
          cues: 'Pecho bien apoyado en banco a 30-45°. Codos abiertos a 60-70° tirando hacia atrás y juntando escápulas al final. 100% libre de fatiga lumbar.',
          videoUrl: 'https://www.youtube.com/embed/roCP6wCXPqo',
        },
      },
      {
        id: 'd2-e3',
        name: 'Pull-over en Polea Alta con Barra Recta Corta',
        supersetGroup: 'A',
        supersetOrder: 1,
        targetSets: 3,
        targetReps: '12-15',
        restSeconds: 0,
        cues: 'Inclina un poco el torso, brazos casi rectos y lleva la barra hasta los muslos sintiendo cómo se ensancha el dorsal.',
        videoUrl: 'https://www.youtube.com/embed/lueEJGjTuPQ',
        dumbbellAlternative: {
          name: 'Pull-over con Mancuerna en Banco Plano',
          cues: 'Tumbado a lo largo del banco. Sujeta una mancuerna en copa sobre el pecho con codos semi-flexionados, baja por detrás de la cabeza estirando el dorsal y sube con la fuerza de la espalda.',
          videoUrl: 'https://www.youtube.com/embed/FK4rHfW62ac',
        },
      },
      {
        id: 'd2-e4',
        name: 'Pájaros en Máquina Contractora Invertida (o Face Pulls en Polea)',
        supersetGroup: 'A',
        supersetOrder: 2,
        targetSets: 4,
        targetReps: '12-15',
        restSeconds: 60,
        cues: 'Siéntate mirando hacia el respaldo de la contractora y abre los brazos hacia atrás. Da aspecto 3D al hombro y espalda alta.',
        videoUrl: 'https://www.youtube.com/embed/V8dZ3pyiCBo',
        dumbbellAlternative: {
          name: 'Pájaros con Mancuernas en Banco Inclinado (Pecho Apoyado)',
          cues: 'Boca abajo en banco inclinado a 30°. Eleva los brazos hacia los lados liderando con los codos para aislar el deltoides posterior sin balanceo lumbar.',
          videoUrl: 'https://www.youtube.com/embed/H530fW3kWEY',
        },
      },
      {
        id: 'd2-e5',
        name: 'Curl de Bíceps en Polea Baja con Barra Corta (o Barra Z)',
        supersetGroup: 'B',
        supersetOrder: 1,
        targetSets: 3,
        targetReps: '10-12',
        restSeconds: 0,
        cues: 'La polea mantiene tensión todo el recorrido y es muy fácil de controlar. Codos pegados al cuerpo sin balancearte.',
        videoUrl: 'https://www.youtube.com/embed/soxrZlIl35U',
        dumbbellAlternative: {
          name: 'Curl de Bíceps con Mancuernas en Banco Inclinado',
          cues: 'Banco a 45-60°. Deja los brazos colgar en estiramiento completo y supina la muñeca al subir para maximizar la cabeza larga del bíceps (el pico).',
          videoUrl: 'https://www.youtube.com/embed/soxrZlIl35U',
        },
      },
      {
        id: 'd2-e6',
        name: 'Curl Martillo con Mancuernas (Sentado o de pie)',
        supersetGroup: 'B',
        supersetOrder: 2,
        targetSets: 3,
        targetReps: '12',
        restSeconds: 60,
        cues: 'Palmas mirándose entre sí (como sosteniendo un martillo). Engrosa el brazo visto de frente y fortalece el antebrazo.',
        videoUrl: 'https://www.youtube.com/embed/zC3nLlEvin4',
        dumbbellAlternative: {
          name: 'Curl Martillo Cruzado al Pecho con Mancuerna (Pinwheel Curl)',
          cues: 'De pie, sube la mancuerna en diagonal cruzando frente al pecho hacia el hombro contrario. Enfatiza el braquial anterior y la densidad del brazo.',
          videoUrl: 'https://www.youtube.com/embed/zC3nLlEvin4',
        },
      },
    ],
  },
  {
    id: 'day-3',
    dayNumber: 3,
    title: 'DÍA 3: Torso Macizo + Piernas en Máquina',
    subtitle: 'Pecho, Espalda, Trapecio de Poder y Tren Inferior Guiado',
    exercises: [
      {
        id: 'd3-e1',
        name: 'Prensa de Piernas en Máquina (45° o Sentada Horizontal)',
        targetSets: 3,
        targetReps: '10-12',
        restSeconds: 90,
        cues: 'Pies al ancho de los hombros. Baja de forma controlada sin despegar la cadera ni la espalda baja del respaldo.',
        videoUrl: 'https://www.youtube.com/embed/IZxyjW7MPJQ',
        dumbbellAlternative: {
          name: 'Sentadilla Goblet con Mancuerna Pesada (Talones Elevados)',
          cues: 'Sujeta una mancuerna pesada verticalmente pegada al pecho. Baja profundo con el torso erguido; elevar ligeramente los talones aumenta el estímulo en los cuádriceps.',
          videoUrl: 'https://www.youtube.com/embed/MeIiIdhvXT4',
        },
      },
      {
        id: 'd3-e2',
        name: 'Curl Femoral Sentado (o Tumbado) en Máquina',
        targetSets: 3,
        targetReps: '12',
        restSeconds: 60,
        cues: 'Ajusta el rodillo sobre los tobillos y controla la subida en 2 segundos para no dejar caer las placas de golpe.',
        videoUrl: 'https://www.youtube.com/embed/1Tq3QdYUuHs',
        dumbbellAlternative: {
          name: 'Peso Muerto Rumano con Mancuernas (RDL)',
          cues: 'Pies al ancho de caderas, rodillas ligeramente flexionadas. Empuja el glúteo hacia atrás bajando las mancuernas pegadas a las piernas sintiendo estiramiento profundo en isquios.',
          videoUrl: 'https://www.youtube.com/embed/JCXUYuzwNrM',
        },
      },
      {
        id: 'd3-e3',
        name: 'Press de Pecho Plano en Máquina Sentado',
        supersetGroup: 'A',
        supersetOrder: 1,
        targetSets: 4,
        targetReps: '10-12',
        restSeconds: 0,
        cues: '100% seguro sin ayudante: hombros atrás contra el respaldo y empuja con fuerza controlada.',
        videoUrl: 'https://www.youtube.com/embed/VmB1G1K7v94',
        dumbbellAlternative: {
          name: 'Press de Pecho Plano con Mancuernas en Banco',
          cues: 'Pies apoyados firmes, escápulas retraídas. Desciende con control sintiendo el estiramiento completo en el pectoral y empuja con potencia.',
          videoUrl: 'https://www.youtube.com/embed/VmB1G1K7v94',
        },
      },
      {
        id: 'd3-e4',
        name: 'Remo Sentado en Polea Baja (Agarre Triángulo / Cerrado)',
        supersetGroup: 'A',
        supersetOrder: 2,
        targetSets: 4,
        targetReps: '10-12',
        restSeconds: 90,
        cues: 'Pecho alto y espalda recta. Lleva el triángulo hacia el ombligo apretando fuerte la espalda media.',
        videoUrl: 'https://www.youtube.com/embed/GZbfZ033f74',
        dumbbellAlternative: {
          name: 'Remo Doble con Mancuernas Agarre Neutro (Pecho Apoyado o Inclinado)',
          cues: 'Agarre neutro (palmas mirándose). Tira llevando los codos pegados a los costados hacia la cadera para imitar el vector del remo cerrado.',
          videoUrl: 'https://www.youtube.com/embed/GZbfZ033f74',
        },
      },
      {
        id: 'd3-e5',
        name: 'Elevaciones Laterales en Polea Baja (a una mano) o Mancuernas',
        supersetGroup: 'B',
        supersetOrder: 1,
        targetSets: 4,
        targetReps: '12-15',
        restSeconds: 0,
        cues: 'Sujétate de la estructura de la polea para máxima estabilidad y eleva el brazo lateralmente sin dar tirones.',
        videoUrl: 'https://www.youtube.com/embed/PPrzBWZDOhA',
        dumbbellAlternative: {
          name: 'Elevaciones Laterales Inclinadas con Mancuerna (Apoyo en Banco)',
          cues: 'Tumbado de lado en banco inclinado a 45°. El ángulo coloca la mayor tensión en el rango medio y de inicio, igualando el perfil de la polea.',
          videoUrl: 'https://www.youtube.com/embed/PPrzBWZDOhA',
        },
      },
      {
        id: 'd3-e6',
        name: 'Encogimientos de Trapecio en Multipower (o con Mancuernas)',
        supersetGroup: 'B',
        supersetOrder: 2,
        targetSets: 3,
        targetReps: '12-15',
        restSeconds: 60,
        cues: 'El trapecio alto da apariencia maciza al instante. Sube los hombros hacia las orejas y sostén 2 segundos arriba.',
        videoUrl: 'https://www.youtube.com/embed/cJRVVxmytaM',
        dumbbellAlternative: {
          name: 'Encogimientos de Trapecio con Mancuernas Pesadas (Pausa 2s)',
          cues: 'Mancuernas pesadas a los costados. Eleva los hombros en línea recta hacia las orejas sin rotarlos hacia atrás. Mantén la contracción máxima 2 segundos.',
          videoUrl: 'https://www.youtube.com/embed/cJRVVxmytaM',
        },
      },
    ],
  },
  {
    id: 'day-4',
    dayNumber: 4,
    title: 'DÍA 4: Hombros 3D, Brazos y Antebrazos',
    subtitle: '"El Día de las Mangas" (100% Poleas, Banco Guiado y Mancuernas)',
    exercises: [
      {
        id: 'd4-e1',
        name: 'Elevaciones Laterales con Mancuernas',
        targetSets: 4,
        targetReps: '12-15',
        restSeconds: 60,
        cues: 'Tercer estímulo semanal de hombros para máxima amplitud. Movimiento limpio, subiendo con los codos.',
        videoUrl: 'https://www.youtube.com/embed/PzsMitRdI_8',
        dumbbellAlternative: {
          name: 'Elevaciones Laterales Sentado con Mancuernas (Pausa Isométrica)',
          cues: 'Sentado en banco vertical. Sube hasta la horizontal, aguanta 1 segundo en el punto alto en cada repetición y baja en 3 segundos sin impulso.',
          videoUrl: 'https://www.youtube.com/embed/PzsMitRdI_8',
        },
      },
      {
        id: 'd4-e2',
        name: 'Extensión de Tríceps en Polea Alta con Barra V o Recta (Pesado)',
        supersetGroup: 'A',
        supersetOrder: 1,
        targetSets: 4,
        targetReps: '10-12',
        restSeconds: 0,
        cues: 'Mucho más cómodo para los codos que el press francés libre. Codos fijos a los lados y extiende por completo.',
        videoUrl: 'https://www.youtube.com/embed/d_KZxkY_0cM',
        dumbbellAlternative: {
          name: 'Press Francés con Mancuernas en Banco Plano',
          cues: 'Tumbado, mancuernas neutras. Flexiona solo los codos llevando el peso al lado de las orejas y extiende bloqueando el tríceps arriba.',
          videoUrl: 'https://www.youtube.com/embed/d_KZxkY_0cM',
        },
      },
      {
        id: 'd4-e3',
        name: 'Curl de Bíceps con Barra Z (o en Polea Baja)',
        supersetGroup: 'A',
        supersetOrder: 2,
        targetSets: 4,
        targetReps: '10-12',
        restSeconds: 60,
        cues: 'Agarre cómodo en las curvas de la barra Z. Sube sin mover los codos y aprieta 1 segundo arriba.',
        videoUrl: 'https://www.youtube.com/embed/kwG2ipFRgfo',
        dumbbellAlternative: {
          name: 'Curl de Bíceps con Mancuernas de Pie (Alterno con Supinación)',
          cues: 'Inicia en agarre neutro y gira la muñeca hacia afuera conforme subes. Contracción máxima de 1 segundo arriba antes de bajar controlado.',
          videoUrl: 'https://www.youtube.com/embed/kwG2ipFRgfo',
        },
      },
      {
        id: 'd4-e4',
        name: 'Extensión de Tríceps en Polea Alta con Cuerda (Foco Bombeo)',
        supersetGroup: 'B',
        supersetOrder: 1,
        targetSets: 3,
        targetReps: '12-15',
        restSeconds: 0,
        cues: 'Da un pequeño paso atrás, baja la cuerda y sepárala al final para congestionar todo el tríceps sin forzar el hombro.',
        videoUrl: 'https://www.youtube.com/embed/GzmlxvSFE7A',
        dumbbellAlternative: {
          name: 'Extensión de Tríceps Trasnuca Unilateral con Mancuerna',
          cues: 'Sentado, brazo levantado junto a la oreja. Flexiona el codo por detrás de la cabeza y extiende arriba con la fuerza pura del tríceps.',
          videoUrl: 'https://www.youtube.com/embed/GzmlxvSFE7A',
        },
      },
      {
        id: 'd4-e5',
        name: 'Curl Predicador en Máquina (o en Banco Scott con Barra Z/Mancuerna)',
        supersetGroup: 'B',
        supersetOrder: 2,
        targetSets: 3,
        targetReps: '12-15',
        restSeconds: 60,
        cues: 'El cojín bloquea tus codos para que sea imposible hacer trampa. Baja controlado sin estirar de golpe al final.',
        videoUrl: 'https://www.youtube.com/embed/fIWP-FRFNU0',
        dumbbellAlternative: {
          name: 'Curl Concentrado con Mancuerna Sentado',
          cues: 'Sentado en banco, codo apoyado contra el interior del muslo. Elimina todo balanceo y aísla por completo el bíceps en flexión concentrada.',
          videoUrl: 'https://www.youtube.com/embed/fIWP-FRFNU0',
        },
      },
      {
        id: 'd4-e6',
        name: 'Curl de Bíceps Agarre Inverso (Prono) en Polea Baja',
        supersetGroup: 'C',
        supersetOrder: 1,
        targetSets: 3,
        targetReps: '15',
        restSeconds: 0,
        cues: 'Palmas mirando hacia el suelo con barra corta. Engrosa los antebrazos y la parte externa del brazo.',
        videoUrl: 'https://www.youtube.com/embed/nRgxYX2Ve9w',
        dumbbellAlternative: {
          name: 'Curl Prono con Mancuernas (Palmas Hacia Abajo)',
          cues: 'Sujeta las mancuernas con las palmas mirando al suelo durante todo el recorrido. Sobrecarga directa al braquiorradial y los antebrazos.',
          videoUrl: 'https://www.youtube.com/embed/nRgxYX2Ve9w',
        },
      },
      {
        id: 'd4-e7',
        name: 'Crunch Abdominal en Máquina (o en Polea Alta con Cuerda)',
        supersetGroup: 'C',
        supersetOrder: 2,
        targetSets: 3,
        targetReps: '15',
        restSeconds: 60,
        cues: 'Enfócate en doblar el torso llevando las costillas hacia el abdomen y expulsando todo el aire al apretar.',
        videoUrl: 'https://www.youtube.com/embed/AV5PmZJIrrw',
        dumbbellAlternative: {
          name: 'Crunch en Suelo con Mancuerna al Pecho',
          cues: 'Tumbado en el suelo con rodillas flexionadas, sujeta una mancuerna moderada contra el pecho alto. Eleva las escápulas contrayendo el abdomen sin tirar del cuello.',
          videoUrl: 'https://www.youtube.com/embed/AV5PmZJIrrw',
        },
      },
    ],
  },
];

/**
 * Extracts a 11-character YouTube video ID from any common YouTube URL format
 * (watch?v=, youtu.be/, youtube.com/shorts/, youtube.com/embed/, or raw 11-char ID)
 * and returns a clean embed URL.
 */
export function normalizeYouTubeEmbedUrl(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return '';

  // Raw 11-char YouTube ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return `https://www.youtube.com/embed/${trimmed}`;
  }

  try {
    const url = new URL(trimmed);
    const host = url.hostname.replace(/^www\./, '').toLowerCase();

    if (host === 'youtu.be') {
      const id = url.pathname.split('/').filter(Boolean)[0];
      if (id && /^[a-zA-Z0-9_-]{11}$/.test(id)) {
        return `https://www.youtube.com/embed/${id}`;
      }
    }

    if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'youtube-nocookie.com') {
      const vParam = url.searchParams.get('v');
      if (vParam && /^[a-zA-Z0-9_-]{11}$/.test(vParam)) {
        return `https://www.youtube.com/embed/${vParam}`;
      }

      const segments = url.pathname.split('/').filter(Boolean);
      if (
        (segments[0] === 'embed' || segments[0] === 'shorts' || segments[0] === 'v') &&
        segments[1] &&
        /^[a-zA-Z0-9_-]{11}$/.test(segments[1])
      ) {
        return `https://www.youtube.com/embed/${segments[1]}`;
      }
    }
  } catch {
    // Regex fallback if URL constructor fails
    const match = trimmed.match(
      /(?:youtube\.com\/(?:watch\?.*v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    if (match?.[1]) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }
  }

  return trimmed;
}

/**
 * Returns a direct YouTube watch URL from an embed URL or falls back to a YouTube search URL.
 */
export function getYouTubeWatchUrl(videoUrl: string, exerciseName: string): string {
  const embedUrl = normalizeYouTubeEmbedUrl(videoUrl);
  const match = embedUrl.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/);
  if (match?.[1]) {
    return `https://www.youtube.com/watch?v=${match[1]}`;
  }
  const query = encodeURIComponent(`${exerciseName} técnica hipertrofia`);
  return `https://www.youtube.com/results?search_query=${query}`;
}
