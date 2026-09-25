import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import api from '../services/api';
import { Card, Badge, Select, Input, Skeleton } from '../components/ui';

export default function History() {
  const [matches, setMatches] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState('newest');
  const [filter, setFilter] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const [{ data: m }, { data: r }] = await Promise.all([
          api.get('/jobs/matches/history'),
          api.get('/resumes'),
        ]);
        setMatches(m.matches || []);
        setResumes(r.resumes || []);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const resumeName = useMemo(() => {
    const map = {};
    resumes.forEach((r) => { map[r._id] = (r.label ? `${r.label} — ` : '') + r.originalName; });
    return map;
  }, [resumes]);

  const filtered = useMemo(() => {
    let list = [...matches];
    if (filter) {
      const f = filter.toLowerCase();
      list = list.filter((m) =>
        `${m.job?.title || ''} ${m.job?.company || ''} ${resumeName[m.resume?._id || m.resume] || ''}`.toLowerCase().includes(f)
      );
    }
    list.sort((a, b) => {
      if (sort === 'score') return (b.overallScore || 0) - (a.overallScore || 0);
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    return list;
  }, [matches, sort, filter, resumeName]);

  if (loading) return <div className="space-y-2"><Skeleton className="h-16" /><Skeleton className="h-16" /></div>;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold">History</h1>
        <p className="text-sm text-slate-500">All CV analyses and job matches, sortable and filterable.</p>
      </div>
      <Card>
        <div className="mb-3 flex flex-wrap gap-2">
          <Input placeholder="Filter by job, company or CV…" value={filter} onChange={(e) => setFilter(e.target.value)} className="max-w-xs" />
          <Select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="newest">Newest first</option>
            <option value="score">Highest score</option>
          </Select>
        </div>
        {!filtered.length && <p className="text-sm text-slate-500">No job matches yet. <Link to="/app/jobs" className="text-indigo-600">Run your first match</Link>.</p>}
        <div className="space-y-2">
          {filtered.map((m) => (
            <div key={m._id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-100 p-3 dark:border-slate-800">
              <div>
                <p className="text-sm font-medium">{m.job?.title || 'Job'} {m.job?.company && <span className="text-slate-500">· {m.job.company}</span>}</p>
                <p className="text-xs text-slate-500">
                  {resumeName[m.resume?._id || m.resume] || 'CV'} · {m.createdAt ? format(new Date(m.createdAt), 'PPp') : ''}
                </p>
              </div>
              <Badge tone={m.overallScore >= 75 ? 'green' : m.overallScore >= 50 ? 'amber' : 'red'}>{m.overallScore}%</Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
