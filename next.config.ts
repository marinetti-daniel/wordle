import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Why basePath: this app is shown on the portfolio at yoursite.com/wordle.
  // basePath makes every page AND every asset (JS, CSS) live under /wordle/...,
  // so when the portfolio forwards /wordle/* here, nothing collides with the
  // portfolio's own files. Locally the game is at http://localhost:3001/wordle.
  basePath: "/wordle",
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
