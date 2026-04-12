# Cẩm nang Scale Dự án (Add New Brand Guide)

Hệ thống của bạn hiện đã được chuyển đổi thành một **AI Marketing Agency** chuyên nghiệp. Để thêm một dự án mới mà không bị lẫn lộn vào dự án cũ, hãy làm theo các bước sau:

## 1. Khởi tạo Không gian mới
Tạo một thư mục mới trong thư mục `/brands/`:
```bash
mkdir brands/brand-moi
mkdir brands/brand-moi/docs
mkdir brands/brand-moi/assets
mkdir brands/brand-moi/content
```

## 2. Thiết lập "Chứng minh thư" Thương hiệu
Copy file `brand-identity.json` từ `brands/nhan-tam/` sang thư mục mới và sửa thông tin:
- Đổi tên Brand, Slogan.
- Cập nhật Kịch bản TVC mong muốn.
- Chọn Voice AI phù hợp.

## 3. Ra lệnh cho AI
Hãy nói với tôi: *"Tôi muốn triển khai chiến dịch cho Brand Mới trong thư mục brands/brand-moi"*.
Tôi sẽ tự động:
- Đọc dữ liệu từ folder đó.
- Không bao giờ nhắc lại chuyện cà phê của Nhân Tâm nữa.
- Sử dụng toàn bộ "Động cơ" trong `/core-engine/` để phục vụ Brand mới của bạn.

---
**Lợi ích:** Bạn có thể chạy 10, 100 Brand cùng lúc trên cùng cái "khung xương" kỹ thuật này mà không bao giờ bị vướng hay xung đột dữ liệu!
