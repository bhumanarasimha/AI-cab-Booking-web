import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Phone, ShieldCheck, ShieldAlert, Sparkles, ArrowRight } from 'lucide-react';
import axios from 'axios';

interface AuthProps {
  onAuthSuccess: (user: any) => void;
}

export default function Auth({ onAuthSuccess }: AuthProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [otpVisible, setOtpVisible] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [pendingUser, setPendingUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      if (response.data.success) {
        onAuthSuccess(response.data.user);
      }
    } catch (err) {
      setError('Connection failed. Please check backend status.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // Trigger dynamic OTP prompt
      setOtpVisible(true);
      setPendingUser({ name, email, phone });
    } catch (err) {
      setError('Signup failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode !== '123456' && otpCode.length > 0) {
      setError('Invalid OTP code. Enter 123456 for simulator.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('http://localhost:5000/api/auth/signup', pendingUser);
      if (response.data.success) {
        onAuthSuccess(response.data.user);
      }
    } catch (err) {
      setError('OTP verification failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { email: 'google.user@office.com' });
      if (response.data.success) {
        onAuthSuccess(response.data.user);
      }
    } catch (err) {
      setError('Google connect failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden h-screen bg-[#09090b]">
      {/* Glow Blobs */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-5xl w-full grid grid-cols-12 gap-8 items-stretch relative z-10">
        
        {/* Left Information Panel */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="col-span-12 lg:col-span-6 flex flex-col justify-between p-8 glass-panel rounded-3xl border border-purple-500/10 bg-zinc-950/45"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-xs font-bold text-purple-400 font-outfit mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Aether Identity Platform</span>
            </div>
            
            <h2 className="font-outfit text-3xl font-extrabold tracking-tight text-white mb-4 leading-snug">
              Access the Next-Gen <br />
              <span className="text-gradient-purple-cyan">SmartRide AI</span> Assistant
            </h2>
            <p className="text-zinc-400 text-sm leading-relaxed mb-8">
              Connect your verified profile to analyze fares across multiple platforms, calculate HEWRO physical efforts, audit cancellation surge Multipliers, and join professional ride pools.
            </p>

            <div className="flex flex-col gap-5">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold shrink-0">1</div>
                <div>
                  <h4 className="text-xs font-bold text-white font-outfit">EMMDE Multi-Agent Analysis</h4>
                  <p className="text-xxs text-zinc-500">Six specialized sub-agents coordinate instantly to optimize fares and cancellations.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 font-bold shrink-0">2</div>
                <div>
                  <h4 className="text-xs font-bold text-white font-outfit">Route Overlap Computations (RCMA)</h4>
                  <p className="text-xxs text-zinc-500">Verified employee ride pools with built-in time and geographic overlap evaluation.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 p-3.5 bg-zinc-900/40 rounded-2xl border border-zinc-800/40 flex items-center gap-3 text-xxs text-zinc-500">
            <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0" />
            <span>Secure connection protocols. Identity validation coordinates remain completely encrypted under Aether Security Policies.</span>
          </div>
        </motion.div>

        {/* Right Auth Card Panel */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="col-span-12 lg:col-span-6 glass-panel rounded-3xl p-8 bg-zinc-950/60 border-zinc-800/40 flex flex-col justify-center"
        >
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {!otpVisible ? (
            <>
              {/* Tab Selector */}
              <div className="grid grid-cols-2 border-b border-zinc-800/40 mb-6 pb-2">
                <button
                  onClick={() => setActiveTab('login')}
                  className={`py-2 text-sm font-semibold font-outfit transition-all ${
                    activeTab === 'login' ? 'text-purple-400 border-b-2 border-purple-500' : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  Log In
                </button>
                <button
                  onClick={() => setActiveTab('signup')}
                  className={`py-2 text-sm font-semibold font-outfit transition-all ${
                    activeTab === 'signup' ? 'text-purple-400 border-b-2 border-purple-500' : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  Sign Up
                </button>
              </div>

              {activeTab === 'login' ? (
                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@office.com"
                        className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-purple-500 transition-all"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-purple-500 transition-all"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white rounded-xl text-sm font-bold font-outfit shadow-glow-purple transition-all duration-200 mt-2 flex items-center justify-center gap-2"
                  >
                    <span>{loading ? 'Connecting...' : 'Access Commuter Account'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <form onSubmit={handleSignupSubmit} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Venkat R."
                        className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-purple-500 transition-all"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Office Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="venkat@corporate.com"
                        className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-purple-500 transition-all"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Mobile Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                      <input
                        type="tel"
                        required
                        pattern="[0-9]{10}"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="9876543210"
                        className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-purple-500 transition-all"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white rounded-xl text-sm font-bold font-outfit shadow-glow-purple transition-all duration-200 mt-2 flex items-center justify-center gap-2"
                  >
                    <span>{loading ? 'Initializing...' : 'Generate Commute Profile'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}

              <div className="relative flex py-4 items-center">
                <div className="flex-grow border-t border-zinc-800/40"></div>
                <span className="flex-shrink mx-4 text-zinc-600 text-[10px] font-bold tracking-widest">OR</span>
                <div className="flex-grow border-t border-zinc-800/40"></div>
              </div>

              <button
                onClick={handleGoogleLogin}
                type="button"
                className="w-full py-3 bg-zinc-900/40 border border-zinc-800 hover:bg-zinc-900/80 text-white rounded-xl text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-2.5"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" className="shrink-0"><path fill="currentColor" d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114A5.99 5.99 0 0 1 8.005 12.5a5.99 5.99 0 0 1 5.986-6.013c1.55 0 2.964.59 4.032 1.554l3.078-3.078C19.267 3.23 16.79 2 13.99 2a10.5 10.5 0 0 0-10.5 10.5a10.5 10.5 0 0 0 10.5 10.5c5.78 0 10.5-4.22 10.5-10.5c0-.687-.06-1.353-.17-2H12.24z"/></svg>
                <span>Authorize with Google Workspace</span>
              </button>
            </>
          ) : (
            <form onSubmit={handleOtpVerify} className="flex flex-col gap-4">
              <h3 className="font-outfit text-xl font-extrabold text-white text-center">SMS OTP Verification</h3>
              <p className="text-zinc-400 text-xs text-center mb-4 leading-relaxed">
                An SMS verification code has been dispatched to <span className="text-cyan-400 font-bold">+91 {phone}</span>.<br />
                Enter the security code to verify your profile credentials.
              </p>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">6-Digit Security Code</label>
                <input
                  type="text"
                  required
                  pattern="[0-9]{6}"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="123456"
                  className="w-full text-center tracking-[12px] font-mono bg-zinc-900/50 border border-zinc-800 rounded-xl py-3 text-lg text-white focus:outline-none focus:border-purple-500 transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white rounded-xl text-sm font-bold font-outfit shadow-glow-purple transition-all duration-200 mt-2 flex items-center justify-center gap-2"
              >
                <span>{loading ? 'Verifying...' : 'Verify OTP Security Code'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setOtpVisible(false);
                  setError('');
                }}
                className="text-center text-xs text-zinc-500 hover:text-zinc-300 underline"
              >
                Cancel and edit details
              </button>
            </form>
          )}

        </motion.div>
      </div>
    </div>
  );
}
