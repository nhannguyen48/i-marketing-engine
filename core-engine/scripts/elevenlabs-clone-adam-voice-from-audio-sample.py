# -*- coding: utf-8 -*-
"""
elevenlabs-clone-adam-voice-from-audio-sample.py
Upload audio mau -> tao Instant Voice Clone tren ElevenLabs.
Chay 1 lan duy nhat de tao clone, sau do dung voice ID de generate.
"""

import os
import sys
import json
import requests

# Doc API key tu .env
def load_env_key():
    env_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../.env'))
    with open(env_path, encoding='utf-8') as f:
        for line in f:
            if line.startswith('ELEVENLABS_API_KEY='):
                return line.strip().split('=', 1)[1]
    raise ValueError('ELEVENLABS_API_KEY not found in .env')

API_KEY = load_env_key()
HEADERS = {'xi-api-key': API_KEY}

# File audio mau de clone (giong Adam da generate)
SAMPLE_FILE = os.path.abspath(os.path.join(
    os.path.dirname(__file__),
    '../../brands/nhan-tam/assets/audio/voice-brand-awareness.mp3'
))

CLONE_NAME = 'Adam-CPNT'
CLONE_DESC = 'Giong Adam clone cho Ca Phe Nhan Tam TVC'

def create_voice_clone():
    print('[+] Dang upload audio mau va tao Instant Voice Clone...')
    print('    Sample: ' + SAMPLE_FILE)

    with open(SAMPLE_FILE, 'rb') as f:
        resp = requests.post(
            'https://api.elevenlabs.io/v1/voices/add',
            headers=HEADERS,
            data={
                'name': CLONE_NAME,
                'description': CLONE_DESC,
            },
            files={'files': (os.path.basename(SAMPLE_FILE), f, 'audio/mpeg')}
        )

    if resp.status_code != 200:
        print('[X] Loi: ' + resp.text)
        sys.exit(1)

    result = resp.json()
    voice_id = result.get('voice_id')
    print('[OK] Voice Clone tao thanh cong!')
    print('     Name: ' + CLONE_NAME)
    print('     Voice ID: ' + voice_id)
    print()
    print('[!] Luu Voice ID nay vao .env:')
    print('    ELEVENLABS_VOICE_ID_ADAM_CPNT=' + voice_id)

    # Tu dong luu vao .env
    env_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../.env'))
    with open(env_path, 'a', encoding='utf-8') as ef:
        ef.write('\nELEVENLABS_VOICE_ID_ADAM_CPNT=' + voice_id + '\n')
    print('[OK] Da luu vao .env tu dong.')

if __name__ == '__main__':
    create_voice_clone()
