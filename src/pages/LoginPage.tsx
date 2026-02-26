import { Link } from 'react-router-dom'
import { useLogin } from '../hooks/useLogin'

// A custom SVG Flame component for a sharper, more professional look than an emoji
const FlameIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_0_10px_rgba(249,115,22,0.3)]">
    <path 
      d="M8.5 14.5C7.5 13 7 11.5 7 9.5C7 6 9.5 3 12 2C14.5 3 17 6 17 9.5C17 11.5 16.5 13 15.5 14.5C17 15.5 18 17.5 18 19.5C18 21.5 16 23 14 23C13 23 11.5 22 12 20C12.5 18 14 16.5 14.5 15.5C13.5 15 12 14 10.5 15.5C9 17 8.5 18.5 8 20C7.5 21.5 6 23 4 23C2 23 0 21.5 0 19.5C0 17.5 1 15.5 2.5 14.5C1.5 13 1 11.5 1 9.5C1 4 6 0 12 0C18 0 23 4 23 9.5C23 11.5 22.5 13 21.5 14.5C23 15.5 24 17.5 24 19.5C24 22.5 21 24 18 24C15.5 24 14 22.5 14 21.5C14 22.5 12.5 24 10 24C7 24 4 22.5 4 19.5C4 17.5 5 15.5 6.5 14.5C5.5 13 5 11.5 5 9.5C5 6.5 7 4.5 8.5 3.5C7.5 5.5 7 7.5 7 9.5C7 11.5 7.5 13 8.5 14.5Z" 
      fill="url(#flameGradient_login)"
    />
    {/* Defining the gradient within the SVG so the icon itself is a gradient */}
    <defs>
      <linearGradient id="flameGradient_login" x1="12" y1="0" x2="12" y2="24" gradientUnits="userSpaceOnUse">
        <stop stopColor="#f97316" /> {/* orange-500 */}
        <stop offset="1" stopColor="#fbbf24" /> {/* amber-400 */}
      </linearGradient>
    </defs>
  </svg>
)

export default function LoginPage() {
  const { formData, error, loading, handleChange, handleLogin } = useLogin()

  return (
    <div className="relative min-h-screen bg-[#0f172a] flex items-center justify-center p-4 overflow-hidden">
      
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-500/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />

      <div className="relative w-full max-w-md z-10">
        <div className="bg-slate-800/40 backdrop-blur-2xl rounded-3xl p-10 shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/10">
          
          {/* ---- NEW LOGO AREA START ---- */}
          <div className="flex flex-col items-center justify-center mb-10">
            <div className="flex items-center gap-3 mb-2">
               {/* Custom SVG Icon instead of emoji */}
              <FlameIcon />
              <h1 className="text-3xl font-black text-white tracking-tight">
                Streak
                {/* Gradient text effect for the second half of the word */}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-400">
                  Base
                </span>
              </h1>
            </div>
            <p className="text-slate-400 font-medium">Ignite your potential.</p>
          </div>
          {/* ---- NEW LOGO AREA END ---- */}


          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl mb-6 text-sm animate-pulse">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <div>
              <label className="text-slate-300 text-xs font-bold uppercase tracking-widest ml-1 mb-2 block">Email Address</label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                className="w-full p-4 rounded-xl bg-slate-900/50 text-white border border-slate-700/50 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all placeholder:text-slate-600"
              />
            </div>

            <div>
              <label className="text-slate-300 text-xs font-bold uppercase tracking-widest ml-1 mb-2 block">Password</label>
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full p-4 rounded-xl bg-slate-900/50 text-white border border-slate-700/50 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all placeholder:text-slate-600"
              />
            </div>

            <button
              disabled={loading}
              className="group relative w-full py-4 rounded-xl bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-bold text-lg shadow-[0_10px_20px_-10px_rgba(249,115,22,0.5)] transition-all active:scale-[0.98] disabled:opacity-50 mt-4 overflow-hidden"
            >
              <span className="relative z-10">{loading ? 'Verifying...' : 'Sign In'}</span>
              <div className="absolute inset-0 bg-white/20 translate-y-[100%] group-hover:translate-y-[0%] transition-transform duration-300" />
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-white/5 text-center">
            <p className="text-slate-400 text-sm">
              New to the base?{' '}
              <Link to="/register" className="text-orange-400 hover:text-orange-300 font-bold decoration-2 underline-offset-4 hover:underline transition-all">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}