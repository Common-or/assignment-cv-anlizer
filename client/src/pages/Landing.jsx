import { Link } from 'react-router-dom';
import {
  ArrowRight, ArrowUpRight, ScanText, Network, Gauge, Crosshair, Wand2, Layers,
  Check, Minus, FileUp, Cpu, GitCompareArrows,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { Badge, Button, Card, Logo, Progress, ScoreRing } from '../components/ui';

const capabilities = ['PDF text extraction', 'DOCX parsing', 'OCR for scans & images', 'Grok 4.7 reasoning', 'Structured JSON output', 'Transparent scoring', 'Skill-gap analysis', 'Match history'];

const features = [
  { icon: FileUp, title: 'Upload anything', text: 'PDF, DOCX, PNG or JPG. Image-based CVs go through OCR so nothing is lost.' },
  { icon: ScanText, title: 'Structured extraction', text: 'Profile, skills with levels, experience, education, projects, languages — validated JSON, never raw prose.' },
  { icon: Gauge, title: 'Transparent score', text: 'An 8-category weighted score you can inspect, with strengths, gaps and fixes.' },
  { icon: Crosshair, title: 'Job matching', text: 'Paste any offer. Get compatibility %, matching vs missing skills, keyword overlap.' },
  { icon: Wand2, title: 'Improve my CV', text: 'Concrete rewrite suggestions — quantified achievements, sharper summaries, better structure.' },
  { icon: Layers, title: 'Versions & history', text: 'Keep Frontend, Full-stack and Internship variants side by side with full match history.' },
];

const weights = [
  ['Experience', 25], ['Skills', 20], ['Contact', 10], ['Summary', 10],
  ['Education', 10], ['Projects', 10], ['Structure', 10], ['Certifications', 5],
];

const steps = [
  { n: '01', title: 'Upload your CV', text: 'Drag & drop a PDF, DOCX or image. Text is extracted — OCR kicks in for scans.' },
  { n: '02', title: 'Get the analysis', text: 'Grok structures your profile and scores it across 8 weighted categories.' },
  { n: '03', title: 'Match job offers', text: 'Compare against any description and close the gaps that matter.' },
];

/* CSS-only product mockup */
function ProductMock() {
  return (
    <div className="noise relative overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-[0_32px_80px_-32px_rgba(0,0,0,0.35)] dark:border-white/10 dark:bg-[#0b0d12] dark:shadow-[0_32px_100px_-24px_rgba(0,0,0,0.9)]">
      <div className="flex items-center gap-1.5 border-b border-zinc-200 px-4 py-3 dark:border-white/[0.07]">
        <span className="h-2.5 w-2.5 rounded-full bg-zinc-300 dark:bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-zinc-300 dark:bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-lime-400" />
        <span className="ml-3 hidden rounded-md bg-zinc-900/[0.05] px-2.5 py-1 font-mono text-[11px] text-zinc-500 dark:bg-white/[0.05] dark:text-zinc-500 sm:block">app.cvision.ai/analysis</span>
      </div>
      <div className="grid gap-4 p-4 sm:grid-cols-[1fr_1.2fr] sm:p-5">
        <div className="flex items-center justify-center rounded-xl border border-zinc-200 bg-[#f4f4f2] py-5 dark:border-white/[0.07] dark:bg-white/[0.02]">
          <ScoreRing value={82} size={128} label="/ 100" />
        </div>
        <div className="space-y-3">
          {[
            ['React', 92], ['TypeScript', 64], ['Node.js', 78], ['PostgreSQL', 55],
          ].map(([skill, v]) => (
            <div key={skill}>
              <div className="mb-1 flex justify-between text-xs">
                <span className="font-semibold">{skill}</span>
                <span className="font-mono tabular-nums text-zinc-500">{v}%</span>
              </div>
              <Progress value={v} />
            </div>
          ))}
          <div className="flex items-center justify-between rounded-xl bg-lime-300/[0.12] px-3.5 py-2.5 ring-1 ring-inset ring-lime-600/20 dark:bg-lime-300/[0.07] dark:ring-lime-300/15">
            <span className="text-[13px] font-semibold">Senior Frontend — Match</span>
            <span className="font-display text-lg font-bold tabular-nums text-lime-700 dark:text-lime-300">87%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Landing() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* ---------- Hero ---------- */}
      <section className="aurora bg-grid relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 pb-14 pt-16 sm:px-6 md:pt-24">
          <div className="mx-auto max-w-3xl text-center">
            <Link to="/register" className="animate-in inline-flex items-center gap-2 rounded-full border border-zinc-300 bg-white/70 py-1.5 pl-2 pr-3.5 text-[13px] font-medium text-zinc-700 backdrop-blur transition hover:border-zinc-400 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-300 dark:hover:border-white/20">
              <Badge tone="lime">New</Badge>
              Grok 4.7 analysis engine
              <ArrowUpRight size={14} />
            </Link>
            <h1 className="animate-in delay-1 mt-6 font-display text-[44px] font-bold leading-[1.02] tracking-[-0.03em] sm:text-6xl md:text-7xl">
              Your CV,
              <br />
              decoded<span className="text-lime-500 dark:text-lime-300">.</span>
            </h1>
            <p className="animate-in delay-2 mx-auto mt-5 max-w-xl text-[17px] leading-relaxed text-zinc-600 dark:text-zinc-400">
              Upload a CV, get a structured AI profile with a transparent score — then measure it against any job offer and close the gaps.
            </p>
            <div className="animate-in delay-3 mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link to="/register"><Button size="lg">Analyze my CV <ArrowRight size={17} /></Button></Link>
              <Link to="/register"><Button size="lg" variant="secondary">Try job matcher</Button></Link>
            </div>
            <p className="animate-in delay-4 mt-5 font-mono text-xs text-zinc-500">PDF · DOCX · PNG · JPG with OCR — no credit card</p>
          </div>
          <div className="animate-in delay-3 mx-auto mt-12 max-w-4xl md:mt-16">
            <ProductMock />
          </div>
        </div>
      </section>

      {/* ---------- Capabilities marquee ---------- */}
      <section className="border-y border-zinc-200 bg-white/60 py-4 dark:border-white/[0.07] dark:bg-white/[0.015]">
        <div className="overflow-hidden">
          <div className="marquee px-4">
            {[...capabilities, ...capabilities].map((c, i) => (
              <span key={i} className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-zinc-200 px-4 py-1.5 text-[13px] font-medium text-zinc-600 dark:border-white/10 dark:text-zinc-400">
                <Check size={13} className="text-lime-600 dark:text-lime-300" /> {c}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Features ---------- */}
      <section id="features" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24">
        <p className="micro-label">What it does</p>
        <h2 className="mt-3 max-w-xl font-display text-3xl font-bold tracking-tight sm:text-4xl">
          A full pipeline, from raw file to hiring signal.
        </h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, text }) => (
            <Card key={title} className="lift">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 text-white dark:bg-lime-300 dark:text-zinc-950">
                <Icon size={18} strokeWidth={2.2} />
              </span>
              <p className="mt-4 font-display text-[17px] font-bold">{title}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{text}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* ---------- Method ---------- */}
      <section id="method" className="border-y border-zinc-200 bg-white/60 dark:border-white/[0.07] dark:bg-white/[0.015]">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 md:py-24">
          <div>
            <p className="micro-label">Method — no black box</p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Every point of the score is accounted for.
            </h2>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-zinc-600 dark:text-zinc-400">
              The CV score blends 8 deterministic category weights with Grok's qualitative read. Open any analysis and see exactly where points come from — and what to fix first.
            </p>
            <div className="mt-6 flex flex-wrap gap-2.5">
              <Link to="/register"><Button>Score my CV <ArrowRight size={16} /></Button></Link>
              <span className="inline-flex items-center gap-1.5 text-sm text-zinc-500"><Cpu size={15} /> Deterministic weights + LLM judgment</span>
            </div>
          </div>
          <Card className="!p-0 overflow-hidden">
            <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-3.5 dark:border-white/[0.07]">
              <span className="font-display text-sm font-bold">CV score weights</span>
              <span className="font-mono text-xs text-zinc-500">total 100</span>
            </div>
            <div className="space-y-3.5 px-5 py-5">
              {weights.map(([label, w]) => (
                <div key={label}>
                  <div className="mb-1.5 flex justify-between text-[13px]">
                    <span className="font-medium">{label}</span>
                    <span className="font-mono tabular-nums text-zinc-500">{w}%</span>
                  </div>
                  <Progress value={w * 4} />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      {/* ---------- Steps ---------- */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24">
        <p className="micro-label">How it works</p>
        <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">Three steps to a stronger application.</h2>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {steps.map(({ n, title, text }) => (
            <div key={n} className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 dark:border-white/[0.08] dark:bg-white/[0.025]">
              <span className="font-display text-5xl font-bold text-zinc-900/10 dark:text-white/10">{n}</span>
              <p className="mt-2 font-display text-lg font-bold">{title}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Matching teaser ---------- */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 md:pb-24">
        <div className="noise relative overflow-hidden rounded-3xl bg-zinc-950 px-6 py-12 text-white dark:bg-[#0d0f14] dark:ring-1 dark:ring-inset dark:ring-white/10 sm:px-12 md:py-16">
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-lime-300/20 blur-[100px]" />
          <div className="relative grid items-center gap-8 md:grid-cols-[1.3fr_1fr]">
            <div>
              <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-lime-300"><GitCompareArrows size={14} /> Job matching</p>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
                Stop guessing. See the gap, skill by skill.
              </h2>
              <p className="mt-3 max-w-md text-[15px] leading-relaxed text-zinc-400">
                Compatibility %, matching vs missing skills, keyword overlap, experience fit — with an explanation, not just a number.
              </p>
              <Link to="/register" className="mt-6 inline-block">
                <Button className="dark:!bg-lime-300 dark:!text-zinc-950">Match a job offer <ArrowRight size={16} /></Button>
              </Link>
            </div>
            <div className="space-y-2.5 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              {[
                ['React, REST APIs, Git', true], ['TypeScript', false], ['3 yrs relevant experience', true], ['AWS exposure', false],
              ].map(([label, ok]) => (
                <div key={label} className="flex items-center gap-2.5 rounded-xl bg-white/[0.03] px-3.5 py-2.5 text-sm">
                  {ok
                    ? <Check size={15} className="shrink-0 text-lime-300" />
                    : <Minus size={15} className="shrink-0 text-zinc-500" />}
                  <span className={ok ? 'text-zinc-200' : 'text-zinc-500'}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Footer ---------- */}
      <footer className="border-t border-zinc-200 dark:border-white/[0.07]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6">
          <Logo />
          <p className="max-w-md text-center text-xs leading-relaxed text-zinc-500 sm:text-right">
            MERN · MongoDB Atlas · xAI Grok. AI-assisted analysis — recommendations to review, not hiring guarantees.
          </p>
        </div>
      </footer>
    </div>
  );
}
