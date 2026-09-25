# CVision AI — AI CV Analyzer & Smart Job Matcher

Full-stack MERN application with xAI/Grok integration. Upload a CV (PDF, DOCX, PNG, JPG with OCR), get a structured AI profile extraction + transparent CV score, paste a job description and get a compatibility analysis with matching/missing skills.

**Stack:** MongoDB Atlas · Express.js · React (Vite, JSX) · Node.js · Tailwind CSS · shadcn-style UI · Magic-UI-inspired effects · Lucide icons · Recharts · xAI/Grok.

## Features

- JWT auth (register / login / me) with bcrypt hashing
- CV upload with validation (PDF, DOCX, PNG, JPG, 10 MB max) + OCR via Tesseract.js for images
- AI extraction on the server only: profile, skills (category + level), experience, education, certifications, languages, projects, strengths/weaknesses/recommendations
- Transparent CV score (Contact 10 / Summary 10 / Skills 20 / Experience 25 / Education 10 / Projects 10 / Certifications 5 / Structure 10)
- Job CRUD (manual entry, no LinkedIn scraping) + AI matching: overall %, matching/missing skills, experience, education, keywords + explanation
- Dashboard with stat cards + recent analyses, multi-version CVs, match history (sortable/filterable), Improve-My-CV suggestions, export-to-PDF (print), dark/light theme
- Graceful fallback: without `XAI_API_KEY`, a documented heuristic engine powers analysis + matching so the app remains demoable

## Project structure

```
ai-cv-analyzer/
├── client/   # React + Vite + Tailwind + Router + Recharts
└── server/   # Express + Mongoose + JWT + Multer + xAI service
```

## Prerequisites

- Node.js 18+
- MongoDB Atlas cluster (connection string)
- xAI API key from https://console.x.ai (API Keys section)

## Installation

```bash
git clone YOUR_REPOSITORY
cd ai-cv-analyzer

# Server
cd server
npm install
cp .env.example .env   # fill in values (never commit .env)
npm run dev            # http://localhost:5000

# Client (new terminal)
cd client
npm install
cp .env.example .env
npm run dev            # http://localhost:5173
```

## Environment variables

Server (`server/.env`, see `server/.env.example`):

```
PORT=5000
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/cv_analyzer
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
XAI_API_KEY=xai-your-secret-key
XAI_MODEL=grok-4.7
```

Client (`client/.env`, see `client/.env.example`):

```
VITE_API_URL=http://localhost:5000/api
```

Never commit real credentials. `.gitignore` excludes `.env`, `node_modules`, `uploads`.

## MongoDB configuration

1. Create a free cluster at https://cloud.mongodb.com
2. Create database `cv_analyzer` (collections are auto-created by Mongoose: `users`, `resumes`, `analyses`, `jobs`, `matches`)
3. Allow your IP / `0.0.0.0/0` for development, create a DB user, paste the connection string into `MONGODB_URI`

## xAI API configuration

1. Go to https://console.x.ai → sign in → API Keys → create key
2. Set `XAI_API_KEY` in `server/.env`, optionally `XAI_MODEL` (default `grok-4.7`)
3. Server calls `https://api.x.ai/v1/chat/completions` (OpenAI-compatible) with `Authorization: Bearer <key>`, `response_format: { type: 'json_object' }`
4. Health check: `GET /api/health` reports `ai: configured | missing-key`

## API documentation

Auth header for protected routes: `Authorization: Bearer TOKEN`

| Method | Route | Description |
|---|---|---|
| POST | /api/auth/register | Register (name, email, password) |
| POST | /api/auth/login | Login |
| GET | /api/auth/me | Current profile |
| POST | /api/resumes/upload | Upload CV (`file` multipart + optional `label`) |
| GET | /api/resumes | List my CVs |
| GET | /api/resumes/:id | Get one CV |
| DELETE | /api/resumes/:id | Delete CV + analyses |
| POST | /api/analysis/:resumeId | Run AI analysis |
| GET | /api/analysis/:resumeId | Get analysis |
| POST | /api/analysis/:resumeId/improve | Improve-My-CV suggestions |
| POST | /api/jobs | Create job (title, description, company, location, url) |
| GET | /api/jobs | List jobs |
| GET | /api/jobs/:id | Get job |
| DELETE | /api/jobs/:id | Delete job |
| POST | /api/jobs/:jobId/match/:resumeId | Run AI match |
| GET | /api/jobs/:jobId/matches | Matches for a job |
| GET | /api/jobs/matches/history | Full match history |

### Matching score formula

`overall = skills×0.40 + experience×0.25 + education×0.10 + projects×0.10 + keywords×0.10 + certifications×0.05`

Documented in `server/services/matchingService.js` and shown in the Job Matcher UI.

## User journey

Landing → Register/Login → Dashboard → Upload CV → text extraction/OCR → AI analysis → CV score → Job Matcher (paste job) → match % + gaps → History.

## Screenshots

_Add screenshots of Landing, Dashboard, Analysis (radar + breakdown), Job Match here._

## Security

- JWT verified on all `/api/*` protected routes; users can only access their own `user`-scoped documents
- CORS restricted to `CLIENT_URL`, bcrypt password hashing, secrets only in server `.env`
- Multer file filter (extension + MIME) + 10 MB limit; AI responses validated/normalized before MongoDB writes

## Team

_Add names + roles here._

## Disclaimer

Scores are AI-assisted analyses, not hiring guarantees. Do not scrape LinkedIn; only import job descriptions whose terms permit reuse.
