'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { CITY_PHOTOS } from '@/lib/data';
import { useI18n } from '@/lib/i18n';
import { cn, d } from '@/lib/utils';
import { TopoCanvas } from '@/components/canvas/TopoCanvas';
import { IconPin, IconRoute } from '@/components/ui/Icons';
import { SectionHeading } from '@/components/ui/SectionHeading';

/** The route line — drawn progressively as you scroll down the coast. */
function CoastLine({ className }: { className?: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const path = useRef<SVGPathElement>(null);
  const [size, setSize] = useState({ w: 48, h: 1000 });

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const r = entry.contentRect;
      setSize({ w: Math.max(1, r.width), h: Math.max(1, r.height) });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const el = wrap.current;
      const p = path.current;
      if (!el || !p) return;
      const r = el.getBoundingClientRect();
      const prog = Math.min(1, Math.max(0, (window.innerHeight * 0.62 - r.top) / r.height));
      p.style.strokeDashoffset = String(1 - prog);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const cx = size.w / 2;
  const amp = Math.min(10, size.w * 0.3);
  let dPath = `M ${cx} 0`;
  for (let y = 16; y <= size.h; y += 16) {
    const x = cx + amp * (0.6 * Math.sin(y * 0.011) + 0.3 * Math.sin(y * 0.029 + 1.3) + 0.1 * Math.sin(y * 0.07));
    dPath += ` L ${x.toFixed(1)} ${y}`;
  }

  return (
    <div ref={wrap} className={className} aria-hidden>
      <svg width={size.w} height={size.h} viewBox={`0 0 ${size.w} ${size.h}`} className="overflow-visible">
        <path d={dPath} fill="none" stroke="rgb(30 43 58 / .18)" strokeWidth="2" strokeDasharray="2 9" strokeLinecap="round" />
        <path
          ref={path}
          d={dPath}
          pathLength={1}
          fill="none"
          stroke="#BC5C33"
          strokeWidth="3.5"
          strokeLinecap="round"
          style={{ strokeDasharray: 1, strokeDashoffset: 1, transition: 'stroke-dashoffset .25s linear' }}
        />
      </svg>
    </div>
  );
}

export function Experience() {
  const { t } = useI18n();
  const x = t.experience;
  return (
    <section id="experience" className="sheet relative overflow-hidden bg-[#F3EFE7]">
      <TopoCanvas className="pointer-events-none absolute inset-0 h-full w-full" />
      <div className="container-x relative py-28 lg:py-40">
        <SectionHeading kicker={x.kicker} title={x.title} intro={x.intro} icon={<IconRoute />} align="center" />

        <div className="relative mt-20 lg:mt-28">
          <CoastLine className="absolute bottom-0 left-6 top-0 w-12 -translate-x-1/2 lg:left-1/2" />

          <ol className="space-y-20 lg:space-y-28">
            {x.roles.map((r, i) => {
              const right = i % 2 === 1;
              return (
                <li key={r.company} className="relative grid lg:grid-cols-2 lg:gap-x-32">
                  {/* Map pin */}
                  <span className="absolute left-6 top-9 z-10 -translate-x-1/2 lg:left-1/2">
                    <span className="relative grid size-9 place-items-center rounded-full bg-copper shadow-lift">
                      <span className="anim-ping absolute inset-0 rounded-full bg-copper/40" />
                      <span className="relative size-3 rounded-full bg-snow" />
                    </span>
                  </span>

                  {/* Note card */}
                  <div className={cn('pl-14 lg:row-start-1 lg:pl-0', right ? 'lg:col-start-2' : 'lg:col-start-1')}>
                    <div data-reveal={right ? 'right' : 'left'} className="drop-lift">
                      <article className="dogear relative rounded-[2rem] bg-snow p-7 sm:p-10">
                        <span
                          aria-hidden
                          className="absolute right-0 top-0 size-12 rounded-bl-[14px] bg-dune"
                          style={{ clipPath: 'polygon(0 0, 0 100%, 100% 100%)' }}
                        />
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm font-extrabold uppercase tracking-[0.16em] text-pacific">
                          <IconPin className="size-5" />
                          {r.city}
                          <span className="font-semibold tracking-[0.08em] text-mist">{r.coords}</span>
                        </div>
                        <span className="mt-5 inline-flex rounded-full bg-sand px-4 py-1.5 text-sm font-bold text-ink/80">
                          {r.period}
                        </span>
                        <h3 className="mt-4 font-display text-[clamp(1.6rem,2.4vw,2.1rem)] font-medium leading-[1.12] tracking-tight">
                          {r.title}
                        </h3>
                        <p className="mt-1 text-lg font-bold text-copper">{r.company}</p>
                        <ul className="mt-6 space-y-3">
                          {r.bullets.map((b) => (
                            <li key={b} className="flex gap-3 text-[1.03rem] leading-relaxed text-slate">
                              <span aria-hidden className="mt-[0.6rem] size-2 shrink-0 rotate-45 rounded-[2px] bg-copper/70" />
                              {b}
                            </li>
                          ))}
                        </ul>
                        <div className="mt-8 flex items-center gap-4 border-t border-dashed border-ink/15 pt-6">
                          <span className="font-display text-5xl font-semibold leading-none text-copper">{r.highlight}</span>
                          <span className="text-sm font-bold uppercase leading-tight tracking-[0.14em] text-slate">
                            {r.highlightLabel}
                          </span>
                        </div>
                      </article>
                    </div>
                  </div>

                  {/* City arch */}
                  <div
                    className={cn(
                      'hidden lg:row-start-1 lg:flex lg:items-start lg:pt-2',
                      right ? 'lg:col-start-1 lg:justify-end' : 'lg:col-start-2 lg:justify-start',
                    )}
                  >
                    <figure data-reveal="scale" style={d(150)} className="relative w-[min(100%,340px)]">
                      <div className="relative aspect-[4/5] overflow-hidden rounded-t-full bg-dune shadow-lift ring-[10px] ring-snow">
                        <Image
                          src={CITY_PHOTOS[i]}
                          alt={r.photoAlt}
                          fill
                          sizes="340px"
                          className="object-cover transition-transform duration-[1.4s] ease-out-expo hover:scale-105"
                        />
                      </div>
                      <figcaption
                        className={cn(
                          'absolute -bottom-7 font-display text-[clamp(3rem,5vw,4.6rem)] font-medium italic leading-none text-ink',
                          right ? '-left-10' : '-right-10',
                        )}
                        style={{ textShadow: '0 2px 0 #F3EFE7, 0 0 22px #F3EFE7' }}
                      >
                        {r.city}
                      </figcaption>
                    </figure>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
