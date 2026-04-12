import React from 'react';
import { AbsoluteFill, Img, staticFile, useVideoConfig, useCurrentFrame, interpolate, spring, Sequence } from 'remotion';

export const TiktokAd: React.FC = () => {
	const { fps } = useVideoConfig();
	const frame = useCurrentFrame();

	// Scene 1: Bean Texture (Frames 0 to 150)
	const scale1 = interpolate(frame, [0, 150], [1, 1.15], { extrapolateRight: 'clamp' });
	const opacity1 = interpolate(frame, [130, 150], [1, 0], { extrapolateRight: 'clamp' });
	
	// Text entry spring for Scene 1
	const text1Y = spring({ frame: frame - 15, fps, config: { damping: 12 } });
	const textYOffset = interpolate(text1Y, [0, 1], [100, 0]);

	// Scene 2: Crema (Frames 130 to 300) - 20 frame crossfade
	const scale2 = interpolate(frame, [130, 300], [1.15, 1], { extrapolateRight: 'clamp' });
	const opacity2 = interpolate(frame, [130, 150], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
	
	const text2Y = spring({ frame: frame - 160, fps, config: { damping: 12 } });
	const text2YOffset = interpolate(text2Y, [0, 1], [100, 0]);

	return (
		<AbsoluteFill style={{ backgroundColor: '#1c1917' /* dark warm gray */ }}>
			{/* SCENE 1 */}
			<Sequence from={0} durationInFrames={150}>
				<AbsoluteFill style={{ opacity: opacity1 }}>
					<Img 
						src={staticFile('coffee_macro_texture.png')} 
						style={{ width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${scale1})` }} 
					/>
					<AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
						<div style={{
							fontSize: '80px', fontWeight: 'bold', color: 'white',
							backgroundColor: 'rgba(0, 0, 0, 0.7)', padding: '30px 50px',
							textAlign: 'center', transform: `translateY(${textYOffset}px)`, opacity: text1Y,
							borderRadius: '20px'
						}}>
							CHUẨN MỘC<br/>100% NGUYÊN BẢN
						</div>
					</AbsoluteFill>
				</AbsoluteFill>
			</Sequence>

			{/* SCENE 2 */}
			<Sequence from={130} durationInFrames={170}>
				<AbsoluteFill style={{ opacity: opacity2 }}>
					<Img 
						src={staticFile('coffee_espresso_crema.png')} 
						style={{ width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${scale2})` }} 
					/>
					<AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
						<div style={{
							fontSize: '90px', fontWeight: '900', color: '#facc15',
							textShadow: '6px 6px 0px rgba(0,0,0,0.8)', textAlign: 'center',
							transform: `translateY(${text2YOffset}px)`, opacity: text2Y
						}}>
							SÀI GÒN BOLD<br/>LỚP CREMA<br/>DÀY KẸO!
						</div>
						<div style={{
							fontSize: '60px', fontWeight: 'bold', color: 'white', marginTop: '60px',
							backgroundColor: '#b91c1c', padding: '20px 40px',
							transform: `translateY(${text2YOffset}px)`, opacity: text2Y,
							borderRadius: '20px', border: '5px solid white'
						}}>
							🔥 1KG CHỈ TỪ 160K 🔥
						</div>
					</AbsoluteFill>
				</AbsoluteFill>
			</Sequence>
		</AbsoluteFill>
	);
};
