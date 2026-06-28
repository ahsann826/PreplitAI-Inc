from __future__ import annotations

import re
import textwrap
from dataclasses import dataclass
from typing import List, Optional, Tuple

from PIL import Image, ImageDraw, ImageFont


@dataclass
class Section:
    title: str
    body: str


def split_script(text: str) -> List[Section]:
    """
    Split script into sections by markdown headings (## or #), `---` rules, or blank lines.
    If none found, split every ~4 sentences.
    """
    lines = [l.rstrip() for l in text.splitlines()]
    blocks: List[List[str]] = []
    cur: List[str] = []
    def push():
        if cur and any(x.strip() for x in cur):
            blocks.append(cur.copy())
        cur.clear()

    for line in lines:
        if re.match(r"^\s*---+\s*$", line):
            push()
            continue
        if line.startswith("#"):
            push()
            cur.append(line)
            continue
        if not line.strip():
            # paragraph break => softer split; we still accumulate
            cur.append("")
        else:
            cur.append(line)
    push()

    sections: List[Section] = []
    for b in blocks if blocks else [lines]:
        joined = "\n".join(b).strip()
        if not joined:
            continue
        # Heading as title
        m = re.match(r"^(#+)\s+(.*)$", joined)
        if m:
            title = m.group(2).strip()
            body = re.sub(r"^#+\s+.*\n?", "", joined).strip()
        else:
            # First line as title if short, else first sentence
            first_line = joined.splitlines()[0]
            if len(first_line) <= 70:
                title = first_line.strip()
                body = "\n".join(joined.splitlines()[1:]).strip()
            else:
                sent_split = re.split(r"(?<=[.!?])\s+", joined, maxsplit=1)
                title = sent_split[0].strip()
                body = sent_split[1].strip() if len(sent_split) > 1 else ""
        sections.append(Section(title=title, body=body))

    if not sections:
        # Fallback: naive sentence-based chunks
        sents = re.split(r"(?<=[.!?])\s+", text)
        chunk = []
        for s in sents:
            chunk.append(s)
            if len(chunk) >= 4:
                joined = " ".join(chunk).strip()
                if joined:
                    sections.append(Section(title=chunk[0][:70], body=" ".join(chunk[1:])))
                chunk = []
        if chunk:
            joined = " ".join(chunk).strip()
            if joined:
                sections.append(Section(title=chunk[0][:70], body=" ".join(chunk[1:])))
    return sections


def _load_font(font_path: Optional[str], size: int) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    try:
        if font_path:
            return ImageFont.truetype(font_path, size=size)
        # Try common fonts
        for name in [
            "arial.ttf",
            "Arial.ttf",
            "DejaVuSans.ttf",
            "LiberationSans-Regular.ttf",
        ]:
            try:
                return ImageFont.truetype(name, size=size)
            except Exception:
                continue
    except Exception:
        pass
    return ImageFont.load_default()


from .diagram_renderer import render_diagram

def render_slide(
    section: Section,
    size: Tuple[int, int] = (1920, 1080),
    theme: str = "dark",
    font_path: Optional[str] = None,
    padding: int = 80,
    visual_data: Optional[dict] = None,
) -> Image.Image:
    W, H = size
    bg = (18, 24, 38) if theme == "dark" else (245, 246, 248)
    fg = (245, 246, 248) if theme == "dark" else (20, 23, 27)

    img = Image.new("RGB", (W, H), color=bg)
    draw = ImageDraw.Draw(img)

    if visual_data is not None:
        # Split layout
        left_pad = 60
        title_font = _load_font(font_path, size=56)
        body_font = _load_font(font_path, size=34)
        accent_color = "#E63946"
        
        # Divider line
        draw.line([(W // 2, 0), (W // 2, H)], fill=accent_color, width=2)
        
        # Title
        title = section.title.strip()
        t_lines = textwrap.wrap(title, width=22)
        y = left_pad
        for line in t_lines:
            w, h = draw.textbbox((0, 0), line, font=title_font)[2:]
            draw.text((left_pad, y), line, font=title_font, fill=accent_color)
            y += h + 10
            
        # Title underline
        y += 10
        draw.line([(left_pad, y), (W // 2 - left_pad, y)], fill=accent_color, width=3)
        y += 40
        
        # Body text (narration)
        body = section.body.strip()
        if body:
            paras = [p.strip() for p in body.splitlines() if p.strip()]
            for p in paras:
                lines = textwrap.wrap(p, width=35)
                for l in lines:
                    w, h = draw.textbbox((0, 0), l, font=body_font)[2:]
                    draw.text((left_pad, y), l, font=body_font, fill=fg)
                    y += h + 10
                    if y > H - left_pad:
                        break
                y += 20
                if y > H - left_pad:
                    break
                    
        # Right half diagram
        diag_img = render_diagram(visual_data, size=(W // 2, H), theme=theme)
        img.paste(diag_img, (W // 2, 0))
        
    else:
        # Existing fallback full-width layout
        title_font = _load_font(font_path, size=68)
        body_font = _load_font(font_path, size=40)

        # Title
        title = section.title.strip()
        t_lines = textwrap.wrap(title, width=28)
        y = padding
        for i, line in enumerate(t_lines):
            w, h = draw.textbbox((0, 0), line, font=title_font)[2:]
            draw.text(((W - w) // 2, y), line, font=title_font, fill=fg)
            y += h + 10

        # Separator
        y += 10
        draw.line([(padding, y), (W - padding, y)], fill=fg, width=3)
        y += 30

        # Body bullets
        body = section.body.strip()
        if body:
            # Convert paragraphs to bullets
            paras = [p.strip() for p in body.splitlines() if p.strip()]
            bullets = []
            for p in paras:
                if p.startswith("-") or p.startswith("*"):
                    bullets.append(p.lstrip("-* "))
                else:
                    bullets.append(p)
            for b in bullets:
                lines = textwrap.wrap(b, width=50)
                if not lines:
                    continue
                # draw bullet
                bx, by = padding + 10, y
                r = 6
                draw.ellipse((bx - 20 - r, by + 10 - r, bx - 20 + r, by + 10 + r), fill=fg)
                for j, l in enumerate(lines):
                    draw.text((bx, y), l, font=body_font, fill=fg)
                    y += draw.textbbox((0, 0), l, font=body_font)[3] - draw.textbbox((0, 0), l, font=body_font)[1]
                    if y > H - padding - 60:
                        break
                y += 16
                if y > H - padding - 60:
                    break
    return img


def render_slides(
    sections: List[Section],
    size: Tuple[int, int] = (1920, 1080),
    theme: str = "dark",
    font_path: Optional[str] = None,
    visual_data_list: Optional[List[dict]] = None,
) -> List[Image.Image]:
    vlist = visual_data_list or [None] * len(sections)
    return [render_slide(s, size=size, theme=theme, font_path=font_path, visual_data=v) for s, v in zip(sections, vlist)]
