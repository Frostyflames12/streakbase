// src/pages/ProfilePage.tsx
import BottomNav from "../components/BottomNav";
import { useAuth } from "../context/AuthContext";
import { useProfile } from "../hooks/useProfile";
import { useYearlyActivity } from "../hooks/useYearlyActivity";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";

// Icons
const MailIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>;
const CalendarIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>;
const LogOutIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>;

export default function ProfilePage() {
  const { profile, isLoading } = useProfile();
  const { signOut } = useAuth();
  const { yearlyActivity } = useYearlyActivity();

  // UX Decision: 180 days (6 months) looks much cleaner and "app-like" on mobile
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 180); 

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-slate-800 border-t-orange-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-32 font-sans selection:bg-orange-500/30">
      
      {/* Ambient Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-orange-500/5 blur-[120px] rounded-full" />
        <div className="absolute top-[10%] left-[-20%] w-[400px] h-[400px] bg-blue-600/5 blur-[120px] rounded-full" />
      </div>

      <div className="relative max-w-md mx-auto px-6 pt-12 flex flex-col items-center gap-8">

        {/* --- Profile Header --- */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-tr from-orange-500 to-amber-500 rounded-full blur opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
            <div className="relative w-28 h-28 rounded-full bg-slate-900 border-4 border-slate-800 flex items-center justify-center text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-orange-400 to-amber-200 shadow-2xl">
              {profile?.username?.charAt(0).toUpperCase()}
            </div>
            {/* Online Status Dot */}
            <div className="absolute bottom-1 right-2 w-6 h-6 bg-slate-900 rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-900 animate-pulse" />
            </div>
          </div>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white tracking-tight">{profile?.username}</h1>
            <span className="text-sm text-slate-500 font-medium">Consistency Master</span>
          </div>
        </div>

        {/* --- Hero Stats (Streak & Tokens) --- */}
        <div className="grid grid-cols-2 gap-4 w-full">
            {/* Streak Card */}
            <div className="bg-slate-900/50 backdrop-blur-md border border-orange-500/20 rounded-2xl p-4 flex flex-col items-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-orange-500/5 group-hover:bg-orange-500/10 transition-colors" />
                <span className="text-3xl mb-1 filter drop-shadow-[0_0_10px_rgba(249,115,22,0.5)]">🔥</span>
                <span className="text-2xl font-black text-white">{profile?.streak_count}</span>
                <span className="text-[10px] uppercase font-bold text-orange-400 tracking-wider">Current Streak</span>
            </div>

            {/* Freeze Card */}
            <div className="bg-slate-900/50 backdrop-blur-md border border-blue-500/20 rounded-2xl p-4 flex flex-col items-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-blue-500/5 group-hover:bg-blue-500/10 transition-colors" />
                <span className="text-3xl mb-1 filter drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]">🧊</span>
                <span className="text-2xl font-black text-white">{profile?.freeze_tokens}</span>
                <span className="text-[10px] uppercase font-bold text-blue-400 tracking-wider">Freeze Tokens</span>
            </div>
        </div>

        {/* --- Heatmap Section --- */}
        <div className="w-full bg-slate-900/60 backdrop-blur-xl border border-white/5 rounded-3xl p-6 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-6">
                 <span className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">Activity Map</span>
                 <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-1 rounded-md border border-slate-700">Last 6 Months</span>
            </div>

          {/* Custom Styles for the Heatmap SVGs */}
          <style>{`
            .react-calendar-heatmap text { font-size: 8px; fill: #64748b; font-weight: 600; }
            .react-calendar-heatmap rect { rx: 2.5px; transition: all 0.2s ease; }
            .react-calendar-heatmap rect:hover { stroke: #fff; stroke-width: 1px; }
            
            /* Color Scale */
            .react-calendar-heatmap .color-empty { fill: #1e293b; }
            
            /* Low Activity */
            .react-calendar-heatmap .color-scale-1 { fill: #7c2d12; }
            .react-calendar-heatmap .color-scale-2 { fill: #c2410c; }
            
            /* High Activity (Glow Effect) */
            .react-calendar-heatmap .color-scale-3 { fill: #ea580c; filter: drop-shadow(0 0 2px rgba(234,88,12,0.5)); }
            .react-calendar-heatmap .color-scale-4 { fill: #fbbf24; filter: drop-shadow(0 0 4px rgba(251,191,36,0.6)); }
          `}</style>
          
          <div className="w-full overflow-x-auto pb-2 scrollbar-hide">
              <div className="min-w-[300px]">
                <CalendarHeatmap
                    startDate={startDate}
                    endDate={endDate}
                    values={yearlyActivity ?? []}
                    gutterSize={3}
                    showWeekdayLabels={true}
                    // Replaced react-tooltip with standard HTML title attribute
                    titleForValue={(value) => {
                      if (!value) return "";
                      return `${value.date}: ${value.count} activities`;
                    }}
                    classForValue={(value) => {
                      if (!value || value.count === 0) return "color-empty";
                      if (value.count === 1) return "color-scale-1";
                      if (value.count === 2) return "color-scale-2";
                      if (value.count === 3) return "color-scale-3";
                      return "color-scale-4";
                    }}
                />
              </div>
          </div>
          
          {/* Legend */}
          <div className="flex items-center justify-end gap-2 mt-2">
            <span className="text-[10px] text-slate-500">Less</span>
            <div className="flex gap-1">
                <div className="w-2.5 h-2.5 rounded-[2px] bg-[#1e293b]" />
                <div className="w-2.5 h-2.5 rounded-[2px] bg-[#7c2d12]" />
                <div className="w-2.5 h-2.5 rounded-[2px] bg-[#ea580c]" />
                <div className="w-2.5 h-2.5 rounded-[2px] bg-[#fbbf24]" />
            </div>
            <span className="text-[10px] text-slate-500">More</span>
          </div>
        </div>

        {/* --- Account Details --- */}
        <div className="w-full space-y-3">
            <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider pl-2">Account Info</h3>
            
            <div className="bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-white/5 hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
                            <MailIcon />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs text-slate-500">Email Address</span>
                            <span className="text-sm font-medium text-slate-200">{profile?.email}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
                            <CalendarIcon />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs text-slate-500">Date of Birth</span>
                            <span className="text-sm font-medium text-slate-200">{profile?.birthdate || "Not set"}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* --- Sign Out --- */}
        <button
          onClick={signOut}
          className="group w-full flex items-center justify-center gap-2 py-4 rounded-2xl border border-red-500/20 text-red-400 font-semibold hover:bg-red-500/10 transition-all active:scale-[0.98]"
        >
          <LogOutIcon />
          <span>Sign Out</span>
        </button>

      </div>
      <BottomNav />
    </div>
  );
}