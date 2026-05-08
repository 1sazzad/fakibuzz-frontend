# FakiBuzz! ISTian Frontend

FakiBuzz! ISTian is a student-focused exam question analysis and prediction system. This repository contains the React frontend used by students and admins to search subjects, browse previous-year questions, review topic analysis, view predicted important questions, generate suggestions, and export results.

## Frontend Features

- Student user login and registration
- Admin login and protected admin routes
- Subject search by subject code or name
- Published question viewing by subject
- Topic analysis with repeated topics, marks, and appeared years
- Prediction result view for likely important topics or questions
- Suggested questions based on subject and query
- PDF and JSON export for suggestions
- Answer generation workflow
- Responsive UI for mobile, tablet, and desktop
- User-friendly loading, error, and empty states

## Tech Stack

- React
- Tailwind CSS
- Vite
- React Router
- Axios
- Fetch API

## Folder Structure

```text
frontend/
  public/                 Static assets
  src/
    api/                  API clients and endpoint helpers
    assets/               Frontend image and media assets
    components/           Shared UI and layout components
      ui/                 Reusable Button, Card, Badge, states, and containers
    context/              Authentication context and hooks
    pages/                Student and public pages
      admin/              Admin dashboard and management pages
    routes/               Protected route wrappers
    App.jsx               Route definitions and app shell
    main.jsx              React app entry point
    index.css             Tailwind and global styles
  index.html              Vite HTML entry
  vite.config.js          Vite configuration
  package.json            Scripts and dependencies
```

## Environment Variables

Create a local `.env` file in the frontend project root:

```env
VITE_API_BASE_URL=http://localhost:8000
```

Use placeholders only in shared documentation. Do not commit real environment values.

## Installation

```bash
npm install
npm run dev
```

The Vite development server usually runs at:

```text
http://localhost:5173
```

## Build

```bash
npm run build
```

## Preview

```bash
npm run preview
```

## API Configuration

The backend base URL should be configured through the `.env` file using `VITE_API_BASE_URL`. Avoid hardcoding backend URLs in components or pages. API calls should go through the shared API helpers in `src/api/` whenever possible.

## Security Notes

- Never commit `.env` files.
- Never expose API keys, JWT secrets, database credentials, or production credentials in frontend code.
- Never store real admin credentials in the repository.
- Use `.env.example` for placeholder values only.
- Keep secrets on the backend or in a secure deployment environment.

## Contribution and Development Guidelines

- Keep components reusable and easy to compose.
- Keep UI responsive across mobile, tablet, and desktop screens.
- Avoid hardcoded backend URLs.
- Use loading, error, and empty states for API-driven pages.
- Keep API endpoint names consistent with the backend.
- Prefer small, focused components over duplicated JSX.
- Test important user flows before submitting changes.

## Known Limitations and Future Improvements

- Better dashboard UI with richer student progress insights
- More mobile optimization for dense admin views
- Improved export preview before PDF download
- Notification or toast system for success and error feedback
- More detailed client-side validation for forms
