#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const SCENES_FILE = path.join(__dirname, '../../brands/nhan-tam/content/video/tvc/asmr-scenes-gcp.json');
const GENERATOR_PATH = path.join(__dirname, 'vertex-video-generator.js');

async function runBatch() {
  console.log(`[🎞️] BẮT ĐẦU CHIẾN DỊCH SẢN XUẤT TVC ASMR ELITE...`);
  
  if (!fs.existsSync(SCENES_FILE)) {
    console.error("Không tìm thấy file kịch bản asmr-scenes-gcp.json");
    process.exit(1);
  }

  const scenes = JSON.parse(fs.readFileSync(SCENES_FILE, 'utf8'));
  console.log(`[+] Tổng số cảnh cần quay: ${scenes.length}`);

  for (const scene of scenes) {
    console.log(`\n---------------------------------------------------------`);
    console.log(`[🎬] ĐANG QUAY CẢNH ${scene.id}: ${scene.name}`);
    console.log(`[+] Prompt: ${scene.prompt}`);
    
    // Chạy generator đồng bộ để đảm bảo quay xong mẻ này mời sang mẻ kia
    const result = spawnSync('node', [GENERATOR_PATH, scene.prompt], {
      stdio: 'inherit',
      cwd: path.join(__dirname, '../../brands/nhan-tam')
    });

    if (result.status !== 0) {
      console.error(`[X] LỖI khi quay cảnh ${scene.id}. Bỏ qua và tiếp tục...`);
    } else {
      console.log(`[✅] HOÀN TẤT CẢNH ${scene.id}!`);
    }
  }

  console.log(`\n=========================================================`);
  console.log(`[🏁] TẤT CẢ CÁC CẢNH QUAY ĐÃ ĐƯỢC XUẤT XƯỞNG!`);
  console.log(`[!] Sếp có thể vào thư mục brands/nhan-tam/assets/videos để kiểm tra.`);
}

runBatch();
