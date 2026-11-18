'use client';

import Image from 'next/image';
import { useEffect, useId, useState } from 'react';
import { useI18n } from '@/lib/i18n';
import { LOCALES } from '@/lib/locales';
import { cn, d } from '@/lib/utils';
import { AndesCanvas } from '@/components/canvas/AndesCanvas';
import { Flag } from '@/components/ui/Flag';
import { IconArrow, IconCode, IconDesign, IconGrowth, IconMotion, IconPlay } from '@/components/ui/Icons';

function RingBadge({ text, label }: { text: string; label: string }) {
  const id = useId().replace(/:/g, '');
  return (
    <div className="relative size-40">
      <div className="absolute inset-0 rounded-full bg-snow shadow-lift" />
      <div className="absolute inset-3 rounded-full border border-dashed border-copper/40" />
      <svg viewBox="0 0 200 200" className="anim-spin-slow absolute inset-0 size-full" aria-hidden>
        <defs>
          <path id={id} d="M100,100 m-72,0 a72,72 0 1,1 144,0 a72,72 0 1,1 -144,0" />
        </defs>
        <text className="fill-ink" style={{ fontSize: 13, fontWeight: 800 }}>
          <textPath href={`#${id}`} textLength="448" lengthAdjust="spacing">
            {text}
          </textPath>
        </text>
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <span className="block font-display text-[2.6rem] font-semibold leading-none text-copper">10+</span>
          <span className="mt-1 block max-w-[6.5rem] text-[10px] font-extrabold uppercase leading-tight tracking-[0.16em] text-slate">
            {label}
          </span>
        </div>
      </div>
    </div>
  );
}

const BUBBLES = [
  { Icon: IconDesign, pos: '-right-7 top-[12%]', color: 'text-copper', delay: '0s', size: 'size-[4.75rem]' },
  { Icon: IconMotion, pos: '-right-12 top-[44%]', color: 'text-pacific', delay: '-2.4s', size: 'size-[5.25rem]' },
  { Icon: IconCode, pos: '-left-9 top-[58%]', color: 'text-coral', delay: '-4.1s', size: 'size-[4.5rem]' },
  { Icon: IconGrowth, pos: 'right-[18%] -top-6', color: 'text-[#C99016]', delay: '-1.2s', size: 'size-16' },
];

export function Hero() {
  const { t, locale } = useI18n();
  const h = t.hero;
  const [time, setTime] = useState('');
  // Longer second lines (pt / es) get a slightly smaller display size so the hero still fits one screen.
  const longTitle = (h.titleB + h.titleEm).length > 18;

  useEffect(() => {
    const intl = LOCALES.find((l) => l.code === locale)?.intl ?? 'en-US';
    const fmt = new Intl.DateTimeFormat(intl, { hour: '2-digit', minute: '2-digit', timeZone: 'America/Santiago' });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = window.setInterval(tick, 20000);
    return () => window.clearInterval(id);
  }, [locale]);

  return (
    <section id="top" className="tex-plaster relative isolate h-[100svh] min-h-[660px] overflow-hidden">
      <AndesCanvas layer="back" className="absolute inset-0 h-full w-full" />

      {/* Portrait in a Valparaíso-window arch, layered between the ridges */}
      <div className="absolute bottom-0 right-[5%] z-10 h-[38%] w-[52vw] max-w-[540px] sm:h-[54%] sm:w-[40vw] lg:right-[6%] lg:h-[80%] lg:w-[min(33vw,520px)]">
        <div data-reveal="scale" style={d(250)} className="relative h-full w-full">
          <div
            aria-hidden
            className="absolute inset-0 translate-x-3 -translate-y-3 rounded-t-full border-2 border-copper/40 lg:translate-x-6 lg:-translate-y-6"
          />
          <div aria-hidden className="absolute inset-0 -translate-x-4 translate-y-2 rounded-t-full bg-sun/25 max-lg:hidden" />
          <div className="relative h-full w-full overflow-hidden rounded-t-full bg-dune shadow-lift ring-[10px] ring-snow/75">
            <Image
              src="/images/alex-portrait.png"
              alt={h.photoAlt}
              fill
              priority
              sizes="(min-width: 1024px) 33vw, 52vw"
              className="object-cover object-[50%_18%]"
            />
          </div>

          <div className="anim-float absolute -left-24 top-[8%] max-lg:hidden" style={{ animationDuration: '9s' }}>
            <RingBadge text={h.ring} label={h.yearsLabel} />
          </div>

          {BUBBLES.map(({ Icon, pos, color, delay, size }, i) => (
            <span
              key={i}
              aria-hidden
              className={cn(
                'anim-float absolute grid place-items-center rounded-full bg-snow/95 shadow-lift ring-1 ring-ink/5 max-md:hidden',
                pos,
                size,
              )}
              style={{ animationDelay: delay }}
            >
              <span className="absolute inset-1.5 rounded-full border border-ink/5" />
              <Icon className={cn('size-[52%]', color)} />
            </span>
          ))}

          <div className="absolute -left-36 bottom-[30%] z-10 w-60 rounded-[1.75rem] bg-snow/92 p-5 shadow-lift ring-1 ring-ink/5 backdrop-blur max-xl:hidden">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-slate">{h.metricLabel}</p>
            <div className="mt-2 flex items-end justify-between gap-3">
              <span className="font-display text-5xl font-semibold leading-none text-copper">+29%</span>
              <span className="flex h-11 items-end gap-1" aria-hidden>
                {[0.5, 0.7, 0.45, 0.85, 0.6, 1, 0.8].map((v, i) => (
                  <span
                    key={i}
                    className="anim-bar w-1.5 rounded-full bg-pacific"
                    style={{ height: `${v * 100}%`, animationDelay: `${i * -0.3}s` }}
                  />
                ))}
              </span>
            </div>
          </div>
        </div>
      </div>

      <AndesCanvas layer="front" className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[22%] w-full" />

      <div className="relative z-30 mx-auto flex h-full max-w-7xl flex-col px-5 sm:px-8 lg:px-12">
        <div className="flex max-w-[44rem] flex-1 flex-col justify-start pt-28 sm:pt-32 lg:max-w-[min(44rem,54vw)] lg:justify-center lg:pb-24 lg:pt-20">
          <div
            data-reveal
            className="inline-flex w-fit flex-wrap items-center gap-x-3 gap-y-1 rounded-full bg-snow/85 py-1.5 pl-1.5 pr-4 shadow-soft ring-1 ring-ink/5 backdrop-blur"
          >
            <Flag country="cl" className="size-8" />
            <span className="text-[15px] font-bold">{h.location}</span>
            <span className="h-4 w-px bg-ink/15 max-sm:hidden" />
            <span className="text-sm font-semibold tabular-nums text-slate max-sm:hidden">{h.coords}</span>
            {time && (
              <>
                <span className="h-4 w-px bg-ink/15 max-md:hidden" />
                <span className="text-sm font-bold tabular-nums text-pacific max-md:hidden">
                  {time} <span className="font-semibold text-mist">{h.localTime}</span>
                </span>
              </>
            )}
          </div>

          <p data-reveal style={d(60)} className="mt-7 text-sm font-extrabold uppercase tracking-[0.24em] text-copper">
            {h.kicker}
          </p>

          <h1
            className={cn(
              'mt-3 font-display font-medium leading-[0.95] tracking-[-0.035em] text-ink',
              longTitle
                ? 'text-[clamp(2.6rem,min(6.4vw,9.4vh),6.4rem)]'
                : 'text-[clamp(2.8rem,min(7.4vw,11vh),7.4rem)]',
            )}
            style={{ fontVariationSettings: '"SOFT" 100' }}
          >
            <span data-reveal style={d(120)} className="block">
              {h.titleA}
            </span>
            <span data-reveal style={d(220)} className="block">
              {h.titleB}{' '}
              <em className="relative inline-block italic text-copper">
                {h.titleEm}
                <svg
                  viewBox="0 0 220 24"
                  preserveAspectRatio="none"
                  className="absolute -bottom-[0.08em] left-0 h-[0.22em] w-full overflow-visible text-sun"
                  aria-hidden
                >
                  <path
                    d="M4 15C52 6 128 3 216 11"
                    pathLength={1}
                    className="draw-line"
                    stroke="currentColor"
                    strokeWidth="7"
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
              </em>
            </span>
          </h1>

          <p
            data-reveal
            style={d(320)}
            className="mt-7 max-w-xl text-lg leading-relaxed text-ink/80 text-pretty sm:text-xl max-sm:line-clamp-4"
          >
            {h.sub}
          </p>

          <div data-reveal style={d(420)} className="mt-9 flex flex-wrap items-center gap-3">
            <a
              href="#work"
              className="group inline-flex items-center gap-4 rounded-full bg-ink py-2 pl-7 pr-2 text-lg font-semibold text-snow shadow-lift transition-transform duration-500 ease-out-expo hover:-translate-y-1"
            >
              {h.ctaWork}
              <span className="grid size-12 place-items-center rounded-full bg-copper transition-transform duration-500 ease-out-expo group-hover:-rotate-45">
                <IconArrow className="size-5" />
              </span>
            </a>
            <a
              href="#reel"
              className="group inline-flex items-center gap-3 rounded-full bg-snow/80 py-2 pl-2 pr-6 text-lg font-semibold text-ink shadow-soft ring-1 ring-ink/10 backdrop-blur transition-transform duration-500 ease-out-expo hover:-translate-y-1 max-sm:hidden"
            >
              <span className="relative grid size-12 place-items-center rounded-full bg-pacific text-snow">
                <span className="anim-ping absolute inset-0 rounded-full bg-pacific/40" />
                <IconPlay className="relative size-5 translate-x-px" />
              </span>
              {h.ctaReel}
            </a>
          </div>
        </div>
      </div>

      {/* Bottom rail — sits above the next sheet's overlap */}
      <div className="absolute inset-x-0 bottom-[4.5rem] z-30 lg:bottom-[5.75rem]">
        <div className="mx-auto flex max-w-7xl items-center gap-5 px-5 sm:px-8 lg:px-12">
          <a
            href="#about"
            aria-label={h.scroll}
            className="flex items-center gap-3 text-xs font-extrabold uppercase tracking-[0.24em] text-ink/70"
          >
            <span className="relative flex h-11 w-7 justify-center rounded-full border-2 border-ink/25 bg-snow/60 pt-2">
              <span className="anim-scroll-dot size-1.5 rounded-full bg-copper" />
            </span>
            <span className="max-sm:hidden">{h.scroll}</span>
          </a>
          <span className="h-8 w-px bg-ink/15 max-sm:hidden" />
          <div className="flex items-center gap-3 max-sm:hidden">
            <span className="relative flex size-2.5">
              <span className="anim-ping absolute inset-0 rounded-full bg-pacific" />
              <span className="relative size-2.5 rounded-full bg-pacific" />
            </span>
            <span className="text-sm text-slate">
              <span className="font-bold text-ink">{h.now}</span> · {h.nowValue}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
