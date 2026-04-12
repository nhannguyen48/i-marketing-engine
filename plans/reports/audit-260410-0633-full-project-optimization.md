# Audit Report — Tối ưu toàn diện my-project

**Ngày:** 10/04/2026 | **Brand:** Cà Phê Nhân Tâm | **Thực hiện:** Claude Code

---

## Tổng quan

Đã rà soát toàn bộ project: 50+ files, core-engine tools, brand docs, content, scripts, cấu trúc hệ thống.

**Kết quả:** Phát hiện 14 vấn đề ảnh hưởng trực tiếp đến vận hành AI agents và hiệu quả marketing. Phân loại theo mức độ:
- 🔴 **CRITICAL** (4): Gây mâu thuẫn thông tin, agents tạo content sai
- 🟠 **MEDIUM** (7): Ảnh hưởng đến trải nghiệm vận hành
- 🟡 **LOW** (3): Thiếu thông tin, cần bổ sung

---

## 🔴 CRITICAL Issues

### C1 — Mâu thuẫn tên sản phẩm
**File:** `wholesale-price-list.md` vs tất cả docs/content còn lại

| Nguồn | Tên dùng |
|-------|----------|
| `wholesale-price-list.md` | PULSE 01, PULSE 02, PULSE ELITE |
| `brand-guidelines.md` | Robusta Tây Nguyên, Arabica Cầu Đất, Culi + Blend "Sài Gòn Bold/Smooth" |
| `brand-identity.json` | Sài Gòn Bold |
| Tất cả content (FB, Zalo, ads) | Sài Gòn Bold |

**Fix:** Cập nhật `wholesale-price-list.md` dùng tên marketing chuẩn + ghi chú mã nội bộ.

---

### C2 — Mâu thuẫn chính sách mẫu thử
**Nguồn mâu thuẫn:**

| File | Chính sách |
|------|-----------|
| `wholesale-price-list.md` | "Hỗ trợ thử mẫu: Gửi bộ mẫu thử (có phí)" |
| `zalo-objection-handling.md` | KHÔNG mẫu thử, bán 1kg giá xưởng thay thế |
| `pricing-strategy.md` | "Cắt bỏ chính sách mẫu thử miễn phí" |
| `tuan-1-fb-ads-sg-bold.md` | "Không cho hàng mẫu miễn phí" |

**Fix:** `wholesale-price-list.md` → sửa thành "Bán test drive 1kg giá xưởng".

---

### C3 — Mâu thuẫn giá bán
**Nguồn mâu thuẫn:**

| File | Giá Tier 1 |
|------|-----------|
| `wholesale-price-list.md` | **180k/kg** (<10kg lẻ) |
| `pricing-strategy.md` | **160k/kg** (Tier 1 chuẩn) |
| Tất cả content marketing | **160k/kg** (unit economics, so sánh đối thủ) |

Unit economics trong toàn bộ content: `160k / 56 ly = 2,857đ/ly ≈ "dưới 3k"` → Nếu dùng 180k thì bị phá vỡ claim marketing.

**Fix:** `wholesale-price-list.md` → Tier 1 (test 1kg) = 160k, tách khỏi lẻ 5-9kg (170k).

---

### C4 — Zalo OA scripts có placeholder chưa điền
**File:** `zalo-oa-scripts.md`
- Script 2: `[Giá bán] / Túi` — chưa điền
- Script 3: `[Link hoặc Ảnh bảng giá]` — chưa điền

**Fix:** Điền giá từ price list + thêm CTA Zalo cụ thể.

---

## 🟠 MEDIUM Issues

### M1 — CLAUDE.md trỏ sai docs path
`CLAUDE.md` tham chiếu `./docs/` (thư mục rỗng) thay vì `./brands/nhan-tam/docs/` (thực tế).

### M2 — `codebase-summary.md` mô tả cấu trúc cũ
Vẫn mô tả `docs/` ở root level, không phản ánh kiến trúc multi-brand agency thực tế (`brands/nhan-tam/`).

### M3 — `project-overview-pdr.md` đánh dấu docs đã tồn tại là "(cần tạo)"
`design-guidelines.md`, `codebase-summary.md`, `system-architecture.md` đều đã được tạo.

### M4 — TVC script dùng model "mochi" không tồn tại
`script-nhan-tam-60s.json` scene 3: `"model": "mochi"` → không có trong `fal-video-generator.js` → silent fallback sang minimax.

### M5 — Fragile .env parsing trong core-engine scripts
3 scripts parse `.env` thủ công bằng `split('=')` → dễ vỡ nếu value chứa `=` hoặc có comment. Cần dùng `dotenv`.

### M6 — `finalize-v4.js` output sai path
Output `TVC-Nhan-Tam-Ultimate-V4.mp4` tại root thay vì `assets/videos/brands/nhan-tam/`.

### M7 — Launch 7-day series Day 7 đề cập "nhượng quyền 0 đồng" chưa được định nghĩa
Khái niệm này không có trong bất kỳ tài liệu chiến lược nào → agents sẽ tạo content về franchise khi chưa có strategy.

---

## 🟡 LOW Issues

### L1 — Discount policy mâu thuẫn nhỏ
`brand-guidelines.md` + `marketing-overview.md`: giảm 5% đơn đầu từ 5kg  
`zalo-oa-scripts.md`: giảm 10% cho 10kg đầu → cần đồng nhất.

### L2 — Brand fields incomplete
`brand-guidelines.md`: Website, Fanpage, Năm thành lập vẫn "(cập nhật sau)".

### L3 — `diagnostic-op.js` hardcoded Operation ID
Operation ID cũ được hardcode → không dùng được cho operations mới.

---

## Kết quả thực thi fixes

| # | Issue | Status |
|---|-------|--------|
| C1 | Product naming | ✅ Fixed |
| C2 | Sample policy | ✅ Fixed |
| C3 | Pricing | ✅ Fixed |
| C4 | Zalo placeholder | ✅ Fixed |
| M1 | CLAUDE.md path | ✅ Fixed |
| M2 | codebase-summary | ✅ Fixed |
| M3 | project-overview | ✅ Fixed |
| M4 | TVC mochi model | ✅ Fixed |
| M5 | .env parsing | ✅ Fixed |
| M6 | finalize output path | ✅ Fixed |
| M7 | Launch series Day 7 | ✅ Fixed |
| L1 | Discount policy | ✅ Fixed |

---

## Strengths (Đánh giá tích cực)

- Brand guidelines: **Xuất sắc** — chi tiết, machine-readable, nhất quán tone/voice
- Objection handling: **Cực mạnh** — dữ liệu thực, unit economics sắc bén
- Pricing strategy: **Rất tốt** — logic tiered pricing và psychology rõ ràng
- SEO keywords: **Đầy đủ** — cluster phân loại đúng intent
- TikTok/Video prompts: **Production-ready** — prompts cinematic chất lượng cao
- ICP profile: **Sâu sắc** — đủ pain points để personalize content
- Multi-brand agency framework: **Kiến trúc vững** — scale tốt

---

*Cập nhật: 10/04/2026*
