import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import api from '../services/api';
import { Card, Badge, Button, Skeleton } from '../components/ui';
import { FileText, Briefcase, Trophy, ArrowRight } from 'lucide-react';

export default function Dashboard() {
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
        // Fetch latest analysis per resume (best effort, first 5)
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

  const best = scores.reduce((max, a) => Math.max(max, a.score || 0), 0);
  const bestMatch = matches.reduce((max, m) => Math.max(max, m.overallScore || 0), 0);

  if (loading) {
    return (
      <div className="space-y-3">
        <div className="grid gap-3 md:grid-cols-3">
          <Skeleton className="h-28" /><Skeleton className="h-28" /><Skeleton className="h-28" />
        </div>
        <Skeleton className="h-48" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-slate-500">Your AI career workspace at a glance.</p>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        <Card className="beam-card">
          <div className="flex items-center gap-2 text-sm text-slate-500"><FileText size={16} /> CV score</div>
          <p className="mt-1 text-3xl font-extrabold">{scores.length ? `${best}/100` : '—'}</p>
          <p className="text-xs text-slate-500">{resumes.length} CV(s) uploaded</p>
        </Card>
        <Card>
          <div className="flex items-center gap-2 text-sm text-slate-500"><Briefcase size={16} /> Jobs analyzed</div>
          <p className="mt-1 text-3xl font-extrabold">{matches.length}</p>
          <p className="text-xs text-slate-500">Saved job comparisons</p>
        </Card>
        <Card>
          <div className="flex items-center gap-2 text-sm text-slate-500"><Trophy size={16} /> Best match</div>
          <p className="mt-1 text-3xl font-extrabold">{matches.length ? `${bestMatch}%` : '—'}</p>
          <p className="text-xs text-slate-500">Highest compatibility</p>
        </Card>
      </div>

      <Card>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold">Recent analyses</h2>
          <Link to="/app/upload"><Button variant="ghost">View all <ArrowRight size={14} /></Button></Link>
        </div>
        {!scores.length && <p className="text-sm text-slate-500">No analyses yet. <Link to="/app/upload" className="text-indigo-600">Upload your first CV</Link>.</p>}
        <div className="space-y-2">
          {scores.slice(0, 5).map((a) => (
            <Link key={a._id} to={`/app/analysis/${a.resume?._id || a.resume}`} className="flex items-center justify-between rounded-xl border border-slate-100 p-3 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50">
              <div>
                <p className="text-sm font-medium">{a.profile?.fullName || a.resume?.originalName || 'CV Analysis'}</p>
                <p className="text-xs text-slate-500">{a.createdAt ? format(new Date(a.createdAt), 'PPp') : ''}</p>
              </div>
              <Badge tone={a.score >= 75 ? 'green' : a.score >= 50 ? 'amber' : 'red'}>{a.score}/100</Badge>
            </Link>
          ))}
        </div>
      </Card>
    </div>
  );
}
