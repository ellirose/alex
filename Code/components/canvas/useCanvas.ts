'use client';

import { useEffect, useLayoutEffect, useRef } from 'react';

export type Frame = { ctx: CanvasRenderingContext2D; w: number; h: number; t: number; dt: number };

/**
 * Shared render loop for every canvas on the site:
 * DPR-aware sizing, pauses off-screen / in background tabs, and draws a single
 * still frame when the visitor prefers reduced motion.
 */
export function useCanvas(draw: (f: Frame) => void, { animate = true, maxDpr = 2 } = {}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const drawRef = useRef(draw);
  useLayoutEffect(() => {
    drawRef.current = draw;
  });

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const looping = animate && !reduce;
    let w = 0;
    let h = 0;
    let raf = 0;
    let visible = false;
    const start = performance.now();
    let last = start;

    const render = (now: number) => {
      const t = (now - start) / 1000;
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (!w || !h) return;
      ctx.clearRect(0, 0, w, h);
      drawRef.current({ ctx, w, h, t, dt });
    };
    const loop = (now: number) => {
      render(now);
      raf = requestAnimationFrame(loop);
    };
    const play = () => {
      if (looping && !raf && visible && !document.hidden) {
        last = performance.now();
        raf = requestAnimationFrame(loop);
      }
    };
    const pause = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      render(performance.now());
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) play();
        else pause();
      },
      { rootMargin: '120px' },
    );
    io.observe(canvas);
    const onVisibility = () => (document.hidden ? pause() : play());
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      pause();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [animate, maxDpr]);

  return ref;
}

/** The page's body font, so canvas text matches the typography. */
let cachedFamily = '';
export function bodyFont(weight: number, size: number) {
  if (!cachedFamily && typeof document !== 'undefined') cachedFamily = getComputedStyle(document.body).fontFamily;
  return `${weight} ${size}px ${cachedFamily || 'system-ui, sans-serif'}`;
}
