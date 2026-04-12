import subprocess
import os

def mix_audio(voice_path, music_path, output_path):
    print(f"Mixing Audio: Voice({voice_path}) + Music({music_path})...")
    # FFmpeg command for ducking: 
    # sidechain compressor: music is silenced when voice is active
    # asplit for the voice trigger
    cmd = [
        'ffmpeg', '-y',
        '-i', music_path,
        '-i', voice_path,
        '-filter_complex',
        '[1:a]asplit[v1][v2];' +
        '[0:a][v1]sidechaincompress=threshold=0.1:ratio=20:release=200:attack=15[m1];' +
        '[m1][v2]amix=inputs=2:duration=first[a]',
        '-map', '[a]',
        output_path
    ]
    
    subprocess.run(cmd, check=True)
    print(f"SUCCESS: Mixed audio saved to {output_path}")

if __name__ == "__main__":
    voice = 'brands/nhan-tam/assets/audio/gcp-samples/final-60s-voice-premium.mp3'
    music = 'brands/nhan-tam/assets/audio/tvc-music-60s.wav'
    output = 'brands/nhan-tam/assets/audio/final-tvc-audio-60s-PREMIUM.mp3'
    
    if os.path.exists(voice) and os.path.exists(music):
        mix_audio(voice, music, output)
    else:
        print("Waiting for audio files to be ready...")
