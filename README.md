
# Resume Optimizer AI

Upload your resume and paste a target job description to receive AI-powered suggestions for improving your resume and increasing its match rate.

## Overview

Resume Optimizer AI is a React + Vite application that analyzes a candidate's resume against a target job description using Google's Gemini AI. It highlights:

- compatibility score
- missing keywords
- suggested resume improvements
- example rewrites and improvement categories

## Features

- Upload a resume in PDF format
- Paste or type a target job description
- AI analysis powered by Gemini 2.5 Flash
- Get a match score from 0-100
- See missing keywords and critical skill gaps
- Receive actionable suggestions with examples
- Review suggested improvements grouped by impact and type

## Tech Stack

- React 19
- TypeScript
- Vite
- Google GenAI SDK

## Local Setup

### Prerequisites

- Node.js 18+
- npm
- A Google Gemini API key

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env.local` file in the project root and add your Gemini API key:

```env
API_KEY=your_google_gemini_api_key_here
```

### 3. Run the app locally

```bash
npm run dev
```

The app should open at `http://localhost:5173`.

### 4. Build for production

```bash
npm run build
```

## How It Works

1. Upload a resume PDF.
2. Paste the job description you are targeting.
3. The app sends the resume and description to Gemini.
4. Gemini extracts resume content and compares it with the job requirements.
5. The app displays:
   - compatibility score
   - skills/keywords missing from the resume
   - targeted suggestions to improve alignment

## Project Structure

```text
Resume-Optimizer-AI/
├── App.tsx
├── components/
│   ├── AnalysisDisplay.tsx
│   ├── ErrorMessage.tsx
│   ├── FileUpload.tsx
│   ├── Loader.tsx
│   └── icons/
├── constants.ts
├── index.html
├── index.tsx
├── package.json
├── services/
│   └── geminiService.ts
├── types.ts
├── tsconfig.json
├── vite.config.ts
├── .gitignore
├── .env.local
└── README.md
```

## Notes

- Resume uploads are expected to be PDF files.
- The app is designed for text-based PDF resumes for best results.
- Gemini output is validated against a structured JSON schema to return clear analysis results.

## License

This project is currently unlicensed unless otherwise specified.
