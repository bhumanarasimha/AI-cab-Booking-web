import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  MapPin, 
  Clock, 
  MessageSquare, 
  Send, 
  ShieldCheck, 
  Filter, 
  UserCheck, 
  Coins 
} from 'lucide-react';
import axios from 'axios';

interface Companion {
  id: string;
  name: string;
  gender: string;
  age: number;
  originName: string;
  destinationName: string;
  departureTime: string;
  costShare: number;
  isVerified: boolean;
  avatarSeed: string;
  compatibility: {
    compatibilityScore: number;
    distanceFrictionKm: number;
    timeFrictionMinutes: number;
    isMatchable: boolean;
  };
}

export default function CommuteMatching() {
  const [companions, setCompanions] = useState<Companion[]>([]);
  const [genderFilter, setGenderFilter] = useState<'all' | 'male' | 'female'>('all');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [activeCompanion, setActiveCompanion] = useState<Companion | null>(null);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Fetch matches from Express backend using simulated parameters
  const fetchMatches = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/commutes/matches', {
        originCoords: [12.9716, 77.5946], // CBD Coordinates
        destinationCoords: [12.9868, 77.7347], // Whitefield ITPL
        departureTime: '18:15',
        genderPreference: 'any'
      });
      setCompanions(response.data);
    } catch (err) {
      console.error('Error fetching matches:', err);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  // Fetch chat history for selected companion
  useEffect(() => {
    if (!activeCompanion) return;

    const fetchChat = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/chat/${activeCompanion.id}`);
        setChatMessages(response.data);
        scrollToBottom();
      } catch (err) {
        console.error('Error fetching chat history:', err);
      }
    };

    fetchChat();
  }, [activeCompanion]);

  const scrollToBottom = () => {
    setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCompanion || !inputMessage.trim()) return;

    try {
      const response = await axios.post(`http://localhost:5000/api/chat/${activeCompanion.id}/send`, {
        text: inputMessage
      });
      if (response.data.success) {
        setChatMessages(response.data.history);
        setInputMessage('');
        scrollToBottom();

        // Simulate a peer typing reply after 1.5 seconds
        setTimeout(async () => {
          try {
            // Get updated logs (simulated response triggers automatic typing response in server DB state)
            const chatRes = await axios.get(`http://localhost:5000/api/chat/${activeCompanion.id}`);
            // If they replied, type a simulated message
            const peerMsg = [
              "Perfect! Let's meet at the pickup location in 10 minutes.",
              "That works for me. I'll split the fare once you request it on the app.",
              "Sounds good. Shall we book the Ola Auto?"
            ];
            
            // Add peer message simulation via server side push
            await axios.post(`http://localhost:5000/api/chat/${activeCompanion.id}/send`, {
              text: peerMsg[Math.floor(Math.random() * peerMsg.length)]
            });
            
            const finalChat = await axios.get(`http://localhost:5000/api/chat/${activeCompanion.id}`);
            setChatMessages(finalChat.data);
            scrollToBottom();
          } catch (e) {
            console.error(e);
          }
        }, 1500);
      }
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  const filteredCompanions = companions.filter((c) => {
    if (genderFilter !== 'all' && c.gender !== genderFilter) return false;
    if (verifiedOnly && !c.isVerified) return false;
    return true;
  });

  return (
    <div className="flex-1 p-6 lg:p-8 flex flex-col gap-6 overflow-hidden h-screen bg-[#09090b]">
      {/* Header bar */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div>
          <h1 className="font-outfit text-2xl font-black text-white">Smart Commute Matching</h1>
          <p className="text-zinc-500 text-xs mt-0.5">Route Compatibility Matching Algorithm (RCMA) matches daily route corridors.</p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900/40 border border-zinc-800/60 rounded-xl">
            <Filter className="w-3.5 h-3.5 text-zinc-500" />
            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value as any)}
              className="bg-transparent border-none text-xs text-white focus:outline-none cursor-pointer font-outfit"
            >
              <option value="all">All Genders</option>
              <option value="male">Male Only</option>
              <option value="female">Female Only</option>
            </select>
          </div>

          <label className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900/40 border border-zinc-800/60 rounded-xl text-xs text-white cursor-pointer select-none font-outfit">
            <input
              type="checkbox"
              checked={verifiedOnly}
              onChange={(e) => setVerifiedOnly(e.target.checked)}
              className="accent-purple-500 rounded"
            />
            <span>Office Verified Only</span>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 items-stretch flex-1 overflow-hidden">
        
        {/* Companion listings column */}
        <div className="col-span-12 lg:col-span-7 flex flex-col gap-4 overflow-y-auto pr-2">
          {filteredCompanions.map((companion) => (
            <div
              key={companion.id}
              onClick={() => setActiveCompanion(companion)}
              className={`p-5 rounded-3xl border transition-all duration-200 cursor-pointer flex flex-col gap-4 ${
                activeCompanion?.id === companion.id
                  ? 'bg-purple-500/5 border-purple-500/40'
                  : 'bg-zinc-900/30 border-zinc-800/40 hover:bg-zinc-900/60 hover:border-zinc-700/40'
              }`}
            >
              {/* Profile Card Header */}
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={`https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${companion.avatarSeed}`}
                      alt={companion.name}
                      className="w-10 h-10 rounded-full border border-purple-500/30 bg-zinc-900"
                    />
                    {companion.isVerified && (
                      <span className="absolute -bottom-1 -right-1 bg-zinc-950 p-0.5 rounded-full">
                        <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                      </span>
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-white font-outfit flex items-center gap-1.5">
                      <span>{companion.name}</span>
                      <span className="text-[10px] text-zinc-500 font-mono font-normal">({companion.age} y/o)</span>
                    </h4>
                    <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 mt-0.5 font-medium font-outfit">
                      <span className="text-cyan-400">Match score: {companion.compatibility.compatibilityScore}%</span>
                    </div>
                  </div>
                </div>

                <div className="px-2.5 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-black rounded-lg font-outfit uppercase tracking-wider">
                  RCMA Verified
                </div>
              </div>

              {/* Travel Corridor Details */}
              <div className="grid grid-cols-2 gap-4 bg-zinc-950/40 p-3 rounded-2xl border border-zinc-800/30">
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-cyan-400" />
                    Commute Corridor
                  </span>
                  <span className="text-[11px] font-bold text-white truncate">{companion.originName} → {companion.destinationName}</span>
                </div>
                <div className="flex flex-col gap-1 text-right">
                  <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider block">Departure Window</span>
                  <span className="text-[11px] font-bold text-cyan-400 block">{companion.departureTime} • Today</span>
                </div>
              </div>

              {/* Footer pricing share */}
              <div className="flex justify-between items-center border-t border-zinc-800/40 pt-3">
                <div className="flex items-center gap-2 text-xs text-zinc-400">
                  <Coins className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Cost Split Share: <strong className="text-white font-outfit">₹{companion.costShare}</strong></span>
                </div>
                
                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900/60 border border-zinc-800 hover:border-purple-500/40 text-purple-400 rounded-lg text-[10px] font-bold font-outfit transition-all duration-200">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Open Chat</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Chat window column */}
        <div className="col-span-12 lg:col-span-5 flex flex-col h-full bg-zinc-950/40 border border-zinc-800/60 rounded-3xl overflow-hidden glass-panel relative">
          {activeCompanion ? (
            <div className="flex flex-col h-full overflow-hidden">
              
              {/* Active Chat Header */}
              <div className="p-4 border-b border-zinc-800/60 flex justify-between items-center bg-zinc-900/20">
                <div className="flex items-center gap-3">
                  <img
                    src={`https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${activeCompanion.avatarSeed}`}
                    alt={activeCompanion.name}
                    className="w-8 h-8 rounded-full border border-purple-500/20 bg-zinc-900"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-white font-outfit">{activeCompanion.name}</h4>
                    <span className="text-[9px] text-emerald-400 flex items-center gap-1 font-medium font-outfit mt-0.5">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                      Online Match ({activeCompanion.compatibility.compatibilityScore}% Overlap)
                    </span>
                  </div>
                </div>
              </div>

              {/* Chat messages canvas */}
              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
                {chatMessages.map((msg, index) => {
                  const isMe = msg.sender === 'me';
                  return (
                    <div
                      key={index}
                      className={`flex flex-col max-w-[75%] p-3 rounded-2xl text-xs leading-relaxed ${
                        isMe 
                          ? 'bg-purple-500/8 border border-purple-500/20 text-white self-end rounded-br-none' 
                          : 'bg-zinc-900/40 border border-zinc-800/40 text-zinc-300 self-start rounded-bl-none'
                      }`}
                    >
                      <p>{msg.text}</p>
                      <span className="text-[9px] text-zinc-500 block text-right mt-1 font-mono">{msg.time}</span>
                    </div>
                  );
                })}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input form */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-zinc-800/60 flex gap-2 bg-zinc-900/10">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Send time details and coordinate dispatch..."
                  className="flex-1 bg-zinc-900/40 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500 transition-all font-outfit"
                />
                <button
                  type="submit"
                  className="w-10 h-10 rounded-xl bg-purple-600 hover:bg-purple-500 flex items-center justify-center text-white border-none cursor-pointer transition-all duration-200"
                >
                  <Send className="w-4.5 h-4.5" />
                </button>
              </form>

            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-zinc-500 font-medium py-12 p-8 text-center">
              <MessageSquare className="w-8 h-8 text-zinc-700 animate-pulse mb-3" />
              <p className="text-xs">Select a commuter match profile to open coordinate communication chat.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
