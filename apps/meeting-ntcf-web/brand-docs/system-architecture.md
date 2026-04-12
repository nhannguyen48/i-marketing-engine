# System Architecture — Cà Phê Nhân Tâm

> Kiến trúc hệ thống AI Agent marketing cho CPNT. Đọc file này để hiểu cách agents phối hợp trong các workflow.

---

## Tổng quan kiến trúc

```
User Request
     │
     ▼
┌─────────────────────────────────────┐
│         Claude Code (Orchestrator)   │
│   Đọc CLAUDE.md + brand-guidelines  │
└──────────────┬──────────────────────┘
               │ Delegate
       ┌───────┼───────────┐
       ▼       ▼           ▼
  [Planner] [Agent]  [Agent]  ...
       │
       └─ Spawn subagents theo task
```

---

## Lớp hệ thống (System Layers)

### Layer 1 — Orchestration
**Thành phần:** Claude Code main session + CLAUDE.md  
**Nhiệm vụ:** Phân tích yêu cầu → chọn agent phù hợp → delegate → tổng hợp kết quả

### Layer 2 — Agents (31 agents)
Mỗi agent chuyên biệt cho một domain. Giao tiếp qua file hệ thống và tool calls.

**Nhóm Content & Creative:**
- `content-creator` — tạo blog, post, script, ad copy
- `copywriter` — copy chuyển đổi cao (viral hooks, CTAs)
- `social-media-manager` — lịch đăng, multi-platform strategy
- `ui-ux-designer` — thiết kế visual, banner, layout

**Nhóm Campaign & Growth:**
- `campaign-manager` — điều phối chiến dịch đa kênh
- `attraction-specialist` — lead gen, TOFU content, SEO gap
- `funnel-architect` — thiết kế phễu chuyển đổi
- `email-wizard` — email sequences & automation
- `upsell-maximizer` — cross-sell, upsell, revenue expansion

**Nhóm Analytics & Intelligence:**
- `analytics-analyst` — báo cáo hiệu suất, traffic analysis
- `seo-specialist` — SEO audit, keyword research, JSON-LD
- `lead-qualifier` — lead scoring, behavioral analysis
- `campaign-debugger` — chẩn đoán chiến dịch kém hiệu quả

**Nhóm Retention & Community:**
- `continuity-specialist` — churn prevention, re-engagement
- `community-manager` — Discord/Zalo/Facebook Group moderation
- `sale-enabler` — sales collateral, pitch, objection handling

**Nhóm Infrastructure:**
- `planner` — tạo plan chi tiết trước khi implement
- `researcher` — nghiên cứu chuyên sâu
- `scout` / `scout-external` — tìm file & context trong codebase
- `docs-manager` — cập nhật tài liệu sau thay đổi
- `project-manager` — theo dõi tiến độ tổng thể

### Layer 3 — Skills (90+ skills)
Domain knowledge được inject vào agent context khi cần.

**Marketing skills:** `brand`, `content-marketing`, `social`, `seo`, `analytics`, `copywriting`, `email`, `funnel`, `paid-ads`, `competitor`, `marketing-research`

**Creative skills:** `ai-artist`, `creativity`, `design`, `banner-design`, `video`, `slides`

**Technical skills:** `docs-seeker`, `sequential-thinking`, `brainstorm`, `debugging`

### Layer 4 — Commands (75+ slash commands)
Interface nhanh để kích hoạt workflow. Prefix `/ckm/`.

---

## Luồng tạo Content (Content Creation Flow)

```
/ckm/write/blog "chủ đề"
        │
        ▼
  [planner] tạo outline
        │
        ▼
  [researcher] nghiên cứu keyword + competitor
        │
        ▼
  [content-creator] viết draft + brand voice
        │
        ▼
  [copywriter] tối ưu CTA, hooks
        │
        ▼
  [content-reviewer] review chất lượng + brand fit
        │
        ▼
  Output → content/blog/{date}-{slug}.md
```

---

## Luồng Campaign (Campaign Flow)

```
/ckm/campaign/create "mục tiêu"
        │
        ▼
  [campaign-manager] lập kế hoạch đa kênh
        │
        ├─→ [copywriter] viết ad copy (Facebook/TikTok)
        ├─→ [social-media-manager] lịch đăng bài
        ├─→ [email-wizard] chuỗi email nuture
        └─→ [funnel-architect] thiết kế phễu
                │
                ▼
  [analytics-analyst] theo dõi KPI
        │
        ▼
  [campaign-debugger] chẩn đoán nếu performance kém
```

---

## Brand Context Injection

Mọi agent tạo content đều phải đọc brand context:

```
Agent nhận task
     │
     ▼
Đọc docs/brand-guidelines.md
     │
     ├─ Tone: Chân thành · Am hiểu · Đồng hành · Thực dụng
     ├─ Màu: #2B1408 · #FDF8ED · #3E6145 · #C65C33
     ├─ USP: Giá xưởng · Mix & Match · Giao 24h
     └─ ICP: Startup F&B, xe đẩy, kiosk tại TP.HCM
     │
     ▼
Tạo output nhất quán với thương hiệu
```

---

## File I/O Convention

| Input | Output |
|-------|--------|
| `docs/brand-guidelines.md` | `content/{type}/{date}-{slug}.md` |
| `docs/marketing-overview.md` | `plans/{date}-{slug}/` |
| User request | `plans/reports/{type}-{date}-{slug}.md` |

---

*Cập nhật: 09/04/2026.*
