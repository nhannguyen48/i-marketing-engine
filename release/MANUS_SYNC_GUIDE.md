# Manus AI Sync Guide — AI Marketing Engine

Hướng dẫn cách đồng bộ và sử dụng hệ thống 90+ skills từ dự án của bạn lên nền tảng Manus AI.

---

## 🛠 Cách 1: Tải lên theo Nhóm (ZIP Bundles)
Tôi đã đóng gói các kỹ năng thành 7 nhóm lớn theo mục đích sử dụng. Đây là cách nhanh nhất để đưa từng bộ kỹ năng vào Manus.

1. **Truy cập Manus AI**: Đăng nhập và vào mục **Skills** hoặc **App Launcher**.
2. **Chọn Nhóm**: Tìm đến thư mục `e:\my-project\release\bundles\` và chọn nhóm bạn muốn (ví dụ: `Marketing_Core.zip`).
3. **Upload**: Tải file ZIP lên. Manus sẽ nhận diện toàn bộ các kỹ năng bên trong nhóm đó.

| Nhóm Skill | Nội dung chính |
|-----------|---------------|
| `Marketing_Core.zip` | Brand context, SEO, Copywriting, Ads strategy. |
| `Growth_Revenue.zip` | Launch strategy, Funnel design, Pricing. |
| `Creative_Design.zip` | AI Video, Image generation, Remotion, Voiceover. |
| `Technical_Infrastructure.zip` | Coding, Debugging, MCP Tools, DevOps. |
| `Process_Management.zip` | Plan, HR, Accounting, Team management. |

---

## 🔄 Cách 2: Kết nối GitHub (Đồng bộ Tự động)
Đây là cách **tốt nhất** nếu bạn muốn mọi thay đổi tôi thực hiện ở đây được tự động cập nhật lên Manus.

### 1. Khởi tạo Repository
Nếu bạn chưa có repo GitHub cho dự án này:
```powershell
# Tại thư mục gốc E:\my-project
git init
git add .
git commit -m "Initial commit of AI Marketing Engine"
# Sau đó push lên GitHub của bạn
```

### 2. Kết nối với Manus
1. Trong Manus, chọn **Import from GitHub**.
2. Dán URL repository của bạn vào.
3. Manus sẽ tự động quét các file `SKILL.md` trong thư mục `.opencode/skills/` và đồng bộ chúng.

---

## 💡 Mẹo sử dụng trong Manus
Sau khi đã đồng bộ, bạn có thể gọi các skill này bằng cách:
- Gõ `/` trong khung chat để chọn skill thủ công.
- Hoặc ra lệnh: *"Sử dụng skill 'hr-management' để viết JD cho vị trí Barista."*

> [!IMPORTANT]
> Toàn bộ các skill đều yêu cầu file `SKILL.md` làm điểm bắt đầu. Tôi đã kiểm tra và đảm bảo tất cả các file đóng gói đều có cấu trúc này.

---
*Cập nhật: 12/04/2026 bởi Antigravity.*
