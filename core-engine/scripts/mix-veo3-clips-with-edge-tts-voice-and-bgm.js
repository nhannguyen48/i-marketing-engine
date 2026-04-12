/**
 * mix-veo3-clips-with-edge-tts-voice-and-bgm.js
 * Concat 8 VEO3 clips + mix voice + BGM thanh TVC cuoi.
 * Usage: node script.js [voice-file.mp3] [output-name.mp4]
 * Default voice: voice-brand-awareness-edge.mp3
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const BRAND_DIR = path.resolve(__dirname, '../../brands/nhan-tam');
const VIDEO_DIR = path.join(BRAND_DIR, 'assets', 'videos');
const AUDIO_DIR = path.join(BRAND_DIR, 'assets', 'audio');

// CLI args: node script.js [voice-filename] [output-filename]
const voiceArg  = process.argv[2] || 'voice-brand-awareness-edge.mp3';
const outputArg = process.argv[3] || 'TVC-Nhan-Tam-Brand-Awareness-EdgeTTS.mp4';

const VOICE_FILE  = path.isAbsolute(voiceArg) ? voiceArg : path.join(AUDIO_DIR, voiceArg);
const BGM_FILE    = path.join(AUDIO_DIR, 'bgm.mp3');
const CONCAT_TXT  = path.join(VIDEO_DIR, 'concat-veo3-mix.txt');
const MERGED_RAW  = path.join(VIDEO_DIR, 'veo3-mix-merged-raw.mp4');
const OUTPUT_FILE = path.join(VIDEO_DIR, outputArg);

const VEO3_CLIPS = [
  'veo3_1775783003911.mp4_6393471876508438806_sample_0.mp4',
  'veo3_1775783377780.mp4_15572186536335623749_sample_0.mp4',
  'veo3_1775783713443.mp4_12853038217860244296_sample_0.mp4',
  'veo3_1775783804744.mp4_10903279429860700080_sample_0.mp4',
  'veo3_1775783895416.mp4_4181023272064488110_sample_0.mp4',
  'veo3_1775783985766.mp4_2895853876024475613_sample_0.mp4',
  'veo3_1775784076069.mp4_11455965962604747847_sample_0.mp4',
  'veo3_1775795600556.mp4_2416148897620804522_sample_0.mp4',
];

function run(cmd) {
  execSync(cmd, { stdio: 'pipe' });
}

// Kiem tra file prerequisite
[VOICE_FILE, BGM_FILE].forEach(f => {
  if (!fs.existsSync(f)) throw new Error('Thieu file: ' + f);
});

// Buoc 1: Tao concat list va gop 8 clips
console.log('[1/2] Gop 8 VEO3 clips...');
const lines = VEO3_CLIPS.map(f => `file '${path.join(VIDEO_DIR, f).replace(/\\/g, '/')}'`).join('\n');
fs.writeFileSync(CONCAT_TXT, lines);
run(`ffmpeg -f concat -safe 0 -i "${CONCAT_TXT}" -c copy "${MERGED_RAW}" -y`);
console.log('  OK: ' + MERGED_RAW);

// Buoc 2: Mix video + Edge TTS voice (100%) + BGM (12%)
console.log('[2/2] Mix video + voice + BGM...');
run([
  'ffmpeg',
  `-i "${MERGED_RAW}"`,
  `-i "${VOICE_FILE}"`,
  `-stream_loop -1 -i "${BGM_FILE}"`,
  `-filter_complex "[2:a]volume=0.12[bg];[1:a][bg]amix=inputs=2:duration=first[a]"`,
  `-map 0:v -map "[a]"`,
  `-c:v copy -c:a aac -b:a 192k`,
  `-shortest`,
  `"${OUTPUT_FILE}" -y`,
].join(' '));

// Don dep file tam
[CONCAT_TXT, MERGED_RAW].forEach(f => { try { fs.unlinkSync(f); } catch {} });

console.log('\n[OK] TVC hoan chinh (mien phi): ' + OUTPUT_FILE);
