"""
ElevenLabs Voiceover Generator — Nhân Tâm Specials Campaign
Voice: Adam (pNInz6obpgDQGcFmaJgB) — deep, powerful, confident male
Duration target: ~25-28 seconds
"""

import os
import sys
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("ELEVENLABS_API_KEY")

if not api_key:
    print("ERROR: ELEVENLABS_API_KEY not set in environment")
    sys.exit(1)

from elevenlabs.client import ElevenLabs

VOICEOVER_SCRIPT = """
Nhân Tâm Specials.
Dòng hạt rang mộc được chọn lọc kỹ lưỡng từ vùng nguyên liệu chuẩn nhất Tây Nguyên.
Robusta đậm đà. Arabica tinh tế. Culi mạnh mẽ.
Tự do phối theo công thức riêng của quán — không ai rang giống được.
Giá thẳng từ xưởng. Giao hàng 24 giờ nội thành.
Cà Phê Nhân Tâm — Đậm đà bản sắc, trọn vẹn niềm tin.
"""

OUTPUT_DIR = Path("brands/nhan-tam/assets/audio/elevenlabs")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
OUTPUT_PATH = OUTPUT_DIR / "nhan-tam-special-vo.mp3"

client = ElevenLabs(api_key=api_key)

print("Generating ElevenLabs voiceover — Adam voice (deep/powerful)...")

audio_generator = client.text_to_speech.convert(
    text=VOICEOVER_SCRIPT,
    voice_id="pNInz6obpgDQGcFmaJgB",  # Adam — deep, confident male
    model_id="eleven_multilingual_v2",
    output_format="mp3_44100_128",
    voice_settings={
        "stability": 0.72,
        "similarity_boost": 0.85,
        "style": 0.15,
        "use_speaker_boost": True,
    },
)

with open(OUTPUT_PATH, "wb") as f:
    for chunk in audio_generator:
        f.write(chunk)

print(f"SUCCESS: {OUTPUT_PATH}")
