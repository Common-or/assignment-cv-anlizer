import { Link } from 'react-router-dom';
import { Sparkles, UploadCloud, Briefcase, BarChart3, ArrowRight, CheckCircle2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import { Button, Card, Badge } from '../components/ui';

const features = [
  { icon: UploadCloud, title: 'Smart CV upload', text: 'PDF, DOCX and images with OCR. Staged progress from upload to insights.' },
  { icon: Sparkles, title: 'Grok AI extraction', text: 'Profile, skills, experience, education, projects and languages as structured JSON.' },
  { icon: BarChart3, title: 'Transparent CV score', text: 'Weighted 8-category score with strengths, gaps and recommendations.' },
  { icon: Briefcase, title: 'Job matching engine', text: 'Compatibility %, matching/missing skills and keyword analysis per offer.' },
];

export default function Landing() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <section className="hero-gradient">
        <div className="mx-auto max-w-7xl px-4 pb-16 pt-16 text-center md:pt-24">
          <Badge tone="indigo" className="mb-4">MERN · MongoDB Atlas · xAI Grok</Badge>
          <h1 className="mx-auto max-w-3xl text-4xl font-extrabold tracking-tight md:text-6xl">
            Understand Your CV.
            <span className="block bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Match Your Career.</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
            AI-powered CV analysis and job compatibility in one intelligent workspace.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/register"><Button className="px-6 py-3 text-base">Analyze My CV <ArrowRight size={16} /></Button></Link>
            <Link to="/register"><Button variant="secondary" className="px-6 py-3 text-base">Try Job Matcher</Button></Link>
          </div>
          <Card className="beam-card mx-auto mt-12 max-w-3xl text-left">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">CV SCORE PREVIEW</p>
              <Badge tone="green">82 / 100</Badge>
            </div>
            <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div className="h-full w-[82%] rounded-full bg-gradient-to-r from-indigo-500 to-violet-500" />
            </div>
            <div className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
              <p className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-500" /> Relevant technical skills</p>
              <p className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-500" /> Good professional experience</p>
              <p className="text-amber-700 dark:text-amber-300">• Add measurable achievements</p>
              <p className="text-amber-700 dark:text-amber-300">• Improve professional summary</p>
            </div>
          </Card>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14">
        <h2 className="text-center text-2xl font-bold">How it works</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-4">
          {features.map(({ icon: Icon, title, text }) => (
            <Card key={title} className="spotlight animate-in">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200">
                <Icon size={20} />
              </div>
              <p className="font-semibold">{title}</p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{text}</p>
            </Card>
          ))}
        </div>
        <div className="mt-10 overflow-hidden rounded-2xl border border-slate-200 py-3 dark:border-slate-800">
          <div className="marquee px-4 text-sm text-slate-500">
            {['React', 'Node.js', 'MongoDB Atlas', 'Express', 'Grok 4.7', 'Tailwind CSS', 'shadcn/ui', 'Recharts', 'Tesseract OCR', 'JWT'].concat(['React', 'Node.js', 'MongoDB Atlas', 'Express', 'Grok 4.7', 'Tailwind CSS', 'shadcn/ui', 'Recharts', 'Tesseract OCR', 'JWT']).map((t, i) => (
              <span key={i} className="rounded-full bg-slate-100 px-4 py-1 dark:bg-slate-800">{t}</span>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 py-8 text-center text-sm text-slate-500 dark:border-slate-800">
        CVision AI — Full-Stack MERN project with xAI/Grok integration. AI suggestions are recommendations to review.
      </footer>
    </div>
  );
}
