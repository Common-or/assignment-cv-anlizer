import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import api from '../services/api';
import ScoreCard from '../components/ScoreCard';
import SkillBadge from '../components/SkillBadge';
import ExperienceTimeline from '../components/ExperienceTimeline';
import { Card, Badge, Button, Skeleton, Tabs } from '../components/ui';
import { Sparkles } from 'lucide-react';

function skillDistribution(skills = []) {
  const cats = {};
  for (const s of skills) {
    const c = typeof s === 'string' ? 'Other' : s.category || 'Other';
    cats[c] = (cats[c] || 0) + 1;
  }
  const max = Math.max(1, ...Object.values(cats));
  return Object.entries(cats).map(([subject, count]) => ({ subject, value: Math.round((count / max) * 100), count }));
}

export default function ResumeAnalysis() {
  const { resumeId } = useParams();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('Overview');
  const [improvements, setImprovements] = useState([]);
  const [busyImprove, setBusyImprove] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError('');
      try {
        const { data } = await api.get(`/analysis/${resumeId}`);
        setAnalysis(data.analysis);
      } catch (err) {
        setError(err?.response?.data?.message || 'Could not load analysis.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [resumeId]);

  async function improve() {
    setBusyImprove(true);
    try {
      const { data } = await api.post(`/analysis/${resumeId}/improve`);
      setImprovements(data.improvements || []);
      toast.success('Improvement suggestions ready');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Could not generate suggestions');
    } finally {
      setBusyImprove(false);
    }
  }

  function exportPdf() {
    window.print();
  }

  if (loading) return <div className="space-y-3"><Skeleton className="h-40" /><Skeleton className="h-64" /></div>;
  if (error) return <Card><p className="text-sm text-red-600">{error}</p></Card>;
  if (!analysis) return null;

  const dist = skillDistribution(analysis.skills);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">{analysis.profile?.fullName || 'CV Analysis'}</h1>
          <p className="text-sm text-slate-500">{analysis.profile?.email} {analysis.profile?.location && `· ${analysis.profile.location}`}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={exportPdf}>Export PDF</Button>
          <Button onClick={improve} disabled={busyImprove}><Sparkles size={16} /> {busyImprove ? 'Improving…' : 'Improve My CV'}</Button>
        </div>
      </div>

      <Tabs tabs={['Overview', 'Skills', 'Career', 'Recommendations']} active={tab} onChange={setTab} />

      {tab === 'Overview' && (
        <div className="grid gap-4 lg:grid-cols-2">
          <ScoreCard score={analysis.score} breakdown={analysis.scoreBreakdown} />
          <Card>
            <h3 className="mb-2 font-semibold">Professional summary</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">{analysis.profile?.summary || 'No summary extracted.'}</p>
            <div className="mt-4 grid gap-2 text-sm">
              <p><strong>Strengths:</strong></p>
              <ul className="list-disc space-y-1 pl-5 text-emerald-700 dark:text-emerald-300">
                {(analysis.strengths || []).map((s, i) => <li key={i}>{s}</li>)}
              </ul>
              <p className="mt-2"><strong>Gaps:</strong></p>
              <ul className="list-disc space-y-1 pl-5 text-amber-700 dark:text-amber-300">
                {(analysis.weaknesses || []).map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
          </Card>
        </div>
      )}

      {tab === 'Skills' && (
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <h3 className="mb-3 font-semibold">Skills ({analysis.skills?.length || 0})</h3>
            <div className="flex flex-wrap gap-1.5">
              {(analysis.skills || []).map((s, i) => <SkillBadge key={i} skill={s} />)}
            </div>
            {!!(analysis.languages || []).length && (
              <><h4 className="mb-2 mt-4 font-medium">Languages</h4>
              <div className="flex flex-wrap gap-1.5">{analysis.languages.map((l, i) => <Badge key={i}>{typeof l === 'string' ? l : JSON.stringify(l)}</Badge>)}</div></>
            )}
          </Card>
          <Card>
            <h3 className="mb-2 font-semibold">Skill distribution</h3>
            {dist.length ? (
              <ResponsiveContainer width="100%" height={280}>
                <RadarChart data={dist}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
                  <Radar dataKey="value" fill="#65a30d" fillOpacity={0.35} stroke="#65a30d" />
                </RadarChart>
              </ResponsiveContainer>
            ) : <p className="text-sm text-slate-500">No skills to chart.</p>}
          </Card>
        </div>
      )}

      {tab === 'Career' && (
        <div className="space-y-4">
          <ExperienceTimeline items={analysis.experience} title="Work experience" />
          <div className="grid gap-4 lg:grid-cols-2">
            <ExperienceTimeline items={analysis.education} title="Education" />
            <ExperienceTimeline items={analysis.projects} title="Projects" />
          </div>
          {!!(analysis.certifications || []).length && (
            <Card>
              <h3 className="mb-2 font-semibold">Certifications</h3>
              <div className="flex flex-wrap gap-1.5">{analysis.certifications.map((c, i) => <Badge key={i} tone="green">{typeof c === 'string' ? c : c.name || JSON.stringify(c)}</Badge>)}</div>
            </Card>
          )}
        </div>
      )}

      {tab === 'Recommendations' && (
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <h3 className="mb-2 font-semibold">Recommendations</h3>
            <ul className="list-disc space-y-1 pl-5 text-sm text-slate-600 dark:text-slate-300">
              {(analysis.recommendations || []).map((r, i) => <li key={i}>{r}</li>)}
            </ul>
          </Card>
          <Card>
            <h3 className="mb-2 font-semibold">Score breakdown</h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={Object.entries(analysis.scoreBreakdown || {}).map(([k, v]) => ({ name: k, value: v }))}>
                <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-20} height={60} />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="value" fill="#65a30d" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      )}

      {!!improvements.length && (
        <Card className="border-lime-600/25 bg-lime-500/[0.06] dark:border-lime-300/20 dark:bg-lime-300/[0.05]">
          <h3 className="mb-2 font-semibold">Improve My CV — AI suggestions</h3>
          <ul className="list-disc space-y-1 pl-5 text-sm">
            {improvements.map((s, i) => <li key={i}>{s}</li>)}
          </ul>
          <p className="mt-2 text-xs text-slate-500">AI suggestions are recommendations to be reviewed by you.</p>
        </Card>
      )}
    </div>
  );
}
