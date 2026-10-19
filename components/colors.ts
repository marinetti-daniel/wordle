import { LetterResult } from "@/lib/game";

// The board tiles and the keyboard keys must use the
// exact same green/yellow/gray, so the colors are defined in one place.
export const resultColors: Record<LetterResult, string> = {
  [LetterResult.Correct]: "bg-emerald-600 border-emerald-600 text-white",
  [LetterResult.Present]: "bg-amber-500 border-amber-500 text-white",
  [LetterResult.Absent]: "bg-slate-700 border-slate-700 text-slate-300",
};
