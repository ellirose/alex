'use client';

import { useLayoutEffect, useMemo, useRef, type PointerEvent } from 'react';
import { TOOL_GROUPS, type GroupId } from '@/lib/data';
import { bodyFont, useCanvas, type Frame } from './useCanvas';

type Pt = { name: string; group: GroupId; color: string; x: number; y: number; z: number };

const GOLDEN = Math.PI * (3 - Math.sqrt(5));

function rotate(x: number, y: number, z: number, ry: number, rx: number) {
  const cy = Math.cos(ry);
  const sy = Math.sin(ry);
  const x1 = x * cy + z * sy;
  const z1 = -x * sy + z * cy;
  const cx = Math.cos(rx);
  const sx = Math.sin(rx);
  return { x: x1, y: y * cx - z1 * sx, z: y * sx + z1 * cx };
}

/** A draggable 3D sphere of tools; the selected discipline lights up. */
export function ToolGlobe({ active, className }: { active: GroupId | null; className?: string }) {
  const activeRef = useRef(active);
  useLayoutEffect(() => {
    activeRef.current = active;
  });

  const points = useMemo<Pt[]>(() => {
    const flat = TOOL_GROUPS.flatMap((g) => g.tools.map((name) => ({ name, group: g.id, color: g.color })));
    const n = flat.length;
    // Interleave so each discipline spreads across the sphere.
    return flat.map((tool, k) => {
      const i = (k * 7) % n;
      const y = 1 - ((i + 0.5) * 2) / n;
      const r = Math.sqrt(1 - y * y);
      const phi = i * GOLDEN;
      return { ...tool, x: Math.cos(phi) * r, y, z: Math.sin(phi) * r };
    });
  }, []);

  const motion = useRef({ ry: 0.4, rx: -0.32, vy: 0.22, dragging: false, lastX: 0, lastY: 0, push: 0 });

  const ref = useCanvas(({ ctx, w, h, dt }: Frame) => {
    const m = motion.current;
    if (!m.dragging) {
      m.vy += (0.22 - m.vy) * Math.min(1, dt * 1.2);
      m.ry += m.vy * dt;
      m.rx += (-0.32 - m.rx) * Math.min(1, dt * 0.8);
    }
    const R = Math.min(w, h) * 0.36;
    const cx = w / 2;
    const cy = h / 2;
    const f = 4;
    const proj = (p: { x: number; y: number; z: number }) => {
      const s = f / (f - p.z);
      return { X: cx + p.x * R * s, Y: cy + p.y * R * s, s };
    };

    // Wireframe: parallels and meridians, fading toward the back.
    ctx.lineWidth = 1;
    const ring = (fn: (a: number) => [number, number, number]) => {
      let prev: { X: number; Y: number; z: number } | null = null;
      for (let k = 0; k <= 72; k++) {
        const [x, y, z] = fn((k / 72) * Math.PI * 2);
        const r = rotate(x, y, z, m.ry, m.rx);
        const p = { ...proj(r), z: r.z };
        if (prev) {
          ctx.strokeStyle = `rgba(30,43,58,${0.035 + 0.11 * ((p.z + prev.z) / 4 + 0.5)})`;
          ctx.beginPath();
          ctx.moveTo(prev.X, prev.Y);
          ctx.lineTo(p.X, p.Y);
          ctx.stroke();
        }
        prev = p;
      }
    };
    for (const lat of [-60, -30, 0, 30, 60]) {
      const phi = (lat * Math.PI) / 180;
      ring((a) => [Math.cos(phi) * Math.cos(a), Math.sin(phi), Math.cos(phi) * Math.sin(a)]);
    }
    for (let k = 0; k < 6; k++) {
      const lon = (k / 6) * Math.PI;
      ring((a) => [Math.cos(a) * Math.cos(lon), Math.sin(a), Math.cos(a) * Math.sin(lon)]);
    }

    // Core
    ctx.fillStyle = 'rgba(233,178,60,0.16)';
    ctx.beginPath();
    ctx.arc(cx, cy, R * 0.16, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(233,178,60,0.6)';
    ctx.beginPath();
    ctx.arc(cx, cy, R * 0.06, 0, Math.PI * 2);
    ctx.fill();

    const act = activeRef.current;
    const placed = points
      .map((p) => {
        const r = rotate(p.x, p.y, p.z, m.ry, m.rx);
        return { p, r, ...proj(r) };
      })
      .sort((a, b) => a.r.z - b.r.z);

    for (const { p, r, X, Y, s } of placed) {
      const front = (r.z + 1) / 2;
      const on = !act || p.group === act;
      const alpha = on ? 0.22 + 0.78 * front : 0.07 + 0.2 * front;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = on ? p.color : '#8C98A6';
      ctx.beginPath();
      ctx.arc(X, Y, (2.4 + 3.2 * front) * s, 0, Math.PI * 2);
      ctx.fill();

      const size = Math.round((11 + 6 * front + (on && act ? 2 : 0)) * Math.min(1.15, w / 520 + 0.25));
      ctx.font = bodyFont(on ? 800 : 600, size);
      const tw = ctx.measureText(p.name).width;
      const lx = X + 9 * s;
      const ly = Y + size * 0.35;
      if (on && front > 0.5) {
        ctx.fillStyle = 'rgba(255,253,248,0.94)';
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.roundRect(lx - 7, Y - size * 0.82, tw + 14, size * 1.64, size * 0.82);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#1E2B3A';
      } else {
        ctx.fillStyle = on ? p.color : '#8C98A6';
      }
      ctx.fillText(p.name, lx, ly);
    }
    ctx.globalAlpha = 1;
  });

  const onDown = (e: PointerEvent<HTMLCanvasElement>) => {
    const m = motion.current;
    m.dragging = true;
    m.lastX = e.clientX;
    m.lastY = e.clientY;
    m.push = 0;
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onMove = (e: PointerEvent<HTMLCanvasElement>) => {
    const m = motion.current;
    if (!m.dragging) return;
    const dx = e.clientX - m.lastX;
    const dy = e.clientY - m.lastY;
    m.lastX = e.clientX;
    m.lastY = e.clientY;
    m.ry += dx * 0.008;
    m.rx = Math.max(-1.2, Math.min(1.2, m.rx - dy * 0.006));
    m.push = dx;
  };
  const onUp = () => {
    const m = motion.current;
    m.dragging = false;
    m.vy = Math.max(-5, Math.min(5, m.push * 0.5));
  };

  return (
    <canvas
      ref={ref}
      className={className}
      aria-hidden
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
    />
  );
}
