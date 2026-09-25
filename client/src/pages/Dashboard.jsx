import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Area, AreaChart, ResponsiveContainer } from 'recharts';
import api from '../services/api';
import { Badge, Button, Card, EmptyState, ScoreRing, Skeleton, Stat } from '../components/ui';
import { ArrowRight, ArrowUpRight, Briefcase, FileUp, FileText, Trophy, Inbox } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function Sparkline({ data }) {
  if (!data.length) return <div className="h-10" />;
  return (
    <ResponsiveContainer width="100%" height={40}>
      <AreaChart data={data.map((v, i) => ({ i, v }))} margin={{ top: 2, bottom: 0, left: 0, right: 0 }}>
        <defs>
          <linearGradient id="spark" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a3e635" stopOpacity={0.5} />
            <stop offset="100%" stopColor="#a3e635" stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area type="monotone" dataKey="v" stroke="#65a30d" strokeWidth={1.8} fill="url(#spark)" isAnimationActive={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [resumes, setResumes] = useState([]);
  const [matches, setMatches] = useState([]);
  const [scores, setScores] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const [{ data: r }, { data: m }] = await Promise.all([
          api.get('/resumes'),
          api.get('/jobs/matches/history'),
        ]);
        setResumes(r.resumes || []);
        setMatches(m.matches || []);
        const top = (r.resumes || []).slice(0, 5);
        const results = await Promise.all(
          top.map((resume) => api.get(`/analysis/${resume._id}`).then((d) => d.data.analysis).catch(() => null))
        );
        setScores(results.filter(Boolean));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-9 w-64" />
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-36" /><Skeleton className="h-36" /><Skeleton className="h-36" />
        </div>
        <Skeleton className="h-56" />
      </div>
    );
  }

  const best = scores.reduce((max, a) => Math.max(max, a.score || 0), 0);
  const bestMatch = matches.reduce((max, m) => Math.max(max, m.overallScore || 0), 0);
  const firstName = user?.name?.split(' ')[0] || 'there';

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="micro-label">Overview</p>
          <h1 className="mt-1.5 font-display text-3xl font-bold tracking-tight">Good to see you, {firstName}.</h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Here's where your applications stand.</p>
        </div>
        <div className="flex gap-2">
          <Link to="/app/upload"><Button variant="secondary"><FileUp size={16} /> Upload CV</Button></Link>
          <Link to="/app/jobs"><Button>Match a job <ArrowRight size={16} /></Button></Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="lift">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="micro-label">Best CV score</p>
              <p className="mt-2 font-display text-4xl font-bold tabular-nums">{scores.length ? best : '—'}</p>
              <p className="mt-1 text-[13px] text-zinc-500">{resumes.length} CV version{resumes.length === 1 ? '' : 's'} uploaded</p>
            </div>
            {scores.length > 0 && <ScoreRing value={best} size={72} stroke={8} />}
          </div>
          <div className="mt-2"><Sparkline data={scores.map((s) => s.score)} /></div>
        </Card>
        <Stat icon={Briefcase} label="Jobs analyzed" value={matches.length} sub="Saved job comparisons" />
        <Stat icon={Trophy} label="Best match" value={matches.length ? `${bestMatch}%` : '—'} sub={matches.length ? 'Highest compatibility so far' : 'Run your first comparison'} />
      </div>

      <Card className="!p-0 overflow-hidden">
        <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4 dark:border-white/[0.07]">
          <p className="font-display text-[15px] font-bold">Recent analyses</p>
          <Link to="/app/upload"><Button variant="ghost" size="sm">View all <ArrowUpRight size={14} /></Button></Link>
        </div>
        {!scores.length ? (
          <div className="p-5">
            <EmptyState
              icon={Inbox}
              title="No analyses yet"
              text="Upload your first CV and get a score, skill map and fix list in under a minute."
              action={<Link to="/app/upload"><Button><FileText size={16} /> Upload your first CV</Button></Link>}
            />
          </div>
        ) : (
          <ul className="divide-y divide-zinc-200 dark:divide-white/[0.06]">
            {scores.slice(0, 5).map((a) => (
              <li key={a._id}>
                <Link to={`/app/analysis/${a.resume?._id || a.resume}`} className="group flex items-center justify-between gap-4 px-5 py-3.5 transition hover:bg-zinc-900/[0.03] dark:hover:bg-white/[0.03]">
                  <div className="flex min-w-0 items-center gap-3.5">
                    <ScoreRing value={a.score} size={44} stroke={5} />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{a.profile?.fullName || a.resume?.originalName || 'CV Analysis'}</p>
                      <p className="text-xs text-zinc-500">{a.createdAt ? format(new Date(a.createdAt), 'PPp') : ''}</p>
                    </div>
                  </div>
                  <Badge tone={a.score >= 75 ? 'lime' : a.score >= 50 ? 'amber' : 'red'}>{a.score}/100</Badge>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
