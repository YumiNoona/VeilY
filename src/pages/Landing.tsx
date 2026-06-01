import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Zap, Heart, Download, Palette, Shield, Globe, Sparkles, HardDrive, Lock } from "lucide-react";
import { PlatformIcon } from "@/components/icons/PlatformIcons";
import { SupportModal } from "@/components/modals/SupportModal";

const Scanlines = () => (
  <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03]" style={{ background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.5) 2px, rgba(0,0,0,0.5) 4px)" }} />
);

const CRT = () => (
  <div className="fixed inset-0 pointer-events-none z-40 rounded-lg" style={{ boxShadow: "inset 0 0 150px rgba(0,0,0,0.4), inset 0 0 60px rgba(0,0,0,0.3)" }} />
);

const GlitchText = ({ text, className }: { text: string; className?: string }) => (
  <span className={`relative inline-block ${className}`}>
    <span className="relative z-10">{text}</span>
    <span className="absolute inset-0 z-0 text-[#ff00ff] opacity-40 animate-pulse" style={{ clipPath: "inset(40% 0 30% 0)", transform: "translate(2px, -1px)" }}>{text}</span>
    <span className="absolute inset-0 z-0 text-[#00ffff] opacity-40 animate-pulse" style={{ clipPath: "inset(60% 0 10% 0)", transform: "translate(-2px, 1px)", animationDelay: "0.3s" }}>{text}</span>
  </span>
);

const platforms = [
  "whatsapp", "imessage", "discord", "instagram", "telegram", "signal",
  "snapchat", "slack", "teams", "wechat", "line", "reddit", "x",
  "messenger", "tiktok", "tinder", "facebook", "linkedin"
];

const features = [
  { icon: Download, title: "HD EXPORT", desc: "4K resolution with zero compression artifacts." },
  { icon: Palette, title: "DARK MODE", desc: "Toggle between light & dark for every platform." },
  { icon: Globe, title: "CUSTOMIZE", desc: "Change names, avatars, timestamps. Everything." },
  { icon: Sparkles, title: "TEMPLATES", desc: "30 preset conversations ready to go." },
  { icon: Zap, title: "AI FILL", desc: "Let the machine write conversations for you." },
  { icon: HardDrive, title: "LOCAL", desc: "Nothing leaves your machine. Zero telemetry." },
  { icon: Lock, title: "NO PAYWALL", desc: "Every feature. Free. Forever. Period." },
  { icon: Shield, title: "INSTANT", desc: "No account. No signup. Just open and create." },
];

export default function Landing() {
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [typed, setTyped] = useState("");
  const [showSupport, setShowSupport] = useState(false);
  const fullText = "> PRESS START TO CONTINUE_";

  useEffect(() => {
    if (typed.length < fullText.length) {
      const t = setTimeout(() => setTyped(fullText.slice(0, typed.length + 1)), 80);
      return () => clearTimeout(t);
    }
  }, [typed]);

  useEffect(() => {
    const i = setInterval(() => setScore(s => s + Math.floor(Math.random() * 100)), 3000);
    return () => clearInterval(i);
  }, []);

  const handleCombo = () => setCombo(c => Math.min(c + 1, 20));

  return (
    <div className="min-h-screen bg-[#080c10] text-[#c8ffd4] font-mono overflow-hidden relative">
      <Scanlines />
      <CRT />

      {/* Top bar — Arcade stats */}
      <div className="relative z-20 flex items-center justify-between px-6 py-3 border-b-2 border-[#39ff8a]/15 text-xs">
        <div className="flex items-center gap-4">
          <span className="text-[#ff6b35] font-bold">1UP</span>
          <span className="tabular-nums text-[#39ff8a]">{String(score).padStart(8, '0')}</span>
        </div>
        <div className="flex items-center gap-2">
          <Heart className="w-3.5 h-3.5 text-[#ff4dff] fill-[#ff4dff] animate-pulse" />
          <span className="text-[#ff4dff]">x{combo || 1}</span>
        </div>
        <span className="text-[#ffe566]">HI {String(score + 99999).padStart(8, '0')}</span>
      </div>

      {/* Navbar */}
      <nav className="relative z-20 flex items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2.5" onClick={handleCombo}>
          <span className="text-2xl">🌕</span>
          <span className="text-lg font-bold tracking-wide text-[#39ff8a]">VEILY</span>
        </Link>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowSupport(true)} className="px-7 py-2.5 border-2 border-[#ffe566] text-[#ffe566] text-sm font-bold hover:bg-[#ffe566] hover:text-[#080c10] transition-colors pixel-corners flex items-center gap-1.5">
            <Heart className="w-4 h-4 fill-current" /> TIP
          </button>
          <Link to="/app" className="px-7 py-2.5 border-2 border-[#39ff8a] text-[#39ff8a] text-sm font-bold hover:bg-[#39ff8a] hover:text-[#080c10] transition-colors pixel-corners flex items-center gap-1.5" onClick={handleCombo}>
            ► PLAY
          </Link>
          <a href="https://github.com/YumiNoona/VeilY/releases/latest/download/Veily.exe" className="px-7 py-2.5 border-2 border-[#ff6b35] text-[#ff6b35] text-sm font-bold hover:bg-[#ff6b35] hover:text-[#080c10] transition-colors pixel-corners flex items-center gap-1.5">
            ↓ ROM
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-20 max-w-[1600px] mx-auto px-4 pt-16 pb-12">
        <div className="flex items-start justify-between gap-6 xl:gap-8">
          {/* Left: Mobile Mockup */}
          <div className="hidden lg:flex shrink-0 w-[300px] xl:w-[520px] pt-12 justify-start">
            <div className="relative animate-float">
              <div className="absolute -bottom-6 left-4 right-4 h-6 rounded-full shadow-float" />
              <div className="relative border-[3px] border-[#39ff8a]/20 rounded-[40px] bg-[#0b141a] w-full max-w-[260px] h-[520px] overflow-hidden shadow-2xl shadow-black/50" style={{ transform: 'rotate(-2.5deg)' }}>
                {/* Status Bar */}
                <div className="bg-[#0b141a] pt-4 px-5 pb-1 flex items-center justify-between text-[10px] text-[#aebac1]">
                  <span>9:41</span>
                  <div className="flex items-center gap-1">
                    <svg className="w-2.5 h-2.5" viewBox="0 0 10 10"><rect x="0" y="6" width="1.5" height="4" rx="0.3" fill="currentColor"/><rect x="2.5" y="4" width="1.5" height="6" rx="0.3" fill="currentColor"/><rect x="5" y="2" width="1.5" height="8" rx="0.3" fill="currentColor"/><rect x="7.5" y="0" width="1.5" height="10" rx="0.3" fill="currentColor"/></svg>
                    <svg className="w-3 h-3" viewBox="0 0 12 12"><path d="M1 4.5a3.5 3.5 0 007 0C8 2.5 6 1 3.5 1S1 2.5 1 4.5z" fill="none" stroke="currentColor" strokeWidth="1"/><path d="M3.5 4.5a2 2 0 012-2 2 2 0 012 2" fill="none" stroke="currentColor" strokeWidth="0.8"/><circle cx="5.5" cy="4.5" r="0.8" fill="currentColor"/></svg>
                    <svg className="w-5 h-2.5" viewBox="0 0 20 10"><rect x="0" y="0" width="17" height="10" rx="2" fill="none" stroke="currentColor" strokeWidth="1.2"/><rect x="18" y="3" width="1.5" height="4" rx="0.5" fill="currentColor"/><rect x="2" y="2" width="13" height="6" rx="1" fill="currentColor" opacity="0.6"/></svg>
                  </div>
                </div>
                {/* WhatsApp Header */}
                <div className="bg-[#202c33] px-3 py-2 flex items-center gap-2">
                  <svg className="w-5 h-5 text-[#8696a0] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6"/></svg>
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 shrink-0 flex items-center justify-center text-[8px] font-bold text-white">PS</div>
                  <div className="flex-1 min-w-0"><p className="text-[12px] font-semibold text-[#e9edef]">Priya Sharma</p></div>
                  <svg className="w-4 h-4 text-[#8696a0] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
                  <svg className="w-4 h-4 text-[#8696a0] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
                  <svg className="w-4 h-4 text-[#8696a0] shrink-0" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/></svg>
                </div>
                {/* Chat Messages */}
                <div className="px-3 py-2 pb-14 flex flex-col gap-3 overflow-hidden" style={{ backgroundImage: "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAEklEQVQIW2NkYGD4z8DAwMgAIwADHwF6BFeDzgAAAABJRU5ErkJggg==')" }}>
                  <div className="text-center"><span className="text-[8px] text-[#8696a0]/50 bg-[#182229] px-3 py-0.5 rounded-md">TODAY</span></div>
                  <div className="flex items-end gap-1.5"><div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 shrink-0 flex items-center justify-center text-[7px] font-bold text-white">PS</div><div className="bg-[#202c33] rounded-lg rounded-bl-sm px-2.5 py-1.5 max-w-[72%] shadow-sm"><p className="text-[10px] text-[#e9edef] leading-[1.5] text-left">hey! have u tried Veily yet? it's this amazing mockup tool for creating chat screenshots.</p></div><span className="text-[7px] text-[#8696a0]/70 shrink-0 self-end mb-0.5">11:42</span></div>
                  <div className="flex justify-end items-end gap-1.5"><div className="bg-[#005c4b] rounded-lg rounded-br-sm px-2.5 py-1.5 max-w-[72%] shadow-sm"><p className="text-[10px] text-[#e9edef] leading-[1.5] text-left">no way! does it have WhatsApp templates? i need to prank my friends.</p></div></div>
                  <div className="flex items-end gap-1.5"><div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 shrink-0 flex items-center justify-center text-[7px] font-bold text-white">PS</div><div className="bg-[#202c33] rounded-lg rounded-bl-sm px-2.5 py-1.5 max-w-[72%] shadow-sm"><p className="text-[10px] text-[#e9edef] leading-[1.5] text-left">yes there so much you can do with it! also check out vexo.venusapp.in</p></div><span className="text-[7px] text-[#8696a0]/70 shrink-0 self-end mb-0.5">11:45</span></div>
                </div>
                {/* Input Bar */}
                <div className="absolute bottom-0 left-0 right-0 bg-[#202c33] px-2 py-2.5 flex items-center gap-2">
                  <span className="text-[#8696a0] text-lg leading-none">+</span>
                  <div className="flex-1 bg-[#2a3942] rounded-full px-3 py-2 flex items-center"><span className="text-[10px] text-[#8696a0]">Message</span></div>
                  <div className="w-7 h-7 rounded-full bg-[#00a884] flex items-center justify-center shrink-0"><svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/><path d="M19 10v2a7 7 0 01-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg></div>
                </div>
              </div>
            </div>
          </div>

          {/* Center: Hero Text */}
          <div className="flex-1 text-center min-w-0 pt-8 px-4 flex flex-col items-center">
            <p className="text-[#39ff8a]/50 text-xs mb-6 animate-pulse">█ SYSTEM READY █ V2.0 █ NO CARTRIDGE REQUIRED █</p>

            <div className="inline-block border-2 border-[#ffe566]/30 px-4 py-1.5 mb-8 bg-[#ffe566]/5">
              <span className="text-[#ffe566] text-[10px] font-bold tracking-[0.3em]">PLAYER 1 — READY</span>
            </div>

            <h1 className="text-5xl sm:text-7xl lg:text-8xl xl:text-9xl font-black tracking-tighter mb-6 break-words" style={{ fontFamily: '"Press Start 2P", monospace', color: '#39ff8a', textShadow: '3px 3px 0 #0a3d1f, -2px -1px 0 #080c10' }}>
              CHAT<br className="sm:hidden" /> MOCKUPS
            </h1>

            <p className="text-[#c8ffd4]/60 text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
              Insert coin. Create pixel-perfect chat screenshots for 20+ platforms. No signup. No paywall. Just press start.
            </p>

            <div className="flex flex-row items-center justify-center gap-3 flex-wrap">
              <Link to="/app" onClick={handleCombo} className="group inline-flex items-center gap-2 px-7 py-3 border-2 border-[#39ff8a] bg-[#39ff8a]/10 text-[#39ff8a] text-sm font-bold hover:bg-[#39ff8a] hover:text-[#080c10] transition-all pixel-corners whitespace-nowrap">
                <span className="text-[#ffe566] group-hover:text-[#080c10]">►</span> INSERT COIN
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a href="https://github.com/YumiNoona/VeilY/releases/latest/download/Veily.exe" className="group inline-flex items-center gap-2 px-7 py-3 border-2 border-[#ff6b35] bg-[#ff6b35]/10 text-[#ff6b35] text-sm font-bold hover:bg-[#ff6b35] hover:text-[#080c10] transition-all pixel-corners whitespace-nowrap">
                <span className="group-hover:text-[#080c10]">💾</span> DOWNLOAD ROM
              </a>
            </div>

            <div className="mt-12 h-8 flex items-center justify-center">
              <span className="text-[#39ff8a]/70 text-sm">{typed}</span>
            </div>
          </div>

          {/* Right: Email Mockup */}
          <div className="hidden lg:flex shrink-0 w-[300px] xl:w-[520px] pt-28 justify-end animate-drift">
            <div className="border-[3px] border-[#ff6b35]/20 rounded-xl bg-[#fafafa] overflow-hidden shadow-2xl shadow-black/40 w-[340px]">
              {/* macOS-style title bar */}
              <div className="bg-[#f6f6f6] border-b border-[#d2d2d2] px-3 py-2 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                  <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                  <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                </div>
                <span className="text-[9px] text-gray-500 mx-auto font-medium">Inbox — Veily Team</span>
              </div>
              {/* Toolbar */}
                <div className="bg-[#fafafa] border-b border-[#e5e5e5] px-3 py-1.5 flex items-center gap-3">
                  <svg className="w-3.5 h-3.5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg>
                  <svg className="w-3.5 h-3.5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>
                  <svg className="w-3.5 h-3.5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
                  <svg className="w-3.5 h-3.5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>
                  <svg className="w-3.5 h-3.5 text-gray-500 ml-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
                </div>
              {/* Email content */}
              <div className="p-4">
                <h2 className="text-[13px] font-bold text-[#1d1d1f] mb-3">Your mockup designs are ready ✨</h2>
                <div className="border-b border-[#e5e5e5] pb-2 mb-3">
                  <div className="flex items-start gap-2 mb-1">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#ff6b35] to-[#ff0044] flex items-center justify-center text-white text-[10px] font-bold shrink-0">V</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-semibold text-[#1d1d1f]">Veily Team</p>
                      <p className="text-[9px] text-gray-500">To: █████████████</p>
                      <p className="text-[8px] text-gray-400">Today at 11:42 AM</p>
                    </div>
                  </div>
                </div>
                <div className="text-[11px] text-[#1d1d1f] leading-[1.6] space-y-3">
                  <p>Hi Alex,</p>
                  <p>We've just shipped v2.0 of Veily and wanted you to be the first to know. All chat platforms are now available in your workspace.</p>
                  <p>Best Regards,<br/>The Veily Team</p>
                </div>
                <div className="mt-4 p-2 border border-[#e5e5e5] rounded-md flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/></svg>
                  <div className="flex-1 min-w-0">
                    <p className="text-[9px] font-medium text-[#1d1d1f] truncate">Veily_v2_Release_Notes.pdf</p>
                    <p className="text-[8px] text-gray-400">2.4 MB</p>
                  </div>
                  <span className="text-[10px] text-gray-500">↓</span>
                </div>
              </div>
              <div className="border-t border-[#e5e5e5] px-3 py-2 flex items-center gap-2">
                <span className="text-[9px] text-gray-600 font-medium">↩ Reply</span>
                <span className="text-[9px] text-gray-600 font-medium">↪ Forward</span>
                <span className="text-[9px] text-gray-400 ml-auto">✏️</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Grid — Arcade character select */}
      <section className="relative z-20 max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-8">
          <p className="text-[#ffe566] text-xs tracking-[0.3em] mb-2">▼ SELECT YOUR FIGHTER ▼</p>
          <h2 className="text-2xl sm:text-3xl text-white font-bold">20+ CHARACTERS</h2>
        </div>
        <div className="flex flex-wrap justify-center gap-1.5">
          {platforms.map((p, i) => (
            <Link to={`/app?platform=${p}`} key={p} className="w-[calc(33.33%-6px)] sm:w-[calc(25%-6px)] md:w-[calc(20%-6px)] border-2 border-[#39ff8a]/20 p-3 text-center hover:border-[#39ff8a] hover:bg-[#39ff8a]/5 transition-all cursor-pointer pixel-corners group" onClick={handleCombo}>
              <div className="w-8 h-8 mx-auto mb-1.5 flex items-center justify-center group-hover:scale-125 transition-transform">
                <PlatformIcon platform={p} className="w-6 h-6" />
              </div>
              <span className="text-[10px] text-[#c8ffd4]/50 font-bold tracking-wider group-hover:text-[#39ff8a]">{p.charAt(0).toUpperCase() + p.slice(1)}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Features — Equipment screen */}
      <section className="relative z-20 max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-8">
          <p className="text-[#ff4dff] text-xs tracking-[0.3em] mb-2">▲ EQUIPMENT ▲</p>
          <h2 className="text-2xl sm:text-3xl text-white font-bold">POWER-UPS</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {features.map((f, i) => (
            <div key={i} className="game-card relative overflow-hidden border-2 border-[#39ff8a]/10 p-5 hover:border-[#39ff8a]/30 transition-all pixel-corners group flex flex-col items-center text-center" onClick={handleCombo}>
              <f.icon className="w-7 h-7 text-[#39ff8a] mb-3 group-hover:text-[#ffe566] transition-colors" />
              <h3 className="text-[#39ff8a] font-bold text-sm mb-1.5 group-hover:text-[#ffe566] transition-colors">{f.title}</h3>
              <p className="text-[#c8ffd4]/40 text-xs leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Boss Fight CTA */}
      <section className="relative z-20 max-w-6xl mx-auto px-6 py-16 text-center">
        <div className="game-card scan-line relative overflow-hidden border-2 border-[#ff6b35]/20 p-8 sm:p-12 bg-[#ff6b35]/[0.02] pixel-corners glow-border">
          <p className="text-[#ff6b35] text-xs tracking-[0.3em] mb-3 animate-pulse">⚠  WARNING  ⚠</p>
          <h2 className="text-3xl sm:text-4xl text-[#ff6b35] font-black mb-4">BOSS LEVEL</h2>
          <p className="text-[#ff6b35]/80 text-sm font-bold tracking-wide max-w-md mx-auto mb-8 whitespace-nowrap">⚠ BORING MOCKUPS END HERE — NO CONTINUES ⚠</p>
          <Link to="/app" onClick={handleCombo} className="inline-flex items-center gap-2 px-10 py-4 border-2 border-[#ff6b35] bg-[#ff6b35] text-[#080c10] text-lg font-black hover:bg-[#ff8c5a] hover:border-[#ff8c5a] transition-colors pixel-corners">
            <span className="text-xl">⚔️</span> FIGHT
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Credits */}
      <footer className="relative z-20 border-t-2 border-[#39ff8a]/10 px-6 py-8 text-center">
        <div className="text-xs text-[#c8ffd4]/25 space-y-1">
          <p>Built with 💙 <a href="https://vexo.venusapp.in" target="_blank" rel="noopener" className="text-[#ff4dff]/50 hover:text-[#ff4dff] transition-colors">Made by Veil</a></p>
          <p className="animate-pulse text-[#39ff8a]/15">INSERT COIN TO CONTINUE...</p>
        </div>
      </footer>

      <style>{`
        .pixel-corners { clip-path: polygon(4px 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px), 0 4px); }
        .game-card { position: relative; }
        .game-card::after {
          content: '';
          position: absolute;
          inset: 0;
          opacity: 0;
          transition: opacity 0.3s;
          pointer-events: none;
          background: repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(57,255,138,0.03) 3px, rgba(57,255,138,0.03) 6px);
        }
        .game-card:hover::after { opacity: 1; }
        @keyframes scan {
          0% { top: 0; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        .scan-line::before {
          content: '';
          position: absolute;
          left: 0; right: 0; height: 2px;
          top: 0;
          background: linear-gradient(90deg, transparent, rgba(57,255,138,0.2), transparent);
          animation: scan 3s ease-in-out infinite;
          pointer-events: none;
          z-index: 5;
        }
        @keyframes borderGlow {
          0%, 100% { border-color: rgba(255,107,53,0.12); }
          50% { border-color: rgba(255,107,53,0.35); }
        }
        .glow-border { animation: borderGlow 4s ease-in-out infinite; }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        .animate-float { animation: float 5s ease-in-out infinite; }
        @keyframes shadowPulse {
          0%, 1000% { opacity: 0.5; transform: scaleX(1); }
          50% { opacity: 0.2; transform: scaleX(0.8); }
        }
        .shadow-float {
          background: radial-gradient(ellipse at center, rgba(57,255,138,0.7) 0%, transparent 65%);
          filter: blur(8px);
          animation: shadowPulse 5s ease-in-out infinite;
        }
        @keyframes drift {
          0%   { transform: translateY(0px)   rotate(1.5deg)  scale(1);    }
          20%  { transform: translateY(-6px)  rotate(2.2deg)  scale(1.008); }
          45%  { transform: translateY(-12px) rotate(0.8deg)  scale(1.012); }
          65%  { transform: translateY(-5px)  rotate(2.8deg)  scale(1.005); }
          80%  { transform: translateY(-10px) rotate(1.2deg)  scale(1.01);  }
          100% { transform: translateY(0px)   rotate(1.5deg)  scale(1);    }
        }
        .animate-drift { animation: drift 9s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite; }
      `}</style>
      <SupportModal isOpen={showSupport} onOpenChange={setShowSupport} />
    </div>
  );
}