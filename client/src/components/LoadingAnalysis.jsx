import { Skeleton } from './ui';

const STAGES = ['Uploading CV…', 'Extracting content…', 'Understanding profile…', 'Analyzing skills…', 'Evaluating experience…', 'Generating score…', 'Preparing recommendations…'];

export default function LoadingAnalysis({ stage = 0 }) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-indigo-700 dark:text-indigo-300">{STAGES[Math.min(stage, STAGES.length - 1)]}</p>
      <Skeleton className="h-24 w-full" />
      <div className="grid gap-3 md:grid-cols-3">
        <Skeleton className="h-20" />
        <Skeleton className="h-20" />
        <Skeleton className="h-20" />
      </div>
    </div>
  );
}
