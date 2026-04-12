// API endpoint: reads brand docs bundled in brand-docs/ and pushes to Upstash Redis.
// Called by the sync button in the meeting room UI.
// Also auto-called via postbuild to keep Redis fresh after every Vercel deploy.

import { NextResponse } from 'next/server';
import fs   from 'fs';
import path from 'path';

export const runtime = 'nodejs';

const REDIS_KEY = 'meeting:brand:knowledge';

const DOCS_CONFIG = [
  { file: 'brand-guidelines.md',            label: "BRAND GUIDELINES — Tone, Voice, Visual Identity, DO/DON'T",   personas: 'Tất cả nhân sự, đặc biệt Minh Châu, Ngọc, Hà Linh' },
  { file: 'marketing-overview.md',           label: 'CHIẾN LƯỢC MARKETING TỔNG THỂ',                               personas: 'Đức, Mai, Tuấn Anh, Bảo' },
  { file: 'product-playbook-2026.md',        label: 'PRODUCT PLAYBOOK 2026',                                       personas: 'Minh Châu, Thanh, Hà Linh, Khoa' },
  { file: 'pricing-strategy.md',             label: 'CHIẾN LƯỢC GIÁ & TIERED PRICING',                             personas: 'Khải, Tú, Thanh' },
  { file: 'wholesale-price-list-2026-v2.md', label: 'BẢNG GIÁ SỈ 2026 (phiên bản mới nhất)',                      personas: 'Khải, Liên, Tú, Thanh' },
  { file: 'design-guidelines.md',            label: 'DESIGN GUIDELINES — Visual System, Typography, Color',        personas: 'Ngọc, Khoa' },
  { file: 'sales-objection-handling.md',     label: 'XỬ LÝ PHẢN ĐỐI BÁN HÀNG',                                   personas: 'Khải, Thanh, Liên' },
  { file: 'referral-program-2026.md',        label: 'CHƯƠNG TRÌNH GIỚI THIỆU KHÁCH 2026',                         personas: 'Thanh, Liên, Khải' },
  { file: 'master-operational-budget-2026.md', label: 'NGÂN SÁCH VẬN HÀNH 2026 (nội bộ)',                         personas: 'Tú, Khải' },
  { file: 'cash-flow-scenarios-2026.md',     label: 'KỊCH BẢN DÒNG TIỀN 2026 (nội bộ)',                           personas: 'Tú, Khải' },
  { file: 'blitz-video-scripts.md',          label: 'SCRIPT VIDEO MẪU',                                           personas: 'Khoa, Minh Châu, Hà Linh' },
];

export async function POST() {
  const redisUrl   = process.env.UPSTASH_REDIS_REST_URL?.trim()   ?? '';
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN?.trim() ?? '';
  if (!redisUrl || !redisToken) {
    return NextResponse.json({ error: 'Thiếu Upstash credentials' }, { status: 500 });
  }

  // brand-docs/ is co-located with the app at project root
  const docsDir = path.join(process.cwd(), 'brand-docs');

  const timestamp = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
  const sections: string[] = [
    `# TÀI LIỆU THƯƠNG HIỆU CÀ PHÊ NHÂN TÂM`,
    `> Cập nhật lần cuối: ${timestamp}`,
    `> Nhân sự đọc tài liệu này để có kiến thức chính xác về sản phẩm, giá, chiến lược, và brand voice của CPNT.`,
  ];

  const loaded: string[] = [];
  for (const { file, label, personas } of DOCS_CONFIG) {
    const filePath = path.join(docsDir, file);
    if (!fs.existsSync(filePath)) continue;
    const content = fs.readFileSync(filePath, 'utf-8').trim();
    sections.push(`\n---\n\n## ${label}\n_Áp dụng cho: ${personas}_\n\n${content}`);
    loaded.push(file);
  }

  if (loaded.length === 0) {
    return NextResponse.json({ error: 'Không đọc được tài liệu nào từ brand-docs/' }, { status: 500 });
  }

  const knowledge = sections.join('\n');

  // Push to Upstash via REST API
  const res = await fetch(redisUrl, {
    method:  'POST',
    headers: { Authorization: `Bearer ${redisToken}`, 'Content-Type': 'application/json' },
    body:    JSON.stringify(['SET', REDIS_KEY, knowledge]),
  });

  if (!res.ok) {
    const err = await res.text();
    return NextResponse.json({ error: `Upstash error: ${err}` }, { status: 500 });
  }

  return NextResponse.json({
    ok:        true,
    docs:      loaded.length,
    chars:     knowledge.length,
    updatedAt: timestamp,
  });
}
