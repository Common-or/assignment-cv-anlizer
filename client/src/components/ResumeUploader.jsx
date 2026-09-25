import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { Button, Input, Progress } from './ui';

const STAGES = ['Uploading', 'Extracting text', 'Analyzing with AI', 'Generating insights'];

export default function ResumeUploader({ onDone }) {
  const [label, setLabel] = useState('');
  const [busy, setBusy] = useState(false);
  const [stage, setStage] = useState(0);

  const upload = useCallback(
    async (file) => {
      setBusy(true);
      setStage(0);
      const tick = setInterval(() => setStage((s) => Math.min(s + 1, STAGES.length - 1)), 1600);
      try {
        const form = new FormData();
        form.append('file', file);
        if (label) form.append('label', label);
        setStage(1);
        const { data } = await api.post('/resumes/upload', form, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setStage(2);
        const resumeId = data.resume._id;
        const { data: analysisData } = await api.post(`/analysis/${resumeId}`);
        setStage(3);
        toast.success('CV analyzed successfully');
        onDone?.(resumeId, analysisData.analysis);
      } catch (err) {
        toast.error(err?.response?.data?.message || 'Upload failed');
      } finally {
        clearInterval(tick);
        setBusy(false);
        setStage(0);
      }
    },
    [label, onDone]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
    },
    maxSize: 10 * 1024 * 1024,
    multiple: false,
    disabled: busy,
    onDrop: (files) => files[0] && upload(files[0]),
    onDropRejected: (rejections) => {
      const msg = rejections[0]?.errors?.[0]?.message || 'Invalid file. Use PDF, DOCX, PNG or JPG (max 10 MB).';
      toast.error(msg);
    },
  });

  return (
    <div className="space-y-3">
      <Input placeholder="CV label (e.g. Frontend, Full Stack, Internship)" value={label} onChange={(e) => setLabel(e.target.value)} />
      <div
        {...getRootProps()}
        className={`cursor-pointer rounded-2xl border-2 border-dashed p-10 text-center transition ${
          isDragActive ? 'border-lime-500 bg-lime-300/10 dark:bg-lime-300/[0.06]' : 'border-zinc-300 dark:border-white/15'
        }`}
      >
        <input {...getInputProps()} />
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-900 text-white dark:bg-lime-300 dark:text-zinc-950">
          {busy ? <Loader2 className="animate-spin" /> : <UploadCloud />}
        </div>
        {busy ? (
          <div className="space-y-2">
            <p className="font-medium">{STAGES[stage]}…</p>
            <Progress value={((stage + 1) / STAGES.length) * 100} />
            <p className="text-xs text-slate-500">Uploading → Extracting → Analyzing → Insights</p>
          </div>
        ) : (
          <>
            <p className="font-medium">Drag & drop your CV here, or click to browse</p>
            <p className="text-sm text-slate-500">PDF, DOCX, PNG, JPG — max 10 MB. Images use OCR.</p>
          </>
        )}
      </div>
      <p className="text-xs text-slate-500">Scanned PDFs with no text layer should be uploaded as PNG/JPG so OCR can read them.</p>
    </div>
  );
}
