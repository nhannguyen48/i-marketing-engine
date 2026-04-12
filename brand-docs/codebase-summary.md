# Codebase Summary — Cà Phê Nhân Tâm

> Tóm tắt cấu trúc kỹ thuật của project. AI Agents đọc file này để hiểu cách tổ chức codebase trước khi thực thi task.

---

## Cấu trúc thư mục

```
my-project/                         ← AI Marketing Engine (AME) root
├── .claude/                        ← ClaudeKit Marketing Kit
│   ├── agents/                     ← 31 AI Marketing Subagents
│   ├── commands/                   ← 75+ Slash commands (/ckm/...)
│   ├── skills/                     ← 90+ Skills (domain knowledge & scripts)
│   ├── workflows/                  ← Quy trình làm việc
│   └── hooks/                      ← Automation hooks (session, pre-commit...)
├── .opencode/                      ← OpenCode equivalents (mirror of .claude/)
│   ├── agents/
│   └── commands/
├── brands/                         ← Dữ liệu từng thương hiệu (cô lập nhau)
│   └── nhan-tam/                   ← Cà Phê Nhân Tâm
│       ├── brand-identity.json     ← Metadata brand (tên, voice, TVC script)
│       ├── docs/                   ← Tài liệu chiến lược CPNT (file này ở đây)
│       │   ├── project-overview-pdr.md
│       │   ├── brand-guidelines.md ← Single Source of Truth thương hiệu
│       │   ├── marketing-overview.md
│       │   ├── design-guidelines.md
│       │   ├── pricing-strategy.md
│       │   ├── wholesale-price-list.md
│       │   ├── agent-catalog.md
│       │   ├── skill-catalog.md
│       │   ├── command-catalog.md
│       │   ├── codebase-summary.md ← File này
│       │   ├── system-architecture.md
│       │   └── project-roadmap.md
│       ├── assets/
│       │   ├── audio/              ← BGM, voice-over files
│       │   ├── images/             ← Brand photos
│       │   ├── videos/             ← TVC outputs, raw footage
│       │   ├── seo/keywords/       ← Keyword research reports
│       │   ├── leads/icp-profiles/ ← ICP persona docs
│       │   └── writing-styles/     ← Brand voice & writing style guide
│       └── content/
│           ├── social/             ← Facebook, Zalo, TikTok posts
│           │   └── thang-1/        ← Nội dung theo tháng
│           ├── sales/              ← Objection handling, Zalo scripts
│           └── video/              ← TVC scripts (JSON), Runway prompts
├── core-engine/                    ← Scripts & tools dùng chung (không brand-specific)
│   ├── scripts/                    ← FFmpeg finalize, karaoke, subtitle generation
│   └── tools/                      ← fal-video-generator, vertex-video-generator,
│                                     tvc-director, diagnostic tools
├── plans/                          ← Kế hoạch chiến dịch & reports
│   ├── reports/                    ← Báo cáo từ agents
│   └── templates/                  ← Template kế hoạch
├── CLAUDE.md                       ← Hướng dẫn cho Claude Code
├── AGENTS.md                       ← Hướng dẫn cho OpenCode
├── HOW_TO_SCALE.md                 ← Hướng dẫn thêm brand mới
└── release-manifest.json           ← Metadata phiên bản ClaudeKit
```

---

## Thành phần cốt lõi

### .claude/agents/ (31 agents)
Mỗi agent là file `.md` với frontmatter `name`, `description`, `model`. Agents tự động được kích hoạt dựa trên context. Xem `docs/agent-catalog.md` để biết danh sách đầy đủ.

### .claude/commands/ (75+ commands)
Slash commands với prefix `/ckm/`. Tổ chức theo nhóm chức năng:
- `/ckm/campaign/*` — quản lý chiến dịch
- `/ckm/write/*` — tạo nội dung
- `/ckm/seo/*` — SEO
- `/ckm/social/*` — mạng xã hội
- `/ckm/email/*` — email marketing
- `/ckm/plan/*` — lập kế hoạch

### .claude/skills/ (90+ skills)
Skills là domain knowledge được inject vào agent context. Quan trọng nhất:
- `brand/` — đọc brand-guidelines.md và inject brand context
- `content-marketing/` — content strategy
- `social/` — social media tactics
- `seo/` — SEO optimization
- `analytics/` — phân tích dữ liệu
- `copywriting/` — viết copy chuyển đổi cao

### brands/nhan-tam/docs/ (Tài liệu CPNT)
Nguồn sự thật duy nhất cho toàn bộ chiến lược. Agents phải đọc `brand-guidelines.md` trước khi tạo bất kỳ output nào. **Lưu ý:** Docs nằm trong `brands/nhan-tam/docs/`, không phải root `docs/`.

### brands/nhan-tam/content/ (Output)
Nơi lưu nội dung đã tạo:
- `content/social/` — bài đăng MXH (Facebook, Zalo, TikTok)
- `content/social/thang-1/` — nội dung theo tháng
- `content/sales/` — kịch bản bán hàng, objection handling
- `content/video/` — TVC scripts (JSON), Runway/video prompts

### core-engine/ (Shared Tools)
Scripts & tools dùng chung, không phụ thuộc brand cụ thể:
- `core-engine/tools/fal-video-generator.js` — sinh video qua Fal.ai (Kling, MiniMax, Luma...)
- `core-engine/tools/vertex-video-generator.js` — sinh video qua Google Veo 3.1
- `core-engine/tools/tvc-director.js` — orchestrate multi-scene TVC từ JSON script
- `core-engine/scripts/finalize-v*.js` — mix audio/video cuối cùng bằng FFmpeg

### plans/ (Kế hoạch & Reports)
- `plans/` — kế hoạch chiến dịch (naming: `{date}-{issue}-{slug}/`)
- `plans/reports/` — báo cáo từ agents (naming: `{type}-{date}-{slug}.md`)
- `plans/templates/` — template tái sử dụng

---

## Quy ước đặt tên

| Loại | Pattern | Ví dụ |
|------|---------|-------|
| Plan dir | `{date}-{issue}-{slug}/` | `260409-001-chien-dich-ra-mat/` |
| Report | `{type}-{date}-{slug}.md` | `researcher-260409-robusta-market.md` |
| Content | `{type}-{date}-{slug}.md` | `post-1-bat-toan-cafe-15k.md` |

---

## Brand Injection Pattern

Mọi agent tạo content đều đọc brand context từ `brands/nhan-tam/docs/brand-guidelines.md`:

```
Agent nhận task
  → Đọc brands/nhan-tam/docs/brand-guidelines.md (tone, màu, USP, ICP)
  → Đọc brands/nhan-tam/docs/marketing-overview.md (chiến lược, KPI, kênh)
  → Áp dụng context → Output nhất quán thương hiệu
```

## Thêm brand mới

Xem `HOW_TO_SCALE.md` ở root. Tóm tắt:
1. Tạo `brands/brand-moi/` với `brand-identity.json` + `docs/` + `assets/` + `content/`
2. `core-engine/` tự động detect brand qua `brand-identity.json` trong CWD

---

*Cập nhật: 10/04/2026.*
