import { Card } from './ui';

function entryTitle(e, i) {
  if (!e) return `Entry ${i + 1}`;
  if (typeof e === 'string') return e.slice(0, 120);
  return e.title || e.role || e.position || e.degree || e.name || `Entry ${i + 1}`;
}

function entrySub(e) {
  if (!e || typeof e === 'string') return '';
  return [e.company, e.organization, e.school, e.institution, e.period, e.duration, e.date].filter(Boolean).join(' · ');
}

export default function ExperienceTimeline({ items = [], title = 'Experience' }) {
  if (!items.length) return null;
  return (
    <Card>
      <h3 className="mb-4 font-semibold">{title}</h3>
      <ol className="relative space-y-4 border-l border-slate-200 pl-4 dark:border-slate-700">
        {items.map((e, i) => (
          <li key={i} className="relative">
            <span className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-indigo-500" />
            <p className="text-sm font-medium">{entryTitle(e, i)}</p>
            {entrySub(e) && <p className="text-xs text-slate-500">{entrySub(e)}</p>}
            {typeof e === 'object' && e.description && (
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{String(e.description).slice(0, 300)}</p>
            )}
          </li>
        ))}
      </ol>
    </Card>
  );
}
