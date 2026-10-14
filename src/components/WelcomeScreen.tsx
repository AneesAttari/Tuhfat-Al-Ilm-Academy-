import React, { useState, useEffect } from 'react';

interface WelcomeScreenProps {
  onFinish?: () => void;
  minDuration?: number; // duration in ms, default 1400ms
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onFinish,
  minDuration = 1400
}) => {
  const [visible, setVisible] = useState(true);
  const [fadingOut, setFadingOut] = useState(false);
  const [progress, setProgress] = useState(15);

  useEffect(() => {
    // Animate progress smoothly
    const progressTimer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 98) {
          clearInterval(progressTimer);
          return 100;
        }
        return prev + Math.floor(Math.random() * 20 + 10);
      });
    }, 250);

    // Auto-dismiss after minDuration
    const finishTimer = setTimeout(() => {
      dismiss();
    }, minDuration);

    return () => {
      clearInterval(progressTimer);
      clearTimeout(finishTimer);
    };
  }, [minDuration]);

  const dismiss = () => {
    if (fadingOut) return;
    setFadingOut(true);
    setProgress(100);
    setTimeout(() => {
      setVisible(false);
      if (onFinish) onFinish();
    }, 600); // match transition duration
  };

  if (!visible) return null;

  return (
    <div
      onClick={dismiss}
      role="dialog"
      aria-label="Welcome to Tuhfat Al-Ilm Academy"
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-between px-6 py-10 sm:py-14 select-none cursor-pointer transition-all duration-700 ease-out ${
        fadingOut ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
      style={{
        background: 'linear-gradient(180deg, #FFFFFF 0%, #FAF8F5 45%, #F4EFEB 100%)'
      }}
    >
      {/* Subtle Islamic geometric ambient background */}
      <div className="absolute inset-0 opacity-[0.035] pointer-events-none overflow-hidden flex items-center justify-center">
        <svg
          viewBox="0 0 800 800"
          className="w-[1200px] h-[1200px] text-[#4A154B] animate-[spin_120s_linear_infinite]"
          fill="currentColor"
        >
          <circle cx="400" cy="400" r="360" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="8 8" />
          <polygon points="400,60 740,400 400,740 60,400" fill="none" stroke="currentColor" strokeWidth="2" />
          <polygon points="640,160 640,640 160,640 160,160" fill="none" stroke="currentColor" strokeWidth="2" />
          <circle cx="400" cy="400" r="220" fill="none" stroke="currentColor" strokeWidth="2" />
          <circle cx="400" cy="400" r="120" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
      </div>

      {/* Top Section: Sacred Calligraphy Greeting */}
      <div className="relative z-10 text-center pt-2 sm:pt-4 animate-fade-in">
        <p className="text-sm font-semibold tracking-widest text-[#743682] uppercase mb-1">
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </p>
        <span className="inline-block px-3 py-0.5 rounded-full text-[11px] font-medium tracking-wider text-[#6B21A8] bg-[#FAF5FF] border border-[#E9D5FF]/60 shadow-xs">
          Authentic Quran &amp; Islamic Learning
        </span>
      </div>

      {/* Center Section: Welcoming Photo / Official Logo */}
      <div className="relative z-10 flex flex-col items-center justify-center my-auto w-full max-w-sm px-4">
        {/* Soft glowing backlight effect */}
        <div className="relative flex items-center justify-center">
          <div className="absolute -inset-4 bg-gradient-to-tr from-[#9333EA]/15 via-[#C084FC]/25 to-[#D97706]/15 rounded-full blur-2xl animate-pulse" />
          
          <div className="relative p-3 bg-white/95 backdrop-blur-md rounded-3xl shadow-xl shadow-purple-950/10 border border-purple-100/70 transition-transform duration-700 hover:scale-[1.02]">
            <picture>
              <source srcSet="/formal_full_logo.webp" type="image/webp" />
              <img
                src="/formal_full_logo.png"
                alt="Tuhfat Al-Ilm Academy Official Logo"
                width="260"
                height="310"
                className="w-48 h-auto sm:w-56 md:w-64 max-h-[46vh] object-contain drop-shadow-sm select-none pointer-events-none"
                loading="eager"
                decoding="sync"
              />
            </picture>
          </div>
        </div>

        {/* Welcoming Taglines */}
        <div className="mt-6 text-center">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#2D1236]">
            Tuhfat Al-Ilm Academy
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-[#6B5A72] font-medium">
            Learn Quran, Tajweed &amp; Islamic Studies with Certified Scholars
          </p>
        </div>
      </div>

      {/* Bottom Section: Progress & Tap Hint */}
      <div className="relative z-10 w-full max-w-xs flex flex-col items-center gap-3 pb-2 sm:pb-4">
        {/* Smooth Gold/Purple Progress Bar */}
        <div className="w-full h-1.5 bg-purple-100/70 rounded-full overflow-hidden shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-[#743682] via-[#9333EA] to-[#D97706] rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Status text */}
        <div className="flex items-center justify-between w-full text-[11px] text-[#7C6E82] font-medium px-1">
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#10B981] animate-ping" />
            Welcoming you...
          </span>
          <span className="text-[#8B5CF6] hover:underline cursor-pointer">
            Tap anywhere to enter &rarr;
          </span>
        </div>
      </div>
    </div>
  );
};
