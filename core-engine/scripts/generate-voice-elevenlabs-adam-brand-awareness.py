# -*- coding: utf-8 -*-
"""
generate-voice-elevenlabs-adam-brand-awareness.py
Generate giong Adam truc tiep tu ElevenLabs API (khong qua fal.ai).
Free tier: 10,000 chars/thang. Script nay dung ~500 chars = ~20 lan/thang mien phi.
Voice: Adam (pNInz6obpgDQGcFmaJgB) - Dominant, Firm
Output: brands/nhan-tam/assets/audio/voice-brand-awareness-adam.mp3
"""

import os
import sys
import requests

VOICE_ID = 'CpdMrVB2hbMbE9BXANMP'  # Clone Voice Nhan - giong Viet ban dia

# Doc API key tu .env
def load_env():
    env_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../.env'))
    data = {}
    with open(env_path, encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            if '=' in line and not line.startswith('#'):
                k, v = line.split('=', 1)
                data[k.strip()] = v.strip()
    return data

env = load_env()
API_KEY = env.get('ELEVENLABS_API_KEY', '')
if not API_KEY:
    print('[X] Khong tim thay ELEVENLABS_API_KEY trong .env')
    sys.exit(1)

VOICEOVER_TEXT = (
    "Sài Gòn không ngủ. Sài Gòn chạy bằng cà phê. "
    "Mỗi buổi sáng, hàng nghìn ly cà phê được pha ra, "
    "từ những xe đẩy góc phố, những kiosk nhỏ, những quán cóc vỉa hè. "
    "Đằng sau mỗi ly cà phê đó, là một người khởi nghiệp với giấc mơ riêng của họ. "
    "Họ không cần lời hứa hẹn. Họ cần một đối tác thực sự. "
    "Cà Phê Nhân Tâm. Robusta đậm đà. Arabica thanh thơm. Culi mạnh mẽ. "
    "Rang theo từng lô, chuẩn theo từng quán. "
    "Giá thẳng từ xưởng. Giao nội đô 24 giờ. Mix và Match theo công thức riêng của quán bạn. "
    "Vì khi quán bạn lớn, chúng tôi cũng lớn theo. "
    "Cà Phê Nhân Tâm. Cùng giá xưởng, cùng lớn."
)

OUTPUT_PATH = os.path.abspath(os.path.join(
    os.path.dirname(__file__),
    '../../brands/nhan-tam/assets/audio/voice-brand-awareness-viet.mp3'
))

def main():
    print('[+] ElevenLabs Adam | chars: ' + str(len(VOICEOVER_TEXT)))

    resp = requests.post(
        f'https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}',
        headers={
            'xi-api-key': API_KEY,
            'Content-Type': 'application/json',
        },
        json={
            'text': VOICEOVER_TEXT,
            'model_id': 'eleven_turbo_v2_5',  # Model moi nhat, nhan dang tieng Viet tot hon
            'language_code': 'vi',            # Bat buoc khai bao ngon ngu Viet Nam
            'voice_settings': {
                'stability': 0.65,            # On dinh phat am dau tieng Viet
                'similarity_boost': 0.80,
                'use_speaker_boost': True,
            }
        }
    )

    if resp.status_code != 200:
        print('[X] Loi ' + str(resp.status_code) + ': ' + resp.text)
        sys.exit(1)

    with open(OUTPUT_PATH, 'wb') as f:
        f.write(resp.content)

    size_kb = len(resp.content) // 1024
    print('[OK] Da luu (' + str(size_kb) + ' KB): ' + OUTPUT_PATH)
    print('[!] Con lai: kiem tra tai elevenlabs.io/app')

if __name__ == '__main__':
    main()
