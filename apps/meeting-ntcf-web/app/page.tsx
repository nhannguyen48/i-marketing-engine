'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// NOTE: We are using a client component for the simulator and animations
export default function PlaybookPage() {
  // Simulator State
  const [price, setPrice] = useState(250000);
  const [raw, setRaw] = useState(150000);
  const [comm, setComm] = useState(7000);
  const [ads, setAds] = useState(10000000);
  const [opex, setOpex] = useState(53000000);
  const [cac, setCac] = useState(50000);

  // Derived Metrics
  const OTHER_VAR_COSTS = 21000;
  const BASE_ORGANIC_VOL = 1000;
  const adsVolume = ads / cac;
  const totalVolume = BASE_ORGANIC_VOL + adsVolume;
  const unitCost = raw + OTHER_VAR_COSTS + comm;
  const unitMargin = price - unitCost;
  const monthlyProfit = (totalVolume * unitMargin) - (opex + ads);
  const INITIAL_CAPITAL = 400000000;
  const bep = unitMargin > 0 ? Math.ceil((opex + ads) / unitMargin) : 0;
  
  const currentCash = INITIAL_CAPITAL + (monthlyProfit * 12);
  const roi = ((currentCash - INITIAL_CAPITAL) / INITIAL_CAPITAL) * 100;

  // UI Helper
  const formatVND = (num: number) => 
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(num);

  // Advice Logic
  const getAdvice = () => {
    if (unitMargin < 10000) return `"Cảnh báo: Biên lợi nhuận mỏng (chỉ ${formatVND(unitMargin)}/kg). Sếp đang rơi vào bẫy 'Cạnh tranh giá'. Ngay cả khi bán 10 tấn, dòng tiền cũng khó phục hồi."`;
    if (monthlyProfit < 0) return `"Dòng tiền đang âm. Với tốc độ đốt ${formatVND(Math.abs(monthlyProfit))}/tháng, chúng ta sẽ cạn vốn sau ${Math.abs(INITIAL_CAPITAL / monthlyProfit).toFixed(1)} tháng."`;
    if (cac > unitMargin) return `"Nghịch lý Quảng cáo: CAC (${formatVND(cac)}) cao hơn biên lợi nhuận (${formatVND(unitMargin)}). Bán càng nhiều từ quảng cáo càng lỗ vốn."`;
    if (totalVolume > 3000) return `"Mô hình siêu lợi nhuận! Sếp đang tạo ra ${formatVND(monthlyProfit)} tiền mặt mỗi tháng. Hãy mở rộng ngay!"`;
    return `"Trạng thái Tài chính ổn định. Lợi nhuận ròng đạt ${formatVND(monthlyProfit)}. Thương thấy đây là thời điểm vàng để thắt chặt quan hệ với các chủ quán sỉ."`;
  };

  return (
    <div className="min-h-screen bg-[#1B0D05] text-[#FDF8ED] font-sans selection:bg-[#E6B980] selection:text-[#1B0D05]">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Outfit:wght@600;700;800&display=swap');
        
        :root {
          --primary-brown: #1B0D05;
          --accent-gold: #E6B980;
          --accent-green: #2D5A27;
          --heart-red: #D62828;
          --burnt-orange: #C65C33;
          --text-light: #FDF8ED;
          --text-dim: rgba(253, 248, 237, 0.7);
          --glass: rgba(255, 255, 255, 0.05);
          --glass-border: rgba(255, 255, 255, 0.1);
          --shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
        }

        h1, h2, h3, h4 {
          font-family: 'Outfit', sans-serif;
          text-transform: uppercase;
          letter-spacing: 2px;
        }

        .glass-card {
          background: var(--glass);
          backdrop-filter: blur(10px);
          border: 1px solid var(--glass-border);
          box-shadow: var(--shadow);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .glass-card:hover {
          transform: translateY(-8px);
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(230, 185, 128, 0.3);
        }

        input[type="range"] {
          accent-color: var(--accent-gold);
        }
      `}</style>

      {/* Hero Section */}
      <header className="relative h-[80vh] min-h-[500px] flex items-center justify-center text-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[rgba(27,13,5,0.8)] to-[#1B0D05] z-10" />
          <Image 
            src="/hero_bg_premium.png" 
            alt="Premium Coffee Background" 
            fill 
            className="object-cover opacity-50"
            priority
          />
        </div>

        <div className="relative z-20 px-6 animate-in fade-in slide-in-from-top-8 duration-1000">
          <div className="mb-8 flex justify-center">
            <Image 
              src="/logos/official_logo_horizontal_transparent.png" 
              alt="Nhân Tâm Logo" 
              width={500} 
              height={150} 
              className="drop-shadow-[0_0_30px_rgba(230,185,128,0.4)] w-[280px] md:w-[500px]"
            />
          </div>
          <p className="tracking-[0.5em] font-light text-[0.8rem] md:text-xl text-[#E6B980] uppercase mb-10">
            Sincere • Insightful • Practical
          </p>
          <div className="mb-8 inline-block bg-[#C65C33] text-white px-8 py-3 rounded-xl font-extrabold shadow-2xl text-sm md:text-base tracking-widest">
            STRATEGIC PLAYBOOK 2026
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
             <Link href="/meeting" className="bg-[#2D5A27] hover:bg-[#3d7a35] text-white px-6 py-3 rounded-full font-bold transition-all transform hover:scale-105 shadow-xl flex items-center gap-2">
                <span>🧠 Vào Phòng Họp AI (Meeting Room)</span>
             </Link>
          </div>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-6 pb-24">
        
        {/* Signature Products */}
        <section className="mb-24">
          <h2 className="text-center mb-16 text-2xl md:text-4xl relative before:content-[''] before:block before:w-10 before:h-0.5 before:bg-[#E6B980] before:mx-auto before:mb-4 before:opacity-50">
            Dòng Sản Phẩm Chữ Ký (Signature Series)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-10 rounded-3xl relative overflow-hidden before:absolute before:top-0 before:left-0 before:w-full before:h-1 before:bg-[#E6B980] before:opacity-30">
              <span className="text-[0.7rem] text-[#E6B980] font-semibold tracking-widest mb-3 block uppercase">70% R : 20% C : 10% A</span>
              <h3 className="text-[#E6B980] text-xl mb-4">NHÂN TÂM - TÂM GIAO</h3>
              <p className="text-[#FDF8ED]/70 text-sm leading-relaxed mb-8">
                <strong>"Lời hứa của sự ổn định"</strong>. Vị đắng mộc mạc của Robusta nâng đỡ cho hương thơm dịu dàng của Arabica. Phù hợp cho những quán muốn xây dựng sự bền vững 365 ngày không đổi vị.
              </p>
              <div className="text-3xl font-extrabold mt-auto">230,000 <span className="text-sm font-light opacity-60 ml-1">VNĐ/kg</span></div>
            </div>

            <div className="glass-card p-10 rounded-3xl relative overflow-hidden before:absolute before:top-0 before:left-0 before:w-full before:h-1 before:bg-[#C65C33] before:opacity-50">
              <span className="text-[0.7rem] text-[#E6B980] font-semibold tracking-widest mb-3 block uppercase">80% Culi : 20% Robusta</span>
              <h3 className="text-[#E6B980] text-xl mb-4">SÀI GÒN BOLD (ĐẬM CHẤT)</h3>
              <p className="text-[#FDF8ED]/70 text-sm leading-relaxed mb-8">
                <strong>"Dòng máu nóng của Sài Gòn"</strong>. Sự tôn vinh cái chất "lì" của người khởi nghiệp phố thị. Vị đắng chạm vào là tỉnh thức. Dành riêng cho xe đẩy, kiosk takeaway cần gu mạnh.
              </p>
              <div className="text-3xl font-extrabold mt-auto text-[#E6B980]">250,000 <span className="text-sm font-light opacity-60 ml-1">VNĐ/kg</span></div>
            </div>

            <div className="glass-card p-10 rounded-3xl relative overflow-hidden before:absolute before:top-0 before:left-0 before:w-full before:h-1 before:bg-[#D62828] before:opacity-50">
              <span className="text-[0.7rem] text-[#E6B980] font-semibold tracking-widest mb-3 block uppercase">70% Moka : 30% Robusta</span>
              <h3 className="text-[#E6B980] text-xl mb-4">HƯƠNG VỊ TRI KỶ (PREMIUM)</h3>
              <p className="text-[#FDF8ED]/70 text-sm leading-relaxed mb-8">
                <strong>"Bản giao hưởng của sự tinh tế"</strong>. Sử dụng Moka Cầu Đất — Nữ hoàng của các loại cà phê Việt. Mỗi ngụm là một dải hương hoa rừng. Dành cho các quán Specialty.
              </p>
              <div className="text-3xl font-extrabold mt-auto">350,000 <span className="text-sm font-light opacity-60 ml-1">VNĐ/kg</span></div>
            </div>
          </div>
        </section>

        {/* Full Matrix */}
        <section className="mb-24">
          <h2 className="text-center mb-16 text-2xl md:text-4xl relative before:content-[''] before:block before:w-10 before:h-0.5 before:bg-[#E6B980] before:mx-auto before:mb-4 before:opacity-50">
            Ma Trận Mix & Match Toàn Diện
          </h2>
          <div className="glass-card rounded-3xl overflow-x-auto p-6 md:p-10">
            <table className="w-full border-separate border-spacing-y-2 min-w-[600px]">
              <thead>
                <tr className="text-[#E6B980] text-[0.75rem] uppercase tracking-widest">
                  <th className="text-left px-5 py-3 border-b border-white/10">Dòng sản phẩm</th>
                  <th className="text-left px-5 py-3 border-b border-white/10">Tỷ lệ (R:C:A)</th>
                  <th className="text-left px-5 py-3 border-b border-white/10">Gu vị</th>
                  <th className="text-left px-5 py-3 border-b border-white/10">Giá sỉ (Direct)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-white/5 transition-colors group">
                  <td className="px-5 py-4 bg-white/2 rounded-l-xl">Sài Gòn Mạnh (Pure)</td>
                  <td className="px-5 py-4 bg-white/2">100 : 0 : 0</td>
                  <td className="px-5 py-4 bg-white/2">Đắng gắt, mạnh mẽ</td>
                  <td className="px-5 py-4 bg-white/2 rounded-r-xl font-bold group-hover:text-[#E6B980]">210,000đ</td>
                </tr>
                <tr className="hover:bg-white/5 transition-colors group">
                  <td className="px-5 py-4 bg-white/2 rounded-l-xl">Sài Gòn Bold</td>
                  <td className="px-5 py-4 bg-white/2">80 : 20 : 0</td>
                  <td className="px-5 py-4 bg-white/2">Đậm đà, hậu vị sâu</td>
                  <td className="px-5 py-4 bg-white/2 rounded-r-xl font-bold group-hover:text-[#E6B980]">250,000đ</td>
                </tr>
                <tr className="hover:bg-white/5 transition-colors group">
                  <td className="px-5 py-4 bg-white/2 rounded-l-xl">Nhân Tâm Tâm Giao</td>
                  <td className="px-5 py-4 bg-white/2">70 : 20 : 10</td>
                  <td className="px-5 py-4 bg-white/2">Cân bằng, hương thanh</td>
                  <td className="px-5 py-4 bg-white/2 rounded-r-xl font-bold group-hover:text-[#E6B980]">230,000đ</td>
                </tr>
                <tr className="hover:bg-white/5 transition-colors group">
                  <td className="px-5 py-4 bg-white/2 rounded-l-xl">Modern Blend</td>
                  <td className="px-5 py-4 bg-white/2">50 : 0 : 50</td>
                  <td className="px-5 py-4 bg-white/2">Vị hiện đại, chua thanh</td>
                  <td className="px-5 py-4 bg-white/2 rounded-r-xl font-bold group-hover:text-[#E6B980]">280,000đ</td>
                </tr>
                <tr className="hover:bg-white/5 transition-colors group">
                  <td className="px-5 py-4 bg-white/2 rounded-l-xl">Tri Kỷ (Moka Pure)</td>
                  <td className="px-5 py-4 bg-white/2">0 : 0 : 100</td>
                  <td className="px-5 py-4 bg-white/2">100% Moka Cầu Đất</td>
                  <td className="px-5 py-4 bg-white/2 rounded-r-xl font-bold group-hover:text-[#E6B980]">350,000đ</td>
                </tr>
              </tbody>
            </table>
            <div className="mt-8 p-6 bg-[#2D5A27]/20 border border-[#2D5A27]/40 rounded-2xl text-center">
              <p className="text-sm font-medium">🔥 <strong>LƯU Ý CHIẾN LƯỢC:</strong> Toàn bộ bảng giá trên là giá sỉ áp dụng ngay từ <strong>1KG</strong>. Nhân Tâm loại bỏ hoàn toàn trung gian để sếp tối ưu lợi nhuận ly cà phê thấp nhất thị trường.</p>
            </div>
          </div>
        </section>

        {/* Financial Simulator */}
        <section className="mb-24">
          <h2 className="text-center mb-16 text-2xl md:text-4xl relative before:content-[''] before:block before:w-10 before:h-0.5 before:bg-[#E6B980] before:mx-auto before:mb-4 before:opacity-50">
            Phòng Mô Phỏng Dòng Tiền (Financial Engine)
          </h2>
          <div className="glass-card rounded-[32px] p-6 md:p-12 relative overflow-hidden">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                {/* Inputs Group 1 */}
                <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                   <h4 className="text-[#E6B980] text-xs mb-6 uppercase tracking-wider">1. Sản Phẩm & Giá Bán</h4>
                   <div className="mb-6">
                      <div className="flex justify-between text-xs mb-3 opacity-60">
                         <label>GIÁ BÁN SỈ TRUNG BÌNH</label>
                         <span className="text-[#E6B980] font-bold">{formatVND(price)}</span>
                      </div>
                      <input type="range" min="180000" max="350000" step="5000" value={price} onChange={(e) => setPrice(parseInt(e.target.value))} className="w-full" />
                   </div>
                   <div className="mb-3">
                      <div className="flex justify-between text-xs mb-3 opacity-60">
                         <label>GIÁ HẠT ĐẦU VÀO (XƯỞNG)</label>
                         <span className="font-bold">{formatVND(raw)}</span>
                      </div>
                      <input type="range" min="120000" max="220000" step="2000" value={raw} onChange={(e) => setRaw(parseInt(e.target.value))} className="w-full" />
                   </div>
                </div>

                {/* Inputs Group 2 */}
                <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                   <h4 className="text-[#C65C33] text-xs mb-6 uppercase tracking-wider">2. Phân Phối & Chốt Đơn</h4>
                   <div className="mb-6">
                      <div className="flex justify-between text-xs mb-3 opacity-60">
                         <label>HOA HỒNG/KG (SALES/CTV)</label>
                         <span className="text-[#C65C33] font-bold">{formatVND(comm)}</span>
                      </div>
                      <input type="range" min="0" max="20000" step="500" value={comm} onChange={(e) => setComm(parseInt(e.target.value))} className="w-full" />
                   </div>
                   <div className="mb-3">
                      <div className="flex justify-between text-xs mb-3 opacity-60">
                         <label>NGÂN SÁCH QUẢNG CÁO/THÁNG</label>
                         <span className="font-bold">{(ads/1000000).toFixed(0)}M</span>
                      </div>
                      <input type="range" min="0" max="100000000" step="5000000" value={ads} onChange={(e) => setAds(parseInt(e.target.value))} className="w-full" />
                   </div>
                </div>

                {/* Inputs Group 3 */}
                <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                   <h4 className="text-white text-xs mb-6 uppercase tracking-wider">3. Định Phí Vận Hành</h4>
                   <div className="mb-8">
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden mb-3">
                         <div className={`h-full transition-all duration-500 rounded-full ${roi >= 0 ? 'bg-[#2D5A27]' : 'bg-[#D62828]'}`} style={{ width: `${Math.min(Math.max((currentCash/INITIAL_CAPITAL)*100, 0), 100)}%` }} />
                      </div>
                      <p className="text-[0.65rem] text-center opacity-50 uppercase tracking-tighter">Vốn lưu động còn lại: {formatVND(INITIAL_CAPITAL + (monthlyProfit * 12))}</p>
                   </div>
                   <div className="mb-3">
                      <div className="flex justify-between text-xs mb-3 opacity-60">
                         <label>LƯƠNG & MẶT BẰNG & PHÍ CỐ ĐỊNH</label>
                         <span className="font-bold">{(opex/1000000).toFixed(0)}M</span>
                      </div>
                      <input type="range" min="20000000" max="200000000" step="5000000" value={opex} onChange={(e) => setOpex(parseInt(e.target.value))} className="w-full" />
                   </div>
                </div>
             </div>

             {/* Results Section */}
             <div className="bg-[#1B0D05] border border-white/5 rounded-3xl p-8 flex flex-col items-center">
                <div className="text-[#E6B980] font-mono text-center mb-6 italic text-sm md:text-base leading-relaxed max-w-[800px]">
                   {getAdvice()}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
                   <div className="bg-white/5 p-4 rounded-xl text-center border border-white/5 hover:border-[#E6B980]/30 transition-all">
                      <div className="text-[0.6rem] text-white/40 uppercase mb-2">ROI (1 Năm)</div>
                      <div className={`text-xl font-bold ${roi >= 0 ? 'text-[#2D5A27]' : 'text-[#D62828]'}`}>{roi.toFixed(1)}%</div>
                   </div>
                   <div className="bg-white/5 p-4 rounded-xl text-center border border-white/5 hover:border-[#E6B980]/30 transition-all">
                      <div className="text-[0.6rem] text-white/40 uppercase mb-2">Hòa vốn (kg/tháng)</div>
                      <div className="text-xl font-bold text-white">{bep.toLocaleString()} kg</div>
                   </div>
                   <div className="bg-white/5 p-4 rounded-xl text-center border border-white/5 hover:border-[#E6B980]/30 transition-all">
                      <div className="text-[0.6rem] text-white/40 uppercase mb-2">Sản lượng thực tế</div>
                      <div className="text-xl font-bold text-white">{Math.round(totalVolume).toLocaleString()} kg</div>
                   </div>
                   <div className="bg-white/5 p-4 rounded-xl text-center border border-white/5 hover:border-[#E6B980]/30 transition-all">
                      <div className="text-[0.6rem] text-white/40 uppercase mb-2">Lợi nhuận ròng/tháng</div>
                      <div className={`text-xl font-bold ${monthlyProfit >= 0 ? 'text-[#2D5A27]' : 'text-[#D62828]'}`}>{formatVND(monthlyProfit)}</div>
                   </div>
                </div>
             </div>
          </div>
        </section>

        {/* Objections Handling */}
        <section className="mb-24">
           <h2 className="text-center mb-16 text-2xl md:text-4xl relative before:content-[''] before:block before:w-10 before:h-0.5 before:bg-[#E6B980] before:mx-auto before:mb-4 before:opacity-50">
             Sales Objection Handling (Vũ khí thực chiến)
           </h2>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-card p-8 rounded-2xl border-l-4 border-l-[#C65C33]">
                 <h3 className="text-lg text-[#E6B980] mb-4">"Giá này còn cao so với hàng chợ?"</h3>
                 <p className="text-sm opacity-80 leading-relaxed italic">
                    "Sếp ơi, hàng chợ là hạt trộn đậu, bắp, cháy khét. 1kg pha được 40 ly. Hạt Nhân Tâm mộc 100%, sếp pha được 55-60 ly. Tính ra giá vốn mỗi ly nhà mình chỉ 5.000đ - 6.000đ. Cà phê xịn mà giá vốn rẻ hơn cà phê bẩn, tội gì khách bỏ mình đi?"
                 </p>
              </div>
              <div className="glass-card p-8 rounded-2xl border-l-4 border-l-[#2D5A27]">
                 <h3 className="text-lg text-[#E6B980] mb-4">"Mua 1kg có thực sự được giá sỉ?"</h3>
                 <p className="text-sm opacity-80 leading-relaxed italic">
                    "Dạ đúng rồi ạ. Đây là chiến lược Direct Distribution (Trực tiếp từ xưởng). Nhân Tâm bỏ qua mọi đại lý trung gian, mọi chi phí sale rườm rà để sếp được hưởng tận gốc. Một kg cũng là sỉ, vì chúng ta đồng hành cùng nhau lâu dài."
                 </p>
              </div>
           </div>
        </section>

        {/* CTA */}
        <div className="bg-[#C65C33] p-12 rounded-[40px] text-center shadow-3xl transform hover:scale-[1.02] transition-transform duration-500">
           <p className="uppercase tracking-[4px] text-xs font-bold mb-4">Mô hình kinh doanh không trung gian</p>
           <h2 className="text-3xl md:text-5xl font-black mb-8 leading-tight">SẴN SÀNG THỐNG LĨNH<br/> THỊ PHẦN CAFE SẠCH?</h2>
           <div className="flex flex-wrap justify-center gap-6">
              <Link href="https://zalo.me/yourid" className="bg-[#1B0D05] text-white px-10 py-5 rounded-2xl font-bold hover:bg-black transition-all shadow-xl text-lg">
                Nhận Báo Giá Zalo (Lead Gen)
              </Link>
              <Link href="/meeting" className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-10 py-5 rounded-2xl font-bold hover:bg-white/20 transition-all shadow-xl text-lg">
                Họp Chiến Lược Với Thương 🧠
              </Link>
           </div>
        </div>

      </main>

      <footer className="bg-[#120904] py-20 px-6 text-center border-t border-white/10">
        <Image 
          src="/logos/official_logo_horizontal_transparent.png" 
          alt="Nhân Tâm Logo" 
          width={200} 
          height={60} 
          className="opacity-30 mx-auto mb-8 grayscale"
        />
        <p className="text-xs text-white/30 uppercase tracking-[4px] mb-6">
          Nhân Tâm Coffee Framework v6.2 • Business Intelligence System
        </p>
        <div className="flex justify-center flex-col items-center gap-4">
           <p className="text-sm text-white/50 bg-white/5 px-6 py-2 rounded-full border border-white/10">
              Biên tập & Quản trị: <span className="text-[#E6B980] font-bold">Thương · Thư ký của Sếp Nhân</span>
           </p>
           <div className="flex gap-4">
              <span className="bg-[#C65C33] text-white px-3 py-1 rounded text-[0.6rem] font-bold tracking-tighter">DIRECT DISTRIBUTION 2026</span>
              <span className="bg-[#2D5A27] text-white px-3 py-1 rounded text-[0.6rem] font-bold tracking-tighter">ZERO-MIDDLEMAN MODEL</span>
           </div>
        </div>
      </footer>
    </div>
  );
}
