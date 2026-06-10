## Concept - PREPLIT AI

<img width="1672" height="941" alt="Preplit AI" src="https://github.com/user-attachments/assets/274f897c-bf2e-42d1-9c1d-dafe01e28f02" />

Tech stack: Vite.js frontend + Node/Express API + Python (MoviePy) generator.

## Make a video lecture from your notes

1) Install dependencies

```pwsh
python -m venv .venv
. .venv/Scripts/Activate.ps1
pip install -r requirements.txt
```

2) Put your notes in a `.md` or `.txt` file (see `notes_example.md`). Use `#`/`##` headings or `---` to start new slides.

3) Generate the video + subtitles

```pwsh
python -m src.video_lecture.cli notes_example.md --theme dark --voice "Zira" --rate 180
```

- Output: `out/lecture_YYYYMMDD_HHMMSS.mp4` and `.srt`
- Options: `--font path/to/font.ttf`, `--music path/to/music.mp3`, `--width 1920 --height 1080`, `--fps 30`

Tip: List available TTS voices in Python:

```python
import pyttsx3
engine = pyttsx3.init()
for v in engine.getProperty('voices'):
    print(v.id, v.name)
```
