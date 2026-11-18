'use client';

import Image from 'next/image';
import { useId, useState } from 'react';
import { MEDIA_CREDITS } from '@/lib/data';
import { useI18n } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { Logo, LogoMark } from '@/components/ui/Logo';
import { IconArrow, IconArrowUp, IconChevron, IconInfo } from '@/components/ui/Icons';
import { NAV_SECTIONS } from './Navbar';

function BackToTop({ label }: { label: string }) {
  const id = useId().replace(/:/g, '');
  return (
    <a href="#top" aria-label={label} className="group relative grid size-28 shrink-0 place-items-center">
      <svg viewBox="0 0 120 120" className="anim-spin-slow absolute inset-0 size-full text-ink/60" aria-hidden>
        <defs>
          <path id={id} d="M60,60 m-48,0 a48,48 0 1,1 96,0 a48,48 0 1,1 -96,0" />
        </defs>
        <text style={{ fontSize: 10.5, fontWeight: 800 }} fill="currentColor">
          <textPath href={`#${id}`} textLength="296" lengthAdjust="spacing">
            {`${label.toUpperCase()} • ${label.toUpperCase()} • `}
          </textPath>
        </text>
      </svg>
      <span className="grid size-14 place-items-center rounded-full bg-ink text-snow shadow-lift transition-transform duration-500 ease-out-expo group-hover:-translate-y-1.5">
        <IconArrowUp className="size-6" />
      </span>
    </a>
  );
}

export function Footer() {
  const { t } = useI18n();
  const f = t.footer;
  const [creditsOpen, setCreditsOpen] = useState(false);

  return (
    <footer className="sheet tex-sand overflow-hidden">
      <div className="container-x pb-10 pt-20 lg:pt-28">
        {/* Atacama panorama capsule with the mark overlapping it */}
        <div className="relative">
          <div data-reveal="mask" className="relative h-44 overflow-hidden rounded-full shadow-lift ring-[10px] ring-snow/80 sm:h-56">
            <Image
              src="/media/atacama-panorama.jpg"
              alt={f.panoramaAlt}
              fill
              sizes="(min-width: 1280px) 1200px, 100vw"
              className="object-cover object-[50%_55%]"
            />
            <span className="absolute bottom-4 right-8 rounded-full bg-snow/85 px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.2em] text-ink backdrop-blur">
              Atacama · 24.6° S
            </span>
          </div>
          <span className="absolute -bottom-10 left-10 grid size-24 place-items-center rounded-full bg-snow shadow-lift sm:left-16">
            <LogoMark className="size-16" />
          </span>
        </div>

        <div className="mt-20 grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Logo tagline={t.hero.role} size="xl" className="[&>span:first-child]:hidden" />
            <p className="mt-6 max-w-lg text-xl leading-relaxed text-slate">{f.tagline}</p>
          </div>

          <nav aria-label={f.explore} className="lg:col-span-2">
            <p className="text-sm font-extrabold uppercase tracking-[0.22em] text-copper">{f.explore}</p>
            <ul className="mt-5 space-y-2.5">
              {NAV_SECTIONS.map((id) => (
                <li key={id}>
                  <a href={`#${id}`} className="group inline-flex items-center gap-2 text-lg font-semibold text-ink/80 hover:text-ink">
                    <IconArrow className="size-4 -translate-x-1 text-copper opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
                    <span className="-ml-6 transition-[margin] duration-300 group-hover:ml-0">{t.nav[id]}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-3">
            <p className="text-sm font-extrabold uppercase tracking-[0.22em] text-copper">{f.language}</p>
            <LanguageSwitcher variant="inline" className="mt-5 flex-col items-start" />
          </div>
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-between gap-6 border-t border-dashed border-ink/20 pt-8">
          <div className="space-y-1 text-[15px] text-slate">
            <p>
              © 2026 Alex Lynn Buntrock. {f.rights}
            </p>
            <p>{f.made}</p>
          </div>
          <BackToTop label={f.top} />
        </div>

        {/* Licence attributions for third-party media */}
        <div className="mt-6">
          <button
            type="button"
            onClick={() => setCreditsOpen((o) => !o)}
            aria-expanded={creditsOpen}
            className="inline-flex items-center gap-2 rounded-full bg-snow/70 px-4 py-2 text-sm font-bold text-ink/80 transition-colors hover:bg-snow"
          >
            <IconInfo className="size-4 text-pacific" />
            {f.credits}
            <IconChevron className={cn('size-4 transition-transform duration-500 ease-out-expo', creditsOpen && 'rotate-180')} />
          </button>
          <div
            className={cn(
              'grid transition-[grid-template-rows,opacity] duration-500 ease-out-expo',
              creditsOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
            )}
          >
            <ul className="overflow-hidden">
              {MEDIA_CREDITS.map((m) => (
                <li key={m.source} className="mt-2 text-sm text-slate first:mt-4">
                  <a href={m.source} target="_blank" rel="noreferrer" className="font-semibold text-ink underline decoration-dune underline-offset-4 hover:decoration-copper">
                    {m.label}
                  </a>{' '}
                  · {m.author} · {m.license} · Wikimedia Commons
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
