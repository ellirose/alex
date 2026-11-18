'use client';

import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';
import { useI18n } from '@/lib/i18n';
import { LOCALES } from '@/lib/locales';
import { cn } from '@/lib/utils';
import { Flag } from './Flag';
import { IconCheck, IconChevron } from './Icons';

/** A bespoke flag dropdown (menu) or a row of flag pills (inline). */
export function LanguageSwitcher({
  variant = 'menu',
  compact = false,
  className,
}: {
  variant?: 'menu' | 'inline';
  compact?: boolean;
  className?: string;
}) {
  const { locale, setLocale, t } = useI18n();
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    const current = LOCALES.findIndex((l) => l.code === locale);
    window.setTimeout(() => optionRefs.current[current]?.focus(), 80);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, locale]);

  if (variant === 'inline') {
    return (
      <div role="radiogroup" aria-label={t.nav.language} className={cn('flex flex-wrap gap-2', className)}>
        {LOCALES.map((l) => {
          const active = l.code === locale;
          return (
            <button
              key={l.code}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => setLocale(l.code)}
              aria-label={l.native}
              className={cn(
                'flex items-center rounded-full font-semibold transition-all duration-300',
                compact ? 'gap-2 py-1 pl-1 pr-3 text-xs font-extrabold tracking-wider' : 'gap-2.5 py-1.5 pl-1.5 pr-4 text-[15px]',
                active ? 'bg-ink text-snow shadow-soft' : 'bg-snow/70 text-ink hover:-translate-y-0.5 hover:bg-snow',
              )}
            >
              <Flag country={l.country} className={compact ? 'size-7' : 'size-9'} />
              {compact ? l.short : l.native}
            </button>
          );
        })}
      </div>
    );
  }

  const current = LOCALES.find((l) => l.code === locale) ?? LOCALES[0];

  const onListKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const idx = optionRefs.current.findIndex((el) => el === document.activeElement);
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const next = (idx + (e.key === 'ArrowDown' ? 1 : -1) + LOCALES.length) % LOCALES.length;
      optionRefs.current[next]?.focus();
    }
  };

  return (
    <div ref={wrap} className={cn('relative', className)}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`${t.nav.language}: ${current.native}`}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'flex items-center gap-2 rounded-full py-1.5 pl-1.5 pr-3 transition-colors duration-300',
          open ? 'bg-dune' : 'bg-sand hover:bg-dune/80',
        )}
      >
        <Flag country={current.country} className="size-8" />
        <span className="text-sm font-extrabold tracking-wider max-sm:hidden">{current.short}</span>
        <IconChevron className={cn('size-4 transition-transform duration-500 ease-out-expo', open && 'rotate-180')} />
      </button>

      <div
        role="listbox"
        aria-label={t.nav.language}
        data-open={open || undefined}
        onKeyDown={onListKey}
        className="pop-panel absolute right-0 top-[calc(100%+14px)] z-50 w-[min(17.5rem,calc(100vw-2rem))] origin-top-right rounded-[1.75rem] bg-snow p-2 shadow-lift ring-1 ring-ink/5"
      >
        <span aria-hidden className="absolute -top-1.5 right-7 size-3.5 rotate-45 rounded-[3px] bg-snow" />
        <p className="px-4 pb-1 pt-3 text-[11px] font-bold uppercase tracking-[0.24em] text-mist">{t.nav.language}</p>
        {LOCALES.map((l, i) => {
          const active = l.code === locale;
          return (
            <button
              key={l.code}
              ref={(el) => {
                optionRefs.current[i] = el;
              }}
              type="button"
              role="option"
              aria-selected={active}
              onClick={() => {
                setLocale(l.code);
                setOpen(false);
              }}
              style={{ '--i': i } as CSSProperties}
              className={cn(
                'group relative flex w-full items-center gap-4 rounded-[1.25rem] px-3 py-3 text-left transition-colors duration-300',
                active ? 'bg-sand' : 'hover:bg-paper',
              )}
            >
              <Flag
                country={l.country}
                className="size-11 transition-transform duration-500 ease-out-expo group-hover:scale-110 group-hover:-rotate-6"
              />
              <span className="flex-1">
                <span className="block text-[17px] font-semibold leading-tight text-ink">{l.native}</span>
                <span className="mt-0.5 block text-xs font-bold uppercase tracking-[0.16em] text-mist">{l.region}</span>
              </span>
              <span
                className={cn(
                  'grid size-7 place-items-center rounded-full transition-all duration-300',
                  active ? 'bg-copper text-snow' : 'border-2 border-ink/10 text-transparent',
                )}
              >
                <IconCheck className="size-4" />
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
