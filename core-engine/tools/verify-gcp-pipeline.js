#!/usr/bin/env node
const path = require('path');
const { GoogleAuth } = require('google-auth-library');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const PROJECT_ID = process.env.GCP_PROJECT_ID;
const REGION = process.env.GCP_REGION || 'us-central1';
const KEY_PATH = process.env.GOOGLE_APPLICATION_CREDENTIALS;
const BUCKET = process.env.GCS_BUCKET;

const auth = new GoogleAuth({
  keyFile: path.resolve(process.cwd(), KEY_PATH),
  scopes: 'https://www.googleapis.com/auth/cloud-platform',
});

async function verify() {
  console.log(`[🚀] BẮT ĐẦU KIỂM CHỨNG SIÊU RẺ (Gemini 1.5 Flash - $0.0000x)...`);
  
  try {
    const client = await auth.getClient();
    const authHeaders = await client.getRequestHeaders();

    // Dùng Gemini 1.5 Flash - Hầu như miễn phí và luôn có sẵn
    const endpoint = `https://${REGION}-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${REGION}/publishers/google/models/gemini-1.5-flash-001:streamGenerateContent`;
    
    const payload = {
      contents: [{ role: "user", parts: [{ text: "Write a 1-sentence slogan for Nhan Tam Coffee." }] }]
    };

    console.log(`[+] Đang gửi lệnh tới Gemini 1.5 Flash...`);
    const response = await client.request({
      url: endpoint,
      method: 'POST',
      data: payload,
      headers: { ...authHeaders }
    });

    console.log(`[+] Gemini đã phản hồi thành công.`);

    // Đẩy thông báo thành công vào GCS Bucket của Sếp
    const fileName = "verify_pipeline_ok.txt";
    const report = `Hệ thống Google Cloud của Sếp đã thông suốt 100%!\nThời gian: ${new Date().toLocaleString()}\nDự án: ${PROJECT_ID}\nKho: ${BUCKET}`;
    
    console.log(`[+] Đang đẩy báo cáo vào Kho gs://${BUCKET}/${fileName}...`);
    
    await client.request({
      url: `https://storage.googleapis.com/upload/storage/v1/b/${BUCKET}/o?uploadType=media&name=${fileName}`,
      method: 'POST',
      body: report,
      headers: { 
        ...authHeaders,
        'Content-Type': 'text/plain'
      }
    });

    console.log(`[✅] KIỂM CHỨNG THÀNH CÔNG!`);
    console.log(`[!] Sếp vào kho thấy file 'verify_pipeline_ok.txt' là chúng ta đã thắng!`);

  } catch (err) {
    console.error(`[X] LỖI KIỂM CHỨNG: ${err.message}`);
    if (err.response && err.response.data) {
        console.error(`[Détails]: ${JSON.stringify(err.response.data)}`);
    }
    process.exit(1);
  }
}

verify();
