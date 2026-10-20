import { describe, expect, it } from 'vitest';
import {
  WORKOUT_PLAN,
  getYouTubeWatchUrl,
  normalizeYouTubeEmbedUrl,
} from '../workoutData';
import {
  buildInitialActiveLogs,
  calculateCreatineStreak,
  calculateProtocolCountdown,
} from '../hooks/useWorkoutTracker';
import { groupDayExercises } from '../App';
import { formatSecondsMMSS } from '../components/RestTimer';

describe('V-Taper Protocol Seed Data & Architecture Contract', () => {
  it('contains all 4 workout days and 25 total exercises', () => {
    expect(WORKOUT_PLAN).toHaveLength(4);
    expect(WORKOUT_PLAN.map((d) => d.dayNumber)).toEqual([1, 2, 3, 4]);

    const counts = WORKOUT_PLAN.map((d) => d.exercises.length);
    expect(counts).toEqual([6, 6, 6, 7]);

    const totalExercises = counts.reduce((a, b) => a + b, 0);
    expect(totalExercises).toBe(25);
  });

  it('enforces superset rest rules (0s for A1/B1/C1 and 60-90s for A2/B2/C2 or singles)', () => {
    for (const day of WORKOUT_PLAN) {
      for (const ex of day.exercises) {
        expect(ex.cues.length).toBeGreaterThan(10);
        expect(ex.videoUrl).toMatch(/^https:\/\/www\.youtube\.com\/embed\/[a-zA-Z0-9_-]{11}$/);

        if (ex.supersetGroup && ex.supersetOrder === 1) {
          expect(ex.restSeconds).toBe(0);
        } else {
          expect(ex.restSeconds).toBeGreaterThanOrEqual(60);
          expect(ex.restSeconds).toBeLessThanOrEqual(90);
        }
      }
    }
  });

  it('groups single exercises and superset pairs accurately for each day', () => {
    const day1Blocks = groupDayExercises(WORKOUT_PLAN[0].exercises);
    expect(day1Blocks).toHaveLength(4); // 2 singles + Superset A + Superset B
    expect(day1Blocks[0].type).toBe('single');
    expect(day1Blocks[1].type).toBe('single');
    expect(day1Blocks[2]).toMatchObject({ type: 'superset', group: 'A' });
    expect(day1Blocks[3]).toMatchObject({ type: 'superset', group: 'B' });

    const day4Blocks = groupDayExercises(WORKOUT_PLAN[3].exercises);
    expect(day4Blocks).toHaveLength(4); // 1 single + Superset A + Superset B + Superset C
    expect(day4Blocks[0].type).toBe('single');
    expect(day4Blocks[1]).toMatchObject({ type: 'superset', group: 'A' });
    expect(day4Blocks[2]).toMatchObject({ type: 'superset', group: 'B' });
    expect(day4Blocks[3]).toMatchObject({ type: 'superset', group: 'C' });
  });

  it('normalizes YouTube watch, youtu.be, and Shorts URLs into valid embed URLs', () => {
    expect(normalizeYouTubeEmbedUrl('https://www.youtube.com/watch?v=8iPEnn-ltC8')).toBe(
      'https://www.youtube.com/embed/8iPEnn-ltC8'
    );
    expect(normalizeYouTubeEmbedUrl('https://youtu.be/PzsMitRdI_8?si=1234')).toBe(
      'https://www.youtube.com/embed/PzsMitRdI_8'
    );
    expect(normalizeYouTubeEmbedUrl('https://www.youtube.com/shorts/d_KZxkY_0cM')).toBe(
      'https://www.youtube.com/embed/d_KZxkY_0cM'
    );
    expect(getYouTubeWatchUrl('https://www.youtube.com/embed/8iPEnn-ltC8', 'Press')).toBe(
      'https://www.youtube.com/watch?v=8iPEnn-ltC8'
    );
  });

  it('initializes active logs matching targetSets for every exercise', () => {
    const initial = buildInitialActiveLogs();
    for (const day of WORKOUT_PLAN) {
      for (const ex of day.exercises) {
        expect(initial[day.id][ex.id]).toHaveLength(ex.targetSets);
        expect(initial[day.id][ex.id][0]).toEqual({
          setNumber: 1,
          weight: 0,
          reps: 0,
          completed: false,
        });
      }
    }
  });

  it('calculates countdown to December 5, 2026 and creatine streaks accurately', () => {
    const sampleDate = new Date('2026-11-05T12:00:00');
    const countdown = calculateProtocolCountdown(sampleDate);
    expect(countdown.days).toBe(29);
    expect(countdown.currentWeek).toBeGreaterThanOrEqual(1);
    expect(countdown.currentWeek).toBeLessThanOrEqual(6);
    expect(countdown.isGoalReached).toBe(false);

    const streak = calculateCreatineStreak(
      ['2026-10-18', '2026-10-19', '2026-10-20'],
      new Date(2026, 9, 20, 15, 0, 0)
    );
    expect(streak).toBe(3);

    expect(formatSecondsMMSS(90)).toBe('01:30');
    expect(formatSecondsMMSS(60)).toBe('01:00');
    expect(formatSecondsMMSS(0)).toBe('00:00');
  });
});
