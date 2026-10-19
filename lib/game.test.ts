import { describe, expect, it } from "vitest";
import { LetterResult, WORD_LENGTH, getDailyWord, getKeyboardColors, scoreGuess } from "./game";
import { ANSWERS, VALID_GUESSES } from "./words";

const { Correct: C, Present: P, Absent: A } = LetterResult;

describe("scoreGuess", () => {
  // Table-driven: each row is one guess/answer pair and the expected colors.
  const cases = [
    { name: "exact match", guess: "crane", answer: "crane", expected: [C, C, C, C, C] },
    { name: "nothing matches", guess: "fight", answer: "crane", expected: [A, A, A, A, A] },
    { name: "right letters, wrong spots", guess: "nacre", answer: "crane", expected: [P, P, P, P, C] },
    // Answer has one "e", guess has two: only one may light up.
    { name: "duplicate in guess, one in answer", guess: "speed", answer: "abide", expected: [A, A, P, A, P] },
    // The green "e" uses up the only "e", so the other "e" must be gray, not yellow.
    { name: "green takes priority over yellow", guess: "geese", answer: "those", expected: [A, A, A, C, C] },
    { name: "duplicates in both", guess: "sassy", answer: "brass", expected: [P, P, A, C, A] },
  ];

  it.each(cases)("$name", ({ guess, answer, expected }) => {
    expect(scoreGuess(guess, answer)).toEqual(expected);
  });
});

describe("getDailyWord", () => {
  it("gives the same word all day", () => {
    expect(getDailyWord(new Date(2026, 9, 19, 0, 5))).toBe(getDailyWord(new Date(2026, 9, 19, 23, 55)));
  });

  it("changes the next day", () => {
    expect(getDailyWord(new Date(2026, 9, 19))).not.toBe(getDailyWord(new Date(2026, 9, 20)));
  });
});

describe("getKeyboardColors", () => {
  it("never downgrades a green key", () => {
    // "e" is green in "those" (spot 5), then yellow in "eight".
    const colors = getKeyboardColors(["those", "eight"], "spine");
    expect(colors["e"]).toBe(C);
  });
});

describe("word lists", () => {
  it("only contains 5-letter lowercase words", () => {
    for (const word of VALID_GUESSES) {
      expect(word).toMatch(new RegExp(`^[a-z]{${WORD_LENGTH}}$`));
    }
  });

  it("lets you guess every possible answer", () => {
    for (const word of ANSWERS) {
      expect(VALID_GUESSES.has(word)).toBe(true);
    }
  });
});
