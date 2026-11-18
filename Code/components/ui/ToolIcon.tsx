import { TOOL_ICONS } from '@/lib/toolIcons';
import { cn } from '@/lib/utils';

/** A tool's brand mark (or app tile), 24×24 viewBox. Decorative: the tool name is always shown alongside. */
export function ToolIcon({ name, className }: { name: string; className?: string }) {
  const icon = TOOL_ICONS[name];
  if (!icon) return null;
  return (
    <svg viewBox="0 0 24 24" className={cn('shrink-0', className)} aria-hidden>
      {icon.kind === 'path' ? (
        <path d={icon.d} fill={icon.color} />
      ) : (
        <>
          {icon.shape === 'circle' ? (
            <circle cx="12" cy="12" r="12" fill={icon.bg} />
          ) : (
            <rect width="24" height="24" rx="5" fill={icon.bg} />
          )}
          <text
            x="12"
            y="12.5"
            textAnchor="middle"
            dominantBaseline="central"
            fill={icon.fg}
            style={{ fontSize: icon.text.length > 1 ? 11.5 : 14, fontWeight: 800, fontFamily: 'var(--font-manrope), system-ui, sans-serif' }}
          >
            {icon.text}
          </text>
        </>
      )}
    </svg>
  );
}
