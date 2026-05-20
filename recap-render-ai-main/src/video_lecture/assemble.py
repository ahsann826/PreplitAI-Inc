from __future__ import annotations

import os
import tempfile
from typing import List, Optional, Tuple

from moviepy import (
    AudioFileClip,
    CompositeAudioClip,
    ImageClip,
    concatenate_videoclips,
)

from .slides import Section, render_slides
from .tts import TTS
from .subtitles import build_subtitles, to_srt


class LectureMaker:
    def __init__(
        self,
        size: Tuple[int, int] = (1920, 1080),
        theme: str = "dark",
        font_path: Optional[str] = None,
        voice: Optional[str] = None,
        rate: int = 180,
        kenburns: bool = False,
    ):
        self.size = size
        self.theme = theme
        self.font_path = font_path
        self.kenburns = kenburns
        self.tts = TTS(voice=voice, rate=rate)

    def build(
        self,
        sections: List[Section],
        out_video: str,
        out_srt: Optional[str] = None,
        music_path: Optional[str] = None,
        fps: int = 30,
        crossfade: float = 0.3,
        keep_temp: bool = False,
    ) -> Tuple[str, Optional[str]]:
        tmp_dir = tempfile.mkdtemp(prefix="lecture_")
        try:
            # 1) Render slides to PNGs
            slides = render_slides(sections, size=self.size, theme=self.theme, font_path=self.font_path)
            slide_paths: List[str] = []
            for i, img in enumerate(slides):
                p = os.path.join(tmp_dir, f"slide_{i:03d}.png")
                img.save(p)
                slide_paths.append(p)

            # 2) TTS per section -> wav
            audio_paths: List[str] = []
            durations: List[float] = []
            for i, sec in enumerate(sections):
                text = f"{sec.title}. {sec.body}" if sec.body else sec.title
                audio_file = self.tts.synthesize_to_file(text)
                audio_paths.append(audio_file)
                with AudioFileClip(audio_file) as a:
                    durations.append(a.duration)

            # 3) Build subtitle file
            if out_srt is None:
                out_srt = os.path.splitext(out_video)[0] + ".srt"
            srt_text = to_srt(build_subtitles([f"{s.title}. {s.body}" for s in sections], durations))
            with open(out_srt, "w", encoding="utf-8") as f:
                f.write(srt_text)

            # 4) Build video clips aligned to audio durations
            clips = []
            for i, (img_path, dur, ap) in enumerate(zip(slide_paths, durations, audio_paths)):
                clip = ImageClip(img_path, duration=dur).with_audio(AudioFileClip(ap))
                # optional gentle zoom effect (slows rendering)
                if self.kenburns:
                    clip = clip.resized(lambda t: 1 + 0.02 * (t / max(dur, 0.001)))
                clips.append(clip)

            video = concatenate_videoclips(clips, method="compose", padding=-crossfade)

            # 5) Optional background music under VO
            if music_path and os.path.exists(music_path):
                music = AudioFileClip(music_path).volumex(0.08)
                video = video.with_audio(CompositeAudioClip([video.audio, music.with_duration(video.duration)]))

            # 6) Write output
            os.makedirs(os.path.dirname(os.path.abspath(out_video)) or ".", exist_ok=True)
            video.write_videofile(
                out_video,
                fps=fps,
                codec="libx264",
                audio_codec="aac",
                bitrate="3000k",
                preset="ultrafast",
                threads=max(1, os.cpu_count() or 4),
                temp_audiofile=os.path.join(tmp_dir, "temp-audio.m4a"),
                remove_temp=True,
            )
            return out_video, out_srt
        finally:
            if not keep_temp:
                try:
                    # Clean temp dir files
                    for root, _, files in os.walk(tmp_dir, topdown=False):
                        for name in files:
                            try:
                                os.remove(os.path.join(root, name))
                            except Exception:
                                pass
                    os.rmdir(tmp_dir)
                except Exception:
                    pass
