import React, { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  ArrowDown,
  Award,
  Calendar,
  CheckCircle2,
  Dumbbell,
  Flame,
  History,
  Layers,
  RotateCcw,
  Save,
  Scale,
  ShieldCheck,
  Sparkles,
  Target,
  Trash2,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { WORKOUT_PLAN } from './data/workoutPlan';
import { useWorkoutTracker } from './hooks/useWorkoutTracker';
import { ExerciseCard } from './components/ExerciseCard';
import { RestTimer } from './components/RestTimer';
import { VideoModal } from './components/VideoModal';
import type { ActiveTimerState, Exercise, SupersetGroup } from './types/workout';

export type ExerciseRenderBlock =
  | { type: 'single'; exercise: Exercise }
  | {
      type: 'superset';
      group: SupersetGroup;
      exercises: Exercise[];
    };

export function groupDayExercises(exercises: Exercise[]): ExerciseRenderBlock[] {
  const blocks: ExerciseRenderBlock[] = [];
  let i = 0;

  while (i < exercises.length) {
    const current = exercises[i];
    if (!current.supersetGroup) {
      blocks.push({ type: 'single', exercise: current });
      i += 1;
    } else {
      const group = current.supersetGroup;
      const groupExercises: Exercise[] = [current];
      let j = i + 1;
      while (j < exercises.length && exercises[j].supersetGroup === group) {
        groupExercises.push(exercises[j]);
        j += 1;
      }
      blocks.push({
        type: 'superset',
        group,
        exercises: groupExercises,
      });
      i = j;
    }
  }

  return blocks;
}

export function App() {
  const {
    selectedDayId,
    setSelectedDayId,
    activeLogs,
    updateSetLog,
    getPreviousSetLog,
    getExercisePersonalRecord,
    saveWorkoutSession,
    resetDayActiveLogs,
    sessionHistory,
    deleteHistorySession,
    isCreatineTakenToday,
    toggleCreatineToday,
    creatineStreak,
    creatineDates,
    getExerciseVideoUrl,
    setCustomVideoUrl,
    resetCustomVideoUrl,
    videoOverrides,
    weightUnit,
    toggleWeightUnit,
    countdown,
  } = useWorkoutTracker();

  const [activeTab, setActiveTab] = useState<'workout' | 'history'>('workout');
  const [videoModalExercise, setVideoModalExercise] = useState<Exercise | null>(null);
  const [timer, setTimer] = useState<ActiveTimerState | null>(null);
  const [statusBanner, setStatusBanner] = useState<{
    message: string;
    tone: 'emerald' | 'amber';
  } | null>(null);

  // RestTimer 1-second countdown interval
  useEffect(() => {
    if (!timer || !timer.isActive || timer.remainingSeconds <= 0) return;

    const id = window.setInterval(() => {
      setTimer((prev) => {
        if (!prev || !prev.isActive) return prev;
        const nextRemaining = Math.max(0, prev.remainingSeconds - 1);
        return {
          ...prev,
          remainingSeconds: nextRemaining,
        };
      });
    }, 1000);

    return () => window.clearInterval(id);
  }, [timer]);

  // Auto-clear transient status banner
  useEffect(() => {
    if (!statusBanner) return;
    const id = window.setTimeout(() => setStatusBanner(null), 4000);
    return () => window.clearTimeout(id);
  }, [statusBanner]);

  const currentDay = useMemo(
    () => WORKOUT_PLAN.find((d) => d.id === selectedDayId) ?? WORKOUT_PLAN[0],
    [selectedDayId]
  );

  const exerciseBlocks = useMemo(
    () => groupDayExercises(currentDay.exercises),
    [currentDay.exercises]
  );

  const dayLogs = activeLogs[currentDay.id] ?? {};

  const dayProgress = useMemo(() => {
    let totalSets = 0;
    let completedSets = 0;
    let totalVolume = 0;

    for (const exercise of currentDay.exercises) {
      const sets = dayLogs[exercise.id] ?? [];
      totalSets += sets.length;
      for (const s of sets) {
        if (s.completed) {
          completedSets += 1;
          totalVolume += s.weight * s.reps;
        }
      }
    }

    const percent = totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0;
    return { totalSets, completedSets, totalVolume, percent };
  }, [currentDay.exercises, dayLogs]);

  const handleSetCompleted = (exercise: Exercise, setNumber: number) => {
    if (exercise.restSeconds > 0) {
      const badgeLabel = exercise.supersetGroup
        ? `Superserie ${exercise.supersetGroup}${exercise.supersetOrder} · Serie ${setNumber}`
        : `Serie ${setNumber}`;

      setTimer({
        isActive: true,
        remainingSeconds: exercise.restSeconds,
        totalSeconds: exercise.restSeconds,
        exerciseName: exercise.name,
        badgeLabel,
      });
    } else if (exercise.supersetGroup) {
      setStatusBanner({
        tone: 'amber',
        message: `¡Serie ${setNumber} de ${exercise.supersetGroup}1 lista! Pasa SIN DESCANSO (0s) a ${exercise.supersetGroup}2.`,
      });
    }
  };

  const handleAdjustTimer = (deltaSeconds: number) => {
    setTimer((prev) => {
      if (!prev) return null;
      const nextRemaining = Math.max(0, prev.remainingSeconds + deltaSeconds);
      const nextTotal = Math.max(prev.totalSeconds, nextRemaining);
      return {
        ...prev,
        remainingSeconds: nextRemaining,
        totalSeconds: nextTotal,
      };
    });
  };

  const handleSkipTimer = () => {
    setTimer(null);
  };

  const handleSaveSession = () => {
    const saved = saveWorkoutSession(currentDay.id);
    if (saved) {
      setTimer(null);
      setStatusBanner({
        tone: 'emerald',
        message: `¡Sesión de ${currentDay.title} guardada en tu historial para sobrecarga progresiva!`,
      });
    } else {
      setStatusBanner({
        tone: 'amber',
        message: 'Completa o registra al menos una serie antes de guardar la sesión.',
      });
    }
  };

  const historyStats = useMemo(() => {
    let totalCompletedSets = 0;
    let totalVolume = 0;
    for (const session of sessionHistory) {
      for (const sets of Object.values(session.logs)) {
        for (const s of sets) {
          if (s.completed) {
            totalCompletedSets += 1;
            totalVolume += s.weight * s.reps;
          }
        }
      }
    }
    return {
      totalSessions: sessionHistory.length,
      totalCompletedSets,
      totalVolume,
    };
  }, [sessionHistory]);

  return (
    <div className="min-h-dvh bg-zinc-950 text-zinc-100 pb-32">
      {/* Top Countdown & Protocol Header */}
      <header className="sticky top-0 z-30 border-b border-zinc-800/90 bg-zinc-950/95 backdrop-blur-md">
        <div className="mx-auto max-w-2xl px-3.5 py-3 space-y-2.5">
          {/* Row 1: Brand Title + Target Date Countdown + Unit Toggle */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-amber-500/20 border border-emerald-500/40 text-emerald-400 shadow-inner">
                <Dumbbell className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400">
                    Protocolo Mutación Ultra D activado.
                  </span>
                </div>
              </div>
            </div>

            {/* Live Countdown Pills */}
            <div className="flex items-center gap-1.5">
              <div
                aria-label="Cuenta regresiva al 5 de diciembre"
                className="flex items-center gap-1 rounded-xl border border-zinc-800 bg-zinc-900 px-2.5 py-1.5 text-xs font-mono"
              >
                <Target className="h-3.5 w-3.5 text-amber-400 mr-0.5 shrink-0" />
                <span className="font-bold text-zinc-100">{countdown.days}d</span>
                <span className="text-zinc-600">:</span>
                <span className="font-bold text-zinc-200">
                  {String(countdown.hours).padStart(2, '0')}h
                </span>
                <span className="text-zinc-600">:</span>
                <span className="font-bold text-zinc-300">
                  {String(countdown.minutes).padStart(2, '0')}m
                </span>
                <span className="text-zinc-600">:</span>
                <span className="font-bold text-emerald-400">
                  {String(countdown.seconds).padStart(2, '0')}s
                </span>
              </div>

              <button
                type="button"
                onClick={toggleWeightUnit}
                title="Cambiar unidad de peso (kg / lbs)"
                className="inline-flex min-h-[44px] min-w-[48px] items-center justify-center gap-1 rounded-xl border border-zinc-800 bg-zinc-900 px-2.5 text-xs font-extrabold uppercase text-zinc-200 transition hover:border-zinc-700 hover:bg-zinc-800 active:scale-95"
              >
                <Scale className="h-3.5 w-3.5 text-emerald-400" />
                {weightUnit}
              </button>
            </div>
          </div>

          {/* Row 2: Week 1-6 Progress Bar & Daily Creatine Check (>= 44px) */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1 rounded-xl border border-zinc-800/90 bg-zinc-900/80 px-3 py-2">
              <div className="flex items-center justify-between text-[11px] font-bold">
                <span className="flex items-center gap-1.5 text-zinc-300">
                  <Calendar className="h-3.5 w-3.5 text-emerald-400" />
                  Semana {countdown.currentWeek} de {countdown.totalWeeks}
                </span>
                <span className="text-emerald-400">{countdown.progressPercentage}% del bloque</span>
              </div>
              <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-amber-400 transition-all duration-500"
                  style={{ width: `${countdown.progressPercentage}%` }}
                />
              </div>
            </div>

            {/* Daily Creatine 5g Button */}
            <button
              type="button"
              onClick={toggleCreatineToday}
              aria-pressed={isCreatineTakenToday}
              className={`inline-flex min-h-[44px] shrink-0 items-center justify-between sm:justify-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-bold transition active:scale-95 ${
                isCreatineTakenToday
                  ? 'border-emerald-500/50 bg-emerald-950/60 text-emerald-300 shadow-sm shadow-emerald-500/10'
                  : 'border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-800'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <ShieldCheck
                  className={`h-4 w-4 ${
                    isCreatineTakenToday ? 'text-emerald-400' : 'text-zinc-500'
                  }`}
                />
                <span>Creatina 5g Hoy</span>
              </span>
              <span
                className={`rounded-md px-1.5 py-0.5 text-[10px] font-extrabold ${
                  isCreatineTakenToday
                    ? 'bg-emerald-500 text-zinc-950'
                    : 'bg-zinc-800 text-zinc-400'
                }`}
              >
                {isCreatineTakenToday ? 'TOMADA ✓' : 'PENDIENTE'}
                {creatineStreak > 0 ? ` · ${creatineStreak}d` : ''}
              </span>
            </button>
          </div>

          {/* Row 3: Fast Day Navigation + History Tab */}
          <nav
            aria-label="Selector de días de entrenamiento"
            className="grid grid-cols-5 gap-1.5 pt-0.5"
          >
            {WORKOUT_PLAN.map((day) => {
              const isSelected = activeTab === 'workout' && currentDay.id === day.id;
              const logsForDay = activeLogs[day.id] ?? {};
              const doneSets = Object.values(logsForDay).reduce(
                (acc, sets) => acc + sets.filter((s) => s.completed).length,
                0
              );
              const totalSets = day.exercises.reduce((acc, ex) => acc + ex.targetSets, 0);

              return (
                <button
                  key={day.id}
                  type="button"
                  onClick={() => {
                    setSelectedDayId(day.id);
                    setActiveTab('workout');
                  }}
                  className={`flex min-h-[44px] flex-col items-center justify-center rounded-xl border px-1.5 py-1 text-center transition active:scale-95 ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-500/15 text-emerald-300 shadow-sm'
                      : 'border-zinc-800 bg-zinc-900/90 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                  }`}
                >
                  <span className="text-xs font-extrabold">Día {day.dayNumber}</span>
                  <span className="text-[10px] font-medium text-zinc-500">
                    {doneSets > 0 ? `${doneSets}/${totalSets}` : `${ day.exercises.length } ej.`}
                  </span>
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => setActiveTab('history')}
              className={`flex min-h-[44px] flex-col items-center justify-center rounded-xl border px-1.5 py-1 text-center transition active:scale-95 ${
                activeTab === 'history'
                  ? 'border-amber-500 bg-amber-500/15 text-amber-300 shadow-sm'
                  : 'border-zinc-800 bg-zinc-900/90 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
              }`}
            >
              <span className="flex items-center gap-1 text-xs font-extrabold">
                <History className="h-3.5 w-3.5" />
                Historial
              </span>
              <span className="text-[10px] font-medium text-zinc-500">
                {sessionHistory.length} ses.
              </span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="mx-auto max-w-2xl px-3.5 pt-4 space-y-4">
        {/* Status Toast / Superset Prompt Banner */}
        {statusBanner && (
          <div
            role="status"
            className={`flex items-center justify-between gap-3 rounded-xl border px-3.5 py-2.5 text-xs font-bold shadow-lg ${
              statusBanner.tone === 'emerald'
                ? 'border-emerald-500/50 bg-emerald-950/90 text-emerald-200'
                : 'border-amber-500/50 bg-amber-950/90 text-amber-200'
            }`}
          >
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 shrink-0" />
              <span>{statusBanner.message}</span>
            </div>
            <button
              type="button"
              onClick={() => setStatusBanner(null)}
              className="min-h-[32px] px-2 text-[11px] underline opacity-80 hover:opacity-100"
            >
              Cerrar
            </button>
          </div>
        )}

        {activeTab === 'workout' ? (
          <>
            {/* Selected Day Overview Banner */}
            <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 shadow-md">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/15 px-2 py-0.5 text-[11px] font-bold text-emerald-400 border border-emerald-500/30">
                      <Sparkles className="h-3 w-3" />
                      Frecuencia Estética en V
                    </span>
                    <span className="text-xs font-semibold text-zinc-400">
                      {currentDay.exercises.length} ejercicios
                    </span>
                  </div>
                  <h2 className="mt-1 text-lg sm:text-xl font-extrabold text-zinc-100">
                    {currentDay.title}
                  </h2>
                  <p className="text-xs sm:text-sm font-medium text-zinc-400">
                    {currentDay.subtitle}
                  </p>
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-950/80 px-3.5 py-2.5">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                      Series Completadas
                    </div>
                    <div className="text-base font-black text-emerald-400 tabular-nums">
                      {dayProgress.completedSets} / {dayProgress.totalSets}{' '}
                      <span className="text-xs font-normal text-zinc-400">
                        ({dayProgress.percent}%)
                      </span>
                    </div>
                  </div>
                  <div className="h-7 w-px bg-zinc-800" />
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                      Volumen Activo
                    </div>
                    <div className="text-base font-black text-zinc-200 tabular-nums">
                      {dayProgress.totalVolume.toLocaleString('es-ES')} {weightUnit}
                    </div>
                  </div>
                </div>
              </div>

              {/* Day Completion Progress Bar */}
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-zinc-950">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all duration-300"
                  style={{ width: `${dayProgress.percent}%` }}
                />
              </div>
            </section>

            {/* Exercise Blocks (Single + Superset Containers) */}
            <div className="space-y-4">
              {exerciseBlocks.map((block) => {
                if (block.type === 'single') {
                  const ex = block.exercise;
                  return (
                    <ExerciseCard
                      key={ex.id}
                      exercise={ex}
                      sets={dayLogs[ex.id] ?? []}
                      weightUnit={weightUnit}
                      getPreviousSetLog={getPreviousSetLog}
                      personalRecord={getExercisePersonalRecord(ex.id)}
                      onUpdateSet={(exId, setNum, patch) =>
                        updateSetLog(currentDay.id, exId, setNum, patch)
                      }
                      onSetCompleted={handleSetCompleted}
                      onOpenVideo={(exercise) => setVideoModalExercise(exercise)}
                    />
                  );
                }

                // Superset Block (A1 + A2, B1 + B2, C1 + C2)
                const secondExercise = block.exercises[1];
                const supersetRest = secondExercise ? secondExercise.restSeconds : 60;

                return (
                  <section
                    key={`superset-${currentDay.id}-${block.group}`}
                    aria-label={`Bloque de Superserie ${block.group}`}
                    className="overflow-hidden rounded-2xl border-2 border-amber-500/45 bg-gradient-to-b from-amber-950/20 via-zinc-900 to-zinc-900 shadow-lg"
                  >
                    {/* Superset Container Header */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-500/30 bg-amber-500/10 px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500 px-2.5 py-1 text-xs font-black uppercase tracking-wider text-zinc-950">
                          <Layers className="h-3.5 w-3.5" />
                          Bloque Superserie {block.group} ({block.group}1 + {block.group}2)
                        </span>
                      </div>
                      <span className="text-xs font-bold text-amber-300">
                        0s entre {block.group}1 y {block.group}2 · {supersetRest}s al terminar{' '}
                        {block.group}2
                      </span>
                    </div>

                    {/* Superset Exercises with Connector */}
                    <div className="divide-y divide-amber-500/20 p-2 sm:p-3 space-y-2">
                      {block.exercises.map((ex, idx) => (
                        <React.Fragment key={ex.id}>
                          {idx > 0 && (
                            <div className="my-2 flex items-center justify-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-center text-xs font-extrabold uppercase tracking-wide text-amber-300">
                              <ArrowDown className="h-4 w-4 animate-bounce text-amber-400" />
                              <span>
                                Sin descanso (0s) entre ejercicios — Pasa directo a {block.group}2
                              </span>
                              <ArrowDown className="h-4 w-4 animate-bounce text-amber-400" />
                            </div>
                          )}

                          <ExerciseCard
                            exercise={ex}
                            sets={dayLogs[ex.id] ?? []}
                            weightUnit={weightUnit}
                            getPreviousSetLog={getPreviousSetLog}
                            personalRecord={getExercisePersonalRecord(ex.id)}
                            onUpdateSet={(exId, setNum, patch) =>
                              updateSetLog(currentDay.id, exId, setNum, patch)
                            }
                            onSetCompleted={handleSetCompleted}
                            onOpenVideo={(exercise) => setVideoModalExercise(exercise)}
                            isInsideSuperset
                          />
                        </React.Fragment>
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>

            {/* Session Footer Actions (Save Session / Reset Day) */}
            <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 space-y-3">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                <div>
                  <h3 className="text-sm font-bold text-zinc-100">
                    ¿Terminaste el entrenamiento de hoy?
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Guarda la sesión para registrar tus pesos como referencia &ldquo;Anterior&rdquo; en la próxima semana.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    type="button"
                    onClick={() => resetDayActiveLogs(currentDay.id)}
                    className="inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl border border-zinc-700 bg-zinc-950 px-3.5 py-2.5 text-xs font-bold text-zinc-300 transition hover:bg-zinc-800 active:scale-95"
                  >
                    <RotateCcw className="h-4 w-4 text-zinc-400" />
                    Reiniciar Día
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveSession}
                    className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-xs font-extrabold text-zinc-950 shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400 active:scale-95"
                  >
                    <Save className="h-4 w-4" />
                    Finalizar y Guardar Sesión
                  </button>
                </div>
              </div>
            </section>
          </>
        ) : (
          /* History & Progressive Overload View */
          <div className="space-y-4">
            {/* Summary Metrics Grid */}
            <section className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-3.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-400">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  Sesiones
                </div>
                <div className="mt-1 text-2xl font-black text-zinc-100">
                  {historyStats.totalSessions}
                </div>
                <div className="text-[11px] text-zinc-500">Entrenamientos guardados</div>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-3.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-400">
                  <Activity className="h-4 w-4 text-amber-400" />
                  Series Totales
                </div>
                <div className="mt-1 text-2xl font-black text-zinc-100">
                  {historyStats.totalCompletedSets}
                </div>
                <div className="text-[11px] text-zinc-500">Series efectivas</div>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-3.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-400">
                  <TrendingUp className="h-4 w-4 text-emerald-400" />
                  Volumen Total
                </div>
                <div className="mt-1 text-2xl font-black text-zinc-100">
                  {historyStats.totalVolume.toLocaleString('es-ES')}{' '}
                  <span className="text-xs font-bold text-zinc-400">{weightUnit}</span>
                </div>
                <div className="text-[11px] text-zinc-500">Carga movilizada</div>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-3.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-400">
                  <Flame className="h-4 w-4 text-amber-400" />
                  Creatina 5g
                </div>
                <div className="mt-1 text-2xl font-black text-emerald-400">
                  {creatineDates.length} días
                </div>
                <div className="text-[11px] text-zinc-500">
                  Racha actual: {creatineStreak} día(s)
                </div>
              </div>
            </section>

            {/* Personal Records by Day */}
            <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-amber-400" />
                  <h2 className="text-base font-extrabold text-zinc-100">
                    Marcas de Sobrecarga Progresiva (PRs)
                  </h2>
                </div>
                <span className="text-xs text-zinc-400">Mejor serie registrada</span>
              </div>

              <div className="divide-y divide-zinc-800/80">
                {WORKOUT_PLAN.flatMap((day) =>
                  day.exercises.map((ex) => {
                    const pr = getExercisePersonalRecord(ex.id);
                    return (
                      <div
                        key={ex.id}
                        className="flex items-center justify-between gap-2 py-2.5 text-xs"
                      >
                        <div className="min-w-0">
                          <span className="font-semibold text-zinc-300">{ex.name}</span>
                          <span className="ml-2 text-[10px] text-zinc-500">
                            (Día {day.dayNumber})
                          </span>
                        </div>
                        {pr ? (
                          <span className="shrink-0 rounded-lg bg-emerald-500/15 px-2.5 py-1 font-mono font-bold text-emerald-300 border border-emerald-500/30">
                            {pr.maxWeight} {weightUnit} × {pr.repsAtMax} reps
                          </span>
                        ) : (
                          <span className="shrink-0 text-zinc-600">Sin registro previo</span>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </section>

            {/* Saved Sessions Log List */}
            <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-extrabold text-zinc-100">
                  Historial de Sesiones Guardadas
                </h2>
                <span className="text-xs text-zinc-400">{sessionHistory.length} registros</span>
              </div>

              {sessionHistory.length === 0 ? (
                <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-6 text-center space-y-2">
                  <History className="mx-auto h-8 w-8 text-zinc-600" />
                  <p className="text-sm font-bold text-zinc-300">
                    Aún no has guardado sesiones en el historial
                  </p>
                  <p className="text-xs text-zinc-500 max-w-md mx-auto">
                    Registra tus pesos y repeticiones en cualquiera de los 4 días y pulsa
                    &ldquo;Finalizar y Guardar Sesión&rdquo; para activar las referencias de
                    sobrecarga progresiva.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {sessionHistory.map((session) => {
                    const dayInfo = WORKOUT_PLAN.find((d) => d.id === session.dayId);
                    const formattedDate = new Date(session.date).toLocaleDateString('es-ES', {
                      weekday: 'short',
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    });

                    return (
                      <div
                        key={session.id ?? session.date}
                        className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-3.5 space-y-2.5"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div>
                            <h3 className="text-sm font-bold text-emerald-400">
                              {dayInfo ? dayInfo.title : session.dayId}
                            </h3>
                            <p className="text-xs text-zinc-400">{formattedDate}</p>
                          </div>

                          <button
                            type="button"
                            onClick={() => deleteHistorySession(session.id ?? session.date)}
                            aria-label="Eliminar sesión del historial"
                            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-400 transition hover:border-red-500/40 hover:text-red-400"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="grid gap-1.5 text-xs">
                          {dayInfo?.exercises.map((ex) => {
                            const sets = (session.logs[ex.id] ?? []).filter(
                              (s) => s.completed || s.weight > 0 || s.reps > 0
                            );
                            if (sets.length === 0) return null;
                            return (
                              <div
                                key={ex.id}
                                className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-zinc-900/90 px-2.5 py-1.5"
                              >
                                <span className="font-medium text-zinc-300">{ex.name}</span>
                                <div className="flex flex-wrap gap-1.5">
                                  {sets.map((s) => (
                                    <span
                                      key={s.setNumber}
                                      className="rounded bg-zinc-950 px-1.5 py-0.5 font-mono text-[11px] text-zinc-300 border border-zinc-800"
                                    >
                                      S{s.setNumber}: {s.weight}
                                      {weightUnit}×{s.reps}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </div>
        )}
      </main>

      {/* Floating Rest Timer */}
      <RestTimer
        timer={timer}
        onAdjustSeconds={handleAdjustTimer}
        onSkip={handleSkipTimer}
      />

      {/* Native Dialog Video & Biomechanical Cue Modal */}
      <VideoModal
        exercise={videoModalExercise}
        currentVideoUrl={
          videoModalExercise ? getExerciseVideoUrl(videoModalExercise) : ''
        }
        hasCustomOverride={
          videoModalExercise ? Boolean(videoOverrides[videoModalExercise.id]) : false
        }
        onClose={() => setVideoModalExercise(null)}
        onSaveCustomUrl={setCustomVideoUrl}
        onResetCustomUrl={resetCustomVideoUrl}
      />
    </div>
  );
}

export default App;
