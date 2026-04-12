#!/usr/bin/env node
// Reads CPNT brand docs → formats → pushes to Upstash Redis.
// Run from repo root: node apps/meeting-ntcf-web/scripts/sync-brand-knowledge-to-redis.mjs
// Env vars loaded from apps/meeting-ntcf-web/.env.local (if present) or shell.

import fs   from 'fs';
import path from 'path';

// ── Load .env.local ───────────────────────────────────────────────────────────

const envPath = path.resolve(process.cwd(), 'apps/meeting-ntcf-web/.env.local');
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf-8')
    .split('\n')
    .forEach(line => {
      const m = line.match(/^([^#=\s]+)\s*=\s*"?([^"]*)"?\s*$/);
      if (m) process.env[m[1]] = m[2];
    });
  console.log('✓ Loaded .env.local');
}

const REDIS_URL   = process.env.UPSTASH_REDIS_REST_URL?.trim();
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();
if (!REDIS_URL || !REDIS_TOKEN) {
  console.error('❌ Missing UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN');
  process.exit(1);
}

// ── Docs config: which files to include and which persona they inform ─────────

// Script lives at apps/meeting-ntcf-web/scripts/ — resolve docs relative to script location
const SCRIPT_DIR = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1'));
const REPO_ROOT  = path.resolve(SCRIPT_DIR, '../../..');
const DOCS_DIR   = path.join(REPO_ROOT, 'brands/nhan-tam/docs');

const DOCS = [
  {
    file:    'brand-guidelines.md',
    label:   "BRAND GUIDELINES — Tone, Voice, Visual Identity, DO/DON'T",
    personas: 'Tất cả nhân sự, đặc biệt Minh Châu, Ngọc, Hà Linh',
  },
  {
    file:    'marketing-overview.md',
    label:   'CHIẾN LƯỢC MARKETING TỔNG THỂ',
    personas: 'Đức, Mai, Tuấn Anh, Bảo',
  },
  {
    file:    'product-playbook-2026.md',
    label:   'PRODUCT PLAYBOOK 2026',
    personas: 'Minh Châu, Thanh, Hà Linh, Khoa',
  },
  {
    file:    'pricing-strategy.md',
    label:   'CHIẾN LƯỢC GIÁ & TIERED PRICING',
    personas: 'Khải, Tú, Thanh',
  },
  {
    file:    'wholesale-price-list-2026-v2.md',
    label:   'BẢNG GIÁ SỈ 2026 (phiên bản mới nhất)',
    personas: 'Khải, Liên, Tú, Thanh',
  },
  {
    file:    'design-guidelines.md',
    label:   'DESIGN GUIDELINES — Visual System, Typography, Color',
    personas: 'Ngọc, Khoa',
  },
  {
    file:    'sales-objection-handling.md',
    label:   'XỬ LÝ PHẢN ĐỐI BÁN HÀNG',
    personas: 'Khải, Thanh, Liên',
  },
  {
    file:    'referral-program-2026.md',
    label:   'CHƯƠNG TRÌNH GIỚI THIỆU KHÁCH 2026',
    personas: 'Thanh, Liên, Khải',
  },
  {
    file:    'master-operational-budget-2026.md',
    label:   'NGÂN SÁCH VẬN HÀNH 2026 (nội bộ)',
    personas: 'Tú, Khải',
  },
  {
    file:    'cash-flow-scenarios-2026.md',
    label:   'KỊCH BẢN DÒNG TIỀN 2026 (nội bộ)',
    personas: 'Tú, Khải',
  },
  {
    file:    'blitz-video-scripts.md',
    label:   'SCRIPT VIDEO MẪU',
    personas: 'Khoa, Minh Châu, Hà Linh',
  },
];

// ── Build knowledge block ─────────────────────────────────────────────────────

const timestamp = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
const sections  = [
  `# TÀI LIỆU THƯƠNG HIỆU CÀ PHÊ NHÂN TÂM`,
  `> Cập nhật lần cuối: ${timestamp}`,
  `> Nhân sự đọc tài liệu này để có kiến thức chính xác về sản phẩm, giá, chiến lược, và brand voice của CPNT.`,
];

let loaded = 0;
for (const { file, label, personas } of DOCS) {
  const filePath = path.join(DOCS_DIR, file);
  if (!fs.existsSync(filePath)) {
    console.warn(`  ⚠️  Không tìm thấy: ${file} — bỏ qua`);
    continue;
  }
  const content  = fs.readFileSync(filePath, 'utf-8').trim();
  const lines    = content.split('\n').length;
  sections.push(`\n---\n\n## ${label}\n_Áp dụng cho: ${personas}_\n\n${content}`);
  console.log(`  ✓ ${file} (${lines} dòng)`);
  loaded++;
}

if (loaded === 0) {
  console.error('❌ Không đọc được file nào. Kiểm tra lại đường dẫn brands/nhan-tam/docs/');
  process.exit(1);
}

const knowledge = sections.join('\n');
console.log(`\n📦 Tổng: ${loaded} tài liệu · ${knowledge.length.toLocaleString()} ký tự`);

// ── Push to Upstash Redis via REST API ────────────────────────────────────────

console.log('\n🔄 Đang đẩy lên Upstash Redis...');

const res = await fetch(REDIS_URL, {
  method:  'POST',
  headers: {
    Authorization:  `Bearer ${REDIS_TOKEN}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(['SET', 'meeting:brand:knowledge', knowledge]),
});

if (!res.ok) {
  const err = await res.text();
  console.error(`❌ Lỗi Upstash: ${res.status} — ${err}`);
  process.exit(1);
}

const result = await res.json();
if (result?.result !== 'OK') {
  console.error('❌ Upstash trả về:', JSON.stringify(result));
  process.exit(1);
}

console.log('✅ Brand knowledge đã được sync lên Redis!');
console.log('   Phòng họp sẽ tự động dùng kiến thức mới trong cuộc họp tiếp theo.\n');
