// src/pages/LoginPage.tsx
import { Link } from 'react-router-dom'
import { useLogin } from '../hooks/useLogin'
import { FlameIcon } from '../components/Icons'

// --- Page-specific icons ---
const MailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
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

export default function LoginPage() {
  const { formData, error, loading, handleChange, handleLogin } = useLogin()

  return (
    <div className="relative min-h-screen bg-slate-950 flex items-center justify-center p-6 overflow-hidden font-sans selection:bg-orange-500/30">

      {/* Background Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-orange-500/10 blur-[120px] rounded-full mix-blend-screen animate-pulse duration-[4000ms]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full mix-blend-screen" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>

      <div className="relative w-full max-w-md z-10 animate-in slide-in-from-bottom-5 duration-700 fade-in">
        <div className="bg-slate-900/60 backdrop-blur-xl rounded-[2rem] p-8 md:p-10 shadow-2xl border border-white/10 relative overflow-hidden group/card">

          {/* Top sheen */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

          {/* Logo */}
          <div className="flex flex-col items-center justify-center mb-10 group/logo cursor-default">
            <div className="relative mb-4 transition-transform duration-500 group-hover/logo:scale-110">
              <div className="absolute inset-0 bg-orange-500/20 blur-xl rounded-full group-hover/logo:bg-orange-500/30 transition-colors"></div>
              <FlameIcon
                className="w-10 h-10 drop-shadow-[0_0_15px_rgba(249,115,22,0.5)]"
                gradientId="flameGradient_login"
              />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight italic flex items-center gap-2">
              STREAK
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-400">
                BASE
              </span>
            </h1>
            <p className="text-slate-500 text-sm font-medium mt-2">Welcome back, Legend.</p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-200 p-4 rounded-xl mb-6 text-sm flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="flex flex-col gap-5">
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
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
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
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full py-4 pl-12 pr-4 rounded-xl bg-slate-950/50 text-white border border-slate-700/50 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all placeholder:text-slate-700 text-sm [&:-webkit-autofill]:shadow-[0_0_0_1000px_#020617_inset] [&:-webkit-autofill]:-webkit-text-fill-color-white"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                disabled={loading}
                className="group relative w-full py-4 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 text-white font-bold text-lg shadow-lg shadow-orange-900/20 hover:shadow-orange-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 overflow-hidden"
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                <div className="relative flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRightIcon />
                    </>
                  )}
                </div>
              </button>
            </div>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-slate-500 text-sm font-medium">
              Don't have an account?{' '}
              <Link to="/register" className="text-orange-400 hover:text-orange-300 font-bold hover:underline decoration-2 underline-offset-4 transition-colors">
                Create one
              </Link>
            </p>
          </div>
        </div>

        <div className="text-center mt-6 opacity-30 hover:opacity-100 transition-opacity duration-500">
          <p className="text-[10px] text-slate-400 uppercase tracking-widest">Streak Base v2.0</p>
        </div>
      </div>
    </div>
  )
}