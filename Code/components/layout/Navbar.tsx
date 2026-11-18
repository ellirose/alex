'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { useI18n } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { Logo } from '@/components/ui/Logo';

export const NAV_SECTIONS = ['about', 'expertise', 'experience', 'work', 'concepts', 'reel', 'toolkit'] as const;
type SectionId = (typeof NAV_SECTIONS)[number];

export function Navbar() {
  const { t } = useI18n();
  const [active, setActive] = useState<SectionId | ''>('');
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [pill, setPill] = useState({ left: 0, width: 0, visible: false });
  const progress = useRef<HTMLDivElement>(null);
  const links = useRef<HTMLDivElement>(null);

  // Scroll progress + compact state.
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (progress.current) progress.current.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
      if (y < window.innerHeight * 0.45) setActive('');
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Which section is in the middle of the viewport.
  useEffect(() => {
    const els = NAV_SECTIONS.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => !!el);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id as SectionId);
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Slide the ink pill under the active link (re-measured when the language changes).
  useEffect(() => {
    const measure = () => {
      const el = links.current?.querySelector<HTMLElement>(`[data-id="${active}"]`);
      setPill(el ? { left: el.offsetLeft, width: el.offsetWidth, visible: true } : (p) => ({ ...p, visible: false }));
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [active, t]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      <div
        ref={progress}
        aria-hidden
        className="fixed inset-x-0 top-0 z-[70] h-[3px] origin-left bg-copper"
        style={{ transform: 'scaleX(0)' }}
      />
      <header className="fixed inset-x-0 top-0 z-[60] px-3 pt-3 sm:px-5 sm:pt-4">
        <nav
          aria-label="Primary"
          className={cn(
            'mx-auto flex max-w-7xl items-center justify-between gap-2 rounded-full border py-2 pl-2 pr-2 transition-all duration-500 ease-out-expo sm:gap-4 sm:pl-2.5',
            scrolled
              ? 'border-white/70 bg-snow/88 shadow-soft backdrop-blur-xl'
              : 'border-white/50 bg-snow/60 backdrop-blur-md',
          )}
        >
          <a href="#top" aria-label={t.nav.home} className="min-w-0 rounded-full">
            <Logo tagline={t.hero.role} />
          </a>

          <div ref={links} className="relative hidden items-center xl:flex">
            <span
              aria-hidden
              className="absolute top-1/2 h-11 -translate-y-1/2 rounded-full bg-ink shadow-soft transition-all duration-500 ease-out-expo"
              style={{ left: pill.left, width: pill.width, opacity: pill.visible ? 1 : 0 }}
            />
            {NAV_SECTIONS.map((id) => (
              <a
                key={id}
                data-id={id}
                href={`#${id}`}
                aria-current={active === id ? 'true' : undefined}
                className={cn(
                  'relative z-10 rounded-full px-4 py-2.5 text-[15px] font-semibold transition-colors duration-300',
                  active === id ? 'text-snow' : 'text-ink/75 hover:text-ink',
                )}
              >
                {t.nav[id]}
              </a>
            ))}
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <LanguageSwitcher />
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? t.nav.close : t.nav.menu}
              className="grid size-12 place-items-center rounded-full bg-ink text-snow transition-transform duration-300 active:scale-95 xl:hidden"
            >
              <span className="burger" data-open={open || undefined}>
                <span />
                <span />
              </span>
            </button>
          </div>
        </nav>

        <div
          id="mobile-menu"
          data-open={open || undefined}
          className="pop-panel mx-auto mt-3 max-w-7xl origin-top rounded-[2rem] bg-snow p-4 shadow-lift ring-1 ring-ink/5 xl:hidden"
        >
          <ul>
            {NAV_SECTIONS.map((id, i) => (
              <li key={id} style={{ '--i': i } as CSSProperties} className="pop-item">
                <a
                  href={`#${id}`}
                  onClick={() => setOpen(false)}
                  className="flex items-baseline gap-4 rounded-2xl px-4 py-3 transition-colors hover:bg-paper"
                >
                  <span className="w-7 text-sm font-bold tabular-nums text-copper">0{i + 1}</span>
                  <span className="font-display text-3xl font-medium tracking-tight">{t.nav[id]}</span>
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-3 border-t border-dashed border-ink/15 px-2 pt-4">
            <LanguageSwitcher variant="inline" />
          </div>
        </div>
      </header>
    </>
  );
}
