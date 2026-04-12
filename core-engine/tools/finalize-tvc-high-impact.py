import subprocess
import os

def finalize_high_impact(videos, audio_path, output_path):
    print(f"Finalizing High-Impact TVC: {output_path}...")
    
    # 1. Trộn Voice và BGM trước (Mix with sidechain)
    voice_path = 'brands/nhan-tam/assets/audio/gcp-samples/high-impact-gcp-premium.mp3'
    music_path = 'brands/nhan-tam/assets/audio/musicgen/tvc-music-adam-45s.wav'
    mixed_audio = 'brands/nhan-tam/assets/audio/mix-adam-high-impact.mp3'
    
    print("Mixing Premium Audio...")
    # Sidechain: Music decreases by 20dB when voice is active
    mix_cmd = [
        'ffmpeg', '-y',
        '-i', music_path,
        '-i', voice_path,
        '-filter_complex', '[1:a]asplit[v1][v2];[0:a][v1]sidechaincompress=threshold=0.1:ratio=20:attack=10:release=300[m];[m][v2]amix=inputs=2:duration=first[a]',
        '-map', '[a]',
        mixed_audio
    ]
    subprocess.run(mix_cmd, check=True)

    # 2. Xây dựng Filter để cắt ghép video nhanh (Cuts 2s)
    # Chúng ta sẽ lấy 2 giây đầu của mỗi clip
    filter_complex = ""
    for i in range(len(videos)):
        filter_complex += f"[{i}:v]scale=1080:1920,setsar=1:1,trim=0:2,setpts=PTS-STARTPTS[v{i}];"
    
    concat_inputs = "".join([f"[v{i}]" for i in range(len(videos))])
    filter_complex += f"{concat_inputs}concat=n={len(videos)}:v=1:a=0[v]"
    
    final_cmd = [
        'ffmpeg', '-y'
    ]
    for v in videos:
        final_cmd.extend(['-i', v])
    
    final_cmd.extend([
        '-i', mixed_audio,
        '-filter_complex', filter_complex,
        '-map', '[v]',
        '-map', f'{len(videos)}:a',
        '-c:v', 'libx264',
        '-preset', 'fast',
        '-crf', '20',
        '-c:a', 'aac',
        '-shortest',
        output_path
    ])
    
    subprocess.run(final_cmd, check=True)
    print(f"SUCCESS: High-Impact TVC saved to {output_path}")

if __name__ == "__main__":
    base_dir = 'brands/nhan-tam/assets/videos'
    video_files = [
        f'{base_dir}/canh-4.mp4.mp4',
        f'{base_dir}/3zzKEqLbPrOGtXl0Oa4S0_dfa30ec164e6432c8e82b9dfeba63532.mp4',
        f'{base_dir}/canh-1.mp4.mp4',
        f'{base_dir}/canh-2.mp4.mp4',
        f'{base_dir}/canh-3.mp4.mp4',
        f'{base_dir}/canh-5.mp4.mp4',
        f'{base_dir}/n6i5u_diEVdLRloyKZNRy_a1a543b9a0974a25b41fc85b91609851.mp4',
        f'{base_dir}/canh-6.mp4.mp4',
        f'{base_dir}/canh-7.mp4.mp4',
        f'{base_dir}/veo3_1775783377780.mp4_15572186536335623749_sample_0.mp4',
        f'{base_dir}/veo3_1775795600556.mp4_2416148897620804522_sample_0.mp4'
    ]
    output = f'{base_dir}/TVC-High-Impact-Adam-Final.mp4'
    
    finalize_high_impact(video_files, None, output)
