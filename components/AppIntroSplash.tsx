'use client';

import { useState, useEffect } from 'react';
import { Sparkles, Terminal, Cpu } from 'lucide-react';

const BOOT_LOGS = [
  'INITIALIZING NEXUS OS v2.0...',
  'CONNECTING LPU BLOCK 34 PROTOCOL...',
  'CALIBRATING STUDY SPRINT ENGINES...',
  'SYNCHRONIZING CAMPUS PEER NODES...',
  'CAMPUS MESH READY.'
];

export default function AppIntroSplash() {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [logIndex, setLogIndex] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Check if user already saw the intro in this session
    const hasSeen = sessionStorage.getItem('studynexus_intro_seen');
    if (hasSeen) {
      setIsVisible(false);
      return;
    }

    // Progress bar animation
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsFadingOut(true);
            setTimeout(() => {
              setIsVisible(false);
              sessionStorage.setItem('studynexus_intro_seen', 'true');
            }, 500);
          }, 200);
          return 100;
        }
        const jump = Math.floor(Math.random() * 25) + 15;
        return Math.min(prev + jump, 100);
      });
    }, 120);

    // Terminal log cycling
    const logInterval = setInterval(() => {
      setLogIndex((prev) => (prev + 1) % BOOT_LOGS.length);
    }, 280);

    return () => {
      clearInterval(interval);
      clearInterval(logInterval);
    };
  }, []);

  const handleSkip = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      setIsVisible(false);
      sessionStorage.setItem('studynexus_intro_seen', 'true');
    }, 250);
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] bg-[#05070c] text-white flex flex-col items-center justify-center p-6 select-none transition-all duration-500 ${
        isFadingOut ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Background Cyber Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b20_1px,transparent_1px),linear-gradient(to_bottom,#1e293b20_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />
      <div className="absolute w-96 h-96 bg-orange-600/15 rounded-full blur-[100px] pointer-events-none animate-pulse" />

      {/* Skip Button */}
      <button
        onClick={handleSkip}
        className="absolute top-6 right-6 px-3 py-1.5 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-400 hover:text-white text-xs font-mono transition"
      >
        Skip [ESC]
      </button>

      {/* Center Icon & Branding */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-sm w-full space-y-6">
        
        {/* Glowing Logo with Rotating Cyber Ring */}
        <div className="relative flex items-center justify-center">
          <div className="absolute w-24 h-24 rounded-3xl border border-amber-500/30 animate-spin" style={{ animationDuration: '8s' }} />
          <div className="absolute w-28 h-28 rounded-full border border-orange-500/20 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '12s' }} />
          
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-orange-600 via-amber-500 to-yellow-400 flex items-center justify-center font-black text-slate-950 text-3xl shadow-2xl shadow-orange-500/50 relative z-10 transform hover:scale-105 transition">
            Ψ
          </div>
        </div>

        {/* Title */}
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white flex items-center justify-center gap-2">
            LPU StudyNexus
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">
              v2.0
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-mono">Academic Collaboration Protocol</p>
        </div>

        {/* Progress Bar Container */}
        <div className="w-full space-y-2">
          <div className="w-full h-2 rounded-full bg-slate-900 border border-slate-800 overflow-hidden relative shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-400 rounded-full transition-all duration-150 ease-out shadow-lg shadow-orange-500/50"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span className="flex items-center gap-1.5 text-amber-400/90 truncate">
              <Terminal className="w-3 h-3 shrink-0 animate-pulse" />
              {BOOT_LOGS[logIndex]}
            </span>
            <span className="font-bold text-white shrink-0 ml-2">{progress}%</span>
          </div>
        </div>

      </div>
    </div>
  );
}
