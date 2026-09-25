import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api';
import JobMatchCard from '../components/JobMatchCard';
import { Card, Button, Input, Textarea, Select, Skeleton } from '../components/ui';

export default function JobMatcher() {
  const [jobs, setJobs] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [jobId, setJobId] = useState('');
  const [resumeId, setResumeId] = useState('');
  const [match, setMatch] = useState(null);
  const [busy, setBusy] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const [{ data: j }, { data: r }] = await Promise.all([api.get('/jobs'), api.get('/resumes')]);
      setJobs(j.jobs || []);
      setResumes(r.resumes || []);
      if (j.jobs?.length && !jobId) setJobId(j.jobs[0]._id);
      if (r.resumes?.length && !resumeId) setResumeId(r.resumes[0]._id);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function createJob(e) {
    e.preventDefault();
    setBusy(true);
    try {
      const { data } = await api.post('/jobs', { title, company, location, description, url, source: 'manual' });
      toast.success('Job saved');
      setJobs([data.job, ...jobs]);
      setJobId(data.job._id);
      setTitle(''); setCompany(''); setLocation(''); setDescription(''); setUrl('');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Could not save job');
    } finally {
      setBusy(false);
    }
  }

  async function runMatch() {
    if (!jobId || !resumeId) return toast.error('Select a job and a CV first');
    setBusy(true);
    setMatch(null);
    try {
      const { data } = await api.post(`/jobs/${jobId}/match/${resumeId}`);
      setMatch(data.match);
      toast.success(`Match: ${data.match.overallScore}%`);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Matching failed');
    } finally {
      setBusy(false);
    }
  }

  async function removeJob(id) {
    if (!confirm('Delete this job?')) return;
    await api.delete(`/jobs/${id}`);
    setJobs(jobs.filter((j) => j._id !== id));
  }

  if (loading) return <div className="space-y-3"><Skeleton className="h-40" /><Skeleton className="h-40" /></div>;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold">Job Matcher</h1>
        <p className="text-sm text-slate-500">Paste a job description (from a source that permits reuse) and compare it with your CV.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="mb-3 font-semibold">Add job offer (manual entry)</h2>
          <form onSubmit={createJob} className="space-y-2">
            <Input placeholder="Job title *" value={title} onChange={(e) => setTitle(e.target.value)} required />
            <div className="grid grid-cols-2 gap-2">
              <Input placeholder="Company" value={company} onChange={(e) => setCompany(e.target.value)} />
              <Input placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
            </div>
            <Textarea rows={6} placeholder="Paste the job description here (min 20 chars) *" value={description} onChange={(e) => setDescription(e.target.value)} required />
            <Input placeholder="Source URL (optional)" value={url} onChange={(e) => setUrl(e.target.value)} />
            <Button className="w-full" disabled={busy}>Save job</Button>
          </form>
        </Card>

        <Card>
          <h2 className="mb-3 font-semibold">Run compatibility analysis</h2>
          <div className="space-y-2">
            <label className="text-sm">Job</label>
            <Select value={jobId} onChange={(e) => setJobId(e.target.value)} className="w-full">
              {jobs.map((j) => <option key={j._id} value={j._id}>{j.title}{j.company ? ` — ${j.company}` : ''}</option>)}
            </Select>
            <label className="text-sm">CV version</label>
            <Select value={resumeId} onChange={(e) => setResumeId(e.target.value)} className="w-full">
              {resumes.map((r) => <option key={r._id} value={r._id}>{r.label ? `${r.label} — ` : ''}{r.originalName}</option>)}
            </Select>
            <Button className="w-full" onClick={runMatch} disabled={busy || !jobs.length || !resumes.length}>
              {busy ? 'Matching…' : 'Compare CV vs Job'}
            </Button>
            {!jobs.length && <p className="text-sm text-slate-500">Save a job first.</p>}
            {!resumes.length && <p className="text-sm text-slate-500">Upload a CV first.</p>}
          </div>
          {!!jobs.length && (
            <div className="mt-4 space-y-1">
              {jobs.slice(0, 5).map((j) => (
                <div key={j._id} className="flex items-center justify-between text-sm">
                  <span className="truncate">{j.title}</span>
                  <button className="text-xs text-red-500" onClick={() => removeJob(j._id)}>delete</button>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {match && <JobMatchCard match={match} />}

      <Card>
        <h2 className="mb-2 font-semibold">How the matching score is calculated</h2>
        <div className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-3">
          {[['Skills', '40%'], ['Experience', '25%'], ['Education', '10%'], ['Projects', '10%'], ['Keywords', '10%'], ['Certifications', '5%']].map(([k, v]) => (
            <div key={k} className="rounded-lg bg-slate-50 p-2 dark:bg-slate-800/60">{k}: <strong>{v}</strong></div>
          ))}
        </div>
      </Card>
    </div>
  );
}
