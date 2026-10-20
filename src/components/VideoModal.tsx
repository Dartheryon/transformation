import React, { useEffect, useRef, useState } from 'react';
import {
  ExternalLink,
  Info,
  Link2,
  RotateCcw,
  Save,
  Search,
  Sparkles,
  Video,
  X,
} from 'lucide-react';
import type { Exercise } from '../types/workout';
import { getYouTubeWatchUrl, normalizeYouTubeEmbedUrl } from '../data/workoutPlan';

interface VideoModalProps {
  exercise: Exercise | null;
  currentVideoUrl: string;
  hasCustomOverride: boolean;
  onClose: () => void;
  onSaveCustomUrl: (exerciseId: string, url: string) => void;
  onResetCustomUrl: (exerciseId: string) => void;
}

export const VideoModal: React.FC<VideoModalProps> = ({
  exercise,
  currentVideoUrl,
  hasCustomOverride,
  onClose,
  onSaveCustomUrl,
  onResetCustomUrl,
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [urlInput, setUrlInput] = useState<string>('');
  const [saveFeedback, setSaveFeedback] = useState<boolean>(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (exercise) {
      setUrlInput(currentVideoUrl);
      setSaveFeedback(false);
      if (!dialog.open) {
        dialog.showModal();
      }
    } else if (dialog.open) {
      dialog.close();
    }
  }, [exercise, currentVideoUrl]);

  const handleDialogClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    const dialog = dialogRef.current;
    if (!dialog || e.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    const clickedOutside =
      e.clientX < rect.left ||
      e.clientX > rect.right ||
      e.clientY < rect.top ||
      e.clientY > rect.bottom;
    if (clickedOutside) {
      onClose();
    }
  };

  if (!exercise) return null;

  const embedUrl = normalizeYouTubeEmbedUrl(currentVideoUrl);
  const watchUrl = getYouTubeWatchUrl(currentVideoUrl, exercise.name);
  const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
    `${exercise.name} técnica hipertrofia`
  )}`;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    onSaveCustomUrl(exercise.id, urlInput.trim());
    setSaveFeedback(true);
    window.setTimeout(() => setSaveFeedback(false), 2200);
  };

  const handleReset = () => {
    onResetCustomUrl(exercise.id);
    setUrlInput(exercise.videoUrl);
    setSaveFeedback(false);
  };

  return (
    <dialog
      ref={dialogRef}
      closedby="any"
      aria-labelledby="video-modal-title"
      onClose={onClose}
      onClick={handleDialogClick}
      className="m-auto w-[calc(100%-1.5rem)] max-w-lg rounded-2xl border border-zinc-800 bg-zinc-900 p-0 text-zinc-100 shadow-2xl backdrop:bg-black/80 backdrop:backdrop-blur-sm open:animate-in open:fade-in open:zoom-in-95"
    >
      <div className="flex flex-col max-h-[90dvh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-zinc-800 bg-zinc-900/95 px-4 py-3.5 backdrop-blur">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <Video className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
                  Guía Biomecánica
                </span>
                {exercise.supersetGroup && (
                  <span className="rounded-md bg-amber-500/20 px-1.5 py-0.5 text-[10px] font-bold text-amber-400 border border-amber-500/30">
                    Superserie {exercise.supersetGroup}
                    {exercise.supersetOrder}
                  </span>
                )}
              </div>
              <h2
                id="video-modal-title"
                className="truncate text-base font-bold text-zinc-100"
              >
                {exercise.name}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar ventana de video"
            className="flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-950/80 text-zinc-400 transition hover:border-zinc-700 hover:text-zinc-100 active:scale-95"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-4 p-4">
          {/* Video Player Container */}
          <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 shadow-inner">
            <div className="relative aspect-video w-full bg-zinc-950">
              <iframe
                src={embedUrl}
                title={`Técnica de ${exercise.name}`}
                className="h-full w-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-zinc-800/80 bg-zinc-950/90 px-3 py-2">
              <a
                href={watchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium text-zinc-300 transition hover:bg-zinc-900 hover:text-emerald-400"
              >
                <ExternalLink className="h-3.5 w-3.5 text-emerald-400" />
                Abrir en YouTube
              </a>
              <a
                href={searchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium text-zinc-400 transition hover:bg-zinc-900 hover:text-amber-400"
              >
                <Search className="h-3.5 w-3.5 text-amber-400" />
                Buscar más variantes
              </a>
            </div>
          </div>

          {/* Biomechanical Cue Box */}
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-3.5">
            <div className="mb-1.5 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
              <Sparkles className="h-4 w-4 shrink-0" />
              <span>Foco Biomecánico Clave</span>
            </div>
            <p className="text-sm leading-relaxed text-zinc-200">{exercise.cues}</p>
            <div className="mt-2.5 flex flex-wrap items-center gap-2 text-xs text-zinc-400">
              <span className="rounded-md bg-zinc-950/80 px-2 py-1 border border-zinc-800">
                Meta: <strong className="text-zinc-200">{exercise.targetSets} series</strong> ×{' '}
                <strong className="text-zinc-200">{exercise.targetReps} reps</strong>
              </span>
              <span className="rounded-md bg-zinc-950/80 px-2 py-1 border border-zinc-800">
                Descanso:{' '}
                <strong className="text-zinc-200">
                  {exercise.restSeconds === 0
                    ? '0s (Pasa directo al segundo ejercicio)'
                    : `${exercise.restSeconds}s`}
                </strong>
              </span>
            </div>
          </div>

          {/* Custom Video URL Editor */}
          <form
            onSubmit={handleSave}
            className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-3.5 space-y-2.5"
          >
            <div className="flex items-center justify-between gap-2">
              <label
                htmlFor="custom-video-url"
                className="flex items-center gap-1.5 text-xs font-semibold text-zinc-300"
              >
                <Link2 className="h-3.5 w-3.5 text-amber-400" />
                Personalizar enlace de YouTube (Video o Short)
              </label>
              {hasCustomOverride && (
                <span className="rounded bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-amber-300 border border-amber-500/30">
                  Personalizado
                </span>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                id="custom-video-url"
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=... o youtu.be/..."
                className="min-h-[44px] flex-1 rounded-xl border border-zinc-800 bg-zinc-900 px-3 text-sm text-zinc-100 placeholder-zinc-500 focus:border-emerald-500 focus:outline-none"
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="inline-flex min-h-[44px] flex-1 sm:flex-initial items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-4 text-xs font-bold text-zinc-950 transition hover:bg-emerald-500 active:scale-95"
                >
                  <Save className="h-4 w-4" />
                  {saveFeedback ? '¡Guardado!' : 'Guardar URL'}
                </button>
                {hasCustomOverride && (
                  <button
                    type="button"
                    onClick={handleReset}
                    title="Restaurar video original"
                    className="inline-flex min-h-[44px] items-center justify-center gap-1 rounded-xl border border-zinc-700 bg-zinc-900 px-3 text-xs font-semibold text-zinc-300 transition hover:bg-zinc-800 active:scale-95"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Restaurar
                  </button>
                )}
              </div>
            </div>

            <p className="flex items-start gap-1.5 text-[11px] text-zinc-400">
              <Info className="h-3.5 w-3.5 shrink-0 text-zinc-500 mt-0.5" />
              <span>
                Puedes pegar cualquier enlace de Jeff Nippard, Renaissance Periodization, Athlean-X o YouTube Shorts; se convertirá automáticamente a formato integrable.
              </span>
            </p>
          </form>
        </div>
      </div>
    </dialog>
  );
};
