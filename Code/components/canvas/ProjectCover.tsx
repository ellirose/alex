'use client';

import { useRef } from 'react';
import { COLORS as C } from '@/lib/data';
import { clamp, hash2, lerp, mulberry32 } from '@/lib/random';
import { bodyFont, useCanvas, type Frame } from './useCanvas';

export type CoverVariant = 'valpo' | 'pipeline' | 'series';

type House = { x: number; y: number; w: number; h: number; color: string; roof: number; seed: number };

const HOUSE_COLORS = [C.coral, C.sun, C.pacific, C.andes, '#EBC3AB', C.snow, C.copper, '#7FB3BF', '#F6E0AE', '#C6E0E4'];

const hillTop = (x: number, w: number, h: number) =>
  h * (0.36 + 0.13 * Math.cos((x / w) * Math.PI * 1.15 - 0.3)) + Math.sin(x * 0.03) * h * 0.012;

function buildTown(w: number, h: number): House[] {
  const rand = mulberry32(42);
  const sea = h * 0.8;
  const out: House[] = [];
  for (let row = 0; row < 16; row++) {
    let x = -12 + rand() * 12;
    while (x < w + 12) {
      const hw = 15 + rand() * 17;
      const y = hillTop(x + hw / 2, w, h) + row * h * 0.042 + rand() * 4;
      if (y < sea + 6) {
        out.push({
          x,
          y,
          w: hw,
          h: 13 + rand() * 19,
          color: HOUSE_COLORS[Math.floor(rand() * HOUSE_COLORS.length)],
          roof: Math.floor(rand() * 3),
          seed: rand() * 1000,
        });
      }
      x += hw + rand() * 3 - 1;
    }
  }
  return out.sort((a, b) => a.y - b.y);
}

function drawValpo(ctx: CanvasRenderingContext2D, w: number, h: number, t: number, town: House[]) {
  ctx.fillStyle = '#F7ECDD';
  ctx.fillRect(0, 0, w, h);

  // Sun & halo
  const sx = w * 0.8;
  const sy = h * 0.19;
  const sr = h * 0.075;
  ctx.fillStyle = 'rgba(242,195,91,0.18)';
  ctx.beginPath();
  ctx.arc(sx, sy, sr * 1.9, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#F2C35B';
  ctx.beginPath();
  ctx.arc(sx, sy, sr, 0, Math.PI * 2);
  ctx.fill();

  // Distant cordillera
  ctx.fillStyle = '#DCE5EF';
  ctx.beginPath();
  ctx.moveTo(0, h);
  for (let x = 0; x <= w; x += 6) ctx.lineTo(x, h * (0.33 + 0.05 * Math.sin(x * 0.021) + 0.03 * Math.sin(x * 0.053)));
  ctx.lineTo(w, h);
  ctx.fill();

  // Hill
  ctx.fillStyle = '#E7D8BE';
  ctx.beginPath();
  ctx.moveTo(0, h);
  for (let x = 0; x <= w; x += 4) ctx.lineTo(x, hillTop(x, w, h) - 2);
  ctx.lineTo(w, h);
  ctx.fill();

  // Painted houses, back to front
  const tick = Math.floor(t * 0.6);
  for (const b of town) {
    const top = b.y - b.h;
    ctx.fillStyle = b.color;
    ctx.fillRect(b.x, top, b.w, b.h);
    ctx.strokeStyle = 'rgba(30,43,58,0.16)';
    ctx.lineWidth = 0.8;
    ctx.strokeRect(b.x + 0.4, top + 0.4, b.w - 0.8, b.h - 0.8);
    ctx.fillStyle = b.roof === 1 ? '#B4532E' : 'rgba(30,43,58,0.55)';
    ctx.beginPath();
    if (b.roof === 1) {
      ctx.moveTo(b.x - 1.5, top);
      ctx.lineTo(b.x + b.w / 2, top - b.w * 0.34);
      ctx.lineTo(b.x + b.w + 1.5, top);
    } else if (b.roof === 2) {
      ctx.moveTo(b.x - 1.5, top);
      ctx.lineTo(b.x + b.w + 1.5, top - 5);
      ctx.lineTo(b.x + b.w + 1.5, top);
    } else {
      ctx.rect(b.x - 1.5, top - 2.5, b.w + 3, 3);
    }
    ctx.fill();
    const cols = Math.max(1, Math.floor((b.w - 4) / 8));
    const rows = Math.max(1, Math.floor((b.h - 5) / 10));
    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        const lit = hash2(b.seed + c, r, tick) > 0.94;
        ctx.fillStyle = lit ? '#F6D27A' : 'rgba(30,43,58,0.5)';
        ctx.fillRect(b.x + 4 + c * ((b.w - 6) / cols), top + 4 + r * 10, 3.4, 5);
      }
    }
  }

  // Funicular (ascensor) gliding up and down its track
  const ax = w * 0.15;
  const ay = h * 0.8;
  const bx = w * 0.33;
  const by = h * 0.47;
  ctx.strokeStyle = 'rgba(30,43,58,0.7)';
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  ctx.moveTo(ax, ay);
  ctx.lineTo(bx, by);
  ctx.stroke();
  ctx.lineWidth = 1;
  for (let k = 0; k <= 12; k++) {
    const px = lerp(ax, bx, k / 12);
    const py = lerp(ay, by, k / 12);
    ctx.beginPath();
    ctx.moveTo(px - 3, py + 2);
    ctx.lineTo(px + 3, py - 2);
    ctx.stroke();
  }
  const s = (Math.sin(t * 0.5) + 1) / 2;
  const cx = lerp(ax, bx, s);
  const cy = lerp(ay, by, s);
  ctx.fillStyle = '#C8372D';
  ctx.beginPath();
  ctx.roundRect(cx - 9, cy - 15, 18, 13, 2.5);
  ctx.fill();
  ctx.fillStyle = C.snow;
  ctx.fillRect(cx - 6, cy - 12, 5, 4);
  ctx.fillRect(cx + 1, cy - 12, 5, 4);

  // Pacific
  ctx.fillStyle = '#94C3CB';
  ctx.fillRect(0, h * 0.8, w, h * 0.2);
  ctx.strokeStyle = 'rgba(255,253,248,0.75)';
  ctx.lineWidth = 1.4;
  for (let k = 0; k < 3; k++) {
    ctx.beginPath();
    const y0 = h * (0.845 + k * 0.05);
    for (let x = 0; x <= w; x += 6) {
      const y = y0 + Math.sin(x * 0.06 + t * (1.2 + k * 0.3) + k) * 1.6;
      x ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    }
    ctx.stroke();
  }
  // A small sailboat
  const bxp = ((t * 14) % (w + 80)) - 40;
  const byp = h * 0.9;
  ctx.fillStyle = C.ink;
  ctx.beginPath();
  ctx.moveTo(bxp - 11, byp);
  ctx.lineTo(bxp + 11, byp);
  ctx.lineTo(bxp + 7, byp + 5);
  ctx.lineTo(bxp - 7, byp + 5);
  ctx.fill();
  ctx.fillStyle = C.snow;
  ctx.beginPath();
  ctx.moveTo(bxp, byp - 2);
  ctx.lineTo(bxp, byp - 20);
  ctx.lineTo(bxp + 10, byp - 2);
  ctx.fill();
}

function drawPipeline(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
  ctx.fillStyle = '#EAF2F1';
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = 'rgba(42,124,142,0.09)';
  ctx.lineWidth = 1;
  for (let x = 0; x < w; x += 22) {
    ctx.beginPath();
    ctx.moveTo(x + 0.5, 0);
    ctx.lineTo(x + 0.5, h);
    ctx.stroke();
  }
  for (let y = 0; y < h; y += 22) {
    ctx.beginPath();
    ctx.moveTo(0, y + 0.5);
    ctx.lineTo(w, y + 0.5);
    ctx.stroke();
  }

  // Dashboard panel
  const x0 = w * 0.07;
  const y0 = h * 0.16;
  const pw = w * 0.8;
  const ph = h * 0.72;
  ctx.save();
  ctx.shadowColor = 'rgba(30,43,58,0.16)';
  ctx.shadowBlur = 26;
  ctx.shadowOffsetY = 10;
  ctx.fillStyle = C.snow;
  ctx.beginPath();
  ctx.roundRect(x0, y0, pw, ph, 16);
  ctx.fill();
  ctx.restore();
  [C.coral, C.sun, C.pacific].forEach((c, i) => {
    ctx.fillStyle = c;
    ctx.beginPath();
    ctx.arc(x0 + 18 + i * 13, y0 + 18, 4, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.fillStyle = C.copper;
  ctx.font = bodyFont(800, Math.round(h * 0.1));
  ctx.fillText('−38%', x0 + 18, y0 + 30 + h * 0.1);
  ctx.fillStyle = 'rgba(30,43,58,0.18)';
  ctx.beginPath();
  ctx.roundRect(x0 + 18, y0 + 42 + h * 0.1, pw * 0.3, 6, 3);
  ctx.roundRect(x0 + 18, y0 + 54 + h * 0.1, pw * 0.2, 6, 3);
  ctx.fill();

  // Bars
  const n = 9;
  const bx0 = x0 + pw * 0.08;
  const bx1 = x0 + pw * 0.94;
  const base = y0 + ph * 0.9;
  const maxH = ph * 0.42;
  const slot = (bx1 - bx0) / n;
  const pts: [number, number][] = [];
  for (let i = 0; i < n; i++) {
    const v = (0.25 + 0.55 * (0.5 + 0.5 * Math.sin(t * 1.1 + i * 0.8))) * (0.55 + 0.45 * (i / n));
    const bh = maxH * v;
    const bx = bx0 + i * slot + slot * 0.2;
    ctx.fillStyle = i === n - 1 ? C.copper : `rgba(42,124,142,${0.3 + 0.6 * (i / n)})`;
    ctx.beginPath();
    ctx.roundRect(bx, base - bh, slot * 0.6, bh, [5, 5, 2, 2]);
    ctx.fill();
    pts.push([bx + slot * 0.3, base - maxH * (0.25 + 0.68 * (i / (n - 1))) - Math.sin(t * 0.9 + i) * 6 - 14]);
  }
  // Trend line draws itself, holds, then repeats.
  const prog = clamp(((t * 0.35) % 1.5) / 1, 0, 1) * (n - 1);
  ctx.strokeStyle = C.ink;
  ctx.lineWidth = 2.4;
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i <= Math.floor(prog); i++) ctx.lineTo(pts[i][0], pts[i][1]);
  const k = Math.floor(prog);
  if (k < n - 1) {
    const f = prog - k;
    ctx.lineTo(lerp(pts[k][0], pts[k + 1][0], f), lerp(pts[k][1], pts[k + 1][1], f));
  }
  ctx.stroke();
  for (let i = 0; i <= k; i++) {
    ctx.fillStyle = C.snow;
    ctx.strokeStyle = C.ink;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(pts[i][0], pts[i][1], 3.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  // Floating proposal template
  const dx = x0 + pw * 0.62;
  const dy = y0 - h * 0.08 + Math.sin(t * 1.2) * 4;
  ctx.save();
  ctx.translate(dx, dy);
  ctx.rotate(0.07);
  ctx.shadowColor = 'rgba(30,43,58,0.16)';
  ctx.shadowBlur = 18;
  ctx.shadowOffsetY = 8;
  ctx.fillStyle = C.snow;
  ctx.beginPath();
  ctx.roundRect(0, 0, w * 0.28, h * 0.34, 10);
  ctx.fill();
  ctx.restore();
  ctx.save();
  ctx.translate(dx, dy);
  ctx.rotate(0.07);
  ctx.fillStyle = C.sun;
  ctx.beginPath();
  ctx.roundRect(12, 12, w * 0.12, 8, 4);
  ctx.fill();
  ctx.fillStyle = 'rgba(30,43,58,0.16)';
  for (let r = 0; r < 4; r++) {
    ctx.beginPath();
    ctx.roundRect(12, 30 + r * 11, w * (r % 2 ? 0.16 : 0.2), 5, 2.5);
    ctx.fill();
  }
  ctx.fillStyle = C.pacific;
  ctx.beginPath();
  ctx.arc(w * 0.28 - 18, h * 0.34 - 18, 9, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = C.snow;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(w * 0.28 - 22, h * 0.34 - 18);
  ctx.lineTo(w * 0.28 - 19, h * 0.34 - 15);
  ctx.lineTo(w * 0.28 - 14, h * 0.34 - 21);
  ctx.stroke();
  ctx.restore();
}

function drawSeries(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
  ctx.fillStyle = '#F5EADB';
  ctx.fillRect(0, 0, w, h);
  const cx = w * 0.5;
  const cy = h * 0.44;
  const R = Math.min(w, h) * 0.27;

  ctx.save();
  ctx.setLineDash([3, 8]);
  ctx.lineDashOffset = -t * 14;
  ctx.strokeStyle = 'rgba(30,43,58,0.28)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(cx, cy, R * 1.34, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // Eight episodes as arc segments
  const pos = t * 0.8;
  const k = Math.floor(pos) % 8;
  const local = pos % 1;
  const seg = (Math.PI * 2) / 8;
  ctx.lineCap = 'round';
  ctx.lineWidth = R * 0.15;
  for (let i = 0; i < 8; i++) {
    const a0 = -Math.PI / 2 + i * seg + 0.07;
    const a1 = a0 + seg - 0.14;
    ctx.strokeStyle = i < k ? C.pacific : 'rgba(159,180,204,0.5)';
    ctx.beginPath();
    ctx.arc(cx, cy, R, a0, a1);
    ctx.stroke();
    if (i === k) {
      ctx.strokeStyle = C.copper;
      ctx.beginPath();
      ctx.arc(cx, cy, R, a0, a0 + (a1 - a0) * local);
      ctx.stroke();
    }
  }

  ctx.save();
  ctx.shadowColor = 'rgba(30,43,58,0.18)';
  ctx.shadowBlur = 22;
  ctx.shadowOffsetY = 8;
  ctx.fillStyle = C.snow;
  ctx.beginPath();
  ctx.arc(cx, cy, R * 0.7, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  ctx.fillStyle = C.ink;
  ctx.beginPath();
  ctx.moveTo(cx - R * 0.17, cy - R * 0.25);
  ctx.lineTo(cx - R * 0.17, cy + R * 0.25);
  ctx.lineTo(cx + R * 0.27, cy);
  ctx.closePath();
  ctx.fill();

  // Episode counter inside the disc
  ctx.fillStyle = 'rgba(30,43,58,0.6)';
  ctx.font = bodyFont(800, Math.max(10, Math.round(R * 0.15)));
  ctx.textAlign = 'center';
  ctx.fillText(`EP 0${k + 1} / 08`, cx, cy + R * 0.5);
  ctx.textAlign = 'start';

  // Accessible subtitle bar typing in
  const bw = w * 0.66;
  const bx = cx - bw / 2;
  const by = h * 0.82;
  ctx.fillStyle = 'rgba(30,43,58,0.88)';
  ctx.beginPath();
  ctx.roundRect(bx, by, bw, 32, 9);
  ctx.fill();
  ctx.fillStyle = C.snow;
  const typed = clamp(local * 1.4, 0, 1);
  ctx.beginPath();
  ctx.roundRect(bx + 14, by + 10, (bw - 28) * typed, 5, 2.5);
  ctx.fill();
  ctx.fillStyle = 'rgba(255,253,248,0.6)';
  ctx.beginPath();
  ctx.roundRect(bx + 14, by + 19, (bw - 80) * clamp(typed * 1.3 - 0.3, 0, 1), 5, 2.5);
  ctx.fill();
}

/** Generative cover art for each case study. */
export function ProjectCover({ variant, className }: { variant: CoverVariant; className?: string }) {
  const town = useRef<{ w: number; h: number; houses: House[] }>({ w: 0, h: 0, houses: [] });
  const ref = useCanvas(({ ctx, w, h, t }: Frame) => {
    if (variant === 'valpo') {
      if (town.current.w !== w || town.current.h !== h) town.current = { w, h, houses: buildTown(w, h) };
      drawValpo(ctx, w, h, t, town.current.houses);
    } else if (variant === 'pipeline') drawPipeline(ctx, w, h, t);
    else drawSeries(ctx, w, h, t);
  });
  return <canvas ref={ref} className={className} aria-hidden />;
}
