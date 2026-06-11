<div align="center">

# PreplitAI, Inc.

### Turn your notes into video lectures — instantly.

<img width="1672" height="941" alt="Preplit AI" src="https://github.com/user-attachments/assets/97c7f80f-edca-4ff4-95e6-7add48f664d3" />


![Status](https://img.shields.io/badge/status-pre--launch-8b0000?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-darkred?style=flat-square)
![Waitlist](https://img.shields.io/badge/join-waitlist-8b0000?style=flat-square)
![Powered by AI](https://img.shields.io/badge/powered%20by-AI-darkred?style=flat-square)

**PreplitAI** is an AI-powered EdTech platform that converts static, text-based notes into fully produced video lectures — complete with narration, structured slides, and a shareable output. No recording. No editing. No technical skill required.

[🎯 Join the Waitlist](#) · [📄 Documentation](#) · [🐛 Report a Bug](https://github.com/ahsann826/PreplitAI-Inc/issues) · [💡 Request a Feature](https://github.com/ahsann826/PreplitAI-Inc/issues) ![License](https://img.shields.io/badge/license-Apache%202.0-8b0000?style=flat-square)

</div>

---

## 📖 Table of Contents

- [About the Project](#-about-the-project)
- [How It Works](#-how-it-works)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Repository Structure](#-repository-structure)
- [Roadmap](#-roadmap)
- [Target Users](#-target-users)
- [FAQ](#-faq)
- [Contributing](#-contributing)
- [Team](#-team)
- [License](#-license)

---

## 🎓 About the Project

There is a massive amount of written educational content in the world — lecture notes, study guides, textbook summaries, course outlines — that never gets converted into the format learners engage with most: **video**.

Converting notes to video manually requires recording equipment, editing software, design skills, and hours of effort. Most students and educators simply don't have that.

**PreplitAI removes every one of those barriers.**

Paste your notes in. Get a complete video lecture out. That's it.

> _"From notes to video in under 5 minutes."_

### What makes PreplitAI different?

Most tools solve one piece of the puzzle — slide builders make visuals, TTS tools add audio, video editors handle production. PreplitAI is the only platform that handles the **entire pipeline in a single step**, from raw text to finished, narrated video lecture.

---

## ⚙️ How It Works

```
[ Your Text Notes ]
        ↓
[ AI analyzes & structures content ]
        ↓
[ Script generated + Slides built ]
        ↓
[ AI narration synthesized ]
        ↓
[ Video rendered & ready to share ]
```

1. **Input** — Paste or upload any text-based notes into the PreplitAI platform.
2. **Structure** — The AI parses the content, identifies key concepts, and organizes them into a logical lecture flow.
3. **Generate** — A script is written, slides are created, and an AI voiceover narrates the content.
4. **Output** — A fully produced, shareable video lecture is delivered in minutes.

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 📝 **Text-to-Video Conversion** | Converts any text notes into a complete video lecture automatically |
| 🎙️ **AI Narration** | Natural-sounding AI voiceover — no recording needed |
| 📊 **Auto-Generated Slides** | Content is intelligently structured into clean, visual slides |
| ⚡ **Fast Turnaround** | Full video produced in under 5 minutes |
| 🌐 **100% Web-Based** | No installs, no setup — works entirely in the browser |
| 📤 **Easy Sharing** | Download or share your lecture with a single link |
| 🎓 **Education-Aware AI** | The model understands educational structure, not just formatting |

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React, TypeScript, Tailwind CSS, Vite |
| **Backend** | Node.js, Express |
| **AI / NLP** | Large Language Models for script generation & content structuring |
| **Text-to-Speech** | AI voice synthesis for natural narration |
| **Video Rendering** | Automated pipeline combining slides, audio, and timing |
| **Database** | PostgreSQL |
| **Cloud** | AWS / Vercel |

> Stack subject to change as the product evolves.

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) v18+
- [npm](https://npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Git](https://git-scm.com/)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/ahsann826/PreplitAI-Inc.git

# 2. Navigate into the project
cd PreplitAI-Inc

# 3. Install dependencies
npm install

# 4. Set up environment variables
cp .env.example .env
# Fill in your API keys in .env

# 5. Start the development server
npm run dev
```

The app will be running at `http://localhost:3000`.

### Environment Variables

```env
OPENAI_API_KEY=your_key_here
TTS_API_KEY=your_key_here
DATABASE_URL=your_database_url
```

---

## 📁 Repository Structure

```
.
├── frontend/         # React web application (user-facing interface)
├── backend/          # API server & AI pipeline orchestration
├── ml/               # Machine learning & video generation pipeline
├── infra/            # Cloud deployment configuration
├── docs/             # Architecture & technical documentation
└── public/           # Static assets
```

| Module | Description |
|---|---|
| `frontend/` | User-facing web app — note input, video output, sharing |
| `backend/` | API layer, authentication, job queue management |
| `ml/` | AI pipeline — NLP, script generation, TTS, video rendering |
| `infra/` | AWS deployment, environment configs |

---

## 🗺 Roadmap

- [x] Project conception & branding
- [x] Waitlist landing page
- [ ] Core text-to-video pipeline (MVP)
- [ ] User authentication & dashboard
- [ ] Custom voice & slide theme selection
- [ ] Export options (MP4, shareable link)
- [ ] Mobile-responsive web app
- [ ] API access for developers
- [ ] Enterprise / institutional tier
- [ ] Public launch 🚀

---

## 👥 Target Users

- **Students** — Turn lecture notes into revision videos instantly
- **Educators & Teachers** — Create course content without video production skills
- **Online Course Creators** — Scale content output rapidly and affordably
- **Corporate Trainers** — Convert SOPs and training docs into onboarding videos
- **Educational Institutions** — Produce accessible video learning at low cost

---

## ❓ FAQ

**What kind of notes can I upload?**
Any text-based content — bullet points, paragraphs, outlines, or full summaries. The messier the better; our AI handles the structure.

**Do I need video editing experience?**
None at all. The entire process is fully automated — paste in, video out.

**Is PreplitAI free?**
Free during early access for everyone on the waitlist. Paid plans will follow at launch.

**How long does video generation take?**
Most videos are ready in under 5 minutes.

**What languages are supported?**
English is supported at launch. Additional language support is on the roadmap.

**Who is PreplitAI for?**
Students, educators, course creators, and anyone who wants to turn written knowledge into watchable video content.

---

## 🤝 Contributing

Contributions are welcome! If you'd like to help build PreplitAI:

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

---

## 👨‍💻 Team

| Name | Role | GitHub |
|---|---|---|
| Ahsan | Founder & Lead Developer | [@ahsann826](https://github.com/ahsann826) |

---

## 📄 License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.

---

<div align="center">
<img width="1672" height="941" alt="ChatGPT Image Jun 10, 2026, 12_20_34 PM" src="https://github.com/user-attachments/assets/564b0130-0b39-40b0-9f9b-b9303eceb06b" />


⭐ **If you find this project interesting, give it a star!**

[Join the Waitlist](#) · [Follow Updates](#) · [Report an Issue](https://github.com/ahsann826/PreplitAI-Inc/issues)

</div>
