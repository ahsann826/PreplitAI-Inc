import os
import tempfile
import asyncio
import requests
from typing import Optional

class TTS:
    """TTS abstraction supporting ElevenLabs, edge-tts, and pyttsx3.
    """

    def __init__(self, voice: Optional[str] = None, rate: int = 180, provider: Optional[str] = None):
        self.voice = voice
        self.rate = rate
        self.provider = provider or self._default_provider()
        
        self.elevenlabs_key = os.environ.get("ELEVENLABS_API_KEY")
        
        if self.provider == "pyttsx3":
            self._init_pyttsx3()
        elif self.provider == "edge":
            self._init_edge()
        elif self.provider == "elevenlabs":
            if not self.elevenlabs_key:
                print("ELEVENLABS_API_KEY not found, falling back to edge-tts")
                self.provider = "edge"
                self._init_edge()
                
    def _init_pyttsx3(self):
        try:
            import pyttsx3
        except ImportError as e:
            raise SystemExit("pyttsx3 not installed.") from e
        self._engine = pyttsx3.init()
        if self.voice:
            self._set_voice_pyttsx3(self.voice)
        if self.rate:
            self._engine.setProperty("rate", self.rate)

    def _init_edge(self):
        try:
            import edge_tts
        except ImportError as e:
            raise SystemExit("edge-tts not installed.") from e
        self._edge_tts = edge_tts

    def _default_provider(self) -> str:
        if os.environ.get("ELEVENLABS_API_KEY"):
            return "elevenlabs"
        try:
            import edge_tts  # noqa: F401
            return "edge"
        except Exception:
            return "pyttsx3"

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
        return []

    def synthesize_to_file(self, text: str, out_path: Optional[str] = None, ext: Optional[str] = None) -> str:
        if self.provider == "elevenlabs":
            try:
                return self._synthesize_elevenlabs(text, out_path)
            except Exception as e:
                print(f"ElevenLabs failed: {e}. Falling back to edge-tts.")
                self.provider = "edge"
                self._init_edge()
                # fall through to edge
                
        if self.provider == "edge":
            try:
                return asyncio.run(self._synthesize_edge(text, out_path, ext))
            except Exception as e:
                print(f"edge-tts failed: {e}. Falling back to pyttsx3.")
                self.provider = "pyttsx3"
                self._init_pyttsx3()
                # fall through to pyttsx3
                
        return self._synthesize_pyttsx3(text, out_path)

    def _synthesize_elevenlabs(self, text: str, out_path: Optional[str]) -> str:
        if not out_path:
            fd, tmp = tempfile.mkstemp(suffix=".mp3", prefix="tts_el_")
            os.close(fd)
            out_path = tmp
            
        voice_id = self.voice if self.voice and len(self.voice) > 10 else "21m00Tcm4TlvDq8ikWAM"
        url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"
        
        headers = {
            "xi-api-key": self.elevenlabs_key,
            "Content-Type": "application/json"
        }
        
        data = {
            "text": text,
            "model_id": "eleven_monolingual_v1",
            "voice_settings": {
                "stability": 0.5,
                "similarity_boost": 0.75
            }
        }
        
        resp = requests.post(url, json=data, headers=headers)
        resp.raise_for_status()
        
        with open(out_path, "wb") as f:
            f.write(resp.content)
            
        return out_path

    def _synthesize_pyttsx3(self, text: str, out_path: Optional[str]) -> str:
        if not out_path:
            fd, tmp = tempfile.mkstemp(suffix=".wav", prefix="tts_")
            os.close(fd)
            out_path = tmp
        self._engine.save_to_file(text, out_path)
        self._engine.runAndWait()
        return out_path

    async def _synthesize_edge(self, text: str, out_path: Optional[str], ext: Optional[str]) -> str:
        voice = self.voice if self.voice and "-" in self.voice else "en-US-AriaNeural"
        if not out_path:
            suffix = ".mp3" if (ext or ".mp3").lower() == ".mp3" else ".wav"
            fd, tmp = tempfile.mkstemp(suffix=suffix, prefix="tts_")
            os.close(fd)
            out_path = tmp
        communicate = self._edge_tts.Communicate(text=text, voice=voice, rate=f"{self.rate-180:+d}%")
        await communicate.save(out_path)
        return out_path
