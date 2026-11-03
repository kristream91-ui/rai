import type { CSSProperties } from "react";

/**
 * Deterministic gradient for a title that has no real poster image yet.
 * Same id always produces the same colours, so cards stay stable across renders.
 */
const PALETTES = [
  ["#2b1b3d", "#6b2d5c"],
  ["#0f2b3d", "#1f6f78"],
  ["#3d1f1f", "#8a3b2b"],
  ["#1c2b1a", "#4a6b2d"],
  ["#241b3d", "#4b3b8a"],
  ["#3d2b12", "#8a6b2b"],
  ["#12242b", "#2b6b8a"],
  ["#2d1a24", "#7a2b4f"],
];

function hash(value: string): number {
  let h = 0;
  for (let i = 0; i < value.length; i += 1) {
    h = (h << 5) - h + value.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

export function posterStyle(id: string): CSSProperties {
  const [from, to] = PALETTES[hash(id) % PALETTES.length];
  return {
    backgroundImage: `radial-gradient(circle at 30% 20%, ${to} 0%, ${from} 55%, #0a0a0c 100%)`,
  };
}

export function posterInitials(title: string): string {
  const words = title.replace(/[^A-Za-z0-9 ]/g, " ").trim().split(/\s+/);
  const letters = words.slice(0, 2).map((word) => word[0]?.toUpperCase() ?? "");
  return letters.join("") || "R";
}
