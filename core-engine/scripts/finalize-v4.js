const { execSync } = require('child_process');

async function finalizeV4() {
  console.log('[+] Đang bắt đầu khâu Hòa Âm Siêu Cấp V4...');
  console.log('[+] Cấu hình: Giọng Nam Adam (100%) + Nhạc nền Acoustice (12% - Loop liên tục)');
  
  // Lệnh FFmpeg V4 chuyên nghiệp:
  // - stream_loop -1: Lặp lại nhạc nền nếu nó ngắn hơn video
  // - volume=0.12: Giảm nhạc nền xuống mức 12% để tôn vinh giọng đọc
  // - amix: Trộn âm thanh và lấy độ dài theo luồng Video chính
  const outputFile = 'assets/videos/TVC-Nhan-Tam-Ultimate-V4.mp4';
  const ffmpegCmd = `ffmpeg -i assets/videos/TVC-Nhan-Tam-Smooth-V2.mp4 -i assets/audio/premium-voice.mp3 -stream_loop -1 -i assets/audio/bgm.mp3 -filter_complex "[2:a]volume=0.12[bg];[1:a][bg]amix=inputs=2:duration=first[a]" -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 192k ${outputFile} -y`;

  try {
    execSync(ffmpegCmd);
    console.log(`[✅] SIÊU PHẨM V4 HOÀN TẤT: ${outputFile}`);
  } catch (e) {
    console.error('[X] Lỗi FFmpeg:', e.message);
  }
}

finalizeV4();
