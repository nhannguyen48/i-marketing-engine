import os
from elevenlabs.client import ElevenLabs
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("ELEVENLABS_API_KEY")
client = ElevenLabs(api_key=api_key)

def list_voices():
    print("Fetching available ElevenLabs voices...")
    response = client.voices.get_all()
    
    print("\n--- AVAILABLE VOICES ---")
    for voice in response.voices:
        # Kiểm tra xem giọng này có nhãn Vietnamese hoặc hỗ trợ không
        # Lưu ý: Một số giọng Multilingual không ghi trực tiếp ngôn ngữ trong labels
        print(f"Name: {voice.name} | ID: {voice.voice_id} | Category: {voice.category}")

if __name__ == "__main__":
    list_voices()
