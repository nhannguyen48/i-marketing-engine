import subprocess
import os

def finalize_professional(videos, output_path):
    print(f"Finalizing Professional Distribution TVC: {output_path}...")
    
    # Paths
    voice_path = 'brands/nhan-tam/assets/audio/gcp-samples/final-distribution-tvc-vo.mp3'
    music_path = 'brands/nhan-tam/assets/audio/musicgen/tvc-music-corporate-dist.wav'
    mixed_audio = 'brands/nhan-tam/assets/audio/mix-corporate-final.mp3'
    
    # 1. Trộn âm thanh (Professional Ducking)
    print("Mixing Corporate Audio...")
    mix_cmd = [
        'ffmpeg', '-y',
        '-i', music_path,
        '-i', voice_path,
        '-filter_complex', '[1:a]asplit[v1][v2];[0:a][v1]sidechaincompress=threshold=0.1:ratio=10:attack=15:release=400[m];[m][v2]amix=inputs=2:duration=first[a]',
        '-map', '[a]',
        mixed_audio
    ]
    subprocess.run(mix_cmd, check=True)

    # 2. Xây dựng Filter Video (Professional Pace - 3.5s per cut)
    # 55s / 3.5s = ~16 segments
    segment_duration = 3.5
    filter_complex = ""
    for i in range(len(videos)):
        # Cắt mỗi clip 3.5 giây, Scale 1080x1920
        start_time = 0
        filter_complex += f"[{i}:v]scale=1080:1920,setsar=1:1,trim={start_time}:{start_time + segment_duration},setpts=PTS-STARTPTS[v{i}];"
    
    concat_inputs = "".join([f"[v{i}]" for i in range(len(videos))])
    filter_complex += f"{concat_inputs}concat=n={len(videos)}:v=1:a=0,format=yuv420p[v]"
    
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
        '-preset', 'medium',
        '-crf', '18',
        '-c:a', 'aac',
        '-shortest',
        output_path
    ])
    
    subprocess.run(final_cmd, check=True)
    print(f"SUCCESS: Final Professional TVC saved to {output_path}")

if __name__ == "__main__":
    base_dir = 'brands/nhan-tam/assets/videos'
    # Tuyển chọn 16 phân cảnh (3.5s x 16 = 56s, vừa khít VO 55s)
    # Ưu tiên: Cận cảnh hạt, Crema, Bao bì, Xưởng logistics
    video_files = [
        f'{base_dir}/canh-4.mp4.mp4', # Crema flow
        f'{base_dir}/3zzKEqLbPrOGtXl0Oa4S0_dfa30ec164e6432c8e82b9dfeba63532.mp4', # Macro bean
        f'{base_dir}/canh-5.mp4.mp4', # Soft foam
        f'{base_dir}/veo3_1775783377780.mp4_15572186536335623749_sample_0.mp4', # Coffee cart context
        f'{base_dir}/canh-1.mp4.mp4', # Raw beans (selection)
        f'{base_dir}/canh-2.mp4.mp4', # Roasted beans
        f'{base_dir}/canh-6.mp4.mp4', # Distribution center context
        f'{base_dir}/n6i5u_diEVdLRloyKZNRy_a1a543b9a0974a25b41fc85b91609851.mp4', # Close up pack
        f'{base_dir}/canh-7.mp4.mp4', # Warehouse door/Logistics
        f'{base_dir}/veo3_1775795600556.mp4_2416148897620804522_sample_0.mp4', # Final product shot
        # Repeat some high quality ones with different offsets or just reuse
        f'{base_dir}/canh-3.mp4.mp4', # Mẻ rang crema
        f'{base_dir}/canh-4.mp4.mp4', # Reuse crema
        f'{base_dir}/canh-5.mp4.mp4', # Reuse foam
        f'{base_dir}/canh-1.mp4.mp4', # Reuse selection
        f'{base_dir}/canh-6.mp4.mp4', # Reuse warehouse
        f'{base_dir}/canh-7.mp4.mp4'  # Final outro clip
    ]
    output = f'{base_dir}/TVC-Distribution-Final-PRO.mp4'
    
    finalize_professional(video_files, output)
