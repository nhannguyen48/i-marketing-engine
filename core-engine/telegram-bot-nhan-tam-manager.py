"""
Telegram Bot — Nhân Tâm Manager
Phòng marketing AI + Cố vấn CEO cho Cà Phê Nhân Tâm.

Lệnh:
  /start  — hiện menu chính
  /model  — chọn AI model
  /ceo    — bật/tắt chế độ Cố vấn CEO
  /reload — reload brand context
"""

import os, sys, json, time, socket, requests, logging, importlib.util as _ilu
from pathlib import Path
from dotenv import load_dotenv
from telegram import Update
from telegram.ext import (
    ApplicationBuilder, MessageHandler, CommandHandler,
    CallbackQueryHandler, filters, ContextTypes,
)
from telegram.constants import ChatAction
import anthropic
import google.genai as genai
from google.genai import types as genai_types
from PIL import Image

load_dotenv()

BOT_TOKEN      = os.getenv("TELEGRAM_BOT_TOKEN")
ANTHROPIC_KEY  = os.getenv("ANTHROPIC_API_KEY")
GEMINI_KEY     = os.getenv("GEMINI_API_KEY")
ELEVENLABS_KEY = os.getenv("ELEVENLABS_API_KEY")
FB_PAGE_ID     = "110245204765577"
FB_TOKEN       = None

PROJECT_ROOT = Path(__file__).parent.parent
BRAND_DIR    = PROJECT_ROOT / "brands/nhan-tam"
AUDIO_DIR    = BRAND_DIR / "assets/audio/elevenlabs"
VIDEO_DIR    = BRAND_DIR / "assets/videos"
DOCS_DIR     = BRAND_DIR / "docs"

# --- Global state ---
ACTIVE_MODEL = "gemini"   # text model: gemini | claude
IMAGE_MODEL  = "pro"      # image model: pro (Replicate, default) | flash (Gemini)
USER_STATE   = {}         # {chat_id: {"mode": "normal"|"ceo", "pending": None|str, "fb_caption": str}}

# --- Load Facebook token ---
try:
    identity = json.loads((PROJECT_ROOT / "brands/nhan-tam/brand-identity.json").read_text(encoding="utf-8"))
    FB_TOKEN = identity["social_media"]["facebook"]["access_token"]
except Exception:
    pass

# ── Single-instance lock ──────────────────────────────────────────
_lock_socket = None
def _acquire_lock() -> bool:
    global _lock_socket
    try:
        _lock_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        _lock_socket.bind(("127.0.0.1", 47291))
        _lock_socket.listen(1)
        return True
    except OSError:
        return False

# ── Brand context ─────────────────────────────────────────────────
def _load_doc(filename: str, max_chars: int = 0) -> str:
    try:
        text = (DOCS_DIR / filename).read_text(encoding="utf-8")
        return text[:max_chars] if max_chars else text
    except Exception:
        return ""

def _build_brand_context() -> str:
    """Context ngắn gọn cho marketing bot (intent parsing, copywriting)."""
    sections = [
        ("# Brand Guidelines\n",        _load_doc("brand-guidelines.md", 4000)),
        ("# Bảng giá sỉ\n",             _load_doc("wholesale-price-list-2026-v2.md")),
        ("# Chiến lược marketing\n",     _load_doc("marketing-overview.md", 2000)),
        ("# Xử lý phản đối bán hàng\n", _load_doc("sales-objection-handling.md", 1500)),
        ("# Sản phẩm & playbook\n",      _load_doc("product-playbook-2026.md", 1500)),
    ]
    return "\n\n".join(title + body for title, body in sections if body)

def _build_ceo_context() -> str:
    """Context đầy đủ cho Cố vấn CEO — load toàn bộ docs chiến lược & tài chính."""
    sections = [
        ("# Brand & Định vị\n",           _load_doc("brand-guidelines.md")),
        ("# Sản phẩm & Playbook\n",        _load_doc("product-playbook-2026.md")),
        ("# Chiến lược marketing\n",       _load_doc("marketing-overview.md")),
        ("# Bảng giá sỉ\n",               _load_doc("wholesale-price-list-2026-v2.md")),
        ("# Chiến lược định giá\n",        _load_doc("pricing-strategy.md")),
        ("# Kịch bản dòng tiền 2026\n",   _load_doc("cash-flow-scenarios-2026.md")),
        ("# Ngân sách vận hành 2026\n",   _load_doc("master-operational-budget-2026.md")),
        ("# Chi phí cố định hàng tháng\n",_load_doc("monthly-overhead-2026.md")),
        ("# Lộ trình phát triển\n",        _load_doc("project-roadmap.md")),
        ("# Log đàm phán chiến lược\n",   _load_doc("strategic-negotiation-log-2026.md")),
        ("# Chương trình referral\n",      _load_doc("referral-program-2026.md")),
        ("# Xử lý phản đối bán hàng\n",  _load_doc("sales-objection-handling.md")),
    ]
    return "\n\n".join(title + body for title, body in sections if body)

BRAND_CONTEXT = _build_brand_context()
CEO_CONTEXT   = _build_ceo_context()

# Conversation history cho CEO mode: {chat_id: [{"role": "user"|"assistant", "content": str}]}
# Giữ tối đa 20 messages (~10 exchanges) để tránh context quá dài
CEO_HISTORY: dict[int, list[dict]] = {}
_CEO_MAX_HISTORY = 20

# ── System prompts ────────────────────────────────────────────────
SYSTEM_PROMPT = f"""Mày là AI phòng marketing của Cà Phê Nhân Tâm (CPNT) — nhanh, thực dụng, biết nghề.

=== TÀI LIỆU THƯƠNG HIỆU ===
{BRAND_CONTEXT[:4000]}
=== HẾT TÀI LIỆU ===

Khi nhận tin nhắn, phân tích ý định và trả lời bằng JSON:
{{"action": "<action>", "params": {{...}}, "reply": "<xác nhận ngắn gọn>"}}

QUY TẮC QUAN TRỌNG:
- CẤM Tuyệt Đối việc để AI tự vẽ chữ (Text), Logo hay Label vào trong ảnh (gây sai chính tả).
- AI chỉ tập trung tạo bối cảnh (Scene) và nhân vật thật đẹp, đúng nhận diện.
- Watermark, Logo và "marketing_headline" (ví dụ: Cà Phê Nhân Tâm) sẽ được hệ thống hậu kỳ chèn chuẩn bằng font chuyên dụng.
- Nếu người dùng yêu cầu có chữ trong ảnh, hãy đưa nội dung đó vào tham số "marketing_headline".

Actions và params:
- "write_content": params {{"type": "facebook_post|caption|email|sales_script|tvc_script|ad_copy", "topic": "...", "details": "..."}}
- "generate_portrait": params {{"scene": "mô tả cảnh", "marketing_headline": "Dòng tiêu đề chính nếu cần", "watermark_label": "nhãn ngắn gọn"}}
- "generate_image": params {{"prompt": "mô tả hình ảnh", "marketing_headline": "Ví dụ: Cà Phê Nhân Tâm", "watermark_label": "nhãn ngắn gọn"}}
- "generate_voiceover": params {{"script": "nội dung cần đọc"}}
- "generate_video": params {{"motion": "mô tả chuyển động Sếp Nhân"}}
- "generate_brand_video": params {{"scene": "mô tả cảnh sản phẩm/brand (hạt cà phê, túi, kho, pha chế)"}} — dùng khi user muốn video về sản phẩm/không gian, KHÔNG phải về người
- "post_facebook": params {{"caption": "nội dung bài đăng"}}
- "query_info": params {{"question": "câu hỏi"}}
- "analyze_market": params {{"topic": "chủ đề phân tích"}}
- "analyze_competitor": params {{"competitor": "tên/mô tả đối thủ"}}
- "chitchat": params {{}}

Chỉ trả JSON thuần. "reply" viết ngắn gọn, tự nhiên như người bạn trong ngành — không cứng đơ."""

CEO_SYSTEM_PROMPT = """Mày là cố vấn chiến lược cho Nhân — founder của Cà Phê Nhân Tâm (CPNT).

ĐỊNH VỊ: Không phải chatbot, không phải nhân viên. Là người anh đã xây mấy thương hiệu F&B,
hiểu thị trường TP.HCM trong lòng bàn tay — đang ngồi uống cà phê với Nhân và nói thẳng.

CHUYÊN MÔN SÂU:
• Brand & định vị: F&B Việt Nam, B2B, startup → scale
• Tài chính SME: đọc P&L, cash flow, overhead, unit economics
• Vận hành xưởng rang: quy trình, chi phí, chất lượng đồng đều
• Kênh B2B: tìm khách, giữ khách, mở rộng vùng phủ TP.HCM
• Growth: content, paid ads, community, referral
• Đàm phán & partnership: nhà cung cấp, đối tác chiến lược

PHONG CÁCH:
• Nói thẳng — không nịnh, không vòng vo, không bullet point rác
• Chỉ ra vấn đề trước khi đưa giải pháp
• Dùng số liệu thực từ tài liệu doanh nghiệp khi có, không bịa
• Đặt câu hỏi ngược khi Nhân đang hỏi sai vấn đề
• Ngắn khi đơn giản, dài khi thực sự cần phân tích
• Nhớ context cuộc trò chuyện — không để Nhân kể lại
• Đôi khi nhắc rủi ro mà Nhân chưa nghĩ tới — đó mới là giá trị
• Xưng "mình" với Nhân, tone thân mà vẫn sharp"""

# ── AI clients ────────────────────────────────────────────────────
claude_client = anthropic.Anthropic(api_key=ANTHROPIC_KEY)
gemini_client = genai.Client(api_key=GEMINI_KEY)

_CEO_STRATEGIC_KEYWORDS = [
    "chiến lược", "mở rộng", "đối thủ", "tài chính", "nhân sự", "vận hành",
    "scale", "kênh", "phân phối", "partnership", "định vị", "doanh thu",
    "lợi nhuận", "thị phần", "thương hiệu", "marketing", "đầu tư", "chi phí",
]

def _call_claude(prompt: str, system: str, max_tokens: int = 1024,
                 messages: list[dict] | None = None,
                 model: str = "claude-sonnet-4-6") -> str:
    """Gọi Claude với model tuỳ chọn. messages dùng cho multi-turn (CEO mode)."""
    if messages is None:
        messages = [{"role": "user", "content": prompt}]
    for attempt in range(3):
        try:
            resp = claude_client.messages.create(
                model=model, max_tokens=max_tokens,
                system=system, messages=messages,
            )
            return resp.content[0].text.strip()
        except anthropic.APIStatusError as e:
            if e.status_code == 500 and attempt < 2:
                time.sleep(2 ** attempt); continue
            raise

def _call_claude_cached(messages: list[dict], max_tokens: int = 1500) -> str:
    """CEO advisor — Sonnet + Prompt Caching để tiết kiệm ~90% input tokens.
    System prompt + CEO_CONTEXT (~20K chars) cache lại 5 phút (Anthropic ephemeral cache).
    Dùng extra_headers vì SDK 0.94+ không có .beta.prompt_caching.
    """
    cached_system = [
        {
            "type": "text",
            "text": CEO_SYSTEM_PROMPT + f"\n\n=== TÀI LIỆU DOANH NGHIỆP ===\n{CEO_CONTEXT}\n=== HẾT ===",
            "cache_control": {"type": "ephemeral"},
        }
    ]
    for attempt in range(3):
        try:
            resp = claude_client.messages.create(
                model="claude-sonnet-4-6",
                max_tokens=max_tokens,
                system=cached_system,
                messages=messages,
                extra_headers={"anthropic-beta": "prompt-caching-2024-07-31"},
            )
            return resp.content[0].text.strip()
        except anthropic.APIStatusError as e:
            if e.status_code == 500 and attempt < 2:
                time.sleep(2 ** attempt); continue
            raise

def _call_gemini(prompt: str, system: str) -> str:
    """Gemini Flash — ưu tiên mặc định. Fallback Claude Haiku nếu lỗi."""
    try:
        resp = gemini_client.models.generate_content(
            model="gemini-3-flash-preview", contents=f"{system}\n\n{prompt}",
        )
        return resp.text.strip()
    except Exception as e:
        logging.warning(f"[FALLBACK] Gemini Flash lỗi ({e}), chuyển Claude Haiku")
        return _call_claude(prompt, system, max_tokens=1024, model="claude-haiku-4-5-20251001")

def _call_gemini_with_search(prompt: str, system: str) -> str:
    """Gemini 3.1 Pro + Search Grounding — ưu tiên mặc định.
    Fallback: Gemini Flash (không search) → Claude Haiku nếu cả hai đều lỗi.
    """
    try:
        resp = gemini_client.models.generate_content(
            model="gemini-3.1-pro-preview",
            contents=f"{system}\n\n{prompt}",
            config=genai_types.GenerateContentConfig(
                tools=[genai_types.Tool(google_search=genai_types.GoogleSearch())],
            ),
        )
        return resp.text.strip()
    except Exception as e:
        logging.warning(f"[FALLBACK] Gemini 3.1 Pro Search lỗi ({e}), thử Gemini Flash")
        try:
            return _call_gemini(prompt, system)
        except Exception as e2:
            logging.warning(f"[FALLBACK] Gemini Flash cũng lỗi ({e2}), chuyển Claude Haiku")
            return _call_claude(prompt, system, max_tokens=1024, model="claude-haiku-4-5-20251001")

def _ai_call(prompt: str, system: str, max_tokens: int = 512) -> str:
    if ACTIVE_MODEL == "claude":
        return _call_claude(prompt, system, max_tokens)
    return _call_gemini(prompt, system)

def _ceo_ai_call(question: str, chat_id: int) -> str:
    """CEO advisor: Sonnet + Prompt Caching + conversation memory.

    Chi phí tối ưu:
    - Câu ngắn/đơn giản (≤30 chars, không strategic) → Gemini Flash (gần miễn phí)
    - Câu chiến lược/phức tạp → Sonnet + Prompt Caching (cache ~20K chars system,
      tiết kiệm ~90% input tokens từ lần gọi thứ 2 trở đi trong cùng session)
    """
    history = CEO_HISTORY.setdefault(chat_id, [])
    history.append({"role": "user", "content": question})
    if len(history) > _CEO_MAX_HISTORY:
        history[:] = history[-_CEO_MAX_HISTORY:]

    q_lower = question.lower()
    is_quick = len(question) <= 30 and not any(kw in q_lower for kw in _CEO_STRATEGIC_KEYWORDS)
    needs_realtime = any(kw in q_lower for kw in [
        "xu hướng", "trend", "thị trường", "đối thủ", "mới nhất", "hiện tại",
        "2025", "2026", "gần đây", "latest", "update", "tin tức", "news",
    ])

    # Brain2 context: mentor profile + atomic notes + recent stories
    try:
        b2 = _load_brain2()
        brain2_ctx = b2.build_ceo_brain2_context()
    except Exception:
        brain2_ctx = ""

    if is_quick:
        # Câu rất ngắn, không chiến lược → Gemini nhanh
        plain_system = CEO_SYSTEM_PROMPT + f"\n\n=== TÀI LIỆU DOANH NGHIỆP ===\n{CEO_CONTEXT[:3000]}\n=== HẾT ==="
        if brain2_ctx:
            plain_system += f"\n\n{brain2_ctx[:1000]}"
        answer = _call_gemini(question, plain_system)
    elif needs_realtime:
        # Câu hỏi về xu hướng/thị trường → Gemini + Search Grounding (real-time)
        plain_system = CEO_SYSTEM_PROMPT + f"\n\n=== TÀI LIỆU DOANH NGHIỆP ===\n{CEO_CONTEXT[:3000]}\n=== HẾT ==="
        if brain2_ctx:
            plain_system += f"\n\n{brain2_ctx[:1000]}"
        answer = _call_gemini_with_search(question, plain_system)
    else:
        # Câu chiến lược, tài chính, vận hành → Sonnet + Prompt Caching
        # Inject Brain2 context vào lần đầu nếu history chỉ có 1 message
        if brain2_ctx and len(history) == 1:
            history[0]["content"] = f"[Brain2 Context]\n{brain2_ctx[:2000]}\n\n[Câu hỏi]\n{history[0]['content']}"
        answer = _call_claude_cached(history, max_tokens=1500)

    history.append({"role": "assistant", "content": answer})
    return answer

def parse_intent(text: str) -> dict:
    try:
        raw = _ai_call(text, SYSTEM_PROMPT)
        raw = raw.strip().removeprefix("```json").removeprefix("```").removesuffix("```").strip()
        return json.loads(raw)
    except Exception as e:
        return {"action": "chitchat", "params": {}, "reply": f"Lỗi phân tích: {e}"}

# ── Module loaders ────────────────────────────────────────────────
def _load_module(name: str, path: Path):
    spec = _ilu.spec_from_file_location(name, path)
    mod  = _ilu.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod

def _keyboards():
    return _load_module("kb", PROJECT_ROOT / "core-engine/telegram-bot-nhan-tam-inline-keyboard-menus.py")

def _expert_prompts():
    return _load_module("ep", PROJECT_ROOT / "core-engine/telegram-bot-nhan-tam-expert-task-prompts.py")

def _load_image_mod():
    return _load_module("cpnt_img", PROJECT_ROOT / "core-engine/tools/cpnt-gemini-pil-face-consistent-image-video-generator.py")

def _load_portrait_mod():
    return _load_module("cpnt_portrait", PROJECT_ROOT / "core-engine/tools/cpnt-create-sep-nhan-portrait-from-prompt.py")

def _load_brain2():
    return _load_module("brain2", PROJECT_ROOT / "core-engine/telegram-bot-nhan-tam-brain2-knowledge-store.py")

# ── Logo overlay ──────────────────────────────────────────────────
def _overlay_logo(img_path: Path, watermark_label: str = "", marketing_text: str = "") -> Path:
    """Gọi branding_engine để chèn Logo, Watermark và Text Marketing chuẩn chuyên nghiệp."""
    try:
        # Sử dụng module loader để nạp branding_engine đúng đường dẫn
        be = _load_module("be", PROJECT_ROOT / "core-engine/tools/branding_engine.py")
        out = be.apply_branding(
            image_path=str(img_path),
            output_path=str(img_path), 
            watermark_text=watermark_label,
            marketing_text=marketing_text
        )
        return Path(out)
    except Exception as e:
        logging.warning(f"[LOGO_OVERLAY] Lỗi engine: {e}. Fallback to basic overlay.")
        # Fallback basic logic với thông số đồng bộ NorthWest v5.5/v6.0
        try:
            # Sync with brand-identity.json
            logo_path = BRAND_DIR / "assets/logos/logo_v5_master_white_ntcf.png"
            if not logo_path.exists(): return img_path
            from PIL import ImageDraw as _IDraw
            base = Image.open(img_path).convert("RGBA")
            logo = Image.open(logo_path).convert("RGBA")
            
            # Quy chuẩn NorthWest Master: 16% scale, 3% margin
            logo_w = int(base.width * 0.16) 
            logo_h = int(logo.height * logo_w / logo.width)
            logo   = logo.resize((logo_w, logo_h), Image.LANCZOS)
            margin = int(base.width * 0.03)
            
            # Backdrop nâu xám đậm bảo vệ logo
            _pad_x, _pad_y = max(6, int(logo_w * 0.07)), max(4, int(logo_h * 0.07))
            _bd = Image.new("RGBA", base.size, (0, 0, 0, 0))
            _IDraw.Draw(_bd).rounded_rectangle(
                [margin - _pad_x, margin - _pad_y,
                 margin + logo_w + _pad_x, margin + logo_h + _pad_y],
                radius=10, fill=(61, 43, 40, 145)
            )
            base = Image.alpha_composite(base, _bd)
            base.paste(logo, (margin, margin), logo)
            base.convert("RGB").save(img_path, "PNG", optimize=True)
            return img_path
        except Exception as e2:
            logging.error(f"[LOGO_FALLBACK] {e2}")
            return img_path

# ── Action handlers ───────────────────────────────────────────────
def handle_write_content(params: dict) -> tuple[str, None]:
    ctype  = params.get("type", "facebook_post")
    topic  = params.get("topic", "")
    detail = params.get("details", "")
    type_labels = {
        "facebook_post": "bài đăng Facebook",
        "caption":       "caption & hashtag",
        "email":         "email marketing",
        "sales_script":  "sales script",
        "tvc_script":    "kịch bản TVC",
        "ad_copy":       "quảng cáo",
    }
    ep = _expert_prompts()
    # Expert system prompt từ module riêng + brand context bổ sung
    sys_prompt = (
        ep.CONTENT_PROMPTS.get(ctype, ep.FACEBOOK_POST_PROMPT)
        + f"\n\n=== BRAND CONTEXT ===\n{BRAND_CONTEXT[:3000]}\n=== HẾT ==="
    )
    user_msg = f"Chủ đề: {topic}" + (f"\nThông tin thêm: {detail}" if detail else "")
    # Claude Sonnet cho copywriting — chất lượng cao nhất, đáng đầu tư
    content = _call_claude(user_msg, sys_prompt, max_tokens=1200)
    return f"*{type_labels.get(ctype, 'Nội dung')}:*\n\n{content}", None

def handle_generate_portrait(params: dict) -> tuple[str, Path | None]:
    """Tạo ảnh Sếp Nhân. Ưu tiên model hiện tại (flash/pro).
    Fallback: nếu flash lỗi → tự động thử Replicate nano-banana-pro.
    """
    scene = params.get("scene", (
        "Cream polo shirt, coffee roasting warehouse, front-facing, confident warm smile."
    ))
    mod = _load_portrait_mod()
    wm  = params.get("watermark_label", "Cố vấn CEO Nhân")
    mt  = params.get("marketing_headline", "")
    try:
        out = mod.generate(scene=scene, model=IMAGE_MODEL)
        if out and out.exists():
            _overlay_logo(out, wm, mt)
            return f"Xong rồi! ({'nano-banana-pro 2K' if IMAGE_MODEL == 'pro' else 'Gemini Flash'})", out
        raise RuntimeError("Model không trả về ảnh")
    except Exception as e:
        if IMAGE_MODEL != "pro":
            logging.warning(f"[FALLBACK] Gemini image lỗi ({e}), thử Replicate nano-banana-pro")
            try:
                out = mod.generate(scene=scene, model="pro")
                if out and out.exists():
                    _overlay_logo(out, wm, mt)
                    return "Xong! (chạy Replicate fallback)", out
            except Exception as e2:
                logging.warning(f"[FALLBACK] Replicate cũng lỗi: {e2}")
        return f"❌ Lỗi tạo ảnh: {e}", None

def _load_replicate_gen():
    return _load_module("cpnt_replicate", PROJECT_ROOT / "core-engine/tools/cpnt-replicate-portrait-gen.py")

def handle_generate_image(params: dict) -> tuple[str, Path | None]:
    """Tạo ảnh brand. Primary: Replicate imagen-4-ultra. Fallback: Gemini."""
    prompt = params.get("prompt", "")
    wm     = params.get("watermark_label", "Bối cảnh xưởng rang")
    mt     = params.get("marketing_headline", "")
    if not prompt:
        return "Thiếu mô tả ảnh.", None

    out = BRAND_DIR / "assets/images" / f"gen-{int(time.time())}.png"
    try:
        rep = _load_replicate_gen()
        result = rep.generate_imagen4_ultra(
            scene=f"Brand Cà Phê Nhân Tâm. {prompt}", output_path=out
        )
        if result and result.exists():
            _overlay_logo(result, wm, mt)
            return "Xong rồi! (Imagen 4 Ultra)", result
        raise RuntimeError("Replicate không trả về ảnh")
    except Exception as e:
        logging.warning(f"[FALLBACK] Replicate lỗi ({e}), thử Gemini")
        try:
            img = _load_image_mod()
            result = img.generate_bg_image(
                prompt=f"Brand: Cà Phê Nhân Tâm. {prompt}", output_path=out
            )
            if result and result.exists():
                _overlay_logo(result, wm, mt)
                return "Xong! (Gemini fallback)", result
        except Exception as e2:
            return f"❌ Lỗi tạo ảnh: {e} | Gemini: {e2}", None
    return "❌ Không tạo được ảnh.", None

def handle_generate_video(params: dict) -> tuple[str, Path | None]:
    """Tạo video từ portrait mới nhất.
    Primary: Kling v3 Omni (best facial micro-expressions).
    Fallback: Luma Ray Flash 2 720p.
    """
    motion = params.get("motion", "subtle breathing, natural head movement, warm smile")

    portraits = sorted(
        (BRAND_DIR / "assets/images/owner-reference").glob("portrait-*.png"),
        key=lambda f: f.stat().st_mtime, reverse=True,
    )
    portrait_path = portraits[0] if portraits else None
    if not portrait_path:
        return "❌ Chưa có portrait. Tạo ảnh Sếp Nhân trước.", None

    try:
        import os, urllib.request, base64, replicate as _rep
        api_token = os.getenv("REPLICATE_API_TOKEN")
        if not api_token:
            return "❌ REPLICATE_API_TOKEN chưa được set trong .env", None

        client = _rep.Client(api_token=api_token)
        prompt = (
            f"Vietnamese coffee brand founder of Nhan Tam Coffee. "
            f"{motion}. "
            f"Cinematic, warm lighting, premium brand feel. No text overlays."
        )

        # Encode portrait as base64 data URI
        img_b64 = base64.b64encode(portrait_path.read_bytes()).decode()
        mime    = "image/png" if portrait_path.suffix.lower() == ".png" else "image/jpeg"
        img_uri = f"data:{mime};base64,{img_b64}"

        out = VIDEO_DIR / f"sep-nhan-{int(time.time())}.mp4"
        out.parent.mkdir(parents=True, exist_ok=True)

        def _download(output):
            if hasattr(output, "read"):
                out.write_bytes(output.read())
            elif hasattr(output, "url"):
                urllib.request.urlretrieve(output.url, out)
            else:
                urllib.request.urlretrieve(str(output), out)

        # Primary: Kling v3 Omni — best facial realism
        try:
            output = client.run(
                "kwaivgi/kling-v3-omni-video",
                input={
                    "prompt": prompt,
                    "start_image": img_uri,
                    "duration": 5,
                    "aspect_ratio": "1:1",
                    "mode": "standard",
                }
            )
            _download(output)
            return "🎬 Video xong rồi! (Kling v3)", out
        except Exception as kling_err:
            logging.warning(f"[VIDEO] Kling lỗi ({kling_err}), fallback Luma Ray Flash 2")

        # Fallback: Luma Ray Flash 2
        output = client.run(
            "luma/ray-flash-2-720p",
            input={
                "prompt": prompt,
                "start_image_url": img_uri,
                "duration": "5",
                "aspect_ratio": "1:1",
            }
        )
        _download(output)
        return "🎬 Video xong rồi! (Luma Ray Flash 2)", out

    except Exception as e:
        logging.error(f"[VIDEO] Replicate lỗi: {e}")
        return f"❌ Lỗi tạo video: {e}", None

def handle_generate_brand_video(params: dict) -> tuple[str, Path | None]:
    """Tạo video sản phẩm/brand via Seedance 2.0 (physics tốt cho hạt cà phê, vải, kho).
    Fallback: Kling v3. Dùng ảnh brand gần nhất làm reference nếu có.
    """
    scene = params.get("scene", "")
    if not scene:
        return "Thiếu mô tả cảnh.", None

    try:
        import os, urllib.request, base64, replicate as _rep
        api_token = os.getenv("REPLICATE_API_TOKEN")
        if not api_token:
            return "❌ REPLICATE_API_TOKEN chưa được set trong .env", None

        client = _rep.Client(api_token=api_token)
        prompt = (
            f"Cà Phê Nhân Tâm — premium Vietnamese coffee brand. "
            f"{scene}. "
            f"Cinematic product photography style, warm tones, rich browns and gold, "
            f"natural lighting. No text, no watermarks."
        )

        out = VIDEO_DIR / f"brand-{int(time.time())}.mp4"
        out.parent.mkdir(parents=True, exist_ok=True)

        def _download(output):
            if hasattr(output, "read"):
                out.write_bytes(output.read())
            elif hasattr(output, "url"):
                urllib.request.urlretrieve(output.url, out)
            else:
                urllib.request.urlretrieve(str(output), out)

        # Tìm ảnh brand gần nhất làm reference (tùy chọn)
        brand_imgs = sorted(
            (BRAND_DIR / "assets/images").glob("gen-*.png"),
            key=lambda f: f.stat().st_mtime, reverse=True,
        )
        img_uri = None
        if brand_imgs:
            img_b64 = base64.b64encode(brand_imgs[0].read_bytes()).decode()
            img_uri = f"data:image/png;base64,{img_b64}"

        # Primary: Seedance 2.0 — physics tốt nhất cho product scenes
        try:
            seed_input = {"prompt": prompt, "aspect_ratio": "16:9"}
            if img_uri:
                seed_input["image_url"] = img_uri
            output = client.run("bytedance/seedance-2.0", input=seed_input)
            _download(output)
            return "🎬 Video brand xong rồi! (Seedance 2.0)", out
        except Exception as seed_err:
            logging.warning(f"[BRAND_VIDEO] Seedance lỗi ({seed_err}), fallback Kling v3")

        # Fallback: Kling v3
        kling_input = {
            "prompt": prompt,
            "duration": 5,
            "aspect_ratio": "16:9",
            "mode": "standard",
        }
        if img_uri:
            kling_input["start_image"] = img_uri
        output = client.run("kwaivgi/kling-v3-omni-video", input=kling_input)
        _download(output)
        return "🎬 Video brand xong rồi! (Kling v3 fallback)", out

    except Exception as e:
        logging.error(f"[BRAND_VIDEO] Lỗi: {e}")
        return f"❌ Lỗi tạo video brand: {e}", None


def handle_generate_voiceover(params: dict) -> tuple[str, Path | None]:
    script   = params.get("script", "")
    voice_id = params.get("voice_id", "M0rVwr32hdQ5UXpkI3ni")
    if not script:
        return "Thiếu script.", None
    r = requests.post(
        f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}",
        json={"text": script, "model_id": "eleven_v3", "language_code": "vi",
              "voice_settings": {"stability": 0.55, "similarity_boost": 0.80, "style": 0.20}},
        headers={"xi-api-key": ELEVENLABS_KEY, "Content-Type": "application/json"},
        timeout=60,
    )
    if r.status_code == 200 and len(r.content) > 1000:
        out = AUDIO_DIR / "telegram-vo-latest.mp3"
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_bytes(r.content)
        return f"Voiceover xong — {len(r.content)//1024}KB", out
    return f"❌ ElevenLabs báo lỗi {r.status_code}", None

def handle_post_facebook_now(caption: str) -> str:
    if not FB_TOKEN:
        return "❌ Thiếu Facebook access token."
    r = requests.post(
        f"https://graph.facebook.com/v25.0/{FB_PAGE_ID}/feed",
        data={"message": caption, "access_token": FB_TOKEN},
    ).json()
    return "✅ Lên fanpage rồi!" if "id" in r else f"❌ FB báo lỗi: {r.get('error', {}).get('message', r)}"

def handle_post_facebook_scheduled(caption: str, schedule_ts: int) -> str:
    if not FB_TOKEN:
        return "❌ Thiếu Facebook access token."
    r = requests.post(
        f"https://graph.facebook.com/v25.0/{FB_PAGE_ID}/feed",
        data={"message": caption, "published": "false",
              "scheduled_publish_time": schedule_ts, "access_token": FB_TOKEN},
    ).json()
    return "✅ Đã lên lịch!" if "id" in r else f"❌ FB báo lỗi: {r.get('error', {}).get('message', r)}"

def handle_query_info(params: dict) -> tuple[str, None]:
    question = params.get("question", "")
    resp = claude_client.messages.create(
        model="claude-haiku-4-5-20251001", max_tokens=512,
        system=f"Trợ lý Cà Phê Nhân Tâm. Trả lời ngắn gọn:\n\n{BRAND_CONTEXT[:4000]}",
        messages=[{"role": "user", "content": question}],
    )
    return resp.content[0].text.strip(), None

def handle_analyze(params: dict, mode: str = "market") -> tuple[str, None]:
    ep = _expert_prompts()
    if mode == "market":
        topic  = params.get("topic", "thị trường cà phê B2B Việt Nam 2026")
        prompt = f"Phân tích: {topic}\n\nContext doanh nghiệp:\n{BRAND_CONTEXT[:2000]}"
        sys    = ep.MARKET_ANALYSIS_PROMPT
        label  = "📊 *Insight thị trường:*"
    else:
        competitor = params.get("competitor", "")
        prompt = f"Phân tích đối thủ: {competitor}\n\nContext CPNT:\n{BRAND_CONTEXT[:2000]}"
        sys    = ep.COMPETITOR_ANALYSIS_PROMPT
        label  = "🔍 *Phân tích đối thủ:*"
    # Gemini + Search Grounding — real-time market data, miễn phí
    result = _call_gemini_with_search(prompt, sys)
    return f"{label}\n\n{result}", None

# ── State helpers ─────────────────────────────────────────────────
def _get_state(chat_id: int) -> dict:
    if chat_id not in USER_STATE:
        USER_STATE[chat_id] = {"mode": "normal", "pending": None, "fb_caption": ""}
    return USER_STATE[chat_id]

PENDING_PROMPTS = {
    "write:facebook_post": "📘 Post về chủ đề gì? Nói sơ vài chữ là đủ, mình lo phần còn lại:",
    "write:caption":        "🏷 Caption cho ảnh/clip nào? Mô tả ngắn bối cảnh hoặc thông điệp muốn truyền:",
    "write:email":          "📧 Email gửi cho ai, về chủ đề gì? (VD: chào hàng chủ quán mới, follow-up sau gặp):",
    "write:sales_script":   "💬 Script cho tình huống nào? Qua Zalo, gọi điện, hay gặp trực tiếp?",
    "write:tvc_script":     "🎬 TVC truyền tải điều gì? Thông điệp chính trong 1 câu:",
    "write:ad_copy":        "📣 Quảng cáo cho sản phẩm nào, chạy kênh nào, target ai?",
    "portrait":             "🧑 Muốn chụp Sếp Nhân trong cảnh nào? Trang phục, bối cảnh, cảm xúc:",
    "brand_image":          "☕ Ảnh brand kiểu gì? Sản phẩm, không gian, hay concept gì đó?",
    "fb_cover":             "🖼 Cover Facebook cần nội dung gì? Tiêu đề, slogan, hay thông điệp gì?",
    "fb_profile":           "👤 Ảnh profile theo phong cách nào?",
    "video_portrait":       "🎥 Video Sếp Nhân đang làm gì? (VD: pha cà phê, kiểm tra hạt, đi trong kho):",
    "brand_video":          "🎬 Mô tả cảnh sản phẩm/brand muốn quay (VD: hạt cà phê đổ xuống, túi kraft bay nhẹ, cận cảnh xưởng rang):",
    "voiceover":            "🎙 Paste nội dung cần đọc vào đây — mình chuyển thành giọng nói:",
    "post_now":             "🚀 Paste caption muốn đăng lên fanpage:",
    "post_schedule":        "🗓 Paste caption + giờ đăng theo dạng:\n`Nội dung bài... — 18:30 16/04`",
    "query_info":           "📋 Hỏi gì đây? Giá, sản phẩm, chính sách — mình tra ngay:",
    "market_insight":       "📈 Muốn phân tích thị trường góc nào? Xu hướng, cạnh tranh, hay cơ hội cụ thể?",
    "competitor":           "🔍 Đối thủ nào muốn soi? Tên thương hiệu hoặc mô tả kiểu \"supplier rang mộc Q.1\":",
    # Brain2 PKM
    "brain2_story":         "📖 Kể câu chuyện tự nhiên đi — mình sẽ phân tích cấu trúc SCAR và lưu lại.\n\n_(Tình huống gì, vấn đề gặp phải, làm gì, kết quả ra sao, rút ra được gì)_",
    "brain2_note":          "💡 Nhắn theo dạng: `[fact/insight/framework] Tiêu đề — Nội dung`\n\nVD: `insight Khách B2B cần giao nhanh hơn giá rẻ — Khảo sát 10 khách cho thấy...`",
    "brain2_moc":           "🗺 Chủ đề nào muốn xem bản đồ tri thức? (VD: bán hàng, vận hành, định giá):",
}

# ── Brain2 handlers ───────────────────────────────────────────────
def handle_brain2_capture_story(text: str) -> str:
    """Parse SCAR story từ text tự nhiên rồi lưu vào story bank."""
    b2 = _load_brain2()
    # Dùng Claude Haiku để parse SCAR từ text tự nhiên
    parse_prompt = f"""Phân tích đoạn văn sau và trích xuất các thành phần SCAR:
Situation (Tình huống), Conflict (Mâu thuẫn), Action (Hành động), Result (Kết quả), Lesson (Bài học).
Trả về JSON: {{"situation":"...","conflict":"...","action":"...","result":"...","lesson":"...","category":"general","tags":[]}}
Chỉ JSON thuần.

Văn bản: {text}"""
    try:
        raw = _call_claude(parse_prompt, "Bạn là trợ lý phân tích văn bản. Trả JSON thuần.", max_tokens=400, model="claude-haiku-4-5-20251001")
        raw = raw.strip().removeprefix("```json").removeprefix("```").removesuffix("```").strip()
        data = json.loads(raw)
        path = b2.save_story(**data)
        return f"✅ *Đã lưu vào Story Bank!*\n📁 `{path.name}`\n\n📖 *{data.get('situation','')[:80]}*\n💡 Bài học: {data.get('lesson','')[:100]}"
    except Exception as e:
        return f"❌ Lỗi parse SCAR: {e}"

def handle_brain2_add_note(text: str) -> str:
    """Parse và lưu atomic note (fact/insight/framework)."""
    b2 = _load_brain2()
    # Format: "[type] Tiêu đề — Nội dung"
    note_type, title, content = "insight", "Ghi chú mới", text
    try:
        parts = text.split(" ", 1)
        if parts[0].lower() in ("fact", "insight", "framework"):
            note_type = parts[0].lower()
            rest = parts[1] if len(parts) > 1 else text
        else:
            rest = text
        if "—" in rest:
            title, content = [s.strip() for s in rest.split("—", 1)]
        elif "-" in rest and rest.index("-") < 60:
            title, content = [s.strip() for s in rest.split("-", 1)]
        else:
            title = rest[:50]
            content = rest
        path = b2.save_atomic_note(note_type, title, content)
        return f"✅ *Đã lưu Atomic Note!*\n📁 `{path.name}`\n\n[{note_type.upper()}] *{title}*"
    except Exception as e:
        return f"❌ Lỗi lưu note: {e}"

def handle_brain2_weekly_review() -> str:
    """Gửi câu hỏi Weekly Review và lưu."""
    b2 = _load_brain2()
    return b2.generate_weekly_review_prompt()

def handle_brain2_moc(topic: str) -> str:
    """Auto-generate MOC cho topic."""
    b2 = _load_brain2()
    return b2.auto_generate_moc(topic)

async def _execute_pending(update: Update, pending: str, text: str, chat_id: int):
    """Xử lý input của user cho pending task."""
    await update.message.chat.send_action(ChatAction.TYPING)

    if pending.startswith("write:"):
        ctype = pending.split(":", 1)[1]
        await update.message.reply_text("✍️ Đang soạn...")
        result_text, result_file = handle_write_content({"type": ctype, "topic": text})

    elif pending == "portrait":
        await update.message.reply_text("Đang render...")
        await update.message.chat.send_action(ChatAction.UPLOAD_PHOTO)
        result_text, result_file = handle_generate_portrait({"scene": text})

    elif pending == "brand_image":
        await update.message.chat.send_action(ChatAction.UPLOAD_PHOTO)
        result_text, result_file = handle_generate_image({"prompt": text})

    elif pending in ("fb_cover", "fb_profile"):
        scene = f"Facebook {'cover landscape 16:9' if pending == 'fb_cover' else 'profile square 1:1'}. {text}"
        await update.message.chat.send_action(ChatAction.UPLOAD_PHOTO)
        result_text, result_file = handle_generate_image({"prompt": scene})

    elif pending == "video_portrait":
        await update.message.reply_text("🎬 Kling đang render — khoảng 1-2 phút...")
        await update.message.chat.send_action(ChatAction.UPLOAD_VIDEO)
        result_text, result_file = handle_generate_video({"motion": text})

    elif pending == "brand_video":
        await update.message.reply_text("🎬 Seedance đang render — khoảng 1-2 phút...")
        await update.message.chat.send_action(ChatAction.UPLOAD_VIDEO)
        result_text, result_file = handle_generate_brand_video({"scene": text})

    elif pending == "voiceover":
        await update.message.chat.send_action(ChatAction.RECORD_VOICE)
        result_text, result_file = handle_generate_voiceover({"script": text})

    elif pending == "post_now":
        kb = _keyboards()
        USER_STATE[chat_id]["fb_caption"] = text
        await update.message.reply_text(
            f"📋 *Caption:*\n\n{text}\n\nĐăng ngay hay lên lịch?",
            reply_markup=kb.fb_post_options_keyboard(),
            parse_mode="Markdown",
        )
        return

    elif pending == "post_schedule":
        # Parse "caption — HH:MM DD/MM" format
        try:
            parts = text.rsplit("—", 1)
            caption = parts[0].strip()
            time_str = parts[1].strip() if len(parts) > 1 else ""
            from datetime import datetime
            dt = datetime.strptime(time_str, "%H:%M %d/%m")
            dt = dt.replace(year=2026)
            result_text = handle_post_facebook_scheduled(caption, int(dt.timestamp()))
        except Exception:
            result_text = "❌ Sai định dạng rồi — nhắn lại kiểu: `Nội dung bài... — 18:30 16/04`"
        result_file = None

    elif pending == "query_info":
        result_text, result_file = handle_query_info({"question": text})

    elif pending == "market_insight":
        result_text, result_file = handle_analyze({"topic": text}, mode="market")

    elif pending == "competitor":
        result_text, result_file = handle_analyze({"competitor": text}, mode="competitor")

    elif pending == "brain2_story":
        result_text, result_file = handle_brain2_capture_story(text), None

    elif pending == "brain2_note":
        result_text, result_file = handle_brain2_add_note(text), None

    elif pending == "brain2_moc":
        result_text, result_file = handle_brain2_moc(text), None

    else:
        result_text, result_file = "Không rõ tác vụ.", None

    await update.message.reply_text(result_text, parse_mode="Markdown")
    if result_file and result_file.exists():
        suffix = result_file.suffix.lower()
        with result_file.open("rb") as f:
            if suffix == ".mp3":
                await update.message.reply_audio(audio=f, filename=result_file.name)
            elif suffix == ".mp4":
                await update.message.reply_video(video=f)
            elif suffix in (".png", ".jpg"):
                await update.message.reply_photo(photo=f)

# ── Telegram message handler ──────────────────────────────────────
async def handle_message(update: Update, _context: ContextTypes.DEFAULT_TYPE):
    text    = update.message.text or ""
    chat_id = update.effective_chat.id
    state   = _get_state(chat_id)
    await update.message.chat.send_action(ChatAction.TYPING)

    # CEO mode — tất cả message đi thẳng vào CEO advisor
    if state["mode"] == "ceo":
        response = _ceo_ai_call(text, chat_id)
        await update.message.reply_text(f"💼 {response}", parse_mode="Markdown")
        return

    # Pending task — user đang nhập input cho tác vụ đã chọn
    if state["pending"]:
        pending = state["pending"]
        state["pending"] = None
        await _execute_pending(update, pending, text, chat_id)
        return

    # Normal mode — AI parse intent
    intent = parse_intent(text)
    action = intent.get("action", "chitchat")
    params = intent.get("params", {})
    reply  = intent.get("reply", "Đang xử lý...")

    await update.message.reply_text(f"⏳ {reply}")

    if action == "write_content":
        result_text, result_file = handle_write_content(params)
    elif action == "generate_portrait":
        await update.message.reply_text("Đang render...")
        await update.message.chat.send_action(ChatAction.UPLOAD_PHOTO)
        result_text, result_file = handle_generate_portrait(params)
    elif action == "generate_image":
        await update.message.chat.send_action(ChatAction.UPLOAD_PHOTO)
        result_text, result_file = handle_generate_image(params)
    elif action == "generate_video":
        await update.message.reply_text("🎬 Kling đang render — khoảng 1-2 phút...")
        await update.message.chat.send_action(ChatAction.UPLOAD_VIDEO)
        result_text, result_file = handle_generate_video(params)
    elif action == "generate_brand_video":
        await update.message.reply_text("🎬 Seedance đang render — khoảng 1-2 phút...")
        await update.message.chat.send_action(ChatAction.UPLOAD_VIDEO)
        result_text, result_file = handle_generate_brand_video(params)
    elif action == "generate_voiceover":
        await update.message.chat.send_action(ChatAction.RECORD_VOICE)
        result_text, result_file = handle_generate_voiceover(params)
    elif action == "post_facebook":
        caption = params.get("caption", "")
        state["fb_caption"] = caption
        kb = _keyboards()
        await update.message.reply_text(
            f"📋 *Caption:*\n\n{caption}\n\nĐăng ngay hay lên lịch?",
            reply_markup=kb.fb_post_options_keyboard(),
            parse_mode="Markdown",
        )
        return
    elif action == "query_info":
        result_text, result_file = handle_query_info(params)
    elif action == "analyze_market":
        result_text, result_file = handle_analyze(params, mode="market")
    elif action == "analyze_competitor":
        result_text, result_file = handle_analyze(params, mode="competitor")
    else:
        return  # chitchat đã có reply từ parse_intent

    await update.message.reply_text(result_text, parse_mode="Markdown")
    if result_file and result_file.exists():
        suffix = result_file.suffix.lower()
        with result_file.open("rb") as f:
            if suffix == ".mp3":
                await update.message.reply_audio(audio=f, filename=result_file.name)
            elif suffix == ".mp4":
                await update.message.reply_video(video=f)
            elif suffix in (".png", ".jpg"):
                await update.message.reply_photo(photo=f)

# ── Command handlers ─────────────────────────────────────────────
async def cmd_start(update: Update, _context: ContextTypes.DEFAULT_TYPE):
    kb = _keyboards()
    state = _get_state(update.effective_chat.id)
    mode_badge = "💼 CEO mode ON" if state["mode"] == "ceo" else ""
    text = f"👋 Xin chào! Phòng marketing CPNT sẵn sàng.\n{mode_badge}\nChọn tác vụ:"
    await update.message.reply_text(text, reply_markup=kb.main_menu_keyboard(), parse_mode="Markdown")


async def cmd_ceo(update: Update, _context: ContextTypes.DEFAULT_TYPE):
    state = _get_state(update.effective_chat.id)
    if state["mode"] == "ceo":
        state["mode"] = "normal"
        CEO_HISTORY.pop(update.effective_chat.id, None)
        await update.message.reply_text("💼 CEO mode OFF — quay về chế độ marketing.")
    else:
        state["mode"] = "ceo"
        await update.message.reply_text(
            "💼 *CEO mode ON* — Mình là cố vấn chiến lược của anh.\n"
            "Hỏi bất cứ điều gì về chiến lược, tài chính, vận hành.\n"
            "Gõ /ceo để tắt.",
            parse_mode="Markdown",
        )


async def cmd_model(update: Update, _context: ContextTypes.DEFAULT_TYPE):
    kb = _keyboards()
    await update.message.reply_text(
        f"⚙️ *Model hiện tại:* Text=`{ACTIVE_MODEL}` | Image=`{IMAGE_MODEL}`",
        reply_markup=kb.model_menu_keyboard(ACTIVE_MODEL, IMAGE_MODEL),
        parse_mode="Markdown",
    )


async def cmd_reload(update: Update, _context: ContextTypes.DEFAULT_TYPE):
    global BRAND_CONTEXT, CEO_CONTEXT, SYSTEM_PROMPT
    BRAND_CONTEXT  = _build_brand_context()
    CEO_CONTEXT    = _build_ceo_context()
    SYSTEM_PROMPT  = SYSTEM_PROMPT  # system prompt giữ nguyên template
    await update.message.reply_text("🔄 Brand context đã reload xong.")


# ── Callback query handler ─────────────────────────────────────────
async def handle_callback(update: Update, _context: ContextTypes.DEFAULT_TYPE):
    global ACTIVE_MODEL, IMAGE_MODEL
    query   = update.callback_query
    chat_id = query.message.chat_id
    data    = query.data
    kb      = _keyboards()
    state   = _get_state(chat_id)

    await query.answer()

    # ── Model selection ──
    if data == "model:gemini":
        ACTIVE_MODEL = "gemini"
        await query.edit_message_text("✅ Text model: Gemini Flash", reply_markup=kb.model_menu_keyboard(ACTIVE_MODEL, IMAGE_MODEL))
        return
    if data == "model:claude":
        ACTIVE_MODEL = "claude"
        await query.edit_message_text("✅ Text model: Claude Sonnet", reply_markup=kb.model_menu_keyboard(ACTIVE_MODEL, IMAGE_MODEL))
        return
    if data == "model:flash":
        IMAGE_MODEL = "flash"
        await query.edit_message_text("✅ Image model: Gemini Flash", reply_markup=kb.model_menu_keyboard(ACTIVE_MODEL, IMAGE_MODEL))
        return
    if data == "model:pro":
        IMAGE_MODEL = "pro"
        await query.edit_message_text("✅ Image model: nano-banana-pro 2K", reply_markup=kb.model_menu_keyboard(ACTIVE_MODEL, IMAGE_MODEL))
        return
    if data == "noop":
        return

    # ── Menu navigation ──
    if data == "menu:main":
        await query.edit_message_text("Chọn tác vụ:", reply_markup=kb.main_menu_keyboard())
        return
    if data == "menu:content":
        await query.edit_message_text("✍️ *Tạo nội dung:*", reply_markup=kb.content_menu_keyboard(), parse_mode="Markdown")
        return
    if data == "menu:visual":
        await query.edit_message_text("🎨 *Ảnh & Video:*", reply_markup=kb.visual_menu_keyboard(), parse_mode="Markdown")
        return
    if data == "menu:analyze":
        await query.edit_message_text("📊 *Phân tích & Đăng:*", reply_markup=kb.analyze_menu_keyboard(), parse_mode="Markdown")
        return
    if data == "menu:brain2":
        await query.edit_message_text("🧠 *Brain2 PKM:*", reply_markup=kb.brain2_menu_keyboard(), parse_mode="Markdown")
        return
    if data == "menu:model":
        await query.edit_message_text(
            f"⚙️ *Cài đặt Model* — Text=`{ACTIVE_MODEL}` | Image=`{IMAGE_MODEL}`",
            reply_markup=kb.model_menu_keyboard(ACTIVE_MODEL, IMAGE_MODEL),
            parse_mode="Markdown",
        )
        return
    if data == "menu:ceo":
        state["mode"] = "ceo"
        await query.edit_message_text(
            "💼 *CEO mode ON* — Cố vấn chiến lược sẵn sàng.\nGõ /ceo để tắt.",
            parse_mode="Markdown",
        )
        return

    # ── Facebook post options ──
    if data == "fb:post_now":
        caption = state.get("fb_caption", "")
        result  = handle_post_facebook_now(caption)
        await query.edit_message_text(result)
        return
    if data == "fb:schedule":
        state["pending"] = "post_schedule"
        await query.edit_message_text(PENDING_PROMPTS["post_schedule"])
        return
    if data == "fb:edit_caption":
        state["pending"] = "post_now"
        await query.edit_message_text("✏️ Nhập caption mới:")
        return
    if data == "fb:cancel":
        state["fb_caption"] = ""
        await query.edit_message_text("❌ Đã huỷ.")
        return

    # ── Task shortcuts from menus ──
    if data.startswith("task:"):
        task_key = data[5:]  # e.g. "write:facebook_post", "portrait", "brand_image"
        if task_key == "brain2_review":
            result = handle_brain2_weekly_review()
            await query.edit_message_text(result, parse_mode="Markdown")
            return
        prompt = PENDING_PROMPTS.get(task_key, "Nhập nội dung:")
        state["pending"] = task_key
        await query.edit_message_text(prompt, parse_mode="Markdown")
        return


# ── App setup ─────────────────────────────────────────────────────
def main():
    if not _acquire_lock():
        print("Bot đang chạy rồi (port 47291 đã bị giữ). Thoát.")
        sys.exit(0)

    logging.basicConfig(
        format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
        level=logging.INFO,
    )

    app = ApplicationBuilder().token(BOT_TOKEN).build()
    app.add_handler(CommandHandler("start",  cmd_start))
    app.add_handler(CommandHandler("ceo",    cmd_ceo))
    app.add_handler(CommandHandler("model",  cmd_model))
    app.add_handler(CommandHandler("reload", cmd_reload))
    app.add_handler(CallbackQueryHandler(handle_callback))
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_message))

    print("Bot Nhân Tâm Manager đang chạy...")
    app.run_polling(drop_pending_updates=True)


if __name__ == "__main__":
    main()
