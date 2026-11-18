'use client';

import { useI18n } from '@/lib/i18n';
import { cn, d } from '@/lib/utils';
import { Tilt } from '@/components/motion/Tilt';
import { IconCode, IconDesign, IconGrowth, IconMotion, IconSparkle } from '@/components/ui/Icons';
import { SectionHeading } from '@/components/ui/SectionHeading';

const CARDS = [
  { Icon: IconDesign, medal: 'bg-copper', text: 'text-copper', tag: 'bg-copper-soft/60' },
  { Icon: IconMotion, medal: 'bg-pacific', text: 'text-pacific', tag: 'bg-pacific-soft/70' },
  { Icon: IconGrowth, medal: 'bg-sun', text: 'text-[#B07D12]', tag: 'bg-sun-soft/70' },
  { Icon: IconCode, medal: 'bg-coral', text: 'text-coral', tag: 'bg-coral-soft/70' },
];

export function Expertise() {
  const { t } = useI18n();
  const e = t.expertise;
  return (
    <section id="expertise" className="sheet tex-paper">
      <div className="container-x py-28 lg:py-40">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <SectionHeading kicker={e.kicker} title={e.title} icon={<IconSparkle />} className="lg:col-span-7" />
          <p data-reveal style={d(200)} className="text-xl leading-relaxed text-slate text-pretty lg:col-span-5 lg:pb-3">
            {e.intro}
          </p>
        </div>

        <div className="mt-20 grid gap-x-6 gap-y-14 sm:grid-cols-2 xl:grid-cols-4">
          {e.items.map((item, i) => {
            const c = CARDS[i];
            return (
              <div key={item.title} data-reveal style={d(i * 110)} className={cn(i % 2 === 1 && 'xl:mt-12')}>
                <Tilt max={7} className="relative h-full pt-[3.25rem]">
                  <div className="drop-soft h-full">
                    <article className="scoop relative flex h-full min-h-[25rem] flex-col rounded-[2.25rem] bg-snow px-7 pb-8 pt-20">
                      <span className="absolute right-7 top-6 font-display text-2xl italic text-mist">0{i + 1}</span>
                      <h3 className="font-display text-[1.75rem] font-medium leading-[1.12] tracking-tight text-ink">
                        {item.title}
                      </h3>
                      <p className="mt-4 text-[1.05rem] leading-relaxed text-slate">{item.body}</p>
                      <ul className="mt-6 flex flex-wrap gap-2">
                        {item.tags.map((tag) => (
                          <li key={tag} className={cn('rounded-full px-3 py-1 text-sm font-bold text-ink/80', c.tag)}>
                            {tag}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-auto flex items-baseline gap-3 border-t border-dashed border-ink/15 pt-6">
                        <span className={cn('font-display text-4xl font-semibold leading-none', c.text)}>{item.stat}</span>
                        <span className="text-sm font-bold uppercase leading-tight tracking-[0.12em] text-slate">
                          {item.statLabel}
                        </span>
                      </div>
                    </article>
                  </div>
                  <span
                    className={cn(
                      'depth-1 absolute left-8 top-0 grid size-[6.5rem] place-items-center rounded-full text-snow shadow-lift',
                      c.medal,
                    )}
                  >
                    <span aria-hidden className="absolute inset-2 rounded-full border border-dashed border-white/50" />
                    <c.Icon className="relative size-[3.25rem]" />
                  </span>
                </Tilt>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
