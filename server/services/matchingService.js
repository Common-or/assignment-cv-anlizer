// Transparent job-matching score (spec §14).
// Category weights: skills 40, experience 25, education 10, projects 10, keywords 10, certifications 5.
const MATCH_WEIGHTS = {
  skills: 0.4,
  experience: 0.25,
  education: 0.1,
  projects: 0.1,
  keywords: 0.1,
  certifications: 0.05,
};

function clamp(n) {
  return Math.max(0, Math.min(100, Math.round(n)));
}

function tokenize(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[^a-z0-9+#. ]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2);
}

function extractKeywords(text, limit = 40) {
  const stop = new Set([
    'the', 'and', 'for', 'with', 'you', 'your', 'our', 'are', 'have', 'has', 'will',
    'from', 'that', 'this', 'with', 'role', 'join', 'team', 'work', 'working', 'ability',
    'experience', 'years', 'year', 'plus', 'including', 'within',
  ]);
  const freq = new Map();
  for (const t of tokenize(text)) {
    if (stop.has(t)) continue;
    freq.set(t, (freq.get(t) || 0) + 1);
  }
  return [...freq.entries()].sort((a, b) => b[1] - a[1]).slice(0, limit).map(([w]) => w);
}

function skillNames(candidate) {
  const skills = candidate?.skills || [];
  return skills.map((s) => (typeof s === 'string' ? s : s.name)).filter(Boolean);
}

function fallbackMatch(candidate, jobText) {
  const names = skillNames(candidate);
  const jobLower = String(jobText).toLowerCase();
  const matchingSkills = names.filter((n) => jobLower.includes(String(n).toLowerCase()));
  // Guess missing skills: capitalized tech tokens in job not present in CV
  const techTokens = [...new Set((String(jobText).match(/[A-Z][A-Za-z0-9+#.]{2,}/g) || []).map((s) => s.trim()))];
  const cvLower = JSON.stringify(candidate || {}).toLowerCase();
  const missingSkills = techTokens.filter((t) => !cvLower.includes(t.toLowerCase())).slice(0, 10);

  const skillsScore = names.length ? clamp((matchingSkills.length / Math.max(names.length, 1)) * 100) : 20;
  const expCount = (candidate?.experience || []).length;
  const experienceScore = clamp((Math.min(expCount, 4) / 4) * 100);
  const educationScore = (candidate?.education || []).length ? 85 : 40;
  const projectsScore = clamp((Math.min((candidate?.projects || []).length, 3) / 3) * 100);
  const keywords = extractKeywords(jobText);
  const keywordHits = keywords.filter((k) => cvLower.includes(k)).length;
  const keywordsScore = keywords.length ? clamp((keywordHits / keywords.length) * 100) : 30;
  const certsScore = (candidate?.certifications || []).length ? 80 : 30;

  const scoreBreakdown = {
    skills: skillsScore,
    experience: experienceScore,
    education: educationScore,
    projects: projectsScore,
    keywords: keywordsScore,
    certifications: certsScore,
  };
  const overallScore = clamp(
    skillsScore * MATCH_WEIGHTS.skills +
      experienceScore * MATCH_WEIGHTS.experience +
      educationScore * MATCH_WEIGHTS.education +
      projectsScore * MATCH_WEIGHTS.projects +
      keywordsScore * MATCH_WEIGHTS.keywords +
      certsScore * MATCH_WEIGHTS.certifications
  );

  const explanation = [
    ...matchingSkills.slice(0, 5).map((s) => `+ Strong ${s} alignment with the job requirements`),
    ...missingSkills.slice(0, 4).map((s) => `- ${s} not clearly demonstrated in the CV`),
  ];
  if (!expCount) explanation.push('- No structured experience entries detected');

  return {
    overallScore,
    scoreBreakdown,
    matchingSkills,
    missingSkills,
    matchingExperience: expCount ? `${expCount} experience entr${expCount > 1 ? 'ies' : 'y'} found in CV` : 'No structured experience detected',
    missingExperience: missingSkills.length ? `Consider evidencing: ${missingSkills.slice(0, 3).join(', ')}` : '',
    matchingEducation: (candidate?.education || []).length ? 'Education history present' : 'No education entries detected',
    keywordScore: keywordsScore,
    recommendations: [
      missingSkills.length ? `Add or evidence missing skills: ${missingSkills.slice(0, 5).join(', ')}` : 'CV covers the key job skills well',
      'Mirror the job description keywords in your summary and experience bullets.',
      'Quantify achievements relevant to this role.',
    ],
    explanation,
  };
}

function normalizeMatchPayload(parsed) {
  const num = (v, d = 0) => (Number.isFinite(Number(v)) ? clamp(Number(v)) : d);
  const str = (v) => String(v || '');
  const arr = (v) => (Array.isArray(v) ? v.map(String).slice(0, 30) : []);
  const bd = parsed?.scoreBreakdown || {};
  const scoreBreakdown = {
    skills: num(bd.skills, 50),
    experience: num(bd.experience, 50),
    education: num(bd.education, 50),
    projects: num(bd.projects, 50),
    keywords: num(bd.keywords, 50),
    certifications: num(bd.certifications, 50),
  };
  return {
    overallScore: num(parsed?.overallScore ?? parsed?.overall_score, 0),
    scoreBreakdown,
    matchingSkills: arr(parsed?.matchingSkills),
    missingSkills: arr(parsed?.missingSkills),
    matchingExperience: str(parsed?.matchingExperience),
    missingExperience: str(parsed?.missingExperience),
    matchingEducation: str(parsed?.matchingEducation),
    keywordScore: num(parsed?.keywordScore, scoreBreakdown.keywords),
    recommendations: arr(parsed?.recommendations).slice(0, 10),
    explanation: arr(parsed?.explanation).slice(0, 12),
  };
}

module.exports = { MATCH_WEIGHTS, fallbackMatch, normalizeMatchPayload, extractKeywords };
