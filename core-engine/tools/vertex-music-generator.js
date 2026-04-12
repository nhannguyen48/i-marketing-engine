#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { GoogleAuth } = require('google-auth-library');

// Load .env manual
const envPath = path.join(__dirname, '../../.env');
const env = fs.readFileSync(envPath, 'utf8');
const envMap = {};
env.split('\n').forEach(line => {
  const [key, val] = line.split('=');
  if (key && val) envMap[key.trim()] = val.trim();
});

const PROJECT_ID = envMap.GCP_PROJECT_ID;
const REGION = envMap.GCP_REGION || 'us-central1';
const KEY_PATH = envMap.GOOGLE_APPLICATION_CREDENTIALS;

const auth = new GoogleAuth({
  keyFile: path.resolve(process.cwd(), KEY_PATH),
  scopes: 'https://www.googleapis.com/auth/cloud-platform',
});

async function generateMusic(prompt, duration = 30) {
  console.log(`[🎶] Google Lyria Music Generator — Khởi động...`);
  console.log(`[+] Prompt: ${prompt}`);
  console.log(`[+] Dự án: ${PROJECT_ID} (${REGION})`);

  try {
    const client = await auth.getClient();
    const authHeaders = await client.getRequestHeaders();

    // Lyria 3 Pro Preview - Bản Elite nhất 2026
    const endpoint = `https://${REGION}-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${REGION}/publishers/google/models/lyria-3-pro-preview:predict`;
    
    const payload = {
      instances: [{
        prompt: prompt,
        negative_prompt: "vocals, distorted audio, low quality, noise"
      }],
      parameters: {
        durationSeconds: duration,
        sampleCount: 1
      }
    };

    const response = await client.request({
      url: endpoint,
      method: 'POST',
      data: payload,
      headers: { ...authHeaders }
    });

    if (!response.data.predictions || response.data.predictions.length === 0) {
      throw new Error("Không nhận được kết quả từ Lyria.");
    }

    const audioContent = response.data.predictions[0].audioContent;
    const buffer = Buffer.from(audioContent, 'base64');
    
    // Lưu vào assets/audio/lyria
    const outputDir = path.join(process.cwd(), 'assets/audio/lyria');
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
    
    const fileName = `lyria_${Date.now()}.wav`;
    const outputPath = path.join(outputDir, fileName);
    fs.writeFileSync(outputPath, buffer);

    console.log(`[✅] NHẠC LYRIA ĐÃ SẴN SÀNG: ${outputPath}`);
    return outputPath;

  } catch (err) {
    console.error(`[X] LỖI LYRIA: ${err.message}`);
    if (err.response && err.response.data) {
        console.error(`[Détails]: ${JSON.stringify(err.response.data)}`);
    }
  }
}

if (require.main === module) {
  const args = process.argv.slice(2);
  const userPrompt = args.join(' ') || "Lofi acoustic coffee shop vibe, morning sun, acoustic guitar";
  generateMusic(userPrompt);
}
