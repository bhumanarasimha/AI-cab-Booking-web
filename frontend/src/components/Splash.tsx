import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Cpu, Shield, Sparkles } from 'lucide-react';

interface SplashProps {
  onComplete: () => void;
}

export default function Splash({ onComplete }: SplashProps) {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Initializing Core Engine...');

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 600);
          return 100;
        }
        
        // Dynamic status text updates
        const next = prev + Math.floor(Math.random() * 15) + 5;
        const bounded = Math.min(100, next);
        
        if (bounded > 85) {
          setStatusText('Recalibrating RCMA Passenger Matches...');
        } else if (bounded > 60) {
          setStatusText('Loading CRSP Cancellation Predictors...');
        } else if (bounded > 35) {
          setStatusText('Initializing HEWRO Effort Optimization Weights...');
        } else if (bounded > 15) {
          setStatusText('Contacting EMMDE Agent Fleet...');
        }
        
        return bounded;
      });
    }, 120);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-[#09090b] flex flex-col items-center justify-center z-50 overflow-hidden">
      {/* Background Animated Blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600 rounded-full blur-[120px] opacity-20 animate-pulse-slow"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600 rounded-full blur-[120px] opacity-20 animate-pulse-slow"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="flex flex-col items-center max-w-md w-full px-8 text-center relative"
      >
        {/* Core Animated Ring */}
        <div className="relative mb-8 flex items-center justify-center">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
            className="w-24 h-24 rounded-full border-2 border-dashed border-purple-500/30 flex items-center justify-center"
          ></motion.div>
          <div className="absolute w-20 h-20 rounded-full border border-cyan-500/20 flex items-center justify-center bg-zinc-900/60 backdrop-blur-sm shadow-glow-purple">
            <Zap className="w-8 h-8 text-cyan-400 animate-pulse" />
          </div>
          <motion.div 
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="absolute -top-1 -right-1"
          >
            <Sparkles className="w-5 h-5 text-purple-400" />
          </motion.div>
        </div>

        {/* Brand Header */}
        <h1 className="font-outfit text-3xl font-extrabold tracking-wider text-white mb-2">
          SMARTRIDE <span className="text-cyan-400">AI</span>
        </h1>
        <p className="text-xxs uppercase tracking-widest text-zinc-500 font-semibold mb-8">
          Explainable Multi-Agent Mobility Engine
        </p>

        {/* Loading Progress Bar */}
        <div className="w-full h-[6px] bg-zinc-800/80 rounded-full overflow-hidden border border-zinc-700/30 mb-4">
          <motion.div 
            className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full"
            style={{ width: `${progress}%` }}
          ></motion.div>
        </div>

        {/* Telemetry Status Log */}
        <div className="flex items-center justify-center gap-2 text-xs text-zinc-400 font-mono">
          <Cpu className="w-4 h-4 text-purple-400 animate-spin-slow" />
          <span className="w-64 text-center truncate">{statusText}</span>
          <span className="text-cyan-400 font-bold w-10 text-right">{progress}%</span>
        </div>
      </motion.div>

      {/* Safety Verifications footer */}
      <div className="absolute bottom-6 flex items-center gap-2 text-xxs text-zinc-600 font-medium">
        <Shield className="w-4 h-4 text-zinc-700" />
        <span>Secured by Aether Identity System v3.1</span>
      </div>
    </div>
  );
}
