from __future__ import annotations

import re
from dataclasses import dataclass
from typing import List, Tuple


@dataclass
class Subtitle:
    index: int
    start: float
    end: float
    text: str


def _format_ts(t: float) -> str:
    h = int(t // 3600)
    m = int((t % 3600) // 60)
    s = int(t % 60)
    ms = int((t - int(t)) * 1000)
    return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"


def split_sentences(text: str) -> List[str]:
    # Simple sentence splitter
    parts = re.split(r"(?<=[.!?])\s+|\n+", text.strip())
    return [p.strip() for p in parts if p.strip()]


def build_subtitles(section_texts: List[str], section_durations: List[float]) -> List[Subtitle]:
    subs: List[Subtitle] = []
    cur_t = 0.0
    idx = 1
    for text, dur in zip(section_texts, section_durations):
        sents = split_sentences(text)
        if not sents:
            cur_t += dur
            continue
        # Allocate time proportionally to sentence length
        total_len = sum(len(s) for s in sents)
        allocs: List[Tuple[str, float]] = []
        for s in sents:
            frac = (len(s) / total_len) if total_len else 1.0 / len(sents)
            allocs.append((s, max(0.8, dur * frac)))  # min 0.8s per sent
        start = cur_t
        for s, a in allocs:
            end = min(cur_t + a, start + dur)
            subs.append(Subtitle(index=idx, start=cur_t, end=end, text=s))
            idx += 1
            cur_t = end
        # Ensure we end exactly at section end
        cur_t = start + dur
    return subs


def to_srt(subs: List[Subtitle]) -> str:
    lines = []
    for s in subs:
        lines.append(str(s.index))
        lines.append(f"{_format_ts(s.start)} --> {_format_ts(s.end)}")
        lines.append(s.text)
        lines.append("")
    return "\n".join(lines)
