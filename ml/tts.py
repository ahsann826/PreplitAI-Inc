import os
import tempfile
import asyncio
from typing import Optional


class TTS:
    """TTS abstraction supporting 'edge' (Microsoft) and 'pyttsx3' (offline).

    Default provider is 'edge' if available, else falls back to 'pyttsx3'.
    """

    def __init__(self, voice: Optional[str] = None, rate: int = 180, provider: Optional[str] = None):
        self.voice = voice
        self.rate = rate
        self.provider = provider or self._default_provider()
        if self.provider == "pyttsx3":
            try:
                import pyttsx3  # type: ignore
            except ImportError as e:
                raise SystemExit("pyttsx3 not installed. Install with `pip install pyttsx3`." ) from e
            self._engine = pyttsx3.init()
            if voice:
                self._set_voice_pyttsx3(voice)
            if rate:
                self._engine.setProperty("rate", rate)
        else:
            # edge-tts is async
            try:
                import edge_tts  # type: ignore
            except ImportError as e:
                raise SystemExit("edge-tts not installed. Install with `pip install edge-tts`." ) from e
            self._edge_tts = edge_tts

    def _default_provider(self) -> str:
        try:
            import edge_tts  # noqa: F401
            return "edge"
        except Exception:
            return "pyttsx3"

    # ============ pyttsx3 backend ============
    def _set_voice_pyttsx3(self, name_or_id: str) -> None:
        voices = self._engine.getProperty("voices")
        for v in voices:
            if name_or_id.lower() in (getattr(v, "name", "") or "").lower() or name_or_id.lower() in (getattr(v, "id", "") or "").lower():
                self._engine.setProperty("voice", v.id)
                return

    def list_voices(self):
        if self.provider == "pyttsx3":
            voices = self._engine.getProperty("voices")
            return [(v.id, getattr(v, "name", v.id)) for v in voices]
        else:
            # edge-tts voice list requires network; return empty to keep API simple
            return []

    def synthesize_to_file(self, text: str, out_path: Optional[str] = None, ext: Optional[str] = None) -> str:
        """Synthesize `text` to an audio file and return its path.
        For edge-tts, writes mp3; for pyttsx3, writes wav.
        """
        if self.provider == "pyttsx3":
            return self._synthesize_pyttsx3(text, out_path)
        return asyncio.run(self._synthesize_edge(text, out_path, ext))

    def _synthesize_pyttsx3(self, text: str, out_path: Optional[str]) -> str:
        if not out_path:
            fd, tmp = tempfile.mkstemp(suffix=".wav", prefix="tts_")
            os.close(fd)
            out_path = tmp
        self._engine.save_to_file(text, out_path)
        self._engine.runAndWait()
        return out_path

    async def _synthesize_edge(self, text: str, out_path: Optional[str], ext: Optional[str]) -> str:
        voice = self.voice or "en-US-AriaNeural"
        if not out_path:
            suffix = ".mp3" if (ext or ".mp3").lower() == ".mp3" else ".wav"
            fd, tmp = tempfile.mkstemp(suffix=suffix, prefix="tts_")
            os.close(fd)
            out_path = tmp
        communicate = self._edge_tts.Communicate(text=text, voice=voice, rate=f"{self.rate-180:+d}%")
        await communicate.save(out_path)
        return out_path
