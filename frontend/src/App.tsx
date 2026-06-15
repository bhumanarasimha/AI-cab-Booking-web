import React, { useState, useEffect } from 'react';
import Splash from './components/Splash';
import Sidebar from './components/Sidebar';
import Auth from './components/Auth';
import MapContainer from './components/MapContainer';
import RidesCompare from './components/RidesCompare';
import AIRecommendation from './components/AIRecommendation';
import CommuteMatching from './components/CommuteMatching';
import AdminTuner from './components/AdminTuner';
import ChatbotWidget from './components/ChatbotWidget';

// Premium Overhaul Screen Components
import AIInsights from './components/AIInsights';
import FullComparison from './components/FullComparison';
import SmartRoutes from './components/SmartRoutes';
import ProfileEngine from './components/ProfileEngine';

import { 
  Zap, 
  MapPin, 
  Navigation, 
  CreditCard, 
  Wallet, 
  Bell, 
  CheckCircle,
  X,
  UserCheck,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import axios from 'axios';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('dashboard');
  const [user, setUser] = useState<any>(null);
  
  // Dashboard routes and EMMDE states
  const [pickup, setPickup] = useState('Central Business District');
  const [dropoff, setDropoff] = useState('International Tech Park');
  const [searchLoading, setSearchLoading] = useState(false);
  const [prediction, setPrediction] = useState<any>(null);
  const [selectedRide, setSelectedRide] = useState<any>(null);

  // Booking dispatch modal state
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingState, setBookingState] = useState<'searching' | 'matched'>('searching');
  const [matchedDriver, setMatchedDriver] = useState<any>(null);
  const [bookingRide, setBookingRide] = useState<any>(null);

  // Notification states
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Surge Markup Warning', desc: 'Uber Premier is currently marked up by 35% in your area.', type: 'alert' },
    { id: 2, title: 'Price Normalization Alert', desc: 'Ola Auto dropped to ₹120. Save ₹20 by booking now.', type: 'promo' },
    { id: 3, title: 'RCMA Commuter Match Found', desc: 'Priya S. is traveling your route in 15 mins. Tap to share.', type: 'match' }
  ]);

  const fetchProfile = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/auth/profile');
      setUser(response.data);
    } catch (err) {
      console.log('User is guest.');
    }
  };

  const executeSearch = async (originParam?: string, destParam?: string) => {
    const orig = originParam || pickup;
    const dest = destParam || dropoff;
    setSearchLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/rides/compare', {
        origin: orig,
        destination: dest,
        preferences: user?.preferences
      });
      setPrediction(response.data);
      setSelectedRide(response.data.bestRide);
    } catch (err) {
      console.error('EMMDE Search failed:', err);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleQuickChip = (pick: string, drop: string) => {
    let p = 'Central Business District';
    if (pick === 'Suburb') p = 'Residential Suburb Sect-D';
    
    let d = 'International Tech Park';
    if (drop === 'STP') d = 'Software Technology Park';
    
    setPickup(p);
    setDropoff(d);
    executeSearch(p, d);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Trigger search on start once user state loads
  useEffect(() => {
    if (user) {
      executeSearch();
    }
  }, [user]);

  const handleAuthSuccess = (userData: any) => {
    setUser(userData);
    setActiveView('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setActiveView('auth');
  };

  // Booking dispatch overlays
  const triggerBooking = (ride: any) => {
    if (!user) {
      setActiveView('auth');
      return;
    }
    
    if (user.walletBalance < ride.fare) {
      alert(`Insufficient funds inside your SmartRide Wallet (Balance: ₹${user.walletBalance.toFixed(2)}). Please top-up via settings dashboard.`);
      setActiveView('settings');
      return;
    }

    setBookingRide(ride);
    setBookingModalOpen(true);
    setBookingState('searching');
    
    // Simulate EMMDE Dispatch search
    setTimeout(() => {
      setBookingState('matched');
      const drivers = ["Rajesh Kumar", "Subhash Chandra", "Harish Patel", "Arun Singh"];
      const plates = ["KA-03-HA-8842", "KA-51-MD-9214", "KA-01-EF-2415"];
      setMatchedDriver({
        name: drivers[Math.floor(Math.random() * drivers.length)],
        plate: plates[Math.floor(Math.random() * plates.length)],
        rating: (4.5 + Math.random() * 0.5).toFixed(1)
      });
    }, 2500);
  };

  const confirmBooking = async () => {
    if (!bookingRide || !user) return;
    try {
      const newBal = user.walletBalance - bookingRide.fare;
      const response = await axios.post('http://localhost:5000/api/auth/profile/update', {
        walletBalance: newBal
      });
      if (response.data.success) {
        setUser(response.data.user);
        setBookingModalOpen(false);
        alert(`Ride Dispatched successfully! Driver ${matchedDriver.name} is on the way. Paid ₹${bookingRide.fare} securely.`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <Splash onComplete={() => setLoading(false)} />;
  }

  // Render auth view if user not connected and view not active
  if (!user && activeView !== 'auth') {
    return <Auth onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="flex w-screen h-screen overflow-hidden bg-[#09090b]">
      {/* Monorepo Sidebar */}
      <Sidebar 
        activeView={activeView} 
        onViewChange={setActiveView} 
        user={user} 
        onLogout={handleLogout} 
      />

      {/* Main Panel Canvas */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
         {/* Top Header Navigation */}
        <header className="px-6 py-4 border-b border-zinc-900 bg-zinc-950/40 backdrop-blur-md flex items-center justify-between shrink-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-cyan-500 flex items-center justify-center shadow-glow-purple">
              <Zap className="w-4.5 h-4.5 text-white" />
            </div>
            <h1 className="font-outfit text-sm font-extrabold text-white tracking-wide uppercase">
              Smart Ride Assistant
            </h1>
            <span className="text-[10px] bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded-md font-mono text-zinc-400 flex items-center gap-1">
              <span className="w-1 h-1 bg-cyan-400 rounded-full animate-pulse"></span>
              AETHER-AI ACTIVE
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Location pill */}
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900/40 border border-zinc-800/60 rounded-full text-xxs font-bold text-zinc-400 font-outfit uppercase">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span>Bangalore Urban</span>
            </div>

            {/* Wallet pill */}
            {user && (
              <div className="flex items-center gap-2 px-3.5 py-1.5 bg-zinc-900/40 border border-zinc-800/60 rounded-full text-xs font-bold text-white font-outfit">
                <Wallet className="w-4 h-4 text-cyan-400" />
                <span>₹{user.walletBalance.toFixed(2)}</span>
              </div>
            )}

            {/* Notification bell */}
            <div className="relative">
              <button 
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="w-9 h-9 rounded-xl bg-zinc-900/40 border border-zinc-800 hover:bg-zinc-900/80 flex items-center justify-center text-zinc-400 hover:text-white cursor-pointer relative"
              >
                <Bell className="w-4.5 h-4.5" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-zinc-950 animate-pulse"></span>
                )}
              </button>

              {/* Notification drop menu */}
              {notificationsOpen && (
                <div className="absolute top-12 right-0 w-80 bg-zinc-950 border border-zinc-800/80 rounded-3xl p-4 shadow-[0_12px_40px_rgba(0,0,0,0.5)] z-30 glass-panel">
                  <div className="flex justify-between items-center border-b border-zinc-850 pb-2 mb-3">
                    <h4 className="text-xs font-bold text-white font-outfit uppercase tracking-wider">Surge Notifications</h4>
                    <button 
                      onClick={() => setNotifications([])}
                      className="text-[9px] text-purple-400 font-bold hover:underline cursor-pointer bg-transparent border-none"
                    >
                      Clear All
                    </button>
                  </div>
                  <div className="flex flex-col gap-2.5 max-h-60 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((n) => (
                        <div key={n.id} className="p-2.5 bg-zinc-900/30 rounded-xl border border-zinc-800/20 text-[10px] leading-relaxed">
                          <strong className="text-white block font-outfit mb-0.5">{n.title}</strong>
                          <span className="text-zinc-500">{n.desc}</span>
                        </div>
                      ))
                    ) : (
                      <span className="text-[10px] text-zinc-650 font-mono text-center block py-4">No active notifications</span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar */}
            {user && (
              <img 
                src={`https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${user.name}`} 
                alt="Avatar" 
                className="w-8 h-8 rounded-full border border-purple-500/30"
              />
            )}
          </div>
        </header>

        {/* Content switch panels */}
        <div className="flex-1 overflow-hidden">
          {activeView === 'auth' && <Auth onAuthSuccess={handleAuthSuccess} />}
          {activeView === 'matching' && <CommuteMatching />}
          {activeView === 'insights' && <AIInsights prediction={prediction} />}
          {activeView === 'comparison' && <FullComparison prediction={prediction} onBookRide={triggerBooking} />}
          {activeView === 'routes' && <SmartRoutes pickup={pickup} dropoff={dropoff} prediction={prediction} />}
          {activeView === 'profile' && <ProfileEngine onProfileUpdate={fetchProfile} />}
          {activeView === 'admin' && <AdminTuner />}

          {activeView === 'dashboard' && (
            <div className="w-full h-full grid grid-cols-12 gap-6 p-6 lg:p-8 items-stretch overflow-hidden">
              
              {/* Left Column: Route Query & Map View */}
              <div className="col-span-12 lg:col-span-4 flex flex-col gap-5 overflow-hidden">
                
                {/* Search inputs */}
                <div className="p-5 rounded-3xl bg-zinc-950/40 border border-zinc-800/40 flex flex-col gap-4">
                  <h3 className="font-outfit text-sm font-extrabold text-white flex items-center gap-2">
                    <Navigation className="w-4.5 h-4.5 text-cyan-400" />
                    EMMDE Route Query
                  </h3>

                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] uppercase font-bold text-zinc-500 tracking-wider">Pickup Corridor</label>
                      <div className="relative">
                        <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400" />
                        <select
                          value={pickup}
                          onChange={(e) => setPickup(e.target.value)}
                          className="w-full bg-zinc-900/40 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-cyan-500 transition-all font-outfit"
                        >
                          <option value="Central Business District">Central Business District</option>
                          <option value="Residential Suburb Sect-D">Residential Suburb Sect-D</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] uppercase font-bold text-zinc-500 tracking-wider">Destination Hub</label>
                      <div className="relative">
                        <Navigation className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                        <select
                          value={dropoff}
                          onChange={(e) => setDropoff(e.target.value)}
                          className="w-full bg-zinc-900/40 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-purple-500 transition-all font-outfit"
                        >
                          <option value="International Tech Park">International Tech Park</option>
                          <option value="Software Technology Park">Software Technology Park</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Quick Chips */}
                  <div className="flex flex-col gap-1.5 mt-1">
                    <span className="text-[9px] uppercase font-bold text-zinc-500 tracking-wider">Quick Hotspots</span>
                    <div className="flex gap-2 flex-wrap">
                      <button 
                        onClick={() => handleQuickChip('CBD', 'STP')}
                        className="px-2.5 py-1.5 bg-zinc-900 border border-zinc-850 hover:border-purple-500/40 text-[9px] text-zinc-350 rounded-lg font-outfit transition-all cursor-pointer"
                      >
                        📍 Home (CBD → STP)
                      </button>
                      <button 
                        onClick={() => handleQuickChip('CBD', 'ITPL')}
                        className="px-2.5 py-1.5 bg-zinc-900 border border-zinc-850 hover:border-purple-500/40 text-[9px] text-zinc-350 rounded-lg font-outfit transition-all cursor-pointer"
                      >
                        💼 Work (CBD → ITPL)
                      </button>
                      <button 
                        onClick={() => handleQuickChip('Suburb', 'ITPL')}
                        className="px-2.5 py-1.5 bg-zinc-900 border border-zinc-850 hover:border-purple-500/40 text-[9px] text-zinc-350 rounded-lg font-outfit transition-all cursor-pointer"
                      >
                        🕒 Recent (Suburb → ITPL)
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => executeSearch()}
                    disabled={searchLoading}
                    className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white rounded-xl text-xs font-bold font-outfit shadow-glow-purple border-none cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>{searchLoading ? 'Evaluating Ride Metrics...' : 'Evaluate optimal routes'}</span>
                  </button>
                </div>

                {/* Map View Container Card */}
                <div className="flex-1 min-h-[220px] relative overflow-hidden rounded-3xl border border-zinc-800/40">
                  <MapContainer pickup={pickup} dropoff={dropoff} />
                </div>

              </div>

              {/* Right Column: AI HERO Rec & Secondary Provider Cards */}
              <div className="col-span-12 lg:col-span-8 flex flex-col gap-5 h-full overflow-hidden">
                
                {/* PRIMARY FOCUS: Hero AI Recommendation Card */}
                <div className="flex-1 flex flex-col min-h-[240px]">
                  <AIRecommendation 
                    prediction={prediction} 
                    onBookRide={triggerBooking}
                  />
                </div>

                {/* SECONDARY SECTION: Ride Comparison Cards */}
                {prediction && (
                  <div className="flex flex-col gap-2.5">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-550 block">Direct Provider Options</span>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {prediction.allOptions
                        .filter((opt: any) => ['Uber', 'Ola', 'Rapido'].includes(opt.provider))
                        .slice(0, 3)
                        .map((opt: any) => {
                          let provColor = 'border-zinc-800 bg-zinc-900/20';
                          if (opt.provider === 'Ola') provColor = 'border-lime-500/10 bg-lime-950/5';
                          if (opt.provider === 'Rapido') provColor = 'border-yellow-500/10 bg-yellow-950/5';
                          if (opt.provider === 'Uber') provColor = 'border-cyan-500/10 bg-cyan-950/5';

                          return (
                            <div 
                              key={opt.name} 
                              onClick={() => setSelectedRide(opt)}
                              className={`p-4.5 rounded-2xl border transition-all cursor-pointer flex flex-col gap-2.5 ${provColor} hover:border-purple-500/40`}
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <span className="text-[9px] font-bold text-zinc-500 font-outfit uppercase tracking-wide block">{opt.provider}</span>
                                  <span className="text-xs font-extrabold text-white block mt-0.5">{opt.name.replace('Uber ', '').replace('Ola ', '').replace('Rapido ', '')}</span>
                                </div>
                                <span className="text-sm font-black text-white font-outfit">₹{opt.fare}</span>
                              </div>
                              
                              <div className="flex justify-between items-center text-[10px] font-mono text-zinc-400 border-t border-zinc-900/60 pt-2">
                                <span>ETA: {opt.duration}m</span>
                                <span className="text-purple-400 font-bold">{opt.recommendationScore}% score</span>
                              </div>

                              {/* Reliability meter */}
                              <div className="flex flex-col gap-1 mt-0.5">
                                <div className="flex justify-between text-[9px] text-zinc-500 font-mono">
                                  <span>Reliability Score</span>
                                  <span className="text-zinc-300 font-semibold">{opt.stability.stabilityScore}%</span>
                                </div>
                                <div className="w-full h-1 bg-zinc-950 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                                    style={{ width: `${opt.stability.stabilityScore}%` }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )}

                {/* BOTTOM STICKY CTA: Compare All Options */}
                <button
                  onClick={() => setActiveView('comparison')}
                  className="w-full py-3.5 bg-zinc-950/60 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-xxs font-black text-zinc-400 hover:text-white rounded-2xl font-outfit uppercase tracking-widest cursor-pointer transition-all flex items-center justify-center gap-2"
                >
                  <span>Compare All Options</span>
                  <ArrowRight className="w-4 h-4 text-zinc-400" />
                </button>

              </div>
            </div>
          )}
        </div>

        {/* Floating Chatbot Reasoning widget */}
        <ChatbotWidget />

        {/* Dynamic Booking Dispatch Modal Overlay */}
        {bookingModalOpen && (
          <div className="fixed inset-0 bg-black/65 backdrop-blur-md flex items-center justify-center z-50">
            <div className="w-full max-w-md bg-zinc-950 border border-zinc-800/80 rounded-3xl p-6 glass-panel animate-fade-in flex flex-col gap-5 text-center relative">
              <button 
                onClick={() => setBookingModalOpen(false)}
                className="absolute top-4 right-4 text-zinc-500 hover:text-white cursor-pointer bg-transparent border-none"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex justify-center relative py-4">
                {bookingState === 'searching' ? (
                  <div className="w-16 h-16 rounded-full border-4 border-dashed border-cyan-400/30 flex items-center justify-center animate-spin-slow shadow-glow-cyan">
                    <Zap className="w-8 h-8 text-cyan-400 animate-pulse" />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                    <CheckCircle className="w-8 h-8 text-emerald-400 animate-pulse" />
                  </div>
                )}
              </div>

              <div>
                <h3 className="font-outfit text-md font-extrabold text-white">
                  {bookingState === 'searching' ? 'Synthesizing Ride Dispatch...' : 'Optimal Driver Matched!'}
                </h3>
                <p className="text-zinc-500 text-xs mt-1">
                  {bookingState === 'searching' 
                    ? 'EMMDE algorithm contacting vehicle APIs for availability verification.' 
                    : 'Aether security checks cleared. Boarding ready.'}
                </p>
              </div>

              {bookingState === 'matched' && matchedDriver && (
                <div className="flex justify-between items-center p-3.5 bg-zinc-900/40 border border-zinc-800 rounded-2xl text-left mt-2">
                  <div className="flex items-center gap-3">
                    <img 
                      src={`https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${matchedDriver.name}`} 
                      alt="Driver" 
                      className="w-10 h-10 rounded-full border border-purple-500/20 bg-zinc-950"
                    />
                    <div>
                      <span className="text-xs font-bold text-white block font-outfit">{matchedDriver.name}</span>
                      <span className="text-[9px] text-zinc-500 block font-mono">{matchedDriver.plate} • {bookingRide.name}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black text-cyan-400 font-outfit block">{matchedDriver.rating} ★</span>
                    <span className="text-[9px] text-zinc-500 font-medium">Driver Rating</span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 border-t border-zinc-850 pt-4 mt-2">
                <div className="text-left">
                  <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-wider block">Trip Fare</span>
                  <span className="text-md font-black text-cyan-400 font-outfit">₹{bookingRide?.fare}</span>
                </div>
                <div className="text-right">
                  <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-wider block">Wallet Balance</span>
                  <span className="text-md font-black text-purple-400 font-outfit">₹{user?.walletBalance.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex gap-3 mt-2">
                <button
                  onClick={() => setBookingModalOpen(false)}
                  className="flex-1 py-3 bg-zinc-900/40 hover:bg-zinc-900/80 border border-zinc-800 text-zinc-400 rounded-2xl text-xs font-bold font-outfit cursor-pointer transition-all"
                >
                  Cancel Search
                </button>
                {bookingState === 'matched' && (
                  <button
                    onClick={confirmBooking}
                    className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white rounded-2xl text-xs font-bold font-outfit shadow-glow-purple border-none cursor-pointer transition-all"
                  >
                    Confirm & Start Trip
                  </button>
                )}
              </div>

            </div>
          </div>
        )}

      </main>
    </div>
  );
}
