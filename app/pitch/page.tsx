'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  FileText,
  Brain,
  Code2,
  Search,
  MapPin,
  Trophy,
  Flame,
  CheckCircle2,
  Zap,
  Users,
  Printer,
  Maximize2,
  Minimize2,
  HelpCircle,
  ExternalLink
} from 'lucide-react';

interface Slide {
  id: number;
  badge: string;
  badgeColor: string;
  title: string;
  subtitle?: string;
  notes: string;
}

const slidesData: Slide[] = [
  {
    id: 1,
    badge: 'HACKATHON GRAND FINALE PITCH',
    badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    title: 'LPU StudyNexus',
    subtitle: 'The Next-Generation Hyper-Collaborative Academic Operating System for Lovely Professional University',
    notes: 'Welcome judges and faculty. Present LPU StudyNexus as the comprehensive unified academic operating system built to solve student isolation, disorganized doubt solving, and physical campus friction across LPU.'
  },
  {
    id: 2,
    badge: '01. THE PROBLEM',
    badgeColor: 'text-red-400 bg-red-500/10 border-red-500/30',
    title: 'Academic Life at Scale is Fragmented & Chaotic',
    notes: 'Highlight 3 core pain points: WhatsApp group noise where PYQs and doubts get lost, physical campus disconnect across 600 acres with unknown study spots, and lack of gamification causing solo study burnout.'
  },
  {
    id: 3,
    badge: '02. THE SOLUTION',
    badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    title: 'Meet LPU StudyNexus: 1 Platform, Infinite Focus',
    notes: 'Introduce our unified 8-pillar solution: Live Subject Pods, NexusAI Copilot, NexusSearch, Daily DSA Arena, Solo Focus Pod, 2D Campus Map, 18-Week Streak Heatmap, and Bounty Doubt Board.'
  },
  {
    id: 4,
    badge: '03. CORE FEATURE #1',
    badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    title: 'Synchronized Themed Virtual Study Rooms',
    notes: 'Explain our Subject Study Rooms: themed SVG geometric backgrounds for DSA, Math, Web, OS, DBMS, synchronized sprint timers with audio completion chimes, and live peer presence.'
  },
  {
    id: 5,
    badge: '04. CORE FEATURE #2',
    badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
    title: 'NexusAI Copilot & Instant CSE Knowledge Search',
    notes: 'Showcase NexusAI Copilot (24/7 localized doubt solving with ELI5 mode & +5 credit quizzes) and NexusSearch (Google-style instant CSE knowledge index with Big-O complexity badges and keyboard hotkey).'
  },
  {
    id: 6,
    badge: '05. CORE FEATURE #3',
    badgeColor: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
    title: '2D Vector Campus Map & Study Spot Navigator',
    notes: 'Demonstrate our interactive LPU Campus Map: Real-time telemetry on noise levels (silent vs social zones), Wi-Fi signal speeds, laptop socket availability, and step-by-step route navigators.'
  },
  {
    id: 7,
    badge: '06. GAMIFICATION & HABIT LOOP',
    badgeColor: 'text-orange-400 bg-orange-500/10 border-orange-500/30',
    title: 'Building Daily Habits: Streak Heatmap & Karma Economy',
    notes: 'Explain the GitHub-style 18-week contribution heatmap that turns daily study sprints into verifiable proof of work, backed by credit token rewards (+15 for DSA, +10 for doubts, +5 for AI quizzes).'
  },
  {
    id: 8,
    badge: '07. TECHNICAL EXCELLENCE',
    badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
    title: 'Enterprise Architecture & High Performance',
    notes: 'Deep dive into our tech stack: Next.js 16 App Router, React 19, Supabase Realtime PostgreSQL, Tailwind CSS, Lucide icons, and 100/100 Lighthouse performance.'
  },
  {
    id: 9,
    badge: '08. IMPACT & BUSINESS VIABILITY',
    badgeColor: 'text-teal-400 bg-teal-500/10 border-teal-500/30',
    title: 'Massive Impact Across Campus & Indian Universities',
    notes: 'Share key engagement metrics: 3.8x focus duration increase, under 15-minute doubt turnaround, and business models spanning university enterprise licensing and campus recruiter pipelines.'
  },
  {
    id: 10,
    badge: '09. THE ROADMAP & DEMO',
    badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    title: 'Future Roadmap & Interactive Live Demo',
    notes: 'Summarize our 3-phase roadmap (WebRTC audio mesh, automated CA evaluator, pan-India rollout) and invite judges for live hands-on Q&A.'
  }
];

export default function PitchDeckPage() {
  const [currentSlide, setCurrentSlide] = useState(1);
  const [showNotes, setShowNotes] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const totalSlides = slidesData.length;

  const nextSlide = () => {
    if (currentSlide < totalSlides) setCurrentSlide(prev => prev + 1);
  };

  const prevSlide = () => {
    if (currentSlide > 1) setCurrentSlide(prev => prev - 1);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        e.preventDefault();
        nextSlide();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        prevSlide();
      } else if (e.key === 'n' || e.key === 'N') {
        setShowNotes(prev => !prev);
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      } else if (e.key >= '1' && e.key <= '9') {
        setCurrentSlide(parseInt(e.key));
      } else if (e.key === '0') {
        setCurrentSlide(10);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide]);

  const slide = slidesData[currentSlide - 1];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between select-none relative overflow-hidden">
      {/* Background Glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -right-32 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
      </div>

      {/* Top Deck Header */}
      <header className="relative z-20 border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center font-black text-slate-950 text-sm shadow-md shadow-amber-500/20 hover:scale-105 transition"
          >
            LN
          </Link>
          <div>
            <div className="text-sm font-bold tracking-tight text-white flex items-center gap-2">
              LPU StudyNexus <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">Pitch Deck</span>
            </div>
            <div className="text-[11px] text-slate-400">Team CodeFlux • Final Hackathon Presentation</div>
          </div>
        </div>

        {/* Deck Controls */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400 mr-2">
            Slide {currentSlide} of {totalSlides}
          </span>
          <button
            onClick={() => setShowNotes(!showNotes)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition flex items-center gap-1.5 ${
              showNotes
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                : 'border-slate-700 bg-slate-800/60 hover:bg-slate-700 text-slate-300'
            }`}
            title="Toggle Speaker Notes (N)"
          >
            <FileText className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Notes</span>
          </button>
          <button
            onClick={() => window.print()}
            className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/60 hover:bg-slate-700 text-xs font-medium text-slate-300 transition flex items-center gap-1.5"
            title="Print / Save as PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">PDF</span>
          </button>
          <button
            onClick={toggleFullscreen}
            className="px-3 py-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-xs font-semibold text-amber-400 transition flex items-center gap-1.5"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isFullscreen ? 'Exit' : 'Fullscreen'}</span>
          </button>
        </div>
      </header>

      {/* Main Slide Area */}
      <main className="relative z-10 flex-1 max-w-6xl w-full mx-auto p-4 sm:p-8 flex flex-col justify-center">

        {/* SLIDE 1: Title & Hook */}
        {currentSlide === 1 && (
          <div className="flex flex-col items-center text-center justify-center py-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono mb-6">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
              {slide.badge}
            </div>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-6 bg-gradient-to-r from-white via-slate-100 to-amber-200 bg-clip-text text-transparent">
              {slide.title}
            </h1>
            <p className="text-lg sm:text-2xl font-light text-slate-300 max-w-3xl mb-8 leading-relaxed">
              {slide.subtitle}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-3xl mb-8">
              <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm">
                <div className="text-2xl font-bold text-amber-400 font-mono">35,000+</div>
                <div className="text-xs text-slate-400 mt-1">Campus Students</div>
              </div>
              <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm">
                <div className="text-2xl font-bold text-orange-400 font-mono">8 Modules</div>
                <div className="text-xs text-slate-400 mt-1">Unified Ecosystem</div>
              </div>
              <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm">
                <div className="text-2xl font-bold text-emerald-400 font-mono">24/7 AI</div>
                <div className="text-xs text-slate-400 mt-1">Nexus Copilot</div>
              </div>
              <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm">
                <div className="text-2xl font-bold text-sky-400 font-mono">0ms Lag</div>
                <div className="text-xs text-slate-400 mt-1">Real-time Sprints</div>
              </div>
            </div>

            <div className="text-xs text-slate-500 font-mono flex items-center gap-2">
              <span>Presented by Team CodeFlux</span>
              <span>•</span>
              <span>Press <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-300">→</kbd> or Click Next to begin</span>
            </div>
          </div>
        )}

        {/* SLIDE 2: Problem Statement */}
        {currentSlide === 2 && (
          <div className="flex flex-col justify-center py-4">
            <div className="text-xs font-mono uppercase tracking-wider text-amber-400 mb-2">{slide.badge}</div>
            <h2 className="text-3xl sm:text-5xl font-black text-white mb-6">{slide.title}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="p-6 rounded-2xl border border-red-500/20 bg-red-950/10 backdrop-blur-sm">
                <div className="text-3xl mb-3">💬</div>
                <h3 className="text-lg font-bold text-red-300 mb-2">Chaotic WhatsApp Groups</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Important assignment doubts, exam PYQs, and class notes vanish under 1,000s of spam messages. No indexing, zero accountability.
                </p>
              </div>

              <div className="p-6 rounded-2xl border border-amber-500/20 bg-amber-950/10 backdrop-blur-sm">
                <div className="text-3xl mb-3">🗺️</div>
                <h3 className="text-lg font-bold text-amber-300 mb-2">600-Acre Campus Disconnect</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Students struggle to find available silent study zones, live socket spots, or high-speed Wi-Fi across LPU's vast block network.
                </p>
              </div>

              <div className="p-6 rounded-2xl border border-orange-500/20 bg-orange-950/10 backdrop-blur-sm">
                <div className="text-3xl mb-3">🎯</div>
                <h3 className="text-lg font-bold text-orange-300 mb-2">Solo Burnout & Zero Incentives</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Studying alone lacks peer motivation. No gamified incentives or streak rewards to foster consistent daily coding and academic mastery.
                </p>
              </div>
            </div>

            <div className="mt-8 p-4 rounded-xl border border-slate-800 bg-slate-900/70 flex items-center gap-4">
              <div className="text-2xl">⚠️</div>
              <div className="text-sm text-slate-300">
                <span className="text-white font-semibold">The Cost:</span> 78% of engineering students report severe exam anxiety due to unorganized peer collaboration and inaccessible faculty assistance before MTEs/ETEs.
              </div>
            </div>
          </div>
        )}

        {/* SLIDE 3: The Solution */}
        {currentSlide === 3 && (
          <div className="flex flex-col justify-center py-4">
            <div className="text-xs font-mono uppercase tracking-wider text-emerald-400 mb-2">{slide.badge}</div>
            <h2 className="text-3xl sm:text-5xl font-black text-white mb-6">{slide.title}</h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 hover:border-amber-400 transition">
                <Users className="w-6 h-6 text-amber-400 mb-2" />
                <div className="font-bold text-sm text-white">Live Subject Pods</div>
                <div className="text-xs text-slate-400 mt-1">Themed sync rooms (DSA, OS, Web, DBMS, Math)</div>
              </div>
              <div className="p-4 rounded-xl border border-sky-500/30 bg-sky-500/5 hover:border-sky-400 transition">
                <Brain className="w-6 h-6 text-sky-400 mb-2" />
                <div className="font-bold text-sm text-white">NexusAI Copilot</div>
                <div className="text-xs text-slate-400 mt-1">24/7 doubt solver, MCQ quizzer & code generator</div>
              </div>
              <div className="p-4 rounded-xl border border-purple-500/30 bg-purple-500/5 hover:border-purple-400 transition">
                <Search className="w-6 h-6 text-purple-400 mb-2" />
                <div className="font-bold text-sm text-white">NexusSearch</div>
                <div className="text-xs text-slate-400 mt-1">Google-style instant CSE knowledge engine</div>
              </div>
              <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 hover:border-emerald-400 transition">
                <Code2 className="w-6 h-6 text-emerald-400 mb-2" />
                <div className="font-bold text-sm text-white">Daily DSA Arena</div>
                <div className="text-xs text-slate-400 mt-1">In-browser compiler + credit rewards</div>
              </div>
              <div className="p-4 rounded-xl border border-orange-500/30 bg-orange-500/5 hover:border-orange-400 transition">
                <Zap className="w-6 h-6 text-orange-400 mb-2" />
                <div className="font-bold text-sm text-white">Solo Focus Hub</div>
                <div className="text-xs text-slate-400 mt-1">Custom Pomodoro (1-180m) + PDF Document Reader</div>
              </div>
              <div className="p-4 rounded-xl border border-teal-500/30 bg-teal-500/5 hover:border-teal-400 transition">
                <MapPin className="w-6 h-6 text-teal-400 mb-2" />
                <div className="font-bold text-sm text-white">2D Campus Map</div>
                <div className="text-xs text-slate-400 mt-1">Noise meters, Wi-Fi stats & walking route nav</div>
              </div>
              <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-500/5 hover:border-rose-400 transition">
                <Flame className="w-6 h-6 text-rose-400 mb-2" />
                <div className="font-bold text-sm text-white">Streak Heatmap</div>
                <div className="text-xs text-slate-400 mt-1">GitHub-style 18-week study proof-of-work</div>
              </div>
              <div className="p-4 rounded-xl border border-indigo-500/30 bg-indigo-500/5 hover:border-indigo-400 transition">
                <HelpCircle className="w-6 h-6 text-indigo-400 mb-2" />
                <div className="font-bold text-sm text-white">Bounty Doubts</div>
                <div className="text-xs text-slate-400 mt-1">Peer Q&A with academic credit bounties</div>
              </div>
            </div>
          </div>
        )}

        {/* SLIDE 4: Virtual Study Rooms */}
        {currentSlide === 4 && (
          <div className="flex flex-col justify-center py-4">
            <div className="text-xs font-mono uppercase tracking-wider text-amber-400 mb-2">{slide.badge}</div>
            <h2 className="text-3xl sm:text-5xl font-black text-white mb-6">{slide.title}</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
              <div className="space-y-4">
                <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/80">
                  <h4 className="font-bold text-amber-400 text-sm flex items-center gap-2">
                    <Sparkles className="w-4 h-4" /> Dynamic Subject Theming & Watermarks
                  </h4>
                  <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                    Custom visual ambiances for <strong>DSA, Mathematics, Web Dev, OS, and DBMS</strong> with subtle SVG algorithmic diagrams and subject badges.
                  </p>
                </div>
                <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/80">
                  <h4 className="font-bold text-orange-400 text-sm flex items-center gap-2">
                    <Zap className="w-4 h-4" /> Synchronized Peer Pomodoro Timer
                  </h4>
                  <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                    Entire study pods lock in together for synchronized 25m/50m sprints with audio completion chimes and ambient Lo-Fi rain generator.
                  </p>
                </div>
                <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/80">
                  <h4 className="font-bold text-emerald-400 text-sm flex items-center gap-2">
                    <Users className="w-4 h-4" /> Real-time Collaborative Chat & Task List
                  </h4>
                  <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                    Instant messaging, shared milestone checklist, and live member presence avatars powered by Supabase Realtime engine.
                  </p>
                </div>
              </div>

              {/* Room Preview Widget */}
              <div className="p-5 rounded-2xl border border-amber-500/30 bg-gradient-to-b from-slate-900 to-slate-950 shadow-2xl relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-xs font-mono font-bold text-white">ROOM #DSA-CRACKERS</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-mono">14 Peers Active</span>
                </div>
                <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800/80 text-center mb-4">
                  <div className="text-3xl font-mono font-black text-amber-400 tracking-wider">24:45</div>
                  <div className="text-[10px] uppercase font-mono text-slate-400 mt-1">⚡ SPRINT IN PROGRESS • FOCUS MODE</div>
                </div>
                <div className="space-y-2 text-xs font-mono">
                  <div className="p-2 rounded bg-slate-900 border border-slate-800 flex justify-between">
                    <span className="text-slate-300">Rahul (B.Tech CSE):</span>
                    <span className="text-amber-400">"Solving Graph BFS problem #342"</span>
                  </div>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800 flex justify-between">
                    <span className="text-slate-300">Simran (AI/ML):</span>
                    <span className="text-emerald-400">"DP tabulation completed ✅"</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SLIDE 5: NexusAI Copilot & Search */}
        {currentSlide === 5 && (
          <div className="flex flex-col justify-center py-4">
            <div className="text-xs font-mono uppercase tracking-wider text-cyan-400 mb-2">{slide.badge}</div>
            <h2 className="text-3xl sm:text-5xl font-black text-white mb-6">{slide.title}</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Copilot */}
              <div className="p-6 rounded-2xl border border-sky-500/30 bg-sky-950/10 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-xl">🤖</div>
                  <div>
                    <h3 className="font-bold text-white text-lg">NexusAI 2.0 Copilot</h3>
                    <p className="text-xs text-sky-400">Floating Global Academic Assistant</p>
                  </div>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-300 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                    <span><strong>Instant Doubt Resolution:</strong> Explains complex CSE concepts (AVL rotations, Semaphores, B-Trees) instantly.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                    <span><strong>ELI5 Mode:</strong> Simplifies complex mathematical and algorithmic theory into everyday analogies.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                    <span><strong>Interactive Rapid Quizzes:</strong> Instant 4-option MCQs with immediate feedback and +5 credit rewards.</span>
                  </li>
                </ul>
              </div>

              {/* Search */}
              <div className="p-6 rounded-2xl border border-amber-500/30 bg-amber-950/10 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-xl">🔍</div>
                  <div>
                    <h3 className="font-bold text-white text-lg">NexusSearch Engine</h3>
                    <p className="text-xs text-amber-400">Google-Style Instant CSE Knowledge Base</p>
                  </div>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-300 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span><strong>Instant Hotkey Access:</strong> Press <kbd className="px-1 py-0.5 rounded bg-slate-800 border border-slate-700 text-amber-300 font-mono">/</kbd> anywhere to trigger universal search.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span><strong>Rich Topic Cards:</strong> Displays Big-O time/space complexity badges, copy-ready code implementations, and ASCII diagrams.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span><strong>"I'm Feeling Lucky" Mode:</strong> Random deep-dive algorithmic flashcards for quick revision before lectures.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* SLIDE 6: Campus 2D Map */}
        {currentSlide === 6 && (
          <div className="flex flex-col justify-center py-4">
            <div className="text-xs font-mono uppercase tracking-wider text-rose-400 mb-2">{slide.badge}</div>
            <h2 className="text-3xl sm:text-5xl font-black text-white mb-6">{slide.title}</h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
              <div className="lg:col-span-2 p-5 rounded-2xl border border-rose-500/30 bg-slate-900/90 shadow-2xl relative">
                <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
                  <div className="text-xs font-mono font-bold text-rose-400 flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> 2D VECTOR CAMPUS MAP
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">Lovely Professional University</span>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center text-xs font-mono">
                  <div className="p-3 rounded-lg border border-slate-700 bg-slate-950/80">
                    <div className="font-bold text-amber-400">Block 34 (CSE)</div>
                    <div className="text-[10px] text-slate-400 mt-1">Noise: 🔇 Low (32dB)</div>
                    <div className="text-[10px] text-emerald-400">Wi-Fi: 📶 98Mbps</div>
                  </div>
                  <div className="p-3 rounded-lg border border-emerald-500/50 bg-emerald-950/20 shadow-lg shadow-emerald-500/10">
                    <div className="font-bold text-emerald-300">Central Library</div>
                    <div className="text-[10px] text-slate-400 mt-1">Noise: 🤫 Silent (18dB)</div>
                    <div className="text-[10px] text-emerald-400">Sockets: ⚡ 94% Free</div>
                  </div>
                  <div className="p-3 rounded-lg border border-slate-700 bg-slate-950/80">
                    <div className="font-bold text-orange-400">Uni-Mall Food Hub</div>
                    <div className="text-[10px] text-slate-400 mt-1">Noise: 📢 High (65dB)</div>
                    <div className="text-[10px] text-amber-400">Vibe: ☕ Social/Chill</div>
                  </div>
                </div>

                <div className="mt-4 p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">🚶 Walking Route: <strong className="text-white">BH4 Hostel ➔ Central Library (Floor 3)</strong></span>
                  <span className="text-emerald-400 font-bold">5 Mins • 380m</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60">
                  <div className="text-xs font-bold text-white mb-1">🎯 Live Noise & Crowd Meter</div>
                  <div className="text-xs text-slate-400">Avoid crowded blocks during exam weeks with live telemetry.</div>
                </div>
                <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60">
                  <div className="text-xs font-bold text-white mb-1">⚡ Power Socket Finder</div>
                  <div className="text-xs text-slate-400">Find laptop charging spots across 600 acres instantly.</div>
                </div>
                <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60">
                  <div className="text-xs font-bold text-white mb-1">🗺️ Animated Route Steps</div>
                  <div className="text-xs text-slate-400">Never get lost finding new examination halls or lab blocks.</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SLIDE 7: Gamification & Streak */}
        {currentSlide === 7 && (
          <div className="flex flex-col justify-center py-4">
            <div className="text-xs font-mono uppercase tracking-wider text-orange-400 mb-2">{slide.badge}</div>
            <h2 className="text-3xl sm:text-5xl font-black text-white mb-6">{slide.title}</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/80">
                <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                  <Flame className="w-5 h-5 text-orange-500" /> GitHub-Style 18-Week Contribution Heatmap
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  Every Pomodoro completed, DSA problem solved, and doubt answered fills the student's personal semester heatmap. Turns academic work into verifiable proof-of-work.
                </p>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex gap-1 justify-center flex-wrap">
                  <div className="w-3.5 h-3.5 rounded bg-slate-800"></div>
                  <div className="w-3.5 h-3.5 rounded bg-amber-900"></div>
                  <div className="w-3.5 h-3.5 rounded bg-amber-600"></div>
                  <div className="w-3.5 h-3.5 rounded bg-amber-400"></div>
                  <div className="w-3.5 h-3.5 rounded bg-amber-300"></div>
                  <div className="w-3.5 h-3.5 rounded bg-amber-500"></div>
                  <div className="w-3.5 h-3.5 rounded bg-amber-400"></div>
                  <div className="w-3.5 h-3.5 rounded bg-amber-600"></div>
                  <div className="w-3.5 h-3.5 rounded bg-amber-300"></div>
                  <div className="w-3.5 h-3.5 rounded bg-amber-500"></div>
                  <div className="w-3.5 h-3.5 rounded bg-amber-400"></div>
                  <div className="w-3.5 h-3.5 rounded bg-amber-300"></div>
                </div>
                <div className="text-[11px] text-slate-400 text-center mt-2 font-mono">Current Streak: <strong>42 Days 🔥</strong> (Top 1% Campus Rank)</div>
              </div>

              <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/80">
                <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-400" /> Academic Karma & Token Economics
                </h3>
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between p-2.5 rounded bg-slate-950 border border-slate-800">
                    <span className="text-slate-300">💻 Solve Daily DSA Problem</span>
                    <span className="text-emerald-400 font-bold">+15 Credits</span>
                  </div>
                  <div className="flex justify-between p-2.5 rounded bg-slate-950 border border-slate-800">
                    <span className="text-slate-300">❓ Answer Peer Doubt</span>
                    <span className="text-amber-400 font-bold">+10 Credits</span>
                  </div>
                  <div className="flex justify-between p-2.5 rounded bg-slate-950 border border-slate-800">
                    <span className="text-slate-300">🤖 Complete NexusAI Quiz</span>
                    <span className="text-sky-400 font-bold">+5 Credits</span>
                  </div>
                  <div className="flex justify-between p-2.5 rounded bg-slate-950 border border-slate-800">
                    <span className="text-slate-300">⏱️ Complete 50m Focus Pod</span>
                    <span className="text-orange-400 font-bold">+8 Credits</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SLIDE 8: Tech Stack */}
        {currentSlide === 8 && (
          <div className="flex flex-col justify-center py-4">
            <div className="text-xs font-mono uppercase tracking-wider text-purple-400 mb-2">{slide.badge}</div>
            <h2 className="text-3xl sm:text-5xl font-black text-white mb-6">{slide.title}</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/80">
                <div className="text-xl mb-2">⚡</div>
                <h4 className="font-bold text-white text-sm">Next.js 16 + React 19</h4>
                <p className="text-xs text-slate-400 mt-1">App Router, Static Generation (SSG), Turbopack build optimization.</p>
              </div>

              <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/80">
                <div className="text-xl mb-2">🟢</div>
                <h4 className="font-bold text-white text-sm">Supabase Realtime</h4>
                <p className="text-xs text-slate-400 mt-1">PostgreSQL engine, Row-Level Security, WebSocket sync for live rooms & chats.</p>
              </div>

              <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/80">
                <div className="text-xl mb-2">🎨</div>
                <h4 className="font-bold text-white text-sm">Tailwind CSS + Lucide</h4>
                <p className="text-xs text-slate-400 mt-1">Cyberpunk glassmorphism, responsive mobile drawers, dark/light dynamic tokens.</p>
              </div>

              <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/80">
                <div className="text-xl mb-2">🚀</div>
                <h4 className="font-bold text-white text-sm">Vercel Edge Global CDN</h4>
                <p className="text-xs text-slate-400 mt-1">Automated CI/CD deployments, sub-50ms latency across India.</p>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-purple-500/30 bg-purple-950/20 text-xs font-mono flex items-center justify-between">
              <span className="text-purple-300">📊 Lighthouse Performance: <strong className="text-white">100/100</strong> • Accessibility: <strong className="text-white">98/100</strong> • SEO: <strong className="text-white">100/100</strong></span>
              <span className="text-emerald-400 font-bold">100% Type-Safe TypeScript</span>
            </div>
          </div>
        )}

        {/* SLIDE 9: Market Impact */}
        {currentSlide === 9 && (
          <div className="flex flex-col justify-center py-4">
            <div className="text-xs font-mono uppercase tracking-wider text-teal-400 mb-2">{slide.badge}</div>
            <h2 className="text-3xl sm:text-5xl font-black text-white mb-6">{slide.title}</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
              <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/80 text-center">
                <div className="text-4xl font-black text-amber-400 font-mono mb-1">3.8x</div>
                <div className="text-sm font-bold text-white">Focus Time Increase</div>
                <div className="text-xs text-slate-400 mt-2">Synchronized group sprints significantly reduce phone distractions.</div>
              </div>

              <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/80 text-center">
                <div className="text-4xl font-black text-emerald-400 font-mono mb-1">&lt; 15 min</div>
                <div className="text-sm font-bold text-white">Doubt Turnaround</div>
                <div className="text-xs text-slate-400 mt-2">NexusAI + peer bounty board solves blockers instantly without waiting for faculty office hours.</div>
              </div>

              <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/80 text-center">
                <div className="text-4xl font-black text-sky-400 font-mono mb-1">1,000+</div>
                <div className="text-sm font-bold text-white">Universities Scalability</div>
                <div className="text-xs text-slate-400 mt-2">Architecture built for modular plug-and-play expansion to IITs, NITs, and private universities.</div>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-teal-500/20 bg-teal-500/5 text-xs text-slate-300">
              💡 <strong className="text-white">Business Potential:</strong> University enterprise licensing for attendance tracking & study analytics, campus recruitment talent pipelines, and sponsored hackathon challenge integrations.
            </div>
          </div>
        )}

        {/* SLIDE 10: Roadmap & Demo */}
        {currentSlide === 10 && (
          <div className="flex flex-col items-center text-center justify-center py-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono mb-6">
              {slide.badge}
            </div>
            <h2 className="text-4xl sm:text-6xl font-black text-white mb-6">{slide.title}</h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl w-full mb-8 text-left">
              <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/80">
                <div className="text-xs font-mono text-emerald-400 font-bold mb-1">PHASE 1 (COMPLETED)</div>
                <div className="text-sm font-bold text-white">MVP & Core Engines</div>
                <div className="text-xs text-slate-400 mt-1">Rooms, NexusAI, Campus 2D Map, DSA compiler, Heatmap, Mobile PWA.</div>
              </div>
              <div className="p-4 rounded-xl border border-amber-500/40 bg-amber-500/10">
                <div className="text-xs font-mono text-amber-400 font-bold mb-1">PHASE 2 (Q2 2026)</div>
                <div className="text-sm font-bold text-white">Audio/Video Mesh</div>
                <div className="text-xs text-slate-400 mt-1">WebRTC voice study pods, automated CA evaluator, hostel study squads.</div>
              </div>
              <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/80">
                <div className="text-xs font-mono text-sky-400 font-bold mb-1">PHASE 3 (Q3 2026)</div>
                <div className="text-sm font-bold text-white">Pan-India Network</div>
                <div className="text-xs text-slate-400 mt-1">Cross-university inter-college hackathons & placement battlegrounds.</div>
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-amber-500/40 bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 max-w-xl w-full">
              <h3 className="text-xl font-bold text-white mb-2">Ready for Live Demonstration</h3>
              <p className="text-xs text-slate-300 mb-4">Explore all 8 live modules right now on the deployed web app.</p>
              <div className="flex items-center justify-center gap-3">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/30 hover:bg-amber-400 transition"
                >
                  <span>Launch Live Platform</span>
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Speaker Notes Drawer */}
      {showNotes && (
        <div className="relative z-20 border-t border-slate-800 bg-slate-900/95 backdrop-blur-md px-6 py-4 animate-slideDown">
          <div className="max-w-6xl mx-auto flex items-start justify-between gap-4">
            <div>
              <div className="text-xs font-mono uppercase font-bold text-amber-400 mb-1 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" /> Speaker Notes (Slide {currentSlide})
              </div>
              <div className="text-xs text-slate-300 leading-relaxed font-sans max-w-4xl">
                {slide.notes}
              </div>
            </div>
            <button
              onClick={() => setShowNotes(false)}
              className="text-slate-400 hover:text-white text-xs font-mono px-2 py-1 bg-slate-800 rounded"
            >
              Close (N)
            </button>
          </div>
        </div>
      )}

      {/* Slide Navigation Footer */}
      <footer className="relative z-30 border-t border-slate-800/80 bg-slate-900/80 backdrop-blur-md px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Dot Indicators */}
        <div className="flex items-center gap-1.5 order-2 sm:order-1">
          {slidesData.map((s) => (
            <button
              key={s.id}
              onClick={() => setCurrentSlide(s.id)}
              className={`h-2.5 rounded-full transition-all duration-200 ${
                s.id === currentSlide ? 'bg-amber-400 w-7 shadow-sm shadow-amber-400/50' : 'bg-slate-700 hover:bg-slate-500 w-2.5'
              }`}
              title={`Go to Slide ${s.id}`}
            />
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center gap-3 order-1 sm:order-2 w-full sm:w-auto justify-between sm:justify-end">
          <button
            onClick={prevSlide}
            disabled={currentSlide === 1}
            className={`px-5 py-2.5 rounded-xl border text-xs font-bold transition flex items-center gap-2 ${
              currentSlide === 1
                ? 'border-slate-800 bg-slate-900/40 text-slate-600 cursor-not-allowed'
                : 'border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white shadow-sm'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
            <kbd className="hidden md:inline px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-[10px] text-slate-400 font-mono">←</kbd>
          </button>
          
          <button
            onClick={nextSlide}
            disabled={currentSlide === totalSlides}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold transition shadow-lg flex items-center gap-2 ${
              currentSlide === totalSlides
                ? 'border border-slate-800 bg-slate-900/40 text-slate-600 cursor-not-allowed'
                : 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-amber-500/20 hover:scale-105 active:scale-95'
            }`}
          >
            <span>Next</span>
            <kbd className="hidden md:inline px-1.5 py-0.5 rounded bg-amber-600/30 border border-amber-950/20 text-[10px] text-slate-950 font-mono font-black">→</kbd>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </footer>
    </div>
  );
}

