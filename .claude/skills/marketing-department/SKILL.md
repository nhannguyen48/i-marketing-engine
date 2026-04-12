# Skill: Marketing Department — Phiên Họp Phòng Ban

> Skill này mô phỏng một phiên họp marketing với 5 thành viên có chuyên môn khác nhau. Mỗi thành viên phát biểu quan điểm, phản biện lẫn nhau, và đưa ra kết luận tập thể dưới dạng **Biên bản họp**.

---

## Kích hoạt

Gọi từ lệnh `/ckm:team/huddle <brief>` hoặc khi người dùng yêu cầu "họp phòng ban marketing".

---

## Thành viên & Vai trò

| # | Vai trò | Chuyên môn | Góc nhìn |
|---|---------|------------|----------|
| 1 | **Creative Director** | Brand identity, visual concept, storytelling | "Có phù hợp brand không? Cảm xúc đúng không?" |
| 2 | **Copywriter** | Hook, copy, CTA, tone of voice | "Câu chữ có đánh trúng pain không? CTA có rõ không?" |
| 3 | **SEO Analyst** | Từ khóa, search intent, on-page SEO | "Từ khóa nào rank được? Intent có đúng không?" |
| 4 | **Campaign Manager** | Kênh phân phối, ngân sách, timeline | "Kênh nào hiệu quả nhất? Chi phí có hợp lý không?" |
| 5 | **Content Auditor** | Chất lượng nội dung, tính nhất quán, rủi ro | "Có lỗ hổng nào không? Đối thủ đã làm chưa?" |

---

## Quy trình họp

```
ROUND 1 — Phát biểu đầu tiên (mỗi thành viên 1 lần)
  └→ Dựa trên brief của chủ doanh nghiệp
  └→ Mỗi người nêu quan điểm + đề xuất cụ thể

ROUND 2 — Phản biện & Bổ sung
  └→ Ai có ý kiến khác → lên tiếng ngay
  └→ Ít nhất 2 cuộc tranh luận thực chất phải xảy ra
  └→ Không đồng thuận giả tạo — phải có bất đồng thật

ROUND 3 — Kết luận tập thể
  └→ Tổng hợp điểm đồng thuận
  └→ Ghi nhận điểm còn tranh luận (chủ quyết định)
  └→ Action items cụ thể với người chịu trách nhiệm

OUTPUT → Biên bản họp (markdown)
```

---

## Quy tắc tranh luận

1. **Phải có phản biện thật**: Ít nhất 2 thành viên bất đồng về ít nhất 1 điểm. Không được giả vờ đồng ý tất cả.
2. **Dẫn chứng cụ thể**: Phản biện phải có lý do ("tôi không đồng ý vì..."), không phản biện chung chung.
3. **Tên thật**: Mỗi phát biểu đều ghi rõ tên vai trò.
4. **Brand-first**: Mọi đề xuất đều phải đối chiếu với brand guidelines của Cà Phê Nhân Tâm.
5. **Thực tế**: Đề xuất ngân sách phải thực tế với startup F&B Việt Nam.

---

## Output Template: Biên bản Họp

```markdown
# Biên bản Họp — Phòng Ban Marketing
**Ngày:** {ngày}
**Chủ đề:** {brief từ người dùng}
**Thành viên:** Creative Director · Copywriter · SEO Analyst · Campaign Manager · Content Auditor
**Chủ trì:** {Tên người dùng / Chủ doanh nghiệp}

---

## I. Tóm tắt Brief

> {Brief gốc của người dùng, diễn giải lại súc tích}

---

## II. Phiên Thảo Luận

### 🎨 Creative Director — Phát biểu
> ...

### ✍️ Copywriter — Phát biểu
> ...

### 🔍 SEO Analyst — Phát biểu
> ...

### 📣 Campaign Manager — Phát biểu
> ...

### 🔎 Content Auditor — Phát biểu
> ...

---

## III. Tranh Luận

### Tranh luận 1: {Chủ đề bất đồng}
**[Bên A]:** ...
**[Bên B phản biện]:** ...
**[Kết luận tạm thời]:** ...

### Tranh luận 2: {Chủ đề bất đồng}
...

---

## IV. Kết Luận Tập Thể

### ✅ Điểm đồng thuận
- ...

### ⚠️ Điểm còn tranh luận (Chủ quyết định)
- ...

---

## V. Action Items

| # | Việc cần làm | Phụ trách | Deadline |
|---|-------------|-----------|----------|
| 1 | ... | Creative Director | ... |
| 2 | ... | Copywriter | ... |
| ... | | | |

---

## VI. Đề xuất ưu tiên cho Chủ doanh nghiệp

> **Khuyến nghị của phòng ban:** {1 câu tóm tắt hành động quan trọng nhất}

*Biên bản do Marketing AI Department — Cà Phê Nhân Tâm tạo lập.*
```

---

## Bối cảnh Brand (inject tự động)

Skill này tự động tham chiếu:
- `docs/brand-guidelines.md` — Brand values, tone, màu sắc, forbidden phrases
- `assets/writing-styles/ca-phe-nhan-tam-brand-voice-and-writing-style.md` — Voice & copy formulas
- `assets/leads/icp-profiles/startup-fb-xe-day-kiosk-saigon-icp-profile.md` — ICP profile
- `assets/seo/keywords/` — Các keyword research reports

---

## Lưu output

Lưu biên bản họp vào: `assets/marketing-meetings/{YYMMDD}-{slug}.md`
