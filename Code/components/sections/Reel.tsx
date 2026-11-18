'use client';

import Image from 'next/image';
import { useEffect, useId, useRef } from 'react';
import { useI18n } from '@/lib/i18n';
import { d } from '@/lib/utils';
import { TimelineCanvas } from '@/components/canvas/TimelineCanvas';
import {
  IconArrow,
  IconFilm,
  IconFlask,
  IconPalette,
  IconScissors,
  IconSparkle,
  IconStoryboard,
} from '@/components/ui/Icons';
import { SectionHeading } from '@/components/ui/SectionHeading';

const STEP_ICONS = [IconStoryboard, IconScissors, IconSparkle, IconPalette, IconFlask];

/** Running SMPTE-style timecode, updated without re-rendering React. */
function RecTimer() {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    let raf = 0;
    const start = performance.now() - 24_000;
    const tick = (now: number) => {
      const s = (now - start) / 1000;
      const f = Math.floor((s % 1) * 24);
      if (ref.current) {
        ref.current.textContent = `00:${String(Math.floor(s / 60) % 60).padStart(2, '0')}:${String(Math.floor(s) % 60).padStart(2, '0')}:${String(f).padStart(2, '0')}`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <span ref={ref} className="tabular-nums">
      00:00:24:00
    </span>
  );
}

function Lens({ alt }: { alt: string }) {
  const id = useId().replace(/:/g, '');
  return (
    <div data-reveal="scale" className="relative mx-auto aspect-square w-full max-w-[470px]">
      <svg viewBox="0 0 400 400" className="anim-spin-slower absolute inset-0 size-full text-ink/45" aria-hidden>
        <defs>
          <path id={id} d="M200,200 m-176,0 a176,176 0 1,1 352,0 a176,176 0 1,1 -352,0" />
        </defs>
        {Array.from({ length: 120 }, (_, i) => {
          const a = (i / 120) * Math.PI * 2;
          const r1 = i % 10 === 0 ? 186 : 191;
          return (
            <line
              key={i}
              x1={200 + Math.cos(a) * r1}
              y1={200 + Math.sin(a) * r1}
              x2={200 + Math.cos(a) * 197}
              y2={200 + Math.sin(a) * 197}
              stroke="currentColor"
              strokeWidth={i % 10 === 0 ? 2 : 1}
            />
          );
        })}
        <text style={{ fontSize: 12, fontWeight: 800, letterSpacing: '.18em' }} fill="currentColor">
          <textPath href={`#${id}`} textLength="1090" lengthAdjust="spacing">
            35MM • F/1.8 • 1/50 • ISO 400 • 24 FPS • 4K • LOG • 35MM • F/1.8 • 1/50 • ISO 400 • 24 FPS • 4K • LOG •
          </textPath>
        </text>
      </svg>
      <div className="absolute inset-[11%] rounded-full bg-snow p-3 shadow-lift">
        <div className="group relative size-full overflow-hidden rounded-full ring-1 ring-ink/10">
          <Image
            src="/images/alex-studio.png"
            alt={alt}
            fill
            sizes="(min-width: 1024px) 380px, 80vw"
            className="object-cover object-[50%_22%] transition-transform duration-[1.4s] ease-out-expo group-hover:scale-105"
          />
          {/* Viewfinder corners */}
          {['left-[18%] top-[18%] border-l-[3px] border-t-[3px]', 'right-[18%] top-[18%] border-r-[3px] border-t-[3px]', 'bottom-[18%] left-[18%] border-b-[3px] border-l-[3px]', 'bottom-[18%] right-[18%] border-b-[3px] border-r-[3px]'].map((c) => (
            <span key={c} aria-hidden className={`absolute size-7 rounded-[4px] border-snow/90 ${c}`} />
          ))}
        </div>
      </div>
      <div className="absolute left-[2%] top-[9%] flex items-center gap-2 rounded-full bg-snow px-4 py-2 text-sm font-extrabold shadow-lift">
        <span className="anim-blink size-2.5 rounded-full bg-coral" />
        REC
        <span className="font-semibold text-slate">
          <RecTimer />
        </span>
      </div>
    </div>
  );
}

export function Reel() {
  const { t } = useI18n();
  const r = t.reel;
  return (
    <section id="reel" className="sheet tex-plaster">
      <div className="container-x py-28 lg:py-40">
        <div className="grid items-center gap-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Lens alt={r.lensAlt} />
          </div>
          <div className="lg:col-span-7">
            <SectionHeading kicker={r.kicker} title={r.title} icon={<IconFilm />} />
            <p data-reveal style={d(160)} className="mt-6 max-w-2xl text-xl leading-relaxed text-slate text-pretty">
              {r.body}
            </p>
            <dl className="mt-12 grid gap-4 sm:grid-cols-3">
              {r.stats.map((s, i) => (
                <div
                  key={s.label}
                  data-reveal
                  style={d(200 + i * 100)}
                  className="rounded-[1.75rem] rounded-tr-[0.6rem] bg-snow/85 p-6 shadow-soft ring-1 ring-ink/5"
                >
                  <dt className="font-display text-5xl font-semibold leading-none text-copper">{s.value}</dt>
                  <dd className="mt-3 text-[15px] font-semibold leading-snug text-slate">{s.label}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* Editing suite: program monitor + process, timeline beneath */}
        <div className="mt-24 grid gap-6 lg:grid-cols-12">
          <figure data-reveal="mask" className="relative overflow-hidden rounded-[2rem] bg-[#22323F] p-3 shadow-lift lg:col-span-8">
            <div className="relative aspect-video overflow-hidden rounded-[1.4rem] bg-ink">
              <video
                className="absolute inset-0 h-full w-full object-cover"
                src="/media/ascensor-baron.webm"
                poster="/media/ascensor-baron-poster.jpg"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                aria-label={r.monitorCaption}
              />
              {/* Title-safe guides */}
              <span aria-hidden className="pointer-events-none absolute inset-[7%] rounded-md border border-white/35" />
              <span aria-hidden className="pointer-events-none absolute inset-[12%] rounded-md border border-dashed border-white/25" />
              <span className="absolute left-4 top-4 rounded-full bg-snow/92 px-3 py-1 text-xs font-extrabold uppercase tracking-[0.16em] text-ink">
                PGM · {r.monitor}
              </span>
              <span className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full bg-ink/80 px-3 py-1 text-xs font-bold text-snow backdrop-blur">
                <span className="anim-blink size-2 rounded-full bg-coral" />
                <RecTimer />
              </span>
            </div>
            <figcaption className="flex items-center justify-between px-3 pb-1 pt-3 text-sm font-semibold text-snow/75">
              <span>{r.monitorCaption}</span>
              <span className="tabular-nums">HD · 16:9</span>
            </figcaption>
          </figure>

          <ol className="flex flex-col justify-between gap-3 lg:col-span-4">
            {r.process.map((p, i) => {
              const Icon = STEP_ICONS[i];
              return (
                <li
                  key={p}
                  data-reveal="right"
                  style={d(i * 90)}
                  className="group flex flex-1 items-center gap-4 rounded-[1.5rem] bg-snow/90 px-5 py-4 shadow-soft ring-1 ring-ink/5 transition-transform duration-500 ease-out-expo hover:translate-x-2"
                >
                  <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-pacific/10 text-pacific transition-colors duration-500 group-hover:bg-pacific group-hover:text-snow">
                    <Icon className="size-6" />
                  </span>
                  <span className="text-xs font-extrabold tabular-nums text-copper">0{i + 1}</span>
                  <span className="flex-1 text-lg font-bold">{p}</span>
                  {i < r.process.length - 1 && <IconArrow className="size-5 rotate-90 text-ink/25" />}
                </li>
              );
            })}
          </ol>
        </div>

        <div data-reveal className="mt-6 overflow-hidden rounded-[2rem] bg-[#22323F] shadow-lift">
          <div className="flex items-center justify-between px-6 pt-4 text-xs font-extrabold uppercase tracking-[0.2em] text-snow/70">
            <span>{r.timeline}</span>
            <span className="tabular-nums">SEQ_ALEX_2026</span>
          </div>
          <div className="sprockets" />
          <div className="mx-3 overflow-hidden rounded-[1.1rem] bg-snow">
            <TimelineCanvas className="block h-[230px] w-full" />
          </div>
          <div className="sprockets" />
        </div>
        <p className="mt-4 flex items-center gap-2 text-sm font-semibold text-slate">
          <IconSparkle className="size-4 text-copper" />
          {r.timelineNote}
        </p>
      </div>
    </section>
  );
}
