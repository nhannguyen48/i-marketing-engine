# Agent Catalog — Cà Phê Nhân Tâm

> Danh sách 31 AI subagents trong hệ thống ClaudeKit Marketing. Agents tự động kích hoạt dựa trên context, hoặc được orchestrator delegate task.

---

## Nhóm Content & Creative

| Agent | Mục đích | Khi nào dùng |
|-------|---------|-------------|
| `content-creator` | Tạo blog, social post, video script, ad copy, newsletter | Cần sản xuất nội dung dạng dài hoặc đa định dạng |
| `copywriter` | Viết copy chuyển đổi cao: headline, CTA, hook viral | Cần copy ngắn, punch, tập trung chuyển đổi |
| `social-media-manager` | Lịch đăng bài, content calendar, phân tích engagement | Quản lý MXH Facebook/TikTok/Zalo/Instagram |
| `ui-ux-designer` | Thiết kế visual, banner, wireframe, layout | Cần hướng dẫn thiết kế hoặc review visual |
| `ai-video-creator` | Kỹ sư Prompt đạo diễn Video (Runway Gen-3/Luma), Storyboarding | Cần xuất các video chân thực, cận cảnh (ASMR, Xưởng) |

---

## Nhóm Campaign & Growth

| Agent | Mục đích | Khi nào dùng |
|-------|---------|-------------|
| `campaign-manager` | Điều phối chiến dịch đa kênh, timeline, budget | Lên kế hoạch và chạy chiến dịch tổng thể |
| `attraction-specialist` | Lead gen, TOFU content, keyword gap, landing page | Kéo traffic & leads mới cho CPNT |
| `funnel-architect` | Thiết kế phễu chuyển đổi, phân tích bottleneck | Tối ưu hành trình từ awareness → purchase |
| `email-wizard` | Email sequence, drip campaign, subject line, A/B test | Xây chuỗi email nuture hoặc broadcast Zalo |
| `upsell-maximizer` | Cross-sell, upsell, product recommendation, pricing tier | Tăng AOV và revenue từ khách hiện có |
| `sale-enabler` | Sales pitch, objection handling, proposal, case study | Hỗ trợ đội sales chốt đơn B2B |

---

## Nhóm Analytics & Intelligence

| Agent | Mục đích | Khi nào dùng |
|-------|---------|-------------|
| `analytics-analyst` | Báo cáo hiệu suất campaign, traffic, conversion | Cần báo cáo định kỳ hoặc phân tích số liệu |
| `seo-specialist` | SEO audit, keyword research, on-page, JSON-LD | Tối ưu website/blog cho từ khóa mục tiêu |
| `lead-qualifier` | Lead scoring, intent detection, behavioral analysis | Ưu tiên lead nóng để follow-up |
| `campaign-debugger` | Chẩn đoán chiến dịch kém hiệu quả, bottleneck | Conversion giảm đột ngột, CPL tăng cao |

---

## Nhóm Retention & Community

| Agent | Mục đích | Khi nào dùng |
|-------|---------|-------------|
| `continuity-specialist` | Churn prevention, re-engagement, NPS, loyalty | Khách dừng đặt hàng hoặc churn rate tăng |
| `community-manager` | Moderation Zalo/Facebook Group, sentiment analysis | Quản lý cộng đồng "Startup Cà Phê Sài Gòn" |

---

## Nhóm Infrastructure & Process

| Agent | Mục đích | Khi nào dùng |
|-------|---------|-------------|
| `planner` | Tạo plan chi tiết theo phases trước khi implement | Trước mọi task lớn hoặc feature mới |
| `researcher` | Nghiên cứu chuyên sâu market, competitor, kỹ thuật | Cần data hoặc insight cho quyết định |
| `scout` | Tìm files & context trong codebase | Tìm file cụ thể hoặc khám phá codebase |
| `scout-external` | Tìm files dùng external tools (Gemini, OpenCode) | Codebase lớn, cần tìm nhanh |
| `docs-manager` | Cập nhật docs trong `./docs/` sau thay đổi | Sau khi implement feature hoặc thay đổi chiến lược |
| `project-manager` | Theo dõi tiến độ tổng thể, consolidate reports | Review tiến độ, cập nhật roadmap |
| `content-reviewer` | Review chất lượng nội dung, brand alignment, SEO | Trước khi publish bất kỳ content nào |
| `code-reviewer` | Review code quality, security, performance | Sau khi viết script hoặc automation |
| `debugger` | Debug lỗi, phân tích logs, chẩn đoán vấn đề | Khi script/workflow bị lỗi |
| `tester` | Chạy tests, validate workflow | Sau khi implement thay đổi kỹ thuật |
| `fullstack-developer` | Implement backend/frontend/infrastructure | Xây landing page, form, automation script |
| `database-admin` | Query, optimize, manage database | Cần truy vấn hoặc tối ưu database |
| `git-manager` | Commit, push code với conventional commits | Sau khi hoàn thành implementation |
| `mcp-manager` | Quản lý MCP server integrations | Thêm hoặc cấu hình MCP tools |
| `journal-writer` | Ghi lại sự cố kỹ thuật nghiêm trọng | Khi gặp blockers lớn hoặc production issue |

---

## Cách agents đọc brand context

Tất cả agents tạo content đều đọc:
- `docs/brand-guidelines.md` — tone, màu sắc, USP, ICP
- `docs/marketing-overview.md` — chiến lược, KPI, kênh

---

*Cập nhật: 09/04/2026.*
