'use client';

import { useRef } from 'react';
import { COLORS as C } from '@/lib/data';
import { mulberry32, noise1D } from '@/lib/random';
import { bodyFont, useCanvas, type Frame } from './useCanvas';

type Kind = 'title' | 'video' | 'voice' | 'music';
type Clip = { start: number; len: number; color: string; name: string; seed: number };
type Track = { label: string; kind: Kind; h: number; clips: Clip[]; total: number };

const VIDEO_COLORS = ['#C6E0E4', '#F2CFC6', '#F6E0AE', '#EBC3AB', '#DCE5EF'];
const PX_PER_SEC = 60;
const FPS = 24;

function buildTracks(): Track[] {
  const rand = mulberry32(2026);
  const spec: { label: string; kind: Kind; h: number }[] = [
    { label: 'V2', kind: 'title', h: 30 },
    { label: 'V1', kind: 'video', h: 48 },
    { label: 'A1', kind: 'voice', h: 38 },
    { label: 'A2', kind: 'music', h: 38 },
  ];
  return spec.map((s, ti) => {
    const clips: Clip[] = [];
    let cursor = 0;
    for (let n = 0; n < 160; n++) {
      const gap =
        s.kind === 'title' ? 90 + rand() * 260 : s.kind === 'voice' ? (rand() < 0.35 ? 30 + rand() * 90 : 4) : 2;
      const len =
        s.kind === 'music' ? 520 + rand() * 480 : s.kind === 'title' ? 110 + rand() * 120 : 100 + rand() * 210;
      const start = cursor + gap;
      clips.push({
        start,
        len,
        color: s.kind === 'video' ? VIDEO_COLORS[n % VIDEO_COLORS.length] : '',
        name: s.kind === 'video' ? `SC_${String(10 + n).padStart(3, '0')}` : s.kind === 'title' ? 'TITLE' : '',
        seed: ti * 1000 + n,
      });
      cursor = start + len;
    }
    return { ...s, clips, total: cursor };
  });
}

const wave = noise1D(7, 4096);

function timecode(sec: number) {
  const s = Math.max(0, sec);
  const hh = Math.floor(s / 3600);
  const mm = Math.floor((s % 3600) / 60);
  const ss = Math.floor(s % 60);
  const ff = Math.floor((s % 1) * FPS);
  return [hh, mm, ss, ff].map((v) => String(v).padStart(2, '0')).join(':');
}

/** A living NLE timeline: tracks scroll under a fixed playhead; hovering slows the edit. */
export function TimelineCanvas({ className }: { className?: string }) {
  const tracks = useRef<Track[]>(buildTracks());
  const state = useRef({ pan: 1800, speed: 1, target: 1 });

  const ref = useCanvas(({ ctx, w, h, dt }: Frame) => {
    const st = state.current;
    st.speed += (st.target - st.speed) * Math.min(1, dt * 4);
    st.pan += PX_PER_SEC * 0.9 * st.speed * dt;

    const G = 64; // label gutter
    const R = 34; // ruler
    const playX = G + (w - G) * 0.4;
    const worldAtPlay = st.pan + (playX - G);

    ctx.fillStyle = C.snow;
    ctx.fillRect(0, 0, w, h);

    // Ruler
    ctx.fillStyle = '#F7F2E8';
    ctx.fillRect(G, 0, w - G, R);
    ctx.strokeStyle = 'rgba(30,43,58,0.28)';
    ctx.fillStyle = 'rgba(30,43,58,0.55)';
    ctx.lineWidth = 1;
    ctx.font = bodyFont(700, 10);
    const tickStep = PX_PER_SEC / 4;
    const first = Math.ceil(st.pan / tickStep) * tickStep;
    for (let wx = first; wx < st.pan + w - G; wx += tickStep) {
      const x = G + (wx - st.pan);
      const major = Math.round(wx / tickStep) % 4 === 0;
      ctx.beginPath();
      ctx.moveTo(x + 0.5, R);
      ctx.lineTo(x + 0.5, R - (major ? 12 : 6));
      ctx.stroke();
      if (major) ctx.fillText(timecode(wx / PX_PER_SEC).slice(3, 8), x + 4, 13);
    }

    // Tracks
    let y = R + 10;
    for (const tr of tracks.current) {
      ctx.fillStyle = 'rgba(239,229,211,0.45)';
      ctx.fillRect(G, y - 3, w - G, tr.h + 6);
      const loopStart = Math.floor(st.pan / tr.total) * tr.total;
      for (const offset of [loopStart, loopStart + tr.total]) {
        for (const c of tr.clips) {
          const ws = c.start + offset;
          const we = ws + c.len;
          if (we < st.pan || ws > st.pan + w - G) continue;
          const x = G + (ws - st.pan);
          const cw = c.len - 2;
          const active = worldAtPlay >= ws && worldAtPlay <= we;
          drawClip(ctx, tr.kind, c, x, y, cw, tr.h, active);
        }
      }
      y += tr.h + 10;
    }

    // Gutter labels drawn over clip overflow
    ctx.fillStyle = '#F3ECE0';
    ctx.fillRect(0, 0, G, h);
    ctx.strokeStyle = 'rgba(30,43,58,0.1)';
    ctx.beginPath();
    ctx.moveTo(G + 0.5, 0);
    ctx.lineTo(G + 0.5, h);
    ctx.stroke();
    y = R + 10;
    ctx.font = bodyFont(800, 12);
    for (const tr of tracks.current) {
      ctx.fillStyle = tr.kind === 'video' || tr.kind === 'title' ? C.pacific : C.coral;
      ctx.beginPath();
      ctx.roundRect(12, y + tr.h / 2 - 11, 40, 22, 11);
      ctx.fill();
      ctx.fillStyle = C.snow;
      ctx.fillText(tr.label, 23, y + tr.h / 2 + 4);
      y += tr.h + 10;
    }

    // Playhead
    ctx.strokeStyle = C.copper;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(playX, R - 2);
    ctx.lineTo(playX, h);
    ctx.stroke();
    ctx.fillStyle = C.copper;
    ctx.beginPath();
    ctx.moveTo(playX - 7, R - 12);
    ctx.lineTo(playX + 7, R - 12);
    ctx.lineTo(playX + 7, R - 5);
    ctx.lineTo(playX, R + 2);
    ctx.lineTo(playX - 7, R - 5);
    ctx.closePath();
    ctx.fill();

    // Timecode chip
    const tc = timecode(worldAtPlay / PX_PER_SEC);
    ctx.font = bodyFont(800, 12);
    const tw = ctx.measureText(tc).width + 20;
    ctx.fillStyle = C.ink;
    ctx.beginPath();
    ctx.roundRect(playX + 12, 5, tw, 22, 11);
    ctx.fill();
    ctx.fillStyle = C.snow;
    ctx.fillText(tc, playX + 22, 20);
  });

  return (
    <canvas
      ref={ref}
      className={className}
      aria-hidden
      onPointerEnter={() => (state.current.target = 0.25)}
      onPointerLeave={() => (state.current.target = 1)}
    />
  );
}

function drawClip(
  ctx: CanvasRenderingContext2D,
  kind: Kind,
  c: Clip,
  x: number,
  y: number,
  w: number,
  h: number,
  active: boolean,
) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, 7);
  if (kind === 'video') {
    ctx.fillStyle = c.color;
    ctx.fill();
    ctx.save();
    ctx.clip();
    // Thumbnail frames: tiny horizon + sun silhouettes
    for (let fx = x + 4; fx < x + w; fx += 46) {
      ctx.fillStyle = 'rgba(30,43,58,0.08)';
      ctx.fillRect(fx, y + 18, 40, h - 22);
      ctx.fillStyle = 'rgba(30,43,58,0.16)';
      ctx.beginPath();
      ctx.moveTo(fx, y + h - 4);
      ctx.lineTo(fx + 14, y + 28);
      ctx.lineTo(fx + 22, y + 36);
      ctx.lineTo(fx + 30, y + 26);
      ctx.lineTo(fx + 40, y + h - 4);
      ctx.fill();
    }
    ctx.restore();
    ctx.fillStyle = 'rgba(30,43,58,0.75)';
    ctx.font = bodyFont(800, 10);
    ctx.fillText(c.name, x + 8, y + 13);
  } else if (kind === 'title') {
    ctx.fillStyle = '#E9B23C';
    ctx.fill();
    ctx.fillStyle = 'rgba(30,43,58,0.8)';
    ctx.font = bodyFont(800, 10);
    ctx.fillText('T  TITLE', x + 8, y + h / 2 + 4);
  } else {
    const voice = kind === 'voice';
    ctx.fillStyle = voice ? '#C6E0E4' : '#F2CFC6';
    ctx.fill();
    ctx.save();
    ctx.clip();
    ctx.strokeStyle = voice ? 'rgba(42,124,142,0.85)' : 'rgba(217,112,92,0.85)';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    const mid = y + h / 2;
    for (let fx = x + 3; fx < x + w - 2; fx += 3) {
      const n = wave((fx - x + c.seed * 13) * (voice ? 0.09 : 0.035));
      const a = (voice ? Math.pow(n, 1.6) : 0.35 + n * 0.5) * (h / 2 - 5);
      ctx.moveTo(fx, mid - a);
      ctx.lineTo(fx, mid + a);
    }
    ctx.stroke();
    ctx.restore();
  }
  if (active) {
    ctx.strokeStyle = C.copper;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(x + 1, y + 1, w - 2, h - 2, 6);
    ctx.stroke();
  }
}
