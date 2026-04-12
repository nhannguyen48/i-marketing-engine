import os
from google.cloud import texttospeech

KEY_PATH = 'clever-grid-405215-5bc54c24d2b8.json'
os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = KEY_PATH

def list_voices():
    client = texttospeech.TextToSpeechClient()
    voices = client.list_voices(language_code="vi-VN")
    
    print("Available voices for vi-VN:")
    for voice in voices.voices:
        print(f"Name: {voice.name}, Gender: {voice.ssml_gender.name}, Language: {voice.language_codes}")

if __name__ == "__main__":
    list_voices()
