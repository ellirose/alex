'use client';

import { useEffect } from 'react';

/**
 * Adds `data-in` to every [data-reveal] element the first time it scrolls into view.
 *
 * `data-reveal="mask"` elements start fully hidden by their own clip-path, and Chrome's
 * IntersectionObserver treats a fully clipped element as having no visible area, so it
 * would never report it. For those we watch the (unclipped) parent instead.
 */
export function RevealObserver() {
  useEffect(() => {
    const targets = new Map<Element, Set<Element>>();

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          targets.get(entry.target)?.forEach((el) => el.setAttribute('data-in', ''));
          targets.delete(entry.target);
          io.unobserve(entry.target);
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
    );

    const scan = () =>
      document.querySelectorAll('[data-reveal]:not([data-in])').forEach((el) => {
        const watched = el.getAttribute('data-reveal') === 'mask' && el.parentElement ? el.parentElement : el;
        const set = targets.get(watched);
        if (set) set.add(el);
        else {
          targets.set(watched, new Set([el]));
          io.observe(watched);
        }
      });

    scan();
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);
  return null;
}
