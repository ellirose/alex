'use client';

import { useI18n } from '@/lib/i18n';
import { mulberry32 } from '@/lib/random';
import { cn, d } from '@/lib/utils';
import { ProjectCover, type CoverVariant } from '@/components/canvas/ProjectCover';
import { Tilt } from '@/components/motion/Tilt';
import { IconGrid } from '@/components/ui/Icons';
import { SectionHeading } from '@/components/ui/SectionHeading';

/**
 * Each case study opens on generative cover art. To show real project imagery,
 * render an <Image> inside the cover frame instead of <ProjectCover>.
 */
const COVERS: CoverVariant[] = ['valpo', 'pipeline', 'series'];
const OFFSETS = ['', 'lg:mt-24', 'lg:mt-10'];

function Barcode({ seed }: { seed: number }) {
  const rand = mulberry32(seed * 97 + 13);
  const bars = Array.from({ length: 26 }, () => 1 + Math.floor(rand() * 3));
  return (
    <span aria-hidden className="flex h-12 items-stretch gap-[2px] opacity-70">
      {bars.map((w, i) => (
        <span key={i} className="bg-ink" style={{ width: w }} />
      ))}
    </span>
  );
}

export function Work() {
  const { t } = useI18n();
  const w = t.work;
  return (
    <section id="work" className="sheet tex-wood">
      <div className="container-x py-28 lg:py-40">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <SectionHeading kicker={w.kicker} title={w.title} icon={<IconGrid />} className="lg:col-span-7" />
          <p data-reveal style={d(200)} className="text-xl leading-relaxed text-ink/75 text-pretty lg:col-span-5 lg:pb-3">
            {w.intro}
          </p>
        </div>

        <div className="mt-16 grid gap-10 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {w.projects.map((p, i) => (
            <div key={p.title} data-reveal style={d(i * 140)} className={cn(OFFSETS[i], i === 2 && 'md:col-span-2 lg:col-span-1')}>
              <Tilt max={6} className="drop-lift">
                <article>
                  <div className="ticket-top relative rounded-t-[2rem] bg-snow p-3 pb-7">
                    <div className="relative aspect-[5/4] overflow-hidden rounded-[1.5rem] bg-sand">
                      <ProjectCover variant={COVERS[i]} className="absolute inset-0 h-full w-full" />
                      <span className="absolute left-4 top-4 rounded-full bg-snow/92 px-3.5 py-1.5 text-sm font-extrabold shadow-soft backdrop-blur">
                        {w.caseLabel} 0{i + 1}
                      </span>
                      <span className="absolute right-4 top-4 rounded-full bg-ink px-3.5 py-1.5 text-sm font-extrabold text-snow">
                        {p.year}
                      </span>
                    </div>
                    <h3 className="mt-7 px-3 font-display text-[1.9rem] font-medium leading-[1.1] tracking-tight">
                      {p.title}
                    </h3>
                    <p className="mt-3 px-3 text-[1.05rem] leading-relaxed text-slate">{p.body}</p>
                  </div>
                  <div className="ticket-bottom relative rounded-b-[2rem] bg-snow px-6 pb-7 pt-7">
                    <span aria-hidden className="absolute inset-x-7 top-0 border-t-2 border-dashed border-ink/15" />
                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <span className="block font-display text-[3.4rem] font-semibold leading-none text-copper">
                          {p.metric}
                        </span>
                        <span className="mt-2 block max-w-[14rem] text-sm font-bold leading-snug text-slate">
                          {p.metricLabel}
                        </span>
                      </div>
                      <Barcode seed={i} />
                    </div>
                    <ul className="mt-6 flex flex-wrap gap-2">
                      {p.tags.map((tag) => (
                        <li key={tag} className="rounded-full bg-sand px-3 py-1 text-sm font-bold text-ink/80">
                          {tag}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              </Tilt>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
