import React from 'react';
import { ShieldCheck, ShieldAlert, Sparkles, Navigation, Clock, UserCheck } from 'lucide-react';

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

interface RidesCompareProps {
  options: RideOption[];
  onSelectOption: (option: RideOption) => void;
  selectedOptionName?: string;
  bestOptionName?: string;
  onBookRide: (option: RideOption) => void;
}

export default function RidesCompare({ 
  options, 
  onSelectOption, 
  selectedOptionName, 
  bestOptionName,
  onBookRide
}: RidesCompareProps) {
  return (
    <div className="flex flex-col gap-3 h-full overflow-y-auto pr-1">
      {options.map((option) => {
        const isBest = option.name === bestOptionName;
        const isSelected = option.name === selectedOptionName;
        
        let providerBg = 'bg-white text-zinc-950';
        if (option.provider === 'Ola') providerBg = 'bg-[#d4fc34] text-zinc-950';
        if (option.provider === 'Rapido') providerBg = 'bg-[#fcd116] text-zinc-950';
        if (option.provider === 'Aether') providerBg = 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white';

        return (
          <div
            key={option.name}
            onClick={() => onSelectOption(option)}
            className={`p-4 rounded-2xl cursor-pointer border transition-all duration-200 flex flex-col gap-3 ${
              isSelected 
                ? 'bg-purple-500/5 border-purple-500/40' 
                : 'bg-zinc-900/30 border-zinc-800/40 hover:bg-zinc-900/60 hover:border-zinc-700/40'
            }`}
          >
            {/* Header segment */}
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs font-outfit ${providerBg}`}>
                  {option.provider.charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-white font-outfit">{option.name}</h4>
                  <div className="flex items-center gap-2 text-[10px] text-zinc-500 mt-0.5">
                    <span className="flex items-center gap-0.5">
                      <Clock className="w-3 h-3" />
                      {option.duration} mins
                    </span>
                    <span>•</span>
                    <span>Surge: {option.surgeMultiplier}x</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className="text-md font-black text-white font-outfit block">₹{option.fare}</span>
                <span className="text-[10px] text-zinc-500 font-medium">Est. Total</span>
              </div>
            </div>

            {/* Metrics segment */}
            <div className="grid grid-cols-3 gap-2 border-t border-zinc-800/40 pt-3">
              <div className="flex flex-col">
                <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-wider mb-0.5">Stability</span>
                <div className="flex items-center gap-1">
                  <ShieldCheck className={`w-3.5 h-3.5 ${
                    option.stability.status === 'Stable' ? 'text-emerald-400' : 'text-amber-400'
                  }`} />
                  <span className="text-[11px] font-bold text-white">{option.stability.stabilityScore}★</span>
                </div>
              </div>

              <div className="flex flex-col">
                <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-wider mb-0.5">Effort Score</span>
                <span className="text-[11px] font-bold text-zinc-300">{option.effort.effortScore} / 100</span>
              </div>

              <div className="flex flex-col">
                <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-wider mb-0.5">Match Score</span>
                <span className="text-[11px] font-black text-purple-400 font-outfit">{option.recommendationScore}%</span>
              </div>
            </div>

            {/* Footer buttons / triggers */}
            <div className="flex items-center justify-between mt-1 pt-2 border-t border-dashed border-zinc-800/30">
              <span className={`text-[10px] font-semibold flex items-center gap-1 ${
                option.stability.cancellationProbability > 50 ? 'text-red-400' : 'text-zinc-500'
              }`}>
                {option.stability.cancellationProbability}% cancellation risk
              </span>
              
              <div className="flex gap-2">
                {isBest && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-black rounded-lg font-outfit uppercase">
                    <Sparkles className="w-3 h-3 animate-pulse" />
                    AI Best Value
                  </span>
                )}
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onBookRide(option);
                  }}
                  className="px-3 py-1 bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white rounded-lg text-[10px] font-bold font-outfit shadow-glow-purple border-none cursor-pointer"
                >
                  Book Ride
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
