const fs = require('fs');
const https = require('https');
const { execSync } = require('child_process');

async function finalizeTVC() {
  const apiKey = 'e30fb0ce-e4e6-47a7-9f01-b4d1ad5e122a:891bb723f78bb77d43e3e24f2f66de48';
  
  console.log('[+] Đang ra lệnh sáng tác Nhạc Nền AI (Acoustic Chill)...');
  const initRes = await fetch('https://queue.fal.run/fal-ai/stable-audio', {
    method: 'POST',
    headers: {
      'Authorization': 'Key ' + apiKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ 
      prompt: 'Chill acoustic guitar, relaxing coffee shop background music, instrumental, no vocals, high quality', 
      seconds_total: 45 // Vượt ngưỡng 47 sẽ lỗi, 45 là an toàn
    })
  });
  
  const initData = await initRes.json();
  const requestId = initData.request_id;
  const statusUrl = initData.status_url;
  const responseUrl = initData.response_url;

  console.log(`[+] Đã gửi yêu cầu (ID: ${requestId}). Đang đợi AI sáng tác...`);
  
  while (true) {
    const res = await fetch(statusUrl, { headers: { 'Authorization': 'Key ' + apiKey } });
    const data = await res.json();
    
    if (data.status === 'COMPLETED') {
      const resp = await fetch(responseUrl, { headers: { 'Authorization': 'Key ' + apiKey } });
      const finalData = await resp.json();
      
      // Tìm link audio trong kết quả
      let audioUrl = finalData.audio_file?.url || finalData.url;
      if (!audioUrl) {
         for(let key in finalData) {
            if(typeof finalData[key] === 'object' && finalData[key].url) {
                audioUrl = finalData[key].url;
                break;
            }
         }
      }
      
      console.log('[+] Đã có nhạc! Đang tải bản BGM...');
      await new Promise((resolve) => {
        https.get(audioUrl, (res) => {
          const path = 'assets/audio/bgm.mp3';
          const filePath = fs.createWriteStream(path);
          res.pipe(filePath);
          filePath.on('finish', () => {
            filePath.close();
            console.log('[+] Đã lưu nhạc vào assets/audio/bgm.mp3');
            resolve();
          });
        });
      });

      console.log('[+] Bắt đầu khâu hòa âm (VO 100% + BGM 15%) và dựng Video Ultimate V3...');
      // Lệnh FFmpeg hòa âm: amix=inputs=2, âm lượng VO 1.0, BGM 0.15
      const ffmpegCmd = `ffmpeg -i TVC-Nhan-Tam-Smooth-V2.mp4 -i assets/audio/premium-voice.mp3 -i assets/audio/bgm.mp3 -filter_complex "[2:a]volume=0.15[bg];[1:a][bg]amix=inputs=2:duration=first[a]" -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 192k TVC-Nhan-Tam-Ultimate-V3.mp4 -y`;
      
      try {
        execSync(ffmpegCmd);
        console.log('[✅] SIÊU PHẨM HOÀN THÀNH: TVC-Nhan-Tam-Ultimate-V3.mp4');
      } catch (e) {
        console.error('[X] Lỗi FFmpeg:', e.message);
      }
      break;
    } else if (data.status === 'FAILED') {
      console.error('[X] AI Sáng tác thất bại:', data);
      break;
    } else {
      process.stdout.write('.');
      await new Promise(r => setTimeout(r, 5000));
    }
  }
}

finalizeTVC();
