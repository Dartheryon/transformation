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
      },
      {
        id: 'd1-e2',
        name: 'Press de Hombros en Máquina Sentado',
        targetSets: 3,
        targetReps: '10-12',
        restSeconds: 90,
        cues: 'Pega bien la espalda al respaldo. Empuja sin chocar las placas al bajar para mantener tensión continua en los hombros.',
        videoUrl: 'https://www.youtube.com/embed/qEwKCR5JCog',
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
      },
      {
        id: 'd2-e2',
        name: 'Remo en Máquina Sentado con Apoyo en el Pecho (Agarre abierto)',
        targetSets: 4,
        targetReps: '10-12',
        restSeconds: 90,
        cues: 'El cojín del pecho protege tu espalda baja. Tira llevando los codos hacia atrás y junta las escápulas al final.',
        videoUrl: 'https://www.youtube.com/embed/TeFo51Q_Nsc',
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
      },
      {
        id: 'd3-e2',
        name: 'Curl Femoral Sentado (o Tumbado) en Máquina',
        targetSets: 3,
        targetReps: '12',
        restSeconds: 60,
        cues: 'Ajusta el rodillo sobre los tobillos y controla la subida en 2 segundos para no dejar caer las placas de golpe.',
        videoUrl: 'https://www.youtube.com/embed/1Tq3QdYUuHs',
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
