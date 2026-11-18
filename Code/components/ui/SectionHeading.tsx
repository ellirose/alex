import type { ReactNode } from 'react';
import { cn, d } from '@/lib/utils';

export function SectionHeading({
  kicker,
  title,
  intro,
  icon,
  align = 'left',
  className,
}: {
  kicker: string;
  title: string;
  intro?: string;
  icon: ReactNode;
  align?: 'left' | 'center';
  className?: string;
}) {
  const center = align === 'center';
  return (
    <div className={cn(center && 'mx-auto max-w-3xl text-center', className)}>
      <div
        data-reveal
        className={cn(
          'flex items-center gap-3 text-sm font-bold uppercase tracking-[0.22em] text-copper',
          center && 'justify-center',
        )}
      >
        <span className="grid size-11 place-items-center rounded-full bg-snow text-copper shadow-soft [&>svg]:size-5">
          {icon}
        </span>
        {kicker}
      </div>
      <h2
        data-reveal
        style={d(90)}
        className="mt-6 font-display text-[clamp(2.5rem,5vw,4.6rem)] font-medium leading-[1.02] tracking-[-0.025em] text-balance text-ink"
      >
        {title}
      </h2>
      {intro && (
        <p
          data-reveal
          style={d(170)}
          className={cn('mt-6 max-w-2xl text-xl leading-relaxed text-pretty text-slate', center && 'mx-auto')}
        >
          {intro}
        </p>
      )}
    </div>
  );
}
