const fs = require('fs');

async function fetchSyncData() {
  const apiKey = 'e30fb0ce-e4e6-47a7-9f01-b4d1ad5e122a:891bb723f78bb77d43e3e24f2f66de48';
  const audioPath = 'assets/audio/premium-voice.mp3';
  const audioBase64 = fs.readFileSync(audioPath, { encoding: 'base64' });

  console.log('[+] Đang gửi Audio lên Fal Whisper để soi từng từ...');
  const res = await fetch('https://queue.fal.run/fal-ai/whisper', {
    method: 'POST',
    headers: {
      'Authorization': 'Key ' + apiKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ 
      audio_url: 'data:audio/mp3;base64,' + audioBase64,
      task: 'transcribe',
      language: 'vi',
      chunk_level: 'word' // Cực kỳ quan trọng để có Karaoke sync
    })
  });

  const initData = await res.json();
  const statusUrl = initData.status_url;
  const responseUrl = initData.response_url;

  console.log('[+] Đang chờ kết quả soi từ (Polling)...');
  while (true) {
    const s = await fetch(statusUrl, { headers: { 'Authorization': 'Key ' + apiKey } });
    const sData = await s.json();
    if (sData.status === 'COMPLETED') {
      const r = await fetch(responseUrl, { headers: { 'Authorization': 'Key ' + apiKey } });
      const finalData = await r.json();
      fs.writeFileSync('assets/audio/whisper-sync.json', JSON.stringify(finalData, null, 2));
      console.log('[✅] Hoàn tất! Dữ liệu Word-sync đã lưu vào assets/audio/whisper-sync.json');
      break;
    } else if (sData.status === 'FAILED') {
      console.error('[X] Lỗi Whisper:', sData);
      break;
    }
    process.stdout.write('.');
    await new Promise(res => setTimeout(res, 3000));
  }
}

fetchSyncData();
