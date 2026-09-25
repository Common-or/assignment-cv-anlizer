import { Outlet, Link, useLocation, Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Upload, Briefcase, History } from 'lucide-react';
import { cn } from '../lib/utils';

export default function DashboardLayout() {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <div className="p-10 text-center text-sm text-slate-500">Loading…</div>;
  if (!user) return <Navigate to="/login" replace />;

  const mobile = [
    { to: '/app', icon: LayoutDashboard, label: 'Home' },
    { to: '/app/upload', icon: Upload, label: 'CVs' },
    { to: '/app/jobs', icon: Briefcase, label: 'Jobs' },
    { to: '/app/history', icon: History, label: 'History' },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="mx-auto flex max-w-7xl">
        <Sidebar />
        <main className="min-w-0 flex-1 p-4 pb-24 md:p-6 md:pb-6">
          <Outlet />
        </main>
      </div>
      <nav className="fixed inset-x-0 bottom-0 z-40 flex justify-around border-t border-slate-200 bg-white/95 p-2 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95 md:hidden">
        {mobile.map(({ to, icon: Icon, label }) => (
          <Link
            key={to}
            to={to}
            className={cn(
              'flex flex-col items-center gap-1 rounded-lg px-4 py-1.5 text-[11px]',
              location.pathname === to ? 'text-indigo-600' : 'text-slate-500'
            )}
          >
            <Icon size={20} />
            {label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
