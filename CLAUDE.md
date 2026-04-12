# CLAUDE.md — Cà Phê Nhân Tâm

Hướng dẫn cho Claude Code khi làm việc trong project này.

---

## Tổng quan dự án

**Cà Phê Nhân Tâm (CPNT)** — Thương hiệu chuyên chế biến & phân phối hạt cà phê rang mộc B2B tại TP.HCM.  
Project sử dụng **ClaudeKit Marketing** để tự động hóa toàn bộ hoạt động marketing: content, campaign, SEO, CSKH.

**Đọc ngay trước khi bắt đầu:**
- Tổng quan dự án: `./brands/nhan-tam/docs/project-overview-pdr.md`
- Brand Guidelines: `./brands/nhan-tam/docs/brand-guidelines.md`
- Marketing Strategy: `./brands/nhan-tam/docs/marketing-overview.md`
- Design Guidelines: `./brands/nhan-tam/docs/design-guidelines.md`

---

## Cấu trúc project

```
my-project/
├── .claude/                    ← ClaudeKit Marketing (agents, commands, skills, hooks)
├── brands/                     ← Dữ liệu từng thương hiệu (multi-brand agency)
│   └── nhan-tam/               ← Cà Phê Nhân Tâm
│       ├── docs/               ← Tài liệu thương hiệu & chiến lược CPNT
│       │   ├── project-overview-pdr.md
│       │   ├── brand-guidelines.md  ← Single Source of Truth thương hiệu
│       │   ├── marketing-overview.md
│       │   ├── design-guidelines.md
│       │   ├── pricing-strategy.md
│       │   ├── wholesale-price-list.md
│       │   ├── agent-catalog.md
│       │   ├── codebase-summary.md
│       │   ├── system-architecture.md
│       │   └── project-roadmap.md
│       ├── assets/             ← Audio, images, videos, SEO, writing styles
│       ├── content/            ← Nội dung đã tạo (social, sales, video)
│       └── brand-identity.json ← Metadata thương hiệu cho core-engine
├── core-engine/                ← Scripts & tools dùng chung (video, audio, TVC)
│   ├── scripts/                ← FFmpeg, karaoke, subtitle generation
│   └── tools/                  ← Video generators, TVC director
├── plans/                      ← Kế hoạch chiến dịch & reports
│   ├── reports/
│   └── templates/
├── CLAUDE.md                   ← File này
└── AGENTS.md                   ← Hướng dẫn cho OpenCode
```

---

## Thông tin thương hiệu cốt lõi

| Trường | Giá trị |
|--------|---------|
| **Tên** | Cà Phê Nhân Tâm (CPNT) |
| **Lĩnh vực** | Chế biến & Phân phối hạt rang mộc B2B |
| **Thị trường** | Startup F&B, xe đẩy, kiosk tại TP.HCM |
| **USP** | Giá xưởng + Mix & Match tự do + Giao nội đô 24h |
| **Màu chính** | Nâu Đậm `#2B1408` · Vàng Nhạt `#FDF8ED` |
| **Màu nhấn** | Xanh Lá Mộc `#3E6145` · Cam Cháy `#C65C33` |
| **Tone** | Chân thành, Am hiểu, Đồng hành, Thực dụng |

**Kênh phân phối:** Zalo OA (chốt đơn) · Facebook (lead gen) · TikTok (viral) · Website (SEO)

---

## Role & Responsibilities

Phân tích yêu cầu marketing của CPNT, delegate tasks đến đúng agent, đảm bảo mọi output đều nhất quán với brand guidelines trong `./docs/brand-guidelines.md`.

---

## Workflows

- Primary workflow: `./.claude/workflows/primary-workflow.md`
- Development rules: `./.claude/workflows/development-rules.md`
- Orchestration protocols: `./.claude/workflows/orchestration-protocol.md`
- Documentation management: `./.claude/workflows/documentation-management.md`

**QUAN TRỌNG:** Phân tích skills catalog và kích hoạt skills phù hợp trong quá trình thực thi.  
**QUAN TRỌNG:** Tuân thủ development rules trong `./.claude/workflows/development-rules.md`.  
**QUAN TRỌNG:** Luôn đọc `./brands/nhan-tam/docs/brand-guidelines.md` trước khi tạo bất kỳ nội dung nào.  
**QUAN TRỌNG:** Tóm tắt ngắn gọn, hy sinh ngữ pháp để ưu tiên sự súc tích trong reports.

---

## Documentation Management

Docs tại `./brands/nhan-tam/docs/` — luôn cập nhật sau khi có thay đổi lớn:

```
./brands/nhan-tam/docs/
├── project-overview-pdr.md     ← Entry point cho mọi agent
├── brand-guidelines.md         ← Single Source of Truth thương hiệu
├── marketing-overview.md       ← Chiến lược marketing tổng thể
├── design-guidelines.md        ← Visual identity
├── pricing-strategy.md         ← Chiến lược định giá & tiered pricing
├── wholesale-price-list.md     ← Bảng giá sỉ gửi khách
├── agent-catalog.md            ← Danh sách 31 agents
├── skill-catalog.md            ← Danh sách skills
├── command-catalog.md          ← Danh sách slash commands
├── codebase-summary.md         ← Tóm tắt cấu trúc project
├── system-architecture.md      ← Kiến trúc AI agent system
└── project-roadmap.md          ← Lộ trình & tiến độ
```

**QUAN TRỌNG:** *PHẢI ĐỌC* và *PHẢI TUÂN THỦ* mọi hướng dẫn trong CLAUDE.md này — đặc biệt phần WORKFLOWS là **BẮT BUỘC, KHÔNG THƯƠNG LƯỢNG, KHÔNG NGOẠI LỆ.**
