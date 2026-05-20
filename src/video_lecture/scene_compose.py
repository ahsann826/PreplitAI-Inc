from __future__ import annotations

import json
import os
from typing import List, Tuple, Optional

from PIL import Image
from moviepy import (
    VideoFileClip,
    ImageClip,
    CompositeVideoClip,
    concatenate_videoclips,
)

from .slides import Section, render_slide
from .subtitles import build_subtitles, to_srt


def compose_scenes(
    scenes: List[dict],
    out_video: str,
    size: Tuple[int, int] = (1280, 720),
    theme: str = "dark",
    pip_size: float = 0.35,
    pip_pos: Tuple[str, str] = ("right", "bottom"),
    fps: int = 24,
) -> str:
    clips = []
    for i, sc in enumerate(scenes):
        title = sc.get("title") or f"Scene {i+1}"
        visual = sc.get("visual") or sc.get("description") or ""
        avatar_path = sc.get("avatar_video")
        narration = sc.get("narration") or ""

        # Background slide
        bg_img = render_slide(Section(title=title, body=visual), size=size, theme=theme)
        bg_clip = ImageClip(bg_img).with_duration(1)  # temp, will be set to avatar duration

        # Avatar PiP
        avatar = VideoFileClip(avatar_path)
        dur = avatar.duration
        bg_clip = bg_clip.with_duration(dur)
        pip = avatar.resized(lambda t: pip_size).with_position(pip_pos)

        comp = CompositeVideoClip([bg_clip, pip]).with_duration(dur).with_audio(avatar.audio)
        clips.append(comp)

    final = concatenate_videoclips(clips, method="compose")

    os.makedirs(os.path.dirname(os.path.abspath(out_video)) or ".", exist_ok=True)
    final.write_videofile(
        out_video,
        fps=fps,
        codec="libx264",
        audio_codec="aac",
        bitrate="3000k",
        preset="ultrafast",
    )
    return out_video


def compose_from_json(json_path: str, out_video: str) -> str:
    with open(json_path, "r", encoding="utf-8") as f:
        data = json.load(f)
    scenes = data["scenes"] if isinstance(data, dict) else data
    size = tuple(data.get("size", [1280, 720])) if isinstance(data, dict) else (1280, 720)
    theme = data.get("theme", "dark") if isinstance(data, dict) else "dark"
    pip_size = float(data.get("pip_size", 0.35)) if isinstance(data, dict) else 0.35
    pip_pos = tuple(data.get("pip_pos", ["right", "bottom"])) if isinstance(data, dict) else ("right", "bottom")
    fps = int(data.get("fps", 24)) if isinstance(data, dict) else 24
    return compose_scenes(scenes, out_video, size=size, theme=theme, pip_size=pip_size, pip_pos=pip_pos, fps=fps)
