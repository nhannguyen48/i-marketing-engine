import os
import json
import asyncio
import edge_tts

async def generate_voice(text, voice, output_path):
    print(f"Generating voice: {voice}...")
    communicate = edge_tts.Communicate(text, voice, rate="+0%", pitch="+0Hz")
    await communicate.save(output_path)
    print(f"SUCCESS: Saved voice to {output_path}")

def main():
    # Load brand identity
    with open('brands/nhan-tam/brand-identity.json', 'r', encoding='utf-8') as f:
        brand = json.load(f)
    
    script = brand['tvc_script']
    voice = brand.get('vo_voice_id', 'vi-VN-HoaiMyNeural')
    output_dir = 'brands/nhan-tam/assets/audio'
    os.makedirs(output_dir, exist_ok=True)
    
    voice_path = os.path.join(output_dir, 'tvc-voice-60s.mp3')
    
    asyncio.run(generate_voice(script, voice, voice_path))

if __name__ == "__main__":
    main()
