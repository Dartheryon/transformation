export type ExerciseType = 'single' | 'superset';

export type SupersetGroup = 'A' | 'B' | 'C';

export type WeightUnit = 'kg' | 'lbs';

export type ExerciseVariantType = 'machine' | 'dumbbell';

export interface ExerciseVariant {
  name: string;
  cues: string;
  videoUrl: string;
}

export interface Exercise {
  id: string;
  name: string;
  supersetGroup?: 'A' | 'B' | 'C'; // Si pertenece a una superserie
  supersetOrder?: 1 | 2;           // A1 o A2
  targetSets: number;
  targetReps: string;
  restSeconds: number;             // 0 si es A1/B1/C1, 60-90 si es single o A2/B2/C2
  cues: string;                    // Nota biomecánica clave
  videoUrl: string;                // URL de embed de YouTube o búsqueda directa
  dumbbellAlternative?: ExerciseVariant; // Variante con mancuernas si la máquina está ocupada
}

export interface WorkoutDay {
  id: string;
  dayNumber: number;
  title: string;
  subtitle: string;
  exercises: Exercise[];
}

export interface SetLog {
  setNumber: number;
  weight: number;
  reps: number;
  completed: boolean;
}

export interface WorkoutSessionLog {
  id?: string;
  date: string; // ISO
  dayId: string;
  logs: Record<string, SetLog[]>; // key: exerciseId
  durationMinutes?: number;
  notes?: string;
}

export interface PreviousSetReference {
  weight: number;
  reps: number;
  date: string;
}

export interface ActiveTimerState {
  isActive: boolean;
  remainingSeconds: number;
  totalSeconds: number;
  exerciseName: string;
  badgeLabel?: string;
}

export interface ProtocolCountdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  currentWeek: number;
  totalWeeks: number;
  progressPercentage: number;
  isGoalReached: boolean;
}
