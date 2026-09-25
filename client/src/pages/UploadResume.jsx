import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import api from '../services/api';
import ResumeUploader from '../components/ResumeUploader';
import { Card, Badge, Button, Skeleton } from '../components/ui';
import { Trash2 } from 'lucide-react';

export default function UploadResume() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  async function load() {
    setLoading(true);
    try {
      const { data } = await api.get('/resumes');
      setResumes(data.resumes || []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function remove(id) {
    if (!confirm('Delete this CV and its analysis?')) return;
    try {
      await api.delete(`/resumes/${id}`);
      toast.success('Deleted');
      load();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Delete failed');
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold">My CVs</h1>
        <p className="text-sm text-slate-500">Upload multiple versions (Frontend, Full Stack, Internship).</p>
      </div>
      <Card>
        <ResumeUploader onDone={(resumeId) => { load(); navigate(`/app/analysis/${resumeId}`); }} />
      </Card>
      <Card>
        <h2 className="mb-3 font-semibold">Uploaded versions</h2>
        {loading ? (
          <div className="space-y-2"><Skeleton className="h-14" /><Skeleton className="h-14" /></div>
        ) : !resumes.length ? (
          <p className="text-sm text-slate-500">No CVs yet.</p>
        ) : (
          <div className="space-y-2">
            {resumes.map((r) => (
              <div key={r._id} className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 p-3 dark:border-slate-800">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{r.label ? `${r.label} — ` : ''}{r.originalName}</p>
                  <p className="text-xs text-slate-500">{format(new Date(r.createdAt), 'PPp')} · <Badge tone={r.status === 'analyzed' ? 'green' : r.status === 'failed' ? 'red' : 'slate'}>{r.status}</Badge></p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Link to={`/app/analysis/${r._id}`}><Button variant="secondary">View</Button></Link>
                  <Button variant="ghost" onClick={() => remove(r._id)}><Trash2 size={16} /></Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
