#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const https = require('https');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const FAL_KEY = process.env.FAL_KEY;
if (!FAL_KEY) {
  console.error("Vui lòng nạp khoá API của Fal.ai vào file .env trong thư mục gốc dự án (FAL_KEY=...)");
  process.exit(1);
}

// Bóc tách đối số dòng lệnh Command Line (Prompt và Model)
const args = process.argv.slice(2);

let selectedModel = 'minimax'; // Default là MiniMax (Tốt nhất hiện nay về chuyển động)
let promptParts = [];

for (let i = 0; i < args.length; i++) {
  if (args[i].startsWith('--model=')) {
    selectedModel = args[i].split('=')[1].toLowerCase();
  } else {
    promptParts.push(args[i]);
  }
}

const prompt = promptParts.join(' ');
if (!prompt) {
  console.error("Sử dụng: node fal-video-generator.js [--model=kling|minimax|luma|runway] <PROMPT>");
  process.exit(1);
}

// Bảng định tuyến các Mô Hình Đỉnh Cao Nhất Thế Giới (Top-Tier Video Models)
const modelEndpoints = {
  kling: 'fal-ai/kling-video/v1/standard/text-to-video',
  klingpro: 'fal-ai/kling-video/v1.5/pro/text-to-video', // Elite: Vua vật lý hạt & hữu cơ
  minimax: 'fal-ai/minimax/video-01',
  luma: 'fal-ai/luma-dream-machine',
  runway: 'fal-ai/runway-gen3/turbo/text-to-video',
  hunyuan: 'fal-ai/hunyuan-video',          // Elite: Vua ánh sáng công nghiệp & kim loại
  veo: 'fal-ai/veo3.1',                     // Elite: Vua quang học & Cinematic lens logic
  pixverse: 'fal-ai/pixverse/v5.6/text-to-video',
  vidu: 'fal-ai/vidu/q3/text-to-video'
};

const endpointPath = modelEndpoints[selectedModel] || modelEndpoints.minimax;
const apiUrl = `https://queue.fal.run/${endpointPath}`;

console.log(`[+] Mở luồng kết nối đường ống MCP với Fal.ai...`);
console.log(`[+] Động Cơ Kích Hoạt: [${selectedModel.toUpperCase()}]`);
console.log(`[+] Prompt Đang Xử Lý: "${prompt.substring(0, 50)}..."`);

// Mô phỏng quá trình gọi fetch tới endpoint fal.ai/models/kling-video/v1/standard/text-to-video
async function generateVideo(promptText) {
  try {
    // 1. Gửi request sinh Video tới Server Mỹ
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Key ${FAL_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: promptText,
        aspect_ratio: "9:16"
      })
    });
	
	if(!response.ok) {
		const errorText = await response.text();
		throw new Error(`Fal.ai API Error: ${response.status} - ${errorText}`);
	}

    const json = await response.json();
    const requestId = json.request_id;
    const statusUrl = json.status_url;
    console.log(`[+] Fal.ai Đã nhận lệnh ngâm tệp. Mã Request ID: ${requestId}`);
	console.log(`[!] Vui lòng đợi từ 1-2 phút cho Server kết xuất Video MP4...`);

    // 2. Poll server (kiểm tra liên tục) cho đến khi Video ra lò
	let videoUrl = null;
    while (!videoUrl) {
      await new Promise(res => setTimeout(res, 10000)); // Nghỉ 10s
      console.log(`[-] Đang kiểm tra tiến độ tệp MP4...`);
      
      const pollRes = await fetch(statusUrl || `https://queue.fal.run/${endpointPath}/requests/${requestId}`, {
        headers: { 'Authorization': `Key ${FAL_KEY}` }
      });
      
      const responseText = await pollRes.text();
      let pollJson;
      try {
        pollJson = JSON.parse(responseText);
      } catch (e) {
        throw new Error(`Server Mỹ trả về dữ liệu lỗi (Không phải JSON). Chi tiết: ${responseText}`);
      }
      
      if (pollJson.status === 'COMPLETED') {
        // Hàm quyét siêu cấp: Tự động lùng sục tìm Link Video
        function findVideoUrl(obj) {
          if (!obj || typeof obj !== 'object') return null;
          if (obj.video && typeof obj.video.url === 'string') return obj.video.url;
          
          for (let key in obj) {
             const val = obj[key];
             if (typeof val === 'string' && val.startsWith('http')) {
                const k = key.toLowerCase();
                if (val.includes('queue.fal.run') || k.includes('status') || k.includes('request') || k.includes('response') || k.includes('cancel')) continue;
                if (val.includes('.mp4') || k.includes('url') || k.includes('file') || k.includes('video')) return val;
             }
             if (typeof val === 'object') {
                const found = findVideoUrl(val);
                if (found) return found;
             }
          }
          return null;
        }

        videoUrl = findVideoUrl(pollJson);
        
        // Nếu bản poll status chưa có data (thường gặp ở model cao cấp), truy vấn thẳng vào response_url
        if (!videoUrl && (pollJson.response_url || requestId)) {
          console.log(`[-] Đang truy xuất kết quả cuối cùng từ đường ống chiến lược...`);
          const finalRes = await fetch(pollJson.response_url || `https://queue.fal.run/${endpointPath}/requests/${requestId}`, {
            headers: { 'Authorization': `Key ${FAL_KEY}` }
          });
          const finalJson = await finalRes.json();
          videoUrl = findVideoUrl(finalJson);
        }
        
        if(!videoUrl) {
          console.error("=============== GÓI DỮ LIỆU FAL.AI TRẢ VỀ ===============");
          console.error(JSON.stringify(pollJson, null, 2));
          throw new Error("Chính thức bó tay: Server báo COMPLETED nhưng không rặn ra Video Link nào trong gói dữ liệu!");
        }

        console.log(`[+] TIN VUI! Đã vắt xong luồng Video MP4 siêu thực: ${videoUrl}`);
      } else if (pollJson.status === 'FAILED') {
        throw new Error("Quá trình kết xuất Fal.ai thất bại: " + JSON.stringify(pollJson.error));
      }
    }
    // 3. Tự động múc Video đó về máy cục bộ (Nhận diện thư mục Brand qua process.cwd())
    const isBrandDir = fs.existsSync(path.join(process.cwd(), 'brand-identity.json'));
    const videoDir = isBrandDir 
      ? path.join(process.cwd(), 'assets/videos') 
      : path.join(__dirname, '../../assets/videos');
      
    if (!fs.existsSync(videoDir)) fs.mkdirSync(videoDir, { recursive: true });

	const safeName = "fal_" + new Date().getTime() + ".mp4";
    const dest = path.join(videoDir, safeName);
    
    console.log(`[+] Đang tải và kéo tệp MP4 về vị trí: ${dest}`);
	
	const file = fs.createWriteStream(dest);
	https.get(videoUrl, function(response) {
	  response.pipe(file);
	  file.on('finish', function() {
		file.close(); 
		console.log(`[✅] HOÀN THÀNH: Bạn hãy duyệt tệp tại: assets/videos/${safeName}`);
	  });
	}).on('error', function(err) {
	  if (fs.existsSync(dest)) fs.unlinkSync(dest);
	  console.log(`Lỗi kéo File MP4: ${err.message}`);
	});

  } catch (error) {
    console.error(`[X] TRỤC TRẶC KẾT XUẤT: ${error.message}`);
    process.exit(1);
  }
}

generateVideo(prompt);
