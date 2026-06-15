import React, { useEffect, useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line
} from 'recharts';
import { TrendingDown, Sparkles, Leaf, Coins, Zap, Users } from 'lucide-react';
import axios from 'axios';

export default function AnalyticsDashboard() {
  const [data, setData] = useState<any>(null);

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/analytics');
      setData(response.data.savings);
    } catch (err) {
      console.error('Error fetching analytics:', err);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (!data) return <div className="p-8 text-center text-xs text-zinc-500 font-mono">Loading telemetry dashboards...</div>;

  const COLORS = ['#06b6d4', '#8b5cf6', '#f59e0b', '#10b981'];

  return (
    <div className="flex-1 p-6 lg:p-8 flex flex-col gap-6 overflow-y-auto h-screen bg-[#09090b]">
      {/* Header segment */}
      <div>
        <h1 className="font-outfit text-2xl font-black text-white">Analytics & Insights</h1>
        <p className="text-zinc-500 text-xs mt-0.5">Commute metrics and carbon offset tracking modules.</p>
      </div>

      {/* Top metric boxes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-5 rounded-3xl flex flex-col gap-2 relative overflow-hidden bg-zinc-950/45 border-zinc-800/40">
          <div className="flex justify-between items-center text-zinc-500">
            <span className="text-[10px] uppercase font-bold tracking-wider">Total Commute Savings</span>
            <Coins className="w-5 h-5 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white font-outfit">₹{data.weeklyCostSavings}</span>
            <span className="text-xxs text-emerald-400 font-bold font-outfit">+14.2% Saved</span>
          </div>
          <span className="text-[10px] text-zinc-500 mt-1 block">Accrued automatically via EMMDE ride selections.</span>
        </div>

        <div className="glass-panel p-5 rounded-3xl flex flex-col gap-2 relative overflow-hidden bg-zinc-950/45 border-zinc-800/40">
          <div className="flex justify-between items-center text-zinc-500">
            <span className="text-[10px] uppercase font-bold tracking-wider">Carbon Offsets Generated</span>
            <Leaf className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white font-outfit">{data.carbonOffsetKg} kg CO2</span>
            <span className="text-xxs text-emerald-400 font-bold font-outfit">Saved 18.5%</span>
          </div>
          <span className="text-[10px] text-zinc-500 mt-1 block">Calculated using combined transit and pool miles.</span>
        </div>

        <div className="glass-panel p-5 rounded-3xl flex flex-col gap-2 relative overflow-hidden bg-zinc-950/45 border-zinc-800/40">
          <div className="flex justify-between items-center text-zinc-500">
            <span className="text-[10px] uppercase font-bold tracking-wider">Shared Carpool Miles</span>
            <Users className="w-5 h-5 text-purple-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white font-outfit">3 pool shares</span>
            <span className="text-xxs text-purple-400 font-bold font-outfit">Active Corridor</span>
          </div>
          <span className="text-[10px] text-zinc-500 mt-1 block">Peer commute connects matched via RCMA coordinates.</span>
        </div>
      </div>

      {/* Recharts grids */}
      <div className="grid grid-cols-12 gap-6 items-stretch">
        
        {/* Expenses Line chart */}
        <div className="col-span-12 lg:col-span-8 glass-panel p-5 rounded-3xl bg-zinc-950/40 border-zinc-800/40 flex flex-col gap-4">
          <h3 className="font-outfit text-sm font-extrabold text-white flex items-center gap-2">
            <TrendingDown className="w-4.5 h-4.5 text-cyan-400" />
            Weekly Commute Expenditures
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.weeklyExpenses}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="day" stroke="rgba(255,255,255,0.3)" fontSize={10} tickLine={false} />
                <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#09090b', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  labelStyle={{ color: '#fff', fontSize: '11px', fontFamily: 'Outfit' }}
                  itemStyle={{ color: '#8b5cf6', fontSize: '11px' }}
                />
                <Line type="monotone" dataKey="cost" stroke="#8b5cf6" strokeWidth={3} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Platform distribution pie chart */}
        <div className="col-span-12 lg:col-span-4 glass-panel p-5 rounded-3xl bg-zinc-950/40 border-zinc-800/40 flex flex-col gap-4">
          <h3 className="font-outfit text-sm font-extrabold text-white flex items-center gap-2">
            <Zap className="w-4.5 h-4.5 text-purple-400" />
            Ride Provider Distribution
          </h3>
          <div className="h-48 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.rideFrequency}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="count"
                  nameKey="platform"
                >
                  {data.rideFrequency.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#09090b', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ fontSize: '11px', color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-2 justify-center text-[10px] text-zinc-400 font-mono border-t border-zinc-800/30 pt-3">
            {data.rideFrequency.map((entry: any, index: number) => (
              <div key={entry.platform} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                <span>{entry.platform}: {entry.count} bookings</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* AI Insights panel */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-purple-500/5 to-cyan-500/5 border border-purple-500/10 flex items-start gap-4 shadow-[0_0_20px_rgba(139,92,246,0.02)]">
        <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
          <Sparkles className="w-5 h-5 text-purple-400" />
        </div>
        <div>
          <h4 className="font-outfit text-sm font-extrabold text-white mb-1">AETHER-AI Carbon Efficiency Suggestion</h4>
          <p className="text-xs text-zinc-400 leading-relaxed font-outfit">
            You completed 12 Rapido bike commutes this week, contributing to a ₹280 cost saving and an 18.5% reduction in individual carbon offsets. If you combine your morning ITPL tech park commutes with carpool routes matching Priya Sharma, you will offset an additional 6.2 kg of CO2 emissions.
          </p>
        </div>
      </div>

    </div>
  );
}
