import { cn } from '@/lib/utils';

/**
 * The mark: two Andean peaks — copper and Pacific teal — that read as an "A",
 * with snow caps and a Valparaíso-yellow sun.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <circle cx="35.5" cy="12" r="5" fill="#E9B23C" />
      <path d="M18 41 30 19l12.5 22Z" fill="#2A7C8E" />
      <path d="M4 41 19 11.5 34 41Z" fill="#BC5C33" />
      <path d="M19 11.5 23 19.4 20.8 18.2 19 19.9 17.1 18.2 14.9 19.4Z" fill="#FFFDF8" />
      <path d="M30 19 33.3 25 31.6 24.1 30 25.5 28.6 24.2 27.1 24.8Z" fill="#FFFDF8" opacity=".9" />
      <path d="M15.3 41 19 33.6l3.7 7.4Z" fill="#FFFDF8" />
    </svg>
  );
}

export function Logo({ tagline, className, size = 'md' }: { tagline: string; className?: string; size?: 'md' | 'xl' }) {
  const xl = size === 'xl';
  return (
    <span className={cn('flex items-center', xl ? 'gap-5' : 'gap-3', className)}>
      <span
        className={cn(
          'grid shrink-0 place-items-center rounded-full bg-paper shadow-[inset_0_0_0_1px_rgb(30_43_58/0.07),0_6px_14px_-8px_rgb(30_43_58/0.35)]',
          xl ? 'size-24' : 'size-10 sm:size-12',
        )}
      >
        <LogoMark className={xl ? 'size-16' : 'size-7 sm:size-9'} />
      </span>
      <span className="leading-none">
        <span
          className={cn(
            'block font-display font-semibold tracking-[-0.02em] text-ink',
            xl ? 'text-[clamp(2.6rem,6vw,4.5rem)]' : 'text-[1.15rem] sm:text-[1.35rem]',
          )}
        >
          Alex Buntrock
        </span>
        <span
          className={cn(
            'block font-bold uppercase text-copper',
            xl ? 'mt-3 text-sm tracking-[0.32em]' : 'mt-1 text-[9px] tracking-[0.2em] sm:text-[10px] sm:tracking-[0.28em]',
          )}
        >
          {tagline}
        </span>
      </span>
    </span>
  );
}
