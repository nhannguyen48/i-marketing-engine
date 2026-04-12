"""
Debug script: test ElevenLabs Vietnamese voice quality
Tests different models and voices to find what produces correct Vietnamese.
"""
import os, requests
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("ELEVENLABS_API_KEY")
OUT_DIR = "brands/nhan-tam/assets/audio/elevenlabs"
os.makedirs(OUT_DIR, exist_ok=True)

TEST_TEXT = "Xin chào, đây là giọng đọc tiếng Việt. Cà phê Nhân Tâm, đậm đà bản sắc."

TESTS = [
    # (label, voice_id, model_id, language_code)
    # Premade voices + turbo_v2_5 + language_code vi (tốt nhất cho multilingual)
    ("brian-turbo-vi",    "nPczCjzI2devNBz1zQrb", "eleven_turbo_v2_5",    "vi"),
    ("daniel-turbo-vi",   "onwK4e9ZLuTAKqWW03F9", "eleven_turbo_v2_5",    "vi"),
    # Library Vietnamese voices + turbo_v2_5 + language_code vi
    ("tuan-turbo-vi",     "In8K4JDLu1r9fGysc64F", "eleven_turbo_v2_5",    "vi"),
    ("thai-turbo-vi",     "xVv8qLTTnsYnrysc2Lx4", "eleven_turbo_v2_5",    "vi"),
    # Library Vietnamese voices + multilingual_v2 (cách cũ)
    ("tuan-multi",        "In8K4JDLu1r9fGysc64F", "eleven_multilingual_v2", None),
]

for label, voice_id, model_id, lang in TESTS:
    body = {
        "text": TEST_TEXT,
        "model_id": model_id,
        "voice_settings": {"stability": 0.60, "similarity_boost": 0.80},
    }
    if lang:
        body["language_code"] = lang

    r = requests.post(
        f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}",
        json=body,
        headers={"xi-api-key": api_key, "Content-Type": "application/json"},
    )
    if r.status_code == 200 and len(r.content) > 1000:
        path = f"{OUT_DIR}/debug-{label}.mp3"
        open(path, "wb").write(r.content)
        print(f"OK   {label:25s}  {len(r.content)//1024}KB  -> {path}")
    else:
        print(f"FAIL {label:25s}  status={r.status_code}  {r.text[:120]}")
