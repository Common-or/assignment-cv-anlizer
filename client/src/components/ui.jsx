import { useEffect, useState } from 'react';
import { cn } from '../lib/utils';

/* ---------- Brand ---------- */
export function Logo({ compact = false }) {
  return (
    <span className="flex items-center gap-2.5">
      <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-lime-300 text-zinc-950 shadow-[0_0_24px_-6px_rgba(163,230,53,0.7)]">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 9.5l-3 2.5 3 2.5M16 9.5l3 2.5-3 2.5M13.5 6.5l-3 11" />
        </svg>
      </span>
      {!compact && (
        <span className="font-display text-[17px] font-bold tracking-tight">
          CVision<span className="text-lime-500 dark:text-lime-300"> AI</span>
        </span>
      )}
    </span>
  );
}

/* ---------- Buttons ---------- */
const buttonTones = {
  primary:
    'bg-zinc-900 text-white shadow-[0_8px_24px_-10px_rgba(0,0,0,0.5)] hover:bg-zinc-700 dark:bg-lime-300 dark:text-zinc-950 dark:hover:bg-lime-200 dark:shadow-[0_8px_28px_-10px_rgba(163,230,53,0.6)]',
  secondary:
    'border border-zinc-300 bg-white text-zinc-900 hover:border-zinc-400 hover:bg-zinc-50 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-100 dark:hover:border-white/20 dark:hover:bg-white/[0.07]',
  ghost: 'text-zinc-600 hover:bg-zinc-900/[0.06] hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-white/[0.06] dark:hover:text-zinc-100',
  danger: 'bg-red-600 text-white hover:bg-red-500 dark:bg-red-500/90 dark:hover:bg-red-500',
};

const buttonSizes = {
  sm: 'h-8 px-3 text-[13px]',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-[15px]',
};

export function Button({ className, variant = 'primary', size = 'md', ...props }) {
  return (
    <button
      className={cn(
        'inline-flex select-none items-center justify-center gap-2 rounded-xl font-semibold transition-all active:scale-[0.98] disabled:pointer-events-none disabled:opacity-45',
        buttonTones[variant],
        buttonSizes[size],
        className
      )}
      {...props}
    />
  );
}

/* ---------- Cards ---------- */
export function Card({ className, ...props }) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-zinc-200/90 bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] dark:border-white/[0.08] dark:bg-white/[0.025] dark:shadow-none',
        className
      )}
      {...props}
    />
  );
}

/* ---------- Badges ---------- */
const badgeTones = {
  zinc: 'bg-zinc-900/[0.06] text-zinc-700 ring-zinc-900/10 dark:bg-white/[0.07] dark:text-zinc-300 dark:ring-white/10',
  lime: 'bg-lime-300/25 text-lime-800 ring-lime-600/25 dark:bg-lime-300/10 dark:text-lime-300 dark:ring-lime-300/20',
  green: 'bg-emerald-500/10 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-400/10 dark:text-emerald-300 dark:ring-emerald-300/20',
  red: 'bg-red-500/10 text-red-700 ring-red-600/20 dark:bg-red-400/10 dark:text-red-300 dark:ring-red-300/20',
  amber: 'bg-amber-500/10 text-amber-800 ring-amber-600/25 dark:bg-amber-400/10 dark:text-amber-300 dark:ring-amber-300/20',
};

export function Badge({ className, tone = 'zinc', ...props }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset',
        badgeTones[tone],
        className
      )}
      {...props}
    />
  );
}

/* ---------- Forms ---------- */
const fieldBase =
  'w-full rounded-xl border border-zinc-300 bg-white px-3.5 text-sm text-zinc-900 placeholder:text-zinc-400 transition outline-none focus:border-zinc-500 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-100 dark:placeholder:text-zinc-600 dark:focus:border-lime-300/60';

export function Field({ label, hint, children }) {
  return (
    <label className="block">
      {label && <span className="mb-1.5 block text-[13px] font-semibold text-zinc-700 dark:text-zinc-300">{label}</span>}
      {children}
      {hint && <span className="mt-1.5 block text-xs text-zinc-500 dark:text-zinc-500">{hint}</span>}
    </label>
  );
}

export function Input({ className, ...props }) {
  return <input className={cn(fieldBase, 'h-11', className)} {...props} />;
}

export function Textarea({ className, ...props }) {
  return <textarea className={cn(fieldBase, 'py-3 leading-relaxed', className)} {...props} />;
}

export function Select({ className, children, ...props }) {
  return (
    <select className={cn(fieldBase, 'h-11 cursor-pointer pr-8', className)} {...props}>
      {children}
    </select>
  );
}

/* ---------- Progress ---------- */
export function Progress({ value = 0, className, barClassName }) {
  return (
    <div className={cn('h-1.5 w-full overflow-hidden rounded-full bg-zinc-900/10 dark:bg-white/10', className)}>
      <div
        className={cn('h-full rounded-full bg-zinc-900 transition-all duration-700 dark:bg-lime-300', barClassName)}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

/* ---------- Loading ---------- */
export function Skeleton({ className }) {
  return <div className={cn('shimmer rounded-xl bg-zinc-900/[0.07] dark:bg-white/[0.06]', className)} />;
}

/* ---------- Alert ---------- */
const alertTones = {
  zinc: 'border-zinc-300 bg-zinc-900/[0.03] text-zinc-700 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-300',
  red: 'border-red-600/25 bg-red-500/[0.07] text-red-800 dark:border-red-400/20 dark:bg-red-400/[0.07] dark:text-red-200',
  amber: 'border-amber-600/25 bg-amber-500/[0.08] text-amber-900 dark:border-amber-400/20 dark:bg-amber-400/[0.07] dark:text-amber-200',
  lime: 'border-lime-600/25 bg-lime-500/[0.08] text-lime-900 dark:border-lime-300/20 dark:bg-lime-300/[0.07] dark:text-lime-200',
};

export function Alert({ tone = 'zinc', className, ...props }) {
  return <div className={cn('rounded-xl border px-3.5 py-3 text-sm leading-relaxed', alertTones[tone], className)} {...props} />;
}

/* ---------- Segmented tabs ---------- */
export function Tabs({ tabs, active, onChange }) {
  return (
    <div className="inline-flex max-w-full items-center gap-1 overflow-x-auto rounded-xl border border-zinc-200 bg-zinc-900/[0.03] p-1 dark:border-white/10 dark:bg-white/[0.03]">
      {tabs.map((t) => (
        <button
          key={t}
          onClick={() => onChange(t)}
          className={cn(
            'whitespace-nowrap rounded-lg px-4 py-2 text-sm font-semibold transition-all',
            active === t
              ? 'bg-white text-zinc-900 shadow-sm ring-1 ring-zinc-900/10 dark:bg-lime-300 dark:text-zinc-950 dark:ring-0'
              : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100'
          )}
        >
          {t}
        </button>
      ))}
    </div>
  );
}

/* ---------- Avatar ---------- */
export function Avatar({ name = '?', className }) {
  const initials = String(name).trim().split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase() || '?';
  return (
    <div
      className={cn(
        'flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-[13px] font-bold text-white ring-2 ring-lime-300/60 dark:bg-zinc-800',
        className
      )}
    >
      {initials}
    </div>
  );
}

/* ---------- Score ring gauge ---------- */
export function ScoreRing({ value = 0, size = 120, stroke = 10, label }) {
  const [shown, setShown] = useState(0);
  useEffect(() => {
    const raf = requestAnimationFrame(() => setShown(Math.max(0, Math.min(100, value))));
    return () => cancelAnimationFrame(raf);
  }, [value]);
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const off = c - (shown / 100) * c;
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} strokeWidth={stroke} fill="none" className="stroke-zinc-900/10 dark:stroke-white/10" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          className="score-ring-arc stroke-zinc-900 dark:stroke-lime-300"
          style={{ strokeDasharray: c, ['--gauge-from']: c, ['--gauge-to']: off, strokeDashoffset: off }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-3xl font-bold tabular-nums">{Math.round(shown)}</span>
        {label && <span className="micro-label mt-0.5">{label}</span>}
      </div>
    </div>
  );
}

/* ---------- Stat ---------- */
export function Stat({ icon: Icon, label, value, sub }) {
  return (
    <Card className="lift">
      <div className="flex items-center justify-between">
        <span className="micro-label">{label}</span>
        {Icon && (
          <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 text-zinc-500 dark:border-white/10 dark:text-zinc-400">
            <Icon size={15} />
          </span>
        )}
      </div>
      <p className="mt-2 font-display text-[32px] font-bold leading-none tabular-nums">{value}</p>
      {sub && <p className="mt-1.5 text-[13px] text-zinc-500 dark:text-zinc-500">{sub}</p>}
    </Card>
  );
}

/* ---------- Empty state ---------- */
export function EmptyState({ icon: Icon, title, text, action }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-zinc-300 px-6 py-12 text-center dark:border-white/10">
      {Icon && (
        <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-900/[0.05] text-zinc-500 dark:bg-white/[0.05] dark:text-zinc-400">
          <Icon size={20} />
        </span>
      )}
      <p className="font-display font-bold">{title}</p>
      {text && <p className="mt-1 max-w-sm text-sm text-zinc-500 dark:text-zinc-500">{text}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
