<div align="center">
   
# PreplitAI, Inc.


<img width="1561" height="873" alt="image" src="https://github.com/user-attachments/assets/00af0490-8d58-4492-b618-25d151918f02" />



![Status](https://img.shields.io/badge/status-pre--launch-8b0000?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-darkred?style=flat-square)
![License](https://img.shields.io/badge/license-Apache%202.0-8b0000?style=flat-square)
![Waitlist](https://img.shields.io/badge/join-waitlist-8b0000?style=flat-square)
![Powered by AI](https://img.shields.io/badge/powered%20by-AI-darkred?style=flat-square)

Copyright (c) 2026 Preplit/CTO

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

[Join the Waitlist](https://getlaunchlist.com/pages/preplit-ai) · [Documentation](https://drive.google.com/file/d/1VNm1BA-rR8pn24eK9EVjm6_sHPT2zlky/view?usp=sharing) · [Report a Bug](https://github.com/ahsann826/PreplitAI-Inc/issues) · [Request a Feature](https://github.com/ahsann826/PreplitAI-Inc/issues)

</div>

---

# PreplitAI
 
PreplitAI is an AI-powered EdTech platform that converts static educational documents — PDFs, Word files, and plain-text notes — into fully produced, narrated video lectures. No recording. No editing. No technical skill required.
 
Upload a document, choose a generation mode and style, and the system handles script writing, scene generation, voice synthesis, video rendering, and delivery automatically.
 
## About the Project
 
There is a massive amount of written educational content in the world — lecture notes, study guides, textbook summaries, course outlines — that never gets converted into the format learners engage with most: video.
 
Converting notes to video manually requires recording equipment, editing software, design skills, and hours of effort. Most students and educators simply don't have that.
 
PreplitAI removes every one of those barriers. Upload your notes. Get a complete video lecture out.
 
## How It Works
 
```
[ Document Upload ]
        ↓
[ AI parses content & generates a lecture script ]
        ↓
[ Script converted into structured scene JSON ]
        ↓
[ Neural voice narration synthesized per scene ]
        ↓
[ Scenes rendered in parallel & stitched into final video ]
        ↓
[ Video uploaded to cloud storage & delivered ]
```
 
1. **Upload** — Submit a PDF, DOCX, DOC, or TXT file.
2. **Structure** — The AI parses the document, identifies key concepts, and generates a spoken-word lecture script, then converts it into a structured scene-by-scene JSON breakdown.
3. **Generate** — Each scene's narration is synthesized into natural voice audio, and each scene is rendered as video in parallel.
4. **Deliver** — Finished scene clips are stitched into a single video and uploaded for streaming and download.
## Current Status
 
PreplitAI is under active development. The core pipeline — document upload, script generation, and structured scene generation — is fully operational. The video rendering layer is in the process of migrating to a new architecture (see below) and is not yet fully wired into the production pipeline, so generation times and output quality are actively improving.
 
This project is pre-launch and not yet recommended for production use with real user data.
 
## Key Features
 
| Feature | Description |
|---|---|
| Document-to-Video Conversion | Converts PDF, DOCX, DOC, or TXT notes into a complete video lecture |
| AI Script Generation | Generates a structured, spoken-word lecture script from raw document text |
| Scene-Based Structuring | Breaks the lecture into typed scenes (definitions, flowcharts, timelines, comparisons, diagrams, charts, bullet points) |
| Neural AI Narration | Natural-sounding voice synthesis, generated per scene |
| Parallel Video Rendering | Scenes render concurrently for faster turnaround |
| 100% Web-Based | No installs, no setup — works entirely in the browser |
| Easy Sharing | Cloud-hosted video with a permanent shareable link |
| Credit-Based Usage | New accounts start with free credits to evaluate the product |
 
## Tech Stack
 
| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS |
| Backend | Node.js, Express |
| Database | SQLite (`better-sqlite3`) |
| LLM / Scripting | Groq API (`llama-3.3-70b-versatile`) for script and scene JSON generation |
| Voice Synthesis | ElevenLabs API — neural text-to-speech, synthesized in parallel per scene |
| Video Rendering | Remotion — headless React-based scene renderer, parallel workers |
| Video Assembly | FFmpeg — stitches rendered scene clips into a final video |
| Cloud Storage | Cloudinary — permanent, CDN-backed video hosting |
| Payments | Stripe — credit package purchases |
 
The platform is migrating its rendering layer from an earlier Python-based pipeline (`edge-tts` + `moviepy`) to the ElevenLabs + Remotion architecture described above. This migration is in progress; the Python pipeline remains in the codebase as a fallback reference during the transition.
 
Stack subject to change as the product evolves.
 
## Getting Started
 
### Prerequisites
 
- Node.js 20.x LTS
- npm 10.x (bundled with Node)
- Git
- FFmpeg (handled automatically via `ffmpeg-static`, no system install required)
- Python 3.10+ (only required if running the legacy Python rendering pipeline)
### Installation
 
```bash
# 1. Clone the repository
git clone https://github.com/preplit-ai/preplit.git
cd preplit
 
# 2. Install server dependencies
cd server
npm install
 
# 3. Install frontend dependencies
cd ../client
npm install
 
# 4. Set up environment variables
cp server/.env.example server/.env
cp client/.env.example client/.env
# Fill in your API keys and config in both .env files
```
 
### Running Locally
 
Run the backend and frontend as separate processes.
 
**Terminal 1 — Backend**
```bash
cd server
npm run dev
```
The server starts on `http://localhost:5000`. The SQLite database is created automatically on first run.
 
**Terminal 2 — Frontend**
```bash
cd client
npm run dev
```
The frontend starts on `http://localhost:5173` with hot module replacement, proxying API requests to the backend.
 
### Environment Variables
 
| Variable | Required | Description |
|---|---|---|
| `GROQ_API_KEY` | Yes | Groq Cloud API key for LLM inference |
| `ELEVENLABS_API_KEY` | Yes | ElevenLabs API key for neural voice synthesis |
| `CLOUDINARY_URL` | Yes | Cloudinary connection string (or use separate cloud name / key / secret vars) |
| `STRIPE_SECRET_KEY` | Yes | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | Yes | Stripe webhook signing secret |
| `JWT_SECRET` | Yes | Random string used to sign authentication tokens |
| `VITE_API_URL` | Yes (production) | Public API base URL for the deployed frontend |
 
See `.env.example` in each directory for the full list.
 
## Repository Structure
 
```
.
├── server/                # Node.js Express backend
│   ├── routes/             # API route handlers
│   ├── services/           # Business logic: queue, credits, script generation, storage
│   └── db/                 # Database schema and helpers
├── client/                # React TypeScript frontend
│   └── src/
│       ├── pages/           # Top-level page components
│       ├── components/      # Shared UI components
│       └── services/        # API client
├── ml/                     # Legacy Python rendering pipeline (fallback reference)
└── docs/                   # Architecture & technical documentation
```
 
## Roadmap
 
- [x] Project conception & branding
- [x] Core document-to-script-to-scene pipeline (MVP)
- [x] User authentication & dashboard
- [x] Credit system & Stripe payment processing
- [ ] Full ElevenLabs + Remotion pipeline cutover
- [ ] Frontend checkout flow
- [ ] Custom voice & scene style selection
- [ ] Mobile-responsive polish
- [ ] Public API access for developers
- [ ] Enterprise / institutional tier
- [ ] Public launch
## Target Users
 
- **Students** — Turn lecture notes into revision videos instantly
- **Educators & Teachers** — Create course content without video production skills
- **Online Course Creators** — Scale content output rapidly and affordably
- **Corporate Trainers** — Convert SOPs and training docs into onboarding videos
- **Educational Institutions** — Produce accessible video learning at low cost
- **EdTech Developers** — Integrate automated lecture generation via API
## FAQ
 
**What kind of documents can I upload?**
PDF, DOCX, DOC, or TXT files up to 10 MB. The messier the better — the AI handles structuring it.
 
**Do I need video editing experience?**
None. The entire process is automated.
 
**Is PreplitAI free?**
New accounts receive free credits to evaluate the product. Paid credit packages are available via Stripe.
 
**How long does video generation take?**
Generation time depends on which rendering pipeline is active; this is actively improving as the platform migrates to its parallel ElevenLabs + Remotion architecture.
 
**What languages are supported?**
English is supported currently. Additional language support is on the roadmap.
 
## Contributing
 
Contributions are welcome.
 
1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request
Please follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages.
 
### Branch Naming
 
| Pattern | Purpose |
|---|---|
| `feature/{description}` | New features |
| `fix/{description}` | Bug fixes |
| `docs/{description}` | Documentation |
| `chore/{description}` | Maintenance / tooling |
 
## Team
 
| Name | Role | GitHub |
|---|---|---|
| Khan Ahsan | Founder & Lead Developer | [@ahsann826](https://github.com/ahsann826) |

---

## License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.

---

</div>
