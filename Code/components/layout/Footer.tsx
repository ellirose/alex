'use client';

import Image from 'next/image';
import { useState } from 'react';
import { MEDIA_CREDITS } from '@/lib/data';
import { useI18n } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { LogoMark } from '@/components/ui/Logo';
import { IconArrowUp, IconChevron, IconInfo } from '@/components/ui/Icons';
import { NAV_SECTIONS } from './Navbar';

export function Footer() {
  const { t } = useI18n();
  const f = t.footer;
  const [creditsOpen, setCreditsOpen] = useState(false);

  return (
    <footer className="sheet tex-sand overflow-hidden">
      <div className="container-x pb-8 pt-16 lg:pt-20">
        {/* Slim Atacama panorama strip with the mark overlapping it */}
        <div className="relative">
          <div data-reveal="mask" className="relative h-20 overflow-hidden rounded-full shadow-soft ring-[6px] ring-snow/80 sm:h-24">
            <Image
              src="/media/atacama-panorama.jpg"
              alt={f.panoramaAlt}
              fill
              sizes="(min-width: 1280px) 1200px, 100vw"
              className="object-cover object-[50%_55%]"
            />
            <span className="absolute bottom-1/2 right-5 translate-y-1/2 rounded-full bg-snow/85 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.2em] text-ink backdrop-blur max-sm:hidden">
              Atacama · 24.6° S
            </span>
          </div>
          <span className="absolute left-6 top-1/2 grid size-14 -translate-y-1/2 place-items-center rounded-full bg-snow shadow-lift sm:left-8 sm:size-16">
            <LogoMark className="size-10 sm:size-11" />
          </span>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-4">
            <p className="font-display text-[1.9rem] font-semibold leading-none tracking-tight text-ink">Alex Buntrock</p>
            <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.28em] text-copper">{t.hero.role}</p>
            <p className="mt-4 max-w-sm text-base leading-relaxed text-slate">{f.tagline}</p>
          </div>

          <nav aria-label={f.explore} className="lg:col-span-5">
            <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-copper">{f.explore}</p>
            <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
              {NAV_SECTIONS.map((id) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    className="text-[15px] font-semibold text-ink/75 underline decoration-transparent underline-offset-4 transition-colors hover:text-ink hover:decoration-copper"
                  >
                    {t.nav[id]}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-3">
            <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-copper">{f.language}</p>
            <LanguageSwitcher variant="inline" compact className="mt-3" />
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-dashed border-ink/20 pt-5">
          <p className="text-sm text-slate">
            © 2026 Alex Lynn Buntrock. {f.rights} <span className="max-sm:hidden">· {f.made}</span>
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCreditsOpen((o) => !o)}
              aria-expanded={creditsOpen}
              className="inline-flex items-center gap-1.5 rounded-full bg-snow/70 px-3 py-1.5 text-xs font-bold text-ink/80 transition-colors hover:bg-snow"
            >
              <IconInfo className="size-3.5 text-pacific" />
              {f.credits}
              <IconChevron className={cn('size-3.5 transition-transform duration-500 ease-out-expo', creditsOpen && 'rotate-180')} />
            </button>
            <a
              href="#top"
              aria-label={f.top}
              className="grid size-10 place-items-center rounded-full bg-ink text-snow shadow-soft transition-transform duration-500 ease-out-expo hover:-translate-y-1"
            >
              <IconArrowUp className="size-5" />
            </a>
          </div>
        </div>

        {/* Licence attributions for third-party media */}
        <div
          className={cn(
            'grid transition-[grid-template-rows,opacity] duration-500 ease-out-expo',
            creditsOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
          )}
        >
          <ul className="overflow-hidden">
            {MEDIA_CREDITS.map((m) => (
              <li key={m.source} className="mt-1.5 text-xs text-slate first:mt-4">
                <a href={m.source} target="_blank" rel="noreferrer" className="font-semibold text-ink underline decoration-dune underline-offset-4 hover:decoration-copper">
                  {m.label}
                </a>{' '}
                · {m.author} · {m.license} · Wikimedia Commons
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
