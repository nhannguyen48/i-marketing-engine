#!/usr/bin/env python3
# NTCK — Zalo OA Bot
# Auto-reply FAQ + Broadcast scheduler cho NTCK Content Kit
# VPS: 192.3.98.169:8080

import os, json, hmac, hashlib, logging, threading, time
from datetime import datetime
from flask import Flask, request, jsonify
import requests
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

logging.basicConfig(level=logging.INFO, format='%(asctime)s %(levelname)s %(message)s')
log = logging.getLogger(__name__)

app = Flask(__name__)

# ── Config ────────────────────────────────────────────────────────────
APP_ID          = os.environ.get('ZALO_APP_ID',     '3873581841986891920')
APP_SECRET      = os.environ.get('ZALO_APP_SECRET', '')
OA_SECRET       = os.environ.get('ZALO_OA_SECRET', '')    # for webhook signature verify
OA_ACCESS_TOKEN = os.environ.get('ZALO_OA_TOKEN',  '')
GEMINI_API_KEY  = os.environ.get('GEMINI_API_KEY', '')
PORT            = int(os.environ.get('PORT', 8080))

ZALO_SEND_URL   = 'https://openapi.zalo.me/v3.0/oa/message/cs'
ZALO_BROADCAST  = 'https://openapi.zalo.me/v3.0/oa/broadcast/followers'
ZALO_TOKEN_URL  = 'https://oauth.zaloapp.com/v4/oa/access_token'

# ── FAQ knowledge base ────────────────────────────────────────────────
FAQ = {
    'giá': """Mình chia sẻ thật để bạn dễ chọn nhé:

🟢 Starter — 149,000đ
Phù hợp nếu bạn mới muốn thử, hoặc chỉ cần viết bài cho 1–2 site nhỏ. Viết tự động, chấm điểm SEO, tạo ảnh AI, đăng thẳng lên website — đủ dùng cho cá nhân.

⭐ Pro — 890,000đ (hầu hết mọi người chọn cái này)
Không giới hạn bài, không giới hạn từ. Thêm: nghiên cứu từ khóa, phân tích đối thủ SERP, audit bài cũ, tối ưu CTR, Schema tự động... Nếu bạn làm SEO nghiêm túc hoặc quản lý nhiều site — đây là lựa chọn hợp lý nhất.

💎 Ultimate — 2,696,000đ
Giống Pro, nhưng thêm 6 buổi 1:1 với mình qua Zoom, hỗ trợ ưu tiên, cập nhật tính năng mới vĩnh viễn. Phù hợp nếu bạn muốn có người đồng hành sát từ đầu.

Tất cả đều trả 1 lần, không phí tháng, không gia hạn.
👉 https://contentseo.nhantamdigital.com""",

    'mua': """Đơn giản lắm bạn ơi:

1. Vào https://contentseo.nhantamdigital.com
2. Chọn gói, nhập email, thanh toán qua chuyển khoản/ví
3. Nhận Google Sheet + hướng dẫn kích hoạt về email trong vài phút

Nếu bạn chưa chắc chọn gói nào, cứ nhắn mình — nói rõ bạn đang làm gì, mình gợi ý thẳng cho.""",

    'dùng': """Thật ra đơn giản hơn bạn nghĩ nhiều.

Toàn bộ tool chạy trong Google Sheets — cái mà bạn dùng hàng ngày rồi. Không cài thêm gì hết.

Làm một bài thì như này:
1. Mở Sheet lên, gõ từ khóa vào ô
2. Click "Viết bài" trong menu
3. Chờ 2–3 phút ☕
4. Bài viết xong, chuẩn SEO → click "Đăng Website" là lên ngay

Setup lần đầu khoảng 20–30 phút theo video hướng dẫn. Sau đó bật lên dùng thôi.""",

    'cài': """Không cần cài gì cả — đó là điểm mình thích nhất của tool này.

Chỉ cần 3 thứ, đều miễn phí hoặc bạn có rồi:
• Google account
• Gemini API key (lấy tại aistudio.google.com, free)
• WordPress / website của bạn

Sau khi mua, mình gửi Sheet mẫu đã setup sẵn về email. Làm theo video là chạy được.""",

    'hỗ trợ': """Mình không bỏ bạn sau khi mua đâu nhé 😄

• Có group Zalo riêng cho user — hỏi là có người trả lời, toàn dân SEO thật
• Nhắn OA này bất cứ lúc nào — mình đọc và reply trong ngày
• Video hướng dẫn đầy đủ từng bước

Gói Ultimate thì còn có 6 buổi ngồi cùng nhau qua Zoom, mình setup và chạy thử cùng bạn luôn.""",

    'so sánh': """ChatGPT cũng viết được bài, nhưng bạn vẫn phải:
tự format → tự thêm meta → tự check SEO → tự copy lên website... mỗi bài mất thêm 30–45 phút.

NTCK thì khác: nhập keyword xong là tool lo hết — viết, format, tối ưu SEO, đăng bài — bạn không cần đụng tay gì thêm.

Với dân SEO thì còn có: nghiên cứu từ khóa, phân tích đối thủ SERP, audit bài cũ, Schema JSON-LD, submit Google Index tự động...

Và cái này quan trọng: ChatGPT Plus tốn ~600k/tháng, Claude Pro ~700k/tháng — tháng nào cũng trả.
NTCK Pro: 890k. Một lần. Dùng mãi.""",

    'subscription': """Không có phí tháng nào hết bạn ơi — trả 1 lần là dùng mãi.

Starter 149k · Pro 890k · Ultimate 2.696k

Nếu bạn đang dùng ChatGPT Plus (600k/tháng) để viết content SEO — thì chỉ sau 2 tháng là NTCK Pro đã rẻ hơn rồi, mà làm được nhiều hơn nhiều.""",

    'wordpress': """Có, và đây là phần bạn sẽ thích nhất.

Bài viết xong → click "Đăng Website" → nó lên WordPress ngay, có đủ: ảnh, category, tag, meta title, meta description — không cần copy paste gì hết.

Setup 1 lần thôi: nhập URL website + Application Password (tạo trong WordPress → Users → Application Passwords). Xong rồi lần sau chỉ click đăng là xong.""",

    'keyword': """Gói Pro và Ultimate có module nghiên cứu từ khóa tích hợp luôn.

Bạn gõ chủ đề → tool ra ngay: search volume, độ khó, related keywords, LSI, search intent.

Hoặc nếu bạn đang dùng Ahrefs / Semrush rồi — export CSV ra, import thẳng vào Sheet, chạy hàng loạt một phát.""",

    'demo': """Mình gửi video demo thực tế để bạn xem trước nhé.

Bạn để lại email hoặc nhắn mình — gửi ngay.

Hoặc bắt đầu với Starter 149k để tự trải nghiệm — user mới thường chạy được bài đầu tiên trong 20–30 phút là thấy ngay kết quả.""",

    'nhân tâm': """Nhân Tâm Digital là bên mình — công ty công nghệ chuyên làm tool hỗ trợ SEO & content cho người Việt.

NTCK Content Kit là sản phẩm mình tự dùng rồi mới bán ra — viết bài SEO tự động trên Google Sheets, không cần cài gì, không phí tháng.

Website: nhantamdigital.com
Hỏi gì cứ nhắn thẳng đây nhé, mình reply trong ngày.""",
}

WELCOME_MSG = """Ủa, bạn quan tâm NTCK rồi hả? 😄

Mình là trợ lý của Nhân Tâm Digital — bên phát triển NTCK Content Kit.

Nói nhanh để bạn hình dung: NTCK là tool viết bài SEO tự động chạy ngay trong Google Sheets. Bạn chỉ cần gõ từ khóa, nhấn một nút — 2–3 phút sau có bài viết chuẩn SEO, tự đăng lên website luôn. Không cài gì, không cần biết code, trả 1 lần dùng mãi.

Bạn đang gặp vấn đề gì? Nhắn một trong các từ sau mình trả lời ngay:

• "giá" — xem 3 gói, mình giải thích luôn nên chọn cái nào
• "dùng" — tool hoạt động thế nào
• "so sánh" — khác ChatGPT chỗ nào
• "mua" — link mua + hướng dẫn
• "demo" — xem video thực tế trước

Hoặc cứ hỏi thẳng đi — mình đọc và trả lời trong ngày! 👋"""

PRODUCT_CONTEXT = """Bạn là nhân viên chăm sóc khách hàng của Nhân Tâm Digital — thân thiện, am hiểu SEO, luôn đặt lợi ích khách hàng lên đầu.

## Về Nhân Tâm Digital & sản phẩm
- Nhân Tâm Digital: công ty công nghệ (nhantamdigital.com)
- NTCK Content Kit: tool viết bài SEO tự động chạy trên Google Sheets (contentseo.nhantamdigital.com)
- Giá: Starter 149k | Pro 890k | Ultimate 2,696k — lifetime, không subscription, không gia hạn
- Tính năng: viết bài SEO tự động, không giới hạn bài/từ (Pro+), keyword research, phân tích SERP đối thủ, Schema JSON-LD, CTR optimizer, audit & viết lại bài cũ, đăng WordPress/website tự động, submit Google Index
- Chạy trong Google Sheets — không cài phần mềm, không cần biết code
- Thanh toán PayOS (chuyển khoản/ví điện tử), nhận license qua email trong vài phút

## Vai trò của bạn
Hỗ trợ khách hàng toàn diện — không chỉ tư vấn sản phẩm mà còn:
- Giải đáp thắc mắc sau mua (kích hoạt, setup, lỗi khi dùng)
- Hỏi thêm để hiểu khách đang gặp vấn đề gì, rồi gợi ý giải pháp phù hợp
- Chia sẻ mẹo SEO, kinh nghiệm thực tế liên quan đến nội dung & content marketing
- Động viên, đồng hành khi khách gặp khó khăn trong công việc SEO

## Quy tắc bắt buộc — KHÔNG được vi phạm
1. KHÔNG nói xấu, so sánh tiêu cực bất kỳ cá nhân, công ty, sản phẩm nào khác (kể cả đối thủ cạnh tranh)
2. KHÔNG tư vấn hoặc hỗ trợ nội dung vi phạm pháp luật Việt Nam, nội dung có hại, spam, black-hat SEO
3. KHÔNG bịa đặt thông tin về sản phẩm — nếu không chắc thì nói "Cái này mình cần hỏi lại team rồi báo bạn nhé!"
4. KHÔNG thảo luận chủ đề chính trị, tôn giáo, tranh cãi xã hội nhạy cảm
5. KHÔNG đưa ra cam kết về doanh thu, thứ hạng Google cụ thể — SEO có nhiều yếu tố, không ai đảm bảo được
6. Nếu khách hỏi hoàn toàn ngoài phạm vi (ví dụ: nấu ăn, y tế, pháp lý...) — nhẹ nhàng từ chối và hướng về chủ đề mình có thể giúp

## Tone & cách trả lời
- Như người bạn thân đang ngồi tư vấn, không phải chatbot đọc kịch bản
- Ngắn gọn, súc tích — không viết quá 4–5 dòng mỗi lần trừ khi cần giải thích kỹ
- Dùng ngôn ngữ tự nhiên của dân SEO Việt Nam
- Nếu chưa hiểu rõ câu hỏi → hỏi lại để hiểu đúng hơn, đừng đoán mò
- Kết thúc bằng câu hỏi ngược lại khi phù hợp để giữ cuộc trò chuyện
"""

# ── Zalo webhook verification ─────────────────────────────────────────
def _verify_zalo_signature(data: bytes, signature: str) -> bool:
    secret = OA_SECRET or APP_SECRET
    if not secret:
        return True
    mac = hmac.new(secret.encode(), data, hashlib.sha256).hexdigest()
    return hmac.compare_digest(mac, signature or '')

# ── FAQ matcher — alias map cho các từ khóa thường gặp ───────────────
_FAQ_ALIASES = {
    'bao nhiêu': 'giá', 'bảng giá': 'giá', 'pricing': 'giá', 'cost': 'giá',
    'mấy tiền': 'giá', 'tốn': 'giá',
    'mua ở đâu': 'mua', 'đặt mua': 'mua', 'thanh toán': 'mua', 'order': 'mua',
    'sử dụng': 'dùng', 'cách dùng': 'dùng', 'dùng như': 'dùng', 'hoạt động': 'dùng',
    'cài đặt': 'cài', 'setup': 'cài', 'yêu cầu': 'cài',
    'support': 'hỗ trợ', 'liên hệ': 'hỗ trợ', 'tư vấn': 'hỗ trợ',
    'khác gì': 'so sánh', 'so với': 'so sánh', 'chatgpt': 'so sánh', 'khác chatgpt': 'so sánh',
    'phí tháng': 'subscription', 'hàng tháng': 'subscription', 'gia hạn': 'subscription',
    'wp': 'wordpress', 'đăng bài': 'wordpress', 'website': 'wordpress',
    'từ khóa': 'keyword', 'research': 'keyword', 'ahrefs': 'keyword', 'semrush': 'keyword',
    'video': 'demo', 'thử': 'demo', 'xem thử': 'demo',
    'ntck là': 'nhân tâm', 'công ty': 'nhân tâm', 'nhantam': 'nhân tâm',
}

def _match_faq(text: str) -> str | None:
    t = text.lower()
    # Direct key match
    for key, answer in FAQ.items():
        if key in t:
            return answer
    # Alias match
    for alias, key in _FAQ_ALIASES.items():
        if alias in t and key in FAQ:
            return FAQ[key]
    return None

# ── AI reply via Gemini (retry on 429) ───────────────────────────────
def _ai_reply(user_msg: str) -> str:
    if not GEMINI_API_KEY:
        return "Mình nhận được tin của bạn rồi! Team sẽ phản hồi sớm trong ngày nhé. Hoặc xem thêm tại 👉 https://contentseo.nhantamdigital.com"
    url = f'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={GEMINI_API_KEY}'
    payload = {
        'contents': [{'parts': [{'text': f'{PRODUCT_CONTEXT}\n\nKhách hỏi: {user_msg}'}]}],
        'generationConfig': {'maxOutputTokens': 400, 'temperature': 0.4}
    }
    for attempt in range(3):
        try:
            r = requests.post(url, json=payload, timeout=15)
            if r.status_code == 429:
                wait = 5 * (attempt + 1)   # 5s, 10s, 15s
                log.warning(f'Gemini 429 — retry sau {wait}s (attempt {attempt+1})')
                time.sleep(wait)
                continue
            r.raise_for_status()
            return r.json()['candidates'][0]['content']['parts'][0]['text'].strip()
        except Exception as e:
            log.error(f'Gemini error attempt {attempt+1}: {e}')
            if attempt < 2:
                time.sleep(3)
    return "Mình nhận được câu hỏi của bạn rồi! Hệ thống đang bận tí, team sẽ trả lời bạn sớm nhé 😊"

# ── Send message to user ──────────────────────────────────────────────
def send_message(user_id: str, text: str) -> bool:
    if not OA_ACCESS_TOKEN:
        log.warning('OA_ACCESS_TOKEN not set — cannot send message')
        return False
    payload = {
        'recipient': {'user_id': user_id},
        'message': {'text': text}
    }
    r = requests.post(ZALO_SEND_URL,
                      json=payload,
                      headers={'access_token': OA_ACCESS_TOKEN},
                      timeout=10)
    ok = r.status_code == 200 and r.json().get('error') == 0
    if not ok:
        log.error(f'send_message failed: {r.text}')
    return ok

# ── Broadcast to all followers ────────────────────────────────────────
def broadcast(text: str) -> dict:
    """Send text broadcast to all OA followers."""
    if not OA_ACCESS_TOKEN:
        return {'error': 'OA_ACCESS_TOKEN not set'}
    payload = {'message': {'text': text}}
    r = requests.post(ZALO_BROADCAST,
                      json=payload,
                      headers={'access_token': OA_ACCESS_TOKEN},
                      timeout=15)
    result = r.json()
    log.info(f'broadcast result: {result}')
    return result

# ── Scheduled broadcast runner ────────────────────────────────────────
# Đọc từ broadcast-schedule.json — list of {datetime: "YYYY-MM-DD HH:MM", text: "..."}
SCHEDULE_FILE = os.path.join(os.path.dirname(__file__), 'zalo-oa-pending-broadcast-schedule.json')

def _load_schedule() -> list:
    if not os.path.exists(SCHEDULE_FILE):
        return []
    try:
        with open(SCHEDULE_FILE) as f:
            return json.load(f)
    except Exception:
        return []

def _save_schedule(items: list):
    with open(SCHEDULE_FILE, 'w', encoding='utf-8') as f:
        json.dump(items, f, ensure_ascii=False, indent=2)

def _schedule_worker():
    """Background thread: check every minute, fire due broadcasts."""
    while True:
        try:
            items = _load_schedule()
            now   = datetime.now().strftime('%Y-%m-%d %H:%M')
            remaining = []
            for item in items:
                if item.get('datetime') <= now and not item.get('sent'):
                    log.info(f'Broadcasting scheduled message: {item["datetime"]}')
                    result = broadcast(item['text'])
                    item['sent'] = True
                    item['sent_at'] = now
                    item['result'] = result
                remaining.append(item)
            _save_schedule(remaining)
        except Exception as e:
            log.error(f'schedule_worker error: {e}')
        time.sleep(60)

# ── Flask routes ──────────────────────────────────────────────────────

@app.route('/zalo/callback')
def oauth_callback():
    """OAuth callback — exchange code for OA access token."""
    code = request.args.get('code')
    if not code:
        return 'Missing code', 400
    # Zalo OA: secret_key = raw App Secret sent as HTTP header (not HMAC)
    r = requests.post(ZALO_TOKEN_URL,
        headers={'secret_key': APP_SECRET},
        data={
            'app_id':     APP_ID,
            'code':       code,
            'grant_type': 'authorization_code',
        }, timeout=10)
    data = r.json()
    token = data.get('access_token')
    if token:
        log.info(f'✅ OA Access Token obtained: {token[:20]}...')
        # In production: save to env/file; here just return for copy-paste
        return f'<h2>✅ Access Token:</h2><pre>{token}</pre><p>Copy token này, set vào biến môi trường ZALO_OA_TOKEN trên VPS.</p>'
    return f'<h2>❌ Lỗi:</h2><pre>{data}</pre>', 400


@app.route('/zalo/webhook', methods=['GET', 'POST'])
def webhook():
    """Receive Zalo OA events."""
    if request.method == 'GET':
        # Zalo webhook verification
        return request.args.get('challenge', 'ok')

    sig  = request.headers.get('X-ZEvent-Signature', '')
    data = request.get_data()
    # Signature verification disabled — re-enable after confirming correct secret
    # if sig and not _verify_zalo_signature(data, sig):
    #     return 'Invalid signature', 403

    event = request.get_json(silent=True) or {}
    log.info(f'Webhook event: {event.get("event_name")} from {event.get("sender", {}).get("id")}')

    event_name = event.get('event_name', '')

    if event_name == 'user_send_text':
        user_id  = event.get('sender', {}).get('id')
        msg_text = event.get('message', {}).get('text', '').strip()
        if user_id and msg_text:
            _handle_message(user_id, msg_text)

    elif event_name == 'follow':
        user_id = event.get('follower', {}).get('id')
        if user_id:
            threading.Thread(target=lambda: send_message(user_id, WELCOME_MSG), daemon=True).start()

    return jsonify({'error': 0})


def _handle_message(user_id: str, text: str):
    """Route message to FAQ or AI."""
    # Try FAQ first (fast, no API cost)
    faq_answer = _match_faq(text)
    if faq_answer:
        send_message(user_id, faq_answer)
        return
    # Fallback to Gemini AI
    threading.Thread(target=lambda: send_message(user_id, _ai_reply(text)), daemon=True).start()


@app.route('/zalo/broadcast', methods=['POST'])
def api_broadcast():
    """Manual broadcast trigger — POST {"text": "...", "secret": "..."} """
    body   = request.get_json(silent=True) or {}
    secret = body.get('secret', '')
    # Simple shared secret to prevent unauthorized use
    if secret != os.environ.get('BROADCAST_SECRET', 'ntck2026'):
        return jsonify({'error': 'unauthorized'}), 403
    text = body.get('text', '').strip()
    if not text:
        return jsonify({'error': 'text required'}), 400
    result = broadcast(text)
    return jsonify(result)


@app.route('/zalo/schedule', methods=['POST'])
def api_schedule():
    """Add a scheduled broadcast — POST {"datetime": "2026-05-13 08:00", "text": "...", "secret": "..."} """
    body   = request.get_json(silent=True) or {}
    if body.get('secret') != os.environ.get('BROADCAST_SECRET', 'ntck2026'):
        return jsonify({'error': 'unauthorized'}), 403
    dt   = body.get('datetime', '').strip()
    text = body.get('text', '').strip()
    if not dt or not text:
        return jsonify({'error': 'datetime and text required'}), 400
    items = _load_schedule()
    items.append({'datetime': dt, 'text': text, 'sent': False})
    _save_schedule(items)
    return jsonify({'ok': True, 'scheduled': dt})


@app.route('/zalo/schedule', methods=['GET'])
def api_schedule_list():
    """List all scheduled broadcasts."""
    secret = request.args.get('secret', '')
    if secret != os.environ.get('BROADCAST_SECRET', 'ntck2026'):
        return jsonify({'error': 'unauthorized'}), 403
    return jsonify(_load_schedule())


@app.route('/health')
def health():
    return jsonify({'ok': True, 'token_set': bool(OA_ACCESS_TOKEN)})


# ── Main ──────────────────────────────────────────────────────────────
if __name__ == '__main__':
    # Start schedule worker
    threading.Thread(target=_schedule_worker, daemon=True).start()
    log.info(f'Zalo OA Bot starting on port {PORT}')
    log.info(f'Callback URL: http://192.3.98.169:{PORT}/zalo/callback')
    log.info(f'Webhook URL:  http://192.3.98.169:{PORT}/zalo/webhook')
    app.run(host='0.0.0.0', port=PORT)
