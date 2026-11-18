import type { CSSProperties } from 'react';

/** Stagger delay for [data-reveal] elements. */
export const d = (ms: number) => ({ '--d': `${ms}ms` }) as CSSProperties;

export const cn = (...parts: (string | false | null | undefined)[]) => parts.filter(Boolean).join(' ');

/** Short monogram for a tool name, e.g. "After Effects" -> "AE", "Figma" -> "Fi". */
export function monogram(name: string) {
  const words = name.split(/[\s.]+/).filter(Boolean);
  if (words.length > 1) return (words[0][0] + words[1][0]).toUpperCase();
  return name.slice(0, 1).toUpperCase() + name.slice(1, 2).toLowerCase();
}
