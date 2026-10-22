import React, { useMemo } from 'react';
import {
  ArrowDownRight,
  Check,
  Clock,
  Dumbbell,
  Flame,
  History,
  Info,
  PlayCircle,
  Repeat,
  Trophy,
} from 'lucide-react';
import type {
  Exercise,
  ExerciseVariantType,
  PreviousSetReference,
  SetLog,
  WeightUnit,
} from '../types/workout';

interface ExerciseCardProps {
  exercise: Exercise;
  sets: SetLog[];
  weightUnit: WeightUnit;
  getPreviousSetLog: (exerciseId: string, setNumber: number) => PreviousSetReference | null;
  personalRecord: { maxWeight: number; repsAtMax: number; date: string } | null;
  onUpdateSet: (
    exerciseId: string,
    setNumber: number,
    patch: Partial<Pick<SetLog, 'weight' | 'reps' | 'completed'>>
  ) => void;
  onSetCompleted: (exercise: Exercise, setNumber: number) => void;
  onOpenVideo: (exercise: Exercise) => void;
  isInsideSuperset?: boolean;
  activeVariant?: ExerciseVariantType;
  onToggleVariant?: (exerciseId: string) => void;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  sets,
  weightUnit,
  getPreviousSetLog,
  personalRecord,
  onUpdateSet,
  onSetCompleted,
  onOpenVideo,
  isInsideSuperset = false,
  activeVariant = 'machine',
  onToggleVariant,
}) => {
  const isDumbbell = activeVariant === 'dumbbell' && !!exercise.dumbbellAlternative;
  const activeName = isDumbbell ? exercise.dumbbellAlternative!.name : exercise.name;
  const activeCues = isDumbbell ? exercise.dumbbellAlternative!.cues : exercise.cues;
  const activeVideoUrl = isDumbbell ? exercise.dumbbellAlternative!.videoUrl : exercise.videoUrl;

  const currentActiveExercise: Exercise = useMemo(
    () => ({
      ...exercise,
      name: activeName,
      cues: activeCues,
      videoUrl: activeVideoUrl,
    }),
    [exercise, activeName, activeCues, activeVideoUrl]
  );

  const completedCount = sets.filter((s) => s.completed).length;
  const allCompleted = sets.length > 0 && completedCount === sets.length;
  const supersetTag = exercise.supersetGroup
    ? `${exercise.supersetGroup}${exercise.supersetOrder}`
    : null;

  const handleToggleComplete = (setItem: SetLog, prevRef: PreviousSetReference | null) => {
    const nextCompleted = !setItem.completed;
    const patch: Partial<Pick<SetLog, 'weight' | 'reps' | 'completed'>> = {
      completed: nextCompleted,
    };

    // If completing a set with 0 weight/reps and previous session exists, auto-fill from previous session
    if (nextCompleted && setItem.weight === 0 && setItem.reps === 0 && prevRef) {
      patch.weight = prevRef.weight;
      patch.reps = prevRef.reps;
    }

    onUpdateSet(exercise.id, setItem.setNumber, patch);

    if (nextCompleted) {
      onSetCompleted(currentActiveExercise, setItem.setNumber);
    }
  };

  const handleApplyPrevious = (setNumber: number, prevRef: PreviousSetReference) => {
    onUpdateSet(exercise.id, setNumber, {
      weight: prevRef.weight,
      reps: prevRef.reps,
    });
  };

  return (
    <article
      className={`rounded-2xl transition-colors ${
        isInsideSuperset
          ? 'bg-zinc-900/95 p-3.5 sm:p-4'
          : allCompleted
          ? 'border border-emerald-500/40 bg-zinc-900 p-4 shadow-lg shadow-emerald-950/10'
          : 'border border-zinc-800 bg-zinc-900 p-4 shadow-md'
      }`}
    >
      {/* Card Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1.5 min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            {supersetTag ? (
              <span className="inline-flex items-center gap-1 rounded-lg bg-amber-500/20 px-2.5 py-0.5 text-xs font-extrabold tracking-wide text-amber-400 border border-amber-500/40">
                <Flame className="h-3.5 w-3.5" />
                Superserie {supersetTag}
              </span>
            ) : (
              <span className="inline-flex items-center rounded-lg bg-zinc-800 px-2.5 py-0.5 text-xs font-semibold text-zinc-300 border border-zinc-700">
                Ejercicio Individual
              </span>
            )}

            {isDumbbell ? (
              <span className="inline-flex items-center gap-1 rounded-lg bg-amber-500/20 px-2.5 py-0.5 text-xs font-extrabold text-amber-300 border border-amber-500/40 animate-in fade-in">
                <Dumbbell className="h-3.5 w-3.5 text-amber-400" />
                Mancuernas
              </span>
            ) : (
              <span className="inline-flex items-center rounded-lg bg-zinc-800/80 px-2.5 py-0.5 text-xs font-medium text-zinc-400 border border-zinc-700">
                Máquina / Guiado
              </span>
            )}

            <span className="inline-flex items-center gap-1 rounded-lg bg-zinc-950/90 px-2.5 py-0.5 text-xs font-semibold text-zinc-300 border border-zinc-800">
              {exercise.targetSets} series × {exercise.targetReps} reps
            </span>

            <span
              className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-0.5 text-xs font-semibold border ${
                exercise.restSeconds === 0
                  ? 'bg-amber-950/50 text-amber-300 border-amber-500/30'
                  : 'bg-zinc-950/90 text-zinc-400 border-zinc-800'
              }`}
            >
              <Clock className="h-3 w-3" />
              {exercise.restSeconds === 0
                ? 'Sin descanso (0s)'
                : `Descanso: ${exercise.restSeconds}s`}
            </span>

            {personalRecord && (
              <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-400 border border-emerald-500/25">
                <Trophy className="h-3 w-3" />
                PR: {personalRecord.maxWeight}
                {weightUnit} × {personalRecord.repsAtMax}
              </span>
            )}
          </div>

          <h3 className="text-base sm:text-lg font-bold leading-snug text-zinc-100">
            {activeName}
          </h3>

          {/* Biomechanical Cue Preview */}
          <p className="flex items-start gap-1.5 text-xs leading-relaxed text-zinc-400">
            <Info className="h-3.5 w-3.5 shrink-0 text-emerald-400 mt-0.5" />
            <span>{activeCues}</span>
          </p>
        </div>

        {/* Action Buttons: Alternar Mancuernas + Ver Técnica (>= 44px touch target) */}
        <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2 pt-1 sm:pt-0">
          <div className="text-xs font-semibold text-zinc-400 sm:hidden">
            Progreso:{' '}
            <span className={allCompleted ? 'text-emerald-400 font-bold' : 'text-zinc-200'}>
              {completedCount}/{sets.length} series
            </span>
          </div>

          {exercise.dumbbellAlternative && onToggleVariant && (
            <button
              type="button"
              onClick={() => onToggleVariant(exercise.id)}
              title={
                isDumbbell
                  ? 'Volver a la versión original de máquina'
                  : 'Alternar a variante con mancuernas si la máquina está ocupada'
              }
              aria-label={
                isDumbbell
                  ? 'Volver a máquina'
                  : 'Cambiar a variante con mancuernas'
              }
              className={`inline-flex min-h-[44px] shrink-0 items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold transition active:scale-95 ${
                isDumbbell
                  ? 'border-amber-500/50 bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 shadow-sm shadow-amber-950/20'
                  : 'border-zinc-700/80 bg-zinc-950 text-zinc-300 hover:border-amber-500/40 hover:bg-zinc-800 hover:text-amber-300'
              }`}
            >
              <Dumbbell className="h-4 w-4 text-amber-400" />
              <span>{isDumbbell ? 'Volver a Máquina' : 'Usar Mancuerna'}</span>
              <Repeat className="h-3 w-3 opacity-60 ml-0.5" />
            </button>
          )}

          <button
            type="button"
            onClick={() => onOpenVideo(currentActiveExercise)}
            className="inline-flex min-h-[44px] shrink-0 items-center justify-center gap-2 rounded-xl border border-zinc-700/80 bg-zinc-950 px-3.5 py-2 text-xs font-bold text-zinc-200 transition hover:border-emerald-500/50 hover:bg-zinc-800 hover:text-emerald-300 active:scale-95"
          >
            <PlayCircle className="h-4 w-4 text-emerald-400" />
            <span>Ver Técnica</span>
          </button>
        </div>
      </div>

      {/* Sets Table Header */}
      <div className="mt-4 space-y-2">
        <div className="grid grid-cols-12 items-center gap-1.5 px-2 text-[11px] font-bold uppercase tracking-wider text-zinc-500">
          <div className="col-span-2">Serie</div>
          <div className="col-span-3">Anterior</div>
          <div className="col-span-3 text-center">Peso ({weightUnit})</div>
          <div className="col-span-2 text-center">Reps</div>
          <div className="col-span-2 text-right">Listo</div>
        </div>

        {/* Sets Rows */}
        {sets.map((setItem) => {
          const prevRef = getPreviousSetLog(exercise.id, setItem.setNumber);
          const isDone = setItem.completed;

          return (
            <div
              key={setItem.setNumber}
              className={`grid grid-cols-12 items-center gap-1.5 rounded-xl border p-1.5 transition-colors ${
                isDone
                  ? 'border-emerald-500/40 bg-emerald-950/25'
                  : 'border-zinc-800/90 bg-zinc-950/60'
              }`}
            >
              {/* Set Number */}
              <div className="col-span-2 flex items-center gap-1.5 pl-1">
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-extrabold ${
                    isDone
                      ? 'bg-emerald-500 text-zinc-950'
                      : 'bg-zinc-800 text-zinc-300'
                  }`}
                >
                  {setItem.setNumber}
                </span>
              </div>

              {/* Previous Session Badge (tap to copy) */}
              <div className="col-span-3 min-w-0">
                {prevRef ? (
                  <button
                    type="button"
                    onClick={() => handleApplyPrevious(setItem.setNumber, prevRef)}
                    title="Toca para copiar peso y repeticiones anteriores"
                    className="group flex min-h-[44px] w-full flex-col justify-center rounded-lg px-1.5 text-left transition hover:bg-zinc-800/70 active:scale-95"
                  >
                    <span className="flex items-center gap-1 text-[10px] font-medium text-zinc-500 group-hover:text-zinc-400">
                      <History className="h-2.5 w-2.5 shrink-0" />
                      Anterior
                    </span>
                    <span className="truncate text-xs font-bold text-zinc-400 group-hover:text-emerald-300">
                      {prevRef.weight}
                      {weightUnit} × {prevRef.reps}
                    </span>
                  </button>
                ) : (
                  <div className="flex min-h-[44px] items-center px-1.5 text-[11px] text-zinc-600">
                    <span className="truncate">Meta: {exercise.targetReps}</span>
                  </div>
                )}
              </div>

              {/* Weight Input */}
              <div className="col-span-3">
                <label className="sr-only" htmlFor={`${exercise.id}-s${setItem.setNumber}-weight`}>
                  Peso serie {setItem.setNumber}
                </label>
                <input
                  id={`${exercise.id}-s${setItem.setNumber}-weight`}
                  type="number"
                  inputMode="decimal"
                  step="0.5"
                  min="0"
                  value={setItem.weight === 0 ? '' : setItem.weight}
                  placeholder={prevRef ? String(prevRef.weight) : '0'}
                  onChange={(e) => {
                    const val = e.target.value === '' ? 0 : parseFloat(e.target.value);
                    onUpdateSet(exercise.id, setItem.setNumber, {
                      weight: Number.isNaN(val) ? 0 : Math.max(0, val),
                    });
                  }}
                  className={`min-h-[44px] w-full rounded-xl border px-2 text-center text-sm font-bold tabular-nums transition focus:outline-none ${
                    isDone
                      ? 'border-emerald-500/40 bg-emerald-950/40 text-emerald-200 placeholder-emerald-600/50 focus:border-emerald-400'
                      : 'border-zinc-800 bg-zinc-900 text-zinc-100 placeholder-zinc-600 focus:border-emerald-500'
                  }`}
                />
              </div>

              {/* Reps Input */}
              <div className="col-span-2">
                <label className="sr-only" htmlFor={`${exercise.id}-s${setItem.setNumber}-reps`}>
                  Repeticiones serie {setItem.setNumber}
                </label>
                <input
                  id={`${exercise.id}-s${setItem.setNumber}-reps`}
                  type="number"
                  inputMode="numeric"
                  step="1"
                  min="0"
                  value={setItem.reps === 0 ? '' : setItem.reps}
                  placeholder={
                    prevRef
                      ? String(prevRef.reps)
                      : exercise.targetReps.split('-')[0]
                  }
                  onChange={(e) => {
                    const val = e.target.value === '' ? 0 : parseInt(e.target.value, 10);
                    onUpdateSet(exercise.id, setItem.setNumber, {
                      reps: Number.isNaN(val) ? 0 : Math.max(0, val),
                    });
                  }}
                  className={`min-h-[44px] w-full rounded-xl border px-1.5 text-center text-sm font-bold tabular-nums transition focus:outline-none ${
                    isDone
                      ? 'border-emerald-500/40 bg-emerald-950/40 text-emerald-200 placeholder-emerald-600/50 focus:border-emerald-400'
                      : 'border-zinc-800 bg-zinc-900 text-zinc-100 placeholder-zinc-600 focus:border-emerald-500'
                  }`}
                />
              </div>

              {/* Complete Set Button (>= 44px touch target) */}
              <div className="col-span-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => handleToggleComplete(setItem, prevRef)}
                  aria-label={
                    isDone
                      ? `Desmarcar serie ${setItem.setNumber}`
                      : `Completar serie ${setItem.setNumber}`
                  }
                  aria-pressed={isDone}
                  className={`flex min-h-[44px] min-w-[44px] w-full max-w-[52px] items-center justify-center rounded-xl border font-bold transition active:scale-95 ${
                    isDone
                      ? 'border-emerald-400 bg-emerald-500 text-zinc-950 shadow-md shadow-emerald-500/20'
                      : 'border-zinc-700 bg-zinc-900 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200'
                  }`}
                >
                  <Check className="h-5 w-5 stroke-[2.75]" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Zero-rest reminder footer for A1/B1/C1 exercises */}
      {exercise.restSeconds === 0 && (
        <div className="mt-3 flex items-center gap-2 rounded-xl border border-amber-500/25 bg-amber-950/20 px-3 py-2 text-xs text-amber-300">
          <ArrowDownRight className="h-4 w-4 shrink-0 text-amber-400" />
          <span>
            Al terminar cada serie de <strong>{supersetTag}</strong>, pasa{' '}
            <strong>sin descanso (0s)</strong> al ejercicio{' '}
            <strong>{exercise.supersetGroup}2</strong>.
          </span>
        </div>
      )}
    </article>
  );
};
