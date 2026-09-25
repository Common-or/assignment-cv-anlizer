import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Alert, Card, Logo } from '../components/ui';

export function AuthShell({ title, subtitle, error, children, footer }) {
  return (
    <div className="aurora bg-grid min-h-screen">
      <Navbar />
      <div className="mx-auto max-w-md px-4 py-14 sm:py-20">
        <div className="mb-6 flex justify-center"><Logo /></div>
        <Card className="!p-7 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.25)] dark:shadow-[0_24px_70px_-24px_rgba(0,0,0,0.9)]">
          <h1 className="font-display text-2xl font-bold tracking-tight">{title}</h1>
          <p className="mb-5 mt-1 text-sm text-zinc-500 dark:text-zinc-400">{subtitle}</p>
          {error && <Alert tone="red" className="mb-4">{error}</Alert>}
          {children}
          {footer && <p className="mt-5 text-center text-sm text-zinc-500">{footer}</p>}
        </Card>
        <p className="mt-6 text-center font-mono text-[11px] text-zinc-400 dark:text-zinc-600">
          Protected by JWT · bcrypt · scoped data access
        </p>
      </div>
    </div>
  );
}

export function AuthFooterLink({ to, label, prefix }) {
  return (
    <>{prefix} <Link to={to} className="font-semibold text-zinc-900 underline decoration-lime-500 decoration-2 underline-offset-4 dark:text-white dark:decoration-lime-300">{label}</Link></>
  );
}
