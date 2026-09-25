import { Card, Progress } from './ui';

export function AnimatedNumber({ value }) {
  return <span className="tabular-nums">{value}</span>;
}

export default function ScoreCard({ score = 0, breakdown = {}, title = 'Overall CV Score' }) {
  return (
    <Card className="beam-card spotlight">
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <p className="mt-1 text-5xl font-extrabold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
        <AnimatedNumber value={score} /> <span className="text-xl text-slate-400">/ 100</span>
      </p>
      <div className="mt-4 space-y-2">
        {Object.entries(breakdown).map(([k, v]) => (
          <div key={k}>
            <div className="mb-1 flex justify-between text-xs capitalize text-slate-500">
              <span>{k}</span>
              <span>{v}%</span>
            </div>
            <Progress value={v} />
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs text-slate-400">AI-assisted analysis, not a hiring guarantee.</p>
    </Card>
  );
}
