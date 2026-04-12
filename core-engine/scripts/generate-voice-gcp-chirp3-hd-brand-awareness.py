# -*- coding: utf-8 -*-
"""
generate-voice-gcp-chirp3-hd-brand-awareness.py
Generate giong nam Viet Nam chat luong cao bang Google Cloud TTS Chirp3-HD.
Chi phi: ~$0.015 cho toan bo script (chua toi 1 cent).
Output: brands/nhan-tam/assets/audio/voice-brand-awareness-gcp.mp3

Cac giong nam Chirp3-HD co the thu:
  - vi-VN-Chirp3-HD-Alnilam   (trung tinh, ro rang)
  - vi-VN-Chirp3-HD-Charon    (tram, manh)
  - vi-VN-Chirp3-HD-Fenrir    (manh me, quyen luc)
  - vi-VN-Chirp3-HD-Iapetus   (am ap)
  - vi-VN-Chirp3-HD-Orus      (tre, nang dong)
  - vi-VN-Chirp3-HD-Schedar   (truong thanh, sang trong)
"""

import os
import sys
from google.cloud import texttospeech

# Credentials GCP
GCP_KEY = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../clever-grid-405215-5bc54c24d2b8.json'))
os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = GCP_KEY

# Chon giong nam — doi de thu cac giong khac nhau
VOICE_NAME = 'vi-VN-Chirp3-HD-Fenrir'  # Manh me, quyen luc — phu hop TVC

OUTPUT_PATH = os.path.abspath(os.path.join(
    os.path.dirname(__file__),
    '../../brands/nhan-tam/assets/audio/voice-brand-awareness-gcp.mp3'
))

# Kich ban voiceover — concept "Sai Gon Chay Bang Ca Phe"
VOICEOVER_TEXT = """\
Sài Gòn không ngủ. Sài Gòn chạy bằng cà phê.

Mỗi buổi sáng, hàng nghìn ly cà phê được pha ra, từ những xe đẩy góc phố, những kiosk nhỏ, những quán cóc vỉa hè.

Đằng sau mỗi ly cà phê đó, là một người khởi nghiệp với giấc mơ riêng của họ.

Họ không cần lời hứa hẹn. Họ cần một đối tác thực sự.

Cà Phê Nhân Tâm. Robusta đậm đà. Arabica thanh thơm. Culi mạnh mẽ. Rang theo từng lô, chuẩn theo từng quán.

Giá thẳng từ xưởng. Giao nội đô 24 giờ. Mix và Match theo công thức riêng của quán bạn.

Vì khi quán bạn lớn, chúng tôi cũng lớn theo.

Cà Phê Nhân Tâm. Cùng giá xưởng, cùng lớn.\
"""

def main():
    print('[+] Google Cloud TTS Chirp3-HD')
    print('[+] Voice: ' + VOICE_NAME)

    client = texttospeech.TextToSpeechClient()

    synthesis_input = texttospeech.SynthesisInput(text=VOICEOVER_TEXT)

    voice = texttospeech.VoiceSelectionParams(
        language_code='vi-VN',
        name=VOICE_NAME,
    )

    # Chirp3-HD khong ho tro speaking_rate — dung AudioConfig chuan
    audio_config = texttospeech.AudioConfig(
        audio_encoding=texttospeech.AudioEncoding.MP3,
        effects_profile_id=['large-home-entertainment-class-device'],  # Chuan chat cho loa
    )

    print('[+] Dang tong hop...')
    response = client.synthesize_speech(
        input=synthesis_input,
        voice=voice,
        audio_config=audio_config,
    )

    with open(OUTPUT_PATH, 'wb') as f:
        f.write(response.audio_content)

    size_kb = len(response.audio_content) // 1024
    print('[OK] Da luu (' + str(size_kb) + ' KB): ' + OUTPUT_PATH)

if __name__ == '__main__':
    main()
