import { LetterResult } from "@/lib/game";
import { resultColors } from "./colors";

const ROWS = ["qwertyuiop", "asdfghjkl", "+zxcvbnm-"];

interface KeyboardProps {
  colors: Record<string, LetterResult>;
  onKey: (key: string) => void;
}

export default function Keyboard({ colors, onKey }: KeyboardProps) {
  return (
    <div className="w-full max-w-lg grid gap-2">
      {ROWS.map((row) => (
        <div key={row} className="flex justify-center gap-1.5">
          {row.split("").map((char) => {
            // "+" and "-" are just placeholders in the ROWS strings for the
            // Enter and Backspace keys. We send the same names a physical
            // keyboard would, so page.tsx handles both the same way.
            const key = char === "+" ? "Enter" : char === "-" ? "Backspace" : char;
            const label = char === "+" ? "Enter" : char === "-" ? "⌫" : char;
            const isWide = key === "Enter" || key === "Backspace";
            const color = colors[key] ? resultColors[colors[key]] : "bg-slate-500 text-white";

            return (
              <button
                key={key}
                type="button"
                onClick={() => onKey(key)}
                className={`h-14 rounded-md font-semibold uppercase select-none cursor-pointer active:scale-95 transition-colors ${
                  isWide ? "flex-[1.5] text-xs" : "flex-1"
                } ${color}`}
              >
                {label}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
