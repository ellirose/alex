'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { TOOL_GROUPS, type GroupId } from '@/lib/data';
import { useI18n } from '@/lib/i18n';
import { cn, d } from '@/lib/utils';
import { ToolSand } from '@/components/canvas/ToolSand';
import { IconCode, IconDesign, IconGlobe, IconGrowth, IconHand, IconLayers, IconMotion, IconToolkit } from '@/components/ui/Icons';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ToolIcon } from '@/components/ui/ToolIcon';

const GROUP_ICONS = { design: IconDesign, video: IconMotion, web: IconCode, marketing: IconGrowth, ops: IconLayers };
const ALL_COLOR = '#1E2B3A';

/**
 * Grainy "sand" dissolve for the tool cards: a displacement filter driven by fine noise
 * starts strong (pixels scattered like sand) and eases to zero as the cards settle.
 * Runs the first time the list scrolls into view and on every filter change.
 */
function useSandDissolve(trigger: unknown) {
  const target = useRef<HTMLUListElement>(null);
  const map = useRef<SVGFEDisplacementMapElement>(null);
  const seen = useRef(false);
  const id = `sand-${useId().replace(/:/g, '')}`;

  useEffect(() => {
    const el = target.current;
    const disp = map.current;
    if (!el || !disp || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    const run = () => {
      const start = performance.now();
      el.style.filter = `url(#${id})`;
      const tick = (now: number) => {
        const p = Math.min(1, (now - start) / 1100);
        disp.setAttribute('scale', String(80 * Math.pow(1 - p, 3)));
        if (p < 1) raf = requestAnimationFrame(tick);
        else el.style.filter = '';
      };
      raf = requestAnimationFrame(tick);
    };
    if (seen.current) {
      run();
      return () => cancelAnimationFrame(raf);
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        seen.current = true;
        run();
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [trigger, id]);

  const filter = (
    <svg aria-hidden width="0" height="0" className="absolute">
      <filter id={id} x="-25%" y="-25%" width="150%" height="150%" colorInterpolationFilters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" result="grain" />
        <feDisplacementMap ref={map} in="SourceGraphic" in2="grain" scale="0" xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </svg>
  );
  return { target, filter };
}

export function Toolkit() {
  const { t } = useI18n();
  const k = t.toolkit;
  const [active, setActive] = useState<GroupId | null>('design');
  const sand = useSandDissolve(active);

  const tools = active
    ? (TOOL_GROUPS.find((g) => g.id === active)?.tools ?? [])
    : TOOL_GROUPS.flatMap((g) => g.tools);
  const accent = active ? TOOL_GROUPS.find((g) => g.id === active)!.color : ALL_COLOR;
  const CenterIcon = active ? GROUP_ICONS[active] : IconGlobe;

  const tabs: { id: GroupId | null; label: string; color: string }[] = [
    { id: null, label: k.all, color: ALL_COLOR },
    ...TOOL_GROUPS.map((g) => ({ id: g.id, label: k.groups[g.id], color: g.color })),
  ];

  return (
    <section id="toolkit" className="sheet tex-grid">
      <div className="container-x py-28 lg:py-40">
        <div className="grid items-center gap-16 lg:grid-cols-12">
          <div className="order-2 lg:sticky lg:top-28 lg:order-1 lg:col-span-6 lg:self-start">
            <div data-reveal="scale" className="relative mx-auto aspect-square w-full max-w-[580px]">
              <div aria-hidden className="anim-spin-slower absolute inset-0 rounded-full border-2 border-dashed border-copper/30" />
              {/* The sand plate itself is painted on the canvas; this ring gives it a lifted rim and shadow. */}
              <div aria-hidden className="absolute inset-[5%] rounded-full shadow-lift ring-[10px] ring-snow/90" />
              <ToolSand
                active={active}
                accent={accent}
                className="absolute inset-0 h-full w-full cursor-grab touch-pan-y active:cursor-grabbing"
              />

              {/* Centre medallion: the active discipline and how many tools it holds. */}
              <div className="pointer-events-none absolute left-1/2 top-1/2 size-[19%] -translate-x-1/2 -translate-y-1/2">
                <div
                  key={active ?? 'all'}
                  className="chip-in grid size-full place-items-center rounded-full bg-snow/90 shadow-soft ring-1 ring-ink/5 backdrop-blur"
                >
                  <span className="flex flex-col items-center gap-0.5">
                    <CenterIcon className="size-[min(2.6rem,9vw)]" style={{ color: accent }} />
                    <span className="text-[11px] font-extrabold tabular-nums tracking-[0.12em] text-slate">
                      {String(tools.length).padStart(2, '0')}
                    </span>
                  </span>
                </div>
              </div>

              <span className="pointer-events-none absolute bottom-[3%] left-1/2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-ink px-4 py-2 text-sm font-bold text-snow shadow-soft">
                <IconHand className="size-4" />
                {k.hint}
              </span>
            </div>
          </div>

          <div className="order-1 lg:order-2 lg:col-span-6">
            <SectionHeading kicker={k.kicker} title={k.title} intro={k.body} icon={<IconToolkit />} />

            <div
              role="tablist"
              aria-label={k.kicker}
              data-reveal
              style={d(220)}
              className="mt-10 flex flex-wrap gap-1.5 rounded-[1.75rem] bg-snow/85 p-2 shadow-soft ring-1 ring-ink/5"
            >
              {tabs.map((tab) => {
                const sel = tab.id === active;
                const Icon = tab.id ? GROUP_ICONS[tab.id] : IconGlobe;
                return (
                  <button
                    key={tab.id ?? 'all'}
                    type="button"
                    role="tab"
                    aria-selected={sel}
                    onClick={() => setActive(tab.id)}
                    className={cn(
                      'flex items-center gap-2 rounded-full px-4 py-2.5 text-[15px] font-bold transition-all duration-500 ease-out-expo',
                      sel ? 'text-snow shadow-soft' : 'text-ink/75 hover:bg-sand',
                    )}
                    style={sel ? { backgroundColor: tab.color } : undefined}
                  >
                    <Icon className="size-5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {sand.filter}
            <ul ref={sand.target} key={active ?? 'all'} role="tabpanel" className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {tools.map((name, i) => (
                <li
                  key={name}
                  className="chip-in flex items-center gap-3 rounded-2xl bg-snow p-2.5 pr-4 shadow-soft ring-1 ring-ink/5"
                  style={d(i * 35)}
                >
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-paper ring-1 ring-ink/5">
                    <ToolIcon name={name} className="size-6" />
                  </span>
                  <span className="text-[15px] font-bold leading-tight">{name}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
