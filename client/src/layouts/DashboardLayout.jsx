import { Outlet, NavLink, Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Upload, Briefcase, History } from 'lucide-react';
import { cn } from '../lib/utils';

export default function DashboardLayout() {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-10 text-center text-sm text-zinc-500">Loading workspace…</div>;
  if (!user) return <Navigate to="/login" replace />;

  const mobile = [
    { to: '/app', icon: LayoutDashboard, label: 'Home', end: true },
    { to: '/app/upload', icon: Upload, label: 'CVs' },
    { to: '/app/jobs', icon: Briefcase, label: 'Jobs' },
    { to: '/app/history', icon: History, label: 'History' },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="mx-auto flex max-w-7xl gap-4 px-4 sm:px-6">
        <Sidebar />
        <main className="min-w-0 flex-1 py-6 pb-28 md:pb-10">
          <Outlet />
        </main>
      </div>
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-zinc-200 bg-white/95 backdrop-blur-xl dark:border-white/[0.07] dark:bg-[#07080b]/95 md:hidden">
        <div className="flex justify-around px-2 py-2">
          {mobile.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center gap-1 rounded-xl px-5 py-1.5 text-[11px] font-semibold',
                  isActive ? 'text-zinc-950 dark:text-lime-300' : 'text-zinc-400'
                )
              }
            >
              <Icon size={20} />
              {label}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
