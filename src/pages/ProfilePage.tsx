// src/pages/ProfilePage.tsx
import { useMemo } from "react";
import BottomNav from "../components/BottomNav";
import { useAuth } from "../context/AuthContext";
import { useProfile } from "../hooks/useProfile";
import { useYearlyActivity } from "../hooks/useYearlyActivity";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";

// --- Icons ---
const MailIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>;
const CalendarIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>;
const LogOutIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>;
const ShieldIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
const EditIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>;

export default function ProfilePage() {
  const { profile, isLoading } = useProfile();
  const { signOut } = useAuth();
  const { yearlyActivity } = useYearlyActivity();

  // --- Logic: Level Calculation ---
  // Calculate a "Level" based on total activities to make the profile feel like a game character
  const totalActivities = useMemo(() => {
    return yearlyActivity?.reduce((acc, curr) => acc + curr.count, 0) || 0;
  }, [yearlyActivity]);
  
  const currentLevel = Math.floor(totalActivities / 10) + 1;
  const progressToNext = (totalActivities % 10) * 10; // Percentage

  // --- Logic: Date Range ---
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 160); // Slightly less than 180 to ensure full fit on mobile

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="relative">
             <div className="w-16 h-16 rounded-full border-4 border-slate-800 border-t-orange-500 animate-spin" />
             <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-orange-500/20 blur-sm" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-32 font-sans selection:bg-orange-500/30">
      
      {/* Ambient Background & Noise */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-orange-500/5 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute top-[10%] left-[-20%] w-[400px] h-[400px] bg-blue-600/5 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
      </div>

      <div className="relative max-w-md mx-auto px-6 pt-12 flex flex-col items-center gap-8 animate-in slide-in-from-bottom-5 duration-700 fade-in">

        {/* --- Profile Header & Level --- */}
        <div className="flex flex-col items-center gap-4 w-full">
          <div className="relative group cursor-pointer">
            {/* Animated Glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-orange-500 to-amber-500 rounded-full blur-md opacity-40 group-hover:opacity-70 transition-opacity duration-500 animate-pulse" />
            
            <div className="relative w-28 h-28 rounded-full bg-slate-900 border-4 border-slate-800 flex items-center justify-center text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-orange-400 to-amber-200 shadow-2xl z-10">
              {profile?.username?.charAt(0).toUpperCase()}
            </div>
            
            {/* Edit Badge */}
            <div className="absolute bottom-0 right-0 bg-slate-800 border border-slate-700 text-slate-400 p-2 rounded-full hover:bg-slate-700 hover:text-white transition-colors z-20">
                <EditIcon />
            </div>
          </div>
          
          <div className="text-center w-full">
            <h1 className="text-3xl font-black text-white tracking-tight mb-1">{profile?.username}</h1>
            
            {/* Level Progress Bar */}
            <div className="flex flex-col items-center gap-2 max-w-[200px] mx-auto">
                <div className="flex items-center justify-between w-full text-[10px] uppercase font-bold tracking-widest text-slate-500">
                    <span className="text-orange-500">Lvl {currentLevel}</span>
                    <span>{progressToNext}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full transition-all duration-1000"
                        style={{ width: `${progressToNext}%` }}
                    />
                </div>
            </div>
          </div>
        </div>

        {/* --- Hero Stats (Streak & Tokens) --- */}
        <div className="grid grid-cols-2 gap-4 w-full">
            {/* Streak Card */}
            <div className="bg-gradient-to-br from-slate-900/80 to-slate-900/40 backdrop-blur-md border border-orange-500/20 rounded-2xl p-4 flex flex-col items-center relative overflow-hidden group hover:border-orange-500/40 transition-all hover:-translate-y-1">
                <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-40 transition-opacity blur-[1px]">🔥</div>
                <span className="text-3xl mb-1 filter drop-shadow-[0_0_15px_rgba(249,115,22,0.6)] animate-pulse">🔥</span>
                <span className="text-3xl font-black text-white">{profile?.streak_count}</span>
                <span className="text-[10px] uppercase font-bold text-orange-400/80 tracking-widest">Day Streak</span>
            </div>

            {/* Freeze Card */}
            <div className="bg-gradient-to-br from-slate-900/80 to-slate-900/40 backdrop-blur-md border border-blue-500/20 rounded-2xl p-4 flex flex-col items-center relative overflow-hidden group hover:border-blue-500/40 transition-all hover:-translate-y-1">
                <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-40 transition-opacity blur-[1px]">🧊</div>
                <span className="text-3xl mb-1 filter drop-shadow-[0_0_15px_rgba(59,130,246,0.6)]">🧊</span>
                <span className="text-3xl font-black text-white">{profile?.freeze_tokens}</span>
                <span className="text-[10px] uppercase font-bold text-blue-400/80 tracking-widest">Freezes</span>
            </div>
        </div>

        {/* --- Heatmap Section --- */}
        <div className="w-full bg-slate-900/60 backdrop-blur-xl border border-white/5 rounded-3xl p-6 shadow-xl relative overflow-hidden group">
             {/* Decorative grid bg */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 mix-blend-overlay"></div>
            
            <div className="flex items-center justify-between mb-6 relative z-10">
                 <div className="flex items-center gap-2">
                    <CalendarIcon />
                    <span className="text-slate-300 text-xs font-bold uppercase tracking-[0.2em]">Activity Map</span>
                 </div>
                 <div className="text-[10px] font-mono text-slate-500">
                    {totalActivities} Total Sessions
                 </div>
            </div>

            {/* We use Tailwind arbitrary values [&_rect] to style the SVG 
                without needing an external CSS file or style tag.
            */}
            <div className="w-full overflow-x-auto pb-2 scrollbar-hide relative z-10 
                [&_.react-calendar-heatmap_text]:text-[8px] [&_.react-calendar-heatmap_text]:fill-slate-600 [&_.react-calendar-heatmap_text]:font-bold
                [&_.react-calendar-heatmap_rect]:rx-[3px] [&_.react-calendar-heatmap_rect]:transition-all [&_.react-calendar-heatmap_rect]:duration-300
                [&_.react-calendar-heatmap_rect:hover]:stroke-white [&_.react-calendar-heatmap_rect:hover]:stroke-1
            ">
                <div className="min-w-[300px]">
                  <CalendarHeatmap
                      startDate={startDate}
                      endDate={endDate}
                      values={yearlyActivity ?? []}
                      gutterSize={3}
                      showWeekdayLabels={true}
                      titleForValue={(value) => value ? `${value.date}: ${value.count} activities` : ""}
                      classForValue={(value) => {
                        if (!value || value.count === 0) return "fill-slate-800/50";
                        if (value.count === 1) return "fill-orange-900";
                        if (value.count === 2) return "fill-orange-700";
                        if (value.count === 3) return "fill-orange-500 drop-shadow-[0_0_3px_rgba(249,115,22,0.5)]";
                        return "fill-amber-400 drop-shadow-[0_0_5px_rgba(251,191,36,0.6)]";
                      }}
                  />
                </div>
            </div>
          
            {/* Legend */}
            <div className="flex items-center justify-end gap-2 mt-4 border-t border-white/5 pt-3">
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-600">Intensity</span>
                <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-[1px] bg-slate-800" />
                    <div className="w-2 h-2 rounded-[1px] bg-orange-900" />
                    <div className="w-2 h-2 rounded-[1px] bg-orange-700" />
                    <div className="w-2 h-2 rounded-[1px] bg-orange-500" />
                    <div className="w-2 h-2 rounded-[1px] bg-amber-400" />
                </div>
            </div>
        </div>

        {/* --- Account Details (ID Card Style) --- */}
        <div className="w-full space-y-4">
            <h3 className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] pl-2 flex items-center gap-2">
                <ShieldIcon /> Pilot Data
            </h3>
            
            <div className="bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden divide-y divide-white/5">
                <div className="flex items-center justify-between p-4 transition-colors hover:bg-white/5">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-800/50 border border-slate-700 flex items-center justify-center text-slate-400">
                            <MailIcon />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Email</span>
                            <span className="text-sm font-medium text-slate-200 font-mono">{profile?.email}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between p-4 transition-colors hover:bg-white/5">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-800/50 border border-slate-700 flex items-center justify-center text-slate-400">
                            <CalendarIcon />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Birthdate</span>
                            <span className="text-sm font-medium text-slate-200 font-mono">{profile?.birthdate || "N/A"}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* --- Sign Out --- */}
        <div className="w-full pt-4">
            <button
              onClick={signOut}
              className="group relative w-full flex items-center justify-center gap-3 py-4 rounded-xl border border-red-500/30 text-red-400 font-bold tracking-wide hover:bg-red-500/10 transition-all active:scale-[0.98] overflow-hidden"
            >
              <div className="absolute inset-0 bg-red-500/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <LogOutIcon />
              <span className="relative z-10">Disengage / Sign Out</span>
            </button>
            <p className="text-center text-[10px] text-slate-600 mt-6 uppercase tracking-widest opacity-50">
                Streak Base v1.2.0
            </p>
        </div>

      </div>
      <BottomNav />
    </div>
  );
}