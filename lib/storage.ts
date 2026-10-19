import { MAX_GUESSES } from "./game";

// Everything here is saved in the browser's localStorage, so there's no server
// or database. The trade-off: stats live on one device/browser only.

export interface Stats {
  played: number;
  wins: number;
  currentStreak: number;
  maxStreak: number;
  // distribution[0] = games won in 1 guess, distribution[5] = won in 6 guesses
  distribution: number[];
  // Day number (from getDayNumber) of the last daily game finished,
  // used to tell whether the streak is still going.
  lastDay: number | null;
}

export interface DailyProgress {
  day: number;
  guesses: string[];
}

const STATS_KEY = "wordle-stats";
const DAILY_KEY = "wordle-daily";

export function emptyStats(): Stats {
  return {
    played: 0,
    wins: 0,
    currentStreak: 0,
    maxStreak: 0,
    distribution: Array(MAX_GUESSES).fill(0),
    lastDay: null,
  };
}

// Why try/catch around every localStorage call: it can throw (private
// browsing, storage disabled, full storage) and the saved JSON could be
// corrupted. If anything goes wrong we just start fresh instead of crashing.
function load<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function save(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Not being able to save shouldn't stop the game.
  }
}

export function loadStats(): Stats {
  return load<Stats>(STATS_KEY) ?? emptyStats();
}

export function saveStats(stats: Stats) {
  save(STATS_KEY, stats);
}

// Returns today's saved guesses, or null if the saved game is from another day.
// If you refresh mid-game (or after finishing), the daily puzzle should
// come back exactly as you left it, not let you replay it.
export function loadDailyProgress(today: number): string[] | null {
  const saved = load<DailyProgress>(DAILY_KEY);
  return saved && saved.day === today ? saved.guesses : null;
}

export function saveDailyProgress(progress: DailyProgress) {
  save(DAILY_KEY, progress);
}

// Returns NEW stats after a finished daily game (doesn't modify the old object,
// so React sees a new value and re-renders).
// A streak only continues if your last finished game was
// yesterday. Skipping a day or losing resets it.
export function recordResult(stats: Stats, won: boolean, guessCount: number, today: number): Stats {
  const continuesStreak = stats.lastDay === today - 1;
  const currentStreak = won ? (continuesStreak ? stats.currentStreak + 1 : 1) : 0;

  const distribution = [...stats.distribution];
  if (won) distribution[guessCount - 1]++;

  return {
    played: stats.played + 1,
    wins: stats.wins + (won ? 1 : 0),
    currentStreak,
    maxStreak: Math.max(stats.maxStreak, currentStreak),
    distribution,
    lastDay: today,
  };
}
