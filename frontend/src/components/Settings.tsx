import React, { useState, useEffect } from 'react';
import { 
  Sliders, 
  Wallet, 
  CreditCard, 
  ShieldCheck, 
  User, 
  Mail, 
  Phone, 
  RefreshCw 
} from 'lucide-react';
import axios from 'axios';

interface SettingsProps {
  onProfileUpdate: () => void;
}

export default function Settings({ onProfileUpdate }: SettingsProps) {
  const [user, setUser] = useState<any>(null);
  const [costWeight, setCostWeight] = useState(40);
  const [timeWeight, setTimeWeight] = useState(30);
  const [comfortWeight, setComfortWeight] = useState(30);
  
  // Wallet topup states
  const [topupAmount, setTopupAmount] = useState('500');
  const [topupLoading, setTopupLoading] = useState(false);
  const [topupSuccess, setTopupSuccess] = useState(false);

  const fetchProfile = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/auth/profile');
      const userData = response.data;
      setUser(userData);
      
      // Load stored weights
      if (userData.preferences) {
        setCostWeight(Math.round(userData.preferences.cost * 100));
        setTimeWeight(Math.round(userData.preferences.time * 100));
        setComfortWeight(Math.round(userData.preferences.comfort * 100));
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleWeightChange = (type: 'cost' | 'time' | 'comfort', value: number) => {
    // Keep sum of weights equal to 100%
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
        alert('HEWRO Optimization weights saved successfully!');
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
      // Simulate Razorpay secure payment processing
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      const response = await axios.post('http://localhost:5000/api/auth/profile/update', {
        walletBalance: user.walletBalance + amount
      });

      if (response.data.success) {
        setUser(response.data.user);
        setTopupSuccess(true);
        setTopupAmount('500');
        onProfileUpdate();
      }
    } catch (err) {
      console.error('Wallet topup failed:', err);
    } finally {
      setTopupLoading(false);
    }
  };

  if (!user) return <div className="p-8 text-center text-xs text-zinc-500 font-mono">Loading profile data...</div>;

  return (
    <div className="flex-1 p-6 lg:p-8 flex flex-col gap-6 overflow-y-auto h-screen bg-[#09090b]">
      {/* Header bar */}
      <div>
        <h1 className="font-outfit text-2xl font-black text-white">Profile & Preferences</h1>
        <p className="text-zinc-500 text-xs mt-0.5">Configure EMMDE user profile weights and top-up sandbox wallet.</p>
      </div>

      <div className="grid grid-cols-12 gap-6 items-stretch">
        
        {/* Left Column: User Profile and Wallet Card */}
        <div className="col-span-12 lg:col-span-5 flex flex-col gap-6">
          
          {/* User profile detail */}
          <div className="glass-panel p-6 rounded-3xl bg-zinc-950/40 border-zinc-800/40 flex flex-col items-center text-center gap-4">
            <div className="relative">
              <img 
                src={`https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${user.name}`} 
                alt="Profile" 
                className="w-16 h-16 rounded-full border-2 border-purple-500 bg-zinc-900 shadow-glow-purple"
              />
              {user.isVerified && (
                <span className="absolute bottom-0 right-0 bg-emerald-500 text-zinc-950 p-1 rounded-full border border-zinc-950" title="Corporate Verified">
                  <ShieldCheck className="w-4.5 h-4.5 text-white" />
                </span>
              )}
            </div>

            <div>
              <h3 className="font-outfit text-lg font-extrabold text-white leading-tight">{user.name}</h3>
              <span className="text-[10px] text-zinc-500 font-mono block mt-1 uppercase tracking-widest">
                VERIFIED PASSENGER
              </span>
            </div>

            {/* Simulated Wallet */}
            <div className="w-full bg-zinc-900/40 border border-zinc-800/60 rounded-2xl p-4 mt-2 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                  <Wallet className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="text-left">
                  <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-wider block">Wallet Balance</span>
                  <span className="text-sm font-black text-white font-outfit">₹{user.walletBalance.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="text-right">
                <span className="text-[9px] text-emerald-400 font-bold font-outfit uppercase tracking-wider block">
                  Razorpay SDK Linked
                </span>
              </div>
            </div>
          </div>

          {/* Top-up Form */}
          <div className="glass-panel p-6 rounded-3xl bg-zinc-950/40 border-zinc-800/40">
            <h3 className="font-outfit text-sm font-extrabold text-white flex items-center gap-2 mb-4">
              <CreditCard className="w-4.5 h-4.5 text-cyan-400" />
              Razorpay Secure Checkout
            </h3>

            {topupSuccess && (
              <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs">
                Funds topped up successfully via Razorpay Simulator!
              </div>
            )}

            <form onSubmit={handleWalletTopup} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Topup Amount (INR)</label>
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
                className="w-full py-2.5 bg-gradient-to-r from-cyan-600 to-blue-500 hover:from-cyan-500 hover:to-blue-400 text-white rounded-xl text-xs font-bold font-outfit shadow-glow-cyan border-none cursor-pointer flex items-center justify-center gap-2"
              >
                {topupLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Processing sandbox checkout...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    <span>Pay Securely (Razorpay Simulator)</span>
                  </>
                )}
              </button>
            </form>
          </div>

        </div>

        {/* Right Column: Preferences tuning */}
        <div className="col-span-12 lg:col-span-7 glass-panel p-6 rounded-3xl bg-zinc-950/40 border-zinc-800/40 flex flex-col justify-between">
          <div>
            <h3 className="font-outfit text-sm font-extrabold text-white flex items-center gap-2 border-b border-zinc-800/40 pb-3 mb-6">
              <Sliders className="w-4.5 h-4.5 text-purple-400" />
              HEWRO Optimization Preferences
            </h3>

            <div className="flex flex-col gap-6">
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
                <span className="text-[10px] text-zinc-600 font-medium">Increases priority of cheaper options like Rapido and Ola Auto.</span>
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
                <span className="text-[10px] text-zinc-600 font-medium">Prioritizes faster modes, helmet connections, and congestion-skipping tracks.</span>
              </div>

              {/* Comfort slider */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-zinc-400 font-outfit">Comfort Preference (Cab preference)</span>
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
                <span className="text-[10px] text-zinc-600 font-medium">Lowers scores of high-effort transits (walking/multimodal switching/baggage restrictions).</span>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-zinc-800/40 pt-4 flex justify-between items-center">
            <span className="text-[10px] text-zinc-500 font-medium max-w-sm">
              Tuning weights immediately recalibrates recommendations inside the EMMDE core.
            </span>
            
            <button
              onClick={savePreferences}
              className="px-5 py-2 bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white rounded-xl text-xs font-bold font-outfit shadow-glow-purple border-none cursor-pointer"
            >
              Save AI Weights
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
