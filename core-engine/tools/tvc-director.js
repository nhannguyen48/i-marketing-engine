#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

// Đọc kịch bản bằng tham số linh hoạt cho hệ thống Multi-Brand
const args = process.argv.slice(2);
const scriptArg = args[0] || 'content/video/tvc/script-nhan-tam-60s.json';
const scriptPath = path.resolve(process.cwd(), scriptArg);

if (!fs.existsSync(scriptPath)) {
  console.error(`[X] Không tìm thấy kịch bản JSON tại: ${scriptPath}`);
  console.error(`Sử dụng: node core-engine/tools/tvc-director.js [đường/dẫn/đến/script.json]`);
  process.exit(1);
}

const scenes = JSON.parse(fs.readFileSync(scriptPath, 'utf8'));

// Tự động nhận diện thư mục Brand
const isBrandDir = fs.existsSync(path.join(process.cwd(), 'brand-identity.json'));
const outputDir = isBrandDir 
  ? path.join(process.cwd(), 'assets/videos/tvc-staging') 
  : path.join(__dirname, '../../assets/videos/tvc-staging');

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

console.log(`[▶] TỔNG TƯ LỆNH TVC KHỞI ĐỘNG...`);
console.log(`[!] Cảnh báo: Sẽ gọi API liên hoàn ${scenes.length} nhát cắn. Thời gian chờ khoảng ${scenes.length * 2} phút.`);
console.log(`==========================================`);

// Hàm chạy tiến trình phụ (Hỗ trợ cả Fal.ai và Google Cloud)
function runGenerator(model, prompt) {
  return new Promise((resolve, reject) => {
    let generatorPath;
    let generatorArgs;

    if (model === 'veo') {
      generatorPath = path.join(__dirname, 'vertex-video-generator.js');
      generatorArgs = [prompt];
      console.log(`>> Khởi tạo Google Cloud Vertex AI: [Veo 3.1] cho Cảnh mới...`);
    } else {
      generatorPath = path.join(__dirname, 'fal-video-generator.js');
      generatorArgs = [`--model=${model}`, prompt];
      console.log(`>> Khởi tạo Fal.ai Model: [${model}] cho Cảnh mới...`);
    }
	
    // Spawn call: node generator.js ...
    const child = spawn('node', [generatorPath, ...generatorArgs], { 
      stdio: 'inherit' // In chung terminal
    });

    child.on('close', (code) => {
      if (code !== 0) reject(new Error(`Cảnh bị hỏng với lỗi code ${code}`));
      else resolve();
    });
  });
}

(async function orchestrate() {
  try {
    for (const [index, scene] of scenes.entries()) {
      console.log(`\n==========================================`);
      console.log(`🎬 ĐANG QUAY: SCENE ${scene.scene}/${scenes.length}`);
      console.log(`📍 Kịch bản: ${scene.prompt.substring(0, 70)}...`);
      
      // Chạy đồng bộ (đợi cảnh A xong mới quay cảnh B để tránh nổ RAM Server)
      await runGenerator(scene.model, scene.prompt);
      
      console.log(`✅ CẢNH ${scene.scene} ĐÃ KHẮC VÀO Ổ CỨNG.`);
    }

    console.log(`\n==========================================`);
    console.log(`[✔] ĐÃ ĐÚC XONG TẤT CẢ ${scenes.length} VIDEO CẦN THIẾT!`);
    console.log(`[✔] Bước tiếp theo: Sử dụng phần mềm ghép file FFMPEG (hoặc thư viện chỉnh sửa) để nối Audio.`);
    
  } catch(e) {
    console.error(`[X] SẬP NGUỒN ĐẠO DIỄN: `, e.message);
  }
})();
