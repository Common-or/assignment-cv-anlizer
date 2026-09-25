import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Upload, Briefcase, History, ShieldCheck } from 'lucide-react';
import { cn } from '../lib/utils';

const links = [
  { to: '/app', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/app/upload', label: 'My CVs', icon: Upload },
  { to: '/app/jobs', label: 'Job Matcher', icon: Briefcase },
  { to: '/app/history', label: 'History', icon: History },
];

export default function Sidebar() {
  return (
    <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-60 shrink-0 flex-col gap-1 overflow-y-auto py-6 pr-2 md:flex">
      <p className="micro-label px-3 pb-2">Workspace</p>
      {links.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            cn(
              'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all',
              isActive
                ? 'bg-zinc-900 text-white dark:bg-lime-300 dark:text-zinc-950'
                : 'text-zinc-500 hover:bg-zinc-900/[0.05] hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-white/[0.05] dark:hover:text-zinc-100'
            )
          }
        >
          <Icon size={17} strokeWidth={2.2} />
          {label}
        </NavLink>
      ))}
      <div className="mt-auto rounded-xl border border-zinc-200 bg-white p-3.5 dark:border-white/[0.08] dark:bg-white/[0.025]">
        <p className="flex items-center gap-1.5 text-[13px] font-semibold">
          <ShieldCheck size={14} className="text-lime-600 dark:text-lime-300" />
          Private by design
        </p>
        <p className="mt-1 text-xs leading-relaxed text-zinc-500 dark:text-zinc-500">
          Your CVs never leave your account. Scores assist — they don't decide.
        </p>
      </div>
    </aside>
  );
}
