from __future__ import annotations

import argparse
import os
from datetime import datetime

from .slides import split_script
from .assemble import LectureMaker


def main():
    p = argparse.ArgumentParser(description="Convert a script/notes into a narrated video lecture.")
    p.add_argument("input", help="Path to script file (.txt/.md)")
    p.add_argument("--output", "-o", help="Output video path (.mp4). Default: out/lecture_<timestamp>.mp4")
    p.add_argument("--theme", choices=["dark", "light"], default="dark")
    p.add_argument("--width", type=int, default=1920)
    p.add_argument("--height", type=int, default=1080)
    p.add_argument("--font", help="Path to .ttf font for rendering text")
    p.add_argument("--voice", help="Voice name or id for TTS (edge-tts or pyttsx3)")
    p.add_argument("--rate", type=int, default=180, help="TTS rate (edge-tts percent around 180 baseline; pyttsx3 WPM)")
    p.add_argument("--tts-provider", choices=["edge", "pyttsx3"], default=None, help="Choose TTS backend. Default: edge if installed, else pyttsx3")
    p.add_argument("--music", help="Optional background music file (mp3/wav)")
    p.add_argument("--fps", type=int, default=30)
    p.add_argument("--crossfade", type=float, default=0.3, help="Seconds of crossfade between slides")
    p.add_argument("--kenburns", action="store_true", help="Enable slow zoom effect (slower rendering)")
    p.add_argument("--keep-temp", action="store_true", help="Keep temp assets for debugging")

    args = p.parse_args()

    with open(args.input, "r", encoding="utf-8") as f:
        text = f.read()

    sections = split_script(text)
    if not sections:
        raise SystemExit("No content parsed from script.")

    ts = datetime.now().strftime("%Y%m%d_%H%M%S")
    out_dir = os.path.join("out")
    os.makedirs(out_dir, exist_ok=True)
    out_video = args.output or os.path.join(out_dir, f"lecture_{ts}.mp4")

    maker = LectureMaker(
        size=(args.width, args.height),
        theme=args.theme,
        font_path=args.font,
        voice=args.voice,
        rate=args.rate,
        kenburns=args.kenburns,
    )
    # Override TTS provider if specified
    if args.tts_provider:
        maker.tts.provider = args.tts_provider

    video_path, srt_path = maker.build(
        sections,
        out_video,
        out_srt=None,
        music_path=args.music,
        fps=args.fps,
        crossfade=args.crossfade,
        keep_temp=args.keep_temp,
    )

    print(f"Video saved to: {video_path}")
    print(f"Subtitles saved to: {srt_path}")


if __name__ == "__main__":
    main()
