"""
Inline Keyboard Definitions — Nhân Tâm Manager Bot
====================================================
3 nhóm chính + CEO toggle + Model settings.
Pure functions — không có state dependency.
"""
from telegram import InlineKeyboardButton, InlineKeyboardMarkup


def main_menu_keyboard() -> InlineKeyboardMarkup:
    """Menu chính: 3 nhóm + CEO toggle + Brain2 + Cài đặt."""
    return InlineKeyboardMarkup([
        [
            InlineKeyboardButton("✍️ Nội dung",         callback_data="menu:content"),
            InlineKeyboardButton("🎨 Ảnh & Video",       callback_data="menu:visual"),
        ],
        [
            InlineKeyboardButton("📊 Phân tích & Đăng", callback_data="menu:analyze"),
            InlineKeyboardButton("💼 Cố vấn CEO",        callback_data="menu:ceo"),
        ],
        [
            InlineKeyboardButton("🧠 Brain2 PKM",        callback_data="menu:brain2"),
            InlineKeyboardButton("⚙️ Cài đặt Model",    callback_data="menu:model"),
        ],
    ])


def content_menu_keyboard() -> InlineKeyboardMarkup:
    """Sub-menu: Nội dung."""
    return InlineKeyboardMarkup([
        [
            InlineKeyboardButton("📘 Post Facebook",     callback_data="task:write:facebook_post"),
            InlineKeyboardButton("🏷 Caption & Hashtag", callback_data="task:write:caption"),
        ],
        [
            InlineKeyboardButton("📧 Email Marketing",   callback_data="task:write:email"),
            InlineKeyboardButton("💬 Sales Script",      callback_data="task:write:sales_script"),
        ],
        [
            InlineKeyboardButton("🎬 Kịch bản TVC",     callback_data="task:write:tvc_script"),
            InlineKeyboardButton("📣 Quảng cáo",         callback_data="task:write:ad_copy"),
        ],
        [InlineKeyboardButton("← Quay lại",              callback_data="menu:main")],
    ])


def visual_menu_keyboard() -> InlineKeyboardMarkup:
    """Sub-menu: Ảnh & Video (gộp hình ảnh + video)."""
    return InlineKeyboardMarkup([
        [
            InlineKeyboardButton("🧑 Ảnh Sếp Nhân",     callback_data="task:portrait"),
            InlineKeyboardButton("☕ Ảnh Brand/SP",       callback_data="task:brand_image"),
        ],
        [
            InlineKeyboardButton("🎥 Video Sếp Nhân",   callback_data="task:video_portrait"),
            InlineKeyboardButton("🎬 Video Brand/SP",    callback_data="task:brand_video"),
        ],
        [
            InlineKeyboardButton("🎙 Voiceover",          callback_data="task:voiceover"),
        ],
        [
            InlineKeyboardButton("🖼 Cover Facebook",    callback_data="task:fb_cover"),
            InlineKeyboardButton("👤 Ảnh Profile",        callback_data="task:fb_profile"),
        ],
        [InlineKeyboardButton("← Quay lại",              callback_data="menu:main")],
    ])


def analyze_menu_keyboard() -> InlineKeyboardMarkup:
    """Sub-menu: Phân tích & Đăng."""
    return InlineKeyboardMarkup([
        [
            InlineKeyboardButton("🚀 Đăng Facebook ngay", callback_data="task:post_now"),
            InlineKeyboardButton("🗓 Lên lịch đăng",      callback_data="task:post_schedule"),
        ],
        [
            InlineKeyboardButton("📋 Tra cứu Brand/Giá",  callback_data="task:query_info"),
            InlineKeyboardButton("📈 Insight thị trường", callback_data="task:market_insight"),
        ],
        [
            InlineKeyboardButton("🔍 Phân tích đối thủ",  callback_data="task:competitor"),
        ],
        [InlineKeyboardButton("← Quay lại",               callback_data="menu:main")],
    ])


def fb_post_options_keyboard() -> InlineKeyboardMarkup:
    """Tuỳ chọn sau khi có caption: đăng ngay / lên lịch / chỉnh / huỷ."""
    return InlineKeyboardMarkup([
        [
            InlineKeyboardButton("🚀 Đăng ngay",      callback_data="fb:post_now"),
            InlineKeyboardButton("🗓 Lên lịch",        callback_data="fb:schedule"),
        ],
        [
            InlineKeyboardButton("✏️ Chỉnh caption",  callback_data="fb:edit_caption"),
            InlineKeyboardButton("❌ Huỷ",             callback_data="fb:cancel"),
        ],
    ])


def brain2_menu_keyboard() -> InlineKeyboardMarkup:
    """Sub-menu: Brain2 PKM."""
    return InlineKeyboardMarkup([
        [
            InlineKeyboardButton("📖 Capture Story",  callback_data="task:brain2_story"),
            InlineKeyboardButton("💡 Thêm Atomic Note", callback_data="task:brain2_note"),
        ],
        [
            InlineKeyboardButton("📅 Weekly Review",  callback_data="task:brain2_review"),
            InlineKeyboardButton("🗺 Xem MOC",         callback_data="task:brain2_moc"),
        ],
        [InlineKeyboardButton("← Quay lại",           callback_data="menu:main")],
    ])


def model_menu_keyboard(active_text: str, active_image: str) -> InlineKeyboardMarkup:
    """Model selector với trạng thái active hiện tại."""
    def lbl(name: str, active: bool) -> str:
        return f"✅ {name}" if active else name

    return InlineKeyboardMarkup([
        [InlineKeyboardButton("── AI Text ──",  callback_data="noop")],
        [
            InlineKeyboardButton(lbl("Gemini Flash",       active_text == "gemini"), callback_data="model:gemini"),
            InlineKeyboardButton(lbl("Claude Sonnet",      active_text == "claude"), callback_data="model:claude"),
        ],
        [InlineKeyboardButton("── AI Image ──", callback_data="noop")],
        [
            InlineKeyboardButton(lbl("Gemini Flash",       active_image == "flash"), callback_data="model:flash"),
            InlineKeyboardButton(lbl("nano-banana-pro 2K", active_image == "pro"),   callback_data="model:pro"),
        ],
        [InlineKeyboardButton("← Quay lại",    callback_data="menu:main")],
    ])
