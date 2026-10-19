"use client";

import { useEffect, useState } from "react";
import Board from "@/components/Board";
import Keyboard from "@/components/Keyboard";
import StatsModal from "@/components/StatsModal";
import {
  MAX_GUESSES,
  WORD_LENGTH,
  getDailyWord,
  getDayNumber,
  getKeyboardColors,
  getRandomWord,
  isValidGuess,
} from "@/lib/game";
import {
  loadDailyProgress,
  loadStats,
  recordResult,
  saveDailyProgress,
  saveStats,
} from "@/lib/storage";

enum Mode {
  Daily = "daily",
  Unlimited = "unlimited",
}

// This component only ever runs in the browser (see app/page.tsx), so it's
// safe to read localStorage and today's date right when state is created.
// The `() => ...` form means it's only read once, on the first render.
export default function Game() {
  const [mode, setMode] = useState(Mode.Daily);
  const [answer, setAnswer] = useState(() => getDailyWord());
  // Restore today's game if you already started (or finished) it.
  const [guesses, setGuesses] = useState(() => loadDailyProgress(getDayNumber()) ?? []);
  const [currentGuess, setCurrentGuess] = useState("");
  const [message, setMessage] = useState("");
  const [stats, setStats] = useState(() => loadStats());
  const [showStats, setShowStats] = useState(false);

  // Why these are calculated instead of stored in state: they can always be
  // worked out from guesses + answer, so storing them separately would just be
  // one more thing that could get out of sync.
  const won = guesses.includes(answer);
  const lost = !won && guesses.length === MAX_GUESSES;
  const gameOver = won || lost;

  function startDaily() {
    setMode(Mode.Daily);
    setAnswer(getDailyWord());
    setGuesses(loadDailyProgress(getDayNumber()) ?? []);
    setCurrentGuess("");
  }

  function startUnlimited() {
    setMode(Mode.Unlimited);
    setAnswer(getRandomWord());
    setGuesses([]);
    setCurrentGuess("");
  }

  function showMessage(text: string) {
    setMessage(text);
    setTimeout(() => setMessage(""), 1500);
  }

  function submitGuess() {
    if (currentGuess.length < WORD_LENGTH) return showMessage("Not enough letters");
    if (!isValidGuess(currentGuess)) return showMessage("Not in word list");

    const newGuesses = [...guesses, currentGuess];
    setGuesses(newGuesses);
    setCurrentGuess("");

    // Only the daily game is saved and counted in stats. Unlimited is just for
    // fun, otherwise you could replay until you won and inflate your streak.
    if (mode !== Mode.Daily) return;

    const today = getDayNumber();
    saveDailyProgress({ day: today, guesses: newGuesses });

    const isWin = currentGuess === answer;
    if (isWin || newGuesses.length === MAX_GUESSES) {
      // Why stats are updated here and not in an effect watching `gameOver`:
      // an effect would also fire when a finished game is restored after a
      // page refresh, counting the same game twice. Here it runs exactly once,
      // at the moment the final guess is made.
      const newStats = recordResult(stats, isWin, newGuesses.length, today);
      setStats(newStats);
      saveStats(newStats);
      setShowStats(true);
    }
  }

  // Both the on-screen keyboard and the physical keyboard call this, so the
  // game logic only lives in one place.
  function handleKey(key: string) {
    if (gameOver) return;

    if (key === "Enter") {
      submitGuess();
    } else if (key === "Backspace") {
      setCurrentGuess(currentGuess.slice(0, -1));
    } else if (/^[a-zA-Z]$/.test(key) && currentGuess.length < WORD_LENGTH) {
      setCurrentGuess(currentGuess + key.toLowerCase());
    }
  }

  // Listen for the physical keyboard.
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      // Don't hijack browser shortcuts like Ctrl+R or Cmd+C.
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      // Why preventDefault on Enter: if you just clicked an on-screen key, that
      // button still has focus, and Enter would "click" it again as well.
      if (e.key === "Enter") e.preventDefault();
      handleKey(e.key);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  const modeButton = (value: Mode, label: string, onClick: () => void) => (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-1.5 rounded-md text-sm font-medium cursor-pointer transition-colors ${
        mode === value ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center px-4 pb-6">
      <header className="w-full max-w-lg h-16 flex items-center justify-between border-b border-slate-900 mb-4">
        {/* Plain <a> instead of next/link: "/" is the portfolio, a different
            Next.js app, so this must be a normal full-page navigation. The lint
            rule assumes "/" is in this app, so it's turned off for this line. */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a href="/" className="text-sm text-slate-400 hover:text-indigo-400 transition-colors">
          ← Portfolio
        </a>
        <h1 className="text-2xl font-extrabold tracking-wide bg-linear-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
          WORDLE
        </h1>
        <button
          type="button"
          onClick={() => setShowStats(true)}
          className="text-sm text-slate-400 hover:text-indigo-400 transition-colors cursor-pointer"
        >
          Stats
        </button>
      </header>

      <div className="flex gap-1 p-1 rounded-lg bg-slate-900 border border-slate-800 mb-4">
        {modeButton(Mode.Daily, "Daily", startDaily)}
        {modeButton(Mode.Unlimited, "Unlimited", startUnlimited)}
      </div>

      {/* Fixed height so messages appearing/disappearing don't push the board around. */}
      <div className="h-10 flex items-center justify-center gap-3 text-sm font-semibold">
        {message && <span className="px-3 py-1 rounded-md bg-white text-slate-900">{message}</span>}
        {won && <span className="text-emerald-400">You got it!</span>}
        {lost && (
          <span className="text-slate-300">
            The word was <span className="uppercase text-white">{answer}</span>
          </span>
        )}
        {gameOver && mode === Mode.Unlimited && (
          <button
            type="button"
            onClick={startUnlimited}
            className="px-3 py-1 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer"
          >
            New word
          </button>
        )}
        {gameOver && mode === Mode.Daily && <span className="text-slate-500">New word tomorrow</span>}
      </div>

      <div className="flex-1 flex items-center mb-6">
        <Board guesses={guesses} currentGuess={currentGuess} answer={answer} />
      </div>

      <Keyboard colors={getKeyboardColors(guesses, answer)} onKey={handleKey} />

      {showStats && <StatsModal stats={stats} onClose={() => setShowStats(false)} />}
    </div>
  );
}
