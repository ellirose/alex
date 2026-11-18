import type { CSSProperties } from 'react';

/** Stagger delay for [data-reveal] elements. */
export const d = (ms: number) => ({ '--d': `${ms}ms` }) as CSSProperties;

export const cn = (...parts: (string | false | null | undefined)[]) => parts.filter(Boolean).join(' ');

