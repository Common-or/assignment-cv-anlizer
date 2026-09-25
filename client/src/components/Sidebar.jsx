import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Upload, Briefcase, History, FileText } from 'lucide-react';
import { cn } from '../lib/utils';

const links = [
  { to: '/app', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/app/upload', label: 'My CVs', icon: Upload },
  { to: '/app/jobs', label: 'Job Matcher', icon: Briefcase },
  { to: '/app/history', label: 'History', icon: History },
];

export default function Sidebar() {
  return (
    <aside className="hidden w-60 shrink-0 flex-col gap-1 border-r border-slate-200 p-4 dark:border-slate-800 md:flex">
      <div className="mb-2 flex items-center gap-2 rounded-xl bg-indigo-50 p-3 text-sm text-indigo-900 dark:bg-indigo-950/50 dark:text-indigo-200">
        <FileText size={16} />
        <span>AI-assisted analysis — not a hiring guarantee.</span>
      </div>
      {links.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition',
              isActive
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
            )
          }
        >
          <Icon size={18} />
          {label}
        </NavLink>
      ))}
    </aside>
  );
}
