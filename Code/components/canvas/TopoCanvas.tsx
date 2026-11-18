'use client';

import { noise2D } from '@/lib/random';
import { useCanvas, type Frame } from './useCanvas';

// Marching-squares edge pairs per cell case (corners: a=tl 8, b=tr 4, c=br 2, d=bl 1).
// Edges: 0 top, 1 right, 2 bottom, 3 left.
const CASES: number[][][] = [
  [],
  [[3, 2]],
  [[2, 1]],
  [[3, 1]],
  [[0, 1]],
  [
    [3, 0],
    [2, 1],
  ],
  [[0, 2]],
  [[3, 0]],
  [[3, 0]],
  [[0, 2]],
  [
    [0, 1],
    [3, 2],
  ],
  [[0, 1]],
  [[3, 1]],
  [[2, 1]],
  [[3, 2]],
  [],
];

/** A static topographic map, generated once per size — the backdrop for the coastline journey. */
export function TopoCanvas({ className }: { className?: string }) {
  const ref = useCanvas(
    ({ ctx, w, h }: Frame) => {
      const cell = 12;
      const cols = Math.ceil(w / cell) + 1;
      const rows = Math.ceil(h / cell) + 1;
      const f = new Float32Array(cols * rows);
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const x = i * cell;
          const y = j * cell;
          f[j * cols + i] =
            0.58 * noise2D(x * 0.0028, y * 0.0028, 3) +
            0.3 * noise2D(x * 0.0075, y * 0.0075, 7) +
            0.12 * noise2D(x * 0.018, y * 0.018, 11);
        }
      }
      ctx.lineWidth = 1;
      ctx.lineJoin = 'round';
      for (let L = 0; L < 15; L++) {
        const iso = 0.2 + L * 0.042;
        ctx.beginPath();
        ctx.strokeStyle = L % 4 === 0 ? 'rgba(42,124,142,0.24)' : 'rgba(42,124,142,0.12)';
        for (let j = 0; j < rows - 1; j++) {
          for (let i = 0; i < cols - 1; i++) {
            const a = f[j * cols + i];
            const b = f[j * cols + i + 1];
            const c = f[(j + 1) * cols + i + 1];
            const dd = f[(j + 1) * cols + i];
            const idx = (a > iso ? 8 : 0) | (b > iso ? 4 : 0) | (c > iso ? 2 : 0) | (dd > iso ? 1 : 0);
            const segs = CASES[idx];
            if (!segs.length) continue;
            const x0 = i * cell;
            const y0 = j * cell;
            const pt = (edge: number): [number, number] => {
              switch (edge) {
                case 0:
                  return [x0 + (cell * (iso - a)) / (b - a), y0];
                case 1:
                  return [x0 + cell, y0 + (cell * (iso - b)) / (c - b)];
                case 2:
                  return [x0 + (cell * (iso - dd)) / (c - dd), y0 + cell];
                default:
                  return [x0, y0 + (cell * (iso - a)) / (dd - a)];
              }
            };
            for (const [e1, e2] of segs) {
              const p1 = pt(e1);
              const p2 = pt(e2);
              ctx.moveTo(p1[0], p1[1]);
              ctx.lineTo(p2[0], p2[1]);
            }
          }
        }
        ctx.stroke();
      }
    },
    { animate: false, maxDpr: 1 },
  );

  return <canvas ref={ref} className={className} aria-hidden />;
}
