const axios = require('axios');

const XAI_BASE_URL = 'https://api.x.ai/v1';
const DEFAULT_MODEL = process.env.XAI_MODEL || 'grok-4.7';

function hasApiKey() {
  return Boolean(process.env.XAI_API_KEY && process.env.XAI_API_KEY.trim());
}

async function chatCompletion(messages, { jsonMode = true, temperature = 0.2 } = {}) {
  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) {
    const err = new Error('XAI_API_KEY is not configured on the server.');
    err.status = 503;
    throw err;
  }
  const model = process.env.XAI_MODEL || DEFAULT_MODEL;
  try {
    const { data } = await axios.post(
      `${XAI_BASE_URL}/chat/completions`,
      {
        model,
        messages,
        temperature,
        ...(jsonMode ? { response_format: { type: 'json_object' } } : {}),
      },
      {
        headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        timeout: 90000,
      }
    );
    const content = data?.choices?.[0]?.message?.content || '';
    return { content, model };
  } catch (err) {
    const status = err?.response?.status;
    const detail = err?.response?.data?.error?.message || err?.response?.data?.message || err.message;
    const error = new Error(`AI API failure: ${detail}`);
    error.status = status === 401 ? 502 : 502;
    throw error;
  }
}

function safeParseJson(content) {
  const raw = String(content || '').trim();
  if (!raw) throw new Error('AI returned an empty response.');
  // Strip ```json fences if present
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced ? fenced[1].trim() : raw;
  // Try direct parse, then largest {...} substring
  try {
    return JSON.parse(candidate);
  } catch (e) {
    const start = candidate.indexOf('{');
    const end = candidate.lastIndexOf('}');
    if (start >= 0 && end > start) {
      return JSON.parse(candidate.slice(start, end + 1));
    }
    throw new Error('AI response was not valid JSON.');
  }
}

// ---------- Transparent CV scoring (spec §13) ----------
const CV_WEIGHTS = {
  contact: 0.1,
  summary: 0.1,
  skills: 0.2,
  experience: 0.25,
  education: 0.1,
  projects: 0.1,
  certifications: 0.05,
  structure: 0.1,
};

function clamp(n) {
  return Math.max(0, Math.min(100, Math.round(n)));
}

// Deterministic heuristic scorer — used to validate/explain the AI score
// and as the fallback when no xAI key is configured.
function heuristicCvScore(parsed) {
  const p = parsed.profile || {};
  const contactFields = [p.fullName, p.email, p.phone, p.location].filter((v) => String(v || '').trim());
  const contact = clamp((contactFields.length / 4) * 100);
  const summaryLen = String(p.summary || '').trim().length;
  const summary = summaryLen > 300 ? 95 : summaryLen > 150 ? 80 : summaryLen > 50 ? 55 : summaryLen > 0 ? 30 : 5;
  const skills = clamp(((parsed.skills || []).length / 8) * 100);
  const exp = parsed.experience || [];
  const experience = clamp((Math.min(exp.length, 4) / 4) * 100);
  const education = (parsed.education || []).length > 0 ? 90 : 10;
  const projects = clamp((Math.min((parsed.projects || []).length, 3) / 3) * 100);
  const certifications = clamp((Math.min((parsed.certifications || []).length, 2) / 2) * 100);
  const structure =
    String(parsed._rawTextLength > 500 ? 90 : parsed._rawTextLength > 200 ? 60 : 30) * 1 || 60;

  const breakdown = { contact, summary, skills, experience, education, projects, certifications, structure: Number(structure) || 60 };
  const score = clamp(
    breakdown.contact * CV_WEIGHTS.contact +
      breakdown.summary * CV_WEIGHTS.summary +
      breakdown.skills * CV_WEIGHTS.skills +
      breakdown.experience * CV_WEIGHTS.experience +
      breakdown.education * CV_WEIGHTS.education +
      breakdown.projects * CV_WEIGHTS.projects +
      breakdown.certifications * CV_WEIGHTS.certifications +
      breakdown.structure * CV_WEIGHTS.structure
  );
  return { score, breakdown };
}

function normalizeSkills(skills) {
  if (!Array.isArray(skills)) return [];
  return skills
    .map((s) => {
      if (typeof s === 'string') return { name: s, category: 'Other', level: 'Intermediate' };
      return {
        name: String(s.name || '').trim(),
        category: String(s.category || 'Other').trim() || 'Other',
        level: String(s.level || 'Intermediate').trim() || 'Intermediate',
      };
    })
    .filter((s) => s.name)
    .slice(0, 60);
}

function normalizeAnalysisPayload(parsed, rawTextLength) {
  return {
    profile: {
      fullName: String(parsed?.profile?.fullName || '').slice(0, 120),
      email: String(parsed?.profile?.email || '').slice(0, 120),
      phone: String(parsed?.profile?.phone || '').slice(0, 60),
      location: String(parsed?.profile?.location || '').slice(0, 120),
      summary: String(parsed?.profile?.summary || '').slice(0, 2000),
    },
    skills: normalizeSkills(parsed?.skills),
    experience: Array.isArray(parsed?.experience) ? parsed.experience.slice(0, 30) : [],
    education: Array.isArray(parsed?.education) ? parsed.education.slice(0, 20) : [],
    certifications: Array.isArray(parsed?.certifications) ? parsed.certifications.slice(0, 20) : [],
    languages: Array.isArray(parsed?.languages) ? parsed.languages.slice(0, 20) : [],
    projects: Array.isArray(parsed?.projects) ? parsed.projects.slice(0, 20) : [],
    strengths: (Array.isArray(parsed?.strengths) ? parsed.strengths : []).map(String).slice(0, 10),
    weaknesses: (Array.isArray(parsed?.weaknesses) ? parsed.weaknesses : []).map(String).slice(0, 10),
    recommendations: (Array.isArray(parsed?.recommendations) ? parsed.recommendations : [])
      .map(String)
      .slice(0, 10),
    _rawTextLength: rawTextLength,
  };
}

const RESUME_PROMPT = `You are an expert resume analysis assistant.
Analyze the following resume.
Extract structured information about: candidate profile, skills (with category + level), experience, education, certifications, projects, languages.
Evaluate the resume structure and completeness.
Also list strengths, weaknesses and concrete recommendations.
Return ONLY valid JSON with this shape:
{
  "profile": {"fullName": "", "email": "", "phone": "", "location": "", "summary": ""},
  "skills": [{"name": "", "category": "", "level": ""}],
  "experience": [], "education": [], "certifications": [], "languages": [], "projects": [],
  "strengths": [], "weaknesses": [], "recommendations": []
}
Resume:
{{RESUME_TEXT}}`;

const MATCH_PROMPT = `You are an AI career matching assistant.
Compare the candidate profile against the job description.
Analyze: technical skills, soft skills, experience, education, projects, certifications, keywords.
Return ONLY valid JSON with this shape:
{
  "overallScore": 0,
  "matchingSkills": [], "missingSkills": [],
  "matchingExperience": "", "missingExperience": "",
  "matchingEducation": "", "keywordScore": 0,
  "recommendations": [], "explanation": [],
  "scoreBreakdown": {"skills": 0, "experience": 0, "education": 0, "projects": 0, "keywords": 0, "certifications": 0}
}
Candidate profile (JSON):
{{CANDIDATE_JSON}}
Job description:
{{JOB_TEXT}}`;

const IMPROVE_PROMPT = `You are an expert career coach. Given the resume text below, generate 5-8 short, actionable CV improvement suggestions (rewrite tips, measurable achievements, structure). Return ONLY valid JSON: {"improvements": ["..."]}. Resume:\n{{RESUME_TEXT}}`;

function fallbackAnalysis(text) {
  // Keyword-based local fallback so the app is demoable without an xAI key.
  const emails = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi) || [];
  const phones = text.match(/[+]?[\d][\d\s().-]{7,}/g) || [];
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  const skillDict = [
    'React', 'TypeScript', 'JavaScript', 'Node.js', 'Express', 'MongoDB', 'Python', 'Java',
    'Tailwind CSS', 'Git', 'REST APIs', 'GraphQL', 'Docker', 'AWS', 'SQL', 'HTML', 'CSS',
    'Next.js', 'Vue', 'Angular', 'PostgreSQL', 'Redis', 'Kubernetes', 'Figma',
  ];
  const found = skillDict.filter((s) => new RegExp(s.replace(/[.+?^${}()|[\]\\]/g, '\\$&'), 'i').test(text));
  const parsed = {
    profile: {
      fullName: (lines[0] || '').slice(0, 120),
      email: emails[0] || '',
      phone: (phones[0] || '').trim().slice(0, 60),
      location: '',
      summary: text.slice(0, 500),
    },
    skills: found.map((name) => ({ name, category: 'Technical', level: 'Intermediate' })),
    experience: [],
    education: [],
    certifications: [],
    languages: [],
    projects: [],
    strengths: found.length ? [`Relevant technical skills: ${found.slice(0, 5).join(', ')}`] : ['CV text extracted successfully'],
    weaknesses: ['Add measurable achievements', 'Improve professional summary', 'Add more project details'],
    recommendations: [
      'Add measurable achievements with numbers (%, users, latency).',
      'Write a 2-3 line professional summary tailored to the target role.',
      'Add project links (GitHub/live demo) with tech stack.',
      'Include relevant certifications.',
    ],
    _rawTextLength: text.length,
  };
  return parsed;
}

async function analyzeResume(text) {
  const cleaned = String(text || '').slice(0, 15000);
  if (cleaned.replace(/\s/g, '').length < 20) {
    const err = new Error('Empty CV: no readable text to analyze.');
    err.status = 400;
    throw err;
  }
  if (!hasApiKey()) {
    const parsed = normalizeAnalysisPayload(fallbackAnalysis(cleaned), cleaned.length);
    const { score, breakdown } = heuristicCvScore(parsed);
    return { ...parsed, score, scoreBreakdown: breakdown, aiProvider: 'fallback', aiModel: 'heuristic-v1' };
  }
  const prompt = RESUME_PROMPT.replace('{{RESUME_TEXT}}', cleaned);
  const { content, model } = await chatCompletion([{ role: 'user', content: prompt }]);
  const parsedRaw = safeParseJson(content);
  const parsed = normalizeAnalysisPayload(parsedRaw, cleaned.length);
  const { score, breakdown } = heuristicCvScore(parsed);
  // Blend: trust deterministic weights for transparency; expose AI lists as-is.
  return { ...parsed, score, scoreBreakdown: breakdown, aiProvider: 'xai', aiModel: model };
}

async function matchResumeWithJob(candidateJson, jobText) {
  const job = String(jobText || '').slice(0, 12000);
  if (job.replace(/\s/g, '').length < 20) {
    const err = new Error('Missing job description.');
    err.status = 400;
    throw err;
  }
  if (!hasApiKey()) {
    const { fallbackMatch } = require('./matchingService');
    return { ...fallbackMatch(candidateJson, job), aiProvider: 'fallback', aiModel: 'heuristic-v1' };
  }
  const prompt = MATCH_PROMPT.replace('{{CANDIDATE_JSON}}', JSON.stringify(candidateJson).slice(0, 12000)).replace(
    '{{JOB_TEXT}}',
    job
  );
  const { content, model } = await chatCompletion([{ role: 'user', content: prompt }]);
  const parsed = safeParseJson(content);
  const { normalizeMatchPayload } = require('./matchingService');
  return { ...normalizeMatchPayload(parsed), aiProvider: 'xai', aiModel: model };
}

async function improveResume(text) {
  const cleaned = String(text || '').slice(0, 15000);
  if (!hasApiKey()) {
    return {
      improvements: [
        'Start your summary with role + years + stack, e.g. "Frontend developer with 3 years building React apps...".',
        'Turn duties into achievements: "Improved page load by 40% by code-splitting".',
        'Add tech stack to every experience and project entry.',
        'Include links: GitHub, live demos, portfolio.',
        'Add a Skills section grouped by Frontend / Backend / Database / DevOps.',
      ],
      aiProvider: 'fallback',
      aiModel: 'heuristic-v1',
    };
  }
  const prompt = IMPROVE_PROMPT.replace('{{RESUME_TEXT}}', cleaned);
  const { content, model } = await chatCompletion([{ role: 'user', content: prompt }]);
  const parsed = safeParseJson(content);
  return {
    improvements: (Array.isArray(parsed.improvements) ? parsed.improvements : []).map(String).slice(0, 10),
    aiProvider: 'xai',
    aiModel: model,
  };
}

module.exports = {
  analyzeResume,
  matchResumeWithJob,
  improveResume,
  heuristicCvScore,
  CV_WEIGHTS,
  hasApiKey,
};
