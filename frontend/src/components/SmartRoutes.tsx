import React from 'react';
import { Sparkles, MapPin, Navigation, ArrowRight, ShieldCheck, Footprints, Train, Bike, Car, Compass } from 'lucide-react';
import MapContainer from './MapContainer';

interface SmartRoutesProps {
  pickup: string;
  dropoff: string;
  prediction: any;
}

export default function SmartRoutes({ pickup, dropoff, prediction }: SmartRoutesProps) {
  // Multimodal suggestions based on pickup & dropoff
  const suggestions = [
    {
      id: 'multimodal',
      title: 'Multimodal Optimal (Metro + Bike)',
      icon: Train,
      tag: 'Best Match',
      desc: 'Avoid bumper-to-bumper Outer Ring Road traffic.',
      steps: [
        { mode: 'walk', detail: 'Walk 150m to CBD Metro Gate-A' },
        { mode: 'train', detail: 'Metro Green Line (3 stations)' },
        { mode: 'bike', detail: 'Rapido Bike to tech park entrance' }
      ],
      time: '15 mins',
      cost: '₹65',
      savings: '₹175'
    },
    {
      id: 'walk-saver',
      title: 'Eco Walking Saver',
      icon: Footprints,
      tag: 'Cheapest Direct',
      desc: 'Board cab outside the CBD one-way loop.',
      steps: [
        { mode: 'walk', detail: 'Walk 250m to Main Junction Corner' },
        { mode: 'car', detail: 'Ola Auto direct route' }
      ],
      time: '21 mins',
      cost: '₹110',
      savings: '₹40'
    },
    {
      id: 'direct-cab',
      title: 'Direct Cab (Baseline)',
      icon: Car,
      tag: 'Comfort Pick',
      desc: 'Door-to-door service with maximum luggage comfort.',
      steps: [
        { mode: 'car', detail: 'Uber Premier straight corridor' }
      ],
      time: '16 mins',
      cost: '₹240',
      savings: '₹0'
    }
  ];

  return (
    <div className="flex-1 p-6 lg:p-8 flex flex-col gap-6 overflow-y-auto h-screen bg-[#0B0F1A]">
      {/* Header bar */}
      <div>
        <h1 className="font-outfit text-2xl font-black text-white flex items-center gap-2">
          <Compass className="w-6 h-6 text-purple-400" />
          Smart Routes & Multimodal Pathways
        </h1>
        <p className="text-zinc-500 text-xs mt-0.5">AI-suggested paths that bypass surge zones and reduce carbon footings.</p>
      </div>

      <div className="grid grid-cols-12 gap-6 items-stretch">
        
        {/* Left Column: AI suggested routes */}
        <div className="col-span-12 lg:col-span-5 flex flex-col gap-5 overflow-hidden">
          <div className="flex justify-between items-center">
            <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-500">Route Suggestions</span>
            <span className="text-[9px] text-cyan-400 font-mono uppercase">Sync active</span>
          </div>

          <div className="flex flex-col gap-4 overflow-y-auto pr-1">
            {suggestions.map((route) => {
              const Icon = route.icon;
              return (
                <div 
                  key={route.id}
                  className={`p-4.5 rounded-2xl border flex flex-col gap-3.5 transition-all bg-zinc-900/30 border-zinc-800/40 hover:bg-zinc-900/60`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/25 flex items-center justify-center text-purple-400">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-extrabold text-white font-outfit">{route.title}</h4>
                        <span className="text-[10px] text-zinc-500 mt-0.5 block">{route.desc}</span>
                      </div>
                    </div>
                    
                    <span className="px-2 py-0.5 bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[9px] font-black rounded-md font-outfit uppercase">
                      {route.tag}
                    </span>
                  </div>

                  {/* Route Steps Visualizer */}
                  <div className="flex items-center gap-2 flex-wrap pl-1">
                    {route.steps.map((step, idx) => (
                      <React.Fragment key={idx}>
                        <div className="flex items-center gap-1.5 bg-zinc-950/40 border border-zinc-800/60 px-2.5 py-1 rounded-xl text-xxs font-mono text-zinc-400">
                          {step.mode === 'walk' && <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></span>}
                          {step.mode === 'train' && <span className="w-1.5 h-1.5 bg-purple-400 rounded-full"></span>}
                          {step.mode === 'bike' && <span className="w-1.5 h-1.5 bg-amber-400 rounded-full"></span>}
                          {step.mode === 'car' && <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>}
                          <span>{step.detail}</span>
                        </div>
                        {idx < route.steps.length - 1 && (
                          <ArrowRight className="w-3 h-3 text-zinc-650" />
                        )}
                      </React.Fragment>
                    ))}
                  </div>

                  {/* Cost, Time and Savings */}
                  <div className="grid grid-cols-3 gap-2 border-t border-zinc-800/40 pt-3 text-xxs font-outfit">
                    <div className="flex flex-col">
                      <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-wider">Est. Duration</span>
                      <span className="font-extrabold text-white mt-0.5">{route.time}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-wider">Total Cost</span>
                      <span className="font-extrabold text-white mt-0.5">{route.cost}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-wider">AI Savings</span>
                      <span className="font-black text-cyan-400 mt-0.5">Save {route.savings}</span>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Visual Map Container */}
        <div className="col-span-12 lg:col-span-7 flex flex-col gap-5 h-full min-h-[380px]">
          <div className="flex justify-between items-center">
            <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-500">Live Traffic Mapping Shield</span>
            <span className="text-[9px] text-emerald-400 font-mono uppercase">GPS Lock secure</span>
          </div>
          
          <div className="flex-1 relative overflow-hidden rounded-3xl border border-zinc-800/40 min-h-[350px]">
            <MapContainer pickup={pickup} dropoff={dropoff} />
          </div>
        </div>

      </div>
    </div>
  );
}
