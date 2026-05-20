# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Development Commands

### Frontend (root directory)
- Install dependencies: `npm i`
- Dev server: `npm run dev` (Vite on http://localhost:8080)
- Build: `npm run build` (outputs to `dist/`)
- Build dev mode: `npm run build:dev`
- Preview production build: `npm run preview`
- Lint: `npm run lint`

### Backend (server/ directory)
- Install dependencies: `npm i` (run in `server/` directory)
- Dev server: `npm run dev` (nodemon, hot-reload on http://localhost:5000)
- Production: `npm start`
- Environment setup: Copy `server/.env.example` to `server/.env` and configure:
  - `GEMINI_API_KEY` - **Note**: README mentions Gemini but code uses Groq
  - `GROQ_API_KEY` - Actually required by `server/services/scriptGenerator.js`
  - `DID_API_KEY` - Optional, for D-ID avatar video generation
  - `PORT` - Default 5000

### Python Video Generation (src/video_lecture/)
- Setup virtual environment:
  ```pwsh
  python -m venv .venv
  . .venv/Scripts/Activate.ps1  # Windows
  pip install -r requirements.txt
  ```
- Generate video from notes:
  ```pwsh
  python -m src.video_lecture.cli notes_example.md --theme dark --voice "Zira" --rate 180
  ```
- Output: `out/lecture_YYYYMMDD_HHMMSS.mp4` and `.srt`
- Options: `--font`, `--music`, `--width/--height`, `--fps`, `--tts-provider edge|pyttsx3`, `--kenburns`, `--crossfade`, `--keep-temp`

### Testing
No test framework is configured. To add tests, install a test runner (e.g., Vitest for frontend, Jest for backend, pytest for Python).

## Architecture Overview

### System Components
This is a multi-tier application for converting educational notes into AI-generated video lectures:

1. **React Frontend** (Vite + TypeScript) - User uploads documents and configures lecture generation
2. **Express Backend** (Node.js) - Handles document parsing, AI script generation, and orchestrates video creation
3. **Python Video Generator** (MoviePy) - Renders slides with TTS audio into MP4 videos
4. **SQLite Database** (better-sqlite3) - Stores user accounts, uploads, and video metadata

### Data Flow

**Standard Flow (MoviePy):**
1. User uploads document → `POST /api/upload`
2. Backend parses document (PDF/DOCX/TXT) → stores in `server/uploads/`
3. User requests lecture → `POST /api/lecture/generate` → Groq LLM generates script
4. User requests video → `POST /api/video/generate` → spawns Python subprocess
5. Python: Parse script → TTS synthesis → Render slides → Concatenate video
6. Output saved to `server/outputs/videos/` → served via `/outputs` static route

**D-ID Avatar Flow (Optional):**
1. Same upload/script generation
2. Video generation with `provider: "did"` option
3. Backend calls D-ID API for each scene → polls for completion → downloads MP4
4. For `provider: "did-scene"`, uses scene-aware composition with Python composer

### Frontend Architecture

**Stack**: React 18 + TypeScript + Vite + TanStack Query + React Router + shadcn/ui + Tailwind CSS

- **Entry**: `src/App.tsx` wraps app in QueryClient, AuthContext, TooltipProvider, BrowserRouter
- **Routing**: Defined in `src/App.tsx`, includes landing pages, account pages, catch-all 404
- **UI Components**: shadcn/ui primitives in `src/components/ui/`, custom components in `src/components/`
- **Pages**: Main landing at `src/pages/Index.tsx`, others in `src/pages/`
- **API Client**: `src/services/api.ts` exports `uploadDocument()`, `generateLecture()`, `healthCheck()`
- **Auth**: `src/contexts/AuthContext.tsx` provides user authentication state
- **Path Alias**: `@/*` resolves to `./src/*` (configured in `vite.config.ts` and `tsconfig.json`)
- **Dev Tool**: `lovable-tagger` plugin enabled in development mode only

### Backend Architecture

**Stack**: Express 5 + Node.js (CommonJS) + better-sqlite3 + Multer + Groq SDK

**Entry**: `server/index.js`
- Sets up CORS, JSON/urlencoded parsing (5MB limit)
- Serves `/outputs` as static with video streaming support (range requests)
- Mounts routes: `/api/auth`, `/api/upload`, `/api/lecture`, `/api/video`
- Health check: `GET /api/health`

**Routes**:
- `routes/auth.js`: User registration, login (JWT with bcrypt)
- `routes/upload.js`: Multer multipart upload, document parsing, stores in `uploads/`
- `routes/lecture.js`: Takes documentId + mode/style, generates script via Groq LLM
- `routes/video.js`: Orchestrates video generation (MoviePy subprocess or D-ID API)

**Services**:
- `services/documentParser.js`: Extracts text from PDF (pdf-parse), DOCX (mammoth), TXT
- `services/scriptGenerator.js`: Groq LLM integration with model fallback (llama-3.3-70b-versatile → llama-3.1-8b-instant → mixtral-8x7b). Generates lecture scripts with mode (summary/detailed/test) and style (professor/visual). Also generates scene breakdowns for video production.
- `services/video.js`: Spawns Python CLI subprocess to generate video from script file
- `services/did.js`: D-ID API integration for avatar videos (createTalk, pollTalk, download)
- `services/sceneComposer.js`: Scene-aware video composition using D-ID + Python

**Database** (`db/database.js`): SQLite with tables:
- `users`: id, email, password (bcrypt), name, timestamps
- `user_uploads`: Tracks uploaded documents per user
- `user_videos`: Tracks generated videos per user

**Authentication**: JWT tokens (jsonwebtoken), middleware in `middleware/auth.js`

### Python Video Generator

**Location**: `src/video_lecture/`

**Key Modules**:
- `cli.py`: Main CLI entry point, parses arguments, invokes LectureMaker
- `assemble.py`: `LectureMaker` class orchestrates full pipeline
- `slides.py`: Parses script into sections, renders slides as PNG using Pillow
- `tts.py`: `TTS` class supports edge-tts (cloud) or pyttsx3 (local) with voice/rate configuration
- `subtitles.py`: Generates SRT subtitle files from text + durations
- `scene_cli.py`: Alternate entry for scene-based composition (avatar clips + slides)
- `scene_components.py`: Scene rendering with avatar video overlay

**Pipeline**:
1. Parse script into sections (split by `#`/`##` headings or `---`)
2. Render each section as slide image (dark/light theme)
3. TTS synthesis for each section → WAV files
4. Build MoviePy ImageClips with audio, optional Ken Burns effect
5. Concatenate with crossfade, optional background music (8% volume)
6. Write MP4 (libx264, AAC, 3000k bitrate, ultrafast preset, multi-threaded)
7. Generate SRT subtitles

**Output**: `out/lecture_<timestamp>.mp4` and `.srt`

## Configuration and Ports

- **Frontend**: http://localhost:8080 (Vite dev server)
- **Backend**: http://localhost:5000 (Express API)
- **Vite Proxy**: `/api` requests proxied to backend in dev mode (see `vite.config.ts`)
- **Static Assets**: Backend serves `/outputs` for generated videos and scripts
- **Upload Limit**: 5MB for JSON bodies, file uploads via Multer (10MB default)

## Key Conventions

- **Module Systems**: Frontend uses ES modules, backend uses CommonJS (`require`), Python uses absolute imports
- **File Naming**: React components use PascalCase, service/util files use camelCase
- **API Responses**: Consistent `{ success: boolean, ...data, message?: string, error?: string }` format
- **Error Handling**: Express error middleware logs and returns 500 with error message
- **Timestamps**: Use `Date.now()` or `new Date().toISOString()` for filenames/IDs
- **Temp Files**: Python uses `tempfile.mkdtemp()` with cleanup, keeps with `--keep-temp` flag

## Important Notes

### API Key Discrepancy
The `.env.example` and `server/README.md` reference `GEMINI_API_KEY`, but the actual code in `server/services/scriptGenerator.js` uses the **Groq SDK** and requires `GROQ_API_KEY`. Update environment configuration accordingly.

### Windows-Specific Paths
Python subprocess calls use `.venv/Scripts/python.exe` for Windows. Adjust for Linux/macOS (`bin/python`).

### Video Providers
- Default: MoviePy (no API key required)
- D-ID: Set `DID_API_KEY` for avatar videos, use `provider: "did"` or `provider: "did-scene"`
- TTS: edge-tts (requires internet) or pyttsx3 (offline), auto-detects or use `--tts-provider`

### Claude Rules Context
This project has Claude agent rules in `.claude/` for SEO page generation orchestration. These rules are specific to a different workflow (spawning design agents for SEO content) and are not part of the core lecture video generation application.
