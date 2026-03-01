import BottomNav from "../components/BottomNav";
import { useAuth } from "../context/AuthContext";
import { useProfile } from "../hooks/useProfile";

export default function ProfilePage() {
  const { profile, isLoading } = useProfile();
  const { signOut } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-white pb-24">
      <div className="max-w-md mx-auto px-4 pt-10 flex flex-col items-center gap-6">

        {/* Avatar */}
        <div className="w-20 h-20 rounded-full bg-orange-500 flex items-center justify-center text-3xl font-bold text-white">
          {profile?.username?.charAt(0).toUpperCase()}
        </div>

        {/* Username */}
        <h1 className="text-2xl font-bold">{profile?.username}</h1>

        {/* Details Card */}
        <div className="w-full bg-slate-800/40 backdrop-blur-2xl border border-slate-700/50 rounded-2xl p-6 flex flex-col gap-4">
          
          <div className="flex justify-between items-center">
            <span className="text-slate-400 text-sm">Email</span>
            <span className="text-white text-sm">{profile?.email}</span>
          </div>

          <div className="h-px bg-slate-700/50" />

          <div className="flex justify-between items-center">
            <span className="text-slate-400 text-sm">Birthdate</span>
            <span className="text-white text-sm">{profile?.birthdate}</span>
          </div>

          <div className="h-px bg-slate-700/50" />

          <div className="flex justify-between items-center">
            <span className="text-slate-400 text-sm">Current Streak</span>
            <span className="text-orange-400 font-bold">🔥 {profile?.streak_count} days</span>
          </div>

          <div className="h-px bg-slate-700/50" />

          <div className="flex justify-between items-center">
            <span className="text-slate-400 text-sm">Freeze Tokens</span>
            <span className="text-blue-400 font-bold">🧊 {profile?.freeze_tokens}</span>
          </div>

        </div>

        {/* Sign Out */}
        <button
          onClick={signOut}
          className="w-full py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 font-semibold hover:bg-red-500/20 transition-colors"
        >
          Sign Out
        </button>

      </div>
      <BottomNav />
    </div>
  );
}