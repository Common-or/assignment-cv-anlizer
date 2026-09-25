import { Card, Progress, ScoreRing } from './ui';

const WEIGHT_LABELS = {
  contact: 'Contact',
  summary: 'Summary',
  skills: 'Skills ×2',
  experience: 'Experience ×2.5',
  education: 'Education',
  projects: 'Projects',
  certifications: 'Certifications',
  structure: 'Structure',
};

export default function ScoreCard({ score = 0, breakdown = {}, title = 'Overall CV Score' }) {
  const entries = Object.entries(breakdown);
  return (
    <Card className="overflow-hidden">
      <div className="flex flex-wrap items-center gap-6">
        <ScoreRing value={score} size={132} label="/ 100" />
        <div className="min-w-[200px] flex-1">
          <p className="micro-label">{title}</p>
          <p className="mt-1 font-display text-xl font-bold">
            {score >= 75 ? 'Strong profile' : score >= 50 ? 'Solid base, gaps to fix' : 'Needs structural work'}
          </p>
          <p className="mt-1 max-w-sm text-[13px] leading-relaxed text-zinc-500 dark:text-zinc-500">
            Weighted across 8 categories. AI-assisted — a signal for you, not a recruiter's verdict.
          </p>
        </div>
      </div>
      {entries.length > 0 && (
        <div className="mt-5 grid gap-x-6 gap-y-3 border-t border-zinc-200 pt-5 dark:border-white/[0.07] sm:grid-cols-2">
          {entries.map(([k, v]) => (
            <div key={k}>
              <div className="mb-1.5 flex items-baseline justify-between text-[13px]">
                <span className="font-medium text-zinc-600 dark:text-zinc-400">{WEIGHT_LABELS[k] || k}</span>
                <span className="font-mono font-semibold tabular-nums">{v}</span>
              </div>
              <Progress value={v} />
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
