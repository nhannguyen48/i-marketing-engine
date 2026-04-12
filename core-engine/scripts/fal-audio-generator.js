const fs = require('fs');
const https = require('https');

async function generateAudio() {
  const text = `Chào mừng bạn đến với thế giới của Cà Phê Nhân Tâm - nơi mỗi hạt cà phê đều mang trong mình một câu chuyện về bản sắc và khát vọng. 
Bạn đang tìm kiếm sự khác biệt cho quán cà phê của mình? Bạn muốn chinh phục những thực khách khó tính nhất bằng hương vị đậm đà, quyến rũ?
Hãy nhìn lớp crema dày mịn này. Đó chính là minh chứng cho sự tinh túy trong từng giọt Sài Gòn Bold.
Hậu vị ngọt thanh, hương thơm nồng nàn, không bao giờ vỡ phom đá. Nhân Tâm cam kết đồng hành cùng các startup cà phê Việt.
Chúng tôi mang đến sản phẩm hạt rang mộc nguyên chất, quy trình chế biến khép kín, đảm bảo chất lượng vàng.
Đặc biệt, chương trình ưu đãi vàng: Mua một ký, tính giá xưởng. Cơ hội bứt phá doanh thu cho quán của bạn ngay hôm nay.
Cà Phê Nhân Tâm - Đậm đà bản sắc, trọn vẹn niềm tin.`;
  const apiKey = 'e30fb0ce-e4e6-47a7-9f01-b4d1ad5e122a:891bb723f78bb77d43e3e24f2f66de48';
  
  console.log('[+] Đang ra lệnh cho ElevenLabs V3 tạo giọng NAM quảng cáo quyền lực...');
  const res = await fetch('https://queue.fal.run/fal-ai/elevenlabs/tts/eleven-v3', {
    method: 'POST',
    headers: {
      'Authorization': 'Key ' + apiKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ 
      text: text, 
      voice: 'Adam', // Giọng nam trầm ấm, mạnh mẽ
      stability: 0.5,
      language_code: "vi"
    })
  });
  
  let data = await res.json();
  const statusUrl = data.status_url;
  const responseUrl = data.response_url;
  
  console.log('[+] Đã vào hàng đợi vòng lặp. Tiến hành Polling...');
  
  while (true) {
    const p = await fetch(statusUrl, { headers: { 'Authorization': 'Key ' + apiKey } });
    const pData = await p.json();
    if (pData.status === 'COMPLETED') {
      console.log('[+] Đã Xong! Đang lấy kết quả Audio...');
      const f = await fetch(responseUrl, { headers: { 'Authorization': 'Key ' + apiKey } });
      const fData = await f.json();
      
      let audioUrl = fData.audio?.url || fData.url || (fData.data && fData.data.url) || fData.payload?.url;
      if (!audioUrl) {
         // Quét tìm link mp3 hoặc wav
         for(let key in fData) {
            if(typeof fData[key] === 'string' && fData[key].startsWith('http') && (fData[key].includes('.mp3') || fData[key].includes('.wav'))) {
                audioUrl = fData[key];
                break;
            }
         }
      }
      
      console.log('[+] Link tải MP3: ', audioUrl);
      https.get(audioUrl, (downloadRes) => {
        const file = fs.createWriteStream('assets/audio/premium-voice.mp3');
        downloadRes.pipe(file);
        file.on('finish', () => console.log('HOÀN THÀNH TẢI AUDIO!'));
      });
      break;
    } else if (pData.status === 'FAILED') {
      console.error('LỖI KHI RENDER AUDIO: ', pData);
      break;
    }
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
}

generateAudio();
