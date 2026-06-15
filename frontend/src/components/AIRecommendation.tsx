import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, ShieldAlert, Cpu, Clock, Wallet } from 'lucide-react';

interface AIRecommendationProps {
  prediction: {
    bestRide: {
      name: string;
      provider: string;
      mode: string;
      fare: number;
      duration: number;
      surgeMultiplier: number;
      stability: {
        cancellationProbability: number;
        stabilityScore: number;
        status: string;
      };
      effort: {
        effortScore: number;
        description: string;
        metrics: {
          walkDistanceMeters: number;
          waitTimeMinutes: number;
          transitionsCount: number;
        };
      };
      recommendationScore: number;
    };
    reasoning: string;
    aiConfidenceScore: number;
  } | null;
  onBookRide: (option: any) => void;
}

export default function AIRecommendation({ prediction, onBookRide }: AIRecommendationProps) {
  if (!prediction) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-zinc-550 font-medium py-12 glass-panel rounded-3xl border border-zinc-800/40">
        <Cpu className="w-8 h-8 text-zinc-750 animate-pulse mb-3" />
        <p className="text-xs font-mono">Awaiting route evaluation from EMMDE agent fleet...</p>
      </div>
    );
  }

  const { bestRide, reasoning, aiConfidenceScore } = prediction;

  return (
    <div className="glow-card-purple bg-gradient-to-b from-purple-500/10 to-zinc-950/90 rounded-3xl p-6 flex flex-col h-full justify-between relative overflow-hidden transition-all duration-300">
      
      {/* Background Animated Orb */}
      <div className="absolute -top-10 -right-10 w-44 h-44 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow"></div>

      <div>
        {/* Top Header Badge */}
        <div className="flex justify-between items-center mb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/20 border border-purple-500/35 rounded-full text-[10px] font-black text-purple-300 font-outfit uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
            <span>AI PICK • BEST OVERALL</span>
          </div>
          <div className="text-right">
            <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider block">Decision Match</span>
            <span className="text-sm font-black text-purple-400 font-outfit">{bestRide.recommendationScore}% Score</span>
          </div>
        </div>

        {/* Ride Name */}
        <h3 className="font-outfit text-2xl font-black text-white mb-1.5 leading-tight flex items-baseline gap-2">
          {bestRide.name}
        </h3>
        
        {/* Cost & ETA Hero Metrics */}
        <div className="grid grid-cols-2 gap-4 my-4 border-y border-zinc-900 py-3.5">
          <div className="flex flex-col">
            <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider mb-0.5">Optimized Price</span>
            <span className="text-2xl font-black text-white font-outfit">₹{bestRide.fare}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider mb-0.5">ETA / Duration</span>
            <span className="text-2xl font-black text-cyan-400 font-outfit flex items-center gap-1.5">
              <Clock className="w-5 h-5 text-cyan-400" />
              {bestRide.duration} min
            </span>
          </div>
        </div>

        {/* Reasoning Log */}
        <p className="text-xs text-zinc-350 leading-relaxed font-outfit bg-zinc-950/50 p-3.5 rounded-2xl border border-zinc-900/40">
          {reasoning}
        </p>
      </div>

      {/* Booking Dispatch */}
      <div className="flex items-center justify-between border-t border-zinc-900 pt-4 mt-4">
        <div className="flex flex-col">
          <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-wider block">Surge Index</span>
          <span className="text-xs font-bold font-mono text-zinc-300">{bestRide.surgeMultiplier}x markup</span>
        </div>
        
        <button
          onClick={() => onBookRide(bestRide)}
          className="glow-btn flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white rounded-xl text-xs font-black font-outfit shadow-glow-purple border-none cursor-pointer transform hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <span>Book Now</span>
          <ArrowRight className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  );
}
