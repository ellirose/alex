'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useI18n } from '@/lib/i18n';
import { CATEGORIES, galleryFor, type Category, type GalleryItem } from '@/lib/gallery';
import { cn, d } from '@/lib/utils';
import { Tilt } from '@/components/motion/Tilt';
import { IconArrow, IconChevron, IconDesign, IconSparkle } from '@/components/ui/Icons';
import { SectionHeading } from '@/components/ui/SectionHeading';

/** Pieces shown before "Show all" is pressed. */
const PREVIEW_COUNT = 12;

const FILTER_COLORS: Record<Category | 'all', string> = {
  all: '#1E2B3A',
  branding: '#BC5C33',
  logos: '#C99016',
  posters: '#D9705C',
  web: '#2A7C8E',
  mobile: '#5B7FA6',
  fashion: '#A0526E',
  sportswear: '#3F7F63',
  uniforms: '#4A5868',
};

const pad = (n: number) => String(n).padStart(2, '0');

function Frame({ item, children }: { item: GalleryItem; children: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden rounded-[1.4rem] bg-sand" style={{ aspectRatio: `${item.w} / ${item.h}` }}>
      {children}
    </div>
  );
}

function Lightbox({
  index,
  items,
  onClose,
  onNav,
}: {
  index: number;
  items: GalleryItem[];
  onClose: () => void;
  onNav: (dir: 1 | -1) => void;
}) {
  const { t } = useI18n();
  const c = t.concepts;
  const closeRef = useRef<HTMLButtonElement>(null);
  const item = items[index];

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNav(1);
      if (e.key === 'ArrowLeft') onNav(-1);
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
    };
  }, [onClose, onNav]);

  if (!item) return null;
  const title = `${c.filters[item.category]} ${pad(item.index + 1)}`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      className="fixed inset-0 z-[90] grid place-items-center overflow-y-auto bg-ink/55 p-4 backdrop-blur-md"
    >
      <div key={item.src} className="chip-in relative grid w-full max-w-5xl overflow-hidden rounded-[2rem] bg-snow shadow-lift md:grid-cols-[1.45fr_1fr]">
        <div className="tex-paper flex items-center justify-center p-4 sm:p-6">
          <div className="relative h-[min(70vh,40rem)] w-full">
            <Image
              src={item.src}
              alt={title}
              fill
              sizes="(min-width: 768px) 560px, 92vw"
              className="rounded-[1.4rem] object-contain"
            />
          </div>
        </div>
        <div className="flex flex-col p-7 sm:p-9">
          <span
            className="w-fit rounded-full px-3 py-1 text-xs font-extrabold uppercase tracking-[0.16em] text-snow"
            style={{ backgroundColor: FILTER_COLORS[item.category] }}
          >
            {c.filters[item.category]}
          </span>
          <h3 className="mt-5 font-display text-[2.2rem] font-medium leading-[1.05] tracking-tight">{title}</h3>
          <p className="mt-4 text-lg leading-relaxed text-slate">{c.items[item.category]}</p>
          <p className="mt-6 flex items-center gap-2 text-sm font-bold text-copper">
            <IconSparkle className="size-4" />
            {c.label}
          </p>
          <div className="mt-auto flex items-center justify-between gap-3 pt-10">
            <span className="text-sm font-bold tabular-nums text-mist">
              {pad(index + 1)} / {pad(items.length)}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                aria-label={c.prev}
                onClick={() => onNav(-1)}
                className="grid size-12 place-items-center rounded-full bg-sand transition-colors hover:bg-dune"
              >
                <IconChevron className="size-5 rotate-90" />
              </button>
              <button
                type="button"
                aria-label={c.next}
                onClick={() => onNav(1)}
                className="grid size-12 place-items-center rounded-full bg-ink text-snow transition-transform hover:-translate-y-0.5"
              >
                <IconChevron className="size-5 -rotate-90" />
              </button>
            </div>
          </div>
        </div>
        <button
          ref={closeRef}
          type="button"
          aria-label={c.close}
          onClick={onClose}
          className="absolute right-4 top-4 grid size-11 place-items-center rounded-full bg-snow/90 text-ink shadow-soft backdrop-blur transition-transform hover:rotate-90"
        >
          <span className="burger" data-open="">
            <span />
            <span />
          </span>
        </button>
      </div>
    </div>
  );
}

export function Concepts() {
  const { t } = useI18n();
  const c = t.concepts;
  const [filter, setFilter] = useState<Category | 'all'>('all');
  const [open, setOpen] = useState<number | null>(null);
  const [expanded, setExpanded] = useState(false);

  const items = galleryFor(filter);
  const shown = expanded ? items : items.slice(0, PREVIEW_COUNT);
  const filters: (Category | 'all')[] = ['all', ...CATEGORIES];

  return (
    <section id="concepts" className="sheet tex-paper">
      <div className="container-x py-28 lg:py-40">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <SectionHeading kicker={c.kicker} title={c.title} icon={<IconDesign />} className="lg:col-span-7" />
          <p data-reveal style={d(200)} className="text-xl leading-relaxed text-slate text-pretty lg:col-span-5 lg:pb-3">
            {c.intro}
          </p>
        </div>

        <div
          role="tablist"
          aria-label={c.kicker}
          data-reveal
          style={d(240)}
          className="mt-12 flex w-fit max-w-full flex-wrap gap-1.5 rounded-[1.75rem] bg-snow/85 p-2 shadow-soft ring-1 ring-ink/5"
        >
          {filters.map((f) => {
            const sel = f === filter;
            return (
              <button
                key={f}
                type="button"
                role="tab"
                aria-selected={sel}
                onClick={() => {
                  setFilter(f);
                  setExpanded(false);
                }}
                className={cn(
                  'rounded-full px-5 py-2.5 text-[15px] font-bold transition-all duration-500 ease-out-expo',
                  sel ? 'text-snow shadow-soft' : 'text-ink/75 hover:bg-sand',
                )}
                style={sel ? { backgroundColor: FILTER_COLORS[f] } : undefined}
              >
                {f === 'all' ? c.all : c.filters[f]}
              </button>
            );
          })}
        </div>

        <ul key={filter} className="mt-12 columns-1 gap-7 sm:columns-2 lg:columns-3 [&>li]:mb-7 [&>li]:break-inside-avoid">
          {shown.map((item, i) => {
            const title = `${c.filters[item.category]} ${pad(item.index + 1)}`;
            return (
              <li key={item.src} className="chip-in" style={d(Math.min(i, PREVIEW_COUNT) * 70)}>
                <button type="button" onClick={() => setOpen(i)} aria-label={`${c.open}: ${title}`} className="group block w-full text-left">
                  <Tilt max={5} className="drop-soft">
                    <figure className="rounded-[2rem] bg-snow p-3 transition-transform duration-700 ease-out-expo group-hover:-translate-y-1">
                      <Frame item={item}>
                        <div className="absolute inset-0 transition-transform duration-[1.2s] ease-out-expo group-hover:scale-[1.04]">
                          <Image
                            src={item.src}
                            alt={title}
                            fill
                            sizes="(min-width: 1024px) 380px, (min-width: 640px) 46vw, 92vw"
                            className="object-cover"
                          />
                        </div>
                        <span className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-snow/92 px-3 py-1 text-xs font-extrabold text-ink shadow-soft backdrop-blur">
                          <IconSparkle className="size-3.5 text-copper" />
                          {c.label}
                        </span>
                      </Frame>
                      <figcaption className="px-3 pb-3 pt-5">
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-xs font-extrabold uppercase tracking-[0.18em]" style={{ color: FILTER_COLORS[item.category] }}>
                            {c.filters[item.category]}
                          </span>
                          <span className="grid size-9 place-items-center rounded-full bg-ink text-snow transition-transform duration-500 ease-out-expo group-hover:-rotate-45">
                            <IconArrow className="size-4" />
                          </span>
                        </div>
                        <h3 className="mt-2 font-display text-[1.6rem] font-medium leading-tight tracking-tight">{title}</h3>
                        <p className="mt-2 line-clamp-2 text-[15px] leading-relaxed text-slate">{c.items[item.category]}</p>
                      </figcaption>
                    </figure>
                  </Tilt>
                </button>
              </li>
            );
          })}
        </ul>

        {!expanded && items.length > PREVIEW_COUNT && (
          <div className="mt-4 flex justify-center">
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="group inline-flex items-center gap-4 rounded-full bg-ink py-2 pl-7 pr-2 text-lg font-semibold text-snow shadow-lift transition-transform duration-500 ease-out-expo hover:-translate-y-1"
            >
              {c.more} ({items.length})
              <span className="grid size-12 place-items-center rounded-full bg-copper transition-transform duration-500 ease-out-expo group-hover:rotate-90">
                <IconArrow className="size-5 rotate-90" />
              </span>
            </button>
          </div>
        )}
      </div>

      {open !== null && (
        <Lightbox
          index={open}
          items={items}
          onClose={() => setOpen(null)}
          onNav={(dir) => setOpen((o) => (o === null ? o : (o + dir + items.length) % items.length))}
        />
      )}
    </section>
  );
}
