'use client';

import { useLayoutEffect, useRef, type PointerEvent } from 'react';
import { TOOL_GROUPS, type GroupId } from '@/lib/data';
import { TOOL_ICONS, type ToolIconSpec } from '@/lib/toolIcons';
import { bodyFont, useCanvas, type Frame } from './useCanvas';

/**
 * A raked-sand plate on which every tool icon is drawn in grains of sand.
 * When the discipline filter changes (and on first view) the grains are blown
 * apart, then drift back together into the new set of icons, which orbit slowly.
 */

const TAU = Math.PI * 2;
const SAMPLE_PX = 48; // icons are rasterised at this size to pick grain positions
const SAND: RGB = [196, 162, 112]; // grain colour while airborne
const SCATTER_TIME = 0.5;

type RGB = [number, number, number];
type Grain = { u: number; v: number; rgb: RGB };
type Slot = { name: string; x: number; y: number; size: number };
type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  slot: number; // -1 = free (scattering / fading)
  grain: Grain | null;
  delay: number;
  life: number;
  fade: 1 | -1;
};

/* ---------------- Icon rasterising & grain sampling ---------------- */

function drawIcon(g: CanvasRenderingContext2D, spec: ToolIconSpec, size: number) {
  const k = size / 24;
  g.save();
  g.scale(k, k);
  if (spec.kind === 'path') {
    g.fillStyle = spec.color;
    g.fill(new Path2D(spec.d));
  } else {
    // In sand, a solid tile reads as a blob, so draw it as an outlined tile with bold letters.
    const solid = spec.fg.toUpperCase() === '#FFFFFF';
    g.strokeStyle = solid ? spec.bg : spec.fg;
    g.lineWidth = 2.4;
    g.beginPath();
    if (spec.shape === 'circle') g.arc(12, 12, 10.8, 0, TAU);
    else g.roundRect(1.2, 1.2, 21.6, 21.6, 4.5);
    g.stroke();
    g.fillStyle = spec.bg;
    g.font = bodyFont(800, spec.text.length > 1 ? 12.5 : 15);
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillText(spec.text, 12, 13);
  }
  g.restore();
}

const grainCache = new Map<string, Grain[]>();

function grainsFor(name: string): Grain[] {
  const hit = grainCache.get(name);
  if (hit) return hit;
  const spec = TOOL_ICONS[name];
  const c = document.createElement('canvas');
  c.width = c.height = SAMPLE_PX;
  const g = c.getContext('2d', { willReadFrequently: true });
  if (!spec || !g) return [];
  drawIcon(g, spec, SAMPLE_PX);
  const { data } = g.getImageData(0, 0, SAMPLE_PX, SAMPLE_PX);
  const out: Grain[] = [];
  for (let y = 0; y < SAMPLE_PX; y++) {
    for (let x = 0; x < SAMPLE_PX; x++) {
      const i = (y * SAMPLE_PX + x) * 4;
      if (data[i + 3] < 140) continue;
      out.push({ u: (x + 0.5) / SAMPLE_PX - 0.5, v: (y + 0.5) / SAMPLE_PX - 0.5, rgb: [data[i], data[i + 1], data[i + 2]] });
    }
  }
  // Shuffle so any prefix is an even spread over the icon.
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  grainCache.set(name, out);
  return out;
}

/* ---------------- Layout ---------------- */

/** Tools for the active discipline, or all of them dealt round-robin so colours mix. */
function toolsFor(active: GroupId | null): string[] {
  if (active) return TOOL_GROUPS.find((g) => g.id === active)?.tools ?? [];
  const lists = TOOL_GROUPS.map((g) => g.tools);
  const out: string[] = [];
  for (let i = 0; i < Math.max(...lists.map((l) => l.length)); i++) for (const l of lists) if (l[i]) out.push(l[i]);
  return out;
}

function layout(tools: string[], cx: number, cy: number, R: number, rotA: number, rotB: number): Slot[] {
  const ring = (names: string[], r: number, size: number, rot: number) =>
    names.map((name, i) => {
      const a = rot + (i / names.length) * TAU - Math.PI / 2;
      return { name, x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r, size };
    });
  if (tools.length <= 10) {
    const r = R * 0.6;
    return ring(tools, r, Math.min(R * 0.28, ((TAU * r) / tools.length) * 0.58), rotA);
  }
  const inner = Math.round(tools.length * 0.36);
  return [...ring(tools.slice(0, inner), R * 0.4, R * 0.13, rotA), ...ring(tools.slice(inner), R * 0.74, R * 0.13, rotB)];
}

/** Big icons get denser sand so knocked-out letters (JS, TS, CSS…) stay legible. */
const grainsPerIcon = (size: number) => Math.max(90, Math.min(1000, Math.round(size * size * (size > 50 ? 0.36 : 0.2))));

/* ---------------- Plate (pre-rendered) ---------------- */

function makePlate(w: number, h: number, dpr: number, cx: number, cy: number, R: number) {
  const c = document.createElement('canvas');
  c.width = Math.round(w * dpr);
  c.height = Math.round(h * dpr);
  const g = c.getContext('2d');
  if (!g) return c;
  g.scale(dpr, dpr);

  const base = g.createRadialGradient(cx - R * 0.3, cy - R * 0.35, R * 0.05, cx, cy, R);
  base.addColorStop(0, '#FCF8F0');
  base.addColorStop(0.55, '#F3E9D7');
  base.addColorStop(1, '#E7D7BC');
  g.beginPath();
  g.arc(cx, cy, R, 0, TAU);
  g.fillStyle = base;
  g.fill();

  g.save();
  g.clip();
  // Raked grooves: concentric, slightly wobbly rings with a lit upper edge.
  for (let r = R * 0.1; r < R * 1.02; r += 7) {
    const wobble = (a: number) => r + Math.sin(a * 3 + r * 0.05) * 1.3 + Math.sin(a * 7 + r * 0.11) * 0.6;
    const ringPath = (dy: number) => {
      g.beginPath();
      for (let a = 0; a <= TAU + 0.01; a += 0.03) {
        const rr = wobble(a);
        const x = cx + Math.cos(a) * rr;
        const y = cy + Math.sin(a) * rr + dy;
        if (a === 0) g.moveTo(x, y);
        else g.lineTo(x, y);
      }
    };
    ringPath(0.7);
    g.strokeStyle = 'rgba(140,105,60,0.11)';
    g.lineWidth = 1.3;
    g.stroke();
    ringPath(-0.6);
    g.strokeStyle = 'rgba(255,255,255,0.6)';
    g.lineWidth = 0.8;
    g.stroke();
  }
  // Loose grains.
  const n = Math.round(R * R * 0.05);
  for (let i = 0; i < n; i++) {
    const a = Math.random() * TAU;
    const r = Math.sqrt(Math.random()) * R;
    g.fillStyle = Math.random() < 0.5 ? 'rgba(120,88,48,0.16)' : 'rgba(255,255,255,0.7)';
    g.fillRect(cx + Math.cos(a) * r, cy + Math.sin(a) * r, 1, 1);
  }
  // Soft inner shadow toward the rim.
  const rim = g.createRadialGradient(cx, cy, R * 0.78, cx, cy, R);
  rim.addColorStop(0, 'rgba(120,88,48,0)');
  rim.addColorStop(1, 'rgba(120,88,48,0.16)');
  g.fillStyle = rim;
  g.fillRect(cx - R, cy - R, R * 2, R * 2);
  g.restore();
  return c;
}

/* ---------------- Component ---------------- */

export function ToolSand({
  active,
  accent,
  className,
}: {
  active: GroupId | null;
  accent: string;
  className?: string;
}) {
  const activeRef = useRef(active);
  const accentRef = useRef(accent);
  useLayoutEffect(() => {
    activeRef.current = active;
    accentRef.current = accent;
  });

  const sim = useRef({
    parts: [] as Particle[],
    key: undefined as string | undefined,
    phase: 'idle' as 'idle' | 'scatter' | 'gather',
    t: 0,
    rotA: 0,
    rotB: 0,
    omega: 0.07,
    dragging: false,
    lastX: 0,
    pointer: null as { x: number; y: number } | null,
    plate: null as HTMLCanvasElement | null,
    plateKey: '',
    colors: new Map<string, string>(),
    reduce: false,
  });

  const color = (rgb: RGB, mix: number) => {
    const m = Math.round(mix * 4) / 4;
    const key = `${rgb.join(',')}|${m}`;
    let c = sim.current.colors.get(key);
    if (!c) {
      const [r, g, b] = rgb.map((v, i) => Math.round(SAND[i] + (v - SAND[i]) * m));
      c = `rgb(${r},${g},${b})`;
      sim.current.colors.set(key, c);
    }
    return c;
  };

  const ref = useCanvas(
    ({ ctx, w, h, dt }: Frame) => {
      const s = sim.current;
      const cx = w / 2;
      const cy = h / 2;
      const R = Math.min(w, h) * 0.45;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      s.reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      const plateKey = `${w}x${h}@${dpr}`;
      if (s.plateKey !== plateKey) {
        s.plate = makePlate(w, h, dpr, cx, cy, R);
        s.plateKey = plateKey;
      }
      if (s.plate) ctx.drawImage(s.plate, 0, 0, w, h);

      // Orbit motion (drag adds spin, which eases back to a slow drift).
      if (!s.reduce) {
        if (!s.dragging) s.omega += (0.07 - s.omega) * Math.min(1, dt * 1.5);
        s.rotA += s.omega * dt;
        s.rotB -= s.omega * 0.7 * dt;
      }

      const tools = toolsFor(activeRef.current);
      const slots = layout(tools, cx, cy, R, s.rotA, s.rotB);
      const key = activeRef.current ?? 'all';

      const assign = () => {
        const needs: { slot: number; grain: Grain }[] = [];
        slots.forEach((slot, si) => {
          const grains = grainsFor(slot.name);
          if (!grains.length) return;
          const n = grainsPerIcon(slot.size);
          for (let k = 0; k < n; k++) needs.push({ slot: si, grain: grains[k % grains.length] });
        });
        for (let i = needs.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [needs[i], needs[j]] = [needs[j], needs[i]];
        }
        // Grains settle in a sweep around the plate.
        const delayFor = (si: number) => (si / slots.length) * 0.55 + Math.random() * 0.25;
        needs.forEach((nd, i) => {
          let p = s.parts[i];
          if (!p) {
            const a = Math.random() * TAU;
            const r = R * (0.9 + Math.random() * 0.35);
            p = { x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r, vx: 0, vy: 0, slot: -1, grain: null, delay: 0, life: 0, fade: 1 };
            s.parts.push(p);
          }
          p.slot = nd.slot;
          p.grain = nd.grain;
          p.delay = delayFor(nd.slot);
          p.fade = 1;
        });
        for (let i = needs.length; i < s.parts.length; i++) {
          s.parts[i].slot = -1;
          s.parts[i].fade = -1;
        }
        s.phase = 'gather';
        s.t = 0;
      };

      // First frame: start from loose sand strewn across the plate.
      if (s.key === undefined) {
        s.key = key;
        if (!s.reduce) {
          const n = slots.reduce((sum, sl) => sum + grainsPerIcon(sl.size), 0);
          for (let i = 0; i < n; i++) {
            const a = Math.random() * TAU;
            const r = Math.sqrt(Math.random()) * R * 0.95;
            s.parts.push({ x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r, vx: 0, vy: 0, slot: -1, grain: null, delay: 0, life: 0, fade: 1 });
          }
        }
        assign();
      } else if (s.key !== key) {
        s.key = key;
        if (s.reduce) assign();
        else {
          // Blow the current icons apart.
          for (const p of s.parts) {
            const a = Math.atan2(p.y - cy, p.x - cx) + (Math.random() - 0.5) * 1.4 + 0.5;
            const v = 70 + Math.random() * 230;
            p.vx = Math.cos(a) * v;
            p.vy = Math.sin(a) * v - 30;
            p.slot = -1;
          }
          s.phase = 'scatter';
          s.t = 0;
        }
      }

      s.t += dt;
      if (s.phase === 'scatter' && s.t > SCATTER_TIME) assign();

      // Simulate & draw grains.
      const big = slots[0] && slots[0].size > R * 0.2;
      const grainSize = big ? 1.9 : 1.55;
      const half = grainSize / 2;
      const damp = Math.exp(-1.8 * dt);
      let alpha = 1;
      ctx.globalAlpha = 1;
      let style = '';
      const alive: Particle[] = [];
      for (const p of s.parts) {
        const slot = p.slot >= 0 ? slots[p.slot] : null;
        let mix = 0;
        if (slot && p.grain) {
          const tx = slot.x + p.grain.u * slot.size;
          const ty = slot.y + p.grain.v * slot.size;
          if (s.reduce) {
            p.x = tx;
            p.y = ty;
            p.life = 1;
            mix = 1;
          } else if (s.t > p.delay) {
            const ax = (tx - p.x) * 46 - p.vx * 10;
            const ay = (ty - p.y) * 46 - p.vy * 10;
            p.vx += ax * dt;
            p.vy += ay * dt;
            const d = Math.hypot(tx - p.x, ty - p.y);
            mix = Math.max(0, 1 - d / 26);
          } else {
            p.vx *= damp;
            p.vy *= damp;
          }
        } else {
          // Airborne: drag, a gentle swirl and a little gravity.
          p.vx = p.vx * damp - (p.y - cy) * 0.25 * dt;
          p.vy = p.vy * damp + (p.x - cx) * 0.25 * dt + 14 * dt;
        }
        if (!s.reduce) {
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          p.life = Math.max(0, Math.min(1, p.life + p.fade * dt * (p.fade > 0 ? 2.5 : 1.2)));
        }
        if ((p.fade < 0 && p.life <= 0) || (s.reduce && p.slot < 0)) continue;
        alive.push(p);

        const a = Math.round(p.life * 8) / 8;
        if (a !== alpha) {
          ctx.globalAlpha = a;
          alpha = a;
        }
        const c = color(p.grain?.rgb ?? SAND, p.slot >= 0 ? mix : 0);
        if (c !== style) {
          ctx.fillStyle = c;
          style = c;
        }
        ctx.fillRect(p.x - half, p.y - half, grainSize, grainSize);
      }
      s.parts = alive;
      ctx.globalAlpha = 1;

      // Hover label.
      const settled = s.reduce || (s.phase === 'gather' && s.t > 1.4);
      if (settled && s.pointer && !s.dragging) {
        const hit = slots.find((sl) => Math.hypot(sl.x - s.pointer!.x, sl.y - s.pointer!.y) < sl.size * 0.6);
        if (hit) {
          ctx.font = bodyFont(700, 13);
          const tw = ctx.measureText(hit.name).width;
          const bw = tw + 22;
          const bx = Math.max(4, Math.min(w - bw - 4, hit.x - bw / 2));
          const by = hit.y - hit.size / 2 - 34;
          ctx.fillStyle = '#1E2B3A';
          ctx.beginPath();
          ctx.roundRect(bx, by, bw, 26, 13);
          ctx.fill();
          ctx.fillStyle = accentRef.current;
          ctx.beginPath();
          ctx.arc(hit.x, hit.y - hit.size / 2 - 6, 2.5, 0, TAU);
          ctx.fill();
          ctx.fillStyle = '#FFFDF8';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(hit.name, bx + bw / 2, by + 13.5);
        }
      }
    },
    { redraw: active },
  );

  const local = (e: PointerEvent<HTMLCanvasElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  return (
    <canvas
      ref={ref}
      aria-hidden
      className={className}
      onPointerDown={(e) => {
        const s = sim.current;
        s.dragging = true;
        s.lastX = e.clientX;
        e.currentTarget.setPointerCapture(e.pointerId);
      }}
      onPointerMove={(e) => {
        const s = sim.current;
        s.pointer = local(e);
        if (!s.dragging) return;
        const dx = e.clientX - s.lastX;
        s.lastX = e.clientX;
        s.rotA += dx * 0.006;
        s.rotB -= dx * 0.004;
        s.omega = dx * 0.35;
      }}
      onPointerUp={() => {
        sim.current.dragging = false;
      }}
      onPointerCancel={() => {
        sim.current.dragging = false;
      }}
      onPointerLeave={() => {
        sim.current.pointer = null;
      }}
    />
  );
}
