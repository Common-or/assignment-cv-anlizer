import { Badge } from './ui';

export default function SkillBadge({ skill }) {
  if (typeof skill === 'string') return <Badge tone="indigo">{skill}</Badge>;
  return (
    <Badge tone="indigo" title={`${skill.category || 'Skill'} · ${skill.level || ''}`}>
      {skill.name} <span className="ml-1 opacity-60">· {skill.level}</span>
    </Badge>
  );
}
