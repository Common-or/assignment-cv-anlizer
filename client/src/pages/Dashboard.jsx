import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import api from '../services/api';
import { Badge, Button, Card, EmptyState, Skeleton, Stat } from '../components/ui';
import { ArrowRight, Briefcase, FileUp, FileText, Gauge, Inbox } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

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
          <Skeleton className="h-32" /><Skeleton className="h-32" /><Skeleton className="h-32" />
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
          <h1 className="font-display text-3xl font-bold tracking-tight">Hello, {firstName}.</h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Here's where your applications stand.</p>
        </div>
        <div className="flex gap-2">
          <Link to="/app/upload"><Button variant="secondary"><FileUp size={16} /> Upload CV</Button></Link>
          <Link to="/app/jobs"><Button>Match a job <ArrowRight size={16} /></Button></Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Stat icon={Gauge} label="Best CV score" value={scores.length ? `${best}/100` : '—'} sub={`${resumes.length} CV version${resumes.length === 1 ? '' : 's'}`} />
        <Stat icon={Briefcase} label="Jobs analyzed" value={matches.length} sub="Saved comparisons" />
        <Stat icon={FileText} label="Best match" value={matches.length ? `${bestMatch}%` : '—'} sub={matches.length ? 'Highest compatibility' : 'No comparison yet'} />
      </div>

      <Card className="!p-0 overflow-hidden">
        <p className="border-b border-zinc-200 px-5 py-4 font-display text-[15px] font-bold dark:border-white/[0.07]">Recent analyses</p>
        {!scores.length ? (
          <div className="p-5">
            <EmptyState
              icon={Inbox}
              title="No analyses yet"
              text="Upload your first CV to get a score and fix list."
              action={<Link to="/app/upload"><Button><FileText size={16} /> Upload a CV</Button></Link>}
            />
          </div>
        ) : (
          <ul className="divide-y divide-zinc-200 dark:divide-white/[0.06]">
            {scores.slice(0, 5).map((a) => (
              <li key={a._id}>
                <Link to={`/app/analysis/${a.resume?._id || a.resume}`} className="flex items-center justify-between gap-4 px-5 py-3.5 transition hover:bg-zinc-900/[0.03] dark:hover:bg-white/[0.03]">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{a.profile?.fullName || a.resume?.originalName || 'CV Analysis'}</p>
                    <p className="text-xs text-zinc-500">{a.createdAt ? format(new Date(a.createdAt), 'PPp') : ''}</p>
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
