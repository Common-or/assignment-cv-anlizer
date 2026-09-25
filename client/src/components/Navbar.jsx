import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Moon, Sun } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Avatar, Button } from './ui';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'));

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link to={user ? '/app' : '/'} className="flex items-center gap-2 font-bold text-lg">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white">
            <Sparkles size={18} />
          </span>
          CVision AI
        </Link>
        <nav className="flex items-center gap-2">
          <button
            onClick={() => setDark(!dark)}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            title="Toggle theme"
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          {user ? (
            <>
              <Avatar name={user.name} />
              <Button variant="ghost" onClick={() => { logout(); navigate('/'); }}>Logout</Button>
            </>
          ) : (
            <>
              <Link to="/login"><Button variant="ghost">Login</Button></Link>
              <Link to="/register"><Button>Get started</Button></Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
