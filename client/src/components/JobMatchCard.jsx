import { Card, Badge, Progress } from './ui';
import { CheckCircle2, XCircle } from 'lucide-react';

export default function JobMatchCard({ match }) {
  if (!match) return null;
  return (
    <Card className="animate-in">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Job Match — {match.overallScore}% compatibility</h3>
        <Badge tone={match.overallScore >= 75 ? 'green' : match.overallScore >= 50 ? 'amber' : 'red'}>
          {match.overallScore >= 75 ? 'Strong match' : match.overallScore >= 50 ? 'Partial match' : 'Weak match'}
        </Badge>
      </div>
      <Progress value={match.overallScore} className="mt-3" />
      {match.scoreBreakdown && (
        <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-500 sm:grid-cols-3">
          {Object.entries(match.scoreBreakdown).map(([k, v]) => (
            <div key={k} className="rounded-lg bg-slate-50 p-2 dark:bg-slate-800/60">
              <span className="capitalize">{k}</span>: <strong>{v}%</strong>
            </div>
          ))}
        </div>
      )}
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div>
          <p className="mb-2 text-sm font-medium text-emerald-700 dark:text-emerald-300">Matching skills</p>
          <div className="flex flex-wrap gap-1.5">
            {(match.matchingSkills || []).map((s) => (
              <span key={s} className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200">
                <CheckCircle2 size={12} /> {s}
              </span>
            ))}
            {!match.matchingSkills?.length && <span className="text-sm text-slate-400">None detected</span>}
          </div>
        </div>
        <div>
          <p className="mb-2 text-sm font-medium text-red-700 dark:text-red-300">Missing skills</p>
          <div className="flex flex-wrap gap-1.5">
            {(match.missingSkills || []).map((s) => (
              <span key={s} className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-1 text-xs text-red-800 dark:bg-red-900/40 dark:text-red-200">
                <XCircle size={12} /> {s}
              </span>
            ))}
            {!match.missingSkills?.length && <span className="text-sm text-slate-400">None — great coverage</span>}
          </div>
        </div>
      </div>
      {(match.explanation || []).length > 0 && (
        <div className="mt-4 rounded-xl bg-slate-50 p-3 text-sm dark:bg-slate-800/60">
          <p className="mb-1 font-medium">Why this score?</p>
          <ul className="list-disc space-y-1 pl-5 text-slate-600 dark:text-slate-300">
            {match.explanation.map((e, i) => <li key={i}>{e}</li>)}
          </ul>
        </div>
      )}
      {(match.recommendations || []).length > 0 && (
        <div className="mt-3 text-sm">
          <p className="mb-1 font-medium">Recommendations</p>
          <ul className="list-disc space-y-1 pl-5 text-slate-600 dark:text-slate-300">
            {match.recommendations.map((r, i) => <li key={i}>{r}</li>)}
          </ul>
        </div>
      )}
    </Card>
  );
}
