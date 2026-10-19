import { MAX_GUESSES, WORD_LENGTH, scoreGuess } from "@/lib/game";
import { resultColors } from "./colors";

interface BoardProps {
  guesses: string[];
  currentGuess: string;
  answer: string;
}

export default function Board({ guesses, currentGuess, answer }: BoardProps) {
  // Always draw 6 rows. Each row is one of three kinds:
  //   - already guessed -> colored tiles
  //   - the row you're typing in -> your letters so far, no colors yet
  //   - future rows -> empty
  const rows = Array.from({ length: MAX_GUESSES }, (_, i) => {
    if (i < guesses.length) return { letters: guesses[i], results: scoreGuess(guesses[i], answer) };
    if (i === guesses.length) return { letters: currentGuess, results: null };
    return { letters: "", results: null };
  });

  return (
    <div className="grid gap-1.5">
      {rows.map((row, r) => (
        <div key={r} className="grid grid-cols-5 gap-1.5">
          {Array.from({ length: WORD_LENGTH }, (_, c) => {
            const letter = row.letters[c] ?? "";
            const color = row.results
              ? resultColors[row.results[c]]
              : letter
                ? "border-slate-500 text-white"
                : "border-slate-800";
            return (
              <div
                key={c}
                className={`w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center border-2 rounded-md text-2xl font-bold uppercase transition-colors ${color}`}
              >
                {letter}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
