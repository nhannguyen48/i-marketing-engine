#!/usr/bin/env node
/**
 * finalize-veo3-brand-awareness-tvc.js
 * Pipeline hoàn chỉnh TVC Brand Awareness "Sài Gòn Chạy Bằng Cà Phê":
 *   1. Concat 8 VEO3 clips (8s×8 = 64s) thành video gộp
 *   2. Generate giọng NAM mạnh mẽ qua ElevenLabs (fal.ai)
 *   3. Mix video + voice (100%) + BGM (12%) bằng FFmpeg
 * Output: assets/videos/TVC-Nhan-Tam-Brand-Awareness-VEO3.mp4
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');

// ── Cấu hình paths (chạy từ thư mục brands/nhan-tam) ──────────────────────────
const BRAND_DIR = path.resolve(__dirname, '../../brands/nhan-tam');
const VIDEO_DIR = path.join(BRAND_DIR, 'assets/videos');
const AUDIO_DIR = path.join(BRAND_DIR, 'assets/audio');
const OUTPUT_FILE = path.join(VIDEO_DIR, 'TVC-Nhan-Tam-Brand-Awareness-VEO3.mp4');
const CONCAT_FILE = path.join(VIDEO_DIR, 'concat-veo3-brand-awareness.txt');
const CONCAT_OUTPUT = path.join(VIDEO_DIR, 'veo3-brand-awareness-merged-raw.mp4');
const VOICE_FILE = path.join(AUDIO_DIR, 'voice-brand-awareness.mp3');
const BGM_FILE = path.join(AUDIO_DIR, 'bgm.mp3');

const FAL_API_KEY = 'e30fb0ce-e4e6-47a7-9f01-b4d1ad5e122a:891bb723f78bb77d43e3e24f2f66de48';

// Kịch bản voiceover — Concept: "Sài Gòn Chạy Bằng Cà Phê"
const VOICEOVER_TEXT = `Sài Gòn không ngủ. Sài Gòn chạy bằng cà phê.

Mỗi buổi sáng, hàng nghìn ly cà phê được pha ra — từ những xe đẩy góc phố, những kiosk nhỏ, những quán cóc vỉa hè.

Đằng sau mỗi ly cà phê đó — là một người khởi nghiệp với giấc mơ riêng của họ.

Họ không cần lời hứa hẹn. Họ cần một đối tác thực sự.

Cà Phê Nhân Tâm. Robusta đậm đà. Arabica thanh thơm. Culi mạnh mẽ. Rang theo từng lô — chuẩn theo từng quán.

Giá thẳng từ xưởng. Giao nội đô 24 giờ. Mix và Match theo công thức riêng của quán bạn.

Vì khi quán bạn lớn — chúng tôi cũng lớn theo.

Cà Phê Nhân Tâm. Cùng giá xưởng, cùng lớn.`;

// Thứ tự 8 VEO3 clips theo kịch bản
const VEO3_CLIPS = [
  'veo3_1775783003911.mp4_6393471876508438806_sample_0.mp4',
  'veo3_1775783377780.mp4_15572186536335623749_sample_0.mp4',
  'veo3_1775783713443.mp4_12853038217860244296_sample_0.mp4',
  'veo3_1775783804744.mp4_10903279429860700080_sample_0.mp4',
  'veo3_1775783895416.mp4_4181023272064488110_sample_0.mp4',
  'veo3_1775783985766.mp4_2895853876024475613_sample_0.mp4',
  'veo3_1775784076069.mp4_11455965962604747847_sample_0.mp4',
  'veo3_1775795600556.mp4_2416148897620804522_sample_0.mp4',
];

// ── Helper: Poll fal.ai queue đến khi COMPLETED ───────────────────────────────
async function pollUntilDone(statusUrl, responseUrl) {
  while (true) {
    const res = await fetch(statusUrl, {
      headers: { 'Authorization': 'Key ' + FAL_API_KEY }
    });
    const data = await res.json();

    if (data.status === 'COMPLETED') {
      const resp = await fetch(responseUrl, {
        headers: { 'Authorization': 'Key ' + FAL_API_KEY }
      });
      return await resp.json();
    } else if (data.status === 'FAILED') {
      throw new Error('Fal.ai job FAILED: ' + JSON.stringify(data));
    } else {
      process.stdout.write('.');
      await new Promise(r => setTimeout(r, 5000));
    }
  }
}

// ── Helper: Download file từ URL ──────────────────────────────────────────────
function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath);
    https.get(url, (res) => {
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
    }).on('error', reject);
  });
}

// ── Bước 1: Concat 8 VEO3 clips ──────────────────────────────────────────────
function concatVeo3Clips() {
  console.log('\n[1/3] Gộp 8 VEO3 clips thành video 64 giây...');

  // Tạo file concat.txt cho FFmpeg
  const concatLines = VEO3_CLIPS.map(f => `file '${path.join(VIDEO_DIR, f).replace(/\\/g, '/')}'`).join('\n');
  fs.writeFileSync(CONCAT_FILE, concatLines);
  console.log(`  → Đã tạo concat list: ${CONCAT_FILE}`);

  // FFmpeg concat (copy codec — nhanh, không re-encode)
  const cmd = `ffmpeg -f concat -safe 0 -i "${CONCAT_FILE}" -c copy "${CONCAT_OUTPUT}" -y`;
  try {
    execSync(cmd, { stdio: 'pipe' });
    console.log(`  ✅ Video gộp: ${CONCAT_OUTPUT}`);
  } catch (e) {
    throw new Error('FFmpeg concat thất bại: ' + e.message);
  }
}

// ── Bước 2: Generate giọng NAM qua ElevenLabs ────────────────────────────────
async function generateVoice() {
  console.log('\n[2/3] Đang tạo giọng NAM mạnh mẽ qua ElevenLabs V3...');
  console.log('  Voice: Adam (giọng nam trầm ấm, quyền lực)');

  const initRes = await fetch('https://queue.fal.run/fal-ai/elevenlabs/tts/eleven-v3', {
    method: 'POST',
    headers: {
      'Authorization': 'Key ' + FAL_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      text: VOICEOVER_TEXT,
      voice: 'Adam',       // Giọng nam trầm, mạnh mẽ
      stability: 0.45,     // Hơi giảm stability để tăng cảm xúc
      similarity_boost: 0.85,
      language_code: 'vi'
    })
  });

  const initData = await initRes.json();
  if (!initData.status_url) throw new Error('ElevenLabs init thất bại: ' + JSON.stringify(initData));

  console.log('  → Đang chờ ElevenLabs render...');
  const result = await pollUntilDone(initData.status_url, initData.response_url);

  // Tìm audio URL trong kết quả
  let audioUrl = result.audio?.url || result.url;
  if (!audioUrl) {
    for (const key of Object.keys(result)) {
      const val = result[key];
      if (typeof val === 'string' && val.startsWith('http') && (val.includes('.mp3') || val.includes('.wav'))) {
        audioUrl = val; break;
      }
      if (typeof val === 'object' && val?.url) { audioUrl = val.url; break; }
    }
  }
  if (!audioUrl) throw new Error('Không tìm được audio URL: ' + JSON.stringify(result));

  console.log(`\n  → Đang tải voice MP3...`);
  await downloadFile(audioUrl, VOICE_FILE);
  console.log(`  ✅ Voice saved: ${VOICE_FILE}`);
}

// ── Bước 3: Mix video + voice + BGM ──────────────────────────────────────────
function mixFinalTVC() {
  console.log('\n[3/3] Hòa âm: Video + Voice (100%) + BGM (12%) → TVC cuối...');

  if (!fs.existsSync(BGM_FILE)) {
    throw new Error(`Không tìm thấy BGM: ${BGM_FILE}. Chạy finalize-v3.js để tạo trước.`);
  }

  // FFmpeg: mix voice + bgm (loop bgm nếu ngắn hơn video), ghép vào video
  const cmd = [
    'ffmpeg',
    `-i "${CONCAT_OUTPUT}"`,            // Video gộp
    `-i "${VOICE_FILE}"`,               // Giọng đọc
    `-stream_loop -1 -i "${BGM_FILE}"`, // BGM loop liên tục
    `-filter_complex "[2:a]volume=0.12[bg];[1:a][bg]amix=inputs=2:duration=first[a]"`,
    `-map 0:v`,
    `-map "[a]"`,
    `-c:v copy`,
    `-c:a aac -b:a 192k`,
    `-shortest`,
    `"${OUTPUT_FILE}" -y`
  ].join(' ');

  try {
    execSync(cmd, { stdio: 'pipe' });
    console.log(`  ✅ TVC hoàn chỉnh: ${OUTPUT_FILE}`);
  } catch (e) {
    throw new Error('FFmpeg mix thất bại: ' + e.message);
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────
(async function main() {
  console.log('==========================================');
  console.log('🎬 TVC BRAND AWARENESS — CÀ PHÊ NHÂN TÂM');
  console.log('   Concept: "Sài Gòn Chạy Bằng Cà Phê"');
  console.log('==========================================');

  try {
    // Đảm bảo thư mục output tồn tại
    if (!fs.existsSync(AUDIO_DIR)) fs.mkdirSync(AUDIO_DIR, { recursive: true });

    concatVeo3Clips();
    await generateVoice();
    mixFinalTVC();

    // Dọn dẹp file tạm
    [CONCAT_FILE, CONCAT_OUTPUT].forEach(f => { try { fs.unlinkSync(f); } catch {} });

    console.log('\n==========================================');
    console.log('✅ HOÀN THÀNH! TVC Brand Awareness sẵn sàng:');
    console.log(`   ${OUTPUT_FILE}`);
    console.log('==========================================');

  } catch (err) {
    console.error('\n[X] PIPELINE THẤT BẠI:', err.message);
    process.exit(1);
  }
})();
