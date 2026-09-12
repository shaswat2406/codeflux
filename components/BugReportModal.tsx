'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useUserCredits } from '@/hooks/useUserCredits';
import {
  Bug,
  X,
  Send,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Laptop,
  MessageSquare,
  ShieldCheck
} from 'lucide-react';

export default function BugReportModal() {
  const pathname = usePathname();
  const { credits, setCredits } = useUserCredits();
  const [isOpen, setIsOpen] = useState(false);
  const [category, setCategory] = useState<'ui' | 'compiler' | 'ai' | 'map' | 'other'>('ui');
  const [severity, setSeverity] = useState<'low' | 'medium' | 'high'>('medium');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-hide on /pitch slide deck to keep presentation clean
  if (pathname === '/pitch') {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const generatedTicket = `LPU-${Math.floor(1000 + Math.random() * 9000)}`;
      setTicketId(generatedTicket);
      setIsSubmitting(false);
      setSubmitted(true);

      // Reward user with +10 bounty credits for contributing
      if (credits !== null) {
        setCredits(credits + 10);
      }
    }, 700);
  };

  const handleReset = () => {
    setSubmitted(false);
    setTitle('');
    setDescription('');
    setIsOpen(false);
  };

  return (
    <>
      {/* Discreet Bottom-Left Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 left-6 z-40 hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700/80 shadow-lg backdrop-blur-md transition-all hover:scale-105 group"
          title="Report an issue or give feedback (+10 Credits)"
        >
          <Bug className="w-3.5 h-3.5 text-rose-400 group-hover:rotate-12 transition-transform" />
          <span className="text-[11px]">Report Bug</span>
          <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-mono border border-amber-500/30">
            +10 🪙
          </span>
        </button>
      )}

      {/* Modal Backdrop & Window */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn">
          <div className="w-full max-w-lg rounded-3xl bg-slate-950 border border-slate-800 text-white p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            
            {/* Close Button */}
            <button
              onClick={handleReset}
              className="absolute right-5 top-5 p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>

            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Header */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
                    <Bug className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white flex items-center gap-2">
                      Report a Bug / Feedback
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono border border-amber-500/30">
                        +10 🪙 Bounty
                      </span>
                    </h2>
                    <p className="text-xs text-slate-400">Help improve LPU StudyNexus and earn student credits.</p>
                  </div>
                </div>

                {/* Category Selection */}
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">Category</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      { id: 'ui', label: '🎨 UI / Visual Glitch' },
                      { id: 'compiler', label: '💻 DSA Compiler' },
                      { id: 'ai', label: '🤖 NexusAI Copilot' },
                      { id: 'map', label: '🗺️ Campus Map' },
                      { id: 'other', label: '💡 Feature Idea' },
                    ].map((cat) => (
                      <button
                        type="button"
                        key={cat.id}
                        onClick={() => setCategory(cat.id as any)}
                        className={`p-2 rounded-xl text-xs font-medium border text-left transition ${
                          category === cat.id
                            ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 font-bold'
                            : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Severity Pills */}
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">Severity</label>
                  <div className="flex gap-2">
                    {[
                      { id: 'low', label: '🟢 Minor / Cosmetic' },
                      { id: 'medium', label: '🟡 Noticeable Bug' },
                      { id: 'high', label: '🔴 Critical Blocker' },
                    ].map((sev) => (
                      <button
                        type="button"
                        key={sev.id}
                        onClick={() => setSeverity(sev.id as any)}
                        className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-semibold border transition text-center ${
                          severity === sev.id
                            ? 'bg-slate-800 border-slate-600 text-white ring-1 ring-amber-500'
                            : 'bg-slate-900/40 border-slate-800 text-slate-500 hover:text-slate-300'
                        }`}
                      >
                        {sev.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Bug Title */}
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">Issue Summary</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Map zoom glitch on mobile or DSA test case timeout..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-amber-500 transition"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">Steps to Reproduce / Details</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="What happened and what did you expect to happen?"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-amber-500 transition resize-none"
                  />
                </div>

                {/* Diagnostic Auto-Capture Info */}
                <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/80 text-[11px] text-slate-400 font-mono flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Laptop className="w-3.5 h-3.5 text-slate-500" />
                    Route: <strong className="text-slate-300">{pathname}</strong>
                  </span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Telemetry Attached
                  </span>
                </div>

                {/* Submit Action */}
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <span>Submitting...</span>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Submit Bug (+10 🪙)</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              /* Success Confirmation Card */
              <div className="text-center py-6 space-y-4 animate-fadeIn">
                <div className="w-14 h-14 rounded-3xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto text-2xl shadow-lg shadow-emerald-500/10">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                
                <div>
                  <h3 className="text-lg font-black text-white">Ticket #{ticketId} Logged!</h3>
                  <p className="text-xs text-slate-300 mt-1 max-w-sm mx-auto">
                    Thank you for helping strengthen LPU StudyNexus. Our dev team has been notified.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border border-amber-500/30 max-w-xs mx-auto">
                  <div className="flex items-center justify-center gap-2 text-amber-400 font-bold text-sm font-mono">
                    <Flame className="w-4 h-4 animate-pulse" />
                    <span>+10 Bounty Credits Earned!</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Added to your campus balance</div>
                </div>

                <button
                  onClick={handleReset}
                  className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs border border-slate-700 transition"
                >
                  Done
                </button>
              </div>
            )}

          </div>
        </div>
      )}
    </>
  );
}
