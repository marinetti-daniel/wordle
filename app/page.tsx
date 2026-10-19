"use client";

import dynamic from "next/dynamic";

// ssr: false because the game depends on things that only exist in the browser
// (localStorage for saved progress/stats, and the player's local date for the
// daily word). Skipping the server render means the game never has to guess
// at those, and the board you see is always the real one.
const Game = dynamic(() => import("@/components/Game"), { ssr: false });

export default function Home() {
  return <Game />;
}
