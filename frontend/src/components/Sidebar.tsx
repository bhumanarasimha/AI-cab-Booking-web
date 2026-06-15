import { 
  Home, 
  Users, 
  ShieldCheck, 
  LogOut, 
  Zap, 
  Lock,
  Sparkles,
  Layers,
  Navigation,
  User 
} from 'lucide-react';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
  user: any;
  onLogout: () => void;
}

export default function Sidebar({ activeView, onViewChange, user, onLogout }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'AI Command Center', icon: Home },
    { id: 'insights', label: 'AI Insights', icon: Sparkles },
    { id: 'comparison', label: 'Full Comparison', icon: Layers },
    { id: 'routes', label: 'Smart Routes', icon: Navigation },
    { id: 'profile', label: 'Personalization', icon: User },
    { id: 'matching', label: 'Commute Matching', icon: Users },
    { id: 'admin', label: 'Admin Control', icon: ShieldCheck }
  ];

  return (
    <aside className="w-64 bg-zinc-950/80 border-r border-zinc-800/60 backdrop-blur-xl flex flex-col h-screen shrink-0 relative z-20">
      {/* Brand Header */}
      <div className="p-6 border-b border-zinc-800/40 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center">
          <Zap className="w-5 h-5 text-purple-400 animate-pulse" />
        </div>
        <div>
          <h2 className="font-outfit text-md font-extrabold text-white tracking-wide">
            SMARTRIDE <span className="text-cyan-400">AI</span>
          </h2>
          <span className="text-[9px] text-zinc-500 font-mono block tracking-widest uppercase">
            AETHER-EMMDE v3.0
          </span>
        </div>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 px-4 py-6 flex flex-col gap-1.5 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group border ${
                isActive 
                  ? 'bg-purple-500/8 border-purple-500/20 text-white shadow-glow-purple' 
                  : 'bg-transparent border-transparent text-zinc-400 hover:text-white hover:bg-zinc-900/40'
              }`}
            >
              <Icon className={`w-5 h-5 transition-transform duration-200 group-hover:translate-x-[2px] ${
                isActive ? 'text-purple-400' : 'text-zinc-500 group-hover:text-zinc-300'
              }`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Profile & Footer */}
      <div className="p-4 border-t border-zinc-800/40">
        {user ? (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3 p-2 bg-zinc-900/30 rounded-xl border border-zinc-800/20">
              <img 
                src={`https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${user.name}`} 
                alt="Avatar" 
                className="w-9 h-9 rounded-full border border-purple-500/30"
              />
              <div className="truncate">
                <span className="text-xs font-semibold text-white block truncate">{user.name}</span>
                <span className="text-[10px] text-purple-400 block font-outfit truncate">{user.email}</span>
              </div>
            </div>
            
            <button
              onClick={onLogout}
              className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 rounded-xl text-xs font-bold font-outfit transition-all duration-200"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out Session</span>
            </button>
          </div>
        ) : (
          <button
            onClick={() => onViewChange('auth')}
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white rounded-xl text-xs font-bold font-outfit shadow-glow-purple transition-all duration-200 border-none"
          >
            <Lock className="w-4 h-4" />
            <span>Connect Profile</span>
          </button>
        )}
      </div>
    </aside>
  );
}
