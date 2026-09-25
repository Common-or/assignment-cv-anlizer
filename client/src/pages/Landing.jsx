import { Link } from 'react-router-dom';
import { ArrowRight, FileUp, Gauge, Crosshair } from 'lucide-react';
import Navbar from '../components/Navbar';
import { Button } from '../components/ui';

const features = [
  { icon: FileUp, title: 'Upload', text: 'PDF, DOCX or image. OCR handles scans.' },
  { icon: Gauge, title: 'Score', text: 'A transparent 8-category CV score with fixes.' },
  { icon: Crosshair, title: 'Match', text: 'Compare against any job offer, skill by skill.' },
];

const steps = ['Upload your CV', 'Get the analysis', 'Match job offers'];

export default function Landing() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="mx-auto max-w-3xl px-4 pb-16 pt-20 text-center sm:px-6 md:pt-28">
        <p className="font-mono text-xs tracking-[0.18em] text-zinc-500">MERN · MONGODB ATLAS · XAI GROK</p>
        <h1 className="mt-5 font-display text-5xl font-bold leading-[1.05] tracking-[-0.02em] sm:text-6xl">
          Understand your CV.<br />Match your career.
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
          AI-powered CV analysis and job compatibility in one workspace.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link to="/register"><Button size="lg">Analyze my CV <ArrowRight size={17} /></Button></Link>
          <Link to="/register"><Button size="lg" variant="secondary">Try job matcher</Button></Link>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="grid gap-8 border-t border-zinc-200 py-12 dark:border-white/[0.07] sm:grid-cols-3">
          {features.map(({ icon: Icon, title, text }) => (
            <div key={title}>
              <Icon size={20} strokeWidth={2} className="text-zinc-900 dark:text-zinc-100" />
              <p className="mt-3 font-display text-base font-bold">{title}</p>
              <p className="mt-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Steps */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6">
        <ol className="grid gap-4 border-t border-zinc-200 py-12 dark:border-white/[0.07] sm:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s} className="flex items-baseline gap-3">
              <span className="font-mono text-sm text-zinc-400">0{i + 1}</span>
              <span className="text-[15px] font-medium">{s}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-5xl px-4 pb-20 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-5 rounded-2xl border border-zinc-200 px-8 py-10 text-center dark:border-white/[0.07] sm:flex-row sm:text-left">
          <div>
            <p className="font-display text-xl font-bold">Ready to check your CV?</p>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Free. Takes less than a minute.</p>
          </div>
          <Link to="/register" className="shrink-0"><Button size="lg">Get started <ArrowRight size={17} /></Button></Link>
        </div>
      </section>

      <footer className="border-t border-zinc-200 dark:border-white/[0.07]">
        <p className="mx-auto max-w-5xl px-4 py-6 text-xs text-zinc-500 sm:px-6">
          CVision AI — MERN project with xAI/Grok integration. AI-assisted analysis, not a hiring guarantee.
        </p>
      </footer>
    </div>
  );
}
