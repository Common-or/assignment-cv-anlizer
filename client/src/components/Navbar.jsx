import { Link, useNavigate } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Avatar, Button, Logo } from './ui';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'));

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200/80 bg-[#f4f4f2]/85 backdrop-blur-xl dark:border-white/[0.07] dark:bg-[#07080b]/85">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to={user ? '/app' : '/'} aria-label="CVision AI home">
          <Logo />
        </Link>
        <nav className="flex items-center gap-1.5 sm:gap-2">
          {!user && (
            <div className="mr-1 hidden items-center gap-1 md:flex">
              <a href="#features" className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white">Features</a>
              <a href="#method" className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white">Method</a>
            </div>
          )}
          <button
            onClick={() => setDark(!dark)}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-zinc-500 transition hover:bg-zinc-900/[0.06] hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-white/[0.06] dark:hover:text-zinc-100"
            title={dark ? 'Switch to light' : 'Switch to dark'}
          >
            {dark ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          {user ? (
            <div className="flex items-center gap-2.5 pl-1">
              <div className="hidden text-right sm:block">
                <p className="max-w-[140px] truncate text-[13px] font-semibold leading-tight">{user.name}</p>
                <p className="max-w-[140px] truncate text-xs leading-tight text-zinc-500">{user.email}</p>
              </div>
              <Avatar name={user.name} />
              <Button variant="ghost" size="sm" onClick={() => { logout(); navigate('/'); }}>Logout</Button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <Link to="/login"><Button variant="ghost">Sign in</Button></Link>
              <Link to="/register"><Button>Get started</Button></Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
