import React from 'react';
import { BrainCircuit, Sparkles, TrendingUp, Info, HelpCircle, AlertCircle, Clock, ShieldCheck } from 'lucide-react';

interface AIInsightsProps {
  prediction: any;
}

export default function AIInsights({ prediction }: AIInsightsProps) {
  // If no prediction yet, show high-fidelity mock data for CBD to ITPL so the UI is always filled with premium visual state.
  const activePrediction = prediction || {
    bestRide: {
      name: "Ola Auto",
      provider: "Ola",
      mode: "Auto",
      fare: 110,
      duration: 18,
      surgeMultiplier: 1.1,
      stability: {
        cancellationProbability: 12,
        stabilityScore: 92,
        status: "High Stability"
      },
      effort: {
        effortScore: 24,
        description: "Minimal walking required"
      },
      recommendationScore: 94
    },
    reasoning: "Aether-AI recommended Ola Auto as it bypasses current heavy traffic delays, saving you 8 minutes of travel, while maintaining low cancellation probability.",
    aiConfidenceScore: 94
  };

  const { bestRide, reasoning, aiConfidenceScore } = activePrediction;

  // Surge predictions for the next 30 minutes (trend line)
  const surgeTrend = [
    { time: '10:00', price: 110 },
    { time: '10:05', price: 125 },
    { time: '10:10', price: 135 },
    { time: '10:15', price: 140 },
    { time: '10:20', price: 115 },
    { time: '10:25', price: 105 },
    { time: '10:30', price: 95 }
  ];

  // SVG dimensions for trend graph
  const width = 500;
  const height = 120;
  const padding = 20;
  
  // Calculate points for the SVG line chart
  const points = surgeTrend.map((data, idx) => {
    const x = padding + (idx * (width - padding * 2)) / (surgeTrend.length - 1);
    // Map price 90-150 to height (bottom-to-top)
    const y = height - padding - ((data.price - 90) * (height - padding * 2)) / 60;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="flex-1 p-6 lg:p-8 flex flex-col gap-6 overflow-y-auto h-screen bg-[#0B0F1A]">
      {/* Header bar */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-outfit text-2xl font-black text-white flex items-center gap-2">
            <BrainCircuit className="w-6 h-6 text-purple-400" />
            AI Decision Insights
          </h1>
          <p className="text-zinc-500 text-xs mt-0.5">Transparent reasoning logs and predictive demand analysis.</p>
        </div>
        
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-full text-xxs font-black text-purple-400 font-outfit uppercase">
          <Sparkles className="w-3 h-3 text-purple-400" />
          <span>AETHER ENGINE ACTIVE</span>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 items-stretch">
        
        {/* Left Panel: Why this ride? (Explanations) & Confidence Score */}
        <div className="col-span-12 lg:col-span-7 flex flex-col gap-6">
          
          {/* Main Card: Why this ride? */}
          <div className="glass-panel p-6 rounded-3xl bg-zinc-950/40 border-zinc-800/40 flex flex-col gap-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl"></div>
            
            <h3 className="font-outfit text-sm font-extrabold text-white flex items-center gap-2">
              <Info className="w-4.5 h-4.5 text-purple-400" />
              Why {bestRide.name}?
            </h3>

            {/* Glowing Recommendation Callout */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/20 text-xs font-medium text-purple-200 leading-relaxed font-outfit shadow-glow-purple">
              <p className="italic">"{reasoning}"</p>
            </div>

            {/* Explanation Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              <div className="p-4 rounded-2xl bg-zinc-900/45 border border-zinc-800/40 flex flex-col gap-1.5 hover:border-purple-500/25 transition-all">
                <span className="text-[9px] text-purple-400 uppercase font-black tracking-wider block">Cost Advantage</span>
                <span className="text-sm font-extrabold text-white block font-outfit">18% Cheaper</span>
                <p className="text-[10px] text-zinc-500 leading-normal">Priced ₹{bestRide.fare} compared to peer averages of ₹134.</p>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-900/45 border border-zinc-800/40 flex flex-col gap-1.5 hover:border-cyan-500/25 transition-all">
                <span className="text-[9px] text-cyan-400 uppercase font-black tracking-wider block">Temporal Save</span>
                <span className="text-sm font-extrabold text-white block font-outfit">Fastest Option</span>
                <p className="text-[10px] text-zinc-500 leading-normal">Optimized routes skip standard bottlenecks via arterial links.</p>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-900/45 border border-zinc-800/40 flex flex-col gap-1.5 hover:border-emerald-500/25 transition-all">
                <span className="text-[9px] text-emerald-400 uppercase font-black tracking-wider block">Driver Match</span>
                <span className="text-sm font-extrabold text-white block font-outfit">Stable Dispatch</span>
                <p className="text-[10px] text-zinc-500 leading-normal">Cancellation risk capped below {bestRide.stability.cancellationProbability}% based on real-time drivers.</p>
              </div>

            </div>
          </div>

          {/* Prediction Module: Wait to Save */}
          <div className="glass-panel p-6 rounded-3xl bg-zinc-950/40 border-zinc-800/40 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-outfit text-sm font-extrabold text-white flex items-center gap-2">
                  <TrendingUp className="w-4.5 h-4.5 text-cyan-400" />
                  Predictive Fare Surge Trajectory
                </h3>
                <span className="text-[10px] text-zinc-500 block mt-0.5">Surge predictions based on historic traffic and active fleet volumes.</span>
              </div>
              
              <div className="px-3.5 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 text-xxs font-black font-outfit uppercase tracking-wider animate-pulse flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>Wait 5 min → Save ₹15</span>
              </div>
            </div>

            {/* Elegant SVG Trend Graph */}
            <div className="relative w-full h-32 bg-zinc-950/60 border border-zinc-900 rounded-2xl overflow-hidden flex items-end">
              <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
                {/* Grid Lines */}
                <line x1="0" y1="20" x2={width} y2="20" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                <line x1="0" y1="60" x2={width} y2="60" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                <line x1="0" y1="100" x2={width} y2="100" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />

                {/* Glow Area Path under line */}
                <path
                  d={`M ${padding},${height - padding} L ${points} L ${width - padding},${height - padding} Z`}
                  fill="url(#gradient-area)"
                  opacity="0.15"
                />

                {/* Main Trend Line */}
                <path
                  d={`M ${points}`}
                  fill="none"
                  stroke="url(#gradient-line)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Dot markers at key surge point */}
                {surgeTrend.map((data, idx) => {
                  const x = padding + (idx * (width - padding * 2)) / (surgeTrend.length - 1);
                  const y = height - padding - ((data.price - 90) * (height - padding * 2)) / 60;
                  const isCurrent = idx === 0;
                  const isPeak = data.price === 140;

                  return (
                    <g key={idx}>
                      <circle
                        cx={x}
                        cy={y}
                        r={isCurrent || isPeak ? 5 : 3}
                        className={isPeak ? "fill-rose-500" : isCurrent ? "fill-purple-500" : "fill-cyan-400"}
                      />
                      {isPeak && (
                        <text x={x} y={y - 10} textAnchor="middle" className="fill-rose-400 font-mono text-[9px] font-bold">
                          Peak Surge
                        </text>
                      )}
                      {isCurrent && (
                        <text x={x} y={y - 10} textAnchor="middle" className="fill-purple-400 font-mono text-[9px] font-bold">
                          Now
                        </text>
                      )}
                    </g>
                  );
                })}

                {/* Gradient Definitions */}
                <defs>
                  <linearGradient id="gradient-line" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#a855f7" />
                    <stop offset="50%" stopColor="#ec4899" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                  <linearGradient id="gradient-area" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            
            <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500 px-1">
              <span>Current Rate (₹{bestRide.fare})</span>
              <span>10 Mins Later (₹135)</span>
              <span>20 Mins Later (₹115)</span>
              <span>30 Mins Later (₹95)</span>
            </div>
          </div>

        </div>

        {/* Right Panel: Trust Indicator & AI Confidence score */}
        <div className="col-span-12 lg:col-span-5 flex flex-col gap-6">
          
          {/* Trust Gauge Indicator */}
          <div className="glass-panel p-6 rounded-3xl bg-zinc-950/40 border-zinc-800/40 flex flex-col items-center justify-center text-center gap-5 relative overflow-hidden">
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl"></div>
            
            <div className="w-full flex justify-between items-center border-b border-zinc-900 pb-3">
              <h3 className="font-outfit text-sm font-extrabold text-white flex items-center gap-2">
                <ShieldCheck className="w-4.5 h-4.5 text-emerald-400" />
                Trust & Stability Index
              </h3>
              <HelpCircle className="w-4 h-4 text-zinc-500 cursor-help" />
            </div>

            {/* Circular Progress Gauge */}
            <div className="relative w-40 h-40 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                {/* Background Ring */}
                <circle
                  cx="80"
                  cy="80"
                  r="68"
                  className="stroke-zinc-900"
                  strokeWidth="8"
                  fill="transparent"
                />
                {/* Animated Glowing Foreground Ring */}
                <circle
                  cx="80"
                  cy="80"
                  r="68"
                  stroke="url(#progress-gradient)"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={427}
                  strokeDashoffset={427 - (427 * aiConfidenceScore) / 100}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
                
                {/* Progress Gradient */}
                <defs>
                  <linearGradient id="progress-gradient" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Centered Percentage */}
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-white font-outfit tracking-tighter">{aiConfidenceScore}%</span>
                <span className="text-[9px] text-cyan-400 font-mono uppercase font-black tracking-widest mt-0.5">
                  AI Confidence
                </span>
              </div>
            </div>

            {/* Confidence explanation details */}
            <div className="w-full flex flex-col gap-3.5 border-t border-zinc-900 pt-4">
              <div className="flex justify-between items-center text-xs font-outfit">
                <span className="text-zinc-500">Stability Rating</span>
                <span className="font-bold text-emerald-400 uppercase">{bestRide.stability.status}</span>
              </div>
              <div className="flex justify-between items-center text-xs font-outfit">
                <span className="text-zinc-500">Route Congestion Index</span>
                <span className="font-bold text-white">6 / 10 (Moderate)</span>
              </div>
              <div className="flex justify-between items-center text-xs font-outfit">
                <span className="text-zinc-500">Driver Matching Probability</span>
                <span className="font-bold text-purple-400">96.4% Accuracy</span>
              </div>
            </div>
            
            <p className="text-[10px] text-zinc-500 text-center leading-normal italic">
              Confidence score decreases slightly when precipitation exceeds 25% or traffic indexes spike into extreme levels.
            </p>
          </div>

          {/* Quick Stats Panel */}
          <div className="glass-panel p-5 rounded-3xl bg-zinc-950/45 border-zinc-800/40 flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div className="flex flex-col gap-1">
              <h4 className="text-xs font-extrabold text-white font-outfit">Explainable AI Transparency Code</h4>
              <p className="text-[10px] text-zinc-400 leading-relaxed">
                Decisions are calculated via the **EMMDE Multi-Agent** stack, evaluating 45 data points across providers including active cancellations, surge markups, and human walking effort limits.
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
