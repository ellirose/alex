'use client';

import Image from 'next/image';
import { useId } from 'react';
import { useI18n } from '@/lib/i18n';
import { cn, d } from '@/lib/utils';
import { Counter } from '@/components/motion/Counter';
import { Flag } from '@/components/ui/Flag';
import { IconCompass, IconPin } from '@/components/ui/Icons';
import { SectionHeading } from '@/components/ui/SectionHeading';

function Postmark() {
  const id = useId().replace(/:/g, '');
  return (
    <svg viewBox="0 0 120 120" className="size-full text-ink/45" aria-hidden>
      <defs>
        <path id={id} d="M60,60 m-41,0 a41,41 0 1,1 82,0 a41,41 0 1,1 -82,0" />
      </defs>
      <circle cx="60" cy="60" r="52" fill="none" stroke="currentColor" strokeWidth="2.2" />
      <circle cx="60" cy="60" r="32" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <text style={{ fontSize: 11, fontWeight: 800, letterSpacing: '.2em' }} fill="currentColor">
        <textPath href={`#${id}`} textLength="250" lengthAdjust="spacing">
          SANTIAGO • CHILE • CORREOS •
        </textPath>
      </text>
      <text x="60" y="66" textAnchor="middle" style={{ fontSize: 17, fontWeight: 800 }} fill="currentColor">
        2026
      </text>
    </svg>
  );
}

function PostcardStack({ caption, altWindow, altDesk }: { caption: string; altWindow: string; altDesk: string }) {
  return (
    <div data-reveal="scale" className="group relative mx-auto aspect-[4/5] w-[82%] max-w-[420px] sm:w-full">
      <figure className="absolute inset-0 -translate-x-[7%] -rotate-[7deg] rounded-[1.4rem] bg-snow p-3 pb-16 shadow-lift transition-all duration-[900ms] ease-out-expo group-hover:-translate-x-[13%] group-hover:-rotate-[11deg]">
        <div className="relative h-full overflow-hidden rounded-[0.9rem]">
          <Image
            src="/images/alex-window.png"
            alt={altWindow}
            fill
            sizes="(min-width: 1024px) 30vw, 80vw"
            className="object-cover object-[50%_42%]"
          />
        </div>
        <figcaption className="absolute bottom-4 left-5 font-display text-xl italic text-slate">{caption}</figcaption>
      </figure>

      <figure className="absolute inset-0 translate-x-[9%] translate-y-[7%] rotate-[4deg] rounded-[1.4rem] bg-snow p-3 pb-16 shadow-lift transition-all duration-[900ms] ease-out-expo group-hover:translate-x-[15%] group-hover:translate-y-[4%] group-hover:rotate-[7deg]">
        <div className="relative h-full overflow-hidden rounded-[0.9rem]">
          <Image
            src="/images/alex-desk.png"
            alt={altDesk}
            fill
            sizes="(min-width: 1024px) 30vw, 80vw"
            className="object-cover object-[50%_36%]"
          />
        </div>
        <figcaption className="absolute bottom-5 left-5 flex items-center gap-2 text-sm font-extrabold uppercase tracking-[0.2em] text-copper">
          <IconPin className="size-5" />
          33.45° S
        </figcaption>

        <div className="drop-soft absolute -right-2 -top-6 rotate-[8deg] sm:-right-5">
          <div className="stamp stamp-sm w-[86px] bg-snow">
            <div className="flex aspect-[4/5] flex-col items-center justify-center gap-1.5 bg-pacific-soft">
              <Flag country="cl" className="size-10" />
              <span className="text-[10px] font-extrabold tracking-[0.24em] text-ink">CHILE</span>
            </div>
          </div>
        </div>
        <div className="absolute right-12 top-10 size-24 -rotate-12 opacity-90 mix-blend-multiply">
          <Postmark />
        </div>
      </figure>
    </div>
  );
}

const PATCHES = [
  { bg: 'bg-copper-soft', ring: 'border-copper/45' },
  { bg: 'bg-pacific-soft', ring: 'border-pacific/45' },
  { bg: 'bg-sun-soft', ring: 'border-sun' },
];

export function About() {
  const { t } = useI18n();
  const a = t.about;
  return (
    <section id="about" className="sheet tex-linen">
      <div className="container-x py-28 lg:py-40">
        <div className="grid items-center gap-20 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <PostcardStack caption={a.caption} altWindow={a.altWindow} altDesk={a.altDesk} />
          </div>

          <div className="lg:col-span-7 lg:pl-6">
            <SectionHeading kicker={a.kicker} title={a.title} icon={<IconCompass />} />
            <p data-reveal style={d(160)} className="mt-8 text-xl leading-relaxed text-ink/85 text-pretty sm:text-[1.4rem]">
              {a.body}
            </p>
            <p data-reveal style={d(220)} className="mt-5 text-lg leading-relaxed text-slate text-pretty">
              {a.body2}
            </p>

            <h3
              data-reveal
              className="mt-14 flex items-center gap-4 text-sm font-extrabold uppercase tracking-[0.22em] text-slate"
            >
              {a.impactTitle}
              <span className="h-px flex-1 border-t border-dashed border-ink/20" />
            </h3>
            <ul className="mt-8 grid grid-cols-3 gap-4 sm:gap-8">
              {a.impact.map((m, i) => (
                <li key={m.label} data-reveal="scale" style={d(i * 120)} className="group text-center">
                  <div
                    className={cn(
                      'relative mx-auto grid aspect-square w-full max-w-[190px] place-items-center rounded-full shadow-soft transition-transform duration-700 ease-out-expo group-hover:-rotate-6 group-hover:scale-[1.04]',
                      PATCHES[i].bg,
                    )}
                  >
                    <span aria-hidden className={cn('absolute inset-[7px] rounded-full border-2 border-dashed', PATCHES[i].ring)} />
                    <Counter
                      value={m.value}
                      prefix={m.prefix}
                      suffix={m.suffix}
                      className="relative font-display text-[clamp(1.7rem,4.2vw,3.4rem)] font-semibold leading-none tracking-tight text-ink"
                    />
                  </div>
                  <p className="mx-auto mt-4 max-w-[12rem] text-sm font-bold leading-snug text-ink/75 sm:text-[15px]">
                    {m.label}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
