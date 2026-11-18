'use client';

import { useRef, type HTMLAttributes, type PointerEvent } from 'react';
import { cn } from '@/lib/utils';

/** Pointer-driven 3D tilt. Children marked .depth-1/.depth-2 float above the surface. */
export function Tilt({ max = 8, className, children, ...rest }: HTMLAttributes<HTMLDivElement> & { max?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || e.pointerType === 'touch') return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty('--ry', `${(px * max).toFixed(2)}deg`);
    el.style.setProperty('--rx', `${(-py * max).toFixed(2)}deg`);
    el.dataset.active = '';
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty('--ry', '0deg');
    el.style.setProperty('--rx', '0deg');
    delete el.dataset.active;
  };

  return (
    <div ref={ref} onPointerMove={onMove} onPointerLeave={onLeave} className={cn('tilt', className)} {...rest}>
      {children}
    </div>
  );
}
