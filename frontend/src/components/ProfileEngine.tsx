import React, { useState, useEffect } from 'react';
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
import { 
  Sliders, 
  Wallet, 
  CreditCard, 
  ShieldCheck, 
  User, 
  Mail, 
  Phone, 
  RefreshCw, 
  Coins, 
  Leaf, 
  Sparkles, 
  TrendingDown, 
  Users, 
  Cpu, 
  ToggleLeft, 
  ToggleRight 
} from 'lucide-react';
import axios from 'axios';

interface ProfileEngineProps {
  onProfileUpdate: () => void;
}

export default function ProfileEngine({ onProfileUpdate }: ProfileEngineProps) {
  const [user, setUser] = useState<any>(null);
  const [costWeight, setCostWeight] = useState(40);
  const [timeWeight, setTimeWeight] = useState(30);
  const [comfortWeight, setComfortWeight] = useState(30);
  
  // Wallet topup states
  const [topupAmount, setTopupAmount] = useState('500');
  const [topupLoading, setTopupLoading] = useState(false);
  const [topupSuccess, setTopupSuccess] = useState(false);

  // Analytics states
  const [analyticsData, setAnalyticsData] = useState<any>(null);

  // AI preference toggles
  const [aiLearning, setAiLearning] = useState(true);
  const [carbonFocus, setCarbonFocus] = useState(false);

  const fetchProfileAndAnalytics = async () => {
    try {
      // 1. Fetch Profile
      const profRes = await axios.get('http://localhost:5000/api/auth/profile');
      const userData = profRes.data;
      setUser(userData);
      if (userData.preferences) {
        setCostWeight(Math.round(userData.preferences.cost * 100));
        setTimeWeight(Math.round(userData.preferences.time * 100));
        setComfortWeight(Math.round(userData.preferences.comfort * 100));
      }

      // 2. Fetch Analytics
      const analyRes = await axios.get('http://localhost:5000/api/analytics');
      setAnalyticsData(analyRes.data.savings);
    } catch (err) {
      console.error('Error loading profile data:', err);
    }
  };

  useEffect(() => {
    fetchProfileAndAnalytics();
  }, []);

  const handleWeightChange = (type: 'cost' | 'time' | 'comfort', value: number) => {
    if (type === 'cost') {
      setCostWeight(value);
      const remaining = 100 - value;
      setTimeWeight(Math.round(remaining / 2));
      setComfortWeight(Math.round(remaining / 2));
    } else if (type === 'time') {
      setTimeWeight(value);
      const remaining = 100 - value;
      setCostWeight(Math.round(remaining / 2));
      setComfortWeight(Math.round(remaining / 2));
    } else {
      setComfortWeight(value);
      const remaining = 100 - value;
      setCostWeight(Math.round(remaining / 2));
      setTimeWeight(Math.round(remaining / 2));
    }
  };

  const savePreferences = async () => {
    try {
      const updatedPrefs = {
        cost: costWeight / 100,
        time: timeWeight / 100,
        comfort: comfortWeight / 100
      };
      
      const response = await axios.post('http://localhost:5000/api/auth/profile/update', {
        preferences: updatedPrefs
      });
      
      if (response.data.success) {
        alert('HEWRO AI preference parameters updated successfully!');
        onProfileUpdate();
      }
    } catch (err) {
      console.error('Error saving preferences:', err);
    }
  };

  const handleWalletTopup = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(topupAmount);
    if (isNaN(amount) || amount <= 0) return;

    setTopupLoading(true);
    setTopupSuccess(false);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      const response = await axios.post('http://localhost:5000/api/auth/profile/update', {
        walletBalance: user.walletBalance + amount
      });

      if (response.data.success) {
        setUser(response.data.user);
        setTopupSuccess(true);
        setTopupAmount('500');
        onProfileUpdate();
        fetchProfileAndAnalytics();
      }
    } catch (err) {
      console.error('Topup failed:', err);
    } finally {
      setTopupLoading(false);
    }
  };

  if (!user || !analyticsData) {
    return <div className="p-8 text-center text-xs text-zinc-500 font-mono">Connecting with Personalization engines...</div>;
  }

  const COLORS = ['#06b6d4', '#8b5cf6', '#f59e0b', '#10b981'];

  return (
    <div className="flex-1 p-6 lg:p-8 flex flex-col gap-6 overflow-y-auto h-screen bg-[#0B0F1A]">
      
      {/* Header bar */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-outfit text-2xl font-black text-white flex items-center gap-2">
            <User className="w-6 h-6 text-purple-400" />
            Personalization Engine
          </h1>
          <p className="text-zinc-500 text-xs mt-0.5">Tuning algorithms and tracking individual carbon & cost efficiency.</p>
        </div>
        
        <div className="flex items-center gap-2 px-3.5 py-1.5 bg-zinc-950 border border-zinc-800/80 rounded-full font-mono text-[10px] text-zinc-400">
          <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          <span>EMMDE Weights: {costWeight}/{timeWeight}/{comfortWeight}</span>
        </div>
      </div>

      {/* Top dashboard metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="glass-panel p-5 rounded-3xl flex flex-col gap-2 relative overflow-hidden bg-zinc-950/45 border-zinc-800/40">
          <div className="flex justify-between items-center text-zinc-500">
            <span className="text-[10px] uppercase font-bold tracking-wider">Weekly Savings</span>
            <Coins className="w-5 h-5 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white font-outfit">₹620</span>
            <span className="text-xxs text-emerald-400 font-bold font-outfit">+14.2% saved</span>
          </div>
          <span className="text-[10px] text-zinc-500 mt-1 block">Accrued automatically via multimodal routing.</span>
        </div>

        <div className="glass-panel p-5 rounded-3xl flex flex-col gap-2 relative overflow-hidden bg-zinc-950/45 border-zinc-800/40">
          <div className="flex justify-between items-center text-zinc-500">
            <span className="text-[10px] uppercase font-bold tracking-wider">Carbon Offsets</span>
            <Leaf className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white font-outfit">{analyticsData.carbonOffsetKg} kg CO2</span>
            <span className="text-xxs text-emerald-400 font-bold font-outfit">Top 5% commuter</span>
          </div>
          <span className="text-[10px] text-zinc-500 mt-1 block">Calculated using combined transit and bike miles.</span>
        </div>

        <div className="glass-panel p-5 rounded-3xl flex flex-col gap-2 relative overflow-hidden bg-zinc-950/45 border-zinc-800/40">
          <div className="flex justify-between items-center text-zinc-500">
            <span className="text-[10px] uppercase font-bold tracking-wider">Wallet Sandbox</span>
            <Wallet className="w-5 h-5 text-purple-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white font-outfit">₹{user.walletBalance.toFixed(2)}</span>
            <span className="text-xxs text-cyan-400 font-mono">Sync Active</span>
          </div>
          <span className="text-[10px] text-zinc-500 mt-1 block">Quick dispatch checkout balance.</span>
        </div>

      </div>

      <div className="grid grid-cols-12 gap-6 items-stretch">
        
        {/* Left Column: Preferences Slider & AI toggle */}
        <div className="col-span-12 lg:col-span-6 flex flex-col gap-6">
          
          {/* Preferences card */}
          <div className="glass-panel p-6 rounded-3xl bg-zinc-950/40 border-zinc-800/40">
            <h3 className="font-outfit text-sm font-extrabold text-white flex items-center gap-2 border-b border-zinc-900 pb-3 mb-5">
              <Sliders className="w-4.5 h-4.5 text-purple-400" />
              HEWRO Preference Optimization Weights
            </h3>

            <div className="flex flex-col gap-5.5">
              {/* Cost slider */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-zinc-400 font-outfit">Cost Importance</span>
                  <span className="text-purple-400 font-mono">{costWeight}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={costWeight}
                  onChange={(e) => handleWeightChange('cost', parseInt(e.target.value))}
                  className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
                <span className="text-[10px] text-zinc-650 font-medium">Prioritizes cheaper options (Ola Auto, Rapido Bike).</span>
              </div>

              {/* Time slider */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-zinc-400 font-outfit">Time Priority</span>
                  <span className="text-purple-400 font-mono">{timeWeight}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={timeWeight}
                  onChange={(e) => handleWeightChange('time', parseInt(e.target.value))}
                  className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
                <span className="text-[10px] text-zinc-650 font-medium">Bypasses road traffic delays via metro connections.</span>
              </div>

              {/* Comfort slider */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-zinc-400 font-outfit">Comfort Preference</span>
                  <span className="text-purple-400 font-mono">{comfortWeight}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={comfortWeight}
                  onChange={(e) => handleWeightChange('comfort', parseInt(e.target.value))}
                  className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
                <span className="text-[10px] text-zinc-650 font-medium">Penalizes long walks and multimodal transit transitions.</span>
              </div>

              <div className="flex justify-end mt-2 pt-2 border-t border-zinc-900">
                <button
                  onClick={savePreferences}
                  className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white rounded-xl text-xs font-bold font-outfit shadow-glow-purple border-none cursor-pointer"
                >
                  Save Preference Matrix
                </button>
              </div>
            </div>
          </div>

          {/* AI Continuous Learning Toggles */}
          <div className="glass-panel p-6 rounded-3xl bg-zinc-950/40 border-zinc-800/40 flex flex-col gap-4">
            <h3 className="font-outfit text-sm font-extrabold text-white flex items-center gap-2 border-b border-zinc-900 pb-3">
              <Sparkles className="w-4.5 h-4.5 text-cyan-400" />
              AI Learning & Contextual Rules
            </h3>
            
            <div className="flex justify-between items-center gap-6 py-1">
              <div>
                <span className="text-xs font-bold text-white block font-outfit">Continuous Profile Learning</span>
                <span className="text-[10px] text-zinc-500 block leading-normal">
                  Recalibrate EMMDE weights based on your historical booking decisions.
                </span>
              </div>
              <button 
                onClick={() => setAiLearning(!aiLearning)}
                className="bg-transparent border-none cursor-pointer text-cyan-400"
              >
                {aiLearning ? <ToggleRight className="w-9 h-9" /> : <ToggleLeft className="w-9 h-9 text-zinc-700" />}
              </button>
            </div>

            <div className="flex justify-between items-center gap-6 py-1 border-t border-zinc-900 pt-3">
              <div>
                <span className="text-xs font-bold text-white block font-outfit">Carbon-first Multimodal Priority</span>
                <span className="text-[10px] text-zinc-500 block leading-normal">
                  Boost Multimodal metro scores to favor low carbon transits.
                </span>
              </div>
              <button 
                onClick={() => setCarbonFocus(!carbonFocus)}
                className="bg-transparent border-none cursor-pointer text-cyan-400"
              >
                {carbonFocus ? <ToggleRight className="w-9 h-9" /> : <ToggleLeft className="w-9 h-9 text-zinc-700" />}
              </button>
            </div>
          </div>

        </div>

        {/* Right Column: Recharts and Wallet Sandbox topup */}
        <div className="col-span-12 lg:col-span-6 flex flex-col gap-6">
          
          {/* Weekly Expenditure Graph */}
          <div className="glass-panel p-6 rounded-3xl bg-zinc-950/40 border-zinc-800/40 flex flex-col gap-4">
            <h3 className="font-outfit text-sm font-extrabold text-white flex items-center gap-2">
              <TrendingDown className="w-4.5 h-4.5 text-cyan-400" />
              Weekly Commute Expenditures
            </h3>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analyticsData.weeklyExpenses}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                  <XAxis dataKey="day" stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0B0F1A', borderColor: 'rgba(255,255,255,0.08)', borderRadius: '12px' }}
                    labelStyle={{ color: '#fff', fontSize: '11px', fontFamily: 'Outfit' }}
                    itemStyle={{ color: '#8b5cf6', fontSize: '11px' }}
                  />
                  <Line type="monotone" dataKey="cost" stroke="#8b5cf6" strokeWidth={2.5} activeDot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Sandbox Topup secure checkout */}
          <div className="glass-panel p-6 rounded-3xl bg-zinc-950/40 border-zinc-800/40">
            <h3 className="font-outfit text-sm font-extrabold text-white flex items-center gap-2 border-b border-zinc-900 pb-3 mb-4">
              <CreditCard className="w-4.5 h-4.5 text-cyan-400" />
              Secure Sandbox Top-up
            </h3>
            
            {topupSuccess && (
              <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xxs font-outfit">
                Success! Funds loaded securely via Sandbox Simulator.
              </div>
            )}

            <form onSubmit={handleWalletTopup} className="flex gap-4 items-end">
              <div className="flex-1 flex flex-col gap-1.5">
                <label className="text-[9px] uppercase font-bold text-zinc-500 tracking-wider">Amount (INR)</label>
                <input
                  type="number"
                  required
                  min="50"
                  max="10000"
                  value={topupAmount}
                  onChange={(e) => setTopupAmount(e.target.value)}
                  placeholder="500"
                  className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none focus:border-cyan-500 transition-all font-outfit"
                />
              </div>

              <button
                type="submit"
                disabled={topupLoading}
                className="py-2.5 px-5 bg-gradient-to-r from-cyan-600 to-blue-500 hover:from-cyan-500 hover:to-blue-400 text-white rounded-xl text-xs font-bold font-outfit shadow-glow-cyan border-none cursor-pointer flex items-center gap-2 whitespace-nowrap h-[38px] transition-all"
              >
                {topupLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Tinkering API...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    <span>Pay Sandbox</span>
                  </>
                )}
              </button>
            </form>
          </div>

        </div>

      </div>

    </div>
  );
}
