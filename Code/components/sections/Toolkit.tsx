'use client';

import { useState } from 'react';
import { TOOL_GROUPS, type GroupId } from '@/lib/data';
import { useI18n } from '@/lib/i18n';
import { cn, d, monogram } from '@/lib/utils';
import { ToolGlobe } from '@/components/canvas/ToolGlobe';
import { IconCode, IconDesign, IconGlobe, IconGrowth, IconHand, IconLayers, IconMotion, IconToolkit } from '@/components/ui/Icons';
import { SectionHeading } from '@/components/ui/SectionHeading';

const GROUP_ICONS = { design: IconDesign, video: IconMotion, web: IconCode, marketing: IconGrowth, ops: IconLayers };

export function Toolkit() {
  const { t } = useI18n();
  const k = t.toolkit;
  const [active, setActive] = useState<GroupId | null>('design');

  const tools = active
    ? (TOOL_GROUPS.find((g) => g.id === active)?.tools ?? []).map((name) => ({ name, color: TOOL_GROUPS.find((g) => g.id === active)!.color }))
    : TOOL_GROUPS.flatMap((g) => g.tools.map((name) => ({ name, color: g.color })));

  const tabs: { id: GroupId | null; label: string; color: string }[] = [
    { id: null, label: k.all, color: '#1E2B3A' },
    ...TOOL_GROUPS.map((g) => ({ id: g.id, label: k.groups[g.id], color: g.color })),
  ];

  return (
    <section id="toolkit" className="sheet tex-grid">
      <div className="container-x py-28 lg:py-40">
        <div className="grid items-center gap-16 lg:grid-cols-12">
          <div className="order-2 lg:order-1 lg:col-span-6">
            <div data-reveal="scale" className="relative mx-auto aspect-square w-full max-w-[580px]">
              <div aria-hidden className="anim-spin-slower absolute inset-0 rounded-full border-2 border-dashed border-copper/30" />
              <div className="absolute inset-[5%] rounded-full bg-snow/85 shadow-lift ring-1 ring-ink/5" />
              <ToolGlobe
                active={active}
                className="absolute inset-[5%] h-[90%] w-[90%] cursor-grab touch-pan-y rounded-full active:cursor-grabbing"
              />
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

            <ul key={active ?? 'all'} role="tabpanel" className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {tools.map((tool, i) => (
                <li
                  key={tool.name}
                  className="chip-in flex items-center gap-3 rounded-2xl bg-snow p-2.5 pr-4 shadow-soft ring-1 ring-ink/5"
                  style={d(i * 35)}
                >
                  <span
                    className="grid size-11 shrink-0 place-items-center rounded-xl text-sm font-extrabold text-snow"
                    style={{ backgroundColor: tool.color }}
                  >
                    {monogram(tool.name)}
                  </span>
                  <span className="text-[15px] font-bold leading-tight">{tool.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
