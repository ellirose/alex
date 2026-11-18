'use client';

import { useEffect, useRef } from 'react';
import { noise1D, smoothstep } from '@/lib/random';
import { useCanvas, type Frame } from './useCanvas';

type Ridge = {
  noise: (x: number) => number;
  base: number; // baseline as a fraction of height
  amp: number; // peak height as a fraction of height
  scale: number; // noise units per pixel
  color: string;
  snow?: boolean;
  parallax: number; // px shift at full pointer travel
};

const ridged = (n: (x: number) => number, x: number) => {
  let sum = 0;
  let amp = 1;
  let freq = 1;
  let norm = 0;
  for (let o = 0; o < 4; o++) {
    const v = 1 - Math.abs(n(x * freq + o * 31.7) * 2 - 1);
    sum += v * v * amp;
    norm += amp;
    amp *= 0.5;
    freq *= 2.03;
  }
  return sum / norm;
};

const BACK: Ridge[] = [
  { noise: noise1D(11), base: 0.64, amp: 0.34, scale: 1 / 300, color: '#CFDAE7', snow: true, parallax: 8 },
  { noise: noise1D(23), base: 0.76, amp: 0.22, scale: 1 / 220, color: '#B4C5D9', snow: true, parallax: 16 },
  { noise: noise1D(37), base: 0.88, amp: 0.13, scale: 1 / 170, color: '#E2CFB3', parallax: 26 },
];
const FRONT: Ridge = { noise: noise1D(51), base: 0.66, amp: 0.46, scale: 1 / 250, color: '#ECDFCB', parallax: 40 };
const snowNoise = noise1D(99);

const CLOUDS = [
  { x: 0.08, y: 0.2, w: 170, s: 7 },
  { x: 0.42, y: 0.13, w: 110, s: 10 },
  { x: 0.7, y: 0.27, w: 210, s: 5 },
  { x: 0.92, y: 0.09, w: 90, s: 12 },
];
const CONDORS = [
  { x: 0.18, y: 0.3, s: 15, v: 14, p: 0 },
  { x: 0.55, y: 0.21, s: 11, v: 10, p: 1.7 },
  { x: 0.8, y: 0.36, s: 9, v: 17, p: 3.1 },
];
const CACTI = [
  { x: 0.035, k: 1 },
  { x: 0.075, k: 0.7 },
  { x: 0.955, k: 0.85 },
];

/** Envelope: lower peaks on the left so the headline sits in open sky. */
const envelope = (xn: number) => 0.42 + 0.58 * smoothstep(0.12, 0.85, xn);

function ridgeY(r: Ridge, x: number, w: number, h: number, shift: number) {
  const v = ridged(r.noise, (x + shift + 5000) * r.scale) * envelope(x / w);
  return { y: h * r.base - h * r.amp * v, v };
}

function drawRidge(ctx: CanvasRenderingContext2D, r: Ridge, w: number, h: number, shift: number) {
  const step = 4;
  const ys: number[] = [];
  const vs: number[] = [];
  ctx.beginPath();
  ctx.moveTo(-10, h + 2);
  for (let x = -10; x <= w + 10; x += step) {
    const { y, v } = ridgeY(r, x, w, h, shift);
    ys.push(y);
    vs.push(v);
    ctx.lineTo(x, y);
  }
  ctx.lineTo(w + 10, h + 2);
  ctx.closePath();
  ctx.fillStyle = r.color;
  ctx.fill();

  // Crisp light rim along the crest.
  ctx.beginPath();
  ys.forEach((y, i) => (i ? ctx.lineTo(-10 + i * step, y) : ctx.moveTo(-10, y)));
  ctx.strokeStyle = 'rgba(255,255,255,0.55)';
  ctx.lineWidth = 1;
  ctx.stroke();

  if (!r.snow) return;
  ctx.beginPath();
  ys.forEach((y, i) => (i ? ctx.lineTo(-10 + i * step, y) : ctx.moveTo(-10, y)));
  for (let i = ys.length - 1; i >= 0; i--) {
    const x = -10 + i * step;
    const depth = Math.max(0, vs[i] - 0.5) * h * r.amp * 1.15 * (0.55 + 0.9 * snowNoise(x * 0.06));
    ctx.lineTo(x, ys[i] + depth);
  }
  ctx.closePath();
  ctx.fillStyle = 'rgba(251,252,254,0.96)';
  ctx.fill();
}

function drawCactus(ctx: CanvasRenderingContext2D, x: number, y: number, k: number) {
  const cw = 9 * k;
  const ch = 50 * k;
  ctx.fillStyle = '#CDB590';
  ctx.beginPath();
  ctx.roundRect(x - cw / 2, y - ch, cw, ch + 8, cw / 2);
  ctx.roundRect(x - cw * 2, y - ch * 0.66, cw * 0.82, ch * 0.34, cw * 0.41);
  ctx.roundRect(x - cw * 2, y - ch * 0.4, cw * 1.6, cw * 0.78, cw * 0.39);
  ctx.roundRect(x + cw * 1.18, y - ch * 0.82, cw * 0.82, ch * 0.4, cw * 0.41);
  ctx.roundRect(x + cw * 0.4, y - ch * 0.5, cw * 1.6, cw * 0.78, cw * 0.39);
  ctx.fill();
}

export function AndesCanvas({ layer, className }: { layer: 'back' | 'front'; className?: string }) {
  const pointer = useRef({ x: 0, tx: 0 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.tx = (e.clientX / window.innerWidth) * 2 - 1;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  const ref = useCanvas(({ ctx, w, h, t, dt }: Frame) => {
    const p = pointer.current;
    p.x += (p.tx - p.x) * Math.min(1, dt * 2.4);

    if (layer === 'front') {
      drawRidge(ctx, FRONT, w, h, p.x * FRONT.parallax);
      for (const c of CACTI) {
        const x = c.x * w;
        drawCactus(ctx, x, ridgeY(FRONT, x, w, h, p.x * FRONT.parallax).y + 4, c.k);
      }
      return;
    }

    // Sun with layered halos (flat discs, no gradients).
    const sr = Math.min(w, h) * 0.062;
    // On narrow screens the sun moves off the headline, above the portrait arch.
    const narrow = w < 768;
    const sx = (narrow ? w * 0.8 : w * 0.57) + p.x * 4;
    const sy = h * (narrow ? 0.5 : 0.37) + Math.sin(t * 0.25) * 4;
    for (const [m, a] of [
      [3.4, 0.05],
      [2.4, 0.08],
      [1.6, 0.13],
    ] as const) {
      ctx.beginPath();
      ctx.arc(sx, sy, sr * m, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(242,195,91,${a})`;
      ctx.fill();
    }
    ctx.beginPath();
    ctx.arc(sx, sy, sr, 0, Math.PI * 2);
    ctx.fillStyle = '#F2C35B';
    ctx.fill();

    // Drifting cloud streaks.
    for (const c of CLOUDS) {
      const x = ((c.x * w + t * c.s) % (w + 320)) - 160;
      const y = c.y * h;
      ctx.fillStyle = 'rgba(255,255,255,0.8)';
      ctx.beginPath();
      ctx.roundRect(x, y, c.w, 9, 4.5);
      ctx.roundRect(x + c.w * 0.22, y - 7, c.w * 0.5, 7, 3.5);
      ctx.fill();
    }

    BACK.forEach((r) => drawRidge(ctx, r, w, h, p.x * r.parallax));

    // Andean condors gliding on thermals.
    ctx.strokeStyle = 'rgba(30,43,58,0.6)';
    ctx.lineWidth = 1.7;
    ctx.lineCap = 'round';
    for (const c of CONDORS) {
      const x = ((c.x * w + t * c.v) % (w + 200)) - 100 + p.x * 10;
      const y = c.y * h + Math.sin(t * 0.55 + c.p) * 12;
      const f = Math.sin(t * 1.6 + c.p) * 0.25;
      const s = c.s;
      ctx.beginPath();
      ctx.moveTo(x - s, y - s * (0.18 + f * 0.4));
      ctx.quadraticCurveTo(x - s * 0.45, y - s * (0.42 + f * 0.2), x, y);
      ctx.quadraticCurveTo(x + s * 0.45, y - s * (0.42 + f * 0.2), x + s, y - s * (0.18 + f * 0.4));
      ctx.stroke();
    }
  });

  return <canvas ref={ref} className={className} aria-hidden />;
}
