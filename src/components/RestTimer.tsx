import React, { useEffect, useRef } from 'react';
import { BellRing, FastForward, Minus, Plus, Timer } from 'lucide-react';
import type { ActiveTimerState } from '../types/workout';

interface RestTimerProps {
  timer: ActiveTimerState | null;
  onAdjustSeconds: (deltaSeconds: number) => void;
  onSkip: () => void;
}

function playGymBeep(): void {
  if (typeof window === 'undefined') return;
  try {
    if ('vibrate' in navigator) {
      navigator.vibrate([200, 100, 200]);
    }
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    const playTone = (startTime: number, freq: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);
      gain.gain.setValueAtTime(0.22, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    playTone(now, 880, 0.16);
    playTone(now + 0.2, 880, 0.16);
    playTone(now + 0.4, 1174.66, 0.32);
  } catch {
    // AudioContext blocked or unsupported
  }
}

export function formatSecondsMMSS(totalSeconds: number): string {
  const clamped = Math.max(0, Math.floor(totalSeconds));
  const mins = Math.floor(clamped / 60);
  const secs = clamped % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export const RestTimer: React.FC<RestTimerProps> = ({
  timer,
  onAdjustSeconds,
  onSkip,
}) => {
  const alertedRef = useRef<boolean>(false);

  useEffect(() => {
    if (!timer) {
      alertedRef.current = false;
      return;
    }
    if (timer.remainingSeconds === 0 && !alertedRef.current) {
      alertedRef.current = true;
      playGymBeep();
    } else if (timer.remainingSeconds > 0) {
      alertedRef.current = false;
    }
  }, [timer]);

  if (!timer || !timer.isActive) return null;

  const isFinished = timer.remainingSeconds <= 0;
  const progressPct =
    timer.totalSeconds > 0
      ? Math.min(100, Math.max(0, (timer.remainingSeconds / timer.totalSeconds) * 100))
      : 0;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-x-0 bottom-3 z-40 mx-auto w-[calc(100%-1.25rem)] max-w-xl"
    >
      <div
        className={`overflow-hidden rounded-2xl border shadow-2xl backdrop-blur-md transition-all duration-300 ${
          isFinished
            ? 'border-emerald-400 bg-emerald-950/95 shadow-emerald-500/25 ring-2 ring-emerald-400/50 animate-pulse'
            : 'border-zinc-700/90 bg-zinc-900/95 shadow-black/80'
        }`}
      >
        {/* Top Progress Bar */}
        <div className="h-1.5 w-full bg-zinc-800">
          <div
            className={`h-full transition-all duration-500 ${
              isFinished ? 'bg-emerald-400' : 'bg-amber-500'
            }`}
            style={{ width: `${isFinished ? 100 : progressPct}%` }}
          />
        </div>

        <div className="flex flex-col gap-2.5 p-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Timer Readout & Exercise Label */}
          <div className="flex items-center justify-between gap-3 sm:justify-start">
            <div className="flex items-center gap-2.5">
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${
                  isFinished
                    ? 'border-emerald-400/50 bg-emerald-500/20 text-emerald-300'
                    : 'border-amber-500/30 bg-amber-500/15 text-amber-400'
                }`}
              >
                {isFinished ? (
                  <BellRing className="h-5 w-5 animate-bounce" />
                ) : (
                  <Timer className="h-5 w-5" />
                )}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                    {isFinished ? '¡Descanso Completado!' : 'Temporizador de Descanso'}
                  </span>
                  {timer.badgeLabel && (
                    <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-[10px] font-bold text-amber-300">
                      {timer.badgeLabel}
                    </span>
                  )}
                </div>
                <p className="truncate text-xs font-medium text-zinc-200 max-w-[200px] sm:max-w-[220px]">
                  {isFinished
                    ? '¡A atacar la siguiente serie!'
                    : timer.exerciseName}
                </p>
              </div>
            </div>

            <div
              className={`font-mono text-2xl font-black tracking-tight tabular-nums sm:ml-2 ${
                isFinished ? 'text-emerald-300' : 'text-zinc-100'
              }`}
            >
              {formatSecondsMMSS(timer.remainingSeconds)}
            </div>
          </div>

          {/* Controls (-15s, +15s, Skip) - all >= 44px height */}
          <div className="grid grid-cols-3 gap-2 sm:flex sm:items-center">
            <button
              type="button"
              onClick={() => onAdjustSeconds(-15)}
              disabled={timer.remainingSeconds <= 0}
              className="inline-flex min-h-[44px] items-center justify-center gap-1 rounded-xl border border-zinc-700 bg-zinc-800/90 px-3 text-xs font-bold text-zinc-200 transition hover:bg-zinc-700 active:scale-95 disabled:opacity-40"
            >
              <Minus className="h-3.5 w-3.5" />
              15s
            </button>

            <button
              type="button"
              onClick={() => onAdjustSeconds(15)}
              className="inline-flex min-h-[44px] items-center justify-center gap-1 rounded-xl border border-zinc-700 bg-zinc-800/90 px-3 text-xs font-bold text-zinc-200 transition hover:bg-zinc-700 active:scale-95"
            >
              <Plus className="h-3.5 w-3.5" />
              15s
            </button>

            <button
              type="button"
              onClick={onSkip}
              className={`inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl px-3.5 text-xs font-bold transition active:scale-95 ${
                isFinished
                  ? 'bg-emerald-500 text-zinc-950 hover:bg-emerald-400'
                  : 'border border-zinc-700 bg-zinc-950 text-zinc-200 hover:border-zinc-600 hover:bg-zinc-800'
              }`}
            >
              <FastForward className="h-3.5 w-3.5" />
              {isFinished ? 'Listo' : 'Omitir'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
