import { cn } from '../../lib/utils';

export function Button({ className, variant = 'primary', ...props }) {
  const styles = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm',
    secondary: 'bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:text-white dark:border-slate-700',
    ghost: 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  };
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition disabled:opacity-50 disabled:pointer-events-none',
        styles[variant],
        className
      )}
      {...props}
    />
  );
}

export function Card({ className, ...props }) {
  return (
    <div
      className={cn('rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900', className)}
      {...props}
    />
  );
}

export function Badge({ className, tone = 'slate', ...props }) {
  const tones = {
    slate: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200',
    green: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200',
    red: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200',
    indigo: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-200',
    amber: 'bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200',
  };
  return (
    <span className={cn('inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium', tones[tone], className)} {...props} />
  );
}

export function Input({ className, ...props }) {
  return (
    <input
      className={cn('w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900', className)}
      {...props}
    />
  );
}

export function Textarea({ className, ...props }) {
  return (
    <textarea
      className={cn('w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900', className)}
      {...props}
    />
  );
}

export function Select({ className, children, ...props }) {
  return (
    <select
      className={cn('rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900', className)}
      {...props}
    >
      {children}
    </select>
  );
}

export function Progress({ value = 0, className }) {
  return (
    <div className={cn('h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800', className)}>
      <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all" style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  );
}

export function Skeleton({ className }) {
  return <div className={cn('shimmer rounded-lg bg-slate-200/70 dark:bg-slate-800', className)} />;
}

export function Alert({ tone = 'slate', className, ...props }) {
  const tones = {
    slate: 'border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-200',
    red: 'border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200',
    amber: 'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200',
  };
  return <div className={cn('rounded-xl border p-3 text-sm', tones[tone], className)} {...props} />;
}

export function Tabs({ tabs, active, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((t) => (
        <button
          key={t}
          onClick={() => onChange(t)}
          className={cn(
            'rounded-full px-4 py-1.5 text-sm font-medium transition',
            active === t ? 'bg-indigo-600 text-white shadow' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
          )}
        >
          {t}
        </button>
      ))}
    </div>
  );
}

export function Avatar({ name = '?' }) {
  const initials = String(name).split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
  return (
    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-sm font-bold text-white">
      {initials}
    </div>
  );
}
