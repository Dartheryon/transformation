import { useState, useEffect, useCallback, useMemo } from 'react';
import type {
  Exercise,
  PreviousSetReference,
  ProtocolCountdown,
  SetLog,
  WeightUnit,
  WorkoutSessionLog,
} from '../types/workout';
import {
  PROTOCOL_TARGET_DATE_ISO,
  PROTOCOL_TOTAL_WEEKS,
  WORKOUT_PLAN,
  normalizeYouTubeEmbedUrl,
} from '../data/workoutPlan';

const STORAGE_KEYS = {
  ACTIVE_LOGS: 'ultrad_active_logs_v1',
  SESSION_HISTORY: 'ultrad_session_history_v1',
  CREATINE_LOGS: 'ultrad_creatine_dates_v1',
  VIDEO_OVERRIDES: 'ultrad_video_overrides_v1',
  WEIGHT_UNIT: 'ultrad_weight_unit_v1',
  SELECTED_DAY: 'ultrad_selected_day_v1',
} as const;

const LEGACY_STORAGE_KEYS = {
  ACTIVE_LOGS: 'vtaper_active_logs_v1',
  SESSION_HISTORY: 'vtaper_session_history_v1',
  CREATINE_LOGS: 'vtaper_creatine_dates_v1',
  VIDEO_OVERRIDES: 'vtaper_video_overrides_v1',
  WEIGHT_UNIT: 'vtaper_weight_unit_v1',
  SELECTED_DAY: 'vtaper_selected_day_v1',
} as const;

export type ActiveDayLogsMap = Record<string, Record<string, SetLog[]>>;

export function getLocalDateKey(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function buildDefaultDayLogs(dayId: string): Record<string, SetLog[]> {
  const day = WORKOUT_PLAN.find((d) => d.id === dayId);
  if (!day) return {};

  const logs: Record<string, SetLog[]> = {};
  for (const exercise of day.exercises) {
    logs[exercise.id] = Array.from({ length: exercise.targetSets }, (_, idx) => ({
      setNumber: idx + 1,
      weight: 0,
      reps: 0,
      completed: false,
    }));
  }
  return logs;
}

export function buildInitialActiveLogs(): ActiveDayLogsMap {
  const allDays: ActiveDayLogsMap = {};
  for (const day of WORKOUT_PLAN) {
    allDays[day.id] = buildDefaultDayLogs(day.id);
  }
  return allDays;
}

function readFromStorage<T>(key: string, fallback: T, legacyKey?: string): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw =
      window.localStorage.getItem(key) ??
      (legacyKey ? window.localStorage.getItem(legacyKey) : null);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeToStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage quota errors in restricted environments
  }
}

export function calculateProtocolCountdown(now: Date = new Date()): ProtocolCountdown {
  const targetDate = new Date(PROTOCOL_TARGET_DATE_ISO);
  const totalProtocolMs = PROTOCOL_TOTAL_WEEKS * 7 * 24 * 60 * 60 * 1000;
  const startDate = new Date(targetDate.getTime() - totalProtocolMs);

  const diffMs = targetDate.getTime() - now.getTime();
  const isGoalReached = diffMs <= 0;
  const clampedDiffMs = Math.max(0, diffMs);

  const days = Math.floor(clampedDiffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((clampedDiffMs / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((clampedDiffMs / (1000 * 60)) % 60);
  const seconds = Math.floor((clampedDiffMs / 1000) % 60);

  const elapsedMs = now.getTime() - startDate.getTime();
  const rawProgress = (elapsedMs / totalProtocolMs) * 100;
  const progressPercentage = Math.min(100, Math.max(5, Math.round(rawProgress)));

  const elapsedWeeks = Math.floor(Math.max(0, elapsedMs) / (7 * 24 * 60 * 60 * 1000)) + 1;
  const currentWeek = Math.min(PROTOCOL_TOTAL_WEEKS, Math.max(1, elapsedWeeks));

  return {
    days,
    hours,
    minutes,
    seconds,
    currentWeek,
    totalWeeks: PROTOCOL_TOTAL_WEEKS,
    progressPercentage,
    isGoalReached,
  };
}

export function calculateCreatineStreak(loggedDates: string[], today: Date = new Date()): number {
  if (loggedDates.length === 0) return 0;
  const set = new Set(loggedDates);
  let streak = 0;
  const cursor = new Date(today);

  // If today is not yet checked, check if yesterday was logged so active streak is preserved
  const todayKey = getLocalDateKey(cursor);
  if (!set.has(todayKey)) {
    cursor.setDate(cursor.getDate() - 1);
    if (!set.has(getLocalDateKey(cursor))) {
      return 0;
    }
  }

  while (set.has(getLocalDateKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

export function useWorkoutTracker() {
  const [selectedDayId, setSelectedDayId] = useState<string>(() =>
    readFromStorage<string>(
      STORAGE_KEYS.SELECTED_DAY,
      WORKOUT_PLAN[0].id,
      LEGACY_STORAGE_KEYS.SELECTED_DAY
    )
  );

  const [activeLogs, setActiveLogs] = useState<ActiveDayLogsMap>(() => {
    const initial = buildInitialActiveLogs();
    const stored = readFromStorage<ActiveDayLogsMap | null>(
      STORAGE_KEYS.ACTIVE_LOGS,
      null,
      LEGACY_STORAGE_KEYS.ACTIVE_LOGS
    );
    if (!stored) return initial;

    // Merge stored logs with current plan schema to ensure all exercises and sets exist
    const merged: ActiveDayLogsMap = { ...initial };
    for (const day of WORKOUT_PLAN) {
      merged[day.id] = { ...initial[day.id] };
      const storedDay = stored[day.id];
      if (storedDay) {
        for (const exercise of day.exercises) {
          const storedSets = storedDay[exercise.id];
          if (Array.isArray(storedSets) && storedSets.length === exercise.targetSets) {
            merged[day.id][exercise.id] = storedSets;
          }
        }
      }
    }
    return merged;
  });

  const [sessionHistory, setSessionHistory] = useState<WorkoutSessionLog[]>(() =>
    readFromStorage<WorkoutSessionLog[]>(
      STORAGE_KEYS.SESSION_HISTORY,
      [],
      LEGACY_STORAGE_KEYS.SESSION_HISTORY
    )
  );

  const [creatineDates, setCreatineDates] = useState<string[]>(() =>
    readFromStorage<string[]>(
      STORAGE_KEYS.CREATINE_LOGS,
      [],
      LEGACY_STORAGE_KEYS.CREATINE_LOGS
    )
  );

  const [videoOverrides, setVideoOverrides] = useState<Record<string, string>>(() =>
    readFromStorage<Record<string, string>>(
      STORAGE_KEYS.VIDEO_OVERRIDES,
      {},
      LEGACY_STORAGE_KEYS.VIDEO_OVERRIDES
    )
  );

  const [weightUnit, setWeightUnit] = useState<WeightUnit>(() =>
    readFromStorage<WeightUnit>(
      STORAGE_KEYS.WEIGHT_UNIT,
      'kg',
      LEGACY_STORAGE_KEYS.WEIGHT_UNIT
    )
  );

  const [countdown, setCountdown] = useState<ProtocolCountdown>(() =>
    calculateProtocolCountdown()
  );

  // Sync state changes to localStorage
  useEffect(() => {
    writeToStorage(STORAGE_KEYS.SELECTED_DAY, selectedDayId);
  }, [selectedDayId]);

  useEffect(() => {
    writeToStorage(STORAGE_KEYS.ACTIVE_LOGS, activeLogs);
  }, [activeLogs]);

  useEffect(() => {
    writeToStorage(STORAGE_KEYS.SESSION_HISTORY, sessionHistory);
  }, [sessionHistory]);

  useEffect(() => {
    writeToStorage(STORAGE_KEYS.CREATINE_LOGS, creatineDates);
  }, [creatineDates]);

  useEffect(() => {
    writeToStorage(STORAGE_KEYS.VIDEO_OVERRIDES, videoOverrides);
  }, [videoOverrides]);

  useEffect(() => {
    writeToStorage(STORAGE_KEYS.WEIGHT_UNIT, weightUnit);
  }, [weightUnit]);

  // Real-time countdown ticker
  useEffect(() => {
    const interval = window.setInterval(() => {
      setCountdown(calculateProtocolCountdown());
    }, 1000);
    return () => window.clearInterval(interval);
  }, []);

  const updateSetLog = useCallback(
    (
      dayId: string,
      exerciseId: string,
      setNumber: number,
      patch: Partial<Pick<SetLog, 'weight' | 'reps' | 'completed'>>
    ) => {
      setActiveLogs((prev) => {
        const dayLogs = prev[dayId] ?? buildDefaultDayLogs(dayId);
        const exerciseSets = dayLogs[exerciseId] ?? [];
        const updatedSets = exerciseSets.map((setItem) =>
          setItem.setNumber === setNumber ? { ...setItem, ...patch } : setItem
        );
        return {
          ...prev,
          [dayId]: {
            ...dayLogs,
            [exerciseId]: updatedSets,
          },
        };
      });
    },
    []
  );

  const getPreviousSetLog = useCallback(
    (exerciseId: string, setNumber: number): PreviousSetReference | null => {
      for (const session of sessionHistory) {
        const setsForExercise = session.logs[exerciseId];
        if (!setsForExercise || setsForExercise.length === 0) continue;

        const matchingSet = setsForExercise.find(
          (s) => s.setNumber === setNumber && (s.completed || s.weight > 0 || s.reps > 0)
        );
        if (matchingSet && (matchingSet.weight > 0 || matchingSet.reps > 0)) {
          return {
            weight: matchingSet.weight,
            reps: matchingSet.reps,
            date: session.date,
          };
        }

        const anyCompleted = setsForExercise.find(
          (s) => s.completed && (s.weight > 0 || s.reps > 0)
        );
        if (anyCompleted) {
          return {
            weight: anyCompleted.weight,
            reps: anyCompleted.reps,
            date: session.date,
          };
        }
      }
      return null;
    },
    [sessionHistory]
  );

  const getExercisePersonalRecord = useCallback(
    (exerciseId: string): { maxWeight: number; repsAtMax: number; date: string } | null => {
      let best: { maxWeight: number; repsAtMax: number; date: string } | null = null;
      for (const session of sessionHistory) {
        const sets = session.logs[exerciseId];
        if (!sets) continue;
        for (const s of sets) {
          if (!s.completed && s.weight <= 0) continue;
          if (
            !best ||
            s.weight > best.maxWeight ||
            (s.weight === best.maxWeight && s.reps > best.repsAtMax)
          ) {
            if (s.weight > 0 || s.reps > 0) {
              best = {
                maxWeight: s.weight,
                repsAtMax: s.reps,
                date: session.date,
              };
            }
          }
        }
      }
      return best;
    },
    [sessionHistory]
  );

  const saveWorkoutSession = useCallback(
    (dayId: string): WorkoutSessionLog | null => {
      const dayLogs = activeLogs[dayId];
      if (!dayLogs) return null;

      const hasAnyCompleted = Object.values(dayLogs).some((sets) =>
        sets.some((s) => s.completed || s.weight > 0 || s.reps > 0)
      );
      if (!hasAnyCompleted) return null;

      const newSession: WorkoutSessionLog = {
        id: `session-${Date.now()}`,
        date: new Date().toISOString(),
        dayId,
        logs: structuredClone(dayLogs),
      };

      setSessionHistory((prev) => [newSession, ...prev]);

      // Reset the active day logs for the next session
      setActiveLogs((prev) => ({
        ...prev,
        [dayId]: buildDefaultDayLogs(dayId),
      }));

      return newSession;
    },
    [activeLogs]
  );

  const resetDayActiveLogs = useCallback((dayId: string) => {
    setActiveLogs((prev) => ({
      ...prev,
      [dayId]: buildDefaultDayLogs(dayId),
    }));
  }, []);

  const deleteHistorySession = useCallback((sessionDateOrId: string) => {
    setSessionHistory((prev) =>
      prev.filter((s) => (s.id ? s.id !== sessionDateOrId : s.date !== sessionDateOrId))
    );
  }, []);

  const todayKey = getLocalDateKey();
  const isCreatineTakenToday = useMemo(
    () => creatineDates.includes(todayKey),
    [creatineDates, todayKey]
  );

  const toggleCreatineToday = useCallback(() => {
    const currentKey = getLocalDateKey();
    setCreatineDates((prev) =>
      prev.includes(currentKey)
        ? prev.filter((d) => d !== currentKey)
        : [...prev, currentKey].sort()
    );
  }, []);

  const creatineStreak = useMemo(
    () => calculateCreatineStreak(creatineDates),
    [creatineDates]
  );

  const getExerciseVideoUrl = useCallback(
    (exercise: Exercise): string => {
      const override = videoOverrides[exercise.id];
      return override ? normalizeYouTubeEmbedUrl(override) : exercise.videoUrl;
    },
    [videoOverrides]
  );

  const setCustomVideoUrl = useCallback((exerciseId: string, rawUrl: string) => {
    const normalized = normalizeYouTubeEmbedUrl(rawUrl);
    if (!normalized) return;
    setVideoOverrides((prev) => ({
      ...prev,
      [exerciseId]: normalized,
    }));
  }, []);

  const resetCustomVideoUrl = useCallback((exerciseId: string) => {
    setVideoOverrides((prev) => {
      const next = { ...prev };
      delete next[exerciseId];
      return next;
    });
  }, []);

  const toggleWeightUnit = useCallback(() => {
    setWeightUnit((prev) => (prev === 'kg' ? 'lbs' : 'kg'));
  }, []);

  return {
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
  };
}
