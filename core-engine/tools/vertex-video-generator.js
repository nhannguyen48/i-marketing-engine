#!/usr/bin/env node
/**
 * vertex-video-generator.js
 * Sinh video AI qua Google Cloud Vertex AI (Veo 3).
 * Tự động detect brand từ CWD, lưu video về assets/videos/.
 *
 * Usage:
 *   node core-engine/tools/vertex-video-generator.js [prompt]
 *   node core-engine/tools/vertex-video-generator.js "cảnh quán cà phê sáng sớm"
 *   node core-engine/tools/vertex-video-generator.js --ratio=16:9 "..."
 */
const path = require('path');
const fs = require('fs');
const https = require('https');
const { GoogleAuth } = require('google-auth-library');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const PROJECT_ID = process.env.GCP_PROJECT_ID;
const REGION     = process.env.GCP_REGION || 'us-central1';
const KEY_PATH   = process.env.GOOGLE_APPLICATION_CREDENTIALS;
const BUCKET     = process.env.GCS_BUCKET;

// --- Kiểm tra env ---
const missing = ['GCP_PROJECT_ID', 'GOOGLE_APPLICATION_CREDENTIALS', 'GCS_BUCKET'].filter(k => !process.env[k]);
if (missing.length) {
  console.error(`[X] Thiếu biến môi trường: ${missing.join(', ')}`);
  process.exit(1);
}

// --- Parse CLI args ---
const args = process.argv.slice(2);
let aspectRatio = '9:16'; // default dọc cho TikTok/Reels
const promptParts = [];

for (const arg of args) {
  if (arg.startsWith('--ratio=')) aspectRatio = arg.split('=')[1];
  else promptParts.push(arg);
}

const DEFAULT_PROMPT = 'Cinematic macro close-up of dark roasted Vietnamese coffee beans cascading into a kraft paper bag, warm amber light from the side, authentic roastery atmosphere, photorealistic, 8K';
const prompt = promptParts.join(' ') || DEFAULT_PROMPT;

// --- Tự động detect thư mục output theo brand ---
const isBrandDir = fs.existsSync(path.join(process.cwd(), 'brand-identity.json'));
const outputDir  = isBrandDir
  ? path.join(process.cwd(), 'assets/videos')
  : path.join(__dirname, '../../brands/nhan-tam/assets/videos');

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

const auth = new GoogleAuth({
  keyFile: path.resolve(process.cwd(), KEY_PATH),
  scopes: 'https://www.googleapis.com/auth/cloud-platform',
});

// --- Hàm tải file từ GCS về local ---
async function downloadFromGcs(client, bucket, gcsFileName, destPath) {
  const tokenResult = await client.getAccessToken();
  const downloadUrl = `https://storage.googleapis.com/download/storage/v1/b/${bucket}/o/${encodeURIComponent(gcsFileName)}?alt=media`;

  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath);
    https.get(downloadUrl, { headers: { Authorization: `Bearer ${tokenResult.token}` } }, res => {
      if (res.statusCode !== 200) {
        reject(new Error(`GCS download HTTP ${res.statusCode} for ${gcsFileName}`));
        return;
      }
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
    }).on('error', reject);
  });
}

async function generate() {
  console.log(`[🚀] Veo 3 Video Generator — Khởi động...`);
  console.log(`[+] Prompt  : "${prompt.substring(0, 80)}${prompt.length > 80 ? '...' : ''}"`);
  console.log(`[+] Ratio   : ${aspectRatio}`);
  console.log(`[+] Project : ${PROJECT_ID} | Region: ${REGION}`);
  console.log(`[+] Bucket  : gs://${BUCKET}`);

  try {
    const client   = await auth.getClient();
    const authHdrs = await client.getRequestHeaders();

    const endpoint = `https://${REGION}-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${REGION}/publishers/google/models/veo-3.1-generate-001:predictLongRunning`;

    const fileName = `veo3_${Date.now()}.mp4`;
    const gcsUri   = `gs://${BUCKET}/${fileName}`;

    const payload = {
      instances: [{ prompt }],
      parameters: {
        aspectRatio,
        sampleCount: 1,
        storageUri: gcsUri,
      },
    };

    console.log(`\n[+] Gửi lệnh tới Veo 3...`);
    const response = await client.request({
      url: endpoint,
      method: 'POST',
      data: payload,
      headers: { ...authHdrs },
    });

    const operationName = response.data.name;
    // Extract operation ID từ full resource name
    // Format: projects/.../publishers/google/models/.../operations/{id}
    const operationId = operationName.split('/operations/')[1];

    console.log(`[+] Khởi tạo thành công!`);
    console.log(`[+] Operation ID: ${operationId}`);
    console.log(`[!] Đang kết xuất video — thường mất 3-8 phút...`);

    // Veo 3 dùng fetchPredictOperation (POST) thay vì GET LRO chuẩn
    const fetchOpUrl = `https://${REGION}-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${REGION}/publishers/google/models/veo-3.1-generate-001:fetchPredictOperation`;
    let finished = false;

    while (!finished) {
      await new Promise(r => setTimeout(r, 20000)); // đợi 20s mỗi lần
      process.stdout.write('.');

      // fetchPredictOperation = POST với operationName trong body
      const tokenResult = await client.getAccessToken();
      const pollRes = await fetch(fetchOpUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${tokenResult.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ operationName }),
      });
      const opData = await pollRes.json();

      if (opData.error) {
        throw new Error(`Veo 3 Error: ${JSON.stringify(opData.error)}`);
      }

      // Log trạng thái mỗi lần poll
      if (!opData.done) {
        const state = opData.metadata?.state || opData.metadata?.createTime || 'processing...';
        console.log(`\n[-] Status: ${state}`);
      }

      if (opData.done) {
        console.log('\n[+] Operation hoàn thành! Đang tải video về...');
        // Veo 3 trả về video URL trong response.videos hoặc lưu vào GCS
        const videos = opData.response?.videos || opData.response?.generatedSamples;
        if (videos && videos.length > 0) {
          const videoUri = videos[0].gcsUri || videos[0].video?.uri || gcsUri;
          // Extract object path after "gs://{bucket}/" — may be nested (e.g. prefix/sample_0.mp4)
          const gcsObjectPath = videoUri.startsWith(`gs://${BUCKET}/`)
            ? videoUri.slice(`gs://${BUCKET}/`.length)
            : videoUri.split('/').pop();
          const localFileName = gcsObjectPath.replace(/\//g, '_');
          const localPath = path.join(outputDir, localFileName || fileName);
          await downloadFromGcs(client, BUCKET, gcsObjectPath, localPath);
          console.log(`[✅] VIDEO HOÀN TẤT!`);
          console.log(`[✅] GCS  : ${videoUri}`);
          console.log(`[✅] Local: ${localPath}`);
        } else {
          // Fallback: tải theo fileName đã đặt ban đầu
          const localPath = path.join(outputDir, fileName);
          await downloadFromGcs(client, BUCKET, fileName, localPath);
          console.log(`[✅] VIDEO HOÀN TẤT!`);
          console.log(`[✅] GCS  : ${gcsUri}`);
          console.log(`[✅] Local: ${localPath}`);
        }
        finished = true;
      }
    }

  } catch (err) {
    console.error(`\n[X] LỖI: ${err.message}`);
    if (err.response?.data) {
      console.error(`[Details]: ${JSON.stringify(err.response.data, null, 2)}`);
    }
    process.exit(1);
  }
}

generate();
