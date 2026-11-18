'use client';

import { CERTIFICATIONS } from '@/lib/dictionaries';
import { useI18n } from '@/lib/i18n';
import { cn, d } from '@/lib/utils';
import { Flag } from '@/components/ui/Flag';
import { IconAperture, IconAward, IconCap, IconChart, IconMagnet } from '@/components/ui/Icons';
import { SectionHeading } from '@/components/ui/SectionHeading';
import type { Country } from '@/lib/locales';
import type { CSSProperties } from 'react';

const STAMPS = [
  { Icon: IconChart, tint: 'bg-pacific-soft', ink: 'text-pacific', rot: '-rotate-2' },
  { Icon: IconMagnet, tint: 'bg-coral-soft', ink: 'text-coral', rot: 'rotate-2' },
  { Icon: IconAperture, tint: 'bg-sun-soft', ink: 'text-[#B07D12]', rot: '-rotate-1' },
];

function Seal() {
  const pts = Array.from({ length: 48 }, (_, i) => {
    const a = (i / 48) * Math.PI * 2;
    const r = i % 2 ? 46 : 50;
    return `${(50 + Math.cos(a) * r).toFixed(2)},${(50 + Math.sin(a) * r).toFixed(2)}`;
  }).join(' ');
  return (
    <span className="relative grid size-28 place-items-center">
      <svg viewBox="0 0 100 100" className="absolute inset-0 size-full drop-shadow-[0_10px_14px_rgb(188_92_51/0.35)]" aria-hidden>
        <polygon points={pts} fill="#BC5C33" />
        <circle cx="50" cy="50" r="38" fill="none" stroke="rgb(255 253 248 / .45)" strokeWidth="1.5" strokeDasharray="3 3" />
      </svg>
      <IconCap className="relative size-12 text-snow" />
    </span>
  );
}

export function Credentials() {
  const { t } = useI18n();
  const c = t.credentials;
  return (
    <section id="credentials" className="sheet tex-linen">
      <div className="container-x py-28 lg:py-40">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <SectionHeading kicker={c.kicker} title={c.title} icon={<IconAward />} />

            {/* Diploma */}
            <div data-reveal style={d(150)} className="relative mt-14">
              <div className="relative rounded-[2rem] bg-snow p-9 pr-24 shadow-lift sm:p-10 sm:pr-28">
                <span aria-hidden className="pointer-events-none absolute inset-3 rounded-[1.5rem] border border-copper/25" />
                <p className="text-sm font-extrabold uppercase tracking-[0.22em] text-copper">{c.educationLabel}</p>
                <h3 className="mt-4 font-display text-[2rem] font-medium leading-[1.1] tracking-tight">{c.degree}</h3>
                <p className="mt-3 text-lg font-bold text-ink">{c.school}</p>
                <p className="mt-1 text-base text-slate">{c.place} · 2016</p>
              </div>
              <div className="absolute -right-1 -top-10 rotate-12 sm:-right-3">
                <Seal />
              </div>
            </div>

            {/* Languages as luggage tags */}
            <h3 data-reveal className="mt-16 text-sm font-extrabold uppercase tracking-[0.22em] text-slate">
              {c.languagesLabel}
            </h3>
            <ul className="mt-6 space-y-4">
              {c.languages.map((l, i) => (
                <li key={l.name} data-reveal="left" style={d(i * 110)} className="drop-soft">
                  <div className="tag-shape relative flex items-center gap-4 rounded-r-[1.25rem] bg-snow py-4 pl-12 pr-6">
                    <span aria-hidden className="absolute left-[1.15rem] top-1/2 size-3.5 -translate-y-1/2 rounded-full bg-[#EDE4D4] ring-2 ring-dune" />
                    <Flag country={l.country as Country} className="size-11" />
                    <span className="min-w-0 flex-1">
                      <span className="block font-display text-xl font-medium leading-tight">{l.name}</span>
                      <span className="block text-sm font-semibold text-slate">{l.level}</span>
                    </span>
                    <span className="relative h-2.5 w-20 overflow-hidden rounded-full bg-sand sm:w-28" aria-hidden>
                      <span
                        className="meter-fill absolute inset-0 rounded-full bg-copper"
                        style={{ '--v': l.value / 100 } as CSSProperties}
                      />
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Certifications as postage stamps */}
          <div className="lg:col-span-7 lg:pt-36">
            <h3 data-reveal className="text-sm font-extrabold uppercase tracking-[0.22em] text-slate">{c.certsLabel}</h3>
            <ul className="mt-8 grid gap-10 sm:grid-cols-2">
              {CERTIFICATIONS.map((cert, i) => {
                const s = STAMPS[i];
                return (
                  <li
                    key={cert.title}
                    data-reveal="scale"
                    style={d(i * 130)}
                    className={cn('relative', i === 2 && 'sm:col-span-2 sm:mx-auto sm:w-[calc(50%+8rem)]')}
                  >
                    <div className={cn('drop-lift transition-transform duration-700 ease-out-expo hover:rotate-0 hover:-translate-y-2', s.rot)}>
                      <div className="stamp bg-snow">
                        <div className={cn('relative flex h-full min-h-[15rem] flex-col rounded-md p-7', s.tint)}>
                          <span className="grid size-16 place-items-center rounded-2xl bg-snow/80 shadow-soft">
                            <s.Icon className={cn('size-8', s.ink)} />
                          </span>
                          <p className="mt-6 font-display text-[1.45rem] font-medium leading-[1.2] tracking-tight text-ink">
                            {cert.title}
                          </p>
                          <p className="mt-auto pt-4 text-sm font-extrabold uppercase tracking-[0.16em] text-ink/65">
                            {cert.issuer}
                          </p>
                        </div>
                      </div>
                    </div>
                    <span className="absolute -right-3 -top-5 grid size-[4.5rem] rotate-12 place-items-center rounded-full border-2 border-dashed border-ink/35 bg-snow/70 font-display text-xl font-semibold text-ink backdrop-blur">
                      {cert.year}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
