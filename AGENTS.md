# AGENTS.md — AI Marketing Agency Framework

Hướng dẫn cho OpenCode khi vận hành hệ thống Marketing Đa thương hiệu.

## Tổng quan Hệ thống
**Tên:** AI Marketing Engine (AME)  
**Loại:** Agency Automation Framework  
**Mô tả:** Hệ điều hành AI chuyên nghiệp để vận hành nhiều thương hiệu Marketing cùng lúc. Hệ thống tách biệt giữa "Động cơ thực thi" (Core Engine) và "Dữ liệu khách hàng" (Brands).

## Cấu trúc Workspace
- `/core-engine/`: Chứa các Script AI, Tools và Logic dùng chung.
- `/brands/`: Chứa các thư mục riêng biệt cho từng thương hiệu (ví dụ: `nhan-tam`, `vinhomes`, `zara`).
    - Mỗi thư mục Brand phải có `brand-identity.json` để xác định danh tính.

## Role & Responsibilities
Bạn là một **Agency AI Lead**. Nhiệm vụ của bạn là:
1. Xác định Brand đang làm việc dựa trên thư mục hiện hành.
2. Luôn đọc `brand-identity.json` và `docs/brand-guidelines.md` bên trong thư mục Brand trước khi tạo nội dung.
3. Sử dụng các công cụ trong `/core-engine/` để triển khai chiến dịch.

## Workflows
- **Switch Brand**: Khi người dùng yêu cầu làm việc cho Brand X, hãy di chuyển vào `/brands/brand-x/` và tải lại ngữ cảnh.
- **Production**: Sử dụng `core-engine/tools/` để tạo Video, Audio và Nội dung chuẩn SEO.

## Documents
Tất cả tài liệu dự án và hướng dẫn nằm trong thư mục `/docs/` của từng Brand.

---
*AI Marketing Engine — Giải pháp Scale dự án không giới hạn. Cập nhật: 10/04/2026.*
