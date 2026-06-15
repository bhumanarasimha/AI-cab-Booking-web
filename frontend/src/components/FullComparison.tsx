import React, { useState } from 'react';
import { Sparkles, ArrowRight, ShieldCheck, ShieldAlert, Cpu, Layers, HelpCircle, ArrowUpDown } from 'lucide-react';

interface RideOption {
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
}

interface FullComparisonProps {
  prediction: any;
  onBookRide: (option: any) => void;
}

export default function FullComparison({ prediction, onBookRide }: FullComparisonProps) {
  const [activeTab, setActiveTab] = useState<'smart' | 'cheapest' | 'fastest'>('smart');

  // Realistic fallback data if no search has been executed
  const allOptions: RideOption[] = prediction?.allOptions || [
    {
      name: "Rapido Bike",
      provider: "Rapido",
      mode: "Bike",
      fare: 55,
      duration: 12,
      surgeMultiplier: 1.0,
      stability: { cancellationProbability: 6, stabilityScore: 94, status: "High Stability" },
      effort: { effortScore: 18, description: "Minimal effort, helmet provided", metrics: { walkDistanceMeters: 40, waitTimeMinutes: 3, transitionsCount: 0 } },
      recommendationScore: 92
    },
    {
      name: "Aether Multimodal (Metro + Bike)",
      provider: "Aether",
      mode: "Multimodal",
      fare: 65,
      duration: 15,
      surgeMultiplier: 1.0,
      stability: { cancellationProbability: 2, stabilityScore: 98, status: "Ultra Stable" },
      effort: { effortScore: 45, description: "Active walk & transition required", metrics: { walkDistanceMeters: 450, waitTimeMinutes: 4, transitionsCount: 1 } },
      recommendationScore: 89
    },
    {
      name: "Ola Auto",
      provider: "Ola",
      mode: "Auto",
      fare: 110,
      duration: 18,
      surgeMultiplier: 1.1,
      stability: { cancellationProbability: 12, stabilityScore: 92, status: "Stable" },
      effort: { effortScore: 24, description: "Minimal walking, wait at corner", metrics: { walkDistanceMeters: 80, waitTimeMinutes: 4, transitionsCount: 0 } },
      recommendationScore: 94
    },
    {
      name: "Uber Auto",
      provider: "Uber",
      mode: "Auto",
      fare: 115,
      duration: 18,
      surgeMultiplier: 1.15,
      stability: { cancellationProbability: 15, stabilityScore: 88, status: "Stable" },
      effort: { effortScore: 26, description: "Walk 100m to pick spot", metrics: { walkDistanceMeters: 100, waitTimeMinutes: 5, transitionsCount: 0 } },
      recommendationScore: 86
    },
    {
      name: "Uber Premier",
      provider: "Uber",
      mode: "Cab",
      fare: 240,
      duration: 16,
      surgeMultiplier: 1.25,
      stability: { cancellationProbability: 8, stabilityScore: 95, status: "Highly Stable" },
      effort: { effortScore: 12, description: "Door-to-door comfort, AC", metrics: { walkDistanceMeters: 20, waitTimeMinutes: 6, transitionsCount: 0 } },
      recommendationScore: 78
    }
  ];

  // Sort logic based on selected tab
  const sortedOptions = [...allOptions].sort((a, b) => {
    if (activeTab === 'cheapest') {
      return a.fare - b.fare;
    }
    if (activeTab === 'fastest') {
      return a.duration - b.duration;
    }
    // 'smart' (default EMMDE recommendation score)
    return b.recommendationScore - a.recommendationScore;
  });

  // Helper values to assign tags
  const lowestPrice = Math.min(...allOptions.map(o => o.fare));
  const lowestDuration = Math.min(...allOptions.map(o => o.duration));
  const highestScore = Math.max(...allOptions.map(o => o.recommendationScore));

  return (
    <div className="flex-1 p-6 lg:p-8 flex flex-col gap-6 overflow-y-auto h-screen bg-[#0B0F1A]">
      
      {/* Header bar */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-outfit text-2xl font-black text-white flex items-center gap-2">
            <Layers className="w-6 h-6 text-purple-400" />
            Full Provider Comparison
          </h1>
          <p className="text-zinc-500 text-xs mt-0.5">Real-time fares, ETA ratings, and effort indexes.</p>
        </div>
        
        {/* Sort/Filter Tabs */}
        <div className="flex bg-zinc-950/60 p-1 border border-zinc-800/80 rounded-2xl">
          <button
            onClick={() => setActiveTab('smart')}
            className={`px-4 py-2 text-xxs font-bold font-outfit uppercase tracking-wider rounded-xl transition-all border-none cursor-pointer ${
              activeTab === 'smart' 
                ? 'bg-purple-600 text-white shadow-glow-purple' 
                : 'text-zinc-500 hover:text-zinc-300 bg-transparent'
            }`}
          >
            Smart Choice
          </button>
          <button
            onClick={() => setActiveTab('cheapest')}
            className={`px-4 py-2 text-xxs font-bold font-outfit uppercase tracking-wider rounded-xl transition-all border-none cursor-pointer ${
              activeTab === 'cheapest' 
                ? 'bg-purple-600 text-white shadow-glow-purple' 
                : 'text-zinc-500 hover:text-zinc-300 bg-transparent'
            }`}
          >
            Cheapest
          </button>
          <button
            onClick={() => setActiveTab('fastest')}
            className={`px-4 py-2 text-xxs font-bold font-outfit uppercase tracking-wider rounded-xl transition-all border-none cursor-pointer ${
              activeTab === 'fastest' 
                ? 'bg-purple-600 text-white shadow-glow-purple' 
                : 'text-zinc-500 hover:text-zinc-300 bg-transparent'
            }`}
          >
            Fastest
          </button>
        </div>
      </div>

      {/* Cards list */}
      <div className="flex flex-col gap-4 max-w-4xl">
        {sortedOptions.map((option) => {
          const isCheapest = option.fare === lowestPrice;
          const isFastest = option.duration === lowestDuration;
          const isAIPick = option.recommendationScore === highestScore;

          let providerBg = 'bg-white text-zinc-950';
          if (option.provider === 'Ola') providerBg = 'bg-[#d4fc34] text-zinc-950';
          if (option.provider === 'Rapido') providerBg = 'bg-[#fcd116] text-zinc-950';
          if (option.provider === 'Aether') providerBg = 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white';

          return (
            <div 
              key={option.name} 
              className={`glass-panel p-5 rounded-2xl flex flex-col gap-4 border transition-all ${
                isAIPick 
                  ? 'border-purple-500/30 bg-purple-500/5 shadow-[0_0_20px_rgba(139,92,246,0.05)]' 
                  : 'border-zinc-800/40'
              }`}
            >
              
              {/* Main row */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                
                {/* Brand and duration details */}
                <div className="flex items-center gap-4">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-black text-sm font-outfit shrink-0 ${providerBg}`}>
                    {option.provider.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h3 className="font-outfit text-md font-extrabold text-white">{option.name}</h3>
                      
                      {/* Tags */}
                      <div className="flex gap-1.5">
                        {isAIPick && (
                          <span className="px-2 py-0.5 bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[9px] font-black rounded-md font-outfit uppercase">
                            AI Pick
                          </span>
                        )}
                        {isCheapest && (
                          <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black rounded-md font-outfit uppercase">
                            Cheapest
                          </span>
                        )}
                        {isFastest && (
                          <span className="px-2 py-0.5 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[9px] font-black rounded-md font-outfit uppercase">
                            Fastest
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2.5 text-[11px] text-zinc-500 mt-1 font-mono">
                      <span>{option.mode} ride</span>
                      <span>•</span>
                      <span>ETA: <strong className="text-zinc-300 font-semibold">{option.duration} mins</strong></span>
                      <span>•</span>
                      <span>Surge: {option.surgeMultiplier}x</span>
                    </div>
                  </div>
                </div>

                {/* Right side: Price & Booking Action */}
                <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-6 border-t md:border-none border-zinc-800/40 pt-3 md:pt-0">
                  <div className="text-left md:text-right">
                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Est. Fare</span>
                    <span className="text-xl font-black text-white font-outfit">₹{option.fare}</span>
                  </div>
                  
                  <button
                    onClick={() => onBookRide(option)}
                    className="flex items-center gap-2 px-4.5 py-2.5 bg-zinc-900/60 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-white rounded-xl text-xs font-bold font-outfit cursor-pointer transition-all"
                  >
                    <span>Book Ride</span>
                    <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />
                  </button>
                </div>
              </div>

              {/* Advanced Decision Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-zinc-850 pt-4 text-[11px] font-outfit">
                
                <div className="flex flex-col">
                  <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-wider mb-0.5">Stability Score</span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></div>
                    <span className="font-semibold text-white">{option.stability.stabilityScore} / 100</span>
                  </div>
                </div>

                <div className="flex flex-col">
                  <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-wider mb-0.5">Cancellation Risk</span>
                  <span className={`font-semibold ${option.stability.cancellationProbability > 15 ? 'text-rose-400' : 'text-zinc-300'}`}>
                    {option.stability.cancellationProbability}% probability
                  </span>
                </div>

                <div className="flex flex-col">
                  <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-wider mb-0.5">Human Effort (HEWRO)</span>
                  <span className="font-semibold text-zinc-300">{option.effort.description} ({option.effort.effortScore} pts)</span>
                </div>

                <div className="flex flex-col">
                  <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-wider mb-0.5">EMMDE AI Match Score</span>
                  <div className="w-full bg-zinc-850 h-1.5 rounded-full mt-1 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full"
                      style={{ width: `${option.recommendationScore}%` }}
                    ></div>
                  </div>
                </div>

              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
