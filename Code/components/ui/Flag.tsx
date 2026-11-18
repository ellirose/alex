import type { Country } from '@/lib/locales';
import { cn } from '@/lib/utils';

function star(cx: number, cy: number, outer: number, inner: number) {
  const pts: string[] = [];
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const r = i % 2 === 0 ? outer : inner;
    pts.push(`${(cx + Math.cos(a) * r).toFixed(2)},${(cy + Math.sin(a) * r).toFixed(2)}`);
  }
  return pts.join(' ');
}

const STRIPE = 30 / 13;

/** Circular national flag icons: United States, Brazil and Chile. */
export function Flag({ country, className }: { country: Country; className?: string }) {
  return (
    <span
      className={cn(
        'inline-block shrink-0 overflow-hidden rounded-full shadow-[0_0_0_1.5px_rgb(255_255_255),0_2px_6px_-1px_rgb(30_43_58/0.3)]',
        className,
      )}
    >
      <svg viewBox="0 0 30 30" className="block h-full w-full" aria-hidden>
        {country === 'us' && (
          <>
            {Array.from({ length: 13 }, (_, i) => (
              <rect key={i} y={i * STRIPE} width="30" height={STRIPE + 0.05} fill={i % 2 ? '#ffffff' : '#B22234'} />
            ))}
            <rect width="14" height={STRIPE * 7} fill="#3C3B6E" />
            {Array.from({ length: 12 }, (_, i) => (
              <circle
                key={i}
                cx={3 + (i % 3) * 3.6 + (Math.floor(i / 3) % 2) * 1.8}
                cy={2.6 + Math.floor(i / 3) * 3.3}
                r="0.75"
                fill="#ffffff"
              />
            ))}
          </>
        )}
        {country === 'br' && (
          <>
            <rect width="30" height="30" fill="#009B3A" />
            <polygon points="15,4.2 27.6,15 15,25.8 2.4,15" fill="#FEDF00" />
            <circle cx="15" cy="15" r="6.2" fill="#002776" />
            <path d="M8.9 13.7Q15 11.9 21 16.4" fill="none" stroke="#ffffff" strokeWidth="1.1" />
            <circle cx="13" cy="17.2" r=".45" fill="#fff" />
            <circle cx="16.4" cy="18.4" r=".45" fill="#fff" />
            <circle cx="17.6" cy="16.6" r=".35" fill="#fff" />
          </>
        )}
        {country === 'cl' && (
          <>
            <rect width="30" height="15" fill="#ffffff" />
            <rect y="15" width="30" height="15" fill="#D52B1E" />
            <rect width="15" height="15" fill="#0039A6" />
            <polygon points={star(7.5, 7.7, 3.7, 1.5)} fill="#ffffff" />
          </>
        )}
      </svg>
    </span>
  );
}
