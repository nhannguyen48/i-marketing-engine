"""
Telegram Bot — Nhân Tâm Manager
Nhận lệnh từ Telegram, dùng Claude để hiểu ý định, thực thi các tool tương ứng.

Usage: python core-engine/telegram-bot-nhan-tam-manager.py
"""

import os
import sys
import json
import subprocess
import requests
from pathlib import Path
from dotenv import load_dotenv
from telegram import Update
from telegram.ext import ApplicationBuilder, MessageHandler, CommandHandler, filters, ContextTypes
from telegram.constants import ChatAction
import anthropic

load_dotenv()

BOT_TOKEN     = os.getenv("TELEGRAM_BOT_TOKEN")
ANTHROPIC_KEY = os.getenv("ANTHROPIC_API_KEY")
ELEVENLABS_KEY = os.getenv("ELEVENLABS_API_KEY")
FB_PAGE_ID    = "110245204765577"
FB_TOKEN      = None  # loaded from brand-identity.json

PROJECT_ROOT  = Path(__file__).parent.parent
AUDIO_DIR     = PROJECT_ROOT / "brands/nhan-tam/assets/audio/elevenlabs"
VIDEO_DIR     = PROJECT_ROOT / "brands/nhan-tam/assets/videos"

# Load Facebook token from brand-identity.json
try:
    identity = json.loads((PROJECT_ROOT / "brands/nhan-tam/brand-identity.json").read_text(encoding="utf-8"))
    FB_TOKEN = identity["social_media"]["facebook"]["access_token"]
except Exception:
    pass

# ---------- Claude intent parser ----------

SYSTEM_PROMPT = """Bạn là trợ lý điều phối hệ thống marketing Cà Phê Nhân Tâm.
Khi nhận tin nhắn từ Sếp Nhân, hãy phân tích ý định và trả về JSON với format:

{"action": "<tên_action>", "params": {<tham_số>}, "reply": "<tin nhắn xác nhận ngắn gọn>"}

Các action hỗ trợ:
- "generate_voiceover": tạo voiceover tiếng Việt. params: {"script": "...", "voice_id": "M0rVwr32hdQ5UXpkI3ni"}
- "generate_video": tạo video VEO3. params: {"prompt": "...", "ratio": "16:9"}
- "post_facebook": đăng video lên fanpage. params: {"caption": "...", "video_path": "..."}
- "query_info": tra cứu thông tin brand/giá. params: {"question": "..."}
- "chitchat": trò chuyện thông thường. params: {}

Chỉ trả về JSON thuần, không markdown, không giải thích thêm.
Nếu không chắc action nào, dùng "chitchat" và trả lời trong "reply"."""

claude = anthropic.Anthropic(api_key=ANTHROPIC_KEY)

def parse_intent(text: str) -> dict:
    """Dùng Claude để phân tích ý định từ tin nhắn."""
    try:
        resp = claude.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=512,
            system=SYSTEM_PROMPT,
            messages=[{"role": "user", "content": text}],
        )
        raw = resp.content[0].text.strip()
        return json.loads(raw)
    except Exception as e:
        return {"action": "chitchat", "params": {}, "reply": f"Lỗi phân tích: {e}"}

# ---------- Action handlers ----------

def handle_generate_voiceover(params: dict) -> tuple[str, Path | None]:
    """Tạo voiceover ElevenLabs tiếng Việt."""
    script    = params.get("script", "")
    voice_id  = params.get("voice_id", "M0rVwr32hdQ5UXpkI3ni")

    if not script:
        return "Thiếu nội dung script để đọc.", None

    r = requests.post(
        f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}",
        json={
            "text": script,
            "model_id": "eleven_v3",
            "language_code": "vi",
            "voice_settings": {"stability": 0.55, "similarity_boost": 0.80,
                               "style": 0.20, "use_speaker_boost": True},
        },
        headers={"xi-api-key": ELEVENLABS_KEY, "Content-Type": "application/json"},
        timeout=60,
    )
    if r.status_code == 200 and len(r.content) > 1000:
        out = AUDIO_DIR / "telegram-vo-latest.mp3"
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_bytes(r.content)
        return f"✅ Voiceover xong ({len(r.content)//1024}KB)", out
    return f"❌ ElevenLabs lỗi: {r.status_code}", None


def handle_generate_video(params: dict) -> tuple[str, Path | None]:
    """Tạo video VEO3 qua Vertex AI."""
    prompt = params.get("prompt", "")
    ratio  = params.get("ratio", "16:9")

    if not prompt:
        return "Thiếu prompt mô tả video.", None

    generator = PROJECT_ROOT / "core-engine/tools/vertex-video-generator.js"
    result = subprocess.run(
        ["node", str(generator), f"--ratio={ratio}", prompt],
        capture_output=True, text=True, cwd=str(PROJECT_ROOT), timeout=600,
    )
    # Tìm dòng "Local:" trong output để lấy path file
    for line in result.stdout.splitlines():
        if "Local:" in line:
            video_path = Path(line.split("Local:")[-1].strip())
            if video_path.exists():
                return f"✅ Video VEO3 xong!", video_path
    return f"❌ VEO3 lỗi:\n{result.stderr[-300:]}", None


def handle_post_facebook(params: dict) -> tuple[str, None]:
    """Đăng video lên Facebook fanpage."""
    caption    = params.get("caption", "")
    video_path = Path(params.get("video_path", str(VIDEO_DIR / "nhan-tam-special-fb-ready.mp4")))

    if not video_path.exists():
        return f"❌ Không tìm thấy video: {video_path}", None
    if not FB_TOKEN:
        return "❌ Thiếu Facebook access token.", None

    base_url   = "https://graph.facebook.com/v24.0"
    video_data = video_path.read_bytes()
    file_size  = video_path.stat().st_size

    # Step 1: init
    init = requests.post(f"{base_url}/{FB_PAGE_ID}/videos",
        json={"upload_phase": "start", "file_size": file_size, "access_token": FB_TOKEN}).json()
    if "error" in init:
        return f"❌ FB init lỗi: {init['error']['message']}", None

    # Step 2: transfer
    form = {"upload_phase": "transfer", "upload_session_id": init["upload_session_id"],
            "start_offset": "0", "access_token": FB_TOKEN}
    import io
    files = {"video_file_chunk": (video_path.name, io.BytesIO(video_data), "video/mp4")}
    requests.post(f"{base_url}/{FB_PAGE_ID}/videos", data=form, files=files)

    # Step 3: finish
    finish = requests.post(f"{base_url}/{FB_PAGE_ID}/videos",
        json={"upload_phase": "finish", "upload_session_id": init["upload_session_id"],
              "description": caption, "access_token": FB_TOKEN}).json()

    if finish.get("success"):
        return f"✅ Đã đăng lên fanpage!\nCaption: {caption[:80]}...", None
    return f"❌ FB finish lỗi: {finish}", None


def handle_query_info(params: dict) -> tuple[str, None]:
    """Tra cứu thông tin brand từ docs."""
    question = params.get("question", "")
    # Đọc pricing + brand guidelines làm context
    try:
        pricing = (PROJECT_ROOT / "brands/nhan-tam/docs/wholesale-price-list-2026-v2.md").read_text(encoding="utf-8")
        brand   = (PROJECT_ROOT / "brands/nhan-tam/docs/brand-guidelines.md").read_text(encoding="utf-8")[:3000]
    except Exception:
        pricing = brand = ""

    resp = claude.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=512,
        system=f"Bạn là trợ lý Cà Phê Nhân Tâm. Trả lời ngắn gọn dựa trên thông tin sau:\n\n{brand}\n\n{pricing}",
        messages=[{"role": "user", "content": question}],
    )
    return resp.content[0].text.strip(), None

# ---------- Telegram handlers ----------

async def handle_message(update: Update, context: ContextTypes.DEFAULT_TYPE):  # noqa: ARG001
    text = update.message.text or ""
    await update.message.chat.send_action(ChatAction.TYPING)

    intent = parse_intent(text)
    action = intent.get("action", "chitchat")
    params = intent.get("params", {})
    reply  = intent.get("reply", "Đang xử lý...")

    # Gửi xác nhận ngay
    await update.message.reply_text(f"⏳ {reply}")

    # Thực thi action
    result_text = ""
    result_file = None

    if action == "generate_voiceover":
        await update.message.chat.send_action(ChatAction.RECORD_VOICE)
        result_text, result_file = handle_generate_voiceover(params)

    elif action == "generate_video":
        await update.message.reply_text("🎬 Đang render VEO3 (3-8 phút)...")
        await update.message.chat.send_action(ChatAction.UPLOAD_VIDEO)
        result_text, result_file = handle_generate_video(params)

    elif action == "post_facebook":
        result_text, result_file = handle_post_facebook(params)

    elif action == "query_info":
        result_text, result_file = handle_query_info(params)

    else:  # chitchat — reply đã gửi rồi
        return

    # Gửi kết quả
    await update.message.reply_text(result_text)

    if result_file and result_file.exists():
        suffix = result_file.suffix.lower()
        if suffix == ".mp3":
            await update.message.reply_audio(audio=result_file.open("rb"),
                                              filename=result_file.name)
        elif suffix == ".mp4":
            await update.message.reply_video(video=result_file.open("rb"),
                                              filename=result_file.name)


async def cmd_start(update: Update, context: ContextTypes.DEFAULT_TYPE):  # noqa: ARG001
    await update.message.reply_text(
        "👋 Chào Sếp Nhân!\n\n"
        "Mình là trợ lý Nhân Tâm Manager. Sếp có thể nhắn:\n\n"
        "🎙 *Tạo voiceover* — mô tả nội dung cần đọc\n"
        "🎬 *Tạo video* — mô tả cảnh quay\n"
        "📘 *Đăng Facebook* — nội dung + video cần đăng\n"
        "📊 *Hỏi giá/thông tin* — bất kỳ câu hỏi nào về brand\n",
        parse_mode="Markdown"
    )


# ---------- Main ----------

def main():
    if not BOT_TOKEN:
        print("ERROR: TELEGRAM_BOT_TOKEN not set in .env")
        sys.exit(1)

    sys.stdout.reconfigure(encoding='utf-8')
    print("[BOT] Nhan Tam Manager Bot dang chay...")
    app = (
        ApplicationBuilder()
        .token(BOT_TOKEN)
        .connect_timeout(30)
        .read_timeout(30)
        .write_timeout(30)
        .pool_timeout(30)
        .build()
    )
    app.add_handler(CommandHandler("start", cmd_start))
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_message))
    print("[BOT] Starting polling...")
    app.run_polling(poll_interval=3, timeout=30, drop_pending_updates=True)


if __name__ == "__main__":
    main()
