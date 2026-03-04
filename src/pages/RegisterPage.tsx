// src/pages/RegisterPage.tsx
import { Link, useNavigate } from "react-router-dom";
import { useRegister } from "../hooks/useRegister";

// --- Icons ---
const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)

const MailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
)

const CalendarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
)

const LockIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
)

const ArrowRightIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
)

const FlameIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_0_15px_rgba(249,115,22,0.5)]">
    <path
      d="M8.5 14.5C7.5 13 7 11.5 7 9.5C7 6 9.5 3 12 2C14.5 3 17 6 17 9.5C17 11.5 16.5 13 15.5 14.5C17 15.5 18 17.5 18 19.5C18 21.5 16 23 14 23C13 23 11.5 22 12 20C12.5 18 14 16.5 14.5 15.5C13.5 15 12 14 10.5 15.5C9 17 8.5 18.5 8 20C7.5 21.5 6 23 4 23C2 23 0 21.5 0 19.5C0 17.5 1 15.5 2.5 14.5C1.5 13 1 11.5 1 9.5C1 4 6 0 12 0C18 0 23 4 23 9.5C23 11.5 22.5 13 21.5 14.5C23 15.5 24 17.5 24 19.5C24 22.5 21 24 18 24C15.5 24 14 22.5 14 21.5C14 22.5 12.5 24 10 24C7 24 4 22.5 4 19.5C4 17.5 5 15.5 6.5 14.5C5.5 13 5 11.5 5 9.5C5 6.5 7 4.5 8.5 3.5C7.5 5.5 7 7.5 7 9.5C7 11.5 7.5 13 8.5 14.5Z"
      fill="url(#flameGradient_register)"
    />
    <defs>
      <linearGradient id="flameGradient_register" x1="12" y1="0" x2="12" y2="24" gradientUnits="userSpaceOnUse">
        <stop stopColor="#ea580c" />
        <stop offset="1" stopColor="#fbbf24" />
      </linearGradient>
    </defs>
  </svg>
);

export default function RegisterPage() {
  const { register, isLoading, error } = useRegister();
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const success = await register({
      username: formData.get("username") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      birthdate: formData.get("birthdate") as string,
    });

    if (success) navigate("/");
  }

  return (
    <div className="relative min-h-screen bg-slate-950 flex items-center justify-center p-6 overflow-hidden font-sans selection:bg-orange-500/30">
      
      {/* Background Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-orange-500/10 blur-[120px] rounded-full mix-blend-screen animate-pulse duration-[4000ms]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full mix-blend-screen" />
      {/* Noise Texture */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>

      <div className="relative w-full max-w-md z-10 animate-in slide-in-from-bottom-5 duration-700 fade-in">
        <div className="bg-slate-900/60 backdrop-blur-xl rounded-[2rem] p-8 md:p-10 shadow-2xl border border-white/10 relative overflow-hidden group/card">
           
           {/* Subtle top sheen */}
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

          {/* Logo Area */}
          <div className="flex flex-col items-center justify-center mb-10 group/logo cursor-default">
            <div className="relative mb-4 transition-transform duration-500 group-hover/logo:scale-110">
                <div className="absolute inset-0 bg-orange-500/20 blur-xl rounded-full group-hover/logo:bg-orange-500/30 transition-colors"></div>
                <FlameIcon />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight italic flex items-center gap-2">
              STREAK
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-400">
                BASE
              </span>
            </h1>
            <p className="text-slate-500 text-sm font-medium mt-2">Start your journey today.</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-200 p-4 rounded-xl mb-6 text-sm flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
               <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] ml-1 mb-2 block">
                Username
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-orange-500 transition-colors">
                  <UserIcon />
                </div>
                <input
                  name="username"
                  type="text"
                  placeholder="coolstreak99"
                  required
                  // Applied autofill fix
                  className="w-full py-4 pl-12 pr-4 rounded-xl bg-slate-950/50 text-white border border-slate-700/50 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all placeholder:text-slate-700 text-sm [&:-webkit-autofill]:shadow-[0_0_0_1000px_#020617_inset] [&:-webkit-autofill]:-webkit-text-fill-color-white"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] ml-1 mb-2 block">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-orange-500 transition-colors">
                  <MailIcon />
                </div>
                <input
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  required
                  // Applied autofill fix
                  className="w-full py-4 pl-12 pr-4 rounded-xl bg-slate-950/50 text-white border border-slate-700/50 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all placeholder:text-slate-700 text-sm [&:-webkit-autofill]:shadow-[0_0_0_1000px_#020617_inset] [&:-webkit-autofill]:-webkit-text-fill-color-white"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] ml-1 mb-2 block">
                Birthdate
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-orange-500 transition-colors">
                  <CalendarIcon />
                </div>
                <input
                  name="birthdate"
                  type="date"
                  required
                  style={{ colorScheme: 'dark' }} 
                  // Applied autofill fix
                  className="w-full py-4 pl-12 pr-4 rounded-xl bg-slate-950/50 text-white border border-slate-700/50 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all placeholder:text-slate-700 text-sm [&:-webkit-autofill]:shadow-[0_0_0_1000px_#020617_inset] [&:-webkit-autofill]:-webkit-text-fill-color-white"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] ml-1 mb-2 block">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-orange-500 transition-colors">
                  <LockIcon />
                </div>
                <input
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  // Applied autofill fix
                  className="w-full py-4 pl-12 pr-4 rounded-xl bg-slate-950/50 text-white border border-slate-700/50 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all placeholder:text-slate-700 text-sm [&:-webkit-autofill]:shadow-[0_0_0_1000px_#020617_inset] [&:-webkit-autofill]:-webkit-text-fill-color-white"
                />
              </div>
            </div>

            <div className="pt-2">
                <button
                disabled={isLoading}
                className="group relative w-full py-4 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 text-white font-bold text-lg shadow-lg shadow-orange-900/20 hover:shadow-orange-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 overflow-hidden"
                >
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                    <div className="relative flex items-center justify-center gap-2">
                        {isLoading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                <span>Creating Account...</span>
                            </>
                        ) : (
                            <>
                                <span>Create Account</span>
                                <ArrowRightIcon />
                            </>
                        )}
                    </div>
                </button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-slate-500 text-sm font-medium">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-orange-400 hover:text-orange-300 font-bold hover:underline decoration-2 underline-offset-4 transition-colors"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
        
         {/* Footer Branding */}
        <div className="text-center mt-6 opacity-30 hover:opacity-100 transition-opacity duration-500">
            <p className="text-[10px] text-slate-400 uppercase tracking-widest">Streak Base v1.0</p>
        </div>

      </div>
    </div>
  );
}