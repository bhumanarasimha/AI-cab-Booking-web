import React, { useState, useEffect } from 'react';
import { ShieldCheck, Cpu, RefreshCw, AlertTriangle, AlertOctagon, Terminal } from 'lucide-react';
import axios from 'axios';

export default function AdminTuner() {
  const [context, setContext] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  
  // Slider states
  const [trafficIndex, setTrafficIndex] = useState(6);
  const [precipitation, setPrecipitation] = useState(10);
  const [demandIndex, setDemandIndex] = useState(5);
  const [isPeakHour, setIsPeakHour] = useState(false);

  const fetchContext = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/context');
      const ctx = response.data.context;
      setContext(ctx);
      setLogs(response.data.logs);
      
      setTrafficIndex(ctx.trafficIndex);
      setPrecipitation(ctx.precipitation);
      setDemandIndex(ctx.demandIndex);
      setIsPeakHour(ctx.isPeakHour);
    } catch (err) {
      console.error('Error fetching admin context:', err);
    }
  };

  useEffect(() => {
    fetchContext();
  }, []);

  const handleTune = async (updates: any) => {
    try {
      const response = await axios.post('http://localhost:5000/api/admin/tune', {
        trafficIndex,
        precipitation,
        demandIndex,
        isPeakHour,
        ...updates
      });
      if (response.data.success) {
        setContext(response.data.context);
        setLogs(response.data.logs);
      }
    } catch (err) {
      console.error('Error tuning environment:', err);
    }
  };

  if (!context) return <div className="p-8 text-center text-xs text-zinc-500 font-mono">Loading telemetry controls...</div>;

  return (
    <div className="flex-1 p-6 lg:p-8 flex flex-col gap-6 overflow-y-auto h-screen bg-[#09090b]">
      {/* Header bar */}
      <div>
        <h1 className="font-outfit text-2xl font-black text-white">Admin Control</h1>
        <p className="text-zinc-500 text-xs mt-0.5">Tune environmental vectors to simulate dynamic EMMDE predictions and surge indexes.</p>
      </div>

      <div className="grid grid-cols-12 gap-6 items-stretch">
        
        {/* Environment Sliders Panel */}
        <div className="col-span-12 lg:col-span-6 glass-panel p-6 rounded-3xl bg-zinc-950/40 border-zinc-800/40 flex flex-col gap-6">
          <h3 className="font-outfit text-sm font-extrabold text-white flex items-center gap-2 border-b border-zinc-800/40 pb-3">
            <Cpu className="w-4.5 h-4.5 text-cyan-400" />
            Aether Environment Simulator
          </h3>

          <div className="flex flex-col gap-5">
            {/* Traffic Index */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-zinc-400 font-outfit">Simulated Congestion (Traffic Index)</span>
                <span className="text-cyan-400 font-mono font-bold">{trafficIndex} / 10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={trafficIndex}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  setTrafficIndex(val);
                  handleTune({ trafficIndex: val });
                }}
                className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <span className="text-[10px] text-zinc-600 font-medium">Controls road delay multipliers. Higher indexes increase cab and auto durations.</span>
            </div>

            {/* Precipitation */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-zinc-400 font-outfit">Simulated Precipitation (Rain)</span>
                <span className="text-cyan-400 font-mono font-bold">{precipitation}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={precipitation}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  setPrecipitation(val);
                  handleTune({ precipitation: val });
                }}
                className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <span className="text-[10px] text-zinc-600 font-medium">Increases cancellation risks and caps HEWRO multimodal comforts.</span>
            </div>

            {/* Demand index */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-zinc-400 font-outfit">Simulated Surging Demand</span>
                <span className="text-cyan-400 font-mono font-bold">{demandIndex} / 10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={demandIndex}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  setDemandIndex(val);
                  handleTune({ demandIndex: val });
                }}
                className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <span className="text-[10px] text-zinc-600 font-medium">Multiplies base fares (Uber, Ola, Rapido) due to localized vehicle scarcity.</span>
            </div>

            {/* Peak Hour Toggle */}
            <div className="flex justify-between items-center bg-zinc-900/35 p-3 rounded-2xl border border-zinc-800/40 mt-1">
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-bold text-white font-outfit">Simulate Rush Hour Surge</span>
                <span className="text-[9px] text-zinc-500">Adds an automatic +12% cancellation risk across drivers.</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPeakHour}
                  onChange={(e) => {
                    const val = e.target.checked;
                    setIsPeakHour(val);
                    handleTune({ isPeakHour: val });
                  }}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-zinc-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-zinc-400 after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-500 peer-checked:after:bg-zinc-950"></div>
              </label>
            </div>
          </div>
        </div>

        {/* System Logs / Fraud Shield Terminal Column */}
        <div className="col-span-12 lg:col-span-6 glass-panel p-6 rounded-3xl bg-zinc-950/40 border-zinc-800/40 flex flex-col gap-4">
          <h3 className="font-outfit text-sm font-extrabold text-white flex items-center gap-2 border-b border-zinc-800/40 pb-3">
            <Terminal className="w-4.5 h-4.5 text-purple-400" />
            Security Shield anomaly logs
          </h3>
          
          <div className="flex-1 bg-zinc-950/90 border border-zinc-850 rounded-2xl p-4 font-mono text-[10px] text-zinc-400 overflow-y-auto flex flex-col gap-3 min-h-[300px]">
            {logs.map((log, index) => {
              let typeColor = 'text-cyan-400';
              if (log.type === 'warning') typeColor = 'text-amber-400';
              if (log.type === 'danger') typeColor = 'text-rose-400';
              if (log.type === 'success') typeColor = 'text-emerald-400';

              return (
                <div key={index} className="flex gap-3 items-start border-b border-zinc-900/30 pb-2">
                  <span className="text-zinc-600 select-none">[{log.timestamp}]</span>
                  <span className={typeColor}>{log.message}</span>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
