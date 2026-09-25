import { Badge } from './ui';

export default function SkillBadge({ skill }) {
  if (typeof skill === 'string') return <Badge tone="lime">{skill}</Badge>;
  return (
    <Badge tone="lime" title={`${skill.category || 'Skill'} · ${skill.level || ''}`}>
      {skill.name} <span className="ml-1 opacity-60">· {skill.level}</span>
    </Badge>
  );
}
