import { ANSWERS, VALID_GUESSES } from "./words";

export const WORD_LENGTH = 5;
export const MAX_GUESSES = 6;

export enum LetterResult {
  Correct = "correct",
  Present = "present",
  Absent = "absent",
}

export function isValidGuess(guess: string): boolean {
  return VALID_GUESSES.has(guess);
}

// Scores a guess the same way the real Wordle does.
// We do 2 passes to account for duplicate letters. If the answer is "abide" and you guess
// "speed", only ONE "e" should light up, because the answer only has one "e".
// So we first mark exact matches (green) and remove those letters from the pool,
// then hand out yellows only while that letter is still left in the pool.
export function scoreGuess(guess: string, answer: string): LetterResult[] {
  const result: LetterResult[] = Array(WORD_LENGTH).fill(LetterResult.Absent);

  // Count the answer's letters that were NOT matched exactly.
  const remaining: Record<string, number> = {};

  for (let i = 0; i < WORD_LENGTH; i++) {
    if (guess[i] === answer[i]) {
      result[i] = LetterResult.Correct;
    } else {
      remaining[answer[i]] = (remaining[answer[i]] ?? 0) + 1;
    }
  }

  for (let i = 0; i < WORD_LENGTH; i++) {
    if (result[i] === LetterResult.Correct) continue;
    const letter = guess[i];
    if (remaining[letter] > 0) {
      result[i] = LetterResult.Present;
      remaining[letter]--; // use it up so a second copy stays gray
    }
  }

  return result;
}

// Turns a date into a whole-number day count (day 0 = Jan 1, 2026).
// We want the word to change at the player's own midnight, but we don't
// want daylight-saving hours (23h or 25h days) to throw the math off. 
// Building a UTC date from local parts gives exactly 24h between every day.
export function getDayNumber(date: Date = new Date()): number {
  const start = Date.UTC(2026, 0, 1);
  const today = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  return Math.floor((today - start) / 86_400_000);
}

// Everyone gets the same word on the same day, with no server needed,
// because the word is picked purely from the date.
// Why "* 7919": the answer list is alphabetical, so day N -> word N would be
// predictable (about, above, abuse...). Multiplying by a large prime jumps
// around the list instead, and still visits every word before repeating.
export function getDailyWord(date: Date = new Date()): string {
  return ANSWERS[getDayNumber(date) % ANSWERS.length];
}

export function getRandomWord(): string {
  return ANSWERS[Math.floor(Math.random() * ANSWERS.length)];
}

// Works out what color each keyboard key should be.
// Why the ranking: once a letter has been green somewhere, the key should stay
// green even if a later guess has that letter in a yellow or gray spot.
// So a key only ever moves "up": Absent -> Present -> Correct.
const rank: Record<LetterResult, number> = {
  [LetterResult.Absent]: 0,
  [LetterResult.Present]: 1,
  [LetterResult.Correct]: 2,
};

export function getKeyboardColors(guesses: string[], answer: string): Record<string, LetterResult> {
  const colors: Record<string, LetterResult> = {};

  for (const guess of guesses) {
    const results = scoreGuess(guess, answer);
    results.forEach((result, i) => {
      const letter = guess[i];
      const current = colors[letter];
      if (!current || rank[result] > rank[current]) {
        colors[letter] = result;
      }
    });
  }

  return colors;
}
