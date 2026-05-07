# FakiBuzz! ISTian - Frontend

A React + Vite frontend for the FakiBuzz! ISTian exam-question intelligence system. The UI is aligned to the backend's subject-first workflow: students discover published data by subject, then search, analyze, predict, and generate answers. Admin exam ingestion is kept in a separate route.

## Routes

- `/` - Subject discovery and published question browser
- `/search` - Semantic search for similar questions
- `/analysis` - Topic analysis for a subject
- `/predict` - Question prediction for a subject
- `/answers` - Answer generation
- `/admin/exams` - Admin exam ingestion

Legacy redirect routes were removed to keep the frontend aligned with the current backend API.

## Backend Integration

The frontend service layer in [src/api/api.js](src/api/api.js) targets the current backend route groups:

- `GET /health`
- `GET /subjects/search?query=`
- `GET /subjects/{subject_code}/overview`
- `GET /subjects`
- `GET /subjects/{subject_code}/questions`
- `POST /search`
- `GET /subjects/{subject_code}/analysis`
- `GET /subjects/{subject_code}/prediction`
- `POST /answers/generate`
- `POST /admin/exams`

The frontend does not currently surface the optional student upload or extraction workflow in the UI.

## Project Structure

```text
frontend/
├── src/
│   ├── api/
│   │   └── api.js
│   ├── components/
│   │   └── Navbar.jsx
│   ├── pages/
│   │   ├── QuestionsPage.jsx
│   │   ├── SimilarQuestionsPage.jsx
│   │   ├── TopicsPage.jsx
│   │   ├── PredictionsPage.jsx
│   │   ├── GenerateAnswerPage.jsx
│   │   └── UploadPage.jsx
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
│   └── index.css
├── public/
├── index.html
├── vite.config.js
├── eslint.config.js
└── package.json
```

## Setup

### Prerequisites

- Node.js 16 or higher
- npm
- Backend server running on `http://127.0.0.1:8000`

### Install

```bash
npm install
```

### Run

```bash
npm run dev
```

The app runs at `http://localhost:5173`.

### Build

```bash
npm run build
```

### Preview

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

## Frontend Behavior

- The home page now acts as subject discovery, not legacy question browsing.
- Questions, analysis, and prediction pages load published data only.
- The admin upload page uses `POST /admin/exams`.
- Navigation has been trimmed to the active routes only.

## Notes

- Published data is the default student-facing source.
- Subject discovery uses `GET /subjects/search` and `GET /subjects/{subject_code}/overview`.
- Answer generation uses `POST /answers/generate` with related published questions as context.
